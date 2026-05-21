import { useParams } from "react-router";

const content: Record<string, { title: string; body: JSX.Element }> = {
  shipping: {
    title: "Shipping Information",
    body: (
      <div className="space-y-4 text-neutral-300">
        <p>We offer worldwide shipping on all orders.</p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong className="text-white">Standard (5–7 business days):</strong> $8 — Free over $50</li>
          <li><strong className="text-white">Express (2–3 business days):</strong> $15</li>
          <li><strong className="text-white">Overnight:</strong> $25 (US only)</li>
        </ul>
        <p>Orders are processed within 1 business day. You'll receive a tracking link by email once your order ships.</p>
      </div>
    ),
  },
  returns: {
    title: "Returns & Exchanges",
    body: (
      <div className="space-y-4 text-neutral-300">
        <p>We offer a hassle-free 30-day return policy on all unworn items with original tags.</p>
        <ol className="space-y-2 list-decimal pl-5">
          <li>Request a return from your account orders page.</li>
          <li>Pack the item in its original packaging.</li>
          <li>Drop it off at any partner courier location.</li>
          <li>Refunds processed within 5–7 business days.</li>
        </ol>
      </div>
    ),
  },
  "size-guide": {
    title: "Size Guide",
    body: (
      <div className="space-y-4 text-neutral-300">
        <table className="w-full max-w-md border border-white/10">
          <thead className="bg-white/5">
            <tr><th className="p-2 text-left">Size</th><th className="p-2 text-left">Chest (in)</th><th className="p-2 text-left">Waist (in)</th></tr>
          </thead>
          <tbody>
            {[["XS","32-34","26-28"],["S","34-36","28-30"],["M","36-38","30-32"],["L","38-40","32-34"],["XL","40-42","34-36"],["XXL","42-44","36-38"]].map(r => (
              <tr key={r[0]} className="border-t border-white/10"><td className="p-2 font-semibold">{r[0]}</td><td className="p-2">{r[1]}</td><td className="p-2">{r[2]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  contact: {
    title: "Contact Us",
    body: (
      <div className="space-y-4 text-neutral-300">
        <p>We'd love to hear from you. Reach our customer care team:</p>
        <ul className="space-y-2">
          <li><strong className="text-white">Email:</strong> support@sjfashion.store</li>
          <li><strong className="text-white">Phone:</strong> +1 (555) 010-2026</li>
          <li><strong className="text-white">Hours:</strong> Mon–Fri, 9am–6pm EST</li>
        </ul>
      </div>
    ),
  },
};

export default function Help() {
  const { topic } = useParams<{ topic: string }>();
  const c = content[topic || ""];
  if (!c) return <div className="max-w-3xl mx-auto p-12 text-center"><h1 className="font-display text-3xl">Topic not found</h1></div>;
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">Help Center</p>
      <h1 className="font-display text-5xl mb-8">{c.title}</h1>
      {c.body}
    </div>
  );
}
