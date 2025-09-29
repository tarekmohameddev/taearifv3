"use client"

import { useEffect } from "react"
import SwiperCarousel from "@/components/ui/swiper-carousel"
import { TestimonialCard } from "@/components/testimonial-card"
import useTenantStore from "@/context-liveeditor/tenantStore"
import { useEditorStore } from "@/context-liveeditor/editorStore"

type Testimonial = {
  id: string
  quote: string
  name: string
  location: string
  rating: number
}

// Default testimonials data
const getDefaultTestimonialsData = () => ({
  visible: true,
  title: "آراء عملائنا",
  description: "نحن نفخر بشركائنا وعملائنا ونسعى دائمًا لتقديم أفضل الحلول التي تدعم نموهم ونجاحهم.",
  background: {
    color: "#ffffff",
    image: "",
    alt: "",
    overlay: {
      enabled: false,
      opacity: "0.1",
      color: "#000000",
    },
  },
  spacing: {
    paddingY: "py-14 sm:py-16",
    marginBottom: "mb-8",
  },
  header: {
    alignment: "text-center md:text-right",
    maxWidth: "mx-auto px-5 sm:px-26",
    title: {
      className: "section-title",
      color: "#1f2937",
      size: "text-3xl sm:text-4xl",
      weight: "font-bold",
    },
    description: {
      className: "section-subtitle-large",
      color: "#6b7280",
      size: "text-lg",
      weight: "font-normal",
    },
  },
  carousel: {
    desktopCount: 3,
    space: 20,
    autoplay: true,
    showPagination: true,
    loop: true,
    slideHeight: {
      mobile: "!h-[260px]",
      tablet: "sm:!h-[220px]",
      desktop: "md:!h-[240px]",
      largeDesktop: "lg:!h-[260px]",
    },
  },
  testimonials: [
    {
      id: "t1",
      quote:
        "الموقع متعوب عليه وواضح أن فيه شغل احترافي وجهد كبير، إن شاء الله تتوسعون أكثر وتغطون عقارات السعودية بشكل كامل.",
      name: "أريام",
      location: "السعودية",
      rating: 5,
    },
    {
      id: "t2",
      quote: "أخلاق عالية وسعر ممتاز، ورجل نصوح. الله يجزاك الله خير أبو سليمان. تجربة رائعة وأنصح بها.",
      name: "عبدالعزيز الحمد السايح",
      location: "عيون الجواء",
      rating: 5,
    },
    {
      id: "t3",
      quote: "أخلاق جدا عالية رب يرحم الله أبو طارق. تعامل راقٍ وسرعة في الإنجاز.",
      name: "بندر الحربي",
      location: "المرقب",
      rating: 5,
    },
    {
      id: "t4",
      quote: "خدمة ممتازة وفريق متعاون. سهّلوا علينا إجراءات التأجير بشكل كبير.",
      name: "محمد العتيبي",
      location: "الرياض",
      rating: 4,
    },
  ],
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderRadius: "rounded-2xl",
    shadow: "shadow-sm",
    padding: "p-6",
    minHeight: "h-[200px]",
    quoteIcon: {
      color: "#059669",
      size: "w-[34px] h-[27px]",
      position: "top-[-15px] left-0",
    },
    text: {
      color: "#374151",
      size: "text-md",
      lineHeight: "leading-6",
      maxLines: "line-clamp-3",
    },
    footer: {
      marginTop: "mt-auto",
      paddingTop: "pt-3",
      customerInfo: {
        nameColor: "#111827",
        nameWeight: "font-extrabold",
        locationColor: "#6b7280",
      },
      rating: {
        activeColor: "#fbbf24",
        inactiveColor: "#d1d5db",
        size: "size-3",
      },
    },
  },
  pagination: {
    bulletWidth: "12px",
    bulletHeight: "12px",
    bulletColor: "#6b7280",
    bulletOpacity: "1",
    bulletMargin: "0 4px",
    activeBulletWidth: "32px",
    activeBulletColor: "#059669",
    activeBulletBorderRadius: "6px",
    paginationBottom: "-40px",
  },
  responsive: {
    mobileSlides: 1,
    tabletSlides: 2,
    desktopSlides: 3,
    largeDesktopSlides: 3,
  },
  animations: {
    cards: {
      enabled: true,
      type: "fade-in",
      duration: 500,
      delay: 100,
    },
    header: {
      enabled: true,
      type: "slide-up",
      duration: 600,
      delay: 200,
    },
  },
})

