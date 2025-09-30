"use client";

import { Suspense, lazy, useEffect, useMemo, Fragment, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { PAGE_DEFINITIONS } from "@/lib-liveeditor/defaultComponents";
import { useAuth } from "@/context/AuthContext";
import Loading from "./loading";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getSectionPath, getComponentSubPath } from "@/lib-liveeditor/ComponentsList";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageSwitcher } from "@/components/tenant/LanguageSwitcher";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";

// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم والرقم الأخير
const loadComponent = (section: string, componentName: string) => {
  console.log("🏠 HomePageWrapper - loadComponent called with:", { section, componentName });
  
  // التحقق من صحة componentName
  if (!componentName || typeof componentName !== 'string') {
    console.warn("🏠 HomePageWrapper - Invalid componentName:", componentName);
    return null;
  }
  
  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) {
    console.warn("🏠 HomePageWrapper - No match found for componentName:", componentName);
    return null;
  }
  
  const baseName = match[1];
  const number = match[2];
  console.log("🏠 HomePageWrapper - Parsed component:", { baseName, number });

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
  console.log("🏠 HomePageWrapper - Loading component from path:", fullPath);

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

  const { user, loading } = useAuth();
  const router = useRouter();
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  
  // Use ref to track if data has been fetched
  const hasFetchedRef = useRef(false);
  const isInitializedRef = useRef(false);
  const lastTenantIdRef = useRef<string | null>(null);


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
    console.warn("heyyyyyy333");
    hasFetchedRef.current = true;
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData]);

  // Reset fetch flag when tenantId changes
  useEffect(() => {
    if (tenantId && tenantId !== lastTenantIdRef.current) {
      // console.log("🏠 HomePageWrapper - TenantId changed, resetting flags");
      hasFetchedRef.current = false;
      isInitializedRef.current = false;
      lastTenantIdRef.current = tenantId;
    }
  }, [tenantId]);

  // منع إعادة render عند تغيير loadingTenantData
  const shouldShowLoading = loadingTenantData && !tenantData;

  // Get components from defaultComponents or tenantData
  const componentsList = useMemo(() => {
    console.log("🏠 HomePageWrapper - Building componentsList");
    console.log("🏠 HomePageWrapper - tenantData:", tenantData);
    console.log("🏠 HomePageWrapper - componentSettings type:", typeof tenantData?.componentSettings);
    console.log("🏠 HomePageWrapper - componentSettings value:", tenantData?.componentSettings);
    
    // التحقق من أن componentSettings موجود وأنه object وليس array فارغ
    if (tenantData?.componentSettings && 
        typeof tenantData.componentSettings === 'object' && 
        !Array.isArray(tenantData.componentSettings) &&
        tenantData.componentSettings.homepage &&
        Object.keys(tenantData.componentSettings.homepage).length > 0) {
      console.log("🏠 HomePageWrapper - Using componentSettings");
      const pageSettings = tenantData.componentSettings.homepage;
      console.log("🏠 HomePageWrapper - pageSettings:", pageSettings);
      
      const components = Object.entries(pageSettings)
        .map(([id, component]: [string, any]) => {
          console.log("🏠 HomePageWrapper - Processing component:", { id, component });
          
          // التحقق من وجود componentName
          if (!component.componentName || typeof component.componentName !== 'string') {
            console.warn("🏠 HomePageWrapper - Invalid componentName in component:", component.componentName);
            // استخدام fallback
            const fallbackName = `${component.type || 'hero'}1`;
            console.warn("🏠 HomePageWrapper - Using fallback name:", fallbackName);
            return {
              id,
              componentName: fallbackName,
              data: component.data,
              position: component.position,
            };
          }
          
          return {
            id,
            componentName: component.componentName,
            data: component.data,
            position: component.position,
          };
        })
        .sort((a, b) => (a.position || 0) - (b.position || 0));
      
      console.log("🏠 HomePageWrapper - Components from componentSettings:", components);
      return components;
    }

    console.log("🏠 HomePageWrapper - Using default components");
    console.log("🏠 HomePageWrapper - componentSettings is empty or invalid, falling back to default components");
    console.log("🏠 HomePageWrapper - PAGE_DEFINITIONS.homepage:", PAGE_DEFINITIONS.homepage);
    
    const defaultComponentsList = Object.entries(PAGE_DEFINITIONS.homepage).map(([key, component], index) => {
      console.log("🏠 HomePageWrapper - Processing default component:", { key, component, index });
      return {
        id: `default-${index}`,
        componentName: component.componentName, // استخراج componentName من object
        data: component.data || {},
        position: component.position || index,
      };
    });
    
    console.log("🏠 HomePageWrapper - Default components:", defaultComponentsList);
    return defaultComponentsList;
  }, [tenantData?.componentSettings?.homepage]);

  // منع إعادة render عند تغيير loadingTenantData
  const memoizedComponentsList = useMemo(() => componentsList, [componentsList]);

  // إذا كان التحميل جارياً، أظهر شاشة التحميل
  if (shouldShowLoading) {
    return <Loading />;
  }

  // إذا كان هناك خطأ أو لم توجد بيانات للـ tenant، اعرض not-found
  if (error || (!tenantId)) {
    // console.log("🏠 HomePageWrapper - Showing not-found due to:", { error, hasTenantData: !!tenantData, tenantId });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Tenant Not Found</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          The tenant "{tenantId}" you are looking for might have been removed, 
          had its name changed, or is temporarily unavailable.
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  // Filter out header and footer components since they are now global
  const filteredComponentsList = memoizedComponentsList.filter((comp: any) => {
    console.log("🏠 HomePageWrapper - Filtering component:", comp);
    
    // التحقق من أن componentName موجود وأنه string
    if (!comp.componentName || typeof comp.componentName !== 'string') {
      console.warn("🏠 HomePageWrapper - Invalid componentName:", comp.componentName);
      return true; // احتفظ بالمكون إذا كان componentName غير صحيح
    }
    
    if (comp.componentName.startsWith("header")) {
      console.log("🏠 HomePageWrapper - Filtering out header component:", comp.componentName);
      return false;
    }
    if (comp.componentName.startsWith("footer")) {
      console.log("🏠 HomePageWrapper - Filtering out footer component:", comp.componentName);
      return false;
    }
    return true;
  });
  
  console.log("🏠 HomePageWrapper - Filtered components:", filteredComponentsList);

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header from globalComponentsData */}
        <div className="relative">
          <StaticHeader1 />
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {Array.isArray(filteredComponentsList) &&
          filteredComponentsList.length > 0 ? (
            filteredComponentsList.map((comp: any) => {
              console.log("🏠 HomePageWrapper - Rendering component:", comp);
              const Cmp = loadComponent("homepage", comp.componentName);
              if (!Cmp) {
                console.log("❌ HomePage - Component not found:", comp.componentName);
                return <Fragment key={comp.id} />;
              }

              console.log("✅ HomePageWrapper - Component loaded successfully:", comp.componentName);
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

        {/* Footer from globalComponentsData */}
        <StaticFooter1 />
      </div>
    </I18nProvider>
  );
}
