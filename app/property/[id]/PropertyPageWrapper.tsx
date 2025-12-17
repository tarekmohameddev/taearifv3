// app\property\[id]\PropertyPageWrapper.tsx
"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import StaticHeader1 from "@/components/tenant/header/StaticHeader1";
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1";
import { I18nProvider } from "@/components/providers/I18nProvider";
import PropertyDetail1 from "@/components/tenant/property/PropertyDetail1";
import GA4Provider from "@/components/GA4Provider";
import GTMProvider from "@/components/GTMProvider";
import { trackPropertyView } from "@/lib/ga4-tracking";

interface PropertyPageWrapperProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;
  propertySlug: string;
}

export default function PropertyPageWrapper({
  tenantId,
  domainType,
  propertySlug,
}: PropertyPageWrapperProps) {
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const setTenantId = useTenantStore((s) => s.setTenantId);

  // Add immediate console log to verify component is loading

  // Set tenantId in store when component mounts
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    } else {
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
      // ✅ للـ custom domains: استخدم username من API
      const finalTenantId =
        domainType === "custom" && tenantData?.username
          ? tenantData.username
          : tenantId;

      trackPropertyView(finalTenantId, propertySlug);
    }
  }, [tenantId, propertySlug, domainType, tenantData?.username]);

  return (
    <GTMProvider>
      <GA4Provider tenantId={tenantId} domainType={domainType}>
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
    </GTMProvider>
  );
}
