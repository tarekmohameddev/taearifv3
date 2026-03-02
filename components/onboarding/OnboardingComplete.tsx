"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboarding";
import { cn } from "@/lib/utils";

interface OnboardingCompleteProps {
  onClose: () => void;
}

const COMPLETED_STEPS = [
  { icon: "🏷️", label: "هوية الموقع", key: "brand" },
  { icon: "📞", label: "بيانات التواصل", key: "contact" },
  { icon: "🏠", label: "أول عقار", key: "property" },
  { icon: "🔗", label: "الربط والتكامل", key: "integrations" },
] as const;

export function OnboardingComplete({ onClose }: OnboardingCompleteProps) {
  const { steps } = useOnboardingStore();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowConfetti(true), 100);
    const t2 = setTimeout(() => setAnimateIn(true), 200);
    const t3 = setTimeout(() => setShowConfetti(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const completedCount = steps.filter((s) => s.completed).length;
  const totalCount = steps.length;

  return (
    <div className="relative overflow-hidden">
      {/* Confetti particles */}
      {showConfetti && <ConfettiEffect />}

      <div className={cn("space-y-6 transition-all duration-700", animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
        {/* Big success icon */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto w-24 h-24">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]"
              style={{ background: "linear-gradient(135deg, #1A3C34, #4CAF82)" }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A]">أحسنت! موقعك جاهز</h2>
            <p className="text-[#6B7280] text-sm mt-1 leading-relaxed">
              لقد أكملت إعداد موقعك. يمكنك الآن البدء في استقبال العملاء ونشر العقارات.
            </p>
          </div>
        </div>

        {/* Summary of completed steps */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F4F5F7] p-4 space-y-2">
          <p className="text-xs font-semibold text-[#6B7280] mb-3">
            الخطوات المكتملة ({completedCount} من {totalCount})
          </p>
          {COMPLETED_STEPS.map(({ icon, label, key }) => {
            const step = steps.find((s) => s.id === key);
            const done = step?.completed;
            const skipped = step?.skipped;
            return (
              <div key={key} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-base",
                    done ? "bg-[#E8F5EF]" : "bg-[#F4F5F7]"
                  )}
                >
                  {icon}
                </div>
                <span className={cn("text-sm flex-1", done ? "text-[#1A1A1A] font-medium" : "text-[#9CA3AF]")}>
                  {label}
                </span>
                {done ? (
                  <span className="flex items-center gap-1 text-[#4CAF82] text-xs font-semibold">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    تم
                  </span>
                ) : skipped ? (
                  <span className="text-[#9CA3AF] text-xs">متخطى</span>
                ) : (
                  <span className="text-[#9CA3AF] text-xs">لم يكتمل</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div className="rounded-xl bg-[#E8F5EF] p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-[#1A3C34]">نصيحة</p>
            <p className="text-xs text-[#374151] mt-0.5 leading-relaxed">
              يمكنك الرجوع إلى أي خطوة في أي وقت بالضغط على زر الإعداد في الشريط العلوي.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            onClick={onClose}
            className="w-full h-12 rounded-[20px] text-white font-semibold text-sm"
            style={{ background: "#1A3C34" }}
          >
            <LayoutDashboard className="w-4 h-4 ml-2" />
            استكشف لوحة التحكم
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confetti ─────────────────────────────────── */
const CONFETTI_COLORS = ["#1A3C34", "#4CAF82", "#5BC4C0", "#E07A3A", "#D4E157", "#4A90A4"];
const CONFETTI_COUNT = 28;

function ConfettiEffect() {
  const particles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    size: Math.random() * 6 + 4,
    duration: `${Math.random() * 1.5 + 1.5}s`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-[fall_linear_forwards]"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            animationName: "confettiFall",
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
