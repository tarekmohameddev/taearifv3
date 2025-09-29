"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEditorStore } from "@/context-liveeditor/editorStore"
import useTenantStore from "@/context-liveeditor/tenantStore"
import { logComponentRender, logTenantStore } from "@/lib-liveeditor/debugLogger"

interface VisionSectionProps {
  visible?: boolean
  layout?: {
    direction?: "rtl" | "ltr"
    maxWidth?: string
    gap?: {
      x?: string
      y?: string
    }
    minHeight?: string
  }
  spacing?: {
    padding?: {
      x?: string
      y?: string
      lgY?: string
    }
  }
  content?: {
    eyebrow?: string
    title?: string
    description?: string
    imagePosition?: "left" | "right"
    button?: {
      text?: string
      enabled?: boolean
      style?: {
        width?: string
        height?: string
        backgroundColor?: string
        textColor?: string
        borderRadius?: string
        hoverBackgroundColor?: string
        hoverTextColor?: string
      }
    }
    font?: {
      eyebrow?: {
        size?: string
        weight?: string
        color?: string
        lineHeight?: string
      }
      title?: {
        size?: string
        weight?: string
        color?: string
        lineHeight?: string
      }
      description?: {
        size?: string
        weight?: string
        color?: string
        lineHeight?: string
      }
      button?: {
        size?: string
        weight?: string
        color?: string
        lineHeight?: string
      }
    }
  }
  image?: {
    src?: string
    alt?: string
    width?: string
    aspectRatio?: string
    background?: {
      enabled?: boolean
      color?: string
      width?: string
      borderRadius?: string
      position?: string
    }
  }
  animations?: {
    text?: {
      enabled?: boolean
      type?: string
      duration?: number
      delay?: number
    }
    image?: {
      enabled?: boolean
      type?: string
      duration?: number
      delay?: number
    }
    button?: {
      enabled?: boolean
      type?: string
      duration?: number
      delay?: number
    }
  }
  // Legacy props for backward compatibility
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  imagePosition?: "left" | "right"
  // Editor props
  variant?: string
  useStore?: boolean
  id?: string
}

