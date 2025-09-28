import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default hero1 data structure
export const getDefaultHeroData = (): ComponentData => ({
  visible: true,
  height: {
    desktop: "90vh",
    tablet: "90vh",
    mobile: "90vh",
  },
  minHeight: {
    desktop: "520px",
    tablet: "520px",
    mobile: "520px",
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "صورة خلفية لغرفة معيشة حديثة",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000",
    },
  },
  content: {
    title: "اكتشف عقارك المثالي في أفضل المواقع",
    subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
    font: {
      title: {
        family: "Inter",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      subtitle: {
        family: "Inter",
        size: { desktop: "2xl", tablet: "2xl", mobile: "2xl" },
        weight: "normal",
        color: "rgba(255, 255, 255, 0.85)",
      },
    },
    alignment: "center",
    maxWidth: "5xl",
    paddingTop: "200px",
  },
  searchForm: {
    enabled: true,
    position: "bottom",
    offset: "32",
    background: {
      color: "#ffffff",
      opacity: "1",
      shadow: "2xl",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "lg",
    },
    fields: {
      purpose: {
        enabled: true,
        options: [
          { value: "rent", label: "إيجار" },
          { value: "sell", label: "بيع" },
        ],
        default: "rent",
      },
      city: {
        enabled: true,
        placeholder: "أدخل المدينة أو المنطقة",
        icon: "MapPin",
      },
      type: {
        enabled: true,
        placeholder: "نوع العقار",
        icon: "Home",
        options: ["شقة", "فيلا", "دوبلكس", "أرض", "شاليه", "مكتب"],
      },
      price: {
        enabled: true,
        placeholder: "السعر",
        icon: "CircleDollarSign",
        options: [
          { id: "any", label: "أي سعر" },
          { id: "0-200k", label: "0 - 200 ألف" },
          { id: "200k-500k", label: "200 - 500 ألف" },
          { id: "500k-1m", label: "500 ألف - 1 مليون" },
          { id: "1m+", label: "أكثر من 1 مليون" },
        ],
      },
      keywords: {
        enabled: true,
        placeholder: "كلمات مفتاحية...",
      },
    },
    responsive: {
      desktop: "all-in-row",
      tablet: "two-rows",
      mobile: "stacked",
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    subtitle: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
    searchForm: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
    },
  },
});

// Default hero2 data structure
export const getDefaultHero2Data = (): ComponentData => ({
  visible: true,
  title: "من نحن",
  description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
  imageSrc: "https://dalel-lovat.vercel.app/images/hero.webp",
  imageAlt: "Background",
  height: {
    desktop: "229px",
    tablet: "229px",
    mobile: "229px",
  },
  minHeight: {
    desktop: "229px",
    tablet: "229px",
    mobile: "229px",
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "Background",
    overlay: {
      enabled: true,
      opacity: "0.6",
      color: "#000000",
    },
  },
  content: {
    title: "من نحن",
    description: "شريكك الموثوق في تحقيق أفضل الفرص العقارية",
    alignment: "center",
    maxWidth: "5xl",
    font: {
      title: {
        family: "Inter",
        size: { desktop: "36px", tablet: "36px", mobile: "36px" },
        weight: "bold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      description: {
        family: "Inter",
        size: { desktop: "15px", tablet: "15px", mobile: "15px" },
        weight: "normal",
        color: "#ffffff",
      },
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    description: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
  },
});

export const heroFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (
      state.heroStates[variantId] &&
      Object.keys(state.heroStates[variantId]).length > 0
    ) {
      return {} as any;
    }

    // تحديد البيانات الافتراضية حسب نوع المكون
    const defaultData = variantId === "hero2" ? getDefaultHero2Data() : getDefaultHeroData();
    const data: ComponentData = initial || state.tempData || defaultData;
    
    return { 
      heroStates: { ...state.heroStates, [variantId]: data } 
    } as any;
  },

  getData: (state: any, variantId: string) => 
    state.heroStates[variantId] || {},

  setData: (state: any, variantId: string, data: ComponentData) => ({
    heroStates: { ...state.heroStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.heroStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    
    return {
      heroStates: { ...state.heroStates, [variantId]: newData },
    } as any;
  },
};
