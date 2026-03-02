"use client";

import { useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import { StepIndicator } from "./StepIndicator";
import { BrandSetupStep } from "./steps/BrandSetupStep";
import { ContactInfoStep } from "./steps/ContactInfoStep";
import { FirstPropertyStep } from "./steps/FirstPropertyStep";
import { IntegrationsStep } from "./steps/IntegrationsStep";
import { OnboardingComplete } from "./OnboardingComplete";
import { cn } from "@/lib/utils";

export function OnboardingOverlay() {
  const {
    isOpen,
    currentStep,
    steps,
    allCompleted,
    closeOnboarding,
    goToStep,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) closeOnboarding();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOnboarding();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeOnboarding]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const renderStep = () => {
    if (allCompleted) {
      return <OnboardingComplete onClose={closeOnboarding} />;
    }

    switch (currentStep) {
      case 0:
        return <BrandSetupStep onNext={nextStep} />;
      case 1:
        return <ContactInfoStep onNext={nextStep} onPrev={prevStep} />;
      case 2:
        return <FirstPropertyStep onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <IntegrationsStep onNext={nextStep} onPrev={prevStep} />;
      default:
        return <BrandSetupStep onNext={nextStep} />;
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: "rgba(0, 0, 0, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label="معالج الإعداد"
    >
      <div
        ref={panelRef}
        className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          maxWidth: 620,
          maxHeight: "92vh",
          animation: "slideUp 0.3s ease-out",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]"
          style={{ background: "linear-gradient(135deg, #1A3C34 0%, #2D6A4F 100%)" }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4CAF82]" />
            <div>
              <p className="text-white font-bold text-sm">إعداد الموقع</p>
              <p className="text-[#4CAF82] text-[11px]">
                {allCompleted
                  ? "اكتمل الإعداد 🎉"
                  : `خطوة ${currentStep + 1} من ${steps.length}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeOnboarding}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Step Indicator (hidden on completion screen) ── */}
        {!allCompleted && (
          <div className="px-6 pt-5 pb-3">
            <StepIndicator steps={steps} currentStep={currentStep} onStepClick={goToStep} />
          </div>
        )}

        {/* ── Content ── */}
        <div
          className="flex-1 overflow-y-auto px-6 pb-6"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#E5E7EB transparent" }}
        >
          <div
            key={allCompleted ? "complete" : currentStep}
            className="pt-2"
            style={{ animation: "fadeSlide 0.25s ease-out" }}
          >
            {renderStep()}
          </div>
        </div>
      </div>

      {/* ── Global animations ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
