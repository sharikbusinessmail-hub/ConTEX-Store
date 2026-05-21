import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const slides = [
  {
    type: "logo",
    image:
      "https://hzyfijvdnkjgahwhtvnv.supabase.co/storage/v1/object/sign/Hero/store%20front.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hOTY2NWE2Ny1jMDg2LTQ0ZDgtYmM0Ni01NWZhYWQzZWM1OWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIZXJvL3N0b3JlIGZyb250LmpwZyIsImlhdCI6MTc3OTM4MDA1MywiZXhwIjoxODEwOTE2MDUzfQ.4y-s1MGRtUFRgA6fxgVyJImm2ySxf_m2_NsTYSK3iaQ",
    overlay:
      "bg-gradient-to-r from-black via-black/70 to-transparent",
    content: (
      <div className="text-left max-w-2xl">
        <p className="text-amber-400 tracking-[0.4em] text-sm uppercase mb-6">
          Est. 2026 · Premium Fashion
        </p>
        <h1 className="font-display text-7xl md:text-8xl text-white mb-6 leading-none">
          <span className="lowercase text-white">con</span><span className="uppercase text-amber-400">TEX</span>
        </h1>
        <p className="text-neutral-300 text-lg max-w-md mb-10 font-light">
          Where elegance meets everyday. Discover handpicked styles crafted for the modern wardrobe.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link to="/category/men">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8">
              Shop New Arrivals <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/explore">
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-black bg-transparent px-8"
            >
              Explore More
            </Button>
          </Link>
        </div>
      </div>
    ),
  },
  {
    type: "story",
    image:
      "https://hzyfijvdnkjgahwhtvnv.supabase.co/storage/v1/object/sign/Hero/carousal%20(1).jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hOTY2NWE2Ny1jMDg2LTQ0ZDgtYmM0Ni01NWZhYWQzZWM1OWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIZXJvL2Nhcm91c2FsICgxKS5qcGciLCJpYXQiOjE3NzkzODEwMjcsImV4cCI6MTgxMDkxNzAyN30.Gi8FyAj9SrKLkDMD8hpSPmeY_2sZnFhuTzSSqOGSFHA",
    overlay: "bg-black/50",
    content: (
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-amber-400 tracking-[0.4em] text-sm uppercase mb-6">
          Spring · Summer 2026
        </p>
        <h1 className="font-display text-6xl md:text-7xl text-white mb-6 leading-tight">
          Wear Your <span className="italic">Story</span>.
        </h1>
        <p className="text-neutral-200 text-lg max-w-xl mx-auto mb-10">
          Curated styles for men, women & kids. Up to <span className="text-amber-400 font-semibold">50% off</span> this season.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/category/women">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8">
              Shop Women
            </Button>
          </Link>
          <Link to="/category/men">
            <Button size="lg" className="bg-white hover:bg-neutral-200 text-black font-semibold px-8">
              Shop Men
            </Button>
          </Link>
        </div>
      </div>
    ),
  },

  {
    type: "trends",
    image:
      "https://hzyfijvdnkjgahwhtvnv.supabase.co/storage/v1/object/sign/Hero/alysa.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hOTY2NWE2Ny1jMDg2LTQ0ZDgtYmM0Ni01NWZhYWQzZWM1OWUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJIZXJvL2FseXNhLmpwZyIsImlhdCI6MTc3OTM4MTEwOSwiZXhwIjoxODEwOTE3MTA5fQ.gpb8OpkM-Eo8IMkW-j5rcir_XEEsbhGKmSSMkHL2ZIE",
    overlay: "bg-black/50",
    content: (
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-amber-400 tracking-[0.4em] text-sm uppercase mb-6">
          The Textured Collective
        </p>
        <h1 className="font-display text-6xl md:text-7xl text-white mb-6 leading-tight">
          Trending <span className="italic text-amber-400">Now</span>.
        </h1>
        <p className="text-neutral-200 text-lg max-w-xl mx-auto mb-10">
          <span className="lowercase text-white">con</span><span className="uppercase text-amber-400">TEX</span>: Where fashion finds its next trend. Explore the collection.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/category/women">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-8">
              Shop Women
            </Button>
          </Link>
          <Link to="/category/men">
            <Button size="lg" className="bg-white hover:bg-neutral-200 text-black font-semibold px-8">
              Shop Men
            </Button>
          </Link>
        </div>
      </div>
    ),
  },

];

export function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[640px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={slides[idx].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${slides[idx].overlay}`} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`c-${idx}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative h-full max-w-7xl mx-auto px-6 flex items-center"
        >
          {slides[idx].content}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1 rounded-full transition-all ${
              i === idx ? "w-12 bg-amber-400" : "w-6 bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
