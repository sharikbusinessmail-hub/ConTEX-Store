import { Link } from "react-router";
import { Heart } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { useCart } from "../lib/cart";
import { useProducts } from "../lib/products";

export default function Wishlist() {
  const { wishlist } = useCart();
  const { products } = useProducts();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-xl">
          <Heart className="w-12 h-12 mx-auto text-neutral-700 mb-3" />
          <p className="text-neutral-400 mb-4">Your wishlist is empty.</p>
          <Link to="/explore">
            <Button className="bg-amber-400 hover:bg-amber-500 text-black">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p) => (<ProductCard key={p.id} p={p} />))}
        </div>
      )}
    </div>
  );
}
