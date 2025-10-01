"use client";

import { useEffect } from "react";
import type React from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

type Feature = {
  title: string;
  desc: string;
  icon: string;
};

// Default why choose us data
const getDefaultWhyChooseUsData = () => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  header: {
    title: "لماذا تختارنا؟",
    description:
      "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
    marginBottom: "mb-10",
    textAlign: "text-right",
    paddingX: "px-5",
    typography: {
      title: {
        className: "section-title text-right",
      },
      description: {
        className: "section-subtitle-xl",
      },
    },
  },
  features: {
    list: [
      {
        title: "خدمة شخصية",
        desc: "نحن نركز على تقديم تجربة تركز على العملاء لجعل بحثك عن العقارات سلسًا وناجحًا.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/1.svg",
      },
      {
        title: "مجموعة واسعة من العقارات",
        desc: "من الشقق إلى الفلل والمكاتب والمساحات التجارية، لدينا خيارات تناسب جميع الاحتياجات.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/2.svg",
      },
      {
        title: "إرشادات الخبراء",
        desc: "بفضل سنوات الخبرة، يقدم فريقنا رؤى ونصائح مخصصة لضمان قرار مناسب لتفضيلاتك.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/3.svg",
      },
      {
        title: "تحليل السوق",
        desc: "تحليل متعمق للسوق يوفر رؤية قيمة حول اتجاهات العقارات والأسعار وفرص الاستثمار.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/4.svg",
      },
      {
        title: "الاستشارات الاستثمارية",
        desc: "إرشادات من الخبراء لتحقيق أقصى عائد على استثماراتك العقارية واتخاذ قرارات ذكية.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/5.svg",
      },
      {
        title: "إدارة الممتلكات",
        desc: "خدمات إدارة شاملة للحفاظ على قيمة ممتلكاتك وتعزيز عوائدها التأجيرية.",
        icon: "https://dalel-lovat.vercel.app/images/why-choose-us/6.svg",
      },
    ],
    grid: {
      gap: "gap-6",
      columns: {
        sm: "sm:grid-cols-2",
        xl: "xl:grid-cols-3",
      },
      paddingX: "px-4",
    },
    card: {
      className:
        "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
      borderRadius: "rounded-2xl",
      border: "border",
      backgroundColor: "bg-white",
      padding: "p-6",
      shadow: "shadow-sm",
      ring: "ring-1 ring-emerald-50",
    },
    icon: {
      container: {
        className: "mx-auto flex size-20 items-center justify-center",
        size: "size-20",
        flex: "flex",
        items: "items-center",
        justify: "justify-center",
      },
      image: {
        className: "h-[7rem] w-[7rem]",
        height: "h-[7rem]",
        width: "w-[7rem]",
      },
    },
    typography: {
      title: {
        className: "mt-6 text-center text-lg font-bold text-emerald-700",
        marginTop: "mt-6",
        textAlign: "text-center",
        fontSize: "text-lg",
        fontWeight: "font-bold",
        color: "text-emerald-700",
      },
      description: {
        className: "mt-3 text-center text-lg leading-7 text-gray-600",
        marginTop: "mt-3",
        textAlign: "text-center",
        fontSize: "text-lg",
        lineHeight: "leading-7",
        color: "text-gray-600",
      },
    },
  },
  responsive: {
    mobile: {
      padding: "py-14",
      gridCols: "grid-cols-1",
    },
    tablet: {
      padding: "sm:py-16",
      gridCols: "sm:grid-cols-2",
    },
    desktop: {
      gridCols: "xl:grid-cols-3",
    },
  },
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    features: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 300,
      stagger: 100,
    },
    icons: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 400,
      stagger: 50,
    },
  },
  colors: {
    background: "#ffffff",
    cardBackground: "#ffffff",
    titleColor: "#059669",
    descriptionColor: "#4b5563",
    borderColor: "#e5e7eb",
    ringColor: "#ecfdf5",
  },
});

