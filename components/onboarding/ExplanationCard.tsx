"use client";

import { Lightbulb } from "lucide-react";

const STEP_EXPLANATIONS: Record<string, { title: string; body: string; example?: string }> = {
  brand: {
    title: "ما هي هوية الموقع؟",
    body: "هوية موقعك يعني الاسم والشعار والألوان اللي تميّز موقعك عن غيره.",
    example: "مثلاً: اسم مكتبك، شعاره، وألوانه — زي لوحة المحل حقك!",
  },
  contact: {
    title: "ليش نحتاج بيانات التواصل؟",
    body: "عشان عملائك يقدرون يوصلونك بسهولة. هذه البيانات تظهر في موقعك.",
    example: "مثلاً: رقم جوالك، بريدك الإلكتروني، وعنوان مكتبك.",
  },
  property: {
    title: "ما هو العقار؟",
    body: "العقار هو أي بيت أو شقة أو أرض أو محل تبي تعرضه وتبيعه أو تأجّره في موقعك.",
    example: "أضف عقارك الأول الآن وجرّب — يمكنك تعديله أو حذفه لاحقاً بسهولة.",
  },
  domain: {
    title: "ما هو النطاق الخاص؟",
    body: "النطاق هو عنوان موقعك الاحترافي على الإنترنت — موقعك يعمل تلقائياً، لكن النطاق الخاص يعطيه طابعاً مميزاً.",
    example: "مثلاً: www.مكتبك.sa بدل من مكتبك.taearif.sa — يمكنك تخطيه الآن وإضافته لاحقاً.",
  },
  integrations: {
    title: "ما معنى الربط؟",
    body: "الربط يعني توصيل موقعك بخدمات ثانية تساعدك في التواصل مع عملائك وقياس نتائجك.",
    example: "مثلاً: واتساب يخلي العميل يرسل لك بضغطة زر من موقعك مباشرة.",
  },
};

interface ExplanationCardProps {
  stepId: "brand" | "contact" | "property" | "domain" | "integrations";
}

export function ExplanationCard({ stepId }: ExplanationCardProps) {
  const info = STEP_EXPLANATIONS[stepId];
  if (!info) return null;

  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{
        background: "linear-gradient(135deg, #E8F5EF 0%, #D1FAE5 100%)",
        border: "1.5px solid #4CAF8240",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "#1A3C34" }}
      >
        <Lightbulb className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="font-bold text-[#1A3C34] text-sm mb-1">{info.title}</p>
        <p className="text-sm text-[#2D6A4F] leading-relaxed">{info.body}</p>
        {info.example && (
          <p className="text-xs text-[#4CAF82] mt-1.5 leading-relaxed">
            💡 {info.example}
          </p>
        )}
      </div>
    </div>
  );
}
