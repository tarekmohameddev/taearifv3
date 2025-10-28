"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";
import { DynamicReCaptcha } from "@/components/DynamicReCaptcha";

interface ClientReCaptchaLoaderProps {
  children: ReactNode;
}

export function ClientReCaptchaLoader({ children }: ClientReCaptchaLoaderProps) {
  const pathname = usePathname(); // Client-side pathname (updates on navigation)
  
  // List of pages that need reCAPTCHA
  const recaptchaPages = [
    "/dashboard/affiliate",
    "/dashboard/analytics",
    "/dashboard/apps",
    "/dashboard/blog",
    "/dashboard/blogs",
    "/dashboard/content",
    "/dashboard/crm",
    "/dashboard/customers",
    "/dashboard/forgot-password",
    "/dashboard/marketing",
    "/dashboard/messages",
    "/dashboard/projects",
    "/dashboard/properties",
    "/dashboard/property-requests",
    "/dashboard/purchase-management",
    "/dashboard/rental-management",
    "/dashboard/reset",
    "/dashboard/settings",
    "/dashboard/templates",
    "/dashboard/whatsapp-ai",
    "/dashboard",
    "/register",
    "/login",
    "/live-editor",
    "/oauth/token/success",
    "/oauth/social/extra-info",
    "/onboarding",
    "/forgot-password",
    "/landing",
    "/get-started",
  ];
  
  // Determine if current page needs reCAPTCHA
  const shouldLoadReCaptcha = useMemo(() => {
    let cleanPathname = pathname;
    
    // Remove locale prefix if present (/ar/ or /en/)
    const localePattern = /^\/(en|ar)\//;
    if (localePattern.test(pathname)) {
      cleanPathname = pathname.replace(/^\/(en|ar)/, "");
    }
    
    // Check if current path matches any reCAPTCHA page
    return recaptchaPages.some((page) => {
      return cleanPathname === page || cleanPathname.startsWith(page + "/");
    });
  }, [pathname]);
  
  // Conditionally wrap children in DynamicReCaptcha
  if (shouldLoadReCaptcha) {
    return <DynamicReCaptcha>{children}</DynamicReCaptcha>;
  }
  
  return <>{children}</>;
}

