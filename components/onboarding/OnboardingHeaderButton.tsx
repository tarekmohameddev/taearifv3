"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function OnboardingHeaderButton() {
  const { allCompleted, steps } = useOnboardingStore();
  const pathname = usePathname();

  const completedCount = steps.filter((s) => s.completed || s.skipped).length;
  const total = steps.length;
  const percent = Math.round((completedCount / total) * 100);
  const isIncomplete = !allCompleted && completedCount < total;
  const isOnOnboardingPage = pathname?.includes("/dashboard/onboarding");

  // SVG circular progress
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/dashboard/onboarding"
            className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3C34]",
              isOnOnboardingPage && "bg-white/80"
            )}
            style={{ width: 40, height: 40 }}
            aria-label="إعداد الموقع"
          >
            {/* Circular progress ring */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              className="absolute inset-0"
              aria-hidden="true"
              style={{ transform: "rotate(-90deg)" }}
            >
              {/* Track */}
              <circle
                cx="20"
                cy="20"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2.5"
              />
              {/* Progress arc */}
              {percent > 0 && (
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  fill="none"
                  stroke={allCompleted ? "#4CAF82" : "#1A3C34"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
                />
              )}
            </svg>

            {/* Rocket icon */}
            <Rocket
              className={cn(
                "w-4 h-4 relative z-10 transition-colors",
                isOnOnboardingPage
                  ? "text-[#1A3C34]"
                  : allCompleted
                  ? "text-[#4CAF82]"
                  : "text-[#6B7280]",
              )}
            />

            {/* Pulsing orange dot — only when incomplete and not already on the page */}
            {isIncomplete && !isOnOnboardingPage && (
              <span className="absolute top-[7px] left-[7px] z-20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E07A3A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E07A3A]" />
                </span>
              </span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium" dir="rtl">
          {allCompleted ? (
            <span className="text-[#4CAF82]">✓ اكتمل الإعداد</span>
          ) : (
            <span>إعداد الموقع — {completedCount}/{total} خطوات</span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