interface WhyChooseUsProps {
  visible?: boolean;
  layout?: {
    direction?: string;
    maxWidth?: string;
    padding?: {
      y?: string;
      smY?: string;
    };
  };
  header?: {
    title?: string;
    description?: string;
    marginBottom?: string;
    textAlign?: string;
    paddingX?: string;
    typography?: {
      title?: {
        className?: string;
      };
      description?: {
        className?: string;
      };
    };
  };
  features?: {
    list?: Feature[];
    grid?: {
      gap?: string;
      columns?: {
        sm?: string;
        xl?: string;
      };
      paddingX?: string;
    };
    card?: {
      className?: string;
      borderRadius?: string;
      border?: string;
      backgroundColor?: string;
      padding?: string;
      shadow?: string;
      ring?: string;
    };
    icon?: {
      container?: {
        className?: string;
        size?: string;
        flex?: string;
        items?: string;
        justify?: string;
      };
      image?: {
        className?: string;
        height?: string;
        width?: string;
      };
    };
    typography?: {
      title?: {
        className?: string;
        marginTop?: string;
        textAlign?: string;
        fontSize?: string;
        fontWeight?: string;
        color?: string;
      };
      description?: {
        className?: string;
        marginTop?: string;
        textAlign?: string;
        fontSize?: string;
        lineHeight?: string;
        color?: string;
      };
    };
  };
  responsive?: {
    mobile?: {
      padding?: string;
      gridCols?: string;
    };
    tablet?: {
      padding?: string;
      gridCols?: string;
    };
    desktop?: {
      gridCols?: string;
    };
  };
  animations?: {
    header?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    features?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
    icons?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
      stagger?: number;
    };
  };
  colors?: {
    background?: string;
    cardBackground?: string;
    titleColor?: string;
    descriptionColor?: string;
    borderColor?: string;
    ringColor?: string;
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function WhyChooseUsSection(props: WhyChooseUsProps = {}) {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "whyChooseUs1";

  // Subscribe to editor store updates for this why choose us variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant("whyChooseUs", variantId, props);
    }
  }, [variantId, props.useStore, ensureComponentVariant]);

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
    ? getComponentData("whyChooseUs", variantId) || {}
    : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) return {};

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
          if (
            (component as any).type === "whyChooseUs" &&
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

  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultWhyChooseUsData(),
    ...props,
    ...tenantComponentData,
    ...storeData,
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  return (
    <section
      className="w-full bg-background"
      style={{
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          mergedData.colors?.background ||
          "#ffffff",
        paddingTop: mergedData.layout?.padding?.y || "py-14",
        paddingBottom: mergedData.layout?.padding?.smY || "sm:py-16",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: mergedData.layout?.maxWidth || "1600px" }}
        dir={mergedData.layout?.direction || "rtl"}
      >
        <header
          className={`${mergedData.header?.marginBottom || "mb-10"} ${mergedData.header?.textAlign || "text-right"} ${mergedData.header?.paddingX || "px-5"}`}
        >
          <h2
            className={
              mergedData.header?.typography?.title?.className ||
              "section-title text-right"
            }
            style={{
              color:
                mergedData.styling?.textColor ||
                mergedData.colors?.textColor ||
                undefined,
            }}
          >
            {mergedData.header?.title || "لماذا تختارنا؟"}
          </h2>
          <p
            className={
              mergedData.header?.typography?.description?.className ||
              "section-subtitle-xl"
            }
            style={{
              color:
                mergedData.styling?.textColor ||
                mergedData.colors?.textColor ||
                undefined,
            }}
          >
            {mergedData.header?.description ||
              "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات"}
          </p>
        </header>

        <div
          className={`grid ${mergedData.features?.grid?.gap || "gap-6"} ${mergedData.features?.grid?.columns?.sm || "sm:grid-cols-2"} ${mergedData.features?.grid?.columns?.xl || "xl:grid-cols-3"} ${mergedData.features?.grid?.paddingX || "px-4"}`}
          style={{
            gridTemplateColumns: mergedData.grid?.columns?.desktop
              ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
              : undefined,
            gap:
              mergedData.grid?.gapX || mergedData.grid?.gapY
                ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
                : undefined,
          }}
        >
          {(mergedData.features?.list || []).map((f: any, i: number) => (
            <article
              key={i}
              className={
                mergedData.features?.card?.className ||
                "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50"
              }
              style={{
                backgroundColor: mergedData.colors?.cardBackground || "#ffffff",
                borderColor: mergedData.colors?.borderColor || "#e5e7eb",
              }}
            >
              <div
                className={
                  mergedData.features?.icon?.container?.className ||
                  "mx-auto flex size-20 items-center justify-center"
                }
              >
                <img
                  src={f.icon}
                  alt={f.title}
                  className={
                    mergedData.features?.icon?.image?.className ||
                    "h-[7rem] w-[7rem]"
                  }
                />
              </div>
              <h3
                className={
                  mergedData.features?.typography?.title?.className ||
                  "mt-6 text-center text-lg font-bold text-emerald-700"
                }
                style={{ color: mergedData.colors?.titleColor || "#059669" }}
              >
                {f.title}
              </h3>
              <p
                className={
                  mergedData.features?.typography?.description?.className ||
                  "mt-3 text-center text-lg leading-7 text-gray-600"
                }
                style={{
                  color: mergedData.colors?.descriptionColor || "#4b5563",
                }}
              >
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
