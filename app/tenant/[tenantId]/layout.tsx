"use client";

import React, { ReactNode, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import useTenantStore from "@/context-liveeditor/tenantStore";

export default function TenantLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ tenantId: string }>();
  const tenantId = params?.tenantId;
  const pathname = usePathname();
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantData = useTenantStore((s) => s.tenantData);
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);

  useEffect(() => {
    const isLiveEditor = (pathname || "").includes("/live-editor");
    if (isLiveEditor) return; // دع live-editor layout يتولى الجلب الخاص به
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, pathname, tenantData, loadingTenantData, fetchTenantData]);

  return (
    <>
      {children}
      </> 
  );
}
