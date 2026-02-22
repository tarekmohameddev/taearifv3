import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { NewSignupPage } from "@/components/auth/new-signup-page";
import { LoginPageWithReCaptcha } from "@/components/signin-up/LoginPageWithReCaptcha";

export const metadata = {
  title: "إنشاء حساب — تعريف",
  description: "أنشئ حسابك في منصة تعريف العقارية وابدأ رحلتك الرقمية",
};

export default function AuthSignupPage() {
  return (
    <AuthLayout
      subtitle="أنشئ موقعك العقاري الاحترافي في دقائق، وادارته بسهولة من مكان واحد."
    >
      <LoginPageWithReCaptcha>
        {/* Suspense required because NewSignupPage uses useSearchParams */}
        <Suspense fallback={null}>
          <NewSignupPage />
        </Suspense>
      </LoginPageWithReCaptcha>
    </AuthLayout>
  );
}
