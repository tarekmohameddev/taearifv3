// GTM Utility Functions for Event Tracking

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize GTM dataLayer if not already initialized
export const initDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    // Initialize GA4 with tenant configuration
    const ga4Id =
      process.env.NEXT_PUBLIC_GA4_ID ||
      process.env.GOOGLE_ANALYTICS_PROPERTY_ID ||
      "G-WTN83NMVW1";
    const tenantId = getTenantIdFromCurrentDomain();

    if (tenantId) {
      window.gtag("js", new Date());
      window.gtag("config", ga4Id, {
        custom_map: {
          dimension1: "tenant_id",
        },
        tenant_id: tenantId,
      });
    }
  }
};

// Get tenant ID from current domain
const getTenantIdFromCurrentDomain = (): string | null => {
  if (typeof window === "undefined") return null;

  const productionDomain =
    process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "taearif.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const isDevelopment = process.env.NODE_ENV === "development";

  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;
  const currentDomain = window.location.hostname;

  // قائمة الكلمات المحجوزة التي لا يجب أن تكون tenantId
  const reservedWords = [
    "www",
    "api",
    "admin",
    "app",
    "mail",
    "ftp",
    "blog",
    "shop",
    "store",
    "dashboard",
    "live-editor",
    "auth",
    "login",
    "register",
  ];

  // For production: tenant1.taearif.com -> tenant1
  if (!isDevelopment && currentDomain.endsWith(`.${productionDomain}`)) {
    const subdomain = currentDomain.replace(`.${productionDomain}`, "");

    // ✅ تحقق من أن subdomain ليس من الكلمات المحجوزة
    if (
      !subdomain ||
      subdomain.trim() === "" ||
      reservedWords.includes(subdomain.toLowerCase())
    ) {
      console.warn(
        "⚠️ GTM: Invalid subdomain (reserved word or empty):",
        subdomain,
      );
      return null;
    }

    return subdomain;
  }

  // For development: tenant1.localhost -> tenant1
  if (isDevelopment && currentDomain.includes(localDomain)) {
    const parts = currentDomain.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];

      // ✅ تحقق من أن subdomain ليس من الكلمات المحجوزة
      if (
        !subdomain ||
        subdomain.trim() === "" ||
        reservedWords.includes(subdomain.toLowerCase())
      ) {
        console.warn(
          "⚠️ GTM: Invalid subdomain (reserved word or empty):",
          subdomain,
        );
        return null;
      }

      return subdomain;
    }
  }

  return null;
};

const initializeGTM = initDataLayer;

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>,
) => {
  initializeGTM();

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

// Track page views manually
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  initializeGTM();

  if (typeof window !== "undefined" && window.gtag) {
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-KS62NNTG";
    window.gtag("config", gtmId, {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  }
};

// Track conversions
export const trackConversion = (
  conversionId: string,
  value?: number,
  currency?: string,
) => {
  initializeGTM();

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: conversionId,
      value: value,
      currency: currency || "USD",
    });
  }
};

// Track purchases
export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string,
  items: any[],
) => {
  initializeGTM();

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items,
    });
  }
};

// Track user interactions
export const trackUserInteraction = (
  action: string,
  category: string,
  label?: string,
  value?: number,
) => {
  initializeGTM();

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track form submissions
export const trackFormSubmission = (formName: string, formType?: string) => {
  trackEvent("form_submit", {
    form_name: formName,
    form_type: formType,
  });
};

// Track button clicks
export const trackButtonClick = (
  buttonName: string,
  buttonLocation?: string,
) => {
  trackEvent("button_click", {
    button_name: buttonName,
    button_location: buttonLocation,
  });
};

// Track navigation events
export const trackNavigation = (destination: string, source?: string) => {
  trackEvent("navigation", {
    destination: destination,
    source: source,
  });
};

// Track search events
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

// Track login events
export const trackLogin = (method: string) => {
  trackEvent("login", {
    method: method,
  });
};

// Track signup events
export const trackSignup = (method: string) => {
  trackEvent("sign_up", {
    method: method,
  });
};

// Track errors
export const trackError = (errorMessage: string, errorCode?: string) => {
  trackEvent("error", {
    error_message: errorMessage,
    error_code: errorCode,
  });
};
