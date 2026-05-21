import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { listProducts, Product, seedProducts } from "./api";

type Ctx = {
  products: Product[];
  loading: boolean;
  refresh: () => Promise<void>;
  error: string | null;
};

const C = createContext<Ctx | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let list = await listProducts();
      if (list.length === 0) {
        try {
          await seedProducts();
          list = await listProducts();
        } catch (e) {
          console.error("Seed failed, continuing with empty list", e);
        }
      }
      setProducts(list);
    } catch (e: any) {
      console.error("Failed to load products", e);
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <C.Provider value={{ products, loading, refresh, error }}>{children}</C.Provider>;
}

export function useProducts() {
  const v = useContext(C);
  if (!v) throw new Error("useProducts must be used inside ProductsProvider");
  return v;
}
