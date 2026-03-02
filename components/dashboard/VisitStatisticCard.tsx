"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

const sparkData1 = [
  { v: 20 }, { v: 35 }, { v: 28 }, { v: 45 }, { v: 32 }, { v: 50 }, { v: 38 },
  { v: 55 }, { v: 40 }, { v: 60 }, { v: 45 }, { v: 65 },
];

const sparkData2 = [
  { v: 30 }, { v: 20 }, { v: 40 }, { v: 25 }, { v: 50 }, { v: 35 }, { v: 55 },
  { v: 30 }, { v: 45 }, { v: 20 }, { v: 40 }, { v: 32 },
];

export function VisitStatisticCard() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1A1A1A", marginBottom: 16 }}>
        إحصائيات الزيارات
      </h3>

      <div className="flex items-stretch gap-6">
        {/* Left Column: Days + Sparkline */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            {["السبت", "الأحد", "الاثنين"].map((day) => (
              <span key={day} style={{ fontSize: 11, color: "#9CA3AF" }}>{day}</span>
            ))}
          </div>
          <div style={{ height: 40, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData1}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#D4E157"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "#E5E7EB", alignSelf: "stretch" }} />

        {/* Right Column: Rate + Sparkline */}
        <div className="flex-1">
          <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>المعدل</div>
          <div style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
            32.43%
          </div>
          <div style={{ height: 40, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData2}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="#5BC4C0"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
