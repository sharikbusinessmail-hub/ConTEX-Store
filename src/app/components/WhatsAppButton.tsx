import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  // IMPORTANT: Match this to your actual WhatsApp number
  const WHATSAPP_NUMBER = "94710773717"; 
  const defaultMessage = "Hi SJ-Fashion! I have a question about your products.";

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_4px_14px_0_rgba(37,211,102,0.39)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.23)] hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Optional: Tooltip that appears on hover */}
      <span className="absolute right-full mr-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
        Chat with us!
      </span>
    </a>
  );
}