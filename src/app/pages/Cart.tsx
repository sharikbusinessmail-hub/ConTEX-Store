import { Link, useNavigate } from "react-router";
import { Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useCart } from "../lib/cart";
import { createOrder } from "../lib/api";
import { toast } from "sonner";
import { useState } from "react";

const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

// IMPORTANT: Put your WhatsApp number here (Include country code, no '+')
const WHATSAPP_NUMBER = "94770000000"; 

export default function Cart() {
  const { items, total, setQty, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [placing, setPlacing] = useState(false);
  const nav = useNavigate();

  const shippingThreshold = 15000;
  const flatShippingRate = 1500;
  const shippingCost = total >= shippingThreshold ? 0 : flatShippingRate;
  const tax = total * 0.08;
  const grandTotal = total + shippingCost + tax;

  async function checkout() {
    if (items.length === 0) return;
    if (!name.trim()) {
      toast.error("Please enter your name to complete checkout");
      return;
    }
    setPlacing(true);
    
    try {
      // 1. Create a custom URL-safe order ID based on customer name
      const safeNameId = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const orderId = `${safeNameId}-${Math.floor(Math.random() * 1000)}`;

      // 2. Build the WhatsApp Invoice Message
      let msg = `*New Order from: ${name}*\n\n*Order Details:*\n`;
      items.forEach((i, idx) => {
        msg += `${idx + 1}. ${i.name}\n   - Size: ${i.size} | Color: ${i.color}\n   - ${i.qty} x ${formatCurrency(i.price)} = ${formatCurrency(i.qty * i.price)}\n\n`;
      });
      msg += `*Subtotal:* ${formatCurrency(total)}\n*Shipping:* ${shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}\n*Tax (8%):* ${formatCurrency(tax)}\n*Grand Total: ${formatCurrency(grandTotal)}*`;

      // 3. Save to database using the Custom ID
      await createOrder({
        id: orderId, // Passes the custom ID
        customer: name,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          price: i.price,
        })),
        total: grandTotal,
        status: "pending",
      });

      toast.success("Opening WhatsApp to complete order...");
      clear();
      
      // 4. Redirect to WhatsApp
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      
      nav("/account");
    } catch (e) {
      toast.error(`Checkout failed: ${e}`);
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0)
    return (
      <div className="max-w-7xl mx-auto p-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-neutral-700 mb-4" />
        <h1 className="font-display text-4xl mb-2">Your bag is empty</h1>
        <p className="text-neutral-400 mb-6">Discover beautiful pieces to add to your collection.</p>
        <Link to="/explore">
          <Button className="bg-amber-400 hover:bg-amber-500 text-black">Continue Shopping</Button>
        </Link>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">Shopping Bag</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div
              key={`${i.productId}-${i.size}-${i.color}`}
              className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <img src={i.imageUrl} alt={i.name} className="w-24 h-32 object-cover rounded" />
              <div className="flex-1">
                <Link to={`/product/${i.productId}`} className="hover:text-amber-400">
                  <h3 className="font-semibold">{i.name}</h3>
                </Link>
                <p className="text-xs text-neutral-400">Size: {i.size} · Color: {i.color}</p>
                <p className="font-semibold mt-2">{formatCurrency(i.price)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-white/20 rounded">
                    <button className="w-8 h-8" onClick={() => setQty(i.productId, i.size, i.color, i.qty - 1)}>−</button>
                    <span className="w-8 text-center text-sm">{i.qty}</span>
                    <button className="w-8 h-8" onClick={() => setQty(i.productId, i.size, i.color, i.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => remove(i.productId, i.size, i.color)} className="text-neutral-500 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-amber-400">{formatCurrency(i.price * i.qty)}</p>
            </div>
          ))}
        </div>
        <aside className="bg-white/5 border border-white/10 rounded-lg p-6 h-fit sticky top-28">
          <h2 className="font-display text-2xl mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span>{formatCurrency(total)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Shipping</span><span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-400">Tax</span><span>{formatCurrency(tax)}</span></div>
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-white/10 mb-6">
            <span>Total</span>
            <span className="text-amber-400">{formatCurrency(grandTotal)}</span>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full mb-4 bg-neutral-900 border border-white/20 rounded px-4 py-3 text-sm outline-none focus:border-amber-400 text-white transition-colors"
          />
          <Button onClick={checkout} disabled={placing} className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-black font-bold tracking-widest uppercase flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {placing ? "Processing..." : "Checkout via WhatsApp"}
          </Button>
        </aside>
      </div>
    </div>
  );
}