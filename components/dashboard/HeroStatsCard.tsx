"use client";

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
      <div style={{ height: 5, background: "#E0E0E0", borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${percentage}%`,
            background: fillColor,
            borderRadius: 4,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

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
        minHeight: 235,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top Stats Row */}
      <div className="flex items-start gap-10">
        <div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>إجمالي العقارات</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
            2,560
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>نسبة الإشغال</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
            40.0%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>للإيجار</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
            1,340
          </div>
        </div>
      </div>

      {/* Decorative House SVG (absolute right) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "45%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: 0.08,
        }}
      >
        <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <path d="M100 10 L190 80 L190 170 L10 170 L10 80 Z" fill="#1A3C34" />
          <rect x="75" y="100" width="50" height="70" fill="#E8F5EF" />
          <rect x="130" y="110" width="40" height="40" fill="#E8F5EF" />
          <rect x="30" y="110" width="40" height="40" fill="#E8F5EF" />
        </svg>
      </div>

      {/* Sub-metric Cards at bottom */}
      <div className="flex gap-3 mt-auto pt-5">
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
