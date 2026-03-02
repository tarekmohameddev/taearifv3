"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/store/onboarding";

interface StepIndicatorProps {
  steps: OnboardingStep[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const STEP_ICONS = ["🏷️", "📞", "🏠", "🔗"];

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full px-2">
      <div className="flex items-start justify-between relative">
        {/* Connecting lines behind circles */}
        <div
          className="absolute top-5 right-0 left-0 flex items-center"
          style={{ zIndex: 0, paddingRight: "2.5rem", paddingLeft: "2.5rem" }}
          aria-hidden="true"
        >
          {steps.slice(0, -1).map((step, idx) => {
            const isCompleted = step.completed || step.skipped;
            const nextCompleted = steps[idx + 1]?.completed || steps[idx + 1]?.skipped;
            const isPast = idx < currentStep;
            const filled = isCompleted && (nextCompleted || isPast || idx < currentStep);
            return (
              <div
                key={step.id + "-line"}
                className="flex-1 h-[2px] transition-colors duration-500"
                style={{
                  background: filled ? "#4CAF82" : "#E5E7EB",
                }}
              />
            );
          })}
        </div>

        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = step.completed;
          const isSkipped = step.skipped && !step.completed;
          const isClickable = onStepClick && (isCompleted || isSkipped || idx <= currentStep);

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 z-10"
              style={{ flex: 1 }}
            >
              <button
                type="button"
                onClick={() => isClickable && onStepClick?.(idx)}
                disabled={!isClickable}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  "border-2 shadow-sm",
                  isCompleted && "bg-[#4CAF82] border-[#4CAF82] text-white scale-105",
                  isActive && !isCompleted && "bg-[#1A3C34] border-[#1A3C34] text-white scale-110 shadow-md",
                  isSkipped && !isActive && "bg-[#F4F5F7] border-[#9CA3AF] text-[#9CA3AF]",
                  !isCompleted && !isActive && !isSkipped && idx > currentStep && "bg-white border-[#E5E7EB] text-[#9CA3AF]",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                aria-label={step.title}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                ) : (
                  <span>{STEP_ICONS[idx]}</span>
                )}
              </button>

              <div className="text-center max-w-[70px]">
                <p
                  className={cn(
                    "text-[11px] font-medium leading-tight",
                    isActive ? "text-[#1A3C34] font-semibold" : "text-[#9CA3AF]",
                    isCompleted && "text-[#4CAF82]",
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="mt-4 w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${(steps.filter((s) => s.completed || s.skipped).length / steps.length) * 100}%`,
            background: "linear-gradient(90deg, #1A3C34, #4CAF82)",
          }}
        />
      </div>
      <p className="text-right text-[11px] text-[#9CA3AF] mt-1">
        {steps.filter((s) => s.completed).length} من {steps.length} خطوات مكتملة
      </p>
    </div>
  );
}
