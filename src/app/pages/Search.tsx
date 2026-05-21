import { useSearchParams } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../lib/products";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const { products } = useProducts();
  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q),
  );
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-2">Search results</h1>
      <p className="text-neutral-400 mb-8">{results.length} results for "{q}"</p>
      {results.length === 0 ? (
        <p className="text-neutral-400">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {results.map((p) => (<ProductCard key={p.id} p={p} />))}
        </div>
      )}
    </div>
  );
}
