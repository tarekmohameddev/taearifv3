import type { Metadata } from "next";
import SignInForm from "@/components/tenant/auth/signin-form";
import Header1 from "@/components/tenant/header/header1";
import Footer1 from "@/components/tenant/footer/footer1";

export const metadata: Metadata = {
  title: "Sign In | Multi-Tenant E-Commerce",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <>
      <Header1 />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
          <SignInForm />
        </div>
      </main>
      <Footer1 />
    </>
  );
}
