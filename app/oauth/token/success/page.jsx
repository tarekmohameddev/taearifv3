import { headers } from "next/headers";
import { notFound } from "next/navigation";
import TenantPageWrapper from "../../../TenantPageWrapper";
import OAuthSuccessPageContent from "@/components/oauth/OAuthSuccessPageContent";

export default async function OAuthSuccessPage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، فهذه صفحة tenant خاصة
  if (tenantId) {
    return (
      <TenantPageWrapper tenantId={tenantId} slug={"oauth/token/success"} />
    );
  }

  // إذا لم يكن هناك tenantId، اعرض صفحة OAuth العامة
  return <OAuthSuccessPageContent />;
}
