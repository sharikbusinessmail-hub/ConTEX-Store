import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "./api";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  size: string;
  color: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  wishlist: string[];
  add: (p: Product, size: string, color: string, qty?: number) => void;
  remove: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (productId: string) => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sj_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sj_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("sj_cart", JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem("sj_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const add: CartCtx["add"] = (p, size, color, qty = 1) => {
    setItems((curr) => {
      const idx = curr.findIndex(
        (i) => i.productId === p.id && i.size === size && i.color === color,
      );
      if (idx >= 0) {
        const next = [...curr];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [
        ...curr,
        {
          productId: p.id,
          name: p.name,
          price: p.price,
          imageUrl: p.imageUrl,
          size,
          color,
          qty,
        },
      ];
    });
  };

  const remove: CartCtx["remove"] = (productId, size, color) => {
    setItems((c) =>
      c.filter(
        (i) => !(i.productId === productId && i.size === size && i.color === color),
      ),
    );
  };

  const setQty: CartCtx["setQty"] = (productId, size, color, qty) => {
    setItems((c) =>
      c.map((i) =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, qty: Math.max(1, qty) }
          : i,
      ),
    );
  };

  const toggleWishlist = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <Ctx.Provider
      value={{ items, wishlist, add, remove, setQty, clear: () => setItems([]), toggleWishlist, total, count }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
