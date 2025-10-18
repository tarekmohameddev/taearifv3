"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import ProjectDetail from "@/components/project-detail";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { trackProjectView } from "@/lib/ga4-tracking";

interface ProjectPageWrapperProps {
  tenantId: string | null;
  projectSlug: string;
}

export default function ProjectPageWrapper({
  tenantId,
  projectSlug,
}: ProjectPageWrapperProps) {
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);

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
      trackProjectView(tenantId, projectSlug);
    }
  }, [tenantId, projectSlug]);

  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId}>
        <I18nProvider>
        <div className="min-h-screen flex flex-col" dir="rtl">
        <StaticHeader1 />
        <main className="flex-1">
          <ProjectDetail projectSlug={projectSlug} />
        </main>
        <StaticFooter1 />
      </div>
    </I18nProvider>
    </GA4Provider>
    </GTMProvider>
  );
}
