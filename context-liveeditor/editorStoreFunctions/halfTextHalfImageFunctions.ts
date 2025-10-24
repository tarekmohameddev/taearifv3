import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";
import { logEditorStore } from "@/lib-liveeditor/debugLogger";

// Default halfTextHalfImage data structure
export const getDefaultHalfTextHalfImageData = (): ComponentData => ({
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
    description:
      "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
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
});

// Default halfTextHalfImage2 data structure (with stats)
export const getDefaultHalfTextHalfImage2Data = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    gridCols: "md:grid-cols-10",
    gap: {
      x: "gap-x-10",
      y: "gap-y-16",
      yMd: "md:gap-y-10",
    },
  },
  spacing: {
    padding: {
      x: "px-4",
      y: "py-5",
      smX: "sm:px-6",
      smY: "sm:py-20",
      lgX: "lg:px-8",
    },
  },
  content: {
    eyebrow: "تجربتك العقارية تبدأ هنا",
    title: "إيجاد عقار مناسب هو هدفنا",
    description:
      "يقدم لك الشركة العقارية العقاري أفضل الحلول العقارية لتلبية كافة احتياجاتك في البيع والإيجار، مع ضمان تجربة مريحة ومضمونة.",
    stats: {
      stat1: { value: "+100", label: "عميل سعيد" },
      stat2: { value: "+50", label: "عقار تم بيعه" },
      stat3: { value: "+250", label: "عقار تم تأجيره" },
      stat4: { value: "40", label: "تقييمات العملاء" },
    },
  },
  typography: {
    eyebrow: {
      className: "section-title text-emerald-700",
      marginBottom: "mb-3",
    },
    title: {
      className: "section-title leading-[1.25] text-black",
      textBalance: "text-balance",
    },
    description: {
      className: "section-subtitle-large max-w-3xl",
    },
    stats: {
      valueClassName: "text-2xl text-emerald-700",
      labelClassName: "text-xl text-black",
      labelMarginTop: "mt-1",
    },
  },
  image: {
    src: "https://dalel-lovat.vercel.app/images/experience-intro/CouterSectionImage.webp",
    alt: "صورة داخلية لغرفة معيشة حديثة",
    width: 800,
    height: 600,
    style: {
      className: "w-full h-full object-cover rounded-[15px]",
      borderRadius: "rounded-[15px]",
    },
    background: {
      enabled: true,
      color: "#059669",
      className: "bg-emerald-600 rounded-[10px]",
      positioning: {
        pr: "pr-[15px]",
        pb: "pb-[15px]",
        xlPr: "xl:pr-[21px]",
        xlPb: "xl:pb-[21px]",
      },
    },
  },
  responsive: {
    grid: {
      textCols: "md:col-span-5",
      imageCols: "md:col-span-5",
      textOrder: "order-2 md:order-2",
      imageOrder: "order-2 md:order-2",
    },
    stats: {
      gridCols: "grid-cols-2 sm:grid-cols-4",
      gap: "gap-4",
      marginTop: "mt-10",
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
    stats: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
      stagger: 100,
    },
  },
});

// Default halfTextHalfImage3 data structure
export const getDefaultHalfTextHalfImage3Data = (): ComponentData => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    gap: {
      x: "md:gap-x-[30px] lg:gap-x-[74px]",
      y: "gap-[12px]",
    },
    minHeight: "369px",
  },
  spacing: {
    padding: {
      x: "px-4",
      y: "py-[24px]",
      lgY: "lg:py-[52px]",
    },
  },
  // Legacy props for backward compatibility
  title: "رسالتنا",
  description:
    "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
  imageSrc: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
  imageAlt: "Choose Us",
  imagePosition: "left",
  // New structure for editor compatibility - MUST match the legacy props
  content: {
    title: "رسالتنا",
    description:
      "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
    imagePosition: "left",
  },
  image: {
    src: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
    alt: "Choose Us",
  },
});

export const halfTextHalfImageFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Log the function call
    logEditorStore("ENSURE_VARIANT_CALLED", variantId, "unknown", {
      variantId,
      hasInitial: !!(initial && Object.keys(initial).length > 0),
      initialKeys: initial ? Object.keys(initial) : [],
      existingData: state.halfTextHalfImageStates[variantId]
        ? Object.keys(state.halfTextHalfImageStates[variantId])
        : [],
      allVariants: Object.keys(state.halfTextHalfImageStates),
    });

    // إذا كان لدينا initial data جديدة، دائماً استخدمها (حتى لو كانت البيانات موجودة)
    if (initial && Object.keys(initial).length > 0) {
      // Log the data override
      logEditorStore("OVERRIDE_EXISTING_DATA", variantId, "unknown", {
        oldData: state.halfTextHalfImageStates[variantId],
        newData: initial,
        reason: "Initial data provided",
      });

      // دائماً استخدم البيانات الجديدة
      const data: ComponentData = initial;
      const newState = {
        halfTextHalfImageStates: {
          ...state.halfTextHalfImageStates,
          [variantId]: data,
        },
      };

      logEditorStore("ENSURE_VARIANT_RESULT", variantId, "unknown", {
        newState: newState,
        allVariantsAfter: Object.keys(newState.halfTextHalfImageStates),
      });

      return newState as any;
    }

    if (
      state.halfTextHalfImageStates[variantId] &&
      Object.keys(state.halfTextHalfImageStates[variantId]).length > 0
    ) {
      logEditorStore("VARIANT_ALREADY_EXISTS", variantId, "unknown", {
        existingData: state.halfTextHalfImageStates[variantId],
        reason: "Variant already exists with data",
      });
      return {} as any;
    }

    // تحديد البيانات الافتراضية حسب نوع المكون
    let defaultData;

    // إذا كان لدينا initial data، استخدمها أولاً
    if (initial && Object.keys(initial).length > 0) {
      defaultData = initial;
      logEditorStore("USING_INITIAL_DATA", variantId, "unknown", {
        initialData: initial,
      });
    } else {
      // تحديد البيانات الافتراضية حسب نوع المكون
      if (variantId === "halfTextHalfImage2") {
        defaultData = getDefaultHalfTextHalfImage2Data();
        logEditorStore("USING_DEFAULT_DATA", variantId, "halfTextHalfImage2", {
          defaultData: defaultData,
        });
      } else if (variantId === "halfTextHalfImage3") {
        defaultData = getDefaultHalfTextHalfImage3Data();
        logEditorStore("USING_DEFAULT_DATA", variantId, "halfTextHalfImage3", {
          defaultData: defaultData,
        });
      } else {
        defaultData = getDefaultHalfTextHalfImageData();
        logEditorStore("USING_DEFAULT_DATA", variantId, "halfTextHalfImage1", {
          defaultData: defaultData,
          reason: "Fallback for unknown variant",
        });
      }
    }

    const data: ComponentData = initial || state.tempData || defaultData;

    const result = {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
    };

    logEditorStore("ENSURE_VARIANT_FINAL_RESULT", variantId, "unknown", {
      finalData: data,
      result: result,
      allVariantsAfter: Object.keys(result.halfTextHalfImageStates),
    });

    return result as any;
  },

  getData: (state: any, variantId: string) =>
    state.halfTextHalfImageStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => {
    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
        return { ...comp, data: data };
      }
      return comp;
    });

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: data,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.halfTextHalfImageStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    // Update pageComponentsByPage as well
    const currentPage = state.currentPage;
    const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === "halfTextHalfImage" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    });

    return {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: newData,
      },
      pageComponentsByPage: {
        ...state.pageComponentsByPage,
        [currentPage]: updatedComponents,
      },
    } as any;
  },
};
