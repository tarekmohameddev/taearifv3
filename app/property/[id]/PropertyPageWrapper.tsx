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

  // Add immediate console log to verify component is loading
  console.log("🏠 PropertyPageWrapper: Component loaded!", {
    tenantId,
    propertySlug,
    hostname:
      typeof window !== "undefined" ? window.location.hostname : "server",
    timestamp: new Date().toISOString(),
  });

  // Set tenantId in store when component mounts
  useEffect(() => {
    console.log("🏠 PropertyPageWrapper: Setting tenant ID", { tenantId });
    if (tenantId) {
      setTenantId(tenantId);
    } else {
      console.log("❌ PropertyPageWrapper: No tenant ID provided!");
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

  console.log("🏠 PropertyPageWrapper: Rendering with GA4Provider", {
    tenantId,
  });

  return (
    <GTMProvider>
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
    </GTMProvider>
  );
}
