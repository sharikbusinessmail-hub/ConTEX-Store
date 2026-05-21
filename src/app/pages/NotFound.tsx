import { Link } from "react-router";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4">404</p>
      <h1 className="font-display text-6xl mb-4">Page Not Found</h1>
      <p className="text-neutral-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/"><Button className="bg-amber-400 hover:bg-amber-500 text-black">Back to Home</Button></Link>
    </div>
  );
}
