"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import Loading from "@/app/loading";
import { notFound } from "next/navigation";
import { getSectionPath, getComponentSubPath } from "@/lib-liveeditor/ComponentsList";
import Header1 from "@/components/tenant/header/header1";
import Footer1 from "@/components/tenant/footer/footer1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageDropdown } from "@/components/tenant/LanguageDropdown";

const loadComponent = (section: string, componentName: string) => {
  if (!componentName) return null;
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
  const baseName = match[1];
  const number = match[2];

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
      }))
    );
  }

  // جميع المكونات الآن مستقلة في مجلدات خاصة بها
  const fullPath = `${subPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    }))
  );
};

interface TenantPageWrapperProps {
  tenantId: string | null;
  slug: string;
}

export default function TenantPageWrapper({ tenantId, slug }: TenantPageWrapperProps) {
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

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // التحقق من وجود الـ slug في componentSettings
  const slugExists = useMemo(() => {
    if (!tenantData?.componentSettings || !slug) return false;
    return slug in tenantData.componentSettings;
  }, [tenantData?.componentSettings, slug]);

  // Get components from componentSettings
  const componentsList = useMemo(() => {

    if (
      tenantData?.componentSettings &&
      slug &&
      tenantData.componentSettings[slug]
    ) {
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

      return components;
    }

    return [];
  }, [tenantData?.componentSettings, slug]);

  // إذا كان التحميل جارياً، أظهر شاشة التحميل
  if (loadingTenantData) {
    return <Loading />;
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
      <div className="min-h-screen flex flex-col">
        {/* Header with i18n support */}
        <div className="relative">
          <Header1 />
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
                console.log("❌ Page - Component not found:", comp.componentName);
                return <Fragment key={comp.id} />;
              }

              return (
                <Suspense key={comp.id} fallback={<Loading />}>
                  <Cmp {...(comp.data as any)} useStore variant={comp.id} />
                </Suspense>
              );
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
