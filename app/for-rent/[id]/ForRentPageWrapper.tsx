"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import Header1I18n from "@/components/tenant/header/header1-i18n";
import Footer1I18n from "@/components/tenant/footer/footer1-i18n";
import { I18nProvider } from "@/components/providers/I18nProvider";
import PropertyDetail from "@/components/property-detail";

interface ForRentPageWrapperProps {
  tenantId: string | null;
  propertyId: string;
}

export default function ForRentPageWrapper({ tenantId, propertyId }: ForRentPageWrapperProps) {
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
      <div className="min-h-screen flex flex-col">
        <Header1I18n />
        <main className="flex-1">
          <PropertyDetail propertyId={propertyId} />
        </main>
        <Footer1I18n />
      </div>
    </I18nProvider>
  );
}
