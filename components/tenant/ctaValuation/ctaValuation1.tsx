"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

// Default data for the component
const getDefaultCtaValuationData = () => ({
  visible: true,
  content: {
    title: "تقييم عقارك",
    description1:
      "لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه",
    description2: "بأفضل طريقة",
    buttonText: "طلب معاينة",
    buttonUrl: "#",
  },
  image: {
    src: "https://dalel-lovat.vercel.app/images/cta-valuation%20section/house.webp",
    alt: "منزل صغير داخل يدين",
    width: 320,
    height: 160,
  },
  styling: {
    bgColor: "bg-emerald-600/95",
    textColor: "text-white",
    buttonBgColor: "bg-white",
    buttonTextColor: "text-emerald-700",
  },
});

interface CtaValuationSectionProps {
  visible?: boolean;
  content?: {
    title?: string;
    description1?: string;
    description2?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  image?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  styling?: {
    bgColor?: string;
    textColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

const CtaValuationSection = (props: CtaValuationSectionProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "ctaValuation1";
  const uniqueId = props.id || variantId;

  // Subscribe to editor store updates for this ctaValuation variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const ctaValuationStates = useEditorStore((s) => s.ctaValuationStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultCtaValuationData(),
        ...props,
      };
      ensureComponentVariant("ctaValuation", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

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
    ? getComponentData("ctaValuation", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? ctaValuationStates[uniqueId] || {}
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
          // Check if this is the exact component we're looking for by type and componentName
          if (
            (component as any).type === "ctaValuation" &&
            (component as any).componentName === variantId
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
  const defaultData = getDefaultCtaValuationData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData?.content || {}),
      ...(storeData?.content || {}),
      ...(currentStoreData?.content || {}),
    },
    texts: {
      ...(defaultData as any).texts,
      ...((props as any).texts || {}),
      ...((tenantComponentData as any)?.texts || {}),
      ...((storeData as any)?.texts || {}),
      ...((currentStoreData as any)?.texts || {}),
    },
    colors: {
      ...(defaultData as any).colors,
      ...((props as any).colors || {}),
      ...((tenantComponentData as any)?.colors || {}),
      ...((storeData as any)?.colors || {}),
      ...((currentStoreData as any)?.colors || {}),
    },
    image: {
      ...defaultData.image,
      ...(props.image || {}),
      ...(tenantComponentData?.image || {}),
      ...(storeData?.image || {}),
      ...(currentStoreData?.image || {}),
    },
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
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669"
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};
    
    // Navigate to the field using the path (e.g., "bgColor")
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
      } else if (fieldPath.includes("button") || fieldPath.includes("Button") || fieldPath.includes("bgColor") || fieldPath.includes("backgroundColor")) {
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

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const bgColor = getColor("bgColor", brandingColors.primary);
  const textColor = getColor("textColor", brandingColors.secondary);
  const buttonBgColor = getColor("buttonBgColor", "#ffffff");
  const buttonTextColor = getColor("buttonTextColor", brandingColors.primary);

  // Ensure imageSrc is never empty string to prevent console error
  const safeImageSrc =
    mergedData.image?.src && mergedData.image.src.trim() !== ""
      ? mergedData.image.src
      : getDefaultCtaValuationData().image.src;
  return (
    <section
      className="w-full bg-background py-14 sm:py-16"
      data-debug="ctaValuation-component"
    >
      <div className="mx-auto w-full max-w-9xl px-4">
        {/* المستطيل الأخضر داخل القسم - ليس بعرض الشاشة بالكامل */}
        <div
          className="mx-auto max-w-7xl rounded-2xl px-6 py-10 shadow-md sm:px-10 sm:py-12"
          style={{
            backgroundColor: bgColor,
          }}
        >
          <div
            className="grid grid-cols-1 items-center gap-8 md:grid-cols-12"
            dir="rtl"
            style={{
              gridTemplateColumns: `repeat(${mergedData.grid?.columns?.desktop || 12}, 1fr)`,
              gap: `${mergedData.grid?.gapY || "32px"} ${mergedData.grid?.gapX || "32px"}`,
            }}
          >
            {/* الصورة - على اليسار في الديسكتوب وعلى الموبايل تحت النص order-2 */}
            <div className="order-1 mx-auto md:order-1 md:col-span-5 md:justify-self-start w-32 md:w-[20rem] lg:w-[20rem]">
              {/* نستخدم عرض/ارتفاع لضمان نسبة الأبعاد وتجنب تغيّر التخطيط [^1][^2][^3] */}
              <Image
                src={safeImageSrc}
                alt={mergedData.image?.alt || "منزل صغير داخل يدين"}
                width={mergedData.image?.width || 320}
                height={mergedData.image?.height || 160}
                sizes="(min-width: 1024px) 192px, (min-width: 768px) 160px, 128px"
                className="h-auto w-full"
                priority={false}
              />
            </div>
            <div
              className="order-2 text-center md:order-2 md:col-span-7 md:text-center"
              style={{
                color: textColor,
              }}
            >
              {mergedData.texts?.title && (
                <h2 className="text-2xl font-bold mb-4 opacity-95">
                  {mergedData.texts.title}
                </h2>
              )}
              <p className="text-lg font-semibold opacity-95">
                {mergedData.texts?.description ||
                  mergedData.content?.description1 ||
                  "لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه"}
              </p>
              <p className="mt-2 text-lg font-semibold opacity-95">
                {mergedData.texts?.subtitle ||
                  mergedData.content?.description2 ||
                  "بأفضل طريقة"}
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="rounded-xl px-6 py-5 transition-colors"
                  style={{
                    backgroundColor: buttonBgColor,
                    color: buttonTextColor,
                  }}
                  onMouseEnter={(e) => {
                    // Slightly darken button on hover
                    const currentBg = buttonBgColor;
                    if (currentBg && currentBg.startsWith('#')) {
                      const r = Math.max(0, Math.min(255, parseInt(currentBg.substr(1, 2), 16) - 5));
                      const g = Math.max(0, Math.min(255, parseInt(currentBg.substr(3, 2), 16) - 5));
                      const b = Math.max(0, Math.min(255, parseInt(currentBg.substr(5, 2), 16) - 5));
                      e.currentTarget.style.backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = buttonBgColor;
                  }}
                  onClick={() => {
                    if (mergedData.content?.buttonUrl) {
                      router.push(mergedData.content.buttonUrl);
                    }
                  }}
                >
                  {mergedData.texts?.buttonText ||
                    mergedData.content?.buttonText ||
                    "طلب معاينة"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaValuationSection;
