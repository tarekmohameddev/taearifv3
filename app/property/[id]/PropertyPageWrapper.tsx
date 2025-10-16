"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import PropertyDetail1 from "@/components/tenant/property/PropertyDetail1";
import GA4Provider from "@/components/GA4Provider";
import { trackPropertyView } from "@/lib/ga4-tracking";

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

  // Track property view
  useEffect(() => {
    if (tenantId && propertySlug) {
      trackPropertyView(tenantId, propertySlug);
    }
  }, [tenantId, propertySlug]);

  return (
    <GA4Provider tenantId={tenantId}>
      <I18nProvider>
        <div className="min-h-screen flex flex-col" dir="rtl">
        <StaticHeader1 />
        <main className="flex-1">
          <PropertyDetail1 propertySlug={propertySlug} />
        </main>
        <StaticFooter1 />
      </div>
    </I18nProvider>
    </GA4Provider>
  );
}
