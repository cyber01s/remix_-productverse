import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let db: admin.firestore.Firestore | null = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: config.projectId,
      });
    }
    db = admin.firestore(config.firestoreDatabaseId);
    console.log("Firebase Admin initialized successfully.");
  } else {
    // Fallback to environment variables if config file is missing (common on Vercel)
    if (process.env.FIREBASE_PROJECT_ID) {
      if (admin.apps.length === 0) {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      }
      db = admin.firestore(process.env.FIREBASE_DATABASE_ID || undefined);
    }
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

const app = express();
const PORT = 3000;

async function startServer() {
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Dedicated Cron Cleanup Route - Scheduled via vercel.json
  app.get("/api/cron/cleanup", async (req, res) => {
    // Basic security: Check for a secret header or just rely on Vercel's internal cron protection
    // Vercel populates 'x-vercel-cron' header for cron requests
    if (process.env.NODE_ENV === 'production' && req.headers['x-vercel-cron'] !== '1') {
      // Allow only if it has the vercel cron header in production
      // return res.status(401).json({ error: "Unauthorized" });
    }

    if (!db) return res.status(500).json({ error: "Persistence layer (Firestore) not initialized. Ensure FIREBASE_PROJECT_ID is set." });
    
    try {
      console.log("CRON: Starting strategic cache cleanup...");
      const now = Date.now();
      const expired = await db.collection("search_cache")
        .where("expiresAt", "<", now)
        .limit(200)
        .get();

      if (expired.empty) {
        return res.json({ status: "success", message: "Cache set is already lean. No expired entries found." });
      }

      const batch = db.batch();
      expired.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      console.log(`CRON: Successfully purged ${expired.size} expired entries.`);
      res.json({ status: "success", purged: expired.size, timestamp: new Date().toISOString() });
    } catch (e) {
      console.error("CRON: Cleanup failed:", e);
      res.status(500).json({ error: "Internal Cleanup Failure" });
    }
  });

  const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
  const IMPACT_AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;

  // Local fallback cache
  let localCache: Record<string, { items: any[], expires: number }> = {};

  const CACHE_TTL = 3600 * 24 * 1000; // 24 hours

  async function getFromCache(key: string): Promise<any[] | null> {
    try {
      // 1. Check local memory first
      if (localCache[key] && localCache[key].expires > Date.now()) {
        return localCache[key].items;
      }

      // 2. Check Firestore
      if (db) {
        const doc = await db.collection("search_cache").doc(key).get();
        if (doc.exists) {
          const data = doc.data();
          if (data && data.expiresAt > Date.now()) {
            // Update local memory
            localCache[key] = { items: data.results, expires: data.expiresAt };
            return data.results;
          }
        }
      }
    } catch (e) {
      console.warn("Cache read error:", e);
    }
    return null;
  }

  async function setToCache(key: string, results: any[]) {
    const expiresAt = Date.now() + CACHE_TTL;
    const createdAt = Date.now();
    
    // Update local memory
    localCache[key] = { items: results, expires: expiresAt };

    // Update Firestore
    if (db) {
      try {
        await db.collection("search_cache").doc(key).set({
          queryKey: key,
          results,
          expiresAt,
          createdAt
        });

        // Strategic cleanup: 1 in 20 writes triggers a cleanup of old entries
        if (Math.random() < 0.05) {
          const oldEntries = await db.collection("search_cache")
            .where("expiresAt", "<", Date.now())
            .limit(50)
            .get();
          
          const batch = db.batch();
          oldEntries.docs.forEach(doc => batch.delete(doc.ref));
          await batch.commit();
          console.log(`Cleaned up ${oldEntries.size} expired cache entries.`);
        }
      } catch (e) {
        console.warn("Cache write error:", e);
      }
    }
  }

  // Impact.com Product Proxy
  app.get("/api/products", async (req, res) => {
    try {
      const { q, category, page } = req.query;
      
      const cacheKey = `search_${q || 'all'}_${category || 'all'}_${page || 1}`;
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json({ Items: cached });
      }

      if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) {
        throw new Error("Missing Impact API credentials in environment variables.");
      }

      const auth = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString('base64');
      const fetchOpts = {
        headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
      };

      const currentPage = parseInt(page as string) || 1;
      const pageSize = 20;
      const pageItemStart = (currentPage - 1) * pageSize + 1;

      // 1. Fetch available catalogs
      const catResponse = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs?PageSize=10`, fetchOpts);
      if (!catResponse.ok) {
         throw new Error(`Failed to fetch catalogs: ${catResponse.status} ${await catResponse.text()}`);
      }
      
      const catData = await catResponse.json();
      const catalogs = catData.Catalogs || [];
      const allItems: any[] = [];

      // 2. Fetch items from fewer catalogs in parallel to prevent Vercel timeouts (Free tier limit is usually ~10s)
      let searchTerm = (q as string) || "";
      if (category && category !== 'all') {
        searchTerm = searchTerm ? `${searchTerm} ${category}` : (category as string);
      }

      const searchQuery = searchTerm ? `&SearchTerm=${encodeURIComponent(searchTerm)}` : "";
      const paginationQuery = `&PageSize=${pageSize}&PageItemStart=${pageItemStart}`;

      const catalogItems = await Promise.all(
        catalogs.slice(0, 3).map(async (catalog: any) => {
          try {
            const itemRes = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?${paginationQuery}${searchQuery}`, fetchOpts);
            if (itemRes.ok) {
              const iData = await itemRes.json();
              return iData.Items || [];
            }
          } catch (err) {
            console.warn(`Failed to fetch items for catalog ${catalog.Id}`, err);
          }
          return [];
        })
      );

      allItems.push(...catalogItems.flat());

      const validItems = allItems.filter(item => item.ImageUrl);

      const seen = new Set();
      const uniqueItems = validItems.filter(item => {
        const id = item.Id || item.id;
        const duplicate = seen.has(id);
        seen.add(id);
        return !duplicate;
      });

      await setToCache(cacheKey, uniqueItems);

      return res.json({ Items: uniqueItems });
    } catch (e) {
      console.error("Error fetching from Impact API:", e);
      res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const cacheKey = `product_${id}`;
      const cached = await getFromCache(cacheKey);
      if (cached && cached.length > 0) {
        return res.json(cached[0]);
      }

      if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) {
        throw new Error("Missing Impact API credentials");
      }

      const auth = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString('base64');
      const fetchOpts = {
        headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
      };

      const catResponse = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs?PageSize=10`, fetchOpts);
      const catData = await catResponse.json();
      const catalogs = catData.Catalogs || [];

      const productResults = await Promise.all(
        catalogs.map(async (catalog: any) => {
          try {
            const itemRes = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?SearchTerm=${encodeURIComponent(id)}`, fetchOpts);
            if (itemRes.ok) {
              const iData = await itemRes.json();
              return (iData.Items || []).find((p: any) => (p.Id || p.id) === id);
            }
          } catch (e) {
            console.warn(`Catalog ${catalog.Id} search error:`, e);
          }
          return null;
        })
      );

      const item = productResults.find(p => p !== null);
      if (item) {
        await setToCache(cacheKey, [item]);
        return res.json(item);
      }

      return res.status(404).json({ error: "Product not found across catalogs" });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.post("/api/clicks", (req, res) => {
    console.log("Click logged:", req.body);
    res.json({ success: true });
  });

  // Impact.com Webhook Placeholder
  app.post("/api/webhooks/impact", (req, res) => {
    console.log("Impact.com Webhook received:", req.body);
    // TODO: Validate HMAC and process conversion
    res.status(200).send("OK");
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
