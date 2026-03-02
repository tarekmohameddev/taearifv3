"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "966500000000";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "السلام عليكم، أبي مساعدة في إعداد موقعي على منصة تعاريف."
);
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export function HelpBanner() {
  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-4"
      style={{
        background: "linear-gradient(135deg, #E8F5EF 0%, #D1FAE5 100%)",
        border: "1.5px solid #4CAF8240",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#4CAF82" }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className="font-bold text-[#1A3C34] text-sm">تبي أحد يسوّيه لك؟</p>
          <span
            className="text-xs font-bold text-white px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: "#1A3C34" }}
          >
            ٥٠ ريال فقط
          </span>
        </div>
        <p className="text-xs text-[#374151] leading-relaxed">
          فريقنا يقدر يساعدك وينهي كل الإعداد عنك
        </p>
      </div>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-bold text-white px-4 py-2.5 rounded-xl flex-shrink-0 transition-opacity hover:opacity-90 active:opacity-80"
        style={{ background: "#25D366" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        تواصل معنا
      </a>
    </div>
  );
}
