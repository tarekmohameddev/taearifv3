"use client";

import { usePathname } from "next/navigation";
import { 
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  HeroSkeleton2,
  FilterButtonsSkeleton1,
  GridSkeleton1,
  HalfTextHalfImageSkeleton1,
  ContactCardsSkeleton1
} from "@/components/skeleton";

export default function Loading() {
  const pathname = usePathname();
  
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
  
  console.log("🔄 Loading component - pathname:", pathname, "slug:", slug);

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

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeaderSkeleton1 />
      {renderSkeletonContent()}
    </div>
  );
}
