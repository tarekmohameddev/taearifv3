"use client";

import { useEffect, useState } from "react";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import GTMProvider from "@/components/GTMProvider2";
import PermissionWrapper from "@/components/PermissionWrapper";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isValidDomain, setIsValidDomain] = useState<boolean | null>(null);

  // التحقق من أن المستخدم على الدومين الأساسي
  useEffect(() => {
    const checkDomain = () => {
      if (typeof window === "undefined") return;
      
      const hostname = window.location.hostname;
      const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
      const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
      const isDevelopment = process.env.NODE_ENV === "development";
      
      // التحقق من أن المستخدم على الدومين الأساسي
      const isOnBaseDomain = isDevelopment 
        ? hostname === localDomain || hostname === `${localDomain}:3000`
        : hostname === productionDomain || hostname === `www.${productionDomain}`;
      
      // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
      const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(hostname);
      
      if (isCustomDomain && !isOnBaseDomain) {
        // إذا كان custom domain، إعادة توجيه إلى الدومين الأساسي
        const baseUrl = isDevelopment 
          ? `http://${localDomain}:3000/dashboard`
          : `https://${productionDomain}/dashboard`;
        
        console.log("🔄 Dashboard Layout: Redirecting from custom domain to base domain:", baseUrl);
        // window.location.href = baseUrl;
        return;
      }
      
      setIsValidDomain(isOnBaseDomain);
    };

    checkDomain();
  }, []);

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

  // Show loading while validating domain or token
  if (isValidDomain === null || tokenValidation.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isValidDomain === null ? "جاري التحقق من الدومين..." : "جاري التحقق من صحة الجلسة..."}
          </p>
        </div>
      </div>
    );
  }

  // إذا لم يكن على الدومين الأساسي، لا نعرض المحتوى
  if (!isValidDomain) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="rtl"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">غير مسموح</h1>
          <p className="text-gray-600">لا يمكن الوصول للوحة التحكم من هذا الدومين</p>
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
