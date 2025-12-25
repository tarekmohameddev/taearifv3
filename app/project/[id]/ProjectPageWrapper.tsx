// app\project\[id]\ProjectPageWrapper.tsx
"use client";

import { useEffect, useMemo, Suspense, Fragment, lazy } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import ProjectDetails1 from "@/components/tenant/projectDetails/projectDetails1";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { trackProjectView } from "@/lib/ga4-tracking";
import SkeletonLoader from "@/components/skeleton/SkeletonLoader";
import { getComponentSubPath } from "@/lib-liveeditor/ComponentsList";

interface ProjectPageWrapperProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;
  projectSlug: string;
}

// دالة لتحميل المكونات ديناميكيًا بناءً على الاسم
const loadComponent = (componentName: string) => {
  if (!componentName || typeof componentName !== "string") {
    return null;
  }

  const match = componentName.match(/^(.*?)(\d+)$/);
  if (!match) {
    return null;
  }

  const baseName = match[1];
  const number = match[2];

  const subPath = getComponentSubPath(baseName);
  if (!subPath) {
    console.error("Invalid component type:", baseName);
    return null;
  }

  const fullPath = `${subPath}/${componentName}`;

  return lazy(() =>
    import(`@/components/tenant/${fullPath}`).catch(() => ({
      default: (props: any) => (
        <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-yellow-300 rounded-lg text-center">
          <div className="text-yellow-600 text-lg font-semibold mb-2">
            Unknown Component: {baseName}
          </div>
          <div className="text-gray-600 text-sm mb-4">
            Component file: {componentName} (path: {fullPath})
          </div>
        </div>
      ),
    })),
  );
};

export default function ProjectPageWrapper({
  tenantId,
  domainType,
  projectSlug,
}: ProjectPageWrapperProps) {
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);
  const staticPagesData = useEditorStore((s) => s.staticPagesData);
  const getStaticPageData = useEditorStore((s) => s.getStaticPageData);

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

  // Track project view
  useEffect(() => {
    if (tenantId && projectSlug) {
      // ✅ للـ custom domains: استخدم username من API
      const finalTenantId =
        domainType === "custom" && tenantData?.username
          ? tenantData.username
          : tenantId;

      trackProjectView(finalTenantId, projectSlug);
    }
  }, [tenantId, projectSlug, domainType, tenantData?.username]);

  // Get components from staticPagesData["project"] or fallback to ProjectDetails1
  const componentsList = useMemo(() => {
    // ⭐ Priority 1: Try to get from staticPagesData["project"]
    const staticPageData = getStaticPageData("project");
    if (staticPageData && Array.isArray(staticPageData.components)) {
      return staticPageData.components
        .map((component: any) => ({
          id: component.id,
          componentName: component.componentName,
          data: { ...component.data, projectSlug },
          position: component.position || 0,
        }))
        .sort((a: any, b: any) => a.position - b.position);
    }

    // ⭐ Priority 2: Try to get from tenantData.StaticPages
    // Handle both formats: { components: [...] } or ["project", [components...]]
    if (tenantData?.StaticPages?.["project"]) {
      const staticPage = tenantData.StaticPages["project"];
      
      // Format 1: Array format ["project", [components...]]
      if (Array.isArray(staticPage) && staticPage.length >= 2) {
        const components = staticPage[1];
        if (Array.isArray(components)) {
          return components
            .map((component: any) => ({
              id: component.id,
              componentName: component.componentName,
              data: { ...component.data, projectSlug },
              position: component.position || 0,
            }))
            .sort((a: any, b: any) => a.position - b.position);
        }
      }
      
      // Format 2: Object format { components: [...] }
      if (staticPage && typeof staticPage === "object" && !Array.isArray(staticPage)) {
        if (Array.isArray(staticPage.components)) {
          return staticPage.components
            .map((component: any) => ({
              id: component.id,
              componentName: component.componentName,
              data: { ...component.data, projectSlug },
              position: component.position || 0,
            }))
            .sort((a: any, b: any) => a.position - b.position);
        }
      }
    }

    // ⭐ Fallback: Return default ProjectDetails1 component
    return [
      {
        id: "projectDetails1",
        componentName: "projectDetails1",
        data: { projectSlug },
        position: 0,
      },
    ];
  }, [staticPagesData, tenantData, getStaticPageData, projectSlug]);

  // Filter out header and footer components
  const filteredComponentsList = useMemo(() => {
    return componentsList.filter((comp: any) => {
      if (comp.componentName?.startsWith("header")) {
        return false;
      }
      if (comp.componentName?.startsWith("footer")) {
        return false;
      }
      return true;
    });
  }, [componentsList]);

  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId} domainType={domainType}>
        <I18nProvider>
          <div className="min-h-screen flex flex-col" dir="rtl">
            <StaticHeader1 />
            <main className="flex-1">
              {Array.isArray(filteredComponentsList) &&
              filteredComponentsList.length > 0 ? (
                filteredComponentsList.map((comp: any) => {
                  // If it's the fallback ProjectDetails1, render it directly
                  if (
                    comp.componentName === "projectDetails1" &&
                    comp.data?.projectSlug
                  ) {
                    return (
                      <ProjectDetails1
                        key={comp.id}
                        projectSlug={comp.data.projectSlug}
                        useStore={true}
                      />
                    );
                  }

                  // Otherwise, load component dynamically
                  const Cmp = loadComponent(comp.componentName);
                  if (!Cmp) {
                    return <Fragment key={comp.id} />;
                  }

                  return (
                    <Suspense
                      key={comp.id}
                      fallback={
                        <SkeletonLoader componentName={comp.componentName} />
                      }
                    >
                      <Cmp {...(comp.data as any)} useStore variant={comp.id} />
                    </Suspense>
                  );
                })
              ) : (
                // Fallback if no components found
                <ProjectDetails1 projectSlug={projectSlug} useStore={true} />
              )}
            </main>
            <StaticFooter1 />
          </div>
        </I18nProvider>
      </GA4Provider>
    </GTMProvider>
  );
}
