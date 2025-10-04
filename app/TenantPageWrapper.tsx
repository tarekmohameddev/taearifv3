"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { notFound } from "next/navigation";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib-liveeditor/ComponentsList";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import Footer1 from "@/components/tenant/footer/footer1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageDropdown } from "@/components/tenant/LanguageDropdown";
import { PAGE_DEFINITIONS } from "@/lib-liveeditor/defaultComponents";
import { SkeletonLoader } from "@/components/skeleton";
import { 
  StaticHeaderSkeleton1, 
  HeroSkeleton1, 
  HeroSkeleton2, 
  FilterButtonsSkeleton1, 
  GridSkeleton1, 
  HalfTextHalfImageSkeleton1, 
  ContactCardsSkeleton1 
} from "@/components/skeleton";
import { shouldCenterComponent, getCenterWrapperClasses, getCenterWrapperStyles } from "@/lib/ComponentsInCenter";
import { preloadTenantData, clearExpiredCache } from "@/lib/preload";

const loadComponent = (section: string, componentName: string) => {
  console.log("📄 TenantPageWrapper - loadComponent called with:", {
    section,
    componentName,
  });
  if (!componentName) return null;
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const baseName = match[1];
  const number = match[2];
  console.log("📄 TenantPageWrapper - Parsed component:", { baseName, number });

  // استخدام القائمة المركزية للحصول على مسارات الأقسام
  const sectionPath = getSectionPath(section) || section;

  if (!sectionPath) {
    console.error("Invalid section:", section);
    return null;
  }

  // استخدام القائمة المركزية للحصول على مسارات المكونات الفرعية
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.error("Invalid component type:", baseName);
    // استخدام fallback للمكونات غير المعروفة
    const fallbackPath = "hero"; // استخدام hero كـ fallback
    const fallbackFullPath = `${fallbackPath}/${componentName}`;

    return lazy(() =>
      import(`@/components/tenant/${fallbackFullPath}`).catch(() => ({
        default: (props: any) => (
          <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg text-center">
            <div className="text-yellow-600 text-lg font-semibold mb-2">
              Unknown Component: {baseName}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              Component file: {componentName} (fallback: {fallbackFullPath})
            </div>
            <div className="text-xs text-gray-500">
              This component type is not recognized. Using fallback.
            </div>
          </div>
        ),
      })),
    );
  }

  // جميع المكونات الآن مستقلة في مجلدات خاصة بها
  const fullPath = `${subPath}/${componentName}`;
  console.log("📄 TenantPageWrapper - Loading component from path:", fullPath);

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    })),
  );
};

interface TenantPageWrapperProps {
  tenantId: string | null;
  slug: string;
}

