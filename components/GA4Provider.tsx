"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeGA4, trackPageView, setTenantContext } from '@/lib/ga4-tracking';

interface GA4ProviderProps {
  tenantId: string | null;
  children: React.ReactNode;
}

export default function GA4Provider({ tenantId, children }: GA4ProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize GA4 only once
    initializeGA4();
  }, []);

  useEffect(() => {
    // Track page view when pathname or tenantId changes
    if (tenantId && pathname) {
      // Set tenant context
      setTenantContext(tenantId, tenantId);
      
      // Track page view
      trackPageView(tenantId, pathname);
    }
  }, [tenantId, pathname]);

  return <>{children}</>;
}
