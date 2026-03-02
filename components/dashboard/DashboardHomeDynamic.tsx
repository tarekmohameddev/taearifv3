"use client";

import dynamic from "next/dynamic";

const DashboardHome = dynamic(
  () => import("@/components/dashboard/DashboardHome").then((m) => m.DashboardHome),
  {
    loading: () => (
      <div
        style={{
          minHeight: "100%",
          background: "#F4F5F7",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Skeleton loading */}
        <div style={{ display: "grid", gridTemplateColumns: "66fr 34fr", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 235, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: 320, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ height: 200, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: 100, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: 130, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
            <div style={{ height: 160, background: "#E5E7EB", borderRadius: 16, animation: "pulse 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export function DashboardHomeDynamic() {
  return <DashboardHome />;
}
