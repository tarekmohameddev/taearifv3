"use client"; // صفحة تعمل على جانب العميل فقط

import { Suspense, lazy, useEffect, useMemo, Fragment } from "react";
import { useRouter, useParams } from "next/navigation"; // لإعادة التوجيه إذا لم يكن المستخدم موجودًا
import { defaultComponents } from "@/lib-liveeditor/defaultComponents";
import { useAuth } from "@/context/AuthContext";
import Loading from "./loading";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getSectionPath, getComponentSubPath } from "@/lib-liveeditor/ComponentsList";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import Header1I18n from "@/components/tenant/header/header1-i18n";
import Footer1I18n from "@/components/tenant/footer/footer1-i18n";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageSwitcher } from "@/components/tenant/LanguageSwitcher";


// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم والرقم الأخير
const loadComponent = (section: string, componentName: string) => {
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;

  const baseName = match[1];
  const number = match[2];

  // استخدام القائمة المركزية للحصول على مسارات الأقسام
  const sectionPath = getSectionPath(section);
  if (!sectionPath) return null;

  // استخدام القائمة المركزية للحصول على مسارات المكونات الفرعية
  const subPath = getComponentSubPath(baseName);
  if (!subPath) return null;

  // جميع المكونات الآن مستقلة في مجلدات خاصة بها
  const fullPath = `${subPath}/${baseName}${number}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: () => <div></div>,
    }))
  );
};

export default function Home() {
  // Always call hooks in the same order
  const paramsObj = useParams<{ tenantId: string }>();
  const { user, loading } = useAuth();
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);

  const tenantId = paramsObj?.tenantId;

  // Compute selected component names first (no early returns before hooks)
  const getComponent = (section: string, component: string) => {
    const sectionComponents =
      (user?.componentSettings?.[section as string] as
        | Record<string, string>
        | undefined) || {};
    return (
      sectionComponents[component as string] ||
      (defaultComponents as any)[section]?.[component]
    );
  };

  const headerComponentName = getComponent("homepage", "header");
  const heroComponentName = getComponent("homepage", "hero");
  const halfTextHalfImageComponentName = getComponent(
    "homepage",
    "halfTextHalfImage"
  );
  const propertySliderComponentName = getComponent(
    "homepage",
    "propertySlider"
  );

  const Header = useMemo(
    () => loadComponent("homepage", headerComponentName),
    [headerComponentName]
  );
  const Hero = useMemo(
    () => loadComponent("homepage", heroComponentName),
    [heroComponentName]
  );
  const HalfTextHalfImage = useMemo(
    () => loadComponent("homepage", halfTextHalfImageComponentName),
    [halfTextHalfImageComponentName]
  );
  const PropertySlider = useMemo(
    () => loadComponent("homepage", propertySliderComponentName),
    [propertySliderComponentName]
  );

  // If tenantData contains componentSettings.homepage (from DB), render by order using componentSettings
  const renderComponentsByOrder = () => {
    if (!tenantData?.componentSettings?.homepage) return null;

    const homepageSettings = tenantData.componentSettings.homepage;
    const orderedComponents = Object.entries(homepageSettings)
      .sort(
        ([, a], [, b]) =>
          ((a as any).position || 0) - ((b as any).position || 0)
      )
      .map(([id, component]) => ({ id, ...(component as any) }))
      .filter(
        (component) =>
          component.type !== "header" && component.type !== "footer"
      ); // Filter out header and footer

    return (
      <>
        {orderedComponents.map((component) => {
          const Component = loadComponent("homepage", component.componentName);
          if (!Component) return null;

          return (
            <Suspense key={component.id} fallback={<Loading />}>
              <Component id={component.id} useStore={false} />
            </Suspense>
          );
        })}
      </>
    );
  };

  // Render components in default order if no DB settings
  const renderDefaultComponents = () => {
    return (
      <>
        {Hero && (
          <Suspense fallback={<Loading />}>
            <Hero useStore={false} />
          </Suspense>
        )}
        {HalfTextHalfImage && (
          <Suspense fallback={<Loading />}>
            <HalfTextHalfImage useStore={false} />
          </Suspense>
        )}
        {PropertySlider && (
          <Suspense fallback={<Loading />}>
            <PropertySlider useStore={false} />
          </Suspense>
        )}
      </>
    );
  };

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  if (loading || loadingTenantData) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col">
        {/* Static Header */}
        <StaticHeader1 />
        {/* <Header1I18n /> */}
        {/* Page Content */}
        <main className="flex-1">
          {tenantData?.componentSettings?.homepage
            ? renderComponentsByOrder()
            : renderDefaultComponents()}
        </main>

        {/* Static Footer */}
        <StaticFooter1 />
        {/* <Footer1I18n /> */}
      </div>
    </I18nProvider>
  );
}
