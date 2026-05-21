import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { CATEGORIES, CategoryKey } from "../lib/catalog";

export function MegaMenu() {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 px-4 py-2 text-sm tracking-widest uppercase hover:text-amber-400 transition-colors">
        Shop by Category <ChevronDown className="w-3.5 h-3.5" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block bg-neutral-950 border border-white/10 shadow-2xl rounded-lg p-8 z-50 w-[720px]">
        <div className="grid grid-cols-3 gap-8">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
            <div key={cat}>
              <Link
                to={`/category/${cat}`}
                className="font-display text-xl mb-4 block capitalize text-amber-400 hover:underline"
              >
                {cat}
              </Link>
              <ul className="space-y-2">
                {CATEGORIES[cat].map((sub) => (
                  <li key={sub}>
                    <Link
                      to={`/category/${cat}?sub=${encodeURIComponent(sub)}`}
                      className="text-sm text-neutral-300 hover:text-amber-400 transition-colors"
                    >
                      {sub}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
