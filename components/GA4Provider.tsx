"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  initializeGA4,
  trackPageView,
  setTenantContext,
} from "@/lib/ga4-tracking";

interface GA4ProviderProps {
  tenantId: string | null;
  children: React.ReactNode;
}

export default function GA4Provider({ tenantId, children }: GA4ProviderProps) {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Add immediate console log to verify component is loading
  if (typeof window !== "undefined") {
console.log("GA4Provider", tenantId);

  }

  useEffect(() => {
    // Check if we should track this domain
    const currentDomain = window.location.hostname;
    const shouldTrack = shouldTrackDomain(currentDomain);


    if (!shouldTrack) {
      return;
    }

    // Initialize GA4 only once
    if (!isInitialized) {
      initializeGA4();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Get tenant ID from domain or props
    const currentDomain = window.location.hostname;
    const domainTenantId = getTenantIdFromDomain(currentDomain);
    const finalTenantId = tenantId || domainTenantId;


    // Track page view when pathname or tenantId changes
    if (finalTenantId && pathname && isInitialized) {
      // Set tenant context
      setTenantContext(finalTenantId, finalTenantId);

      // Track page view with a small delay to ensure GA4 is ready
      setTimeout(() => {
        trackPageView(finalTenantId, pathname);
      }, 500);
    }
  }, [tenantId, pathname, isInitialized]);

  return <>{children}</>;
}

// Check if domain should be tracked
const shouldTrackDomain = (domain: string): boolean => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;


  // Don't track main domain
  if (domain === `www.${productionDomain}` || domain === productionDomain) {
    return false;
  }

  // Track tenant subdomains in production (vcvkkokk.mandhoor.com)
  if (domain.endsWith(`.${productionDomain}`)) {
    return true;
  }

  // Track localhost for development
  if (
    isDevelopment &&
    (domain === localDomain || domain.includes(localDomain))
  ) {
    return true;
  }

  return false;
};

// Get tenant ID from subdomain
const getTenantIdFromDomain = (domain: string): string | null => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;


  // For production: tenant1.mandhoor.com -> tenant1
  if (domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, "");
    return subdomain;
  }

  // For development: tenant1.localhost -> tenant1
  if (isDevelopment && domain.includes(localDomain)) {
    const parts = domain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];
      return subdomain;
    }
  }

  return null;
};
