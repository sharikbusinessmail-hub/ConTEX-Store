import { useEffect, useState } from "react";
import { listOrders, Order } from "../lib/api";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";

// Helper function to format LKR
const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    listOrders()
      .then(setOrders)
      .catch((e) => console.error("Failed to load orders", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-8">My Orders</h1>
      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-neutral-400">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id} className="bg-white/5 border-white/10">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs text-neutral-500">#{o.id.slice(0, 8)}</p>
                  <p className="font-semibold mt-1">
                    {o.items.length} items · {formatCurrency(o.total)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge className="bg-amber-400 text-black capitalize">{o.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}