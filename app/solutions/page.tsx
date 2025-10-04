import { headers } from "next/headers";
import SolutionsPage from "@/components/solutions/SolutionsPage";
import { notFound } from "next/navigation";

// إبقاء الصفحة dynamic لتتمكن من التحقق من tenantId
export const dynamic = 'force-dynamic';

export default async function Solutions() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، فهذه صفحة tenant خاصة - لا نعرض صفحة الحلول العامة
  if (tenantId) {
    notFound();
  }

  return <SolutionsPage />;
}
