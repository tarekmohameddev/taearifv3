import { headers } from "next/headers";
import ProjectPageWrapper from "./ProjectPageWrapper";

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  return <ProjectPageWrapper tenantId={tenantId} projectSlug={params.id} />;
}
