"use client";

import { useEffect } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import Header1 from "@/components/tenant/header/header1";
import Footer1 from "@/components/tenant/footer/footer1";
import SignInForm from "@/components/tenant/auth/signin-form";

interface SignInPageWrapperProps {
  tenantId: string | null;
}

export default function SignInPageWrapper({ tenantId }: SignInPageWrapperProps) {
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
    <div className="min-h-screen flex flex-col">
      <Header1 />
      <main className="flex-1 flex items-center justify-center">
        <SignInForm />
      </main>
      <Footer1 />
    </div>
  );
}
