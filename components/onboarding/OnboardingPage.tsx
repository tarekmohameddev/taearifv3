"use client";

import { useState, useEffect } from "react";
import { Check, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { BrandSetupStep } from "./steps/BrandSetupStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { FirstPropertyStep } from "./steps/FirstPropertyStep";
import { IntegrationsStep } from "./steps/IntegrationsStep";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    id: "brand" as const,
    index: 0,
    icon: "🏷️",
    title: "هوية الموقع",
    subtitle: "اسم الموقع، الشعار، والألوان",
    color: "#1A3C34",
    bg: "#E8F5EF",
  },
  {
    id: "contact" as const,
    index: 1,
    icon: "📞",
    title: "بيانات التواصل",
    subtitle: "الهاتف، البريد الإلكتروني، العنوان",
    color: "#4A90A4",
    bg: "#EBF4F8",
  },
  {
    id: "property" as const,
    index: 2,
    icon: "🏠",
    title: "أول عقار",
    subtitle: "أضف أول عقار لموقعك",
    color: "#E07A3A",
    bg: "#FEF3EC",
  },
  {
    id: "integrations" as const,
    index: 3,
    icon: "🔗",
    title: "الربط والتكامل",
    subtitle: "واتساب وميتا بيكسل",
    color: "#8B5CF6",
    bg: "#F3EEFF",
  },
];

export function OnboardingPage() {
  const { steps, currentStep, goToStep, resetOnboarding } = useOnboardingStore();
  const [expandedStep, setExpandedStep] = useState<number>(currentStep);

  const completedCount = steps.filter((s) => s.completed || s.skipped).length;
  const totalCount = steps.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);
  const allDone = completedCount === totalCount;

  // Keep expanded step in sync with store current step
  useEffect(() => {
    setExpandedStep(currentStep);
  }, [currentStep]);

  const handleToggle = (index: number) => {
    setExpandedStep((prev) => (prev === index ? -1 : index));
    goToStep(index);
  };

  const handleNext = (index: number) => {
    const nextIndex = index + 1;
    if (nextIndex < STEPS.length) {
      goToStep(nextIndex);
      setExpandedStep(nextIndex);
    } else {
      // All done — collapse all
      setExpandedStep(-1);
    }
  };

  const handlePrev = (index: number) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      goToStep(prevIndex);
      setExpandedStep(prevIndex);
    }
  };

  return (
    <div className="min-h-full p-6" style={{ background: "#F4F5F7" }} dir="rtl">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* ── Hero banner ── */}
        <div
          className="rounded-2xl p-6 overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #1A3C34 0%, #2D6A4F 100%)" }}
        >
          {/* Decorative circles */}
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-10 bg-white" />
          <div className="absolute -left-4 -bottom-8 w-24 h-24 rounded-full opacity-10 bg-white" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                {allDone ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-[#4CAF82] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-[#4CAF82] text-sm font-semibold">اكتمل الإعداد</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">موقعك جاهز! 🎉</h1>
                    <p className="text-white/70 text-sm">يمكنك الآن تعديل أي خطوة في أي وقت.</p>
                  </>
                ) : (
                  <>
                    <p className="text-[#4CAF82] text-sm font-semibold mb-1">مرحباً بك 👋</p>
                    <h1 className="text-2xl font-bold text-white mb-1">أكمل إعداد موقعك</h1>
                    <p className="text-white/70 text-sm">
                      {completedCount === 0
                        ? "ابدأ بإكمال الخطوات أدناه لتشغيل موقعك"
                        : `أنجزت ${completedCount} من ${totalCount} خطوات — استمر!`}
                    </p>
                  </>
                )}
              </div>

              {/* Reset button (dev/testing) */}
              <button
                type="button"
                onClick={resetOnboarding}
                className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors text-xs mt-1 flex-shrink-0"
                title="إعادة تعيين (للاختبار)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs">التقدم الإجمالي</span>
                <span className="text-white font-bold text-sm">{progressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg, #4CAF82, #5BC4C0)",
                  }}
                />
              </div>
              <div className="flex gap-3 mt-3">
                {STEPS.map((s, i) => {
                  const stepState = steps[i];
                  const done = stepState?.completed || stepState?.skipped;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleToggle(i)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all",
                        done
                          ? "bg-[#4CAF82] text-white"
                          : expandedStep === i
                          ? "bg-white text-[#1A3C34]"
                          : "bg-white/15 text-white/70 hover:bg-white/25"
                      )}
                    >
                      {done ? <Check className="w-3 h-3" strokeWidth={2.5} /> : <span>{s.icon}</span>}
                      <span>{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Step cards ── */}
        <div className="space-y-3">
          {STEPS.map((step) => {
            const stepState = steps.find((s) => s.id === step.id);
            const isCompleted = stepState?.completed ?? false;
            const isSkipped = stepState?.skipped ?? false;
            const isDone = isCompleted || isSkipped;
            const isExpanded = expandedStep === step.index;

            return (
              <div
                key={step.id}
                className={cn(
                  "rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "border-[#1A3C34] shadow-md"
                    : isDone
                    ? "border-[#4CAF82]/40"
                    : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                )}
              >
                {/* Card header — always visible */}
                <button
                  type="button"
                  onClick={() => handleToggle(step.index)}
                  className="w-full flex items-center gap-4 p-5 text-right"
                >
                  {/* Step icon / status */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all",
                      isDone ? "bg-[#E8F5EF]" : `opacity-90`
                    )}
                    style={{ background: isDone ? "#E8F5EF" : step.bg }}
                  >
                    {isDone ? (
                      <span className="text-2xl">{step.icon}</span>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1A1A1A] text-base">{step.title}</span>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-[#4CAF82] px-2 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" strokeWidth={3} /> مكتمل
                        </span>
                      )}
                      {isSkipped && !isCompleted && (
                        <span className="text-[10px] font-semibold text-[#9CA3AF] bg-[#F4F5F7] px-2 py-0.5 rounded-full">
                          متخطى
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6B7280] mt-0.5">{step.subtitle}</p>
                  </div>

                  <div className="flex-shrink-0 text-[#9CA3AF]">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Card body — visible when expanded */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-[#F4F5F7]">
                    <div className="pt-4">
                      <StepContent
                        stepId={step.id}
                        onNext={() => handleNext(step.index)}
                        onPrev={() => handlePrev(step.index)}
                        isFirstStep={step.index === 0}
                        isLastStep={step.index === STEPS.length - 1}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── All done message ── */}
        {allDone && (
          <div className="rounded-2xl border border-[#4CAF82]/30 bg-[#E8F5EF] p-6 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h3 className="font-bold text-[#1A3C34] text-lg">أحسنت! موقعك جاهز للانطلاق</h3>
            <p className="text-sm text-[#374151]">
              يمكنك دائماً العودة لهذه الصفحة لتعديل أي معلومات.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step content router ─────────────────────── */
interface StepContentProps {
  stepId: "brand" | "contact" | "property" | "integrations";
  onNext: () => void;
  onPrev: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

function StepContent({ stepId, onNext, onPrev, isFirstStep }: StepContentProps) {
  switch (stepId) {
    case "brand":
      return <BrandSetupStep onNext={onNext} />;
    case "contact":
      return <ContactInfoStep onNext={onNext} onPrev={onPrev} />;
    case "property":
      return <FirstPropertyStep onNext={onNext} onPrev={onPrev} />;
    case "integrations":
      return <IntegrationsStep onNext={onNext} onPrev={onPrev} />;
  }
}