interface TestimonialsProps {
  visible?: boolean;
  title?: string;
  description?: string;
  background?: {
    color?: string;
    image?: string;
    alt?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
    };
  };
  spacing?: {
    paddingY?: string;
    marginBottom?: string;
  };
  header?: {
    alignment?: string;
    maxWidth?: string;
    title?: {
      className?: string;
      color?: string;
      size?: string;
      weight?: string;
    };
    description?: {
      className?: string;
      color?: string;
      size?: string;
      weight?: string;
    };
  };
  carousel?: {
    desktopCount?: number;
    space?: number;
    autoplay?: boolean;
    showPagination?: boolean;
    loop?: boolean;
    slideHeight?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
      largeDesktop?: string;
    };
  };
  testimonials?: Testimonial[];
  card?: {
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: string;
    shadow?: string;
    padding?: string;
    minHeight?: string;
    quoteIcon?: {
      color?: string;
      size?: string;
      position?: string;
    };
    text?: {
      color?: string;
      size?: string;
      lineHeight?: string;
      maxLines?: string;
    };
    footer?: {
      marginTop?: string;
      paddingTop?: string;
      customerInfo?: {
        nameColor?: string;
        nameWeight?: string;
        locationColor?: string;
      };
      rating?: {
        activeColor?: string;
        inactiveColor?: string;
        size?: string;
      };
    };
  };
  pagination?: {
    bulletWidth?: string;
    bulletHeight?: string;
    bulletColor?: string;
    bulletOpacity?: string;
    bulletMargin?: string;
    activeBulletWidth?: string;
    activeBulletColor?: string;
    activeBulletBorderRadius?: string;
    paginationBottom?: string;
  };
  responsive?: {
    mobileSlides?: number;
    tabletSlides?: number;
    desktopSlides?: number;
    largeDesktopSlides?: number;
  };
  animations?: {
    cards?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    header?: {
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

export default function TestimonialsSection(props: TestimonialsProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "testimonials1"
  
  // Subscribe to editor store updates for this testimonials variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant('testimonials', variantId, props)
    }
  }, [variantId, props.useStore, ensureComponentVariant])

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData)
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData)
  const tenantId = useTenantStore((s) => s.tenantId)

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId)
    }
  }, [tenantId, fetchTenantData])

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore ? (getComponentData('testimonials', variantId) || {}) : {}
  
  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {}
    
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(tenantData.componentSettings)) {
      
      // Check if pageComponents is an object (not array)
      if (typeof pageComponents === 'object' && !Array.isArray(pageComponents)) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(pageComponents as any)) {
          
          if ((component as any).type === 'testimonials' && 
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
    ...getDefaultTestimonialsData(), 
    ...props, 
    ...tenantComponentData,
    ...storeData 
  }

  // Don't render if not visible
  if (!mergedData.visible) {
    return null
  }

  return (
    <section 
      className="w-full bg-background py-14 sm:py-16"
      style={{
        backgroundColor: mergedData.background?.color || mergedData.styling?.bgColor || "transparent"
      }}
    >
      <div 
        className="w-full" 
        dir="rtl"
        style={{
          gridTemplateColumns: mergedData.grid?.columns?.desktop ? `repeat(${mergedData.grid.columns.desktop}, 1fr)` : undefined,
          gap: mergedData.grid?.gapX || mergedData.grid?.gapY ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}` : undefined
        }}
      >
        <header className="mb-8 text-center md:text-right mx-auto px-5 sm:px-26">
          <h2 
            className="section-title"
            style={{
              color: mergedData.styling?.textColor || mergedData.colors?.textColor || undefined
            }}
          >
            {mergedData.title}
          </h2>
          <p 
            className="section-subtitle-large"
            style={{
              color: mergedData.styling?.textColor || mergedData.colors?.textColor || undefined
            }}
          >
            {mergedData.description}
          </p>
        </header>

        <div className="testimonials-swiper">
          <SwiperCarousel
            desktopCount={mergedData.carousel?.desktopCount || 3}
            
            // توحيد ارتفاع السلايد للشهادات
            slideClassName="!h-[260px] sm:!h-[220px] md:!h-[240px] lg:!h-[260px]"
            items={mergedData.testimonials?.map((t: any) => (
              <div key={t.id} className="h-full w-full">
                <TestimonialCard t={t} />
              </div>
            )) || []}
            space={mergedData.carousel?.space || 20}
            autoplay={mergedData.carousel?.autoplay || true}
            showPagination={mergedData.carousel?.showPagination || true}
          />
        </div>
      </div>

      <style jsx>{`
        .testimonials-swiper :global(.swiper-pagination-bullet) {
          width: 12px;
          height: 12px;
          background: #6b7280;
          opacity: 1;
          margin: 0 4px;
        }
        
        .testimonials-swiper :global(.swiper-pagination-bullet-active) {
          width: 32px;
          height: 12px;
          border-radius: 6px;
          background: #059669;
        }
        
        .testimonials-swiper :global(.swiper-pagination) {
          bottom: -40px;
        }
      `}</style>
    </section>
  )
}
