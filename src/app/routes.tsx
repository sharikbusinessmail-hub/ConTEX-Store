import { createHashRouter, Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductPage from "./pages/Product";
import Cart from "./pages/Cart";
import Brand from "./pages/Brand";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Orders from "./pages/Orders";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import { AdminPage } from "./components/admin/AdminPage";
import { AdminLogin } from "./components/admin/AdminLogin";
import { supabase } from "./lib/api";
// 1. Create a wrapper to protect the admin route
function ProtectedAdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing while checking session to prevent flickering
  if (isAuthenticated === null) return <div className="min-h-screen bg-neutral-950"></div>;

  // If not logged in, kick them back to the login page
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  // If logged in, render the Admin Page
  return <Outlet />;
}

// 2. Set up the router
export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "category/:category", Component: Category },
      { path: "product/:id", Component: ProductPage },
      { path: "brand/:name", Component: Brand },
      { path: "cart", Component: Cart },
      { path: "explore", Component: Explore },
      { path: "search", Component: Search },
      { path: "wishlist", Component: Wishlist },
      { path: "account", Component: Account },
      { path: "account/orders", Component: Orders },
      { path: "help/:topic", Component: Help },
      { path: "*", Component: NotFound },
    ],
  },
  // The new Login Route
  { path: "/admin/login", Component: AdminLogin },
  // Redirect old /admin to the new login page
  { path: "/admin", element: <Navigate to="/admin/login" replace /> },
  
  // The Protected Admin Portal
  { 
    element: <ProtectedAdminRoute />, 
    children: [
      { path: "/sj-admin-portal-2026", Component: AdminPage }
    ]
  },
]);