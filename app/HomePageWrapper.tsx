"use client";

import { Suspense, lazy, useEffect, useMemo, Fragment, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { defaultComponents } from "@/lib-liveeditor/defaultComponents";
import { useAuth } from "@/context/AuthContext";
import Loading from "./loading";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getSectionPath, getComponentSubPath } from "@/lib-liveeditor/ComponentsList";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageSwitcher } from "@/components/tenant/LanguageSwitcher";

// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم والرقم الأخير
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

interface HomePageWrapperProps {
  tenantId: string | null;
}

export default function HomePageWrapper({ tenantId }: HomePageWrapperProps) {
  console.log("🏠 HomePageWrapper - Component rendered");

  const { user, loading } = useAuth();
  const router = useRouter();
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  
  // Use ref to track if data has been fetched
  const hasFetchedRef = useRef(false);
  const isInitializedRef = useRef(false);
  const lastTenantIdRef = useRef<string | null>(null);

  console.log("🏠 HomePageWrapper - Initial state:", {
    tenantId,
    hasTenantData: !!tenantData,
    loadingTenantData,
  });

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId && !isInitializedRef.current) {
      setTenantId(tenantId);
      isInitializedRef.current = true;
      lastTenantIdRef.current = tenantId;
    }
  }, [tenantId]);

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData && !hasFetchedRef.current) {
      console.log("🏠 HomePageWrapper - Fetching tenant data for:", tenantId);
      hasFetchedRef.current = true;
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData]);

  // Reset fetch flag when tenantId changes
  useEffect(() => {
    if (tenantId && tenantId !== lastTenantIdRef.current) {
      console.log("🏠 HomePageWrapper - TenantId changed, resetting flags");
      hasFetchedRef.current = false;
      isInitializedRef.current = false;
      lastTenantIdRef.current = tenantId;
    }
  }, [tenantId]);

  // منع إعادة render عند تغيير loadingTenantData
  const shouldShowLoading = loadingTenantData && !tenantData;

  // Get components from defaultComponents or tenantData
  const componentsList = useMemo(() => {
    if (tenantData?.componentSettings?.homepage) {
      const pageSettings = tenantData.componentSettings.homepage;
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

    // Fallback to default components
    return Object.entries(defaultComponents.homepage).map(([key, componentName], index) => ({
      id: `default-${index}`,
      componentName,
      data: {},
      position: index,
    }));
  }, [tenantData?.componentSettings?.homepage]);

  // منع إعادة render عند تغيير loadingTenantData
  const memoizedComponentsList = useMemo(() => componentsList, [componentsList]);

  // إذا كان التحميل جارياً، أظهر شاشة التحميل
  if (shouldShowLoading) {
    return <Loading />;
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = memoizedComponentsList.filter((comp: any) => {
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
        <div className="relative">
          <div className="absolute top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {Array.isArray(filteredComponentsList) &&
          filteredComponentsList.length > 0 ? (
            filteredComponentsList.map((comp: any) => {
              const Cmp = loadComponent("homepage", comp.componentName);
              if (!Cmp) {
                console.log("❌ HomePage - Component not found:", comp.componentName);
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

      </div>
    </I18nProvider>
  );
}
