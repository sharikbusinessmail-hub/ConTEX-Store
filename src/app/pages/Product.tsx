import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useProducts } from "../lib/products";
import { useCart } from "../lib/cart";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

const formatLKR = (amount: number) => {
  return amount.toLocaleString('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading, refresh } = useProducts();
  
  // FIXED: We now import 'add' to perfectly match your cart.tsx file
  const { add, wishlist, toggleWishlist } = useCart();
  
  const [activeImg, setActiveImg] = useState(0); 
  const [variantQtys, setVariantQtys] = useState<Record<number, number>>({});

  useEffect(() => {
    refresh();
  }, [refresh, id]);

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);
  const liked = product ? wishlist.includes(product.id) : false;

  if (loading) return <div className="py-32 text-center text-neutral-400">Loading product...</div>;
  if (!product) return <div className="py-32 text-center"><h1 className="text-4xl mb-4 text-white">Product not found</h1><Button onClick={() => navigate(-1)} variant="outline">Go Back</Button></div>;

  const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl];

  const totalQty = Object.values(variantQtys).reduce((sum, q) => sum + q, 0);

  const currentPrice = (() => {
    if (!product.bulkPricing || product.bulkPricing.length === 0) return product.price;
    const applicableTier = [...product.bulkPricing].sort((a, b) => b.minQty - a.minQty).find(tier => totalQty >= tier.minQty);
    return applicableTier ? applicableTier.price : product.price;
  })();

  const handleQtyChange = (index: number, delta: number) => {
    setVariantQtys(prev => {
      const current = prev[index] || 0;
      return { ...prev, [index]: Math.max(0, current + delta) };
    });
  };

  function handleAddToCart() {
    if (totalQty === 0) return toast.error("Please select at least one item quantity.");
    
    // FIXED: Using the correct 'add' function
    Object.entries(variantQtys).forEach(([idxStr, qty]) => {
      if (qty > 0) {
        const v = product!.variants[parseInt(idxStr)];
        add(
          { ...product!, price: currentPrice }, // Apply the discounted price
          v.size, 
          v.color, 
          qty
        );
      }
    });
    toast.success(`${totalQty} items added to cart at LKR ${formatLKR(currentPrice)} ea.`);
    setVariantQtys({}); // Reset selection
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-xs text-neutral-400 hover:text-amber-400 mb-8 uppercase tracking-widest transition">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-neutral-900 rounded-xl overflow-hidden border border-white/5">
            <ImageWithFallback src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            {product.bulkPricing && product.bulkPricing.length > 0 && <Badge className="absolute top-4 left-4 bg-amber-400 text-black text-xs px-3 py-1 font-bold tracking-widest shadow-lg">WHOLESALE</Badge>}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImg(idx)} className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors duration-300 ${activeImg === idx ? 'border-amber-400' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="py-4">
          <div className="mb-8">
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-3">{product.brand}</p>
            <h1 className="font-display text-4xl lg:text-5xl text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex flex-col gap-1 mb-6">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-amber-400">LKR {formatLKR(currentPrice)}</p>
                {totalQty > 1 && currentPrice < product.price && <span className="text-lg text-neutral-500 line-through">LKR {formatLKR(product.price)}</span>}
              </div>
              {totalQty > 1 && currentPrice < product.price && <p className="text-emerald-400 text-sm font-medium">✨ Bulk discount applied for {totalQty} items!</p>}
            </div>

            {product.bulkPricing && product.bulkPricing.length > 0 && (
              <div className="mb-8 p-4 bg-amber-400/5 border border-amber-400/20 rounded-xl space-y-2">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-400 mb-3 font-bold">Volume Pricing</h4>
                <div className="flex justify-between text-sm text-neutral-300 border-b border-white/5 pb-2">
                  <span>1 - {product.bulkPricing.sort((a,b) => a.minQty - b.minQty)[0].minQty - 1} pieces</span>
                  <span className="font-medium text-white">LKR {formatLKR(product.price)} / ea</span>
                </div>
                {product.bulkPricing.sort((a, b) => a.minQty - b.minQty).map((tier, idx, arr) => (
                  <div key={idx} className="flex justify-between text-sm text-neutral-300 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span>{tier.minQty}{arr[idx + 1] ? ` - ${arr[idx + 1].minQty - 1}` : '+'} pieces</span>
                    <span className="font-medium text-amber-400">LKR {formatLKR(tier.price)} / ea</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-neutral-400 leading-relaxed text-sm">{product.description}</p>
          </div>

          <div className="space-y-4 mb-8 border-t border-white/10 pt-8">
            <h4 className="text-xs uppercase tracking-widest text-neutral-400">Select Quantities</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {product.variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-neutral-900 border border-white/10 rounded-lg">
                  <div>
                    <span className="block font-bold text-white text-sm">{v.size}</span>
                    <span className="text-xs text-neutral-400">{v.color}</span>
                  </div>
                  <div className="flex items-center w-28 h-10 border border-white/20 rounded-full bg-neutral-950">
                    <button onClick={() => handleQtyChange(i, -1)} className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-amber-400 transition"><Minus className="w-3 h-3" /></button>
                    <span className="flex-1 text-center font-medium text-white">{variantQtys[i] || 0}</span>
                    <button onClick={() => handleQtyChange(i, 1)} className="w-8 h-full flex items-center justify-center text-neutral-400 hover:text-amber-400 transition"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            {totalQty > 0 && <p className="text-right text-xs text-neutral-400">Total Items: <span className="text-amber-400 font-bold">{totalQty}</span></p>}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleAddToCart} className="flex-1 h-14 bg-amber-400 text-black hover:bg-amber-500 text-sm font-bold tracking-widest uppercase">
              <ShoppingBag className="w-5 h-5 mr-3" /> Add to Cart
            </Button>
            <Button onClick={() => toggleWishlist(product.id)} variant="outline" className={`w-14 h-14 border-white/20 ${liked ? "bg-amber-400/10 border-amber-400" : "hover:border-amber-400"}`}>
              <Heart className={`w-5 h-5 ${liked ? "fill-amber-400 text-amber-400" : "text-neutral-400"}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}