import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8d4aec83`;

const authHeaders = () => ({
  Authorization: `Bearer ${publicAnonKey}`,
});

export type Variant = {
  size: string;
  color: string;
  stock: number;
  price?: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: "men" | "women" | "kids" | "unisex"; // <-- NEW: Added unisex
  subcategory: string;
  brand: string;
  price: number;
  bulkPricing?: { minQty: number; price: number }[];
  imageUrl: string;
  images?: string[];
  variants: Variant[];
  createdAt: string;
};

export type Order = {
  id: string;
  customer: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

async function handle<T>(res: Response, ctx: string): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`API error in ${ctx}: ${res.status} ${text}`);
    throw new Error(`${ctx} failed: ${res.status} ${text}`);
  }
  return res.json();
}

function packMetadata(product: Partial<Product>): Partial<Product> {
  const payload = { ...product };
  payload.variants = payload.variants || [];
  payload.variants = payload.variants.filter(v => v.size !== "__META__");
  
  payload.variants.push({
    size: "__META__",
    color: JSON.stringify({
      images: payload.images || [payload.imageUrl],
      bulkPricing: payload.bulkPricing || []
    }),
    stock: 0
  });
  return payload;
}

function unpackMetadata(product: Product): Product {
  const metaVariant = product.variants?.find(v => v.size === "__META__");
  if (metaVariant) {
    try {
      const meta = JSON.parse(metaVariant.color);
      product.images = meta.images || [product.imageUrl];
      product.bulkPricing = meta.bulkPricing || [];
    } catch (e) {
      product.images = [product.imageUrl];
      product.bulkPricing = [];
    }
    product.variants = product.variants.filter(v => v.size !== "__META__");
  } else {
    product.images = product.images || [product.imageUrl];
    product.bulkPricing = product.bulkPricing || [];
  }
  return product;
}

export async function listProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE}/products`, { headers: authHeaders(), cache: 'no-store' });
  const data = await handle<{ products: Product[] }>(res, "listProducts");
  return (data.products || []).map(unpackMetadata);
}

export async function createProduct(p: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(packMetadata(p)),
  });
  const data = await handle<{ product: Product }>(res, "createProduct");
  return unpackMetadata(data.product);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const existingProducts = await listProducts();
  const existing = existingProducts.find(p => p.id === id);
  if (!existing) throw new Error("Product not found");

  const fullUpdate = { ...existing, ...patch, id };

  const res = await fetch(`${BASE}/products`, {
    method: "POST", 
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(packMetadata(fullUpdate)),
  });
  const data = await handle<{ product: Product }>(res, "updateProduct");
  return unpackMetadata(data.product);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE}/products/${id}`, { method: "DELETE", headers: authHeaders() });
  await handle(res, "deleteProduct");
}

export async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${BASE}/upload`, { method: "POST", headers: authHeaders(), body: fd });
  return handle<{ url: string; path: string }>(res, "uploadImage");
}

export async function listOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE}/orders`, { headers: authHeaders() });
  const data = await handle<{ orders: Order[] }>(res, "listOrders");
  return data.orders || [];
}

export async function createOrder(o: Partial<Order>): Promise<Order> {
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(o),
  });
  const data = await handle<{ order: Order }>(res, "createOrder");
  return data.order;
}

export async function seedProducts(force = false): Promise<{ created?: number; skipped?: boolean }> {
  const res = await fetch(`${BASE}/seed${force ? "?force=1" : ""}`, { method: "POST", headers: authHeaders() });
  return handle(res, "seedProducts");
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order> {
  const res = await fetch(`${BASE}/orders/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const data = await handle<{ order: Order }>(res, "updateOrder");
  return data.order;
}