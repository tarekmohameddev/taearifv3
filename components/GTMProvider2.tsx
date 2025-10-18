"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { initDataLayer, trackPageView } from "@/lib/gtm";

interface GTMProviderProps {
  children: React.ReactNode;
  containerId?: string;
}

export default function GTMProvider({
  children,
  containerId,
}: GTMProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize dataLayer
  useEffect(() => {
    initDataLayer();
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Google Tag Manager Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${containerId || "GTM-KBL37C9T"}');
          `,
        }}
      />
      {children}
    </>
  );
}