export default function TenantPageWrapper({
  tenantId,
  slug,
}: TenantPageWrapperProps) {
  console.log("📄 TenantPageWrapper - Component rendered");

  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);

  console.log("📄 TenantPageWrapper - Initial state:", {
    tenantId,
    slug,
    hasTenantData: !!tenantData,
    loadingTenantData,
  });

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    }
  }, [tenantId, setTenantId]);

  // تنظيف cache المنتهية الصلاحية عند تحميل المكون
  useEffect(() => {
    clearExpiredCache();
  }, []);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      console.log("📄 TenantPageWrapper - Fetching tenant data for:", tenantId);
      
      // محاولة تحميل البيانات من cache أولاً
      const loadData = async () => {
        try {
          const cachedData = await preloadTenantData(tenantId);
          if (cachedData) {
            // إذا كانت البيانات موجودة في cache، استخدمها مباشرة
            console.log("📄 TenantPageWrapper - Using cached data for:", tenantId);
            return;
          }
        } catch (error) {
          console.warn("📄 TenantPageWrapper - Cache failed, fetching from API:", error);
        }
        
        // إذا لم تكن البيانات في cache، جلبها من API
        fetchTenantData(tenantId);
      };
      
      loadData();
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // التحقق من وجود الـ slug في componentSettings أو البيانات الافتراضية
  const slugExists = useMemo(() => {
    if (!slug) return false;

    // التحقق من وجود الـ slug في componentSettings
    if (tenantData?.componentSettings && slug in tenantData.componentSettings) {
      return true;
    }

    // التحقق من وجود الـ slug في البيانات الافتراضية
    if ((PAGE_DEFINITIONS as any)[slug]) {
      return true;
    }

    return false;
  }, [tenantData?.componentSettings, slug]);

  // Get components from componentSettings or default components
  const componentsList = useMemo(() => {
    if (
      tenantData?.componentSettings &&
      slug &&
      tenantData.componentSettings[slug]
    ) {
      console.log("📄 TenantPageWrapper - Using componentSettings for:", slug);
      const pageSettings = tenantData.componentSettings[slug];

      // تحويل componentSettings إلى قائمة مكونات
      const components = Object.entries(pageSettings)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      console.log(
        "📄 TenantPageWrapper - Components from componentSettings:",
        components,
      );
      return components;
    }

    // استخدام البيانات الافتراضية من PAGE_DEFINITIONS
    if (slug && (PAGE_DEFINITIONS as any)[slug]) {
      console.log("📄 TenantPageWrapper - Using default components for:", slug);
      const defaultPageData = (PAGE_DEFINITIONS as any)[slug];
      const components = Object.entries(defaultPageData)
        .map(([id, component]: [string, any]) => ({
          id,
          componentName: component.componentName,
          data: component.data,
          position: component.position || 0,
        }))
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      console.log(
        "📄 TenantPageWrapper - Components from default:",
        components,
      );
      return components;
    }

    console.log("📄 TenantPageWrapper - No components found for:", slug);
    return [];
  }, [tenantData?.componentSettings, slug]);

  // دالة لتحديد الـ skeleton المناسب حسب الـ slug
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
      default:
        // الصفحات الأخرى تعرض HeroSkeleton1
        return (
          <main className="flex-1">
            <HeroSkeleton1 />
          </main>
        );
    }
  };

  // إذا كان التحميل جارياً، أظهر skeleton loading
  if (loadingTenantData) {
    return (
      <I18nProvider>
        <div className="min-h-screen flex flex-col" dir="rtl">
          {/* Header Skeleton */}
          <StaticHeaderSkeleton1 />
          
          {/* Page-specific Skeleton Content */}
          {renderSkeletonContent()}
        </div>
      </I18nProvider>
    );
  }

  // إذا لم يكن الـ slug موجود في componentSettings، أظهر 404
  if (!slugExists) {
    notFound();
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = componentsList.filter((comp: any) => {
    if (comp.componentName?.startsWith("header")) {
      return false;
    }
    if (comp.componentName?.startsWith("footer")) {
      return false;
    }
    return true;
  });

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col" dir="rtl">
        {/* Header with i18n support */}
        <div className="relative">
          <StaticHeader1 />
          {/* لا اريد ازالة هذا  , فقط اريده ككومنت */}
          {/* <div className="absolute top-4 right-4 z-50"> 
            <LanguageDropdown />
          </div> */}
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {Array.isArray(filteredComponentsList) &&
          filteredComponentsList.length > 0 ? (
            filteredComponentsList.map((comp: any) => {
              const Cmp = loadComponent(slug as string, comp.componentName);
              if (!Cmp) {
                console.log(
                  "❌ Page - Component not found:",
                  comp.componentName,
                );
                return <Fragment key={comp.id} />;
              }

              // التحقق من ما إذا كان المكون يحتاج للتوسيط
              const centerWrapperClasses = getCenterWrapperClasses(comp.componentName);
              const centerWrapperStyles = getCenterWrapperStyles(comp.componentName);
              
              const componentElement = (
                <Suspense 
                  key={comp.id} 
                  fallback={<SkeletonLoader componentName={comp.componentName} />}
                >
                  <Cmp {...(comp.data as any)} useStore variant={comp.id} />
                </Suspense>
              );

              // إذا كان المكون يحتاج للتوسيط، لفه في div مع الكلاسات والستايل المناسب
              if (shouldCenterComponent(comp.componentName)) {
                return (
                  <div key={comp.id} className={centerWrapperClasses} style={centerWrapperStyles as React.CSSProperties}>
                    {componentElement}
                  </div>
                );
              }

              return componentElement;
            })
          ) : (
            <div className="p-8 text-center text-gray-500">No components</div>
          )}
        </main>

        {/* Footer with i18n support */}
        <Footer1 />
      </div>
    </I18nProvider>
  );
}
