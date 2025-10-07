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
        color: "#047857", // text-emerald-700
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
        color: "#047857", // text-emerald-700
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
        color: "#047857", // text-emerald-700
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
        color: "#047857", // text-emerald-700
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
        color: "#047857", // text-emerald-700
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
        color: "#047857", // text-emerald-700
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

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  return (
    <section className="w-full bg-background sm:py-16 ">
      <div
        className="mx-auto p-5 sm:p-18  px-20"
        dir="rtl"
        style={{
          backgroundColor: mergedData.background?.color || "#f2fbf9",
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
                />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl text-emerald-700">
                  {step.title}
                </h3>
                <p className="sm:mt-2 text-sm sm:text-md leading-7 text-gray-600">
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
