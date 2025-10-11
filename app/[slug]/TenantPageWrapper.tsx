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
  ContactCardsSkeleton1,
} from "@/components/skeleton";
import {
  shouldCenterComponent,
  getCenterWrapperClasses,
  getCenterWrapperStyles,
} from "@/lib/ComponentsInCenter";

const loadComponent = (section: string, componentName: string) => {
  if (!componentName) return null;
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const baseName = match[1];
  const number = match[2];

  // استخدام القائمة المركزية للحصول على مسارات الأقسام
  const sectionPath = getSectionPath(section) || section;

  if (!sectionPath) {
    return null;
  }

  // استخدام القائمة المركزية للحصول على مسارات المكونات الفرعية
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
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
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  const error = useTenantStore((s) => s.error);

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    } else {
    }
  }, [tenantId, setTenantId]);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    } else {
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // التحقق من وجود الـ slug في componentSettings أو البيانات الافتراضية
  const slugExists = useMemo(() => {
    if (!slug) {
      return false;
    }

    // التحقق من وجود الـ slug في componentSettings
    if (tenantData?.componentSettings && slug in tenantData.componentSettings) {
      return true;
    }

    // التحقق من وجود الـ slug في البيانات الافتراضية (فقط إذا لم يتم جلب البيانات من الـ backend)
    if (!tenantData && (PAGE_DEFINITIONS as any)[slug]) {
      return true;
    }

    return false;
  }, [tenantData?.componentSettings, slug, tenantData]);

  // Get components from componentSettings or default components
  const componentsList = useMemo(() => {
    // التحقق من أن componentSettings موجود وأنه object وليس array فارغ
    if (
      tenantData?.componentSettings &&
      typeof tenantData.componentSettings === "object" &&
      !Array.isArray(tenantData.componentSettings) &&
      slug &&
      tenantData.componentSettings[slug] &&
      Object.keys(tenantData.componentSettings[slug]).length > 0
    ) {
      const pageSettings = tenantData.componentSettings[slug];

      // تحويل componentSettings إلى قائمة مكونات
      const components = Object.entries(pageSettings)
        .map(([id, component]: [string, any]) => {
          return {
            id,
            componentName: component.componentName,
            data: component.data,
            position: component.position,
          };
        })
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      return components;
    }

    // استخدام البيانات الافتراضية من PAGE_DEFINITIONS (فقط إذا لم يتم جلب البيانات من الـ backend)
    if (!tenantData && slug && (PAGE_DEFINITIONS as any)[slug]) {
      const defaultPageData = (PAGE_DEFINITIONS as any)[slug];

      const components = Object.entries(defaultPageData)
        .map(([id, component]: [string, any]) => {
          return {
            id,
            componentName: component.componentName,
            data: component.data,
            position: component.position || 0,
          };
        })
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      return components;
    }

    return [];
  }, [tenantData?.componentSettings, slug, tenantData]);

  // إذا كان التحميل جارياً، أظهر skeleton loading
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
      case "projects":
        return (
          <main className="flex-1">
            <HeroSkeleton2 />
            <GridSkeleton1 />
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
    // إذا لم يتم جلب البيانات بعد، انتظر قليلاً
    if (!tenantData && !loadingTenantData && !error) {
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

    notFound();
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = componentsList.filter((comp: any) => {
    // التحقق من أن componentName موجود وأنه string
    if (!comp.componentName || typeof comp.componentName !== "string") {
      return true; // احتفظ بالمكون إذا كان componentName غير صحيح
    }

    if (comp.componentName.startsWith("header")) {
      return false;
    }
    if (comp.componentName.startsWith("footer")) {
      return false;
    }
    return true;
  });

  if (error || !tenantId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Tenant Not Found</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The tenant "{tenantId}" you are looking for might have been removed,
          had its name changed, or is temporarily unavailable.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

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
                return <Fragment key={comp.id} />;
              }

              // التحقق من ما إذا كان المكون يحتاج للتوسيط
              const centerWrapperClasses = getCenterWrapperClasses(
                comp.componentName,
              );
              const centerWrapperStyles = getCenterWrapperStyles(
                comp.componentName,
              );

              const componentElement = (
                <Suspense
                  key={comp.id}
                  fallback={
                    <SkeletonLoader componentName={comp.componentName} />
                  }
                >
                  <Cmp {...(comp.data as any)} useStore variant={comp.id} />
                </Suspense>
              );

              // إذا كان المكون يحتاج للتوسيط، لفه في div مع الكلاسات والستايل المناسب
              if (shouldCenterComponent(comp.componentName)) {
                return (
                  <div
                    key={comp.id}
                    className={centerWrapperClasses}
                    style={centerWrapperStyles as React.CSSProperties}
                  >
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
