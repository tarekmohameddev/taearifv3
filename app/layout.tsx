"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import useAuthStore from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReCaptchaWrapper } from "@/components/ReCaptchaWrapper";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // الحصول على الدوال والبيانات من Zustand
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);

  // عند التركيب (mount)، نقوم بجلب بيانات المستخدم
  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, [fetchUserData]);

  // إعادة التوجيه إلى صفحة تسجيل الدخول بعد انتهاء التحميل إذا لم يكن المستخدم مسجّل دخول
  useEffect(() => {
    if (isMounted && !IsLoading && !UserIslogged) {
      router.push("/login");
    }
  }, [isMounted, IsLoading, UserIslogged, router]);

  // في حال لم يكن التطبيق مثبت بعد نعرض صفحة فارغة لتجنب مشاكل الترطيب (hydration)
  if (!isMounted) {
    return (
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body />
      </html>
    );
  }

  return (
    <html lang="ar" dir="rtl" className="light" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster />
          <ReCaptchaWrapper>
            <ClientLayout>{children}</ClientLayout>
          </ReCaptchaWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
