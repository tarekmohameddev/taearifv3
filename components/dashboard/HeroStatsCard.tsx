"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, DollarSign } from "lucide-react";

interface SubMetricCardProps {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
  percentage: number;
  fillColor: string;
}

function SubMetricCard({ icon, iconColor, label, value, percentage, fillColor }: SubMetricCardProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: "-40px" });

  return (
    <div
      style={{
        flex: 1,
        background: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "12px 16px",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span style={{ color: iconColor }}>{icon}</span>
          <span style={{ fontSize: 12, color: "#6B7280" }}>{label}</span>
        </div>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF" }}>{percentage}%</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>
        {value}
      </div>
      {/* Progress Bar */}
      <div ref={barRef} style={{ height: 5, background: "#E0E0E0", borderRadius: 4, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: fillColor, borderRadius: 4 }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${percentage}%` : 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}

const ALL_STATS = [
  { label: "إجمالي العقارات", value: "2,560" },
  { label: "نسبة الإشغال",    value: "40.0%" },
  { label: "للإيجار",          value: "1,340" },
  { label: "للبيع",            value: "820"   },
  { label: "مؤجرة",           value: "486"   },
  { label: "مباعة",            value: "254"   },
];

export function HeroStatsCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Decorative house — centered, behind content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: 0.05,
        }}
      >
        <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "55%", height: "55%" }}>
          <path d="M100 10 L190 80 L190 170 L10 170 L10 80 Z" fill="#1A3C34" />
          <rect x="75" y="100" width="50" height="70" fill="#1A3C34" />
          <rect x="130" y="110" width="40" height="40" fill="#1A3C34" />
          <rect x="30" y="110" width="40" height="40" fill="#1A3C34" />
        </svg>
      </div>

      {/* 6 uniform stats — 3 columns × 2 rows */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {ALL_STATS.map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Sub-metric Cards at bottom */}
      <div
        style={{ borderTop: "1px solid #F3F4F6", marginTop: 20 }}
        className="flex gap-3 pt-5"
      >
        <SubMetricCard
          icon={<CheckCircle2 size={20} />}
          iconColor="#4CAF82"
          label="الصفقات المكتملة"
          value="1,250"
          percentage={80}
          fillColor="#4CAF82"
        />
        <SubMetricCard
          icon={<DollarSign size={20} />}
          iconColor="#5BC4C0"
          label="إجمالي الإيرادات"
          value="$125,541"
          percentage={34}
          fillColor="#5BC4C0"
        />
      </div>
    </div>
  );
}
