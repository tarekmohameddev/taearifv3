import { headers } from "next/headers";
import LiveEditorWrapper from "./LiveEditorWrapper";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  return <LiveEditorWrapper tenantId={tenantId} />;
}
