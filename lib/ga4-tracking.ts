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
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || 'G-WTN83NMVW1';
  
  console.log('🚀 GA4: Starting initialization with ID:', ga4Id);
  
  // Initialize dataLayer and gtag first
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
  
  // Wait for script to load before configuring
  script.onload = () => {
    console.log('✅ GA4: Script loaded successfully');
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, {
      custom_map: {
        'dimension1': 'tenant_id'
      }
    });
    console.log('✅ GA4: Configuration complete');
  };
  
  script.onerror = () => {
    console.error('❌ GA4: Failed to load script');
  };
  
  document.head.appendChild(script);
};

// Check if GA4 is ready
const isGA4Ready = (): boolean => {
  return typeof window !== 'undefined' && 
         window.gtag && 
         window.dataLayer && 
         typeof window.gtag === 'function';
};

// Track page view
export const trackPageView = (tenantId: string, pagePath: string) => {
  if (isGA4Ready()) {
    console.log('🚀 GA4: Tracking page view', { tenantId, pagePath });
    window.gtag('event', 'page_view', {
      tenant_id: tenantId,
      page_path: pagePath,
      page_title: document.title
    });
  } else {
    console.warn('⚠️ GA4: Not ready yet, retrying in 100ms');
    setTimeout(() => trackPageView(tenantId, pagePath), 100);
  }
};

// Track property view
export const trackPropertyView = (tenantId: string, propertySlug: string) => {
  if (isGA4Ready()) {
    console.log('🏠 GA4: Tracking property view', { tenantId, propertySlug });
    window.gtag('event', 'property_view', {
      tenant_id: tenantId,
      property_slug: propertySlug,
      page_path: `/property/${propertySlug}`
    });
  } else {
    console.warn('⚠️ GA4: Not ready yet, retrying in 100ms');
    setTimeout(() => trackPropertyView(tenantId, propertySlug), 100);
  }
};

// Track project view
export const trackProjectView = (tenantId: string, projectSlug: string) => {
  if (isGA4Ready()) {
    console.log('🏗️ GA4: Tracking project view', { tenantId, projectSlug });
    window.gtag('event', 'project_view', {
      tenant_id: tenantId,
      project_slug: projectSlug,
      page_path: `/project/${projectSlug}`
    });
  } else {
    console.warn('⚠️ GA4: Not ready yet, retrying in 100ms');
    setTimeout(() => trackProjectView(tenantId, projectSlug), 100);
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
