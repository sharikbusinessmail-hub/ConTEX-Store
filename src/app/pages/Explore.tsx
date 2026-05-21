import { useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../lib/products";

export default function Explore() {
  // Grab 'refresh' from your custom hook
  const { products, loading, refresh } = useProducts();

  // Force a fresh fetch every time the user opens the Explore page
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">All Products</p>
        <h1 className="font-display text-5xl">Explore the Collection</h1>
      </div>
      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (<ProductCard key={p.id} p={p} />))}
        </div>
      )}
    </div>
  );
}