import { useEffect, useMemo, useState } from "react";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Toaster } from "../ui/sonner";
import { AddProductForm } from "./AddProductForm";
import { EditProductForm } from "./EditProductForm"; 
import {
  deleteProduct,
  listOrders,
  listProducts,
  Order,
  Product,
  updateOrder,
  createOrder,
} from "../../lib/api";
import { toast } from "sonner";

const COLORS = ["#fbbf24", "#3b82f6", "#10b981", "#8b5cf6", "#e11d48"];

// Currency formatter for LKR
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(amount);
};

export function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  async function refresh() {
    try {
      const [p, o] = await Promise.all([listProducts(), listOrders()]);
      setProducts(p);
      setOrders(o);
    } catch (e) {
      console.error("Failed to load admin data", e);
      toast.error(`Load failed: ${e}`);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const delivered = orders.filter((o) => o.status === "delivered").length;
    return {
      revenue,
      orderCount: orders.length,
      productCount: products.length,
      delivered,
    };
  }, [orders, products]);

  const salesByDay = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      const d = new Date(o.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      map.set(d, (map.get(d) || 0) + o.total);
    });
    return Array.from(map.entries())
      .slice(-14)
      .map(([date, total]) => ({ date, total: Math.round(total) }));
  }, [orders]);

  const salesByCategory = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      o.items.forEach((it) => {
        const prod = products.find((p) => p.id === it.productId);
        if (!prod) return;
        map.set(prod.category, (map.get(prod.category) || 0) + it.qty * it.price);
      });
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [orders, products]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      refresh();
    } catch (e) {
      toast.error(`Delete failed: ${e}`);
    }
  }

  async function changeStatus(o: Order, status: Order["status"]) {
    try {
      await updateOrder(o.id, { status });
      toast.success(`Order ${o.id.slice(0, 6)} → ${status}`);
      refresh();
    } catch (e) {
      toast.error(`Update failed: ${e}`);
    }
  }

  async function seedDemoOrder() {
    if (products.length === 0) {
      toast.error("Add a product first");
      return;
    }
    const p = products[Math.floor(Math.random() * products.length)];
    const qty = 1 + Math.floor(Math.random() * 3);
    try {
      await createOrder({
        customer: ["Alice", "Bob", "Charlie", "Dana"][
          Math.floor(Math.random() * 4)
        ],
        items: [{ productId: p.id, name: p.name, qty, price: p.price }],
        total: p.price * qty,
        status: ["pending", "shipped", "delivered"][
          Math.floor(Math.random() * 3)
        ] as Order["status"],
      });
      toast.success("Demo order created");
      refresh();
    } catch (e) {
      toast.error(`Seed failed: ${e}`);
    }
  }

  return (
    <div className="dark min-h-screen bg-neutral-950 text-white">
      <Toaster position="top-right" theme="dark" />
      <header className="bg-neutral-950/95 backdrop-blur border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display tracking-tight">
              <span className="italic text-amber-400">SJ</span> Admin Portal
            </h1>
            <p className="text-xs text-neutral-400">Private — owner access only</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-amber-400 text-black hover:bg-amber-500" onClick={seedDemoOrder}>
              + Demo Order
            </Button>
            <Button variant="ghost" className="text-white hover:text-amber-400" onClick={() => (window.location.hash = "/")}>
              View Storefront
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi
            icon={<DollarSign className="w-5 h-5" />}
            label="Revenue"
            value={formatCurrency(stats.revenue)}
            color="bg-amber-400/20 text-amber-400"
          />
          <Kpi
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Orders"
            value={String(stats.orderCount)}
            color="bg-blue-500/20 text-blue-400"
          />
          <Kpi
            icon={<Package className="w-5 h-5" />}
            label="Products"
            value={String(stats.productCount)}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <Kpi
            icon={<TrendingUp className="w-5 h-5" />}
            label="Delivered"
            value={String(stats.delivered)}
            color="bg-purple-500/20 text-purple-400"
          />
        </div>

        <Tabs defaultValue="products">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="products" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">Products</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">Orders</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 mt-4">
            {editingProduct ? (
              <EditProductForm 
                product={editingProduct} 
                onClose={() => setEditingProduct(null)} 
                onUpdated={refresh} 
              />
            ) : (
              <AddProductForm onCreated={refresh} />
            )}

            <Card className="bg-neutral-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">All Products ({products.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-neutral-400">Image</TableHead>
                      <TableHead className="text-neutral-400">Name</TableHead>
                      <TableHead className="text-neutral-400">Category</TableHead>
                      <TableHead className="text-neutral-400">Brand</TableHead>
                      <TableHead className="text-neutral-400">Price</TableHead>
                      <TableHead className="text-neutral-400">Variants</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded border border-white/10"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-white">{p.name}</TableCell>
                        <TableCell className="capitalize text-neutral-300">
                          {p.category}
                          {p.subcategory ? ` / ${p.subcategory}` : ""}
                        </TableCell>
                        <TableCell className="text-neutral-300">{p.brand}</TableCell>
                        <TableCell className="text-neutral-300">{formatCurrency(p.price)}</TableCell>
                        <TableCell className="text-neutral-300">{p.variants?.length || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-amber-400/20 hover:text-amber-400"
                              onClick={() => setEditingProduct(p)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:bg-red-500/20 hover:text-red-400"
                              onClick={() => handleDelete(p.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card className="bg-neutral-900 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Orders ({orders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-neutral-400">Order ID</TableHead>
                      <TableHead className="text-neutral-400">Customer</TableHead>
                      <TableHead className="text-neutral-400">Items</TableHead>
                      <TableHead className="text-neutral-400">Total</TableHead>
                      <TableHead className="text-neutral-400">Date</TableHead>
                      <TableHead className="text-neutral-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-mono text-xs text-neutral-300">
                          {o.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="text-white">{o.customer}</TableCell>
                        <TableCell className="text-neutral-300">{o.items.length}</TableCell>
                        <TableCell className="text-neutral-300">{formatCurrency(o.total)}</TableCell>
                        <TableCell className="text-neutral-300">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={o.status}
                            onValueChange={(v) =>
                              changeStatus(o, v as Order["status"])
                            }
                          >
                            <SelectTrigger className="w-36 bg-neutral-950 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-white/10 text-white">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card className="bg-neutral-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sales over time</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  {salesByDay.length === 0 ? (
                    <p className="text-neutral-500 text-sm">No sales data yet.</p>
                  ) : (
                    <ResponsiveContainer>
                      <BarChart data={salesByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" />
                        <XAxis dataKey="date" stroke="#a3a3a3" />
                        <YAxis stroke="#a3a3a3" />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#ffffff1a', color: '#fff' }} />
                        <Bar dataKey="total" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-neutral-900 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Sales by category</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                  {salesByCategory.length === 0 ? (
                    <p className="text-neutral-500 text-sm">No category sales yet.</p>
                  ) : (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={salesByCategory}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={90}
                          label={{ fill: '#f5f5f5' }}
                        >
                          {salesByCategory.map((entry, i) => (
                            <Cell key={`cell-${entry.name}-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#ffffff1a', color: '#fff' }} />
                        <Legend wrapperStyle={{ color: '#a3a3a3' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="bg-neutral-900 border-white/10">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-neutral-400">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}