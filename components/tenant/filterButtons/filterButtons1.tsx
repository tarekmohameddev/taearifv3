"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePropertiesStore } from "@/store/propertiesStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

type FilterType = "all" | "available" | "sold" | "rented";

interface FilterButtonsProps {
  className?: string;
  useStore?: boolean;
  id?: string;
  variant?: string;
  content?: any;
}

export default function FilterButtons({ 
  className,
  useStore = false,
  id,
  variant = "filterButtons1",
  content,
}: FilterButtonsProps) {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "filterButtons1";
  const uniqueId = id || variantId;

  // Subscribe to editor store updates for this filterButtons variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const filterButtonsStates = useEditorStore((s) => s.filterButtonsStates);

  useEffect(() => {
    if (useStore) {
      ensureComponentVariant("filterButtons", uniqueId, {});
    }
  }, [uniqueId, useStore, ensureComponentVariant]);

  // Store state
  const { transactionType, activeFilter, setActiveFilter } =
    usePropertiesStore();

  // Get tenant data from store
  const { tenantData } = useTenantStore();

  // Get data from store or content prop with fallback logic
  const storeData = useStore
    ? getComponentData("filterButtons", uniqueId) || {}
    : {};
  const currentStoreData = useStore
    ? filterButtonsStates[uniqueId] || {}
    : {};

  // Merge content prop with store data (store data takes priority)
  const mergedContent = useStore && storeData && Object.keys(storeData).length > 0
    ? { ...content, ...storeData }
    : content;

  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const brandingColors = {
    primary: 
      tenantData?.WebsiteLayout?.branding?.colors?.primary && 
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669", // emerald-600 default (fallback)
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary && 
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669", // fallback to primary
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent && 
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669"
  ): string => {
    // Get styling data from mergedContent (which includes store data)
    const styling = mergedContent?.styling || {};
    
    // Navigate to the field using the path (e.g., "inspectionButton.bgColor")
    const pathParts = fieldPath.split('.');
    let fieldData = styling;
    for (const part of pathParts) {
      if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
        fieldData = fieldData[part];
      } else {
        fieldData = undefined;
        break;
      }
    }
    
    // Also check for useDefaultColor and globalColorType at the same path level
    const useDefaultColorPath = `${fieldPath}.useDefaultColor`;
    const globalColorTypePath = `${fieldPath}.globalColorType`;
    const useDefaultColorPathParts = useDefaultColorPath.split('.');
    let useDefaultColorValue = styling;
    for (const part of useDefaultColorPathParts) {
      if (useDefaultColorValue && typeof useDefaultColorValue === 'object' && !Array.isArray(useDefaultColorValue)) {
        useDefaultColorValue = useDefaultColorValue[part];
      } else {
        useDefaultColorValue = undefined;
        break;
      }
    }
    
    const globalColorTypePathParts = globalColorTypePath.split('.');
    let globalColorTypeValue = styling;
    for (const part of globalColorTypePathParts) {
      if (globalColorTypeValue && typeof globalColorTypeValue === 'object' && !Array.isArray(globalColorTypeValue)) {
        globalColorTypeValue = globalColorTypeValue[part];
      } else {
        globalColorTypeValue = undefined;
        break;
      }
    }
    
    // Check useDefaultColor value (default is true if not specified)
    const useDefaultColor = useDefaultColorValue !== undefined 
      ? useDefaultColorValue 
      : true;
    
    // If useDefaultColor is true, use branding color from WebsiteLayout
    if (useDefaultColor) {
      // Determine default globalColorType based on field path if not set
      let defaultGlobalColorType = "primary";
      if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
        defaultGlobalColorType = "secondary";
      } else if (fieldPath.includes("Button") || fieldPath.includes("button") || fieldPath.includes("hoverBgColor")) {
        defaultGlobalColorType = "primary";
      }
      
      const globalColorType = globalColorTypeValue || defaultGlobalColorType;
      const brandingColor = brandingColors[globalColorType as keyof typeof brandingColors] || defaultColor;
      return brandingColor;
    }
    
    // If useDefaultColor is false, try to get custom color
    // The color might be stored directly as string or in a value property of an object
    if (typeof fieldData === 'string' && fieldData.startsWith('#')) {
      return fieldData;
    }
    
    // If fieldData is an object, check for value property
    if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
      if (fieldData.value && typeof fieldData.value === 'string' && fieldData.value.startsWith('#')) {
        return fieldData.value;
      }
    }
    
    // Final fallback: use default branding color
    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    }
    const brandingColor = brandingColors[defaultGlobalColorType as keyof typeof brandingColors] || defaultColor;
    return brandingColor;
  };

  // Helper function to create darker color for hover states
  const getDarkerColor = (hex: string, amount: number = 20): string => {
    // emerald-700 in Tailwind = #047857 (fallback)
    if (!hex || !hex.startsWith('#')) return "#047857";
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return "#047857";
    
    const r = Math.max(0, Math.min(255, parseInt(cleanHex.substr(0, 2), 16) - amount));
    const g = Math.max(0, Math.min(255, parseInt(cleanHex.substr(2, 2), 16) - amount));
    const b = Math.max(0, Math.min(255, parseInt(cleanHex.substr(4, 2), 16) - amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper function to create lighter color (for hover backgrounds)
  const getLighterColor = (hex: string, opacity: number = 0.1): string => {
    if (!hex || !hex.startsWith('#')) return `${primaryColor}1A`; // 10% opacity default
    // Return hex color with opacity using rgba
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return `${primaryColor}1A`;
    
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Get colors for inspection button
  const inspectionButtonBgColor = getColor("inspectionButton.bgColor", "#059669");
  const inspectionButtonTextColor = getColor("inspectionButton.textColor", "#ffffff");
  const inspectionButtonHoverBgColor = getColor("inspectionButton.hoverBgColor", getDarkerColor(inspectionButtonBgColor, 20));
  
  // Get colors for filter buttons
  const filterButtonsActiveBgColor = getColor("filterButtons.activeBgColor", "#059669");
  const filterButtonsActiveTextColor = getColor("filterButtons.activeTextColor", "#ffffff");
  const filterButtonsInactiveTextColor = getColor("filterButtons.inactiveTextColor", "#059669");
  const filterButtonsHoverBgColor = getColor("filterButtons.hoverBgColor", getLighterColor(filterButtonsActiveBgColor, 0.1));
  
  // Use the colors for primaryColor and variants
  const primaryColor = inspectionButtonBgColor;
  const primaryColorHover = inspectionButtonHoverBgColor;
  const primaryColorLight = getLighterColor(primaryColor, 0.1); // 10% opacity for hover backgrounds
  const getFilterButtons = () => {
    if (transactionType === "rent") {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للإيجار" },
        { key: "rented" as FilterType, label: "تم تأجيرها" },
      ];
    } else {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للبيع" },
        { key: "sold" as FilterType, label: "تم بيعها" },
      ];
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-between ${className || ""} max-w-[1600px] mx-auto`}
    >
      {/* زر طلب المعاينة */}
      <Link
        href="/application-form"
        className="w-[80%] mb-[20px] md:w-fit md:mx-0 flex items-center justify-center text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px] text-white mx-auto"
        style={{ backgroundColor: primaryColor }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = primaryColorHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = primaryColor;
        }}
      >
        طلب معاينة
      </Link>

      {/* أزرار الفلتر */}
      <div className="filterButtons mb-6 flex items-center justify-center md:justify-start gap-x-[24px]">
        {getFilterButtons().map((button) => (
          <Button
            key={button.key}
            onClick={() => {
              setActiveFilter(button.key);
            }}
            className="w-fit text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px]"
            style={
              activeFilter === button.key
                ? {
                    backgroundColor: filterButtonsActiveBgColor,
                    color: filterButtonsActiveTextColor,
                  }
                : {
                    backgroundColor: "white",
                    color: filterButtonsInactiveTextColor,
                  }
            }
            onMouseEnter={(e) => {
              if (activeFilter !== button.key) {
                e.currentTarget.style.backgroundColor = filterButtonsHoverBgColor;
              } else {
                e.currentTarget.style.backgroundColor = getDarkerColor(filterButtonsActiveBgColor, 20);
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter === button.key) {
                e.currentTarget.style.backgroundColor = filterButtonsActiveBgColor;
              } else {
                e.currentTarget.style.backgroundColor = "white";
              }
            }}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
