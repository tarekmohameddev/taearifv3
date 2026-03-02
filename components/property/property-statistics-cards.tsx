"use client";
import { useState, useEffect } from "react";
import { Tag, Key, Building2, TrendingUp } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface PropertyStatistics {
  for_sale: number;
  for_rent: number;
  complete_count: number;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  accentColor: string;
  loading?: boolean;
}

function StatCard({ title, value, icon: Icon, iconColor, iconBg, accentColor, loading }: StatCardProps) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        padding: "20px 24px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        transition: "box-shadow 0.25s, transform 0.25s",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
        borderTop: `3px solid ${accentColor}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.10)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -20,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: iconBg,
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, fontWeight: 500, letterSpacing: "0.02em" }}>
          {title}
        </p>
        {loading ? (
          <div
            style={{
              width: 64,
              height: 34,
              background: "#E5E7EB",
              borderRadius: 8,
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        ) : (
          <p style={{ fontSize: 34, fontWeight: 800, color: "#111827", lineHeight: 1, letterSpacing: "-0.02em" }}>
            {value}
          </p>
        )}
      </div>

      <div
        style={{
          width: 54,
          height: 54,
          background: iconBg,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 4px 12px ${iconColor}22`,
        }}
      >
        <Icon style={{ width: 24, height: 24, color: iconColor }} />
      </div>
    </div>
  );
}

export const PropertyStatisticsCards = () => {
  const [statistics, setStatistics] = useState<PropertyStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const { userData } = useAuthStore.getState();
      if (!userData?.token) {
        setLoading(false);
        setError("Authentication required.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/properties/cards");
        const { data } = response.data;
        if (data && typeof data === "object") {
          setStatistics({
            for_sale:       data.complete?.for_sale   || 0,
            for_rent:       data.complete?.for_rent   || 0,
            complete_count: data.complete_count       || 0,
          });
        } else {
          setError("Invalid response format");
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "حدث خطأ أثناء جلب الإحصائيات";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const cards = [
    {
      title:        "إجمالي الوحدات",
      value:        statistics?.complete_count ?? 0,
      icon:         Building2,
      iconColor:    "#1A3C34",
      iconBg:       "#E8F5EF",
      accentColor:  "#1A3C34",
    },
    {
      title:        "للإيجار",
      value:        statistics?.for_rent ?? 0,
      icon:         Key,
      iconColor:    "#0891B2",
      iconBg:       "#CFFAFE",
      accentColor:  "#0891B2",
    },
    {
      title:        "للبيع",
      value:        statistics?.for_sale ?? 0,
      icon:         Tag,
      iconColor:    "#D97706",
      iconBg:       "#FEF3C7",
      accentColor:  "#D97706",
    },
  ];

  if (error && !loading) {
    return (
      <div
        style={{
          marginBottom: 24,
          padding: "12px 16px",
          background: "#FFF3E0",
          border: "1px solid #FFCC80",
          borderRadius: 12,
        }}
      >
        <p style={{ fontSize: 13, color: "#E07A3A" }}>{error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
      className="grid-cols-1 sm:grid-cols-3"
    >
      {cards.map((card, i) => (
        <StatCard key={i} {...card} loading={loading} />
      ))}
    </div>
  );
};
