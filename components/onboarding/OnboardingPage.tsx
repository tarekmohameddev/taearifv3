"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, LayoutDashboard } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import type { OnboardingStep } from "@/store/onboarding";
import { BrandSetupStep } from "./steps/BrandSetupStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { FirstPropertyStep } from "./steps/FirstPropertyStep";
import { DomainSetupStep } from "./steps/DomainSetupStep";
import { IntegrationsStep } from "./steps/IntegrationsStep";
import { WelcomeScreen } from "./WelcomeScreen";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    id: "brand" as const,
    icon: "🏷️",
    title: "هوية الموقع",
    subtitle: "اسم الموقع، الشعار، والألوان",
    number: "١",
  },
  {
    id: "contact" as const,
    icon: "📞",
    title: "بيانات التواصل",
    subtitle: "الهاتف، البريد الإلكتروني، العنوان",
    number: "٢",
  },
  {
    id: "property" as const,
    icon: "🏠",
    title: "أول عقار",
    subtitle: "أضف أول عقار لموقعك",
    number: "٣",
  },
  {
    id: "domain" as const,
    icon: "🌐",
    title: "رابط الموقع",
    subtitle: "عنوان موقعك على الإنترنت",
    number: "٤",
  },
  {
    id: "integrations" as const,
    icon: "🔗",
    title: "الربط والتكامل",
    subtitle: "واتساب وميتا بيكسل",
    number: "٥",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const WHATSAPP_HREF = `https://wa.me/966500000000?text=${encodeURIComponent(
  "السلام عليكم، أبي مساعدة في إعداد موقعي على منصة تعاريف."
)}`;

/* ─── Main Wizard Page ─────────────────────────── */
export function OnboardingPage() {
  const { steps, currentStep, experienceLevel, goToStep, allCompleted, resetOnboarding } =
    useOnboardingStore();
  const router = useRouter();
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const isBeginnerMode = experienceLevel === "beginner";
  const completedCount = steps.filter((s) => s.completed || s.skipped).length;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  const handleNext = () => {
    setDirection("forward");
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setDirection("backward");
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    const stepState = steps[index];
    const isCompleted = !!(stepState?.completed || stepState?.skipped);
    if (!isCompleted && index > currentStep) return;
    setDirection(index > currentStep ? "forward" : "backward");
    goToStep(index);
  };

  if (experienceLevel === null) {
    return <WelcomeScreen />;
  }

  if (allCompleted) {
    return (
      <CompletionScreen
        steps={steps}
        onGoToDashboard={() => router.push("/dashboard")}
        onReset={resetOnboarding}
      />
    );
  }

  const slideVariants = {
    enter: (dir: "forward" | "backward") => ({
      x: dir === "forward" ? -40 : 40,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: "forward" | "backward") => ({
      x: dir === "forward" ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* ── Progress Sidebar (desktop) ── */}
      <aside
        className="hidden md:flex flex-col w-72 xl:w-80 flex-shrink-0 sticky top-0 h-screen"
        style={{ background: "linear-gradient(160deg, #1A3C34 0%, #2D6A4F 100%)" }}
      >
        {/* Brand */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              ت
            </div>
            <div>
              <p className="text-white font-bold text-base leading-tight">تعاريف</p>
              <p className="text-white/50 text-xs">إعداد الموقع</p>
            </div>
          </div>

          <h2 className="text-white font-bold text-lg leading-snug mb-1">
            {isBeginnerMode ? "سنوجّهك خطوة بخطوة 👋" : "أكمل إعداد موقعك"}
          </h2>
          <p className="text-white/55 text-sm">
            {completedCount} من {STEPS.length} خطوات مكتملة
          </p>
        </div>

        {/* Step timeline */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="relative">
            {/* Vertical connector line */}
            <div
              className="absolute top-5 bottom-5 w-px bg-white/12"
              style={{ right: "28px" }}
            />
            <div className="space-y-1 relative">
              {STEPS.map((step, index) => {
                const stepState = steps[index];
                const isCompleted = !!(stepState?.completed || stepState?.skipped);
                const isCurrent = index === currentStep;
                const canClick = isCompleted || index <= currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={!canClick}
                    onClick={() => handleStepClick(index)}
                    className={cn(
                      "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 text-right",
                      isCurrent && "bg-white/12",
                      canClick && !isCurrent && "hover:bg-white/8 cursor-pointer",
                      !canClick && "opacity-35 cursor-not-allowed"
                    )}
                  >
                    {/* Step circle */}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold relative z-10 transition-all duration-200",
                        isCompleted && "bg-[#4CAF82] text-white",
                        isCurrent && !isCompleted && "bg-white text-[#1A3C34] shadow-lg ring-4 ring-white/20",
                        !isCompleted && !isCurrent && "bg-white/12 text-white/40"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      ) : (
                        <span className="text-[13px]">{step.number}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <p
                        className={cn(
                          "text-sm font-semibold leading-tight",
                          isCurrent ? "text-white" : isCompleted ? "text-[#4CAF82]" : "text-white/40"
                        )}
                      >
                        {step.title}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-white/50 mt-0.5 leading-tight">{step.subtitle}</p>
                      )}
                      {isCompleted && !isCurrent && (
                        <p className="text-[10px] text-[#4CAF82]/70 mt-0.5 flex items-center gap-0.5 justify-end">
                          <Check className="w-2.5 h-2.5" strokeWidth={2.5} />
                          مكتمل
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: progress ring + help */}
        <div className="p-5 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-4">
            <CircularProgress pct={progressPct} />
            <div>
              <p className="text-white font-bold text-2xl leading-none">{progressPct}%</p>
              <p className="text-white/50 text-xs mt-1">اكتمل الإعداد</p>
            </div>
          </div>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium text-white/55 hover:text-white hover:bg-white/10 transition-all border border-white/12"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            تحتاج مساعدة؟ تواصل معنا
          </a>

          <button
            type="button"
            onClick={resetOnboarding}
            className="flex items-center justify-center gap-1 w-full py-1 text-[10px] text-white/20 hover:text-white/40 transition-colors"
            title="إعادة تعيين"
          >
            <RotateCcw className="w-3 h-3" />
            إعادة تعيين
          </button>
        </div>
      </aside>

      {/* ── Form Panel ── */}
      <main className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <MobileStepBar
            steps={STEPS}
            storeSteps={steps}
            currentStep={currentStep}
            progressPct={progressPct}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-xl mx-auto w-full px-5 py-8 md:px-10 md:py-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.26, ease: "easeInOut" }}
              >
                <StepContent
                  stepId={STEPS[currentStep].id}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === STEPS.length - 1}
                  isBeginnerMode={isBeginnerMode}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Mobile Step Bar ──────────────────────────── */
interface MobileStepBarProps {
  steps: typeof STEPS;
  storeSteps: OnboardingStep[];
  currentStep: number;
  progressPct: number;
  onStepClick: (index: number) => void;
}

function MobileStepBar({ steps, storeSteps, currentStep, progressPct, onStepClick }: MobileStepBarProps) {
  return (
    <div
      className="px-4 py-3"
      style={{ background: "linear-gradient(135deg, #1A3C34, #2D6A4F)" }}
      dir="rtl"
    >
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-xs">التقدم</span>
        <span className="text-white font-bold text-xs">{progressPct}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #4CAF82, #5BC4C0)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2">
        {steps.map((step, index) => {
          const stepState = storeSteps[index];
          const isCompleted = !!(stepState?.completed || stepState?.skipped);
          const isCurrent = index === currentStep;
          const canClick = isCompleted || index <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!canClick}
              onClick={() => onStepClick(index)}
              className={cn(
                "flex flex-col items-center gap-1 px-2 transition-all",
                !canClick && "opacity-40"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCompleted && "bg-[#4CAF82] text-white",
                  isCurrent && !isCompleted && "bg-white text-[#1A3C34] ring-2 ring-white/30",
                  !isCompleted && !isCurrent && "bg-white/15 text-white/50"
                )}
              >
                {isCompleted ? <Check className="w-3 h-3" strokeWidth={2.5} /> : step.number}
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium leading-tight text-center",
                  isCurrent ? "text-white" : "text-white/40"
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Circular Progress SVG ────────────────────── */
function CircularProgress({ pct }: { pct: number }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        className="-rotate-90"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="4"
        />
        {/* Progress arc */}
        <motion.circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#4CAF82"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {pct === 100 ? (
          <Check className="w-5 h-5 text-[#4CAF82]" strokeWidth={2.5} />
        ) : (
          <span className="text-[10px] font-bold text-white/70">{pct}%</span>
        )}
      </div>
    </div>
  );
}

/* ─── Completion Screen ────────────────────────── */
interface CompletionScreenProps {
  steps: OnboardingStep[];
  onGoToDashboard: () => void;
  onReset: () => void;
}

function CompletionScreen({ steps, onGoToDashboard, onReset }: CompletionScreenProps) {
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
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden" dir="rtl">
      {showConfetti && <ConfettiEffect />}

      <div
        className={cn(
          "max-w-md w-full mx-auto px-6 py-12 transition-all duration-700 space-y-6",
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}
      >
        {/* Success icon */}
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1A3C34, #4CAF82)" }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <div className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">أحسنت! موقعك جاهز 🎉</h1>
            <p className="text-[#6B7280] text-sm mt-2 leading-relaxed">
              لقد أكملت إعداد موقعك. يمكنك الآن البدء في استقبال العملاء ونشر العقارات.
            </p>
          </div>
        </div>

        {/* Completed steps summary */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 space-y-2">
          <p className="text-xs font-semibold text-[#6B7280] mb-3">
            الخطوات المكتملة ({completedCount} من {totalCount})
          </p>
          {STEPS.map((step) => {
            const stepState = steps.find((s) => s.id === step.id);
            const done = stepState?.completed;
            const skipped = stepState?.skipped;
            return (
              <div key={step.id} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0",
                    done ? "bg-[#E8F5EF]" : "bg-[#F4F5F7]"
                  )}
                >
                  {step.icon}
                </div>
                <span className={cn("text-sm flex-1", done ? "text-[#1A1A1A] font-medium" : "text-[#9CA3AF]")}>
                  {step.title}
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
              يمكنك الرجوع لتعديل أي خطوة في أي وقت من خلال زر الإعداد في الشريط العلوي.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-2">
          <Button
            onClick={onGoToDashboard}
            className="w-full h-12 rounded-2xl text-white font-semibold text-sm"
            style={{ background: "#1A3C34" }}
          >
            <LayoutDashboard className="w-4 h-4 ml-2" />
            استكشف لوحة التحكم
          </Button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-2 text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
          >
            إعادة تعيين الإعداد
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Confetti Effect ──────────────────────────── */
const CONFETTI_COLORS = ["#1A3C34", "#4CAF82", "#5BC4C0", "#E07A3A", "#D4E157", "#4A90A4"];
const CONFETTI_COUNT = 32;

function ConfettiEffect() {
  const particles = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.8}s`,
    size: Math.random() * 7 + 4,
    duration: `${Math.random() * 1.5 + 1.5}s`,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            animationName: "confettiFallWizard",
            animationFillMode: "forwards",
            animationTimingFunction: "linear",
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFallWizard {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── WhatsApp Icon ────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("fill-current", className)} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ─── Step Content Router ──────────────────────── */
interface StepContentProps {
  stepId: StepId;
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isBeginnerMode: boolean;
}

function StepContent({ stepId, onNext, onPrev, isBeginnerMode }: StepContentProps) {
  switch (stepId) {
    case "brand":
      return <BrandSetupStep onNext={onNext} isBeginnerMode={isBeginnerMode} />;
    case "contact":
      return <ContactInfoStep onNext={onNext} onPrev={onPrev} isBeginnerMode={isBeginnerMode} />;
    case "property":
      return <FirstPropertyStep onNext={onNext} onPrev={onPrev} isBeginnerMode={isBeginnerMode} />;
    case "domain":
      return <DomainSetupStep onNext={onNext} onPrev={onPrev} isBeginnerMode={isBeginnerMode} />;
    case "integrations":
      return <IntegrationsStep onNext={onNext} onPrev={onPrev} isBeginnerMode={isBeginnerMode} />;
  }
}
