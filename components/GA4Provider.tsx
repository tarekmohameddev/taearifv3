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
    // Initialize GA4 only once
    if (!isInitialized) {
      console.log('🚀 GA4: Initializing...');
      initializeGA4();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    // Track page view when pathname or tenantId changes
    if (tenantId && pathname && isInitialized) {
      console.log('📊 GA4: Tracking page view', { tenantId, pathname });
      // Set tenant context
      setTenantContext(tenantId, tenantId);
      
      // Track page view with a small delay to ensure GA4 is ready
      setTimeout(() => {
        trackPageView(tenantId, pathname);
      }, 500);
    }
  }, [tenantId, pathname, isInitialized]);

  return <>{children}</>;
}
