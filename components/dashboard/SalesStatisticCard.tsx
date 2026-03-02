"use client";

import { BarChart3 } from "lucide-react";

export function SalesStatisticCard() {
  const profitProgress = 65;

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start gap-4">
        {/* Chart Icon */}
        <div
          style={{
            width: 40,
            height: 40,
            background: "#F4F5F7",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <BarChart3 style={{ width: 20, height: 20, color: "#9CA3AF" }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            {/* Total Profit */}
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>إجمالي الربح</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.2 }}>$24.9k</div>
            </div>
            {/* Visitors */}
            <div className="text-left">
              <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>الزوار</div>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF82", display: "inline-block" }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>$24k</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: 10 }}>
            <div style={{ height: 5, background: "#E0E0E0", borderRadius: 4, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${profitProgress}%`,
                  background: "#4CAF82",
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
