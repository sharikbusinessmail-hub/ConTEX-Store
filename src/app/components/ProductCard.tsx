import { Link } from "react-router";
import { Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "../lib/api";
import { useCart } from "../lib/cart";

const formatLKR = (amount: number) => {
  return amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function ProductCard({ p }: { p: Product }) {
  const { wishlist, toggleWishlist } = useCart();
  const liked = wishlist.includes(p.id);
  
  const hasBulkPricing = p.bulkPricing && p.bulkPricing.length > 0;
  
  let priceDisplay;
  if (hasBulkPricing) {
    const minPrice = Math.min(...p.bulkPricing!.map(tier => tier.price));
    const maxPrice = p.price;
    
    priceDisplay = (
      <div className="flex flex-col mt-1">
        <span className="text-[10px] text-neutral-400 uppercase tracking-widest mb-0.5">Bulk orders from</span>
        <span className="text-sm font-semibold text-amber-400">
          LKR {minPrice.toLocaleString('en-LK')} - {maxPrice.toLocaleString('en-LK')}
        </span>
      </div>
    );
  } else {
    priceDisplay = (
      <span className="text-sm font-semibold text-white mt-1 block">
        LKR {formatLKR(p.price)}
      </span>
    );
  }

  const displayImage = (p.images && p.images.length > 0) ? p.images[0] : p.imageUrl;

  // NEW: Extract unique colors from variants to render color balls
  const colors = Array.from(new Set(p.variants?.map((v) => v.color).filter(Boolean)));

  return (
    <div className="group">
      <div className="relative aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden mb-3">
        <Link to={`/product/${p.id}`}>
          <ImageWithFallback
            src={displayImage}
            alt={p.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(p.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition"
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-amber-400 text-amber-400" : "text-white"}`} />
        </button>

        {hasBulkPricing && (
          <span className="absolute top-3 left-3 bg-amber-400 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest shadow-lg">
            WHOLESALE
          </span>
        )}
      </div>
      
      <Link to={`/product/${p.id}`} className="block">
        <p className="text-[10px] tracking-[0.2em] uppercase text-amber-400 mb-1">{p.brand}</p>
        <h3 className="text-sm text-white mb-1 group-hover:text-amber-400 transition truncate">{p.name}</h3>
        {priceDisplay}
        
        {/* NEW: Render the Color Balls */}
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {colors.map(colorName => (
              <div 
                key={colorName} 
                title={colorName}
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ 
                  // Strip spaces so "Light Blue" becomes "lightblue" which CSS understands
                  backgroundColor: colorName.toLowerCase().replace(/\s/g, '') 
                }}
              />
            ))}
          </div>
        )}
      </Link>
    </div>
  );
}