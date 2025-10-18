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
  }
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
    window.gtag("config", "GTM-KBL37C9T", {
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
