"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Globe, MessageCircle, Users, TrendingUp, Target, ChevronLeft, ChevronRight, X, Lightbulb } from "lucide-react";

type InsightPriority = "urgent" | "opportunity" | "tip" | "reward" | "analytics";

interface SmartInsight {
  id: string;
  priority: InsightPriority;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  reward?: string;
  rewardIcon?: string;
  cta: string;
  ctaHref: string;
  ctaBg: string;
  cardBg: string;
  accentColor: string;
  pulse?: boolean;
}

const INSIGHTS: SmartInsight[] = [
  {
    id: "followup",
    priority: "urgent",
    badge: "عاجل",
    badgeColor: "#E07A3A",
    icon: <Users size={18} />,
    iconBg: "rgba(224, 122, 58, 0.13)",
    title: "3 عملاء ينتظرون ردك",
    description: "لديك 3 عملاء لم تتواصل معهم منذ 48 ساعة. لا تفوّت الفرصة!",
    cta: "تابع الآن",
    ctaHref: "/dashboard/customers",
    ctaBg: "#E07A3A",
    cardBg: "#FFFAF6",
    accentColor: "#E07A3A",
    pulse: true,
  },
  {
    id: "whatsapp",
    priority: "opportunity",
    badge: "فرصة ذهبية",
    badgeColor: "#4CAF82",
    icon: <MessageCircle size={18} />,
    iconBg: "rgba(76, 175, 130, 0.13)",
    title: "15 عقار جاهز للإيجار",
    description: "ابدأ حملة واتساب الآن لعملائك وحوّل عقاراتك إلى دخل شهري ثابت.",
    reward: "💰 حتى 50,000 ريال / شهر",
    cta: "ابدأ الحملة",
    ctaHref: "/dashboard/whatsapp-management",
    ctaBg: "#4CAF82",
    cardBg: "#F6FDF9",
    accentColor: "#4CAF82",
  },
  {
    id: "domain",
    priority: "tip",
    badge: "زيادة الثقة",
    badgeColor: "#4A90A4",
    icon: <Globe size={18} />,
    iconBg: "rgba(74, 144, 164, 0.13)",
    title: "ربط دومينك يضاعف ثقة العملاء",
    description: "العملاء يثقون أكثر بالشركات ذات الدومين المخصص. الإعداد يأخذ دقيقتين فقط.",
    reward: "🏆 +40% ثقة من العملاء",
    cta: "ربط الدومين",
    ctaHref: "/dashboard/settings",
    ctaBg: "#4A90A4",
    cardBg: "#F5FAFB",
    accentColor: "#4A90A4",
  },
  {
    id: "profile",
    priority: "reward",
    badge: "اكتمال الملف",
    badgeColor: "#8B5CF6",
    icon: <Target size={18} />,
    iconBg: "rgba(139, 92, 246, 0.13)",
    title: "ملفك مكتمل 70% فقط",
    description: "أضف شعارك وبياناتك التجارية لتحصل على ظهور أكبر وعملاء أكثر.",
    reward: "⭐ +30% ظهور في النتائج",
    cta: "أكمل الملف",
    ctaHref: "/dashboard/settings",
    ctaBg: "#8B5CF6",
    cardBg: "#FAF7FF",
    accentColor: "#8B5CF6",
  },
  {
    id: "analytics",
    priority: "analytics",
    badge: "تقرير الأسبوع",
    badgeColor: "#5BC4C0",
    icon: <TrendingUp size={18} />,
    iconBg: "rgba(91, 196, 192, 0.13)",
    title: "زيارات عقاراتك ارتفعت 23%",
    description: "هذا الأسبوع شهد أعلى معدل زيارات منذ شهرين. استثمر هذا الزخم الآن!",
    reward: "📈 +23% هذا الأسبوع",
    cta: "عرض التفاصيل",
    ctaHref: "/dashboard/analytics",
    ctaBg: "#5BC4C0",
    cardBg: "#F4FBFB",
    accentColor: "#5BC4C0",
  },
  {
    id: "sms",
    priority: "opportunity",
    badge: "تسويق",
    badgeColor: "#F59E0B",
    icon: <Lightbulb size={18} />,
    iconBg: "rgba(245, 158, 11, 0.13)",
    title: "أرسل عروضك عبر SMS",
    description: "عملاؤك لم يروا عقاراتك الجديدة. حملة SMS واحدة تصل لهم فوراً.",
    reward: "🚀 وصول فوري لعملائك",
    cta: "إنشاء حملة",
    ctaHref: "/dashboard/sms-campaigns",
    ctaBg: "#F59E0B",
    cardBg: "#FFFDF4",
    accentColor: "#F59E0B",
  },
];

const PRIORITY_ORDER: InsightPriority[] = ["urgent", "opportunity", "reward", "analytics", "tip"];

