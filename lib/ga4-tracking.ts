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
  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-RVFKM2F9ZN';
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', 'G-RVFKM2F9ZN', {
    custom_map: {
      'dimension1': 'tenant_id'
    }
  });
};

// Track page view
export const trackPageView = (tenantId: string, pagePath: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      tenant_id: tenantId,
      page_path: pagePath
    });
  }
};

// Track property view
export const trackPropertyView = (tenantId: string, propertySlug: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'property_view', {
      tenant_id: tenantId,
      property_slug: propertySlug,
      page_path: `/property/${propertySlug}`
    });
  }
};

// Track project view
export const trackProjectView = (tenantId: string, projectSlug: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'project_view', {
      tenant_id: tenantId,
      project_slug: projectSlug,
      page_path: `/project/${projectSlug}`
    });
  }
};

// Track contact form submission
export const trackContactForm = (tenantId: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'contact_form_submit', {
      tenant_id: tenantId,
      page_path: window.location.pathname
    });
  }
};

// Track search
export const trackSearch = (tenantId: string, searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      tenant_id: tenantId,
      search_term: searchTerm,
      page_path: window.location.pathname
    });
  }
};

// Set tenant context
export const setTenantContext = (tenantId: string, username: string) => {
  if (typeof window !== 'undefined') {
    window.tenantContext = {
      username,
      tenantId
    };
  }
};
