"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function SlugNotFound() {
  const params = useParams<{ tenantId: string; slug: string }>();
  const tenantId = params?.tenantId;
  const slug = params?.slug;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        The page "{slug}" you are looking for does not exist or has not been
        configured for this tenant.
      </p>
      <div className="flex gap-4">
        <Link href={`/${tenantId}`} className="btn btn-primary">
          Return to Homepage
        </Link>
        <Link href="/" className="btn btn-outline">
          Go to Main Site
        </Link>
      </div>
    </div>
  );
}
