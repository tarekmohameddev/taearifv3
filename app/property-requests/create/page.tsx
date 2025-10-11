import { headers } from "next/headers";
import { notFound } from "next/navigation";
import TenantPageWrapper from "../../TenantPageWrapper";

// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = "force-dynamic";

export default async function PropertyRequestsCreatePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا لم يكن هناك tenantId، أظهر 404
  if (!tenantId) {
    notFound();
  }

  return (
    <TenantPageWrapper tenantId={tenantId} slug={"property-requests/create"} />
  );
}
