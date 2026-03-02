"use client";

import Link from "next/link";

export function AIPromoCard() {
  return (
    <div
      style={{
        background: "#E8F5EF",
        borderRadius: 16,
        padding: 20,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        minHeight: 200,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative SVG arcs */}
      <svg
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: "45%",
          height: "80%",
          opacity: 0.5,
          pointerEvents: "none",
        }}
        viewBox="0 0 180 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M160 80 A80 80 0 0 1 80 160" stroke="#BEE3CC" strokeWidth="1" fill="none" />
        <path d="M160 80 A60 60 0 0 1 80 140" stroke="#BEE3CC" strokeWidth="1" fill="none" />
        <path d="M160 80 A40 40 0 0 1 80 120" stroke="#BEE3CC" strokeWidth="1" fill="none" />
        <path d="M160 80 A100 100 0 0 1 60 175" stroke="#BEE3CC" strokeWidth="1" fill="none" />
        {/* Avatar circles */}
        <circle cx="90" cy="60" r="20" fill="#FFFFFF" stroke="#BEE3CC" strokeWidth="2" />
        <circle cx="50" cy="100" r="20" fill="#FFFFFF" stroke="#BEE3CC" strokeWidth="2" />
        <circle cx="130" cy="110" r="18" fill="#FFFFFF" stroke="#BEE3CC" strokeWidth="2" />
        {/* Simple face icons */}
        <circle cx="90" cy="60" r="12" fill="#D4EDDA" />
        <circle cx="50" cy="100" r="12" fill="#C3E6CB" />
        <circle cx="130" cy="110" r="10" fill="#D4EDDA" />
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "58%" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "#4CAF82", marginBottom: 8 }}>
          ميزة ذكاء اصطناعي جديدة
        </div>
        <h3 style={{ fontSize: 19, fontWeight: 700, color: "#1A1A1A", marginBottom: 8, lineHeight: 1.3 }}>
          البحث عن العملاء والعقارات
        </h3>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>
          استخدم الذكاء الاصطناعي للبحث الذكي عن العقارات ومطابقة العملاء بأفضل العروض تلقائياً.
        </p>
        <Link
          href="/dashboard/properties"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#1A3C34",
            color: "#FFFFFF",
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ابحث الآن
        </Link>
      </div>
    </div>
  );
}
