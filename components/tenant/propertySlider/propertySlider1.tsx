"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import SwiperCarousel from "@/components/ui/swiper-carousel";
import { PropertyCard } from "@/components/property-card";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";

type Property = {
  id: string;
  slug: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  transactionType: string;
  image: string;
  status: string;
  createdAt: string;
  description: string;
  features: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
};

// Default data for the component
const getDefaultPropertySliderData = () => ({
  visible: true,
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "56px",
      bottom: "56px",
    },
  },
  spacing: {
    titleBottom: "24px",
    slideGap: "16px",
  },
  content: {
    title: "أحدث العقارات للإيجار",
    description: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
    viewAllText: "عرض الكل",
    viewAllUrl: "#",
  },
  typography: {
    title: {
      fontFamily: "Inter",
      fontSize: {
        desktop: "2xl",
        tablet: "xl",
        mobile: "lg",
      },
      fontWeight: "extrabold",
      color: "#1f2937",
    },
    subtitle: {
      fontFamily: "Inter",
      fontSize: {
        desktop: "lg",
        tablet: "base",
        mobile: "sm",
      },
      fontWeight: "normal",
      color: "#6b7280",
    },
    link: {
      fontSize: "sm",
      color: "#059669",
      hoverColor: "#047857",
    },
  },
  carousel: {
    desktopCount: 4,
    autoplay: true,
  },
  background: {
    color: "transparent",
  },
  dataSource: {
    apiUrl: "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
    enabled: true,
  },
});

// No default properties - will fetch from API only

interface PropertySliderProps {
  title?: string;
  description?: string;
  items?: Property[];
  useStore?: boolean;
  variant?: string;
  id?: string;
}

// Helper function to convert old API URLs to new format
const convertLegacyApiUrl = (url: string, tenantId: string): string => {
  if (url === "/api/properties/latestSales") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=sale&latest=1&limit=10`;
    return newUrl;
  } else if (url === "/api/properties/latestRentals") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`;
    return newUrl;
  }
  // If it's already the new format with placeholder, replace tenantId
  return url.replace("{tenantId}", tenantId);
};

