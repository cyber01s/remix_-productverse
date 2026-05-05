import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const IMPACT_ACCOUNT_SID = process.env.IMPACT_ACCOUNT_SID;
  const IMPACT_AUTH_TOKEN = process.env.IMPACT_AUTH_TOKEN;

  let productCache: any[] = [];
  let cacheTime = 0;

  // Impact.com Product Proxy
  app.get("/api/products", async (req, res) => {
    try {
      const { q, category, page } = req.query;
      
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

      // Only use cache if no search query OR category OR page is provided
      if (!q && (!category || category === 'all') && currentPage === 1 && productCache.length > 0 && Date.now() - cacheTime < 3600 * 1000) {
        return res.json({ Items: productCache });
      }

      // 1. Fetch available catalogs
      const catResponse = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs?PageSize=10`, fetchOpts);
      if (!catResponse.ok) {
         throw new Error(`Failed to fetch catalogs: ${catResponse.status} ${await catResponse.text()}`);
      }
      
      const catData = await catResponse.json();
      const catalogs = catData.Catalogs || [];
      const allItems: any[] = [];

      // 2. Fetch items from catalogs
      // Constructing search term from query and category
      let searchTerm = (q as string) || "";
      if (category && category !== 'all') {
        searchTerm = searchTerm ? `${searchTerm} ${category}` : (category as string);
      }

      const searchQuery = searchTerm ? `&SearchTerm=${encodeURIComponent(searchTerm)}` : "";
      const paginationQuery = `&PageSize=${pageSize}&PageItemStart=${pageItemStart}`;

      for (const catalog of catalogs.slice(0, 4)) {
        try {
          const itemRes = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?${paginationQuery}${searchQuery}`, fetchOpts);
          if (itemRes.ok) {
            const iData = await itemRes.json();
            if (iData.Items && Array.isArray(iData.Items)) {
               allItems.push(...iData.Items);
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch items for catalog ${catalog.Id}`, err);
        }
      }

      // Filter out products with no images
      const validItems = allItems.filter(item => item.ImageUrl);

      // Unique items by Id
      const seen = new Set();
      const uniqueItems = validItems.filter(item => {
        const duplicate = seen.has(item.Id);
        seen.add(item.Id);
        return !duplicate;
      });

      if (!q) {
        productCache = uniqueItems;
        cacheTime = Date.now();
      }

      return res.json({ Items: uniqueItems });
    } catch (e) {
      console.error("Error fetching from Impact API:", e);
      res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // 1. Check cache first
      if (productCache.length > 0) {
        const product = productCache.find(p => p.Id === id);
        if (product) return res.json(product);
      }

      // 2. If not in cache, we need to find which catalog it belongs to, or search for it
      // Since we don't know the catalog, we search for the specific ID as a SearchTerm
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

      for (const catalog of catalogs) {
        const itemRes = await fetch(`https://api.impact.com/Mediapartners/${IMPACT_ACCOUNT_SID}/Catalogs/${catalog.Id}/Items?SearchTerm=${encodeURIComponent(id)}`, fetchOpts);
        if (itemRes.ok) {
          const iData = await itemRes.json();
          const item = (iData.Items || []).find((p: any) => p.Id === id);
          if (item) return res.json(item);
        }
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
