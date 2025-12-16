"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultPropertiesShowcaseData } from "@/context-liveeditor/editorStoreFunctions/propertiesShowcaseFunctions";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface Property {
  ThemeTwo?: string;
  id: string;
  image: string;
  title: string;
  city: string;
  district: string;
  status: string;
  area: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  rooms: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  units: number;
  floors: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  price: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  bathrooms?: {
    ThemeTwo?: string;
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

interface PropertiesShowcaseProps {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    maxWidth?: string;
    columns?: {
      ThemeTwo?: string;
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    gap?: string;
    padding?: {
      ThemeTwo?: string;
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    loadMoreButtonText?: string;
    viewAllButtonText?: string;
    cardType?: "card1" | "card2";
  };
  properties?: Property[];
  styling?: {
    ThemeTwo?: string;
    backgroundColor?: string;
    titleColor?: string;
    dividerColor?: string;
    viewAllButtonColor?: string;
    viewAllButtonHoverColor?: string;
    loadMoreButtonColor?: string;
    loadMoreButtonHoverColor?: string;
    loadMoreButtonTextColor?: string;
    loadMoreButtonHoverTextColor?: string;
  };
  typography?: {
    ThemeTwo?: string;
    title?: {
      ThemeTwo?: string;
      fontSize?: {
        ThemeTwo?: string;
        mobile?: string;
        tablet?: string;
        desktop?: string;
      };
      fontWeight?: string;
      fontFamily?: string;
    };
  };
  responsive?: {
    ThemeTwo?: string;
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
    desktopBreakpoint?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// SVG Icons
const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M17.5 22.5v-3.5h-3.5v-1.5h3.5v-3.5h1.5v3.5h3.5v1.5h-3.5v3.5h-1.5Zm-12.5 -3.5V14h1.5v3.5h3.5v1.5H5Zm0 -9V5h5v1.5h-3.5v3.5h-1.5Zm12.5 0v-3.5h-3.5v-1.5h5v5h-1.5Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M1 19V4.375h1.5v9.85h8.825V6.5h8.05c0.99685 0 1.85025 0.3549 2.56025 1.06475C22.6451 8.27475 23 9.12815 23 10.125V19h-1.5v-3.275H2.5V19H1Zm5.75 -6.225c-0.75 0 -1.37915 -0.25415 -1.8875 -0.7625C4.354165 11.50415 4.1 10.875 4.1 10.125s0.254165 -1.37915 0.7625 -1.8875C5.37085 7.72915 6 7.475 6.75 7.475s1.37915 0.25415 1.8875 0.7625c0.50835 0.50835 0.7625 1.1375 0.7625 1.8875s-0.25415 1.37915 -0.7625 1.8875C8.12915 12.52085 7.5 12.775 6.75 12.775Zm6.075 1.45H21.5v-4.1c0 -0.58435 -0.2081 -1.0846 -0.62425 -1.50075C20.4596 8.2081 19.95935 8 19.375 8h-6.55v6.225Zm-6.075 -2.95c0.31665 0 0.5875 -0.1125 0.8125 -0.3375 0.225 -0.225 0.3375 -0.49585 0.3375 -0.8125s-0.1125 -0.5875 -0.3375 -0.8125c-0.225 -0.225 -0.49585 -0.3375 -0.8125 -0.3375s-0.5875 0.1125 -0.8125 0.3375c-0.225 0.225 -0.3375 0.49585 -0.3375 0.8125s0.1125 0.5875 0.3375 0.8125c0.225 0.225 0.49585 0.3375 0.8125 0.3375Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21v-1.5h2.3V3h9.75v1.125h3.675V19.5H21v1.5h-3.775V5.625H15.05V21H3Zm8.275 -8c0.28335 0 0.52085 -0.09585 0.7125 -0.2875s0.2875 -0.42915 0.2875 -0.7125c0 -0.28335 -0.09585 -0.52085 -0.2875 -0.7125S11.55835 11 11.275 11c-0.28335 0 -0.52085 0.09585 -0.7125 0.2875s-0.2875 0.42915 -0.2875 0.7125c0 0.28335 0.09585 0.52085 0.2875 0.7125s0.42915 0.2875 0.7125 0.2875ZM6.8 19.5h6.75V4.5H6.8v15Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StairsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21.75v-1.5h3.75v-4.5h4.5v-4.5h4.5v-4.5h4.5V3h1.5v5.25h-4.5v4.5h-4.5v4.5h-4.5v4.5H3Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    viewBox="0 0 576 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

// Project Card Component
function ProjectCard({ property }: { property: Property }) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA");
  };

  const CardContent = (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full h-[337px]">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 387px"
        />
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 right-4 bg-yellow-550 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md">
            <StarIcon />
            <span className="text-black text-sm font-medium">مشروع مميز</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-black mb-2">{property.title}</h4>
            <div className="flex items-center gap-2 text-sm text-black">
              <span>في {property.city}</span>
              <span>-</span>
              <span>{property.district}</span>
            </div>
          </div>
          <div className="text-green-600 font-semibold text-lg">{property.status}</div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Area */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AreaIcon />
              <span className="text-[#896042] text-sm font-medium">
                {formatNumber(property.area.min)} - {formatNumber(property.area.max)} م²
              </span>
            </div>
            <span className="text-xs text-gray-600">المساحة</span>
          </div>

          {/* Rooms */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BedIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.rooms.min} - {property.rooms.max}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الغرف</span>
          </div>

          {/* Units */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BuildingIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.units}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الوحدات</span>
          </div>

          {/* Floors */}
          <div className="flex flex-col items-center text-center col-start-2">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StairsIcon />
              <span className="text-[#896042] text-sm font-medium">
                {property.floors.min} - {property.floors.max}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الطوابق</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-[#896042] rounded-lg px-4 py-3 text-center">
          <div className="text-white text-base font-medium">
            {formatNumber(property.price.min)} - {formatNumber(property.price.max)} ريال سعودي
          </div>
        </div>
      </div>
    </div>
  );

  if (property.url) {
    return (
      <Link href={property.url} className="block">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PropertiesShowcase1(props: PropertiesShowcaseProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "propertiesShowcase1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const propertiesShowcaseStates = useEditorStore(s => s.propertiesShowcaseStates);

  const tenantData = useTenantStore(s => s.tenantData);
  const fetchTenantData = useTenantStore(s => s.fetchTenantData);
  const tenantId = useTenantStore(s => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};
    
    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (component.type === "propertiesShowcase" && component.componentName === variantId) {
          return component.data;
        }
      }
    }
    
    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "propertiesShowcase" &&
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

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData = tenantComponentData && Object.keys(tenantComponentData).length > 0
        ? {
            ...getDefaultPropertiesShowcaseData(),
            ...tenantComponentData,  // Database data takes priority
            ...props
          }
        : {
            ...getDefaultPropertiesShowcaseData(),
            ...props
          };
      
      // Initialize in store
      ensureComponentVariant("propertiesShowcase", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = propertiesShowcaseStates[uniqueId];
  const currentStoreData = getComponentData("propertiesShowcase", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultPropertiesShowcaseData(),    // 1. Defaults (lowest priority)
    ...storeData,                             // 2. Store state
    ...currentStoreData,                      // 3. Current store data
    ...props                                  // 4. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  
  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA");
  };

  return (
    <section 
      className="py-12 px-4"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#efe5dc",
        paddingTop: mergedData.layout?.padding?.top || "3rem",
        paddingBottom: mergedData.layout?.padding?.bottom || "3rem",
      }}
    >
      <div 
        className="container mx-auto"
        style={{ maxWidth: mergedData.layout?.maxWidth || "7xl" }}
      >
        {/* View All Button and Heading */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right">
            <h3 
              className={cn(
                "font-bold mb-3",
                `text-${mergedData.typography?.title?.fontSize?.mobile || "xl"} md:text-${mergedData.typography?.title?.fontSize?.tablet || "2xl"} lg:text-${mergedData.typography?.title?.fontSize?.desktop || "3xl"}`,
              )}
              style={{
                color: mergedData.styling?.titleColor || "#1f2937",
                fontFamily: mergedData.typography?.title?.fontFamily || "Tajawal",
                fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              }}
            >
              {mergedData.content?.title || "المشاريع والعقارات"}
            </h3>
            {/* Divider */}
            <div 
              className="w-24 h-[2px] mb-4 ml-auto"
              style={{ backgroundColor: mergedData.styling?.dividerColor || "#8b5f46" }}
            ></div>
          </div>
          <button 
            className="flex items-center gap-2 font-medium transition-colors duration-300 text-md md:text-xl"
            style={{ 
              color: mergedData.styling?.viewAllButtonColor || "#8b5f46"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = mergedData.styling?.viewAllButtonHoverColor || "#6b4630";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = mergedData.styling?.viewAllButtonColor || "#8b5f46";
            }}
          >
            <span>{mergedData.content?.viewAllButtonText || "عرض الكل"}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>
        
        {/* Properties Grid */}
        <div 
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${mergedData.layout?.columns?.desktop || 3}, 1fr)`,
            gap: mergedData.layout?.gap || "1.5rem",
          }}
        >
          {mergedData.properties?.map((property: Property, index: number) => (
            <ProjectCard key={property.id || index} property={property} />
          ))}
        </div>
        
        {/* Load More Button */}
        <div className="flex justify-center mt-12">
          <button 
            className="px-5 py-3 border-2 font-medium rounded-2xl transition-all duration-300 hover:scale-110"
            style={{
              borderColor: mergedData.styling?.loadMoreButtonColor || "#8b5f46",
              backgroundColor: "transparent",
              color: mergedData.styling?.loadMoreButtonTextColor || "#8b5f46",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = mergedData.styling?.loadMoreButtonHoverColor || "#8b5f46";
              e.currentTarget.style.color = mergedData.styling?.loadMoreButtonHoverTextColor || "#ffffff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = mergedData.styling?.loadMoreButtonTextColor || "#8b5f46";
            }}
          >
            {mergedData.content?.loadMoreButtonText || "تحميل المزيد"}
          </button>
        </div>
      </div>
    </section>
  );
}

