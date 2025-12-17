"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { notFound } from "next/navigation";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib-liveeditor/ComponentsList";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import Header1 from "@/components/tenant/header/header1";
import Header2 from "@/components/tenant/header/header2";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import Footer1 from "@/components/tenant/footer/footer1";
import Footer2 from "@/components/tenant/footer/footer2";
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

// ⭐ Cache للـ header components
const headerComponentsCache = new Map<string, any>();

// ⭐ Cache للـ footer components
const footerComponentsCache = new Map<string, any>();

// Load header component dynamically
const loadHeaderComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (headerComponentsCache.has(componentName)) {
    return headerComponentsCache.get(componentName);
  }

  // Handle StaticHeader1 specially (no number suffix)
  if (componentName === "StaticHeader1") {
    const component = lazy(() =>
      import(`@/components/tenant/header/StaticHeader1`).catch(() => ({
        default: StaticHeader1,
      })),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known header components (more reliable than dynamic import)
  const headerComponentMap: Record<string, any> = {
    header1: Header1,
    header2: Header2,
  };

  if (headerComponentMap[componentName]) {
    // Wrap in lazy for Suspense compatibility
    const component = lazy(() =>
      Promise.resolve({ default: headerComponentMap[componentName] }),
    );
    headerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other header variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.warn(
      `[Header Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  // Debug log (can be removed in production)
  if (process.env.NODE_ENV === "development") {
    console.log("[Header Import Debug]", {
      baseName,
      subPath,
      fullPath,
      "Import path": `@/components/tenant/${fullPath}`,
    });
  }

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Header Import Error] Failed to load ${fullPath}:`,
          error,
        );
        return { default: StaticHeader1 };
      }),
    { ssr: false },
  );

  // ⭐ Cache the component
  headerComponentsCache.set(componentName, component);
  return component;
};

