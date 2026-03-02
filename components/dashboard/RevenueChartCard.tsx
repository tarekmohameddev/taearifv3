"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTHS_SHORT = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

const DATA = [
  { month: "يناير",   income: 650,  expenses: 320, profit: 330 },
  { month: "فبراير",  income: 720,  expenses: 380, profit: 340 },
  { month: "مارس",    income: 680,  expenses: 300, profit: 380 },
  { month: "أبريل",   income: 800,  expenses: 420, profit: 380 },
  { month: "مايو",    income: 900,  expenses: 350, profit: 550 },
  { month: "يونيو",   income: 850,  expenses: 400, profit: 450 },
  { month: "يوليو",   income: 950,  expenses: 380, profit: 570 },
  { month: "أغسطس",  income: 1050, expenses: 450, profit: 600 },
  { month: "سبتمبر", income: 980,  expenses: 420, profit: 560 },
  { month: "أكتوبر", income: 1100, expenses: 500, profit: 600 },
  { month: "نوفمبر", income: 1020, expenses: 460, profit: 560 },
  { month: "ديسمبر", income: 1150, expenses: 480, profit: 670 },
];

const FILTERS = [
  { id: "all",      label: "الكل" },
  { id: "income",   label: "الدخل" },
  { id: "expenses", label: "المصروفات" },
  { id: "profit",   label: "الربح" },
];

const METRICS = [
  { id: "income",   label: "الدخل",        value: "$26,000", change: "+12%", up: true,  color: "#2D6A4F", dotColor: "#2D6A4F" },
  { id: "expenses", label: "المصروفات",    value: "$12,480", change: "-5%",  up: false, color: "#E07A3A", dotColor: "#E07A3A" },
  { id: "profit",   label: "الربح الصافي", value: "$13,520", change: "+18%", up: true,  color: "#5BC4C0", dotColor: "#5BC4C0" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: "#1F2937",
        borderRadius: 8,
        padding: "10px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        minWidth: 130,
      }}
    >
      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: entry.color, display: "inline-block" }} />
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>
              {entry.dataKey === "income" ? "دخل" : entry.dataKey === "expenses" ? "مصروف" : "ربح"}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: "#FFFFFF" }}>${entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function RevenueChartCard() {
  const [activeFilter, setActiveFilter] = useState("all");

  const showIncome   = activeFilter === "all" || activeFilter === "income";
  const showExpenses = activeFilter === "all" || activeFilter === "expenses";
  const showProfit   = activeFilter === "all" || activeFilter === "profit";

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 }}>الإيرادات</h3>
          <p style={{ fontSize: 11, color: "#9CA3AF" }}>إيراداتك هذا العام</p>
        </div>
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: activeFilter === f.id ? 600 : 500,
                background: activeFilter === f.id ? "#1A3C34" : "transparent",
                color: activeFilter === f.id ? "#FFFFFF" : "#9CA3AF",
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="flex items-center gap-10 mb-4">
        {METRICS.map((m) => (
          <div key={m.id} className="flex items-center gap-2">
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: m.dotColor,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{m.label}</div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A" }}>{m.value}</span>
                <span
                  className="flex items-center gap-0.5"
                  style={{ fontSize: 12, fontWeight: 500, color: m.up ? "#4CAF82" : "#E07A3A" }}
                >
                  {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {m.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "4 4" }} />
          {showIncome && (
            <Line
              type="monotone"
              dataKey="income"
              stroke="#2D6A4F"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#2D6A4F", strokeWidth: 0 }}
            />
          )}
          {showExpenses && (
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#E07A3A"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#E07A3A", strokeWidth: 0 }}
            />
          )}
          {showProfit && (
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#5BC4C0"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "#5BC4C0", strokeWidth: 0 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
