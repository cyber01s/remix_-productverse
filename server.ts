import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import fs from "fs";
import Redis from "ioredis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize persistence layers
let db: admin.firestore.Firestore | null = null;
let redis: Redis | null = null;

// Initialize Firebase Admin (Optional persistence)
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    if (admin.apps.length === 0) {
      admin.initializeApp({ projectId: config.projectId });
    }
    db = admin.firestore(config.firestoreDatabaseId);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    if (admin.apps.length === 0) {
      admin.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
    }
    db = admin.firestore();
  }
} catch (error) {
  console.error("Firebase Admin initialization skipped or failed:", error);
}

// Initialize Redis (Primary Cache)
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy: (times) => {
        if (times > 2) return null; // stop retrying after 2 attempts
        return 100;
      }
    });
    redis.on('error', (err) => console.warn('Redis Connection Error:', err.message));
    console.log("Redis cache ready.");
  } catch (err) {
    console.error("Redis init failed:", err);
  }
}

const app = express();
const PORT = 3000;

// Helper: Fetch with timeout
async function fetchWithTimeout(url: string, options: any = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function startServer() {
  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), redis: !!redis, firestore: !!db });
  });

  const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
  const IMPACT_AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;

  const CACHE_TTL_SECONDS = 3600 * 12; // 12 hours

  async function getFromCache(key: string): Promise<any[] | null> {
    try {
      // 1. Try Redis
      if (redis) {
        const data = await redis.get(key);
        if (data) return JSON.parse(data);
      }
      
      // 2. Try Firestore
      if (db) {
        const doc = await db.collection("search_cache").doc(key).get();
        if (doc.exists) {
          const data = doc.data();
          if (data && data.expiresAt > Date.now()) return data.results;
        }
      }
    } catch (e) {
      console.warn("Cache read error:", e);
    }
    return null;
  }

  async function setToCache(key: string, results: any[]) {
    try {
      // 1. Set to Redis
      if (redis) {
        await redis.set(key, JSON.stringify(results), "EX", CACHE_TTL_SECONDS);
      }

      // 2. Set to Firestore
      if (db) {
        await db.collection("search_cache").doc(key).set({
          queryKey: key,
          results,
          expiresAt: Date.now() + (CACHE_TTL_SECONDS * 1000),
          createdAt: Date.now()
        });
      }
    } catch (e) {
      console.warn("Cache write error:", e);
    }
  }

  app.get("/api/products", async (req, res) => {
    try {
      const { q, category, page } = req.query;
      const cacheKey = `v2_search_${q || 'all'}_${category || 'all'}_${page || 1}`;
      
      const cached = await getFromCache(cacheKey);
      if (cached) return res.json({ Items: cached });

      if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) {
        throw new Error("Missing Impact API credentials. Set IMPACT_ACCOUNT_SID and IMPACT_AUTH_TOKEN.");
      }

      const auth = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString('base64');
      const fetchOpts = {
        headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' }
      };

      const currentPage = parseInt(page as string) || 1;
      const pageSize = 15; // Slightly smaller page size for faster response
      const pageItemStart = (currentPage - 1) * pageSize + 1;

      // Fetch catalogs with cache
      const catCacheKey = "v2_catalogs_list";
      let catalogs = await getFromCache(catCacheKey);
      
      if (!catalogs) {
        const catRes = await fetchWithTimeout(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs?PageSize=5`, fetchOpts, 4000);
        if (catRes.ok) {
          const catData = await catRes.json();
          catalogs = catData.Catalogs || [];
          await setToCache(catCacheKey, catalogs!);
        }
      }

      if (!catalogs || catalogs.length === 0) {
        return res.json({ Items: [] });
      }

      let searchTerm = (q as string) || "";
      if (category && category !== 'all') {
        searchTerm = searchTerm ? `${searchTerm} ${category}` : (category as string);
      }

      const searchQuery = searchTerm ? `&SearchTerm=${encodeURIComponent(searchTerm)}` : "";
      const paginationQuery = `&PageSize=${pageSize}&PageItemStart=${pageItemStart}`;

      // Parallel fetch with strict timeouts to prevent Vercel Function Invocation Failure
      const catalogItems = await Promise.all(
        catalogs.slice(0, 3).map(async (catalog: any) => {
          try {
            const itemRes = await fetchWithTimeout(
              `https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?${paginationQuery}${searchQuery}`, 
              fetchOpts, 
              4000
            );
            if (itemRes.ok) {
              const iData = await itemRes.json();
              return iData.Items || [];
            }
          } catch (err) {
             console.log(`Bypassing slow catalog: ${catalog.Id}`);
          }
          return [];
        })
      );

      const allItems = catalogItems.flat().filter(item => item.ImageUrl);
      const uniqueItems = Array.from(new Map(allItems.map(item => [item.Id || item.id, item])).values());

      await setToCache(cacheKey, uniqueItems);
      return res.json({ Items: uniqueItems });
    } catch (e) {
      console.error("Discovery Failure:", e);
      res.status(500).json({ error: e instanceof Error ? e.message : "The discovery engine encountered a vector mismatch." });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const cacheKey = `v2_prod_${id}`;
      const cached = await getFromCache(cacheKey);
      if (cached && cached.length > 0) return res.json(cached[0]);

      if (!IMPACT_ACCOUNT_SID || !IMPACT_AUTH_TOKEN) throw new Error("Missing credentials");

      const auth = Buffer.from(`${IMPACT_ACCOUNT_SID}:${IMPACT_AUTH_TOKEN}`).toString('base64');
      const fetchOpts = { headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' } };

      const catRes = await fetchWithTimeout(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs?PageSize=5`, fetchOpts, 4000);
      const catData = await catRes.json();
      const catalogs = catData.Catalogs || [];

      const productResults = await Promise.all(
        catalogs.map(async (catalog: any) => {
          try {
            const itemRes = await fetchWithTimeout(
              `https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?SearchTerm=${encodeURIComponent(id)}`, 
              fetchOpts, 
              3000
            );
            if (itemRes.ok) {
              const iData = await itemRes.json();
              return (iData.Items || []).find((p: any) => (p.Id || p.id) === id);
            }
          } catch (e) {}
          return null;
        })
      );

      const item = productResults.find(p => p !== null);
      if (item) {
        await setToCache(cacheKey, [item]);
        return res.json(item);
      }
      return res.status(404).json({ error: "Product not found" });
    } catch (error) {
      res.status(500).json({ error: "Product retrieval failed" });
    }
  });

  app.post("/api/clicks", (req, res) => {
    res.json({ success: true });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
  }
}

startServer();
export default app;

