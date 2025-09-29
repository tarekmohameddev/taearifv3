"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import useTenantStore from "@/context-liveeditor/tenantStore";
import useAuthStore from "@/context/AuthContext";

export default function TenantLayout({ children }: { children: ReactNode }) {
  const { userData } = useAuthStore();
  const tenantId = userData?.username;
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
