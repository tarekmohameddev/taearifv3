"use client";

import { Suspense, lazy, Fragment, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import Loading from "@/app/loading";
import { notFound } from "next/navigation";
import { getSectionPath, getComponentSubPath } from "@/lib-liveeditor/ComponentsList";

// Lazy load Header and Footer components
const loadComponent = (componentName: string) => {
  if (!componentName) return null;
  const match = componentName?.match(/^(.*?)(\d+)$/);
  if (!match) return null;
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
      default: () => <div>Component {componentName} not found</div>,
    })),
  );
};

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  console.log('🌍 GlobalLayout - Component rendered');
  
  const { userData } = useAuthStore();
  const tenantId = userData?.username;
  const slug = useParams<{ slug: string }>()?.slug;
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  
  // Get global components from editor store
  const { globalHeaderData, globalFooterData, setGlobalHeaderData, setGlobalFooterData } = useEditorStore();
  
  console.log('🌍 GlobalLayout - Initial state:', {
    tenantId,
    slug,
    hasTenantData: !!tenantData,
    loadingTenantData,
    hasGlobalHeaderData: !!globalHeaderData,
    hasGlobalFooterData: !!globalFooterData
  });

  // Initialize global components with default data if not exists (only once)
  useEffect(() => {
    console.log('🚀 GlobalLayout - Initializing global components');
    console.log('🚀 GlobalLayout - Current globalHeaderData:', globalHeaderData);
    console.log('🚀 GlobalLayout - Current globalFooterData:', globalFooterData);
    
    // Only initialize if globalHeaderData is completely empty (not just missing some properties)
    if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
      console.log('🚀 GlobalLayout - Setting default header data');
      const { getDefaultHeaderData } = require("@/context-liveeditor/editorStoreFunctions/headerFunctions");
      const defaultData = getDefaultHeaderData();
      console.log('🚀 GlobalLayout - Default header data:', defaultData);
      setGlobalHeaderData(defaultData);
    }
    
    // Only initialize if globalFooterData is completely empty (not just missing some properties)
    if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
      console.log('🚀 GlobalLayout - Setting default footer data');
      const { getDefaultFooterData } = require("@/context-liveeditor/editorStoreFunctions/footerFunctions");
      const defaultData = getDefaultFooterData();
      setGlobalFooterData(defaultData);
    }
  }, []); // Remove dependencies to prevent re-initialization

  // تحميل البيانات إذا لم تكن موجودة
  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // For pages without tenantId (like homepage), we still want to show global header
  const shouldShowGlobalHeader = !tenantId || tenantData;

  // Load Header and Footer components
  const HeaderComponent = useMemo(() => {
    
    if (!globalHeaderData || Object.keys(globalHeaderData).length === 0) {
      console.log('❌ GlobalLayout - No globalHeaderData, returning null');
      return null;
    }
    
    console.log('✅ GlobalLayout - Loading header1 component');
    return loadComponent("header1");
  }, [globalHeaderData]);

  const FooterComponent = useMemo(() => {
    if (!globalFooterData || Object.keys(globalFooterData).length === 0) {
      return null;
    }
    return loadComponent("footer1");
  }, [globalFooterData]);

  // إذا كان التحميل جارياً، أظهر شاشة التحميل
  if (loadingTenantData && tenantId) {
    return <Loading />;
  }

  // Debug: Log global header data changes

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      {HeaderComponent ? (
        <Suspense fallback={<Loading />}>
          <HeaderComponent
            {...(globalHeaderData as any)}
            useStore={true}
            variant="global-header"
            id="global-header"
            key={`global-header-${JSON.stringify(globalHeaderData)}`}
            onRender={() => console.log('🌍 HeaderComponent rendered with props:', {
              variant: "global-header",
              id: "global-header",
              background: globalHeaderData?.background?.colors?.from
            })}
          />
        </Suspense>
      ) : (
        <div style={{ padding: '10px', background: 'red', color: 'white' }}>
          ❌ NO GLOBAL HEADER - HeaderComponent is null
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      {FooterComponent && (
        <Suspense fallback={<Loading />}>
          <FooterComponent
            {...(globalFooterData as any)}
            useStore={true}
            variant="global-footer"
            id="global-footer"
          />
        </Suspense>
      )}
    </div>
  );
}