// Load footer component dynamically (same logic as header)
const loadFooterComponent = (componentName: string) => {
  if (!componentName) return null;

  // ⭐ Check cache first
  if (footerComponentsCache.has(componentName)) {
    return footerComponentsCache.get(componentName);
  }

  // Handle StaticFooter1 specially (no number suffix)
  if (componentName === "StaticFooter1") {
    const component = lazy(() =>
      import(`@/components/tenant/footer/StaticFooter1`).catch(() => ({
        default: StaticFooter1,
      })),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // ⭐ Direct import for known footer components
  const footerComponentMap: Record<string, any> = {
    footer1: Footer1,
    footer2: Footer2,
  };

  if (footerComponentMap[componentName]) {
    const component = lazy(() =>
      Promise.resolve({ default: footerComponentMap[componentName] }),
    );
    footerComponentsCache.set(componentName, component);
    return component;
  }

  // Fallback to dynamic import for other footer variants
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.warn(
      `[Footer Component] No subPath found for baseName: ${baseName}`,
    );
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  const component = dynamic(
    () =>
      import(`@/components/tenant/${fullPath}`).catch((error) => {
        console.error(
          `[Footer Import Error] Failed to load ${fullPath}:`,
          error,
        );
        return { default: StaticFooter1 };
      }),
    { ssr: false },
  );

  footerComponentsCache.set(componentName, component);
  return component;
};

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

  // Get global header data and variant
  const globalHeaderData = tenantData?.globalComponentsData?.header;
  const globalHeaderVariant = useMemo(() => {
    // Priority: header.variant > globalHeaderVariant > default
    const variant =
      globalHeaderData?.variant ||
      tenantData?.globalComponentsData?.globalHeaderVariant ||
      "StaticHeader1";

    // Debug log (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[TenantPageWrapper] Header Variant Debug:", {
        "globalHeaderData?.variant": globalHeaderData?.variant,
        "tenantData?.globalComponentsData?.globalHeaderVariant":
          tenantData?.globalComponentsData?.globalHeaderVariant,
        "resolved variant": variant,
        "tenantData exists": !!tenantData,
        "globalComponentsData exists": !!tenantData?.globalComponentsData,
      });
    }

    return variant;
  }, [
    globalHeaderData?.variant,
    tenantData?.globalComponentsData?.globalHeaderVariant,
    tenantData,
  ]);

  // Get global footer data and variant
  const globalFooterData = tenantData?.globalComponentsData?.footer;
  const globalFooterVariant = useMemo(() => {
    // Priority: footer.variant > globalFooterVariant > default (same as header)
    const variant =
      globalFooterData?.variant ||
      tenantData?.globalComponentsData?.globalFooterVariant ||
      "StaticFooter1";

    // Debug log (can be removed in production)
    if (process.env.NODE_ENV === "development") {
      console.log("[TenantPageWrapper] Footer Variant Debug:", {
        "globalFooterData?.variant": globalFooterData?.variant,
        "tenantData?.globalComponentsData?.globalFooterVariant":
          tenantData?.globalComponentsData?.globalFooterVariant,
        "resolved variant": variant,
        "tenantData exists": !!tenantData,
        "globalComponentsData exists": !!tenantData?.globalComponentsData,
      });
    }

    return variant;
  }, [
    globalFooterData?.variant,
    tenantData?.globalComponentsData?.globalFooterVariant,
    tenantData,
  ]);

  // Load footer component dynamically
  const FooterComponent = useMemo(() => {
    const componentMap: Record<string, string> = {
      StaticFooter1: "StaticFooter1",
      footer1: "footer1",
      footer2: "footer2",
    };

    const componentName = componentMap[globalFooterVariant] || "StaticFooter1";
    return loadFooterComponent(componentName) || StaticFooter1;
  }, [globalFooterVariant]);

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
          <Suspense fallback={<SkeletonLoader componentName="header" />}>
            {(() => {
              // Map variant names to component names
              const componentMap: Record<string, string> = {
                StaticHeader1: "StaticHeader1",
                header1: "header1",
                header2: "header2",
                header3: "header3",
                header4: "header4",
                header5: "header5",
                header6: "header6",
              };

              const componentName =
                componentMap[globalHeaderVariant] || "StaticHeader1";

              // Debug log (can be removed in production)
              if (process.env.NODE_ENV === "development") {
                console.log("[TenantPageWrapper] Header Component Debug:", {
                  globalHeaderVariant: globalHeaderVariant,
                  componentName: componentName,
                  "componentMap[globalHeaderVariant]":
                    componentMap[globalHeaderVariant],
                });
              }

              const HeaderComponent = loadHeaderComponent(componentName);

              if (!HeaderComponent) {
                console.warn(
                  "[TenantPageWrapper] HeaderComponent is null, falling back to StaticHeader1",
                );
                return <StaticHeader1 overrideData={globalHeaderData || {}} />;
              }

              // Remove variant from data before passing to component
              const headerDataWithoutVariant = globalHeaderData
                ? (() => {
                    const { variant: _variant, ...data } = globalHeaderData;
                    return data;
                  })()
                : {};

              return (
                <HeaderComponent
                  overrideData={headerDataWithoutVariant}
                  variant={globalHeaderVariant}
                  id="global-header"
                />
              );
            })()}
          </Suspense>
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
        <Suspense fallback={<SkeletonLoader componentName="footer" />}>
          {(() => {
            const footerDataWithoutVariant = globalFooterData
              ? (() => {
                  const { variant: _variant, ...data } = globalFooterData;
                  return data;
                })()
              : {};

            if (!FooterComponent) {
              return <StaticFooter1 overrideData={footerDataWithoutVariant} />;
            }

            return (
              <FooterComponent
                overrideData={footerDataWithoutVariant}
                variant={globalFooterVariant}
                id="global-footer"
              />
            );
          })()}
        </Suspense>
      </div>
    </I18nProvider>
  );
}
