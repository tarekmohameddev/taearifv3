"use client";

import {
  Suspense,
  lazy,
  useEffect,
  useMemo,
  Fragment,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { PAGE_DEFINITIONS } from "@/lib-liveeditor/defaultComponents";
import { useAuth } from "@/context/AuthContext";
import Loading from "./loading";
import useTenantStore from "@/context-liveeditor/tenantStore";
import {
  getSectionPath,
  getComponentSubPath,
} from "@/lib-liveeditor/ComponentsList";
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
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageSwitcher } from "@/components/tenant/LanguageSwitcher";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { shouldCenterComponent, getCenterWrapperClasses, getCenterWrapperStyles } from "@/lib/ComponentsInCenter";

// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم والرقم الأخير
const loadComponent = (section: string, componentName: string) => {
  // التحقق من صحة componentName
  if (!componentName || typeof componentName !== "string") {
    return null;
  }

  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) {
    return null;
  }

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
      })),
    );
  }

  // جميع المكونات الآن مستقلة في مجلدات خاصة بها
  const fullPath = `${subPath}/${componentName}`;
  console.log("🏠 HomePageWrapper - Loading component from path:", fullPath);

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div>Component {componentName} not found</div>,
    })),
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

  // Debug: Log error state
  useEffect(() => {
    if (error) {
      console.log("🏠 HomePageWrapper - Error detected:", error);
    }
  }, [error]);
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
    if (
      tenantId &&
      !tenantData &&
      !loadingTenantData &&
      !hasFetchedRef.current
    ) {
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
    // إذا كان التحميل جارياً أو لا توجد بيانات tenant بعد، ارجع null
    if (!tenantData) {
      return null;
    }

    // التحقق من أن componentSettings موجود وأنه object وليس array فارغ
    if (
      tenantData?.componentSettings &&
      typeof tenantData.componentSettings === "object" &&
      !Array.isArray(tenantData.componentSettings) &&
      tenantData.componentSettings.homepage &&
      Object.keys(tenantData.componentSettings.homepage).length > 0
    ) {
      const pageSettings = tenantData.componentSettings.homepage;

      const components = Object.entries(pageSettings)
        .map(([id, component]: [string, any]) => {
          // التحقق من وجود componentName
          if (
            !component.componentName ||
            typeof component.componentName !== "string"
          ) {
            // استخدام fallback
            const fallbackName = `${component.type || "hero"}1`;
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

      return components;
    }

    // إذا كان tenantData موجود ولكن componentSettings فارغ، استخدم البيانات الافتراضية
    const defaultComponentsList = Object.entries(PAGE_DEFINITIONS.homepage).map(
      ([key, component], index) => {
        return {
          id: `default-${index}`,
          componentName: component.componentName, // استخراج componentName من object
          data: component.data || {},
          position: component.position || index,
        };
      },
    );

    return defaultComponentsList;
  }, [tenantData]);

  // منع إعادة render عند تغيير loadingTenantData
  const memoizedComponentsList = useMemo(
    () => componentsList,
    [componentsList],
  );

  // التحقق من الخطأ أولاً قبل التحقق من التحميل
  // إذا كان هناك خطأ أو لم توجد بيانات للـ tenant، اعرض not-found
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

  // إذا كان التحميل جارياً أو لا توجد بيانات بعد، أظهر skeleton loading
  // دالة لتحديد الـ skeleton المناسب حسب الصفحة
  const renderSkeletonContent = () => {
    // الصفحة الرئيسية (homepage) - slug = "/"
    return (
      <main className="flex-1">
        <HeroSkeleton1 />
      </main>
    );
  };

  if (shouldShowLoading || !componentsList) {
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

  // Filter out header and footer components since they are now global
  const filteredComponentsList = (memoizedComponentsList || []).filter(
    (comp: any) => {
      // التحقق من أن componentName موجود وأنه string
      if (!comp.componentName || typeof comp.componentName !== "string") {
        console.warn(
          "🏠 HomePageWrapper - Invalid componentName:",
          comp.componentName,
        );
        return true; // احتفظ بالمكون إذا كان componentName غير صحيح
      }

      if (comp.componentName.startsWith("header")) {
        return false;
      }
      if (comp.componentName.startsWith("footer")) {
        return false;
      }
      return true;
    },
  );

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col" dir="rtl">
        {/* Header from globalComponentsData */}
        <div className="relative">
          <StaticHeader1 />
        </div>

        {/* Page Content */}
        <main className="flex-1">
          {Array.isArray(filteredComponentsList) &&
          filteredComponentsList.length > 0 ? (
            filteredComponentsList.map((comp: any) => {
              const Cmp = loadComponent("homepage", comp.componentName);
              if (!Cmp) {
                console.log(
                  "❌ HomePage - Component not found:",
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
                  <div key={comp.id} className={centerWrapperClasses} style={centerWrapperStyles}>
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

        {/* Footer from globalComponentsData */}
        <StaticFooter1 />
      </div>
    </I18nProvider>
  );
}
