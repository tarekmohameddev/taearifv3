"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePropertiesStore } from "@/store/propertiesStore";
import useTenantStore from "@/context-liveeditor/tenantStore";

type FilterType = "all" | "available" | "sold" | "rented";

interface FilterButtonsProps {
  className?: string;
}

export default function FilterButtons({ className }: FilterButtonsProps) {
  // Store state
  const { transactionType, activeFilter, setActiveFilter } =
    usePropertiesStore();

  // Get tenant data from store
  const { tenantData } = useTenantStore();

  // Get primary color from WebsiteLayout branding (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const primaryColor = 
    tenantData?.WebsiteLayout?.branding?.colors?.primary && 
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#059669"; // emerald-600 default (fallback)

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

  const primaryColorHover = getDarkerColor(primaryColor, 20);
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
                    backgroundColor: primaryColor,
                    color: "white",
                  }
                : {
                    backgroundColor: "white",
                    color: primaryColor,
                  }
            }
            onMouseEnter={(e) => {
              if (activeFilter !== button.key) {
                e.currentTarget.style.backgroundColor = primaryColorLight;
              } else {
                e.currentTarget.style.backgroundColor = primaryColorHover;
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter === button.key) {
                e.currentTarget.style.backgroundColor = primaryColor;
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
