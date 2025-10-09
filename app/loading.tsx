"use client";

import { usePathname } from "next/navigation";
import {
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  HeroSkeleton2,
  FilterButtonsSkeleton1,
  GridSkeleton1,
  HalfTextHalfImageSkeleton1,
  ContactCardsSkeleton1,
} from "@/components/skeleton";
import { memo, useEffect, useState } from "react";

// تحسين الأداء باستخدام memo
const LoadingContent = memo(function LoadingContent({
  slug,
}: {
  slug: string;
}) {
  const renderSkeletonContent = () => {
    switch (slug) {
      case "for-rent":
      case "for-sale":
        return (
          <main className="flex-1">
            <FilterButtonsSkeleton1 />
            <GridSkeleton1 /> 
          </main>
        );
      case "about-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <HalfTextHalfImageSkeleton1 />
          </main>
        );
      case "contact-us":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <ContactCardsSkeleton1 />
          </main>
        );
      case "/":
        // الصفحة الرئيسية
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
          </main>
        );
      default:
        // الصفحات الأخرى تعرض HeroSkeleton1
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
          </main>
        );
    }
  };

  return renderSkeletonContent();
});

export default function Loading() {
  const pathname = usePathname();
  const [hasTenantId, setHasTenantId] = useState<boolean | null>(null);

  // التحقق من وجود tenantId
  useEffect(() => {
    const checkTenantId = () => {
      // التحقق من subdomain في hostname
      const hostname = window.location.hostname;
      const isLocalhost = hostname.includes("localhost");
      const hasSubdomain =
        hostname.split(".").length > 2 ||
        (isLocalhost && hostname.split(".").length > 1);

      // التحقق من localStorage أو cookies
      const hasStoredTenantId =
        localStorage.getItem("tenantId") ||
        document.cookie.includes("tenantId");

      setHasTenantId(hasSubdomain || !!hasStoredTenantId);
    };

    checkTenantId();
  }, []);

  // استخراج الـ slug من المسار
  const getSlugFromPathname = (pathname: string): string => {
    if (!pathname) return "";

    // إزالة الـ / من البداية والنهاية
    const cleanPath = pathname.replace(/^\/+|\/+$/g, "");

    // إذا كان المسار فارغ، فهو الصفحة الرئيسية
    if (!cleanPath) return "/";

    // إذا كان المسار يحتوي على أكثر من جزء، نأخذ الجزء الأول
    const parts = cleanPath.split("/");
    return parts[0];
  };

  const slug = getSlugFromPathname(pathname || "");

  // تقليل console.log في production
  if (process.env.NODE_ENV === "development") {
    console.log(
      "🔄 Loading component - pathname:",
      pathname,
      "slug:",
      slug,
      "hasTenantId:",
      hasTenantId,
    );
  }

  // إذا لم يوجد tenantId، اعرض صفحة بيضاء فارغة
  if (hasTenantId === false) {
    return (
      <div className="min-h-screen bg-white" dir="rtl">
        {/* صفحة بيضاء فارغة */}
      </div>
    );
  }

  // إذا كان هناك tenantId، اعرض loading عادي
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeaderSkeleton1 />
      <LoadingContent slug={slug} />
    </div>
  );
}