export default function VisionSection(props: VisionSectionProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "halfTextHalfImage3"
  
  // Force useStore to true if not explicitly set to false
  const useStore = props.useStore !== false
  
  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)

  useEffect(() => {
    if (useStore) {
      // Use component.id as unique identifier instead of variantId
      const uniqueId = props.id || variantId
      
      // Log component initialization
      logComponentRender(uniqueId, variantId, 'halfTextHalfImage', {
        action: 'INITIALIZE_COMPONENT',
        uniqueId,
        variantId,
        useStore,
        props: props,
        reason: 'Component mounted or props changed'
      });
      
      ensureComponentVariant('halfTextHalfImage', uniqueId, props)
    }
  }, [variantId, useStore, props.id, ensureComponentVariant])

  // Get tenant data
  const tenantData = useTenantStore((s: any) => s.tenantData)
  const fetchTenantData = useTenantStore((s: any) => s.fetchTenantData)
  const tenantId = useTenantStore((s) => s.tenantId)
  const router = useRouter()

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId)
    }
  }, [tenantId, fetchTenantData])

  // Get data from store or tenantData with fallback logic
  const uniqueId = props.id || variantId
  const storeData = useStore ? (getComponentData('halfTextHalfImage', uniqueId) || {}) : {}
  
  // Subscribe to store updates to re-render when data changes
  const halfTextHalfImageStates = useEditorStore((s) => s.halfTextHalfImageStates)
  const currentStoreData = useStore ? (halfTextHalfImageStates[uniqueId] || {}) : {}
  
  
  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      logTenantStore('NO_TENANT_DATA', uniqueId, variantId, {
        reason: 'No tenantData.componentSettings found',
        tenantData: tenantData
      });
      return {}
    }
    
    // Log tenant data search
    logTenantStore('SEARCHING_TENANT_DATA', uniqueId, variantId, {
      tenantDataKeys: Object.keys(tenantData.componentSettings),
      searchingFor: {
        type: 'halfTextHalfImage',
        componentName: variantId,
        componentId: props.id
      }
    });
    
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(tenantData.componentSettings)) {
      
      // Check if pageComponents is an object (not array)
      if (typeof pageComponents === 'object' && !Array.isArray(pageComponents)) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(pageComponents as any)) {
          
          // Check if this is the exact component we're looking for by ID
          if ((component as any).type === 'halfTextHalfImage' && 
              (component as any).componentName === variantId &&
              componentId === props.id) {
            
            logTenantStore('FOUND_TENANT_DATA', uniqueId, variantId, {
              pageSlug,
              componentId,
              component: component,
              foundData: (component as any).data
            });
            
            return (component as any).data
          }
        }
      }
    }
    
    logTenantStore('NO_TENANT_DATA_FOUND', uniqueId, variantId, {
      reason: 'No matching component found in tenant data',
      searchedPages: Object.keys(tenantData.componentSettings)
    });
    
    return {}
  }
  
  const tenantComponentData = getTenantComponentData()

  // Default data for halfTextHalfImage3
  const getDefaultHalfTextHalfImage3Data = () => ({
    visible: true,
    // Legacy props for backward compatibility
    title: "رسالتنا",
    description: "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
    imageSrc: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
    imageAlt: "Choose Us",
    imagePosition: "left",
    // New structure for editor compatibility - MUST match the legacy props
    content: {
      title: "رسالتنا",
      description: "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
      imagePosition: "left"
    },
    image: {
      src: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
      alt: "Choose Us"
    }
  })

  // Merge data with priority: currentStoreData > tenantComponentData > props > default
  // But ensure that if we have new default data, it overrides old content
  const defaultData = getDefaultHalfTextHalfImage3Data();
  
  // Check if currentStoreData contains old halfTextHalfImage1 data
  const hasOldData = currentStoreData.content?.title === "نحن شريكك الموثوق في عالم العقارات";
  
  // Log data analysis
  logComponentRender(uniqueId, variantId, 'halfTextHalfImage', {
    action: 'DATA_ANALYSIS',
    uniqueId,
    variantId,
    hasOldData,
    currentStoreDataContent: currentStoreData.content,
    defaultDataContent: defaultData.content,
    reason: hasOldData ? 'Detected old halfTextHalfImage1 data, will override' : 'Using current store data'
  });
  
  const mergedData = { 
    ...defaultData, 
    ...props, 
    ...tenantComponentData,
    // Only use currentStoreData if it doesn't contain old data
    ...(hasOldData ? {} : currentStoreData),
    // Force override content with correct data
    content: {
      ...defaultData.content,
      ...(hasOldData ? {} : currentStoreData.content),
      ...tenantComponentData.content,
      ...props.content
    }
  }
  
  // Log final data merge
  logComponentRender(uniqueId, variantId, 'halfTextHalfImage', {
    action: 'DATA_MERGE',
    uniqueId,
    variantId,
    propsKeys: Object.keys(props),
    tenantComponentDataKeys: Object.keys(tenantComponentData),
    currentStoreDataKeys: Object.keys(currentStoreData),
    mergedDataKeys: Object.keys(mergedData),
    mergedData: mergedData,
    dataSources: {
      defaultData: getDefaultHalfTextHalfImage3Data(),
      props: props,
      tenantComponentData: tenantComponentData,
      currentStoreData: currentStoreData
    }
  });
  
  

  // Extract values from merged data with fallback to legacy props
  const {
    visible = true,
    layout = {},
    spacing = {},
    content = {},
    image = {},
    animations = {},
    // Legacy props fallback
    title: legacyTitle,
    description: legacyDescription,
    imageSrc: legacyImageSrc,
    imageAlt: legacyImageAlt,
    imagePosition: legacyImagePosition,
  } = mergedData

  // Use new structure with fallback to legacy props
  const title = content.title || legacyTitle || "رسالتنا"
  const description = content.description || legacyDescription || "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات"
  const imageSrc = image.src || legacyImageSrc || "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp"
  const imageAlt = image.alt || legacyImageAlt || "Choose Us"
  const imagePosition = content.imagePosition || legacyImagePosition || "left"

  if (!visible) return null

  return (
    <div 
      className={`${spacing.padding?.y || "py-[24px]"} ${spacing.padding?.lgY || "lg:py-[52px]"} max-w-[${layout.maxWidth || "1600px"}] mx-auto ${spacing.padding?.x || "px-4"} sm:px-0`}
      dir={layout.direction || "rtl"}
    >
      <div 
        className={`flex flex-col ${layout.gap?.y || "gap-[12px]"} ${layout.gap?.x || "md:gap-x-[30px] lg:gap-x-[74px]"} ${imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"}`}
        style={{
          minHeight: layout.minHeight || undefined
        }}
      >
        <div className="md:flex-[.6] xl:flex-[.72] flex flex-col justify-center order-2 md:order-1">
          {content.eyebrow && (
            <p 
              className={`mb-2 ${content.font?.eyebrow?.size || "text-xs md:text-base xl:text-lg"} ${content.font?.eyebrow?.weight || "font-normal"} ${content.font?.eyebrow?.color || "text-muted-foreground"} ${content.font?.eyebrow?.lineHeight || "leading-[22.5px]"}`}
            >
              {content.eyebrow}
            </p>
          )}
          <h3 
            className={`relative w-fit ${content.font?.title?.size || "section-title-large"} ${content.font?.title?.weight || "font-normal"} ${content.font?.title?.color || "text-foreground"} ${content.font?.title?.lineHeight || "lg:leading-[64px]"}`}
          >
            {title}
          </h3>
          <p 
            className={`mb-4 md:mb-10 md:flex-grow ${content.font?.description?.size || "text-sm md:text-sm xl:text-xl"} ${content.font?.description?.weight || "font-normal"} ${content.font?.description?.color || "text-muted-foreground"} ${content.font?.description?.lineHeight || "leading-[35px]"}`}
          >
            {description}
          </p>
          {content.button?.enabled && (
            <button 
              className={`transition-colors duration-300 hover:text-emerald-600 hover:bg-white flex items-center justify-center ${content.button.style?.width || "w-[119px] md:w-[148px]"} ${content.button.style?.height || "h-[46px] md:h-[52px]"} ${content.button.style?.borderRadius || "rounded-[10px]"} ${content.font?.button?.size || "text-sm md:text-base xl:text-xl"} ${content.font?.button?.weight || "font-normal"}`}
              style={{
                backgroundColor: content.button.style?.backgroundColor || "#059669",
                color: content.button.style?.textColor || content.font?.button?.color || "#ffffff"
              }}
              onClick={() => {
                if (content.button?.url) {
                  router.push(content.button.url)
                }
              }}
            >
              {content.button.text || "تعرف علينا"}
            </button>
          )}
        </div>
        <figure 
          dir="rtl" 
          className={`w-full sm:w-[50%] mx-auto order-1 md:order-2 mb-[12px] md:mb-[0] md:flex-[.4] xl:flex-[.28] relative md:w-full h-[207px] md:h-[246px] ${image.width || "w-full md:w-[47.2%]"}`}
        >
          {image.background?.enabled && (
            <div 
              className={`absolute top-0 left-0 h-full overflow-hidden z-0 ${image.background.borderRadius || "rounded-[5px]"} ${image.background.width || "w-[54%] md:w-1/2"}`}
              style={{
                backgroundColor: image.background.color || "#059669"
              }}
            />
          )}
          <Image 
            src={imageSrc} 
            alt={imageAlt} 
            fill 
            className={`w-full h-full object-cover ${image.background?.borderRadius || "rounded-[5px]"}`} 
          />
          <div className={`absolute inset-0 bg-black opacity-20 ${image.background?.borderRadius || "rounded-[5px]"}`}></div>
        </figure>
      </div>
    </div>
  )
}







































































