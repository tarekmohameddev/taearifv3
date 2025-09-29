"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import useAuthStore from "@/context/AuthContext"
import useTenantStore from "@/context-liveeditor/tenantStore"
import { useEditorStore } from "@/context-liveeditor/editorStore"

// Default data for the component
const getDefaultCtaValuationData = () => ({
  visible: true,
  content: {
  title: "تقييم عقارك",
  description1: "لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه",
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
})

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
  const variantId = props.variant || "ctaValuation1"
  const uniqueId = props.id || variantId
  
  // Subscribe to editor store updates for this ctaValuation variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)
  const ctaValuationStates = useEditorStore((s) => s.ctaValuationStates)

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultCtaValuationData(),
        ...props
      }
      ensureComponentVariant('ctaValuation', uniqueId, initialData)
    }
  }, [uniqueId, props.useStore, ensureComponentVariant])

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
  const storeData = props.useStore ? (getComponentData('ctaValuation', uniqueId) || {}) : {}
  const currentStoreData = props.useStore ? (ctaValuationStates[uniqueId] || {}) : {}
  
  
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
          // Check if this is the exact component we're looking for by type and componentName
          if ((component as any).type === 'ctaValuation' && 
              (component as any).componentName === variantId) {
            return (component as any).data
          }
        }
      }
    }
    return {}
  }
  
  const tenantComponentData = getTenantComponentData()
  
  
  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultCtaValuationData()
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
      ...(currentStoreData?.content || {})
    },
    texts: {
      ...(defaultData as any).texts,
      ...((props as any).texts || {}),
      ...((tenantComponentData as any)?.texts || {}),
      ...((storeData as any)?.texts || {}),
      ...((currentStoreData as any)?.texts || {})
    },
    colors: {
      ...(defaultData as any).colors,
      ...((props as any).colors || {}),
      ...((tenantComponentData as any)?.colors || {}),
      ...((storeData as any)?.colors || {}),
      ...((currentStoreData as any)?.colors || {})
    },
    image: {
      ...defaultData.image,
      ...(props.image || {}),
      ...(tenantComponentData?.image || {}),
      ...(storeData?.image || {}),
      ...(currentStoreData?.image || {})
    }
  }

  // Don't render if not visible
  if (!mergedData.visible) {
    return null
  }

  // Ensure imageSrc is never empty string to prevent console error
  const safeImageSrc = mergedData.image?.src && mergedData.image.src.trim() !== "" ? mergedData.image.src : getDefaultCtaValuationData().image.src;
  return (
    <section className="w-full bg-background py-14 sm:py-16" data-debug="ctaValuation-component">
      <div className="mx-auto w-full max-w-9xl px-4">
        {/* المستطيل الأخضر داخل القسم - ليس بعرض الشاشة بالكامل */}
        <div 
          className="mx-auto max-w-7xl rounded-2xl px-6 py-10 shadow-md sm:px-10 sm:py-12"
          style={{
            backgroundColor: mergedData.styling?.bgColor || mergedData.colors?.background || "#059669"
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
                color: mergedData.styling?.textColor || mergedData.colors?.textColor || "#ffffff"
              }}
            >
              {mergedData.texts?.title && (
                <h2 className="text-2xl font-bold mb-4 opacity-95">
                  {mergedData.texts.title}
                </h2>
              )}
              <p className="text-lg font-semibold opacity-95">
                {mergedData.texts?.description || mergedData.content?.description1 || "لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه"}
              </p>
              <p className="mt-2 text-lg font-semibold opacity-95">
                {mergedData.texts?.subtitle || mergedData.content?.description2 || "بأفضل طريقة"}
              </p>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  className="rounded-xl px-6 py-5 hover:bg-white/90"
                  style={{
                    backgroundColor: mergedData.styling?.buttonBgColor || mergedData.colors?.buttonColor || "#ffffff",
                    color: mergedData.styling?.buttonTextColor || "#059669"
                  }}
                  onClick={() => {
                    if (mergedData.content?.buttonUrl) {
                      router.push(mergedData.content.buttonUrl)
                    }
                  }}
                >
                  {mergedData.texts?.buttonText || mergedData.content?.buttonText || "طلب معاينة"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CtaValuationSection
