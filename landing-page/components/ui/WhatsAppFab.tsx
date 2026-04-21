const WHATSAPP_NUMBER = "919999999999";
const PREFILL =
  "Hi, I have a question about the Golden Indicator before I buy.";

export default function WhatsAppFab() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-40 bottom-4 right-4 sm:bottom-6 sm:right-6 inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full pl-3 pr-4 py-3 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:brightness-105 active:scale-[0.98] transition-all"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 32 32"
        fill="currentColor"
        aria-hidden
      >
        <path d="M16 .396C7.164.396.026 7.534.026 16.37c0 2.935.815 5.702 2.294 8.08L0 32l7.762-2.275A15.88 15.88 0 0016 32.344c8.836 0 15.974-7.138 15.974-15.974C31.974 7.534 24.836.396 16 .396zm0 29.229c-2.522 0-4.977-.69-7.11-1.998l-.51-.305-5.22 1.53 1.562-5.086-.333-.524a13.18 13.18 0 01-2.06-7.115c0-7.32 5.96-13.28 13.28-13.28s13.28 5.96 13.28 13.28c-.001 7.32-5.961 13.498-13.282 13.498zm7.28-9.94c-.4-.2-2.362-1.163-2.728-1.294-.366-.133-.632-.2-.9.2-.265.4-1.028 1.294-1.26 1.56-.232.266-.465.3-.865.1-.4-.2-1.69-.623-3.22-1.985-1.19-1.06-1.994-2.37-2.227-2.77-.232-.4-.024-.615.176-.813.18-.18.4-.466.6-.7.2-.232.266-.4.4-.665.133-.265.067-.5-.033-.7-.1-.2-.9-2.17-1.23-2.97-.323-.78-.652-.673-.9-.686l-.766-.014a1.473 1.473 0 00-1.066.5c-.366.4-1.4 1.37-1.4 3.34 0 1.972 1.433 3.876 1.633 4.143.2.266 2.82 4.31 6.83 6.043.955.412 1.7.658 2.282.843.958.305 1.83.262 2.52.16.77-.115 2.36-.966 2.693-1.898.333-.932.333-1.732.232-1.898-.1-.166-.366-.266-.766-.466z" />
      </svg>
      <span className="text-caption font-semibold hidden sm:inline">Chat with us</span>
    </a>
  );
}
