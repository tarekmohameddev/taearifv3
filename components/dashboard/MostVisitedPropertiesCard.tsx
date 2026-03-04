"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Home, TrendingUp, ArrowLeft } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

interface PropertyItem {
  id: string | number;
  title: string;
  visits: number;
  featured_image?: string;
  transaction_type?: string | number;
}

const RANK_COLORS = ["#F59E0B", "#9CA3AF", "#CD7C5A", "#6B7280", "#6B7280"];
const RANK_LABELS = ["🥇", "🥈", "🥉", "4", "5"];

const TYPE_MAP: Record<string, string> = {
  "1": "للبيع",
  sale: "للبيع",
  "2": "للإيجار",
  rent: "للإيجار",
};

function SkeletonRow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid #F3F4F6",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          background: "#F3F4F6",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 11,
            borderRadius: 6,
            background: "#F3F4F6",
            marginBottom: 6,
            width: "65%",
          }}
        />
        <div
          style={{ height: 5, borderRadius: 6, background: "#F3F4F6", width: "45%" }}
        />
      </div>
      <div
        style={{ width: 38, height: 22, borderRadius: 6, background: "#F3F4F6" }}
      />
    </div>
  );
}

export function MostVisitedPropertiesCard() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchTopProperties() {
      try {
        const res = await axiosInstance.get("/properties?per_page=20");
        if (cancelled) return;

        const raw: PropertyItem[] = res.data?.data?.properties ?? [];
        const sorted = [...raw]
          .sort((a, b) => (b.visits ?? 0) - (a.visits ?? 0))
          .slice(0, 5);

        setProperties(sorted);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTopProperties();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxVisits = properties[0]?.visits ?? 1;

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ padding: "4px 20px 8px" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      );
    }

    if (error || properties.length === 0) {
      return (
        <div
          style={{
            padding: "28px 20px",
            textAlign: "center",
            color: "#9CA3AF",
          }}
        >
          <Home
            size={32}
            color="#D1D5DB"
            style={{ margin: "0 auto 10px", display: "block" }}
          />
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
            {error ? "تعذّر تحميل البيانات" : "لا توجد عقارات بعد"}
          </div>
          <div style={{ fontSize: 11 }}>
            {error
              ? "تحقق من الاتصال وأعد المحاولة"
              : "أضف عقارك الأول لترى إحصائيات المشاهدات"}
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "4px 20px 8px" }}>
        {properties.map((prop, index) => {
          const visits = prop.visits ?? 0;
          const barWidth = maxVisits > 0 ? (visits / maxVisits) * 100 : 0;
          const typeLabel =
            TYPE_MAP[String(prop.transaction_type)] ?? null;
          const rankColor = RANK_COLORS[index];

          return (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.32, delay: index * 0.07 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 0",
                borderBottom:
                  index < properties.length - 1
                    ? "1px solid #F3F4F6"
                    : "none",
              }}
            >
              {/* Rank badge */}
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background:
                    index < 3 ? rankColor + "18" : "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: index < 3 ? 13 : 11,
                  fontWeight: 700,
                  color: index < 3 ? rankColor : "#9CA3AF",
                }}
              >
                {RANK_LABELS[index]}
              </div>

              {/* Title + bar */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: 5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {prop.title || "عقار بدون عنوان"}
                </div>

                {/* Relative bar */}
                <div
                  style={{
                    height: 4,
                    background: "#F3F4F6",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut",
                      delay: 0.2 + index * 0.07,
                    }}
                    style={{
                      height: "100%",
                      background:
                        index === 0
                          ? "linear-gradient(90deg, #1A3C34, #4CAF82)"
                          : index === 1
                          ? "linear-gradient(90deg, #374151, #9CA3AF)"
                          : "#D1D5DB",
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>

              {/* Visits + type */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 3,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Eye size={10} color="#9CA3AF" />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: index === 0 ? "#1A3C34" : "#374151",
                    }}
                  >
                    {visits.toLocaleString("ar-SA")}
                  </span>
                </div>
                {typeLabel && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      color:
                        typeLabel === "للبيع" ? "#3B82F6" : "#10B981",
                      background:
                        typeLabel === "للبيع" ? "#EFF6FF" : "#F0FBF5",
                      padding: "1px 6px",
                      borderRadius: 99,
                    }}
                  >
                    {typeLabel}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={16} color="#3B82F6" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
              أكثر العقارات مشاهدة
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>
              مرتبة حسب عدد المشاهدات
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/properties"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontWeight: 600,
            color: "#1A3C34",
            textDecoration: "none",
            padding: "5px 10px",
            borderRadius: 8,
            background: "#F0FBF5",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          عرض الكل
          <ArrowLeft size={11} />
        </Link>
      </div>

      {/* Body */}
      {renderContent()}
    </div>
  );
}
