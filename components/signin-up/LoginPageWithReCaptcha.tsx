"use client";

import { ReactNode, useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import dynamic from 'next/dynamic';

// تحميل GoogleReCaptchaProvider بشكل ديناميكي
const GoogleReCaptchaProvider = dynamic(
  () => import('react-google-recaptcha-v3').then(mod => mod.GoogleReCaptchaProvider),
  { ssr: false }
);

// Wrapper محلي للتأكد من تحميل ReCAPTCHA
function LocalReCaptchaWrapper({ children }: { children: ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [needsLocalWrapper, setNeedsLocalWrapper] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // التحقق من وجود ReCAPTCHA من الـ layout
    const timer = setTimeout(() => {
      if (!executeRecaptcha) {
        // إذا لم يكن ReCAPTCHA موجود من الـ layout، نحتاج wrapper محلي
        setNeedsLocalWrapper(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [executeRecaptcha]);

  if (!mounted) {
    return <>{children}</>;
  }

  // إذا كان ReCAPTCHA موجود من الـ layout، استخدمه
  if (executeRecaptcha || !needsLocalWrapper) {
    return <>{children}</>;
  }

  // إذا لم يكن موجود، استخدم wrapper محلي
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
      container={{
        parameters: {
          badge: 'bottomright',
          theme: 'light',
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

export function LoginPageWithReCaptcha({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <LocalReCaptchaWrapper>{children}</LocalReCaptchaWrapper>;
}

