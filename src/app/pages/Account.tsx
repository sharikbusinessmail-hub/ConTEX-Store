import { Link } from "react-router";
import { User, Package, Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export default function Account() {
  const tiles = [
    { icon: <Package className="w-6 h-6" />, label: "Orders", to: "/account/orders", desc: "Track your orders" },
    { icon: <Heart className="w-6 h-6" />, label: "Wishlist", to: "/wishlist", desc: "Saved items" },
    { icon: <MapPin className="w-6 h-6" />, label: "Addresses", to: "#", desc: "Manage addresses" },
    { icon: <User className="w-6 h-6" />, label: "Profile", to: "#", desc: "Personal info" },
  ];
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl mb-2">My Account</h1>
      <p className="text-neutral-400 mb-10">Welcome back, fashion lover.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to}>
            <Card className="bg-white/5 border-white/10 hover:border-amber-400 transition cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-400/10 text-amber-400 rounded-lg flex items-center justify-center">
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{t.label}</h3>
                  <p className="text-sm text-neutral-400">{t.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
