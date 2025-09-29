"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/context/AuthContext";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import SwiperCarousel from "@/components/ui/swiper-carousel";
import { PropertyCard } from "@/components/property-card";
import Link from "next/link";

type Property = {
  id: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  image: string;
  status: "available" | "rented";
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
    apiUrl: "/api/properties/latestRentals",
    enabled: true,
  },
});

// Default properties data from API
const defaultProperties: Property[] = [
  {
    id: "1",
    title: "شقة أرضية",
    district: "حي الجواخي - عيون الجواخي المنزه",
    price: "18000",
    views: 134,
    bedrooms: 3,
    image: "/placeholder.svg",
    status: "available",
  },
  {
    id: "2",
    title: "شقة عوائل",
    district: "حي الازهة - مخطط الرياح",
    price: "15000",
    views: 211,
    bedrooms: 2,
    image: "/placeholder.svg",
    status: "available",
  },
  {
    id: "3",
    title: "شقة عوائل",
    district: "حي التعليم قريب من جامع ابن الخطابي التعليم",
    price: "6000",
    views: 140,
    bedrooms: 2,
    image: "/placeholder.svg",
    status: "rented",
  },
  {
    id: "4",
    title: "شقة عوائل",
    district: "الخزان - قرب مسجد العيدي",
    price: "13000",
    views: 189,
    bedrooms: 4,
    image: "/placeholder.svg",
    status: "available",
  },
  {
    id: "5",
    title: "دور علوي واسع",
    district: "حي الروابي - شارع الملك",
    price: "22000",
    views: 93,
    bedrooms: 5,
    image: "/placeholder.svg",
    status: "available",
  },
];

interface PropertySliderProps {
  title?: string;
  description?: string;
  items?: Property[];
  useStore?: boolean;
  variant?: string;
  id?: string;
}

export default function PropertySlider(props: PropertySliderProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "propertySlider1"
  
  // State for API data
  const [apiProperties, setApiProperties] = useState<Property[]>(defaultProperties)
  const [loading, setLoading] = useState(false)
  
  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)

  // Fetch properties from API
  const fetchProperties = async (apiUrl?: string) => {
    try {
      setLoading(true)
      const url = apiUrl || '/api/properties/latestRentals'
      const response = await fetch(url)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setApiProperties(result.data)
        }
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
      // Keep default properties on error
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant('propertySlider', variantId, props)
    }
  }, [variantId, props.useStore, ensureComponentVariant])

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData)
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData)
  const { userData } = useAuthStore()
  const tenantId = userData?.username
  const router = useRouter()

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId)
    }
  }, [tenantId, fetchTenantData])

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore ? (getComponentData('propertySlider', variantId) || {}) : {}

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {}
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(tenantData.componentSettings)) {
      
      // Check if pageComponents is an object (not array)
      if (typeof pageComponents === 'object' && !Array.isArray(pageComponents)) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(pageComponents as any)) {
          
          // Check if this is the exact component we're looking for by ID
          if ((component as any).type === 'propertySlider' && 
              (component as any).componentName === variantId &&
              componentId === props.id) {
            return (component as any).data
          }
        }
      }
    }
    return {}
  }
  
  const tenantComponentData = getTenantComponentData()

  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = { 
    ...getDefaultPropertySliderData(), 
    ...props, 
    ...tenantComponentData,
    ...storeData 
  }

  // Fetch properties on component mount and when API URL changes
  useEffect(() => {
    const apiUrl = mergedData.dataSource?.apiUrl || '/api/properties/latestRentals'
    const useApiData = mergedData.dataSource?.enabled !== false
    
    if (useApiData) {
      fetchProperties(apiUrl)
    }
  }, [mergedData.dataSource?.apiUrl, mergedData.dataSource?.enabled])

  // Use API data if enabled, otherwise use static data
  const useApiData = mergedData.dataSource?.enabled !== false
  const properties = useApiData ? apiProperties : (mergedData.items || mergedData.properties || defaultProperties);

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

  return (
    <section 
      className="w-full bg-background py-14 sm:py-16" 
      style={{
        backgroundColor: mergedData.background?.color || mergedData.styling?.bgColor || "transparent",
        paddingTop: mergedData.layout?.padding?.top || "56px",
        paddingBottom: mergedData.layout?.padding?.bottom || "56px"
      }}
    >
      <div 
        className="mx-auto" 
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1600px",
          gridTemplateColumns: mergedData.grid?.columns?.desktop ? `repeat(${mergedData.grid.columns.desktop}, 1fr)` : undefined,
          gap: mergedData.grid?.gapX || mergedData.grid?.gapY ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}` : undefined
        }}
      >
        <div className="mb-6 px-5" dir="rtl" style={{ marginBottom: titleBottomMargin }}>
          {/* Mobile Layout - Button on left side */}
          <div className="flex items-center justify-between md:hidden">
            <h2 
              className="section-title font-extrabold"
              style={{
                fontFamily: mergedData.typography?.title?.fontFamily || "Inter",
                fontSize: mergedData.typography?.title?.fontSize?.desktop || "2xl",
                fontWeight: mergedData.typography?.title?.fontWeight || "extrabold",
                color: mergedData.styling?.textColor || mergedData.colors?.textColor || mergedData.typography?.title?.color || "#1f2937"
              }}
            >
              {mergedData.content?.title || "أحدث العقارات للإيجار"}
            </h2>
            <Link 
              href={mergedData.content?.viewAllUrl || "#"} 
              className="text-emerald-700 hover:underline text-sm"
              style={{
                fontSize: mergedData.typography?.link?.fontSize || "sm",
                color: mergedData.styling?.textColor || mergedData.colors?.textColor || mergedData.typography?.link?.color || "#059669"
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
                  fontFamily: mergedData.typography?.title?.fontFamily || "Inter",
                  fontSize: mergedData.typography?.title?.fontSize?.desktop || "2xl",
                  fontWeight: mergedData.typography?.title?.fontWeight || "extrabold",
                  color: mergedData.styling?.textColor || mergedData.colors?.textColor || mergedData.typography?.title?.color || "#1f2937"
                }}
              >
                {mergedData.content?.title || "أحدث العقارات للإيجار"}
              </h2>
              <p 
                className="section-subtitle"
                style={{
                  fontFamily: mergedData.typography?.subtitle?.fontFamily || "Inter",
                  fontSize: mergedData.typography?.subtitle?.fontSize?.desktop || "lg",
                  fontWeight: mergedData.typography?.subtitle?.fontWeight || "normal",
                  color: mergedData.styling?.textColor || mergedData.colors?.textColor || mergedData.typography?.subtitle?.color || "#6b7280"
                }}
              >
                {mergedData.content?.description || "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
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
          <p 
            className="section-subtitle md:hidden"
            style={subtitleStyles}
          >
            {mergedData.description || mergedData.content?.description || "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع"}
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
          ) : (
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
          )}
        </div>
      </div>
    </section>
  );
}
