"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { usePropertiesStore } from "@/store/propertiesStore";

/**
 * Custom hook to sync URL query parameters with the properties store
 * Handles reading URL params on mount and updating URL when filters change
 * 
 * Supported query parameters:
 * - city_id: City filter
 * - state_id: District/state filter  
 * - max_price: Maximum price filter
 * - category_id: Property category filter
 * - type_id: Property type filter
 * - search: Search term
 */
export function useUrlFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const {
    setCityId,
    setDistrict,
    setPrice,
    setCategoryId,
    setPropertyType,
    setSearch,
    fetchProperties,
    transactionType,
    setTransactionType,
  } = usePropertiesStore();

  /**
   * Read URL params and apply them to the store
   * This runs automatically when searchParams or pathname changes
   */
  useEffect(() => {
    console.log("🔄 useUrlFilters: Effect triggered!");
    
    // Fallback: Read from window.location if searchParams is not ready
    let currentSearchParams = searchParams;
    
    if (!searchParams && typeof window !== "undefined") {
      console.log("⚠️  searchParams is null, using window.location.search as fallback");
      const urlParams = new URLSearchParams(window.location.search);
      currentSearchParams = urlParams as any;
    }
    
    if (!currentSearchParams) {
      console.log("⚠️  No search params available!");
      return;
    }
    
    console.log("🔄 useUrlFilters: searchParams ready!");
    
    // Debug: log all available params
    const allParamsArray: Array<[string, string]> = [];
    currentSearchParams.forEach((value, key) => {
      allParamsArray.push([key, value]);
    });
    const allParams = Object.fromEntries(allParamsArray);
    console.log("🌐 All URL params (raw):", allParams);
    
    const params = {
      city_id: currentSearchParams.get("city_id") || "",
      state_id: currentSearchParams.get("state_id") || "",
      max_price: currentSearchParams.get("max_price") || "",
      category_id: currentSearchParams.get("category_id") || "",
      type_id: currentSearchParams.get("type_id") || "",
      search: currentSearchParams.get("search") || "",
    };

    // Log for debugging
    console.log("📥 Reading URL params:", params);

    // Apply all params to store
    if (params.city_id) {
      console.log("  ↳ Setting cityId:", params.city_id);
      setCityId(params.city_id);
    }
    if (params.state_id) {
      console.log("  ↳ Setting district:", params.state_id);
      setDistrict(params.state_id);
    }
    if (params.max_price) {
      console.log("  ↳ Setting price:", params.max_price);
      setPrice(params.max_price);
    }
    if (params.category_id) {
      console.log("  ↳ Setting categoryId:", params.category_id);
      setCategoryId(params.category_id);
    }
    if (params.type_id) {
      console.log("  ↳ Setting propertyType:", params.type_id);
      setPropertyType(params.type_id);
    }
    if (params.search) {
      console.log("  ↳ Setting search:", params.search);
      setSearch(params.search);
    }

    // Determine transaction type from pathname
    if (pathname?.includes("/for-rent")) {
      console.log("  ↳ Setting transactionType: rent");
      setTransactionType("rent");
    } else if (pathname?.includes("/for-sale")) {
      console.log("  ↳ Setting transactionType: sale");
      setTransactionType("sale");
    }

    // Check if any filters are present
    const hasFilters = Object.values(params).some(value => value !== "");

    console.log("📊 Has filters?", hasFilters);

    // Auto-trigger search if filters are present
    if (hasFilters) {
      console.log("🔎 Auto-triggering fetchProperties...");
      fetchProperties(1);
    } else {
      console.log("⏭️  No filters found, skipping fetch");
    }
  }, [
    searchParams,
    pathname,
    setCityId,
    setDistrict,
    setPrice,
    setCategoryId,
    setPropertyType,
    setSearch,
    setTransactionType,
    fetchProperties,
  ]);

  /**
   * Manual function to apply URL params (kept for backward compatibility)
   */
  const applyUrlParamsToStore = useCallback(() => {
    console.log("⚠️  Manual applyUrlParamsToStore called (not needed - useEffect handles this)");
  }, []);

  /**
   * Update URL with current filter values
   */
  const updateUrlFromFilters = useCallback((filters: {
    city_id?: string;
    state_id?: string;
    max_price?: string;
    category_id?: string;
    type_id?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();

    // Add non-empty filters to URL
    if (filters.city_id) params.set("city_id", filters.city_id);
    if (filters.state_id) params.set("state_id", filters.state_id);
    if (filters.max_price) params.set("max_price", filters.max_price);
    if (filters.category_id) params.set("category_id", filters.category_id);
    if (filters.type_id) params.set("type_id", filters.type_id);
    if (filters.search) params.set("search", filters.search);

    const queryString = params.toString();
    const url: string = queryString ? `${pathname}?${queryString}` : (pathname || "/");

    router.push(url);
  }, [router, pathname]);

  /**
   * Navigate to listing page with filters
   */
  const navigateWithFilters = useCallback((
    transactionType: "rent" | "sale",
    filters: {
      city_id?: string;
      state_id?: string;
      max_price?: string;
      category_id?: string;
      type_id?: string;
      search?: string;
    }
  ) => {
    const params = new URLSearchParams();

    // Add transaction type (purpose)
    params.set("purpose", transactionType);

    // Add non-empty filters to URL
    if (filters.city_id && filters.city_id.trim()) params.set("city_id", filters.city_id.trim());
    if (filters.state_id && filters.state_id.trim()) params.set("state_id", filters.state_id.trim());
    if (filters.max_price && filters.max_price.trim()) params.set("max_price", filters.max_price.trim());
    if (filters.category_id && filters.category_id.trim()) params.set("category_id", filters.category_id.trim());
    if (filters.type_id && filters.type_id.trim()) params.set("type_id", filters.type_id.trim());
    if (filters.search && filters.search.trim()) params.set("search", filters.search.trim());

    const basePath = transactionType === "rent" ? "/for-rent" : "/for-sale";
    const queryString = params.toString();
    const url: string = queryString ? `${basePath}?${queryString}` : basePath;

    // Log for debugging
    console.log("🚀 Navigating with filters:", {
      transactionType,
      basePath,
      url,
      params: Object.fromEntries(params.entries())
    });

    router.push(url);
  }, [router]);

  /**
   * Clear all filters from URL
   */
  const clearUrlFilters = useCallback(() => {
    router.push(pathname || "/");
  }, [router, pathname]);

  return {
    applyUrlParamsToStore,
    updateUrlFromFilters,
    navigateWithFilters,
    clearUrlFilters,
  };
}

