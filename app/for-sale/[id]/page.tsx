import { headers } from "next/headers";
import ForSalePageWrapper from "./ForSalePageWrapper";

export default async function ForSalePage({
  params,
}: {
  params: { id: string };
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  return <ForSalePageWrapper tenantId={tenantId} propertyId={params.id} />;
}
