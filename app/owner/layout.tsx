import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type") as
    | "subdomain"
    | "custom"
    | null;
  const host = headersList.get("host") || "";

  // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
  const isCustomDomain =
    /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(
      host,
    );

  // إذا لم يكن هناك tenantId، اعرض صفحة not found
  if (!tenantId) {
    notFound();
  }

  // إذا كان هناك tenantId (subdomain أو custom domain)، اعرض صفحات owner
  // isCustomDomain يمكن استخدامه للتحقق من نوع الـ domain إذا لزم الأمر
  return <>{children}</>;
}
