import { headers } from "next/headers";
import { LandingPage } from "@/components/landing-page";
import { notFound } from "next/navigation";
import TenantPageWrapper from "../TenantPageWrapper";

// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، فهذه صفحة tenant خاصة - لا نعرض صفحة الهبوط العامة
  if (tenantId) {
    return <TenantPageWrapper tenantId={tenantId} slug={"landing"} />;
  }

  return <LandingPage />;
}
