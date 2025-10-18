"use client";
import Script from "next/script";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEffect } from "react";

interface GTMProviderProps {
  children: React.ReactNode;
}

export function GTMProvider({ children }: GTMProviderProps) {
  const tenantData = useTenantStore((s: any) => s.tenantData);
  const tenantId = useTenantStore((s: any) => s.tenantId);

  // Track page views when tenant data changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag && tenantId) {
      // Track page view with tenant context
      window.gtag("event", "page_view", {
        tenant_id: tenantId,
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  }, [tenantId, tenantData]);

  // Track property views specifically
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag && tenantId) {
      const path = window.location.pathname;
      
      // Track property page views
      if (path.includes("/property/") || path.includes("/project/")) {
        const propertyId = path.split("/").pop();
        window.gtag("event", "property_view", {
          tenant_id: tenantId,
          property_id: propertyId,
          page_path: path,
        });
      }
    }
  }, [tenantId]);

  return (
    <>
      {/* GA4 Script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || 'G-WTN83NMVW1'}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || 'G-WTN83NMVW1'}', {
            'custom_map': {
              'dimension1': 'tenant_id'
            },
            'tenant_id': '${tenantId || 'unknown'}'
          });
        `}
      </Script>
      {children}
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}