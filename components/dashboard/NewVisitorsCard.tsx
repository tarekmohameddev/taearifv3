"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";

const BAR_DATA = [
  { label: "يوليو",   value: 60,  highlight: false },
  { label: "أغسطس",  value: 80,  highlight: false },
  { label: "سبتمبر", value: 55,  highlight: false },
  { label: "أكتوبر", value: 90,  highlight: false },
  { label: "نوفمبر", value: 70,  highlight: false },
  { label: "ديسمبر", value: 100, highlight: true  },
];

const MAX_VALUE = Math.max(...BAR_DATA.map((d) => d.value));
const CHART_HEIGHT = 70;

export function NewVisitorsCard() {
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, margin: "-40px" });

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A" }}>زوار جدد</h3>
        {/* Dec badge */}
        <span
          style={{
            background: "#1A3C34",
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 500,
            padding: "2px 8px",
            borderRadius: 8,
          }}
        >
          $2.2k
        </span>
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>48% زوار جدد هذا الأسبوع.</p>

      {/* Value + Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>12,480</span>
        <span
          className="flex items-center gap-1"
          style={{ fontSize: 12, fontWeight: 500, color: "#4CAF82" }}
        >
          <TrendingUp size={12} />
          28
        </span>
      </div>

      {/* Bar Chart */}
      <div ref={chartRef} style={{ height: CHART_HEIGHT, display: "flex", alignItems: "flex-end", gap: 8 }}>
        {BAR_DATA.map((bar, i) => {
          const barHeight = (bar.value / MAX_VALUE) * CHART_HEIGHT;
          return (
            <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
              <motion.div
                style={{
                  width: "100%",
                  maxWidth: 16,
                  background: bar.highlight ? "#4A90A4" : "#E0E0E0",
                  borderRadius: "4px 4px 0 0",
                  margin: "0 auto",
                }}
                initial={{ height: 0 }}
                animate={{ height: inView ? barHeight : 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 + i * 0.07 }}
              />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
