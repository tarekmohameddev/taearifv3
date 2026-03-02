"use client";

import { HeroStatsCard } from "./HeroStatsCard";
import { RevenueChartCard } from "./RevenueChartCard";
import { AIPromoCard } from "./AIPromoCard";
import { SalesStatisticCard } from "./SalesStatisticCard";
import { VisitStatisticCard } from "./VisitStatisticCard";
import { NewVisitorsCard } from "./NewVisitorsCard";
import { ListingBoard } from "./ListingBoard";
import useAuthStore from "@/context/AuthContext";

export function DashboardHome() {
  const { userData } = useAuthStore();
  const firstName = userData?.name?.split(" ")[0] ?? "مستخدم";

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#F4F5F7",
        padding: 24,
        fontFamily: "Inter, Poppins, DM Sans, system-ui, sans-serif",
      }}
    >
      {/* Welcome Row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>
            مرحباً، {firstName} 👋
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280" }}>
            إليك ملخص لوحة تحكمك العقارية اليوم
          </p>
        </div>
        <div style={{ fontSize: 12, color: "#9CA3AF" }}>
          {new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Main 2-Column Grid: 66% left / 34% right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "66fr 34fr",
          gap: 20,
          marginBottom: 20,
          alignItems: "start",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <HeroStatsCard />
          <RevenueChartCard />
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <AIPromoCard />
          <SalesStatisticCard />
          <VisitStatisticCard />
          <NewVisitorsCard />
        </div>
      </div>

      {/* Listing Board — Full Width */}
      <ListingBoard />
    </div>
  );
}
