"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import PropertyDetail from "@/components/property-detail";

interface PropertyPageWrapperProps {
  tenantId: string | null;
  propertySlug: string;
}

export default function PropertyPageWrapper({
  tenantId,
  propertySlug,
}: PropertyPageWrapperProps) {
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

  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col" dir="rtl">
        <StaticHeader1 />
        <main className="flex-1">
          <PropertyDetail propertySlug={propertySlug} />
        </main>
        <StaticFooter1 />
      </div>
    </I18nProvider>
  );
}
