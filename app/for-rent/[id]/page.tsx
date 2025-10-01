import { headers } from "next/headers";
import ForRentPageWrapper from "./ForRentPageWrapper";

export default async function ForRentPage({
  params,
}: {
  params: { id: string };
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  return <ForRentPageWrapper tenantId={tenantId} propertyId={params.id} />;
}
