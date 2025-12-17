"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function ReCaptchaClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [key, setKey] = useState(0);
  const prevPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // تخطي الـ mount الأول
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // فقط عند تغيير المسار
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;

      // تنظيف ReCAPTCHA القديمة
      const cleanupReCaptcha = () => {
        try {
          // إزالة ReCAPTCHA badge القديمة
          const badges = document.querySelectorAll(".grecaptcha-badge");
          badges.forEach((badge) => {
            const parent = badge.parentElement;
            if (parent) {
              parent.remove();
            }
          });

          // إزالة iframe القديمة
          const iframes = document.querySelectorAll('iframe[src*="recaptcha"]');
          iframes.forEach((iframe) => {
            iframe.remove();
          });

          // إزالة scripts القديمة
          const scripts = document.querySelectorAll('script[src*="recaptcha"]');
          scripts.forEach((script) => {
            // لا نحذف الـ script الرئيسي، فقط نعيد تهيئة
          });

          // مسح grecaptcha من window إذا كان موجوداً
          if (typeof window !== "undefined" && (window as any).grecaptcha) {
            try {
              (window as any).grecaptcha.reset?.();
            } catch (e) {
              console.log("grecaptcha reset failed:", e);
            }
          }
        } catch (error) {
          console.log("Cleanup error:", error);
        }
      };

      cleanupReCaptcha();

      // إعادة mount بعد تأخير قصير
      const timer = setTimeout(() => {
        setKey((prev) => prev + 1);
      }, 150);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname]);

  return (
    <GoogleReCaptchaProvider
      key={key}
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
      container={{
        parameters: {
          badge: "bottomright",
          theme: "light",
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
