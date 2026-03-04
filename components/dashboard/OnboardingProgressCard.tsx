"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import {
  CheckCircle2,
  Palette,
  Phone,
  Building2,
  Globe,
  Zap,
  ArrowLeft,
  Rocket,
  PartyPopper,
} from "lucide-react";
import type { OnboardingStep } from "@/store/onboarding";

const STEP_META: Record<
  OnboardingStep["id"],
  { Icon: React.ElementType; color: string; bgDone: string; bgPending: string }
> = {
  brand: {
    Icon: Palette,
    color: "#A78BFA",
    bgDone: "#F5F3FF",
    bgPending: "#FAFAFA",
  },
  contact: {
    Icon: Phone,
    color: "#34D399",
    bgDone: "#F0FBF5",
    bgPending: "#FAFAFA",
  },
  property: {
    Icon: Building2,
    color: "#60A5FA",
    bgDone: "#EFF6FF",
    bgPending: "#FAFAFA",
  },
  domain: {
    Icon: Globe,
    color: "#F97316",
    bgDone: "#FFF7ED",
    bgPending: "#FAFAFA",
  },
  integrations: {
    Icon: Zap,
    color: "#FBBF24",
    bgDone: "#FFFBEB",
    bgPending: "#FAFAFA",
  },
};

function getEncouragingMessage(percent: number): string {
  if (percent === 0) return "لنبدأ رحلتك العقارية! 🚀";
  if (percent < 40) return "بداية رائعة، واصل المسيرة! 💪";
  if (percent < 80) return "أنت في المنتصف، أكمل بثقة! ⭐";
  return "لخطوات قليلة وموقعك جاهز! 🎉";
}

export function OnboardingProgressCard() {
  const { steps, allCompleted } = useOnboardingStore();

  const completedCount = steps.filter((s) => s.completed || s.skipped).length;
  const total = steps.length;
  const percent = Math.round((completedCount / total) * 100);

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: "linear-gradient(135deg, #F0FBF5 0%, #E8F5EF 100%)",
          borderRadius: 16,
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #C6EDD8",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #4CAF82, #5BC4C0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(76,175,130,0.35)",
          }}
        >
          <PartyPopper size={20} color="#FFFFFF" />
        </div>
        <div>
          <div
            style={{ fontSize: 14, fontWeight: 700, color: "#1A3C34", marginBottom: 2 }}
          >
            أحسنت! موقعك جاهز تماماً ✅
          </div>
          <div style={{ fontSize: 12, color: "#4CAF82" }}>
            اكتملت جميع خطوات الإعداد بنجاح
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #E8F5EF",
      }}
    >
      {/* Gradient header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A3C34 0%, #2D6A5E 100%)",
          padding: "18px 20px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -24,
            right: -24,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -36,
            left: 8,
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "rgba(76,175,130,0.12)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 6,
            }}
          >
            <Rocket size={14} color="#5BC4C0" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#5BC4C0",
                letterSpacing: 0.4,
              }}
            >
              إعداد الموقع
            </span>
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: 4,
            }}
          >
            {getEncouragingMessage(percent)}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>
            {completedCount} من {total} خطوات مكتملة
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "14px 20px 4px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 7,
          }}
        >
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>التقدم الكلي</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1A3C34" }}>
            {percent}%
          </span>
        </div>
        <div
          style={{
            height: 7,
            background: "#F3F4F6",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #1A3C34, #4CAF82)",
              borderRadius: 99,
            }}
          />
        </div>
      </div>

      {/* Steps list */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <AnimatePresence initial={false}>
          {steps.map((step, index) => {
            const meta = STEP_META[step.id];
            const StepIcon = meta.Icon;
            const isDone = step.completed || step.skipped;

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: isDone ? meta.bgDone : meta.bgPending,
                  border: `1px solid ${isDone ? meta.color + "33" : "#F0F0F0"}`,
                  transition: "background 0.3s, border-color 0.3s",
                }}
              >
                {/* Icon circle */}
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: isDone ? meta.color + "22" : "#F3F4F6",
                    border: `1.5px solid ${isDone ? meta.color + "55" : "#E5E7EB"}`,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2
                      size={14}
                      color={meta.color}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <StepIcon size={13} color="#9CA3AF" />
                  )}
                </div>

                {/* Title & subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: isDone ? 600 : 500,
                      color: isDone ? "#1A1A1A" : "#6B7280",
                      marginBottom: 1,
                    }}
                  >
                    {step.title}
                  </div>
                  <div style={{ fontSize: 10, color: "#9CA3AF" }}>
                    {step.subtitle}
                  </div>
                </div>

                {/* Badge */}
                {step.skipped && !step.completed && (
                  <span
                    style={{
                      fontSize: 9,
                      color: "#9CA3AF",
                      background: "#F3F4F6",
                      padding: "2px 7px",
                      borderRadius: 99,
                      whiteSpace: "nowrap",
                    }}
                  >
                    متخطى
                  </span>
                )}
                {step.completed && (
                  <span
                    style={{
                      fontSize: 10,
                      color: meta.color,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                )}
                {!isDone && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#D1D5DB",
                      width: 18,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CTA Button */}
      <div style={{ padding: "4px 16px 18px" }}>
        <Link
          href="/dashboard/onboarding"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "11px 20px",
            background: "linear-gradient(135deg, #1A3C34 0%, #2D6A5E 100%)",
            color: "#FFFFFF",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            width: "100%",
            boxSizing: "border-box",
            transition: "opacity 0.2s, transform 0.15s",
            boxShadow: "0 4px 12px rgba(26,60,52,0.25)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.92";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {completedCount === 0 ? "ابدأ الإعداد الآن" : "أكمل الإعداد"}
          <ArrowLeft size={14} />
        </Link>
      </div>
    </motion.div>
  );
}
