import { headers } from "next/headers";
import { GoogleRegisterPage } from "@/components/signin-up/google-register-page";
import { notFound } from "next/navigation";
import TenantPageWrapper from "../../../TenantPageWrapper";
export const metadata = {
  title: "تسجيل حساب جديد",
};

export default async function Register() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  // إذا كان هناك tenantId، فهذه صفحة tenant خاصة - لا نعرض صفحة التسجيل العامة
  if (tenantId) {
    return <TenantPageWrapper tenantId={tenantId} slug={"oauth/social/extra-info"} />;
    }

  return <GoogleRegisterPage />;
}
