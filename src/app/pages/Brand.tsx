import { useParams, Link } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../lib/products";
import { BRANDS } from "../lib/catalog";

export default function Brand() {
  const { name } = useParams<{ name: string }>();
  const { products, loading } = useProducts();
  const decoded = decodeURIComponent(name || "");
  const brand = BRANDS.find((b) => b.name === decoded);
  const items = products.filter((p) => p.brand === decoded);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-xs text-neutral-500 mb-4 tracking-widest uppercase">
        <Link to="/" className="hover:text-amber-400">Home</Link> / <span className="text-amber-400">{decoded}</span>
      </nav>
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl p-12 mb-10 flex items-center gap-8">
        {brand && (
          <div className="w-32 h-32 bg-white/5 rounded-xl flex items-center justify-center p-6 shrink-0">
            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain brightness-0 invert" />
          </div>
        )}
        <div>
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">Featured Brand</p>
          <h1 className="font-display text-5xl mb-2">{decoded}</h1>
          <p className="text-neutral-400">{items.length} products available</p>
        </div>
      </div>

      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-neutral-400">No products from {decoded} yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p) => (<ProductCard key={p.id} p={p} />))}
        </div>
      )}
    </div>
  );
}
