import { motion } from "motion/react";
import { Link } from "react-router";

export function BrandCarousel() {
  const logos = [
    { name: "Nike", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/nike-8.svg" },
    { name: "Adidas", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/adidas-18.svg" },
    { name: "Puma", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/puma-logo.svg" },
    { name: "Gucci", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/gucci-logo-1.svg" },
    { name: "Levi's", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/levis-1.svg" },
    { name: "Zara", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/zara.svg" },
    { name: "H&M", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/h-m-1.svg" },
    { name: "Calvin Klein", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/calvin-klein-logo.svg" },
    { name: "Tommy Hilfiger", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/tommy%20hilfiger.png" },
    { name: "Versace", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/versace-3.svg" },
    { name: "Prada", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/prada-logo-1.svg" },
    { name: "Louis Vuitton", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/louis-vuitton-4%20(1).svg" },
    { name: "Under Armour", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/under-armour-logo.svg" },
    { name: "Reebok", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/reebok-2019-logo.svg" },
    { name: "New Balance", logo: "https://hixxecrodoqpnxarfzdd.supabase.co/storage/v1/object/public/brand%20images/new-balance-3.svg" },
  ];

  // Double the array to create a seamless infinite scrolling effect
  const loop = [...logos, ...logos];

  return (
    <section className="py-16 bg-neutral-950 border-y border-white/5 overflow-hidden">
      <div className="text-center mb-10">
        <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
          Curated Selection
        </p>
        <h2 className="font-display text-4xl text-white">Shop by Brands</h2>
      </div>
      
      <div className="relative">
        {/* Fade gradients on the left and right edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex items-center gap-12 md:gap-20 w-max px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {loop.map((brand, i) => (
            <Link 
              key={i} 
              to={`/brand/${encodeURIComponent(brand.name)}`}
              className="flex-shrink-0 block group"
              title={brand.name}
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                // brightness-0 and invert force the logos to be pure white for the dark theme
                className="h-8 md:h-12 w-auto max-w-[120px] object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}