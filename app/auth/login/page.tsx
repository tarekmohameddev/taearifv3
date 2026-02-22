import { AuthLayout } from "@/components/auth/auth-layout";
import { NewLoginPage } from "@/components/auth/new-login-page";
import { LoginPageWithReCaptcha } from "@/components/signin-up/LoginPageWithReCaptcha";

export const metadata = {
  title: "تسجيل الدخول — تعريف",
  description: "سجّل دخولك إلى لوحة تحكم تعريف العقارية",
};

export default function AuthLoginPage() {
  return (
    <AuthLayout>
      <LoginPageWithReCaptcha>
        <NewLoginPage />
      </LoginPageWithReCaptcha>
    </AuthLayout>
  );
}
