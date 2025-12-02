import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultPartnersData = (): ComponentData => ({
  visible: true,
  
  // Layout configuration
  layout: {
    maxWidth: "1600px",
    padding: {
      top: "5rem",
      bottom: "5rem"
    }
  },
  
  // Content
  content: {
    title: "موثوق من خبراء العقار. في جميع أنحاء المملكة.",
    titleHighlight: "خبراء العقار.",
    description: "من المسوّقين إلى المكاتب والمطوّرين — يعتمدون على تعاريف كل يوم لإدارة العقارات، وأتمتة التواصل، وزيادة الصفقات بسرعة وذكاء."
  },
  
  // Partners logos array
  partners: [
    {
      id: "1",
      src: "/images/landingPage/1.png",
      alt: "Partner Logo 1"
    },
    {
      id: "2",
      src: "/images/landingPage/2.png",
      alt: "Partner Logo 2"
    },
    {
      id: "3",
      src: "/images/landingPage/3.png",
      alt: "Partner Logo 3"
    },
    {
      id: "4",
      src: "/images/landingPage/6.png",
      alt: "Partner Logo 4"
    },
    {
      id: "5",
      src: "/images/landingPage/5.png",
      alt: "Partner Logo 5"
    },
    {
      id: "6",
      src: "/images/landingPage/4.png",
      alt: "Partner Logo 6"
    }
  ],
  
  // Styling
  styling: {
    backgroundColor: "transparent",
    titleColor: "#000000",
    titleHighlightColor: "#000000",
    descriptionColor: "#6E6E75",
    cardBackgroundColor: "#f9fafb",
    cardHoverBackgroundColor: "#f3f4f6",
    logoOpacity: 0.7,
    logoHoverOpacity: 1.0
  },
  
  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "4xl",
        desktop: "6xl"
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
      lineHeight: "tight"
    },
    description: {
      fontSize: {
        mobile: "base",
        tablet: "lg",
        desktop: "xl"
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
      lineHeight: "relaxed"
    }
  },
  
  // Grid configuration
  grid: {
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 6
    },
    gap: "2rem"
  },
  
  // Animation settings
  animation: {
    enabled: true,
    type: "fade-up",
    duration: 1000,
    threshold: 0.1
  }
});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const partnersFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   * 
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or state if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (state.partnersStates[variantId]) {
      return state;  // Already exists, return state as is
    }

    // Use default data
    const defaultData = getDefaultPartnersData();
    
    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      ...state,
      partnersStates: { ...state.partnersStates, [variantId]: data },
    };
  },
  
  /**
   * getData - Retrieve component data from store
   * 
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @returns Component data or default data if not found
   */
  getData: (state: any, variantId: string) => {
    const data =
      state.partnersStates[variantId] || getDefaultPartnersData();
    return data;
  },
  
  /**
   * setData - Set/replace component data completely
   * 
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    partnersStates: { ...state.partnersStates, [variantId]: data },
  }),
  
  /**
   * updateByPath - Update specific field in component data
   * 
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "content.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.partnersStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      ...state,
      partnersStates: { ...state.partnersStates, [variantId]: newData },
    };
  }
};

