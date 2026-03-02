"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, MessageSquare, BarChart3, UserPlus } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  {
    href: "/ar/dashboard/customers-hub/requests",
    icon: MessageSquare,
    iconColor: "#1A3C34",
    iconBg: "#E8F5EF",
    title: "مركز الطلبات",
    desc: "إدارة الطلبات الواردة والمتابعات",
  },
  {
    href: "/ar/dashboard/customers-hub/list",
    icon: Users,
    iconColor: "#4A90A4",
    iconBg: "#E3F2FD",
    title: "قائمة العملاء",
    desc: "عرض وإدارة جميع العملاء",
  },
  {
    href: "/ar/dashboard/customers-hub/analytics",
    icon: BarChart3,
    iconColor: "#5BC4C0",
    iconBg: "#E0F7F6",
    title: "التحليلات",
    desc: "إحصائيات وتقارير العملاء",
  },
  {
    href: "/ar/dashboard/customers-hub/add",
    icon: UserPlus,
    iconColor: "#4CAF82",
    iconBg: "#E8F5EF",
    title: "إضافة عميل",
    desc: "تسجيل عميل جديد في النظام",
  },
];

export default function CustomersHubMainPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 800ms for users who know their way
    const timer = setTimeout(() => {
      router.replace("/ar/dashboard/customers-hub/requests");
    }, 800);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100%",
        background: "#F4F5F7",
        padding: 24,
        fontFamily: "Inter, Poppins, DM Sans, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 }}>
          مركز العملاء
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          إدارة شاملة لدورة حياة العملاء في مكان واحد
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          maxWidth: 600,
        }}
      >
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                background: "#FFFFFF",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                textDecoration: "none",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: link.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon style={{ width: 22, height: 22, color: link.iconColor }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>
                {link.title}
              </h3>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{link.desc}</p>
            </Link>
          );
        })}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center gap-2 mt-8">
        <div
          className="animate-spin"
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid #E5E7EB",
            borderTopColor: "#1A3C34",
          }}
        />
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>
          جاري الانتقال إلى مركز الطلبات...
        </p>
      </div>
    </div>
  );
}