function InsightCard({
  insight,
  onDismiss,
}: {
  insight: SmartInsight;
  onDismiss: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const handleDismiss = useCallback(() => {
    setDismissing(true);
    setTimeout(() => onDismiss(insight.id), 280);
  }, [insight.id, onDismiss]);

  return (
    <>
      <style>{`
        @keyframes si-pulse-ring {
          0%   { box-shadow: 0 0 0 0 ${insight.accentColor}55; }
          70%  { box-shadow: 0 0 0 8px ${insight.accentColor}00; }
          100% { box-shadow: 0 0 0 0 ${insight.accentColor}00; }
        }
        @keyframes si-slide-in {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes si-slide-out {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.93); }
        }
        @keyframes si-reward-bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-2px); }
        }
        .si-reward-pill { animation: si-reward-bounce 2.4s ease-in-out infinite; }
      `}</style>
      <div
        style={{
          flexShrink: 0,
          width: 270,
          background: insight.cardBg,
          borderRadius: 14,
          border: `1px solid ${insight.accentColor}28`,
          borderRightWidth: 3,
          borderRightColor: insight.accentColor,
          padding: "14px 14px 12px",
          position: "relative",
          scrollSnapAlign: "start",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.28s ease",
          transform: dismissing ? "scale(0.93)" : hovered ? "translateY(-2px)" : "none",
          opacity: dismissing ? 0 : 1,
          boxShadow: insight.pulse && !hovered
            ? undefined
            : hovered
            ? `0 6px 20px ${insight.accentColor}30`
            : "0 2px 8px rgba(0,0,0,0.05)",
          animation: dismissing
            ? "si-slide-out 0.28s ease forwards"
            : `si-slide-in 0.35s ease both, ${
                insight.pulse
                  ? "si-pulse-ring 2.2s ease-in-out 0.4s infinite"
                  : ""
              }`,
          cursor: "default",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          title="إخفاء"
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 20,
            height: 20,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            color: "#9CA3AF",
            padding: 0,
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F3F4F6";
            e.currentTarget.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#9CA3AF";
          }}
        >
          <X size={12} />
        </button>

        {/* Badge Row */}
        <div className="flex items-center justify-between mb-2" style={{ paddingLeft: 0 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: insight.badgeColor,
              background: `${insight.badgeColor}18`,
              borderRadius: 20,
              padding: "2px 8px",
              letterSpacing: 0.3,
            }}
          >
            {insight.badge}
          </span>
          {insight.reward && (
            <span
              className="si-reward-pill"
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: insight.accentColor,
                background: `${insight.accentColor}12`,
                borderRadius: 20,
                padding: "2px 7px",
                marginLeft: 20,
              }}
            >
              {insight.reward}
            </span>
          )}
        </div>

        {/* Icon + Title */}
        <div className="flex items-start gap-2.5 mb-2">
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: insight.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: insight.accentColor,
            }}
          >
            {insight.icon}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.35, paddingTop: 2 }}>
            {insight.title}
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 11.5,
            color: "#6B7280",
            lineHeight: 1.55,
            marginBottom: 12,
            paddingRight: 2,
          }}
        >
          {insight.description}
        </p>

        {/* CTA Button */}
        <Link
          href={insight.ctaHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            background: insight.ctaBg,
            color: "#FFFFFF",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.15s, transform 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {insight.cta}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M7 5H3M3 5L5 3M3 5L5 7" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </>
  );
}

export function SmartInsightsStrip() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleInsights = INSIGHTS
    .filter((i) => !dismissed.has(i.id))
    .sort((a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority));

  const handleDismiss = useCallback((id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -290 : 290, behavior: "smooth" });
  }, []);

  if (visibleInsights.length === 0) return null;

  const urgentCount = visibleInsights.filter((i) => i.priority === "urgent").length;

  return (
    <>
      <style>{`
        .si-scroll::-webkit-scrollbar { display: none; }
        .si-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes si-header-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
      `}</style>
      <div style={{ marginBottom: 20 }}>
        {/* Strip Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              توصيات ذكية
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#FFFFFF",
                background: urgentCount > 0 ? "#E07A3A" : "#4CAF82",
                borderRadius: 20,
                padding: "1px 7px",
                animation: urgentCount > 0 ? "si-header-pulse 1.8s ease-in-out infinite" : "none",
              }}
            >
              {visibleInsights.length}
            </span>
            {urgentCount > 0 && (
              <span style={{ fontSize: 11, color: "#E07A3A", fontWeight: 500 }}>
                · {urgentCount} تحتاج تصرفاً عاجلاً
              </span>
            )}
          </div>

          {/* Scroll controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("right")}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6B7280",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F4F5F7";
                e.currentTarget.style.borderColor = "#D1D5DB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => scroll("left")}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid #E5E7EB",
                background: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#6B7280",
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#F4F5F7";
                e.currentTarget.style.borderColor = "#D1D5DB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>

        {/* Scrollable Cards Row */}
        <div
          ref={scrollRef}
          className="si-scroll"
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            paddingRight: 2,
          }}
        >
          {visibleInsights.map((insight, idx) => (
            <div
              key={insight.id}
              style={{ animation: `si-slide-in 0.35s ease ${idx * 0.06}s both` }}
            >
              <InsightCard insight={insight} onDismiss={handleDismiss} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
