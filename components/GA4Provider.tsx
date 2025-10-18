"use client";
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initializeGA4, trackPageView, setTenantContext } from '@/lib/ga4-tracking';

interface GA4ProviderProps {
  tenantId: string | null;
  children: React.ReactNode;
}

export default function GA4Provider({ tenantId, children }: GA4ProviderProps) {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if we should track this domain
    const currentDomain = window.location.hostname;
    const shouldTrack = shouldTrackDomain(currentDomain);
    
    if (!shouldTrack) {
      console.log('🚫 GA4: Skipping tracking for domain:', currentDomain);
      return;
    }
    
    // Initialize GA4 only once
    if (!isInitialized) {
      console.log('🚀 GA4: Initializing...');
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
      console.log('📊 GA4: Tracking page view', { 
        tenantId: finalTenantId, 
        pathname,
        domain: currentDomain 
      });
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
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'mandhoor.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;
  
  console.log('🔍 GA4: Checking domain:', domain);
  console.log('🔍 GA4: Production domain:', productionDomain);
  console.log('🔍 GA4: Local domain:', localDomain);
  console.log('🔍 GA4: Is development:', isDevelopment);
  
  // Don't track main domain
  if (domain === `www.${productionDomain}` || domain === productionDomain) {
    console.log('❌ GA4: Main domain excluded:', domain);
    return false;
  }
  
  // Track tenant subdomains in production
  if (!isDevelopment && domain.endsWith(`.${productionDomain}`)) {
    console.log('✅ GA4: Tenant subdomain (production):', domain);
    return true;
  }
  
  // Track localhost for development
  if (isDevelopment && (domain === localDomain || domain.includes(localDomain))) {
    console.log('✅ GA4: Local domain (development):', domain);
    return true;
  }
  
  console.log('❌ GA4: Domain not tracked:', domain);
  return false;
};

// Get tenant ID from subdomain
const getTenantIdFromDomain = (domain: string): string | null => {
  const productionDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || 'mandhoor.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Extract local domain from API URL
  const localDomain = new URL(apiUrl).hostname;
  
  console.log('🔍 GA4: Getting tenant ID from domain:', domain);
  
  // For production: tenant1.mandhoor.com -> tenant1
  if (!isDevelopment && domain.endsWith(`.${productionDomain}`)) {
    const subdomain = domain.replace(`.${productionDomain}`, '');
    console.log('✅ GA4: Tenant ID (production):', subdomain);
    return subdomain;
  }
  
  // For development: tenant1.localhost -> tenant1
  if (isDevelopment && domain.includes(localDomain)) {
    const parts = domain.split('.');
    if (parts.length > 1 && parts[0] !== localDomain) {
      const subdomain = parts[0];
      console.log('✅ GA4: Tenant ID (development):', subdomain);
      return subdomain;
    }
  }
  
  console.log('❌ GA4: No tenant ID found');
  return null;
};
