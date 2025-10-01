"use client";

import { useEffect } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Token validation
  const { tokenValidation } = useTokenValidation();

  useEffect(() => {
    // إضافة CSS لضمان RTL
    const style = document.createElement("style");
    style.id = "dashboard-rtl-styles";
    style.textContent = `
      html {
        direction: rtl !important;
      }
      body {
        direction: rtl !important;
      }
      * {
        direction: rtl !important;
      }
    `;
    document.head.appendChild(style);

    console.log("🔄 Dashboard Layout: Applied RTL styling");

    // تنظيف عند الخروج من المجلد
    return () => {
      // إزالة الـ CSS
      const styleElement = document.getElementById("dashboard-rtl-styles");
      if (styleElement) {
        styleElement.remove();
      }

      console.log("🔄 Dashboard Layout: Removed RTL styling");
    };
  }, []);

  // Show loading while validating token
  if (tokenValidation.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من صحة الجلسة...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ direction: "rtl" }}>
      {children}
    </div>
  );
}
