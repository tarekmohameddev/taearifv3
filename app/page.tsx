import { headers } from "next/headers";
import HomePageWrapper from "./HomePageWrapper";
import TaearifLandingPageSimple from "../components/TaearifLandingPageSimple";

export default async function HomePage() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا لم يكن هناك subdomain (tenantId)، اعرض صفحة تعاريف الرسمية
  if (!tenantId) {
    return <TaearifLandingPageSimple />;
  }

  return <HomePageWrapper tenantId={tenantId} />;
}