export default function PropertySlider(props: PropertySliderProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "propertySlider1";

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  // State for API data
  const [apiProperties, setApiProperties] =
    useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  // Fetch properties from API
  const fetchProperties = async (apiUrl?: string) => {
    try {
      setLoading(true);

      if (!currentTenantId) {
        setLoading(false);
        return;
      }

      // Convert legacy API URLs to new format and replace tenantId
      const defaultUrl = "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
      const url = convertLegacyApiUrl(apiUrl || defaultUrl, currentTenantId);
      
      
      const response = await axiosInstance.get(url);
      
      // Handle new API response format
      if (response.data && response.data.properties) {
        setApiProperties(response.data.properties);
        if (response.data.pagination) {
        }
      } else {
        setApiProperties([]);
      }
    } catch (error) {
      console.error("PropertySlider: Error fetching properties:", error);
      console.error("PropertySlider: URL that failed:", apiUrl);
      // Set empty array on error
      setApiProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("propertySlider", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);
  const router = useRouter();

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("propertySlider", variantId) || {}
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
            (component as any).type === "propertySlider" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultPropertySliderData(),
    ...props,
    ...tenantComponentData,
    ...storeData,
  };

  // Fetch properties on component mount and when API URL changes
  useEffect(() => {
    const apiUrl =
      mergedData.dataSource?.apiUrl || "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
    const useApiData = mergedData.dataSource?.enabled !== false;

    if (useApiData && currentTenantId) {
      fetchProperties(apiUrl);
    }
  }, [mergedData.dataSource?.apiUrl, mergedData.dataSource?.enabled, currentTenantId]);

  // Use API data if enabled, otherwise use static data
  const useApiData = mergedData.dataSource?.enabled !== false;
  const properties = useApiData
    ? apiProperties
    : mergedData.items || mergedData.properties || [];

  // Generate dynamic styles
  const titleStyles = {
    fontFamily: mergedData.typography?.title?.fontFamily || "Inter",
    fontSize: mergedData.typography?.title?.fontSize?.desktop || "2xl",
    fontWeight: mergedData.typography?.title?.fontWeight || "extrabold",
    color: mergedData.typography?.title?.color || "#1f2937",
  };

  const subtitleStyles = {
    fontFamily: mergedData.typography?.subtitle?.fontFamily || "Inter",
    fontSize: mergedData.typography?.subtitle?.fontSize?.desktop || "lg",
    fontWeight: mergedData.typography?.subtitle?.fontWeight || "normal",
    color: mergedData.typography?.subtitle?.color || "#6b7280",
  };

  const linkStyles = {
    fontSize: mergedData.typography?.link?.fontSize || "sm",
    color: mergedData.typography?.link?.color || "#059669",
  };

  const sectionStyles = {
    backgroundColor: mergedData.background?.color || "transparent",
    paddingTop: mergedData.layout?.padding?.top || "56px",
    paddingBottom: mergedData.layout?.padding?.bottom || "56px",
  };

  const containerStyles = {
    maxWidth: mergedData.layout?.maxWidth || "1600px",
  };

  const titleBottomMargin = mergedData.spacing?.titleBottom || "24px";
  const slideGap = mergedData.spacing?.slideGap || "16px";

  // Check if component should be visible
  if (!mergedData.visible) {
    return null;
  }

  // Show loading state while tenant is loading
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-lg text-gray-600 mt-4">جاري تحميل بيانات الموقع...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!currentTenantId) {
    return (
      <section className="w-full bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">لم يتم العثور على معرف الموقع</p>
            <p className="text-sm text-gray-500 mt-2">تأكد من أنك تصل إلى الموقع من الرابط الصحيح</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full bg-background py-14 sm:py-16"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          "transparent",
        paddingTop: mergedData.layout?.padding?.top || "56px",
        paddingBottom: mergedData.layout?.padding?.bottom || "56px",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px",
          gridTemplateColumns: mergedData.grid?.columns?.desktop
            ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
            : undefined,
          gap:
            mergedData.grid?.gapX || mergedData.grid?.gapY
              ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
              : undefined,
        }}
      >
        <div
          className="mb-6 px-5"
          dir="rtl"
          style={{ marginBottom: titleBottomMargin }}
        >
          {/* Mobile Layout - Button on left side */}
          <div className="flex items-center justify-between md:hidden">
            <h2
              className="section-title font-extrabold"
              style={{
                fontFamily: mergedData.typography?.title?.fontFamily || "Inter",
                fontSize:
                  mergedData.typography?.title?.fontSize?.desktop || "2xl",
                fontWeight:
                  mergedData.typography?.title?.fontWeight || "extrabold",
                color:
                  mergedData.styling?.textColor ||
                  mergedData.colors?.textColor ||
                  mergedData.typography?.title?.color ||
                  "#1f2937",
              }}
            >
              {mergedData.content?.title || "أحدث العقارات للإيجار"}
            </h2>
            <Link
              href={mergedData.content?.viewAllUrl || "#"}
              className="text-emerald-700 hover:underline text-sm"
              style={{
                fontSize: mergedData.typography?.link?.fontSize || "sm",
                color:
                  mergedData.styling?.textColor ||
                  mergedData.colors?.textColor ||
                  mergedData.typography?.link?.color ||
                  "#059669",
              }}
            >
              {mergedData.content?.viewAllText || "عرض الكل"}
            </Link>
          </div>

          {/* Desktop Layout - Button on right side */}
          <div className="hidden md:flex items-end justify-between">
            <div>
              <h2
                className="section-title font-extrabold"
                style={{
                  fontFamily:
                    mergedData.typography?.title?.fontFamily || "Inter",
                  fontSize:
                    mergedData.typography?.title?.fontSize?.desktop || "2xl",
                  fontWeight:
                    mergedData.typography?.title?.fontWeight || "extrabold",
                  color:
                    mergedData.styling?.textColor ||
                    mergedData.colors?.textColor ||
                    mergedData.typography?.title?.color ||
                    "#1f2937",
                }}
              >
                {mergedData.content?.title || "أحدث العقارات للإيجار"}
              </h2>
              <p
                className="section-subtitle"
                style={{
                  fontFamily:
                    mergedData.typography?.subtitle?.fontFamily || "Inter",
                  fontSize:
                    mergedData.typography?.subtitle?.fontSize?.desktop || "lg",
                  fontWeight:
                    mergedData.typography?.subtitle?.fontWeight || "normal",
                  color:
                    mergedData.styling?.textColor ||
                    mergedData.colors?.textColor ||
                    mergedData.typography?.subtitle?.color ||
                    "#6b7280",
                }}
              >
                {mergedData.content?.description ||
                  "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
              </p>
            </div>
            <Link
              href={mergedData.content?.viewAllUrl || "#"}
              className="text-emerald-700 hover:underline"
              style={linkStyles}
            >
              {mergedData.content?.viewAllText || "عرض الكل"}
            </Link>
          </div>

          {/* Description for mobile */}
          <p className="section-subtitle md:hidden" style={subtitleStyles}>
            {mergedData.description ||
              mergedData.content?.description ||
              "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
          </p>
        </div>

        <div className="">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">جاري تحميل العقارات...</p>
              </div>
            </div>
          ) : properties.length > 0 ? (
            <SwiperCarousel
              desktopCount={mergedData.carousel?.desktopCount || 4}
              slideClassName="!h-[360px] sm:!h-[400px] md:!h-[420px]"
              items={properties.map((p: Property) => (
                <div key={p.id} className="h-full w-full">
                  <PropertyCard p={p} />
                </div>
              ))}
              space={parseInt(slideGap) || 16}
              autoplay={mergedData.carousel?.autoplay || true}
            />
          ) : (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium">لا توجد عقارات متاحة حالياً</p>
                <p className="text-gray-500 text-sm mt-2">يرجى المحاولة مرة أخرى لاحقاً</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
