// GA4 Tracking for Tenant Pages
// This file handles Google Analytics 4 tracking for tenant websites

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    tenantContext?: {
      username: string;
      tenantId: string;
    };
  }
}

// Initialize GA4
export const initializeGA4 = () => {
  const ga4Id =
    process.env.NEXT_PUBLIC_GA4_ID ||
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID ||
    "G-RVFKM2F9ZN";

  // Check if we should track this domain
  const currentDomain = window.location.hostname;
  const shouldTrack = shouldTrackDomain(currentDomain);

  if (!shouldTrack) {
    console.log("🚫 GA4: Skipping tracking for domain:", currentDomain);
    return;
  }

  console.log("🚀 GA4: Starting initialization with ID:", ga4Id);

  // Initialize dataLayer and gtag first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };

  // Load GA4 script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;

  // Wait for script to load before configuring
  script.onload = () => {
    console.log("✅ GA4: Script loaded successfully");
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, {
      custom_map: {
        dimension1: "tenant_id",
      },
      // Set cookie domain for wildcard
      cookie_domain: ".mandhoor.com",
      // Set transport type
      transport_type: "beacon",
    });
    console.log("✅ GA4: Configuration complete");
  };

  script.onerror = () => {
    console.error("❌ GA4: Failed to load script");
  };

  document.head.appendChild(script);
};

// Check if domain should be tracked
const shouldTrackDomain = (domain: string): boolean => {
  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;

  console.log("🔍 GA4: Checking domain:", domain);
  console.log("🔍 GA4: Production domain:", productionDomain);
  console.log("🔍 GA4: Local domain:", localDomain);
  console.log("🔍 GA4: Is development:", isDevelopment);

  // Don't track main domain
  if (domain === `www.${productionDomain}` || domain === productionDomain) {
    console.log("❌ GA4: Main domain excluded:", domain);
    return false;
  }

  // Track tenant subdomains in production
  if (!isDevelopment && domain.endsWith(`.${productionDomain}`)) {
    console.log("✅ GA4: Tenant subdomain (production):", domain);
    return true;
  }

  // Track localhost for development
  if (
    isDevelopment &&
    (domain === localDomain || domain.includes(localDomain))
  ) {
    console.log("✅ GA4: Local domain (development):", domain);
    return true;
  }

  console.log("❌ GA4: Domain not tracked:", domain);
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

  console.log("🔍 GA4: Getting tenant ID from domain:", domain);

  // For production: tenant1.mandhoor.com -> tenant1
  if (!isDevelopment && domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, "");
    console.log("✅ GA4: Tenant ID (production):", subdomain);
    return subdomain;
  }

  // For development: tenant1.localhost -> tenant1
  if (isDevelopment && domain.includes(localDomain)) {
    const parts = domain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];
      console.log("✅ GA4: Tenant ID (development):", subdomain);
      return subdomain;
    }
  }

  console.log("❌ GA4: No tenant ID found");
  return null;
};

// Check if GA4 is ready
const isGA4Ready = (): boolean => {
  return (
    typeof window !== "undefined" &&
    window.gtag &&
    window.dataLayer &&
    typeof window.gtag === "function"
  );
};

// Track page view
export const trackPageView = (tenantId: string, pagePath: string) => {
  if (isGA4Ready()) {
    console.log("🚀 GA4: Tracking page view", { tenantId, pagePath });
    window.gtag("event", "page_view", {
      tenant_id: tenantId,
      page_path: pagePath,
      page_title: document.title,
    });
  } else {
    console.warn("⚠️ GA4: Not ready yet, retrying in 100ms");
    setTimeout(() => trackPageView(tenantId, pagePath), 100);
  }
};

// Track property view
export const trackPropertyView = (tenantId: string, propertySlug: string) => {
  if (isGA4Ready()) {
    console.log("🏠 GA4: Tracking property view", { tenantId, propertySlug });
    window.gtag("event", "property_view", {
      tenant_id: tenantId,
      property_slug: propertySlug,
      page_path: `/property/${propertySlug}`,
    });
  } else {
    console.warn("⚠️ GA4: Not ready yet, retrying in 100ms");
    setTimeout(() => trackPropertyView(tenantId, propertySlug), 100);
  }
};

// Track project view
export const trackProjectView = (tenantId: string, projectSlug: string) => {
  if (isGA4Ready()) {
    console.log("🏗️ GA4: Tracking project view", { tenantId, projectSlug });
    window.gtag("event", "project_view", {
      tenant_id: tenantId,
      project_slug: projectSlug,
      page_path: `/project/${projectSlug}`,
    });
  } else {
    console.warn("⚠️ GA4: Not ready yet, retrying in 100ms");
    setTimeout(() => trackProjectView(tenantId, projectSlug), 100);
  }
};

// Track contact form submission
export const trackContactForm = (tenantId: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact_form_submit", {
      tenant_id: tenantId,
      page_path: window.location.pathname,
    });
  }
};

// Track search
export const trackSearch = (tenantId: string, searchTerm: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "search", {
      tenant_id: tenantId,
      search_term: searchTerm,
      page_path: window.location.pathname,
    });
  }
};

// Set tenant context
export const setTenantContext = (tenantId: string, username: string) => {
  if (typeof window !== "undefined") {
    window.tenantContext = {
      username,
      tenantId,
    };
  }
};
