import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
// IMPORTANT: Update this import path to point to your actual Supabase client!
import { supabase } from "../../lib/api";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Welcome back, Admin.");
      navigate("/sj-admin-portal-2026"); // Redirect to the secure admin page
    }
  };

  return (
    <div className="dark min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-white/10 text-white shadow-2xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-display tracking-tight">
            <span className="italic text-amber-400">SJ</span> Admin
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Enter your credentials to access the portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-950 border-white/10 text-white focus-visible:ring-amber-400"
                placeholder="admin@sjfashion.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-950 border-white/10 text-white focus-visible:ring-amber-400"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-400 text-black hover:bg-amber-500 font-semibold"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}