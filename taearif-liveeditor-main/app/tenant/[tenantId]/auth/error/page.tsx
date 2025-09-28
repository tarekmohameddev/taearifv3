import type { Metadata } from "next";
import Link from "next/link";
import Header1 from "@/components/tenant/header/header1";
import Footer1 from "@/components/tenant/footer/footer1";

export const metadata: Metadata = {
  title: "Authentication Error | Multi-Tenant E-Commerce",
  description: "An error occurred during authentication",
};

export default function AuthErrorPage() {
  return (
    <>
      <Header1 />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-8">
            An error occurred during the authentication process. Please try
            again or contact support if the problem persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" className="btn btn-primary">
              Try Again
            </Link>
            <Link href="/" className="btn btn-secondary">
              Return to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer1 />
    </>
  );
}
