import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
// Ensure your kv file is named exactly like this in the folder:
import * as kv from "./kv_store.ts"; 

const app = new Hono();

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Pointing to your public images bucket
const BUCKET = "images";

// Ensure storage bucket exists on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      // Ensuring it forces public visibility if it creates it
      await supabase.storage.createBucket(BUCKET, { public: true });
      console.log(`Created bucket ${BUCKET}`);
    }
  } catch (e) {
    console.log(`Bucket init error: ${e}`);
  }
})();

app.get("/server/health", (c) => c.json({ status: "ok" }));

// Upload a product image.
app.post("/server/upload", async (c) => {
  try {
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return c.json({ error: "No file provided in upload request" }, 400);
    }
    const ext = file.name.split(".").pop() || "png";
    const path = `${crypto.randomUUID()}.${ext}`;
    const buf = new Uint8Array(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, buf, { contentType: file.type, upsert: false });
    
    if (upErr) {
      console.log(`Storage upload error for ${path}: ${upErr.message}`);
      return c.json({ error: `Upload failed: ${upErr.message}` }, 500);
    }
    
    // Use getPublicUrl instead of SignedURL for permanent public visibility
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    
    return c.json({ path, url: publicUrlData.publicUrl });
  } catch (e) {
    console.log(`Upload route error: ${e}`);
    return c.json({ error: `Upload route error: ${e}` }, 500);
  }
});

// Products
app.get("/server/products", async (c) => {
  try {
    const items = await kv.getByPrefix("product:");
    return c.json({ products: items });
  } catch (e) {
    console.log(`List products error: ${e}`);
    return c.json({ error: `List products error: ${e}` }, 500);
  }
});

// Create Product
app.post("/server/products", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const product = {
      id,
      name: body.name,
      description: body.description || "",
      category: body.category, 
      subcategory: body.subcategory || "",
      brand: body.brand || "",
      price: Number(body.price) || 0,
      imageUrl: body.imageUrl || "",
      images: Array.isArray(body.images) ? body.images : [body.imageUrl || ""],
      bulkPricing: Array.isArray(body.bulkPricing) ? body.bulkPricing : [],
      variants: Array.isArray(body.variants) ? body.variants : [],
      createdAt: body.createdAt || new Date().toISOString(),
    };
    await kv.set(`product:${id}`, product);
    return c.json({ product });
  } catch (e) {
    console.log(`Create product error: ${e}`);
    return c.json({ error: `Create product error: ${e}` }, 500);
  }
});

// Edit Product
app.put("/server/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`product:${id}`);
    if (!existing) return c.json({ error: "Product not found" }, 404);
    
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`product:${id}`, updated);
    
    return c.json({ product: updated });
  } catch (e) {
    console.log(`Update product error: ${e}`);
    return c.json({ error: `Update product error: ${e}` }, 500);
  }
});

app.delete("/server/products/:id", async (c) => {
  try {
    await kv.del(`product:${c.req.param("id")}`);
    return c.json({ ok: true });
  } catch (e) {
    console.log(`Delete product error: ${e}`);
    return c.json({ error: `Delete product error: ${e}` }, 500);
  }
});

// Orders
app.get("/server/orders", async (c) => {
  try {
    const items = await kv.getByPrefix("order:");
    return c.json({ orders: items });
  } catch (e) {
    console.log(`List orders error: ${e}`);
    return c.json({ error: `List orders error: ${e}` }, 500);
  }
});

app.post("/server/orders", async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || crypto.randomUUID();
    const order = {
      id,
      customer: body.customer || "Guest",
      items: body.items || [],
      total: Number(body.total) || 0,
      status: body.status || "pending",
      createdAt: body.createdAt || new Date().toISOString(),
    };
    await kv.set(`order:${id}`, order);
    return c.json({ order });
  } catch (e) {
    console.log(`Create order error: ${e}`);
    return c.json({ error: `Create order error: ${e}` }, 500);
  }
});

app.put("/server/orders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`order:${id}`);
    if (!existing) return c.json({ error: "Order not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`order:${id}`, updated);
    return c.json({ order: updated });
  } catch (e) {
    console.log(`Update order error: ${e}`);
    return c.json({ error: `Update order error: ${e}` }, 500);
  }
});

// Seed sample products
app.post("/server/seed", async (c) => {
  try {
    const force = c.req.query("force") === "1";
    const existing = await kv.getByPrefix("product:");
    if (existing.length > 0 && !force) {
      return c.json({ skipped: true, count: existing.length });
    }
    if (force) {
      for (const p of existing) {
        await kv.del(`product:${p.id}`);
      }
    }
    const sample = SAMPLE_PRODUCTS();
    for (const p of sample) {
      await kv.set(`product:${p.id}`, p);
    }
    return c.json({ created: sample.length });
  } catch (e) {
    console.log(`Seed error: ${e}`);
    return c.json({ error: `Seed error: ${e}` }, 500);
  }
});

function SAMPLE_PRODUCTS() {
  const img = (id: string) =>
    `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;
  const v = (sizes: string[], colors: string[], stock = 12) =>
    sizes.flatMap((s) => colors.map((c) => ({ size: s, color: c, stock })));
  const SIZES = ["S", "M", "L", "XL"];
  const data: any[] = [
    { name: "Classic Black Tee", category: "men", subcategory: "T-Shirts", brand: "Nike", price: 29.99, imageUrl: img("1521572163474-6864f9cf17ab"), variants: v(SIZES, ["Black", "White", "Grey"]) },
    { name: "Slim Fit Denim Jeans", category: "men", subcategory: "Jeans", brand: "Levi's", price: 79.99, imageUrl: img("1542272604-787c3835535d"), variants: v(SIZES, ["Blue", "Black"]) },
    { name: "Leather Bomber Jacket", category: "men", subcategory: "Jackets", brand: "Zara", price: 199.99, imageUrl: img("1551028719-00167b16eac5"), variants: v(["M", "L", "XL"], ["Black", "Brown"]) }
  ];
  return data.map((d) => ({
    ...d,
    id: crypto.randomUUID(),
    description: `Premium quality ${d.name.toLowerCase()} from ${d.brand}. Crafted with care for everyday luxury.`,
    createdAt: new Date().toISOString(),
  }));
}

Deno.serve(app.fetch);