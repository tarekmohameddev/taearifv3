"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter, useParams } from "next/navigation"
import useTenantStore from "@/context-liveeditor/tenantStore"
import { useEditorStore } from "@/context-liveeditor/editorStore"

// Default half text half image data
const getDefaulthalfTextHalfImageData = () => ({
  visible: true,
  layout: {
    direction: "rtl",
    textWidth: 52.8,
    imageWidth: 47.2,
    gap: "16",
    minHeight: "369px",
  },
  spacing: {
    padding: {
      top: 12,
      bottom: 6,
      left: 4,
      right: 4,
    },
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  content: {
    eyebrow: "شريك موثوق",
    title: "نحن شريكك الموثوق في عالم العقارات",
    description: "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
    button: {
      text: "تعرف علينا",
      enabled: true,
      url: "/about-us",
      style: {
        backgroundColor: "#059669",
        textColor: "#ffffff",
        hoverBackgroundColor: "#047857",
        hoverTextColor: "#ffffff",
        width: "119px",
        height: "46px",
        borderRadius: "10px",
      },
    },
  },
  typography: {
    eyebrow: {
      size: "text-xs md:text-base xl:text-lg",
      weight: "font-normal",
      color: "text-muted-foreground",
      lineHeight: "leading-[22.5px]",
    },
    title: {
      size: "section-title-large",
      weight: "font-normal",
      color: "text-foreground",
      lineHeight: "lg:leading-[64px]",
    },
    description: {
      size: "text-sm md:text-sm xl:text-xl",
      weight: "font-normal",
      color: "text-muted-foreground",
      lineHeight: "leading-[35px]",
    },
  },
  image: {
    src: "https://dalel-lovat.vercel.app/images/trusted-partner-section/house.webp",
    alt: "صورة شريك موثوق",
    style: {
      aspectRatio: "800/500",
      objectFit: "contain",
      borderRadius: "0",
    },
    background: {
      enabled: true,
      color: "#059669",
      width: 54,
      borderRadius: "5px",
    },
  },
  responsive: {
    mobile: {
      textOrder: 2,
      imageOrder: 1,
      textWidth: "w-full",
      imageWidth: "w-full",
      marginBottom: "mb-10",
    },
    tablet: {
      textOrder: 2,
      imageOrder: 1,
      textWidth: "w-full",
      imageWidth: "w-full",
      marginBottom: "mb-10",
    },
    desktop: {
      textOrder: 1,
      imageOrder: 2,
      textWidth: "md:w-[52.8%]",
      imageWidth: "md:w-[47.2%]",
      marginBottom: "md:mb-0",
    },
  },
  animations: {
    text: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    image: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
  },
})

interface halfTextHalfImageProps {
  visible?: boolean;
  layout?: {
    direction?: string;
    textWidth?: number;
    imageWidth?: number;
    gap?: string;
    minHeight?: string;
  };
  spacing?: {
    padding?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
    margin?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  };
  content?: {
    eyebrow?: string;
    title?: string;
    description?: string;
    button?: {
      text?: string;
      enabled?: boolean;
      url?: string;
      style?: {
        backgroundColor?: string;
        textColor?: string;
        hoverBackgroundColor?: string;
        hoverTextColor?: string;
        width?: string;
        height?: string;
        borderRadius?: string;
      };
    };
  };
  typography?: {
    eyebrow?: {
      size?: string;
      weight?: string;
      color?: string;
      lineHeight?: string;
    };
    title?: {
      size?: string;
      weight?: string;
      color?: string;
      lineHeight?: string;
    };
    description?: {
      size?: string;
      weight?: string;
      color?: string;
      lineHeight?: string;
    };
  };
  image?: {
    src?: string;
    alt?: string;
    style?: {
      aspectRatio?: string;
      objectFit?: string;
      borderRadius?: string;
    };
    background?: {
      enabled?: boolean;
      color?: string;
      width?: number;
      borderRadius?: string;
    };
  };
  responsive?: {
    mobile?: {
      textOrder?: number;
      imageOrder?: number;
      textWidth?: string;
      imageWidth?: string;
      marginBottom?: string;
    };
    tablet?: {
      textOrder?: number;
      imageOrder?: number;
      textWidth?: string;
      imageWidth?: string;
      marginBottom?: string;
    };
    desktop?: {
      textOrder?: number;
      imageOrder?: number;
      textWidth?: string;
      imageWidth?: string;
      marginBottom?: string;
    };
  };
  animations?: {
    text?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    image?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

const halfTextHalfImage = (props: halfTextHalfImageProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "halfTextHalfImage1"
  
  /*
   * REACTIVE SPACING USAGE:
   * 
   * 1. To update spacing from anywhere in your app:
   *    useEditorStore.getState().updatehalfTextHalfImageByPath(uniqueId, 'spacing', {
   *      padding: { top: 20, bottom: 10, left: 8, right: 8 },
   *      margin: { top: 5, bottom: 5, left: 0, right: 0 }
   *    })
   * 
   * 2. Or use the exposed helper function:
   *    window.updateHalfTextHalfImageSpacing({
   *      padding: { top: 20, bottom: 10, left: 8, right: 8 }
   *    })
   * 
   * 3. The component will re-render instantly with new spacing values
   * 4. Values are in pixels (numbers) - React automatically appends 'px'
   */
  // Subscribe to editor store updates for this half text half image variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)
  const updatehalfTextHalfImageByPath = useEditorStore((s) => s.updatehalfTextHalfImageByPath)

  useEffect(() => {
    if (props.useStore) {
      // Use component.id as unique identifier instead of variantId
      const uniqueId = props.id || variantId
      ensureComponentVariant('halfTextHalfImage', uniqueId, props)
    }
  }, [variantId, props.useStore, props.id, ensureComponentVariant])

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData)
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData)
  const params = useParams<{ tenantId: string }>()
  const tenantId = params?.tenantId
  const router = useRouter()

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId)
    }
  }, [tenantId, fetchTenantData])

  // Get data from store or tenantData with fallback logic
  const uniqueId = props.id || variantId
  const storeData = props.useStore ? (getComponentData('halfTextHalfImage', uniqueId) || {}) : {}
  
  // Subscribe to store updates to re-render when data changes
  const halfTextHalfImageStates = useEditorStore((s) => s.halfTextHalfImageStates)
  const currentStoreData = props.useStore ? (halfTextHalfImageStates[uniqueId] || {}) : {}
  
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
          if ((component as any).type === 'halfTextHalfImage' && 
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
    ...getDefaulthalfTextHalfImageData(), 
    ...props, 
    ...tenantComponentData,
    ...currentStoreData 
  }

  // REACTIVE SPACING: Subscribe directly to store for instant updates
  const spacing = useEditorStore((state) => {
    if (!props.useStore) {
      // Fallback to merged data if not using store
      return mergedData.spacing || {
        padding: { top: 12, bottom: 6, left: 4, right: 4 },
        margin: { top: 0, bottom: 0, left: 0, right: 0 }
      }
    }
    
    // Get spacing from store for this specific component
    const componentData = state.halfTextHalfImageStates[uniqueId]
    if (componentData?.spacing) {
      return componentData.spacing
    }
    
    // Fallback to merged data if no store data
    return mergedData.spacing || {
      padding: { top: 12, bottom: 6, left: 4, right: 4 },
      margin: { top: 0, bottom: 0, left: 0, right: 0 }
    }
  })

  // Generate reactive styles that update instantly when spacing changes
  const sectionStyles = {
    paddingTop: spacing.padding?.top || 12,
    paddingBottom: spacing.padding?.bottom || 6,
    paddingLeft: spacing.padding?.left || 4,
    paddingRight: spacing.padding?.right || 4,
    marginTop: spacing.margin?.top || 0,
    marginBottom: spacing.margin?.bottom || 0,
    marginLeft: spacing.margin?.left || 0,
    marginRight: spacing.margin?.right || 0,
  }

  // Helper function to update spacing - can be called externally
  const updateSpacing = (newSpacing: {
    padding?: { top?: number; bottom?: number; left?: number; right?: number };
    margin?: { top?: number; bottom?: number; left?: number; right?: number };
  }) => {
    if (props.useStore) {
      updatehalfTextHalfImageByPath(uniqueId, 'spacing', newSpacing)
    }
  }

  // Expose updateSpacing for external use (e.g., from editor)
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.updateHalfTextHalfImageSpacing = updateSpacing
    
    // Test function to demonstrate reactive spacing
    // @ts-ignore
    window.testHalfTextHalfImageSpacing = () => {
      console.log('🧪 Testing reactive spacing...')
      updateSpacing({
        padding: { top: 24, bottom: 12, left: 16, right: 16 },
        margin: { top: 10, bottom: 10, left: 0, right: 0 }
      })
      setTimeout(() => {
        updateSpacing({
          padding: { top: 12, bottom: 6, left: 4, right: 4 },
          margin: { top: 0, bottom: 0, left: 0, right: 0 }
        })
      }, 2000)
    }
  }

  const buttonStyles = {
    backgroundColor: mergedData.content?.button?.style?.backgroundColor || "#059669",
    color: mergedData.content?.button?.style?.textColor || "#ffffff",
    width: mergedData.content?.button?.style?.width || "119px",
    height: mergedData.content?.button?.style?.height || "46px",
    borderRadius: mergedData.content?.button?.style?.borderRadius || "10px",
  }

  const backgroundStyles = {
    backgroundColor: mergedData.image?.background?.color || "#059669",
    width: `${mergedData.image?.background?.width || 54}%`,
    borderRadius: mergedData.image?.background?.borderRadius || "5px",
  }

  // Don't render if not visible
  if (!mergedData.visible) {
    return null
  }

  return (
    <section 
      className="mx-auto max-w-[1600px] px-4"
      style={sectionStyles as any}
      dir={mergedData.layout?.direction || "rtl"}
      data-debug="halfTextHalfImage-component"
    >
      <div className={cn(
        "flex flex-col md:flex-row w-full gap-x-16 md:min-h-[369px]",
        `gap-x-${mergedData.layout?.gap || "16"}`,
        `md:min-h-[${mergedData.layout?.minHeight || "369px"}]`
      )}>
        {/* النص: 52.8% على الديسكتوب */}
        <div className={cn(
          "md:py-12 relative w-full flex flex-col items-start",
          `order-${mergedData.responsive?.mobile?.textOrder || 2} md:order-${mergedData.responsive?.desktop?.textOrder || 1}`,
          mergedData.responsive?.desktop?.textWidth || "md:w-[52.8%]"
        )}>
          <div className="flex flex-col">
            <p className={cn(
              "mb-2",
              mergedData.typography?.eyebrow?.size || "text-xs md:text-base xl:text-lg",
              mergedData.typography?.eyebrow?.weight || "font-normal",
              mergedData.typography?.eyebrow?.color || "text-muted-foreground",
              mergedData.typography?.eyebrow?.lineHeight || "leading-[22.5px]"
            )}>
              {mergedData.content?.eyebrow || "شريك موثوق"}
            </p>
            <h2 className={cn(
              "mb-3 md:mb-6",
              mergedData.typography?.title?.size || "section-title-large",
              mergedData.typography?.title?.weight || "font-normal",
              mergedData.typography?.title?.color || "text-foreground",
              mergedData.typography?.title?.lineHeight || "lg:leading-[64px]"
            )}>
              {mergedData.content?.title || "نحن شريكك الموثوق في عالم العقايييرات"}
            </h2>
          </div>
          <p className={cn(
            "mb-4 md:mb-10 md:flex-grow",
            mergedData.typography?.description?.size || "text-sm md:text-sm xl:text-xl",
            mergedData.typography?.description?.weight || "font-normal",
            mergedData.typography?.description?.color || "text-muted-foreground",
            mergedData.typography?.description?.lineHeight || "leading-[35px]"
          )}>
            {mergedData.content?.description || "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك."}
          </p>
          {mergedData.content?.button?.enabled && (
            <Button 
              className="transition-colors duration-300 hover:text-emerald-600 hover:bg-white flex items-center justify-center"
              style={buttonStyles}
              onClick={() => {
                if (mergedData.content?.button?.url) {
                  router.push(mergedData.content.button.url)
                }
              }}
            >
              {mergedData.content?.button?.text || "تعرف علينا"}
            </Button>
          )}
        </div>

        {/* الصورة: 47.2% على الديسكتوب */}
        <div className={cn(
          "relative mb-10 md:mb-0",
          `order-${mergedData.responsive?.mobile?.imageOrder || 1} md:order-${mergedData.responsive?.desktop?.imageOrder || 2}`,
          mergedData.responsive?.desktop?.imageWidth || "md:w-[47.2%]"
        )}>
          {mergedData.image?.background?.enabled && (
            <div 
              className="absolute top-0 left-0 h-full rounded-[5px] overflow-hidden z-0"
              style={backgroundStyles}
            />
          )}
          <figure className="relative z-10 w-full aspect-[800/500]">
            <Image
              src={mergedData.image?.src || "/images/trusted-partner.webp"}
              alt={mergedData.image?.alt || "صورة شريك موثوق"}
              fill
              sizes="(min-width: 1024px) 47.2vw, 90vw"
              className={cn(
                "w-full h-full",
                mergedData.image?.style?.objectFit === "contain" ? "object-contain" : 
                mergedData.image?.style?.objectFit === "cover" ? "object-cover" : "object-fill"
              )}
            />
          </figure>
        </div>
      </div>
    </section>
  )
}

export default halfTextHalfImage
