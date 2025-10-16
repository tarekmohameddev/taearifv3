"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PropertyCard } from "@/components/tenant/cards/card1";
import PropertyCard2 from "@/components/tenant/cards/card2";
import PropertyCard3 from "@/components/tenant/cards/card3";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
import Pagination from "@/components/ui/pagination";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import axiosInstance from "@/lib/axiosInstance";

interface PropertyGridProps {
  emptyMessage?: string;
  className?: string;
  cardSettings?: {
    theme?: string;
    showImage?: boolean;
    showPrice?: boolean;
    showDetails?: boolean;
    showViews?: boolean;
    showStatus?: boolean;
  };
  dataSource?: {
    apiUrl?: string;
    enabled?: boolean;
  };
  useStore?: boolean;
  variant?: string;
  id?: string;
}

export default function PropertyGrid(props: PropertyGridProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "grid1";

  // Get current pathname
  const pathname = usePathname();

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // State for API data
  const [apiProperties, setApiProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Subscribe to properties store for transactionType changes
  const transactionType = usePropertiesStore((state) => state.transactionType);
  const setTransactionType = usePropertiesStore(
    (state) => state.setTransactionType,
  );
  const setTenantId = usePropertiesStore((state) => state.setTenantId);
  const filteredProperties = usePropertiesStore(
    (state) => state.filteredProperties,
  );
  const storeLoading = usePropertiesStore((state) => state.loading);
  
  // Filter state from store
  const search = usePropertiesStore((state) => state.search);
  const propertyType = usePropertiesStore((state) => state.propertyType);
  const price = usePropertiesStore((state) => state.price);

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("grid", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Set tenantId in properties store when it changes
  useEffect(() => {
    if (currentTenantId) {
      setTenantId(currentTenantId);
    }
  }, [currentTenantId, setTenantId]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("grid", variantId) || {}
    : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          if (
            (component as any).type === "grid" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
        // Fallback: if no explicit id, return first matching grid component with this variant
        if (!props.id) {
          for (const [_componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "grid" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = {
    ...props,
    ...tenantComponentData,
    ...storeData,
  };

  // Resolve default API URL based on current page
  const resolveDefaultUrl = () => {
    if (pathname?.includes("/projects")) {
      return "/v1/tenant-website/{{tenantID}}/projects";
    }
    return "/v1/tenant-website/{{tenantID}}/properties";
  };

  // Function to convert API URL format
  const convertApiUrl = (
    url: string,
    tenantId: string,
    purpose?: string,
  ): string => {
    let convertedUrl = url.replace("{{tenantID}}", tenantId);

    // Add purpose parameter if not already in URL
    if (purpose && !convertedUrl.includes("purpose=") && !convertedUrl.includes("/projects")) {
      const separator = convertedUrl.includes("?") ? "&" : "?";
      convertedUrl += `${separator}purpose=${purpose}`;
    }

    return convertedUrl;
  };

  // Function to fetch properties from API
  const fetchPropertiesFromApi = async (apiUrl?: string, purpose?: string) => {
    try {
      setLoading(true);

      if (!currentTenantId) {
        setLoading(false);
        return;
      }

      const url = convertApiUrl(
        apiUrl || resolveDefaultUrl(),
        currentTenantId,
        purpose,
      );

      const response = await axiosInstance.get(url);

      // Handle different API response formats
      if (response.data) {
        let dataToSet = [];

        // Check if it's projects API response
        if (url.includes("/projects")) {
          let projectsData = [];

          if (response.data.projects) {
            projectsData = response.data.projects;
          } else if (Array.isArray(response.data)) {
            projectsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            projectsData = response.data.data;
          }

          // Convert projects to property format
          if (projectsData.length > 0) {
            dataToSet = projectsData.map((project: any) => {
              return convertProjectToProperty(project);
            });
          } else {
            dataToSet = [];
          }
        }
        // Check if it's properties API response
        else if (response.data.properties) {
          dataToSet = response.data.properties;
        }
        // Handle direct array response
        else if (Array.isArray(response.data)) {
          dataToSet = response.data;
        }
        // Handle pagination wrapper
        else if (response.data.data && Array.isArray(response.data.data)) {
          dataToSet = response.data.data;
        }

        setApiProperties(dataToSet);
      } else {
        setApiProperties([]);
      }
    } catch (error) {
      // Set empty array on error
      setApiProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert project data to property format
  const convertProjectToProperty = (project: any): any => {
    // Format price display
    const formatPrice = (minPrice: string, maxPrice: string) => {
      if (!minPrice && !maxPrice) return "غير محدد";
      if (minPrice === maxPrice) return minPrice;
      if (minPrice && maxPrice) return `${minPrice} - ${maxPrice}`;
      return minPrice || maxPrice;
    };

    // Format completion date
    const formatCompletionDate = (date: string) => {
      if (!date) return new Date().toISOString();
      try {
        return new Date(date).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      district: project.address || project.location?.address || "غير محدد",
      price: formatPrice(project.minPrice, project.maxPrice),
      views: 0, // Projects don't have views
      bedrooms: 0, // Projects don't have bedrooms
      bathrooms: 0, // Projects don't have bathrooms
      area: project.units ? `${project.units} وحدة` : "غير محدد",
      type: "مشروع", // Project type
      transactionType: "project", // Project transaction type
      image: project.image || project.images?.[0] || "",
      status: project.completeStatus === "1" ? "مكتمل" : "قيد الإنشاء",
      createdAt: formatCompletionDate(project.completionDate),
      description: project.description || "",
      features: project.amenities || [],
      location: {
        lat: project.location?.lat || 0,
        lng: project.location?.lng || 0,
        address: project.location?.address || project.address || "غير محدد",
      },
      images: project.images || [project.image].filter(Boolean),
    };
  };

  // Get purpose from current pathname
  const getPurposeFromPath = () => {
    if (pathname?.includes("/for-rent")) {
      return "rent";
    } else if (pathname?.includes("/for-sale")) {
      return "sale";
    }
    return undefined;
  };

  // Update transactionType in store when pathname changes
  useEffect(() => {
    const purpose = getPurposeFromPath();
    if (purpose && purpose !== transactionType) {
      setTransactionType(purpose as "rent" | "sale");
    }
  }, [pathname, transactionType, setTransactionType]);

  // Fetch properties on component mount and when API URL, pathname, or transactionType changes
  useEffect(() => {
    // Always prioritize the configured apiUrl from dataSource
    const apiUrl = mergedData.dataSource?.apiUrl;
    const useApiData = mergedData.dataSource?.enabled !== false;

    // Always use API when enabled and apiUrl is configured
    const shouldUseOwnApi =
      useApiData && currentTenantId && apiUrl;

    if (shouldUseOwnApi) {
      // Clear existing data before fetching new data
      setApiProperties([]);

      const purpose = apiUrl.includes("/projects")
        ? undefined
        : getPurposeFromPath() || transactionType;
      fetchPropertiesFromApi(apiUrl, purpose);
    }
  }, [
    mergedData.dataSource?.apiUrl,
    mergedData.dataSource?.enabled,
    currentTenantId,
    pathname, // Add pathname to dependencies
    transactionType, // Add transactionType to dependencies
    filteredProperties.length, // Add filteredProperties to dependencies
  ]);

  // Use API data if enabled, otherwise use static data
  const useApiData = mergedData.dataSource?.enabled !== false;
  
  // Always prioritize store data (filteredProperties) over API data
  // This ensures that when API returns empty results, we show empty state
  const properties = useApiData && currentTenantId
    ? filteredProperties  // Always use store data when API is enabled
    : useApiData
      ? apiProperties
      : mergedData.items || mergedData.properties || [];


  // Check if component should be visible
  if (!mergedData.visible) {
    return null;
  }

  // Show loading state while tenant is loading
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-lg text-gray-600 mt-4">
              جاري تحميل بيانات الموقع...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!currentTenantId) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full bg-background py-8 ${mergedData.className || ""}`}
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: mergedData.layout?.padding?.top || "2rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "2rem",
      }}
    >
      <div
        className="mx-auto px-4"
        style={{
          maxWidth:
            mergedData.layout?.maxWidth ||
            mergedData.styling?.maxWidth ||
            "1600px",
        }}
      >
        {/* Section Title */}
        {mergedData.content?.title && (
          <div className="mb-6 text-center">
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                color:
                  mergedData.styling?.titleColor ||
                  mergedData.typography?.title?.color ||
                  "#1f2937",
              }}
            >
              {mergedData.content.title}
            </h2>
            {mergedData.content.subtitle && (
              <p
                className="text-gray-600"
                style={{
                  color:
                    mergedData.styling?.subtitleColor ||
                    mergedData.typography?.subtitle?.color ||
                    "#6b7280",
                }}
              >
                {mergedData.content.subtitle}
              </p>
            )}
          </div>
        )}

        {loading || storeLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل العقارات...</p>
            </div>
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                تم العثور على {properties.length} عقار
                {properties.length !== 1 ? "ات" : ""}
                {filteredProperties.length > 0 && (
                  <span className="text-xs text-gray-500 block mt-1">
                    {search && `البحث: "${search}"`}
                    {propertyType && ` • النوع: "${propertyType}"`}
                    {price && ` • السعر: حتى ${price}`}
                  </span>
                )}
              </p>
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              style={{
                gap: mergedData.styling?.gridGap || "24px",
              }}
            >
              {properties.map((property: any) => {
                const cardSettings = mergedData.cardSettings || {};
                const theme = cardSettings.theme || "card1";
                let CardComponent = PropertyCard;

                if (theme === "card2") {
                  CardComponent = PropertyCard2;
                } else if (theme === "card3") {
                  CardComponent = PropertyCard3;
                }

                return (
                  <CardComponent
                    key={property.id}
                    property={property}
                    showImage={cardSettings.showImage !== false}
                    showPrice={cardSettings.showPrice !== false}
                    showDetails={cardSettings.showDetails !== false}
                    showViews={cardSettings.showViews !== false}
                    showStatus={cardSettings.showStatus !== false}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-lg text-gray-600 font-medium">
              {mergedData.content?.emptyMessage ||
                mergedData.emptyMessage ||
                "لا توجد عقارات بهذه الفلاتر"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              جرب تغيير الفلاتر أو البحث عن شيء آخر
            </p>
            {/* عرض الفلاتر النشطة */}
            {(search || propertyType || price) && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">الفلاتر النشطة:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {search && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      البحث: "{search}"
                    </span>
                  )}
                  {propertyType && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      النوع: "{propertyType}"
                    </span>
                  )}
                  {price && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      السعر: حتى {price}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
