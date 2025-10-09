import { headers } from "next/headers";
import TenantPageWrapper from "./TenantPageWrapper";

export default async function TenantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const { slug } = await params;

  return <TenantPageWrapper tenantId={tenantId} slug={slug} />;
}
