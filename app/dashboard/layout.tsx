"use client";

import { useEffect } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { GTMProvider } from "@/components/GTMProvider";
import PermissionWrapper from "@/components/PermissionWrapper";

/*
 * ========================================
 * DASHBOARD LAYOUT - ARABIC RTL ENFORCEMENT
 * ========================================
 *
 * This layout component is specifically designed for Arabic RTL dashboard pages.
 *
 * PURPOSE:
 * - Enforces RTL (Right-to-Left) direction for all dashboard pages
 * - Ensures consistent Arabic language experience
 * - Applies RTL styling automatically to all dashboard content
 *
 * HOW IT WORKS:
 * 1. Automatically applies RTL direction to HTML, body, and all elements
 * 2. Validates user authentication before rendering content
 * 3. Provides loading state during token validation
 *
 * NOTE:
 * This layout works in conjunction with middleware.ts which automatically
 * redirects all dashboard pages to Arabic locale (/ar/dashboard/*)
 *
 * MODIFICATION NOTES:
 * - To disable RTL enforcement: Remove the useEffect with RTL styling
 * - To change language direction: Modify the direction CSS properties
 * - To add LTR support: Add conditional logic based on locale detection
 */

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

    // تنظيف عند الخروج من المجلد
    return () => {
      // إزالة الـ CSS
      const styleElement = document.getElementById("dashboard-rtl-styles");
      if (styleElement) {
        styleElement.remove();
      }
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
    <GTMProvider containerId="GTM-KBL37C9T">
      <div dir="rtl" style={{ direction: "rtl" }}>
        <PermissionWrapper>{children}</PermissionWrapper>
      </div>
    </GTMProvider>
  );
}
