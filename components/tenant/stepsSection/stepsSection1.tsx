"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";

// Function to get icon URL based on type
const getStepIconUrl = (type: string): string => {
  const iconMap: Record<string, string> = {
    step1: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/1.svg",
    step2: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/2.svg",
    step3: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/3.svg",
    step4: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/4.svg",
    step5: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/5.svg",
    step6: "https://dalel-lovat.vercel.app/images/MarketingStepsSection/6.svg",
  };

  return iconMap[type] || iconMap.step1;
};

type Step = {
  title: string;
  desc: string;
  image:
    | string
    | {
        type: string;
        size?: string;
        className?: string;
      };
  titleStyle?: {
    color?: string;
    size?: { mobile?: string; desktop?: string };
    weight?: string;
  };
  descriptionStyle?: {
    color?: string;
    size?: { mobile?: string; desktop?: string };
    lineHeight?: string;
  };
};

// Default data structure - Marketing Real Estate Steps
const getDefaultStepsSectionData = () => ({
  visible: true,
  background: {
    color: "#f2fbf9",
    padding: {
      desktop: "72px",
      tablet: "48px",
      mobile: "20px",
    },
  },
  header: {
    marginBottom: "40px",
    title: {
      text: "خطواتنا في تسويق العقارات",
      className: "section-title",
    },
    description: {
      text: "نتبع خطوات احترافية لضمان تسويق عقارك بأعلى مستوى من الكفاءة والنجاح",
      className: "section-subtitle-xl text-gray-600",
    },
  },
  grid: {
    gapX: "40px",
    gapY: "40px",
    gapYMobile: "48px",
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
  },
  steps: [
    {
      title: "المعاينة الأولية للعقار",
      desc: "زيارة العقار وتقييم حالته ومعرفة ميزاته ومراجعة التفاصيل التي تحتاج إلى توضيح.",
      image: {
        type: "step1",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "كتابة تفصيل العقار",
      desc: "وصف دقيق للممتلكات بما في ذلك الموقع، المساحة، المرافق، والحالة العامة.",
      image: {
        type: "step2",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "التصوير الاحترافي للعقار",
      desc: "الاستعانة بمصور محترف لالتقاط صور عالية الجودة مع الاهتمام بالإضاءة والزوايا.",
      image: {
        type: "step3",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "توقيع اتفاقية الوساطة والتسويق",
      desc: "توقيع عقد رسمي بينك وبين المالك لتنظيم عملية تسويق العقار وحقوق الطرفين.",
      image: {
        type: "step4",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "تصميم بوستر للعقار وإضافته لموقعنا",
      desc: "إعداد بوستر يحتوي على الصور والتفاصيل الرئيسية ونشره على موقعنا الإلكتروني.",
      image: {
        type: "step5",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
    {
      title: "جذب العملاء المحتملين",
      desc: "استخدام وسائل الاتصال المختلفة لجذب المشترين المهتمين مثل الإعلانات.",
      image: {
        type: "step6",
        size: "80",
        className: "w-20 h-20",
      },
      titleStyle: {
        size: { mobile: "18px", desktop: "24px" },
        weight: "600",
      },
      descriptionStyle: {
        color: "#4B5563", // text-gray-600
        size: { mobile: "14px", desktop: "16px" },
        lineHeight: "1.75",
      },
    },
  ],
  iconStyle: {
    size: { mobile: "40px", desktop: "60px" },
    marginTop: "4px",
    shrink: true,
  },
  layout: {
    direction: "rtl",
    alignment: "left",
    maxWidth: "1200px",
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    steps: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      stagger: 100,
    },
  },
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },
});

interface StepsSectionProps {
  visible?: boolean;
  background?: {
    color?: string;
    padding?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
    };
  };
  header?: {
    marginBottom?: string;
    title?: {
      text?: string;
      className?: string;
    };
    description?: {
      text?: string;
      className?: string;
    };
  };
  grid?: {
    gapX?: string;
    gapY?: string;
    gapYMobile?: string;
    columns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
  };
  steps?: Step[];
  iconStyle?: {
    size?: { mobile?: string; desktop?: string };
    marginTop?: string;
    shrink?: boolean;
  };
  layout?: {
    direction?: "rtl" | "ltr";
    alignment?: "left" | "center" | "right";
    maxWidth?: string;
  };
  animations?: {
    header?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    steps?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      stagger?: number;
    };
  };
  responsive?: {
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
    desktopBreakpoint?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function StepsSection1(props: StepsSectionProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "stepsSection1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const stepsSectionStates = useEditorStore((s) => s.stepsSectionStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultStepsSectionData(),
        ...props,
      };
      ensureComponentVariant("stepsSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("stepsSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? stepsSectionStates[uniqueId] || {}
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
            (component as any).type === "stepsSection" &&
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

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultStepsSectionData(),
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
  };

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
        : "#f2fbf9", // light background default
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669"
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};
    
    // Navigate to the field using the path (e.g., "background.color", "icon.color")
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
    
    // Also check in background, iconStyle, titleStyle, descriptionStyle directly
    if (!fieldData || (typeof fieldData === 'object' && !fieldData.value)) {
      if (fieldPath === "background.color") {
        fieldData = mergedData?.background?.color;
      } else if (fieldPath === "icon.color") {
        fieldData = mergedData?.iconStyle?.color || mergedData?.styling?.icon?.color;
      } else if (fieldPath === "title.color") {
        // Check in steps array for titleStyle.color
        fieldData = mergedData?.steps?.[0]?.titleStyle?.color || mergedData?.styling?.title?.color;
      } else if (fieldPath === "description.color") {
        // Check in steps array for descriptionStyle.color
        fieldData = mergedData?.steps?.[0]?.descriptionStyle?.color || mergedData?.styling?.description?.color;
      }
    }
    
    // Check if fieldData is a custom color (string starting with #)
    // If it is, return it directly (useDefaultColor is false)
    if (typeof fieldData === 'string' && fieldData.startsWith('#')) {
      return fieldData;
    }
    
    // If fieldData is an object, check for value property
    if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData)) {
      // If object has useDefaultColor property set to false, use the value
      if (fieldData.useDefaultColor === false && fieldData.value && typeof fieldData.value === 'string' && fieldData.value.startsWith('#')) {
        return fieldData.value;
      }
      // If object has value but useDefaultColor is true or undefined, still check value first
      if (fieldData.value && typeof fieldData.value === 'string' && fieldData.value.startsWith('#')) {
        // Check if useDefaultColor is explicitly false
        if (fieldData.useDefaultColor === false) {
          return fieldData.value;
        }
      }
    }
    
    // If no custom color found, use branding color (useDefaultColor is true by default)
    // Determine globalColorType based on field path
    let defaultGlobalColorType = "primary";
    if (fieldPath.includes("background") || fieldPath.includes("Background")) {
      defaultGlobalColorType = "accent";
    } else if (fieldPath.includes("title") || fieldPath.includes("Title") || fieldPath.includes("textColor") || fieldPath.includes("Text")) {
      defaultGlobalColorType = "secondary";
    } else if (fieldPath.includes("description") || fieldPath.includes("Description")) {
      defaultGlobalColorType = "secondary";
    } else if (fieldPath.includes("icon") || fieldPath.includes("Icon")) {
      defaultGlobalColorType = "primary";
    }
    
    // If fieldData is an object with globalColorType, use it
    if (fieldData && typeof fieldData === 'object' && !Array.isArray(fieldData) && fieldData.globalColorType) {
      defaultGlobalColorType = fieldData.globalColorType;
    }
    
    const brandingColor = brandingColors[defaultGlobalColorType as keyof typeof brandingColors] || defaultColor;
    return brandingColor;
  };

  // Function to convert hex color to CSS filter for SVG images
  // This converts black/dark SVG images to the target color using CSS filters
  // Formula based on: https://codepen.io/sosuke/pen/Pjoqqp
  const getIconFilter = (targetColor: string): string => {
    if (!targetColor || !targetColor.startsWith('#')) {
      return "none"; // No filter for invalid colors
    }
    
    const cleanHex = targetColor.replace('#', '');
    if (cleanHex.length !== 6) return "none";
    
    // Get RGB values (0-255)
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    
    // Normalize RGB values (0-1)
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    
    // Calculate the filter values using the formula from codepen
    // This converts black (#000000) to the target color
    // The formula: brightness(0) saturate(100%) invert(R%) sepia(S%) saturate(S%) hue-rotate(Hdeg) brightness(B%) contrast(C%)
    
    // Calculate hue
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    
    if (max !== min) {
      if (max === rNorm) {
        h = ((gNorm - bNorm) / (max - min)) % 6;
      } else if (max === gNorm) {
        h = (bNorm - rNorm) / (max - min) + 2;
      } else {
        h = (rNorm - gNorm) / (max - min) + 4;
      }
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    // Calculate saturation
    const s = max === 0 ? 0 : ((max - min) / max) * 100;
    
    // Calculate brightness/lightness
    const l = (max + min) / 2 * 100;
    
    // Build the filter
    // For black to color conversion:
    // 1. brightness(0) - makes everything black
    // 2. invert() - inverts based on target color
    // 3. sepia() - adds sepia tone
    // 4. saturate() - adjusts saturation
    // 5. hue-rotate() - rotates hue to target
    // 6. brightness() - adjusts final brightness
    // 7. contrast() - fine-tunes contrast
    
    return `brightness(0) saturate(100%) invert(${rNorm * 100}%) sepia(${s}%) saturate(${s * 2}%) hue-rotate(${h}deg) brightness(${l / 50}%) contrast(1.2)`;
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const backgroundColor = getColor("background.color", brandingColors.accent);
  const iconColor = getColor("icon.color", brandingColors.primary);
  const iconFilter = getIconFilter(iconColor);
  const titleColor = getColor("title.color", brandingColors.secondary);
  const descriptionColor = getColor("description.color", brandingColors.secondary);

  return (
    <section className="w-full bg-background sm:py-16 ">
      <div
        className="mx-auto p-5 sm:p-18  px-20"
        dir="rtl"
        style={{
          backgroundColor: backgroundColor,
          paddingTop: mergedData.background?.padding?.desktop || "72px",
          paddingBottom: mergedData.background?.padding?.desktop || "72px",
        }}
      >
        <header className="mb-10">
          <h2
            className={mergedData.header?.title?.className || "section-title"}
          >
            {mergedData.header?.title?.text || "كيف يعمل النظام"}
          </h2>
          <p
            className={
              mergedData.header?.description?.className ||
              "section-subtitle-xl text-gray-600"
            }
          >
            {mergedData.header?.description?.text ||
              "خطوات بسيطة وواضحة لتحقيق هدفك"}
          </p>
        </header>

        {/* Steps Grid */}
        {/* شبكة الخطوات - مستوحاة من التصميم: أيقونة خضراء، عنوان، وصف */}
        <div
          className="grid gap-x-10 gap-y-10 sm:gap-y-12"
          style={{
            gridTemplateColumns: `repeat(${mergedData.grid?.columns?.desktop || 3}, 1fr)`,
            gap: `${mergedData.grid?.gapY || "40px"} ${mergedData.grid?.gapX || "40px"}`,
          }}
        >
          {mergedData.steps?.map((step: Step, i: number) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Image
                  src={
                    typeof step.image === "string"
                      ? step.image
                      : getStepIconUrl(step.image.type)
                  }
                  alt={step.title}
                  width={
                    typeof step.image === "string"
                      ? 24
                      : parseInt(step.image.size || "80")
                  }
                  height={
                    typeof step.image === "string"
                      ? 24
                      : parseInt(step.image.size || "80")
                  }
                  className={
                    typeof step.image === "string"
                      ? "size-10 sm:size-15"
                      : step.image.className || "w-20 h-20"
                  }
                  style={{
                    filter: iconFilter !== "none" ? iconFilter : undefined,
                  }}
                />
              </div>
              <div>
                <h3 
                  className="text-lg sm:text-2xl"
                  style={{
                    color: step.titleStyle?.color || titleColor,
                    fontSize: step.titleStyle?.size?.mobile || "18px",
                    fontWeight: step.titleStyle?.weight || "600",
                  }}
                >
                  {step.title}
                </h3>
                <p 
                  className="sm:mt-2 text-sm sm:text-md leading-7"
                  style={{
                    color: step.descriptionStyle?.color || descriptionColor,
                    fontSize: step.descriptionStyle?.size?.mobile || "14px",
                    lineHeight: step.descriptionStyle?.lineHeight || "1.75",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
