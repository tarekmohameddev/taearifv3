"use client";

import { motion } from "framer-motion";
import { HeroStatsCard } from "./HeroStatsCard";
import { RevenueChartCard } from "./RevenueChartCard";
import { AIPromoCard } from "./AIPromoCard";
import { SalesStatisticCard } from "./SalesStatisticCard";
import { VisitStatisticCard } from "./VisitStatisticCard";
import { NewVisitorsCard } from "./NewVisitorsCard";
import { ListingBoard } from "./ListingBoard";
import { SmartInsightsStrip } from "./SmartInsightsStrip";
import useAuthStore from "@/context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const hoverLift = {
  y: -4,
  boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
  transition: { type: "spring" as const, stiffness: 280, damping: 22 },
};

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
      <motion.div
        className="flex items-center justify-between mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
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
      </motion.div>

      {/* Smart Insights Strip */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.07}>
        <SmartInsightsStrip />
      </motion.div>

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
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.13} whileHover={hoverLift}>
            <HeroStatsCard />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.21} whileHover={hoverLift}>
            <RevenueChartCard />
          </motion.div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.17} whileHover={hoverLift}>
            <AIPromoCard />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.24} whileHover={hoverLift}>
            <SalesStatisticCard />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.30} whileHover={hoverLift}>
            <VisitStatisticCard />
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.36} whileHover={hoverLift}>
            <NewVisitorsCard />
          </motion.div>
        </div>
      </div>

      {/* Listing Board — Full Width */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.42}>
        <ListingBoard />
      </motion.div>
    </div>
  );
}
