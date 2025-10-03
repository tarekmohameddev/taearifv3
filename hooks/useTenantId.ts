"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/context/AuthContext";

export function useTenantId() {
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuthStore();

  useEffect(() => {
    const getTenantId = () => {
      // 1. محاولة الحصول على tenantId من الـ headers (middleware)
      if (typeof window !== "undefined") {
        // في الـ client side، يمكننا الحصول على tenantId من الـ URL
        const hostname = window.location.hostname;
        const tenantFromSubdomain = extractTenantFromHostname(hostname);
        
        if (tenantFromSubdomain) {
          setTenantId(tenantFromSubdomain);
          setIsLoading(false);
          return;
        }
      }

      // 2. محاولة الحصول على tenantId من userData
      if (userData?.username) {
        setTenantId(userData.username);
        setIsLoading(false);
        return;
      }

      // 3. إذا لم نجد tenantId، نبقى في حالة loading
      setIsLoading(true);
    };

    getTenantId();
  }, [userData]);

  return { tenantId, isLoading };
}

function extractTenantFromHostname(hostname: string): string | null {
  const localDomain = process.env.NEXT_PUBLIC_LOCAL_DOMAIN || "localhost";
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // قائمة بالكلمات المحجوزة
  const reservedWords = ["www", "api", "admin", "app", "mail", "ftp", "blog", "shop", "store"];

  // For localhost development: tenant1.localhost -> tenant1
  if (hostname.includes(localDomain)) {
    const parts = hostname.split(".");
    if (parts.length > 1 && parts[0] !== localDomain) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  // For production: tenant1.mandhoor.com or tenant1.taearif.com -> tenant1
  if (!isDevelopment && (hostname.includes("mandhoor.com") || hostname.includes("taearif.com"))) {
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const potentialTenantId = parts[0];
      if (!reservedWords.includes(potentialTenantId.toLowerCase())) {
        return potentialTenantId;
      }
    }
  }

  return null;
}
