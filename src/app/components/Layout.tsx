import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { MegaMenu } from "./MegaMenu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import { useCart } from "../lib/cart";

export function Layout() {
  const { count, wishlist } = useCart();
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const location = useLocation();

  // NEW: State to control the mobile slide-out menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NEW: Automatically close the mobile menu whenever the page changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      nav(`/search?q=${encodeURIComponent(q.trim())}`);
      setIsMobileMenuOpen(false); // Close menu if search is submitted from mobile
    }
  };

  const navLink = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm tracking-widest uppercase transition-colors ${
      isActive ? "text-amber-400" : "text-white hover:text-amber-400"
    }`;

  // Dedicated class for mobile links so they look good in a vertical list
  const mobileNavLink = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 text-lg font-medium tracking-widest uppercase border-b border-white/5 transition-colors ${
      isActive ? "text-amber-400 bg-amber-400/5" : "text-white hover:text-amber-400 hover:bg-white/5"
    }`;

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-x-hidden">
      <Toaster position="top-right" theme="dark" />
      <div className="bg-amber-400 text-black text-center text-xs py-2 tracking-widest uppercase">
        Enjoy Free Shipping on Qualifying Orders · New Summer Collection
      </div>

      <header className="border-b border-white/10 sticky top-0 bg-neutral-950/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            {/* NEW: Hamburger Button (Visible only on mobile/tablet) */}
            <button 
              className="md:hidden text-white hover:text-amber-400 transition"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="font-display text-3xl tracking-tight">
              <span className="italic text-amber-400">SJ</span> Fashion
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <MegaMenu />
            <NavLink to="/category/men" className={navLink}>Men</NavLink>
            <NavLink to="/category/women" className={navLink}>Women</NavLink>
            <NavLink to="/category/kids" className={navLink}>Kids</NavLink>
            <NavLink to="/explore" className={navLink}>Explore</NavLink>
          </nav>

          <div className="flex items-center gap-1">
            <form onSubmit={submitSearch} className="relative hidden lg:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="pl-9 w-56 bg-white/5 border-white/10 text-white placeholder:text-neutral-500"
              />
            </form>
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-white hover:text-amber-400 relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="ghost" size="icon" className="text-white hover:text-amber-400">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:text-amber-400 relative">
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-semibold">
                    {count}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* NEW: MOBILE SLIDE-OUT MENU */}
      {/* Background Dark Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* The Drawer Panel */}
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-neutral-950 border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="font-display text-2xl tracking-tight" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="italic text-amber-400">SJ</span> Fashion
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto">
          {/* Mobile Search Bar */}
          <div className="p-6 pb-2">
            <form onSubmit={submitSearch} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="pl-9 w-full bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-amber-400"
              />
            </form>
          </div>

          <div className="flex flex-col mt-4">
            <NavLink to="/category/men" className={mobileNavLink}>Men</NavLink>
            <NavLink to="/category/women" className={mobileNavLink}>Women</NavLink>
            <NavLink to="/category/kids" className={mobileNavLink}>Kids</NavLink>
            <NavLink to="/explore" className={mobileNavLink}>Explore All</NavLink>
          </div>
        </div>
      </div>
      {/* END MOBILE MENU */}

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-2xl mb-3">
            <span className="italic text-amber-400">SJ</span> Fashion
          </h3>
          <p className="text-sm text-neutral-400">
            Your destination for trending fashion. Curated styles for men, women, and kids.
          </p>
        </div>
        <div>
          <h4 className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li><Link to="/category/men" className="hover:text-white">Men</Link></li>
            <li><Link to="/category/women" className="hover:text-white">Women</Link></li>
            <li><Link to="/category/kids" className="hover:text-white">Kids</Link></li>
            <li><Link to="/explore" className="hover:text-white">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li><Link to="/help/shipping" className="hover:text-white">Shipping</Link></li>
            <li><Link to="/help/returns" className="hover:text-white">Returns</Link></li>
            <li><Link to="/help/size-guide" className="hover:text-white">Size Guide</Link></li>
            <li><Link to="/help/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">Newsletter</h4>
          <p className="text-sm text-neutral-400 mb-3">Get 10% off your first order.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Email" className="bg-white/5 border-white/10 text-white" />
            <Button className="bg-amber-400 hover:bg-amber-500 text-black">Join</Button>
          </form>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-600 mt-12">
        © 2026 SJ Fashion Store · All rights reserved
      </p>
    </footer>
  );
}