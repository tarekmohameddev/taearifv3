"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GTMProviderProps {
  children: React.ReactNode;
  containerId: string;
}

export function GTMProvider({ children, containerId }: GTMProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize GTM dataLayer
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function() {
        window.dataLayer.push(arguments);
      };
    }
  }, []);

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      window.gtag('config', containerId, {
        page_path: url,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams, containerId]);

  return (
    <>
      {/* GTM Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${containerId}');
          `,
        }}
      />
      {children}
    </>
  );
}
