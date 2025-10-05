"use client";

import { create } from "zustand";
import { ComponentData } from "@/lib-liveeditor/types";
import { COMPONENTS } from "@/lib-liveeditor/ComponentsList";
import { heroStructure } from "@/componentsStructure/hero";
import { headerStructure } from "@/componentsStructure/header";
import { halfTextHalfImageStructure } from "@/componentsStructure/halfTextHalfImage";
import { propertySliderStructure } from "@/componentsStructure/propertySlider";
import { ctaValuationStructure } from "@/componentsStructure/ctaValuation";
import { stepsSectionStructure } from "@/componentsStructure/stepsSection";
import { footerStructure } from "@/componentsStructure/footer";
import { gridStructure } from "@/componentsStructure/grid";
import { filterButtonsStructure } from "@/componentsStructure/filterButtons";
import { propertyFilterStructure } from "@/componentsStructure/propertyFilter";
import { mapSectionStructure } from "@/componentsStructure/mapSection";
import { contactFormSectionStructure } from "@/componentsStructure/contactFormSection";
import { contactCardsStructure } from "@/componentsStructure/contactCards";

// Deep merge function for nested objects
const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};

// Import component functions
import { heroFunctions } from "./editorStoreFunctions/heroFunctions";
import { headerFunctions } from "./editorStoreFunctions/headerFunctions";
import { footerFunctions } from "./editorStoreFunctions/footerFunctions";
import { halfTextHalfImageFunctions } from "./editorStoreFunctions/halfTextHalfImageFunctions";
import { propertySliderFunctions } from "./editorStoreFunctions/propertySliderFunctions";
import { ctaValuationFunctions } from "./editorStoreFunctions/ctaValuationFunctions";
import { stepsSectionFunctions } from "./editorStoreFunctions/stepsSectionFunctions";
import { testimonialsFunctions } from "./editorStoreFunctions/testimonialsFunctions";
import { whyChooseUsFunctions } from "./editorStoreFunctions/whyChooseUsFunctions";
import { contactMapSectionFunctions } from "./editorStoreFunctions/contactMapSectionFunctions";
import { gridFunctions } from "./editorStoreFunctions/gridFunctions";
import { filterButtonsFunctions } from "./editorStoreFunctions/filterButtonsFunctions";
import { propertyFilterFunctions } from "./editorStoreFunctions/propertyFilterFunctions";
import { mapSectionFunctions } from "./editorStoreFunctions/mapSectionFunctions";
import { contactCardsFunctions } from "./editorStoreFunctions/contactCardsFunctions";
import { contactFormSectionFunctions } from "./editorStoreFunctions/contactFormSectionFunctions";
import { createDefaultData } from "./editorStoreFunctions/types";
import { getDefaultHeaderData } from "./editorStoreFunctions/headerFunctions";
import { getDefaultFooterData } from "./editorStoreFunctions/footerFunctions";

type OpenDialogFn = () => void;

type ComponentInstanceWithPosition = {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: ComponentData;
  position: number;
};

interface EditorStore {
  // حالة حفظ البيانات
  showDialog: boolean;
  openSaveDialogFn: OpenDialogFn;

  // دالة حفظ ديناميكية
  setOpenSaveDialog: (fn: OpenDialogFn) => void;
  requestSave: () => void;
  closeDialog: () => void;

  // حالة تتبع التعديلات
  hasChangesMade: boolean;
  setHasChangesMade: (hasChanges: boolean) => void;

  // Current page for tracking
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // بيانات التعديل المؤقتة للمكون
  tempData: ComponentData;
  setTempData: (data: ComponentData) => void;
  updateTempField: (
    field: "texts" | "colors" | "settings",
    key: string,
    value: string | boolean | number,
  ) => void;
  updateByPath: (path: string, value: any) => void;

  // Global Components - Header and Footer shared across all pages
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  setGlobalHeaderData: (data: ComponentData) => void;
  setGlobalFooterData: (data: ComponentData) => void;
  updateGlobalHeaderByPath: (path: string, value: any) => void;
  updateGlobalFooterByPath: (path: string, value: any) => void;

  // Global Components Data - unified state for all global components
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };
  setGlobalComponentsData: (data: {
    header: ComponentData;
    footer: ComponentData;
  }) => void;
  updateGlobalComponentByPath: (
    componentType: "header" | "footer",
    path: string,
    value: any,
  ) => void;

  // Structures registry
  structures: Record<string, any>;

  // Dynamic component states - يتم إنشاؤها تلقائياً من ComponentsList
  componentStates: Record<string, Record<string, ComponentData>>;

  // Dynamic component getters - يتم إنشاؤها تلقائياً من ComponentsList
  componentGetters: Record<string, (variantId: string) => ComponentData>;

  // Generic functions for all components
  ensureComponentVariant: (
    componentType: string,
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getComponentData: (componentType: string, variantId: string) => ComponentData;
  setComponentData: (
    componentType: string,
    variantId: string,
    data: ComponentData,
  ) => void;
  updateComponentByPath: (
    componentType: string,
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Legacy specific component states (للتوافق مع الكود الحالي)
  heroStates: Record<string, ComponentData>;
  ensureHeroVariant: (variantId: string, initial?: ComponentData) => void;
  getHeroData: (variantId: string) => ComponentData;
  setHeroData: (variantId: string, data: ComponentData) => void;
  updateHeroByPath: (variantId: string, path: string, value: any) => void;

  headerStates: Record<string, ComponentData>;
  ensureHeaderVariant: (variantId: string, initial?: ComponentData) => void;
  getHeaderData: (variantId: string) => ComponentData;
  setHeaderData: (variantId: string, data: ComponentData) => void;
  updateHeaderByPath: (variantId: string, path: string, value: any) => void;

  // Half Text Half Image states
  halfTextHalfImageStates: Record<string, ComponentData>;
  ensurehalfTextHalfImageVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  gethalfTextHalfImageData: (variantId: string) => ComponentData;
  sethalfTextHalfImageData: (variantId: string, data: ComponentData) => void;
  updatehalfTextHalfImageByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Property Slider states
  propertySliderStates: Record<string, ComponentData>;
  ensurePropertySliderVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getPropertySliderData: (variantId: string) => ComponentData;
  setPropertySliderData: (variantId: string, data: ComponentData) => void;
  updatePropertySliderByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // CTA Valuation states
  ctaValuationStates: Record<string, ComponentData>;
  ensureCtaValuationVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getCtaValuationData: (variantId: string) => ComponentData;
  setCtaValuationData: (variantId: string, data: ComponentData) => void;
  updateCtaValuationByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Steps Section states
  stepsSectionStates: Record<string, ComponentData>;
  ensureStepsSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getStepsSectionData: (variantId: string) => ComponentData;
  setStepsSectionData: (variantId: string, data: ComponentData) => void;
  updateStepsSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Testimonials states
  testimonialsStates: Record<string, ComponentData>;
  ensureTestimonialsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getTestimonialsData: (variantId: string) => ComponentData;
  setTestimonialsData: (variantId: string, data: ComponentData) => void;
  updateTestimonialsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Why Choose Us states
  whyChooseUsStates: Record<string, ComponentData>;
  ensureWhyChooseUsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getWhyChooseUsData: (variantId: string) => ComponentData;
  setWhyChooseUsData: (variantId: string, data: ComponentData) => void;
  updateWhyChooseUsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Contact Map Section states
  contactMapSectionStates: Record<string, ComponentData>;
  ensureContactMapSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactMapSectionData: (variantId: string) => ComponentData;
  setContactMapSectionData: (variantId: string, data: ComponentData) => void;
  updateContactMapSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Footer states
  footerStates: Record<string, ComponentData>;
  ensureFooterVariant: (variantId: string, initial?: ComponentData) => void;
  getFooterData: (variantId: string) => ComponentData;
  setFooterData: (variantId: string, data: ComponentData) => void;
  updateFooterByPath: (variantId: string, path: string, value: any) => void;

  // Grid states
  gridStates: Record<string, ComponentData>;
  ensureGridVariant: (variantId: string, initial?: ComponentData) => void;
  getGridData: (variantId: string) => ComponentData;
  setGridData: (variantId: string, data: ComponentData) => void;
  updateGridByPath: (variantId: string, path: string, value: any) => void;

  // Filter Buttons states
  filterButtonsStates: Record<string, ComponentData>;
  ensureFilterButtonsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getFilterButtonsData: (variantId: string) => ComponentData;
  setFilterButtonsData: (variantId: string, data: ComponentData) => void;
  updateFilterButtonsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Property Filter states
  propertyFilterStates: Record<string, ComponentData>;
  ensurePropertyFilterVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getPropertyFilterData: (variantId: string) => ComponentData;
  setPropertyFilterData: (variantId: string, data: ComponentData) => void;
  updatePropertyFilterByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Map Section states
  mapSectionStates: Record<string, ComponentData>;
  ensureMapSectionVariant: (variantId: string, initial?: ComponentData) => void;
  getMapSectionData: (variantId: string) => ComponentData;
  setMapSectionData: (variantId: string, data: ComponentData) => void;
  updateMapSectionByPath: (variantId: string, path: string, value: any) => void;

  // Contact Form Section states
  contactFormSectionStates: Record<string, ComponentData>;
  ensureContactFormSectionVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactFormSectionData: (variantId: string) => ComponentData;
  setContactFormSectionData: (variantId: string, data: ComponentData) => void;
  updateContactFormSectionByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Contact Cards states
  contactCardsStates: Record<string, ComponentData>;
  ensureContactCardsVariant: (
    variantId: string,
    initial?: ComponentData,
  ) => void;
  getContactCardsData: (variantId: string) => ComponentData;
  setContactCardsData: (variantId: string, data: ComponentData) => void;
  updateContactCardsByPath: (
    variantId: string,
    path: string,
    value: any,
  ) => void;

  // Page-wise components aggregation (for saving all pages)
  pageComponentsByPage: Record<string, ComponentInstanceWithPosition[]>;
  setPageComponentsForPage: (
    page: string,
    components: {
      id: string;
      type: string;
      name: string;
      componentName: string;
      data: ComponentData;
    }[],
  ) => void;

  // Load data from database into editor stores
  loadFromDatabase: (tenantData: any) => void;

  // Create new page
  createPage: (pageData: {
    slug: string;
    name: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    components?: ComponentInstanceWithPosition[];
  }) => void;

  // Get all pages
  getAllPages: () => string[];

  // Delete page
  deletePage: (slug: string) => void;

  // Force update page components for immediate save
  forceUpdatePageComponents: (slug: string, components: any[]) => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  showDialog: false,
  openSaveDialogFn: () => {},
  tempData: {},
  currentPage: "homepage",
  hasChangesMade: false,

  // Initialize Global Components with default data
  globalHeaderData: getDefaultHeaderData(),
  globalFooterData: getDefaultFooterData(),

  // Initialize Global Components Data
  globalComponentsData: {
    header: getDefaultHeaderData(),
    footer: getDefaultFooterData(),
  },

  structures: Object.keys(COMPONENTS).reduce(
    (acc, componentType) => {
      acc[componentType] = COMPONENTS[componentType];
      return acc;
    },
    {} as Record<string, any>,
  ),
  heroStates: {},
  headerStates: {},
  footerStates: {},
  halfTextHalfImageStates: {},
  propertySliderStates: {},
  ctaValuationStates: {},
  stepsSectionStates: {},
  testimonialsStates: {},
  whyChooseUsStates: {},
  contactMapSectionStates: {},
  gridStates: {},
  filterButtonsStates: {},
  propertyFilterStates: {},
  mapSectionStates: {},
  contactCardsStates: {},
  contactFormSectionStates: {},

  // Dynamic component states
  componentStates: {},

  // Dynamic component getters - generated from ComponentsList
  componentGetters: Object.keys(COMPONENTS).reduce(
    (acc, componentType) => {
      acc[componentType] = (variantId: string) => {
        const state = get();
        return state.getComponentData(componentType, variantId);
      };
      return acc;
    },
    {} as Record<string, (variantId: string) => ComponentData>,
  ),

  // Aggregated page components with positions
  pageComponentsByPage: {},

  setOpenSaveDialog: (fn) => set(() => ({ openSaveDialogFn: fn })),
  requestSave: () => set(() => ({ showDialog: true })),
  closeDialog: () => set(() => ({ showDialog: false })),
  setHasChangesMade: (hasChanges) => {
    console.log("🏪 Store: setHasChangesMade called with:", hasChanges);
    set(() => ({ hasChangesMade: hasChanges }));
  },

  setCurrentPage: (page) => set(() => ({ currentPage: page })),

  setTempData: (data) => set(() => ({ tempData: data })),

  // Global Components management
  setGlobalHeaderData: (data) =>
    set(() => {
      return { globalHeaderData: data };
    }),
  setGlobalFooterData: (data) =>
    set(() => {
      return { globalFooterData: data };
    }),

  updateGlobalHeaderByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalHeaderData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultHeaderData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalHeaderData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),

  updateGlobalFooterByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Use default data if current data is empty
      let currentData = state.globalFooterData;
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData = getDefaultFooterData();
      }

      let newData: any = { ...currentData };
      let cursor: any = newData;

      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Force a new reference to ensure React re-renders
      const result = {
        globalFooterData: JSON.parse(JSON.stringify(newData)),
      };
      return result;
    }),

  // Global Components Data management
  setGlobalComponentsData: (data) =>
    set(() => {
      return { globalComponentsData: data };
    }),

  updateGlobalComponentByPath: (componentType, path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Get current data or initialize with defaults
      let currentData = state.globalComponentsData[componentType];
      if (!currentData || Object.keys(currentData).length === 0) {
        currentData =
          componentType === "header"
            ? getDefaultHeaderData()
            : getDefaultFooterData();
      }

      // Create a deep copy to avoid mutations
      let newData = JSON.parse(JSON.stringify(currentData));
      let cursor: any = newData;

      // Navigate to the target path
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }

      // Set the final value
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Return new state with properly replaced data
      return {
        globalComponentsData: {
          ...state.globalComponentsData,
          [componentType]: newData,
        },
      };
    }),

  updateTempField: (field, key, value) =>
    set((state) => {
      const updated = {
        ...state.tempData,
        [field]: {
          ...state.tempData?.[field],
          [key]: value,
        },
      } as ComponentData;
      return { tempData: updated };
    }),
  updateByPath: (path, value) =>
    set((state) => {
      const segments = path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .filter(Boolean);

      // Initialize tempData with current component data if it's empty
      let newData: any = { ...(state.tempData || {}) };

      // Special handling for menu items - always preserve tempData if it exists
      if (path === "menu" && state.tempData && state.tempData.menu) {
        newData = { ...state.tempData };
      }
      // If tempData is empty, try to get current component data
      else if (!state.tempData || Object.keys(state.tempData).length === 0) {
        // For global components, use the global data as base
        if (
          state.currentPage === "global-header" ||
          path.includes("menu") ||
          path.includes("logo")
        ) {
          // This is likely a global header component, use globalHeaderData as base
          newData = { ...state.globalHeaderData };
        } else if (
          state.currentPage === "global-footer" ||
          path.includes("footer")
        ) {
          // This is likely a global footer component, use globalFooterData as base
          newData = { ...state.globalFooterData };
        } else {
          // For other components, use empty object
          newData = {};
        }
      } else {
        // If tempData exists, use it as base and merge with global data for missing fields
        if (
          state.currentPage === "global-header" ||
          path.includes("menu") ||
          path.includes("logo")
        ) {
          // Merge tempData with globalHeaderData to ensure all fields are present
          // Use deep merge to preserve nested objects like menu arrays
          // Priority: tempData > globalHeaderData (tempData should override)
          newData = deepMerge(state.globalHeaderData, state.tempData);
        } else if (
          state.currentPage === "global-footer" ||
          path.includes("footer")
        ) {
          // Merge tempData with globalFooterData to ensure all fields are present
          // Use deep merge to preserve nested objects
          newData = deepMerge(state.globalFooterData, state.tempData);
        }
      }

      let cursor: any = newData;
      for (let i = 0; i < segments.length - 1; i++) {
        const key = segments[i]!;
        const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
        const existing = cursor[key];

        // إذا كان existing string أو primitive value، استبدله بـ object أو array
        if (
          existing == null ||
          typeof existing === "string" ||
          typeof existing === "number" ||
          typeof existing === "boolean"
        ) {
          cursor[key] = nextIsIndex ? [] : {};
        } else if (Array.isArray(existing) && !nextIsIndex) {
          cursor[key] = {};
        } else if (
          typeof existing === "object" &&
          !Array.isArray(existing) &&
          nextIsIndex
        ) {
          cursor[key] = [];
        }
        cursor = cursor[key];
      }
      const lastKey = segments[segments.length - 1]!;
      cursor[lastKey] = value;

      // Only update tempData, don't update global data until Save Changes is pressed

      return { tempData: newData };
    }),

  // Hero functions using modular approach
  ensureHeroVariant: (variantId, initial) =>
    set((state) => heroFunctions.ensureVariant(state, variantId, initial)),
  getHeroData: (variantId) => {
    const state = get();
    return heroFunctions.getData(state, variantId);
  },
  setHeroData: (variantId, data) =>
    set((state) => heroFunctions.setData(state, variantId, data)),
  updateHeroByPath: (variantId, path, value) =>
    set((state) => heroFunctions.updateByPath(state, variantId, path, value)),

  // Header functions using modular approach
  ensureHeaderVariant: (variantId, initial) =>
    set((state) => headerFunctions.ensureVariant(state, variantId, initial)),
  getHeaderData: (variantId) => {
    const state = get();
    return headerFunctions.getData(state, variantId);
  },
  setHeaderData: (variantId, data) =>
    set((state) => headerFunctions.setData(state, variantId, data)),
  updateHeaderByPath: (variantId, path, value) =>
    set((state) => headerFunctions.updateByPath(state, variantId, path, value)),

  // Footer functions using modular approach
  ensureFooterVariant: (variantId, initial) =>
    set((state) => footerFunctions.ensureVariant(state, variantId, initial)),
  getFooterData: (variantId) => {
    const state = get();
    return footerFunctions.getData(state, variantId);
  },
  setFooterData: (variantId, data) =>
    set((state) => footerFunctions.setData(state, variantId, data)),
  updateFooterByPath: (variantId, path, value) =>
    set((state) => footerFunctions.updateByPath(state, variantId, path, value)),

  // Generic functions for all components
  ensureComponentVariant: (componentType, variantId, initial) =>
    set((state) => {
      // Use specific component functions first for better consistency
      switch (componentType) {
        case "hero":
          return heroFunctions.ensureVariant(state, variantId, initial);
        case "header":
          return headerFunctions.ensureVariant(state, variantId, initial);
        case "footer":
          return footerFunctions.ensureVariant(state, variantId, initial);
        case "halfTextHalfImage":
          return halfTextHalfImageFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "propertySlider":
          return propertySliderFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "ctaValuation":
          return ctaValuationFunctions.ensureVariant(state, variantId, initial);
        case "stepsSection":
          return stepsSectionFunctions.ensureVariant(state, variantId, initial);
        case "testimonials":
          return testimonialsFunctions.ensureVariant(state, variantId, initial);
        case "whyChooseUs":
          return whyChooseUsFunctions.ensureVariant(state, variantId, initial);
        case "contactMapSection":
          return contactMapSectionFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "grid":
          return gridFunctions.ensureVariant(state, variantId, initial);
        case "filterButtons":
          return filterButtonsFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "propertyFilter":
          return propertyFilterFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "mapSection":
          return mapSectionFunctions.ensureVariant(state, variantId, initial);
        case "contactFormSection":
          return contactFormSectionFunctions.ensureVariant(
            state,
            variantId,
            initial,
          );
        case "contactCards":
          return contactCardsFunctions.ensureVariant(state, variantId, initial);
        case "contactFormSection":
          return contactFormSectionFunctions.ensureVariant(state, variantId, initial);
        default:
          // Fallback to generic component handling
          if (!state.componentStates[componentType]) {
            state.componentStates[componentType] = {};
          }

          if (
            state.componentStates[componentType][variantId] &&
            Object.keys(state.componentStates[componentType][variantId])
              .length > 0
          ) {
            return {} as any;
          }

          const defaultData = createDefaultData(componentType);
          const data: ComponentData = initial || defaultData;

          return {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: data,
              },
            },
          } as any;
      }
    }),

  getComponentData: (componentType, variantId) => {
    const state = get();

    // Try to use specific component functions first for better default data handling
    switch (componentType) {
      case "hero":
        return heroFunctions.getData(state, variantId);
      case "header":
        return headerFunctions.getData(state, variantId);
      case "footer":
        return footerFunctions.getData(state, variantId);
      case "halfTextHalfImage":
        return halfTextHalfImageFunctions.getData(state, variantId);
      case "propertySlider":
        return propertySliderFunctions.getData(state, variantId);
      case "ctaValuation":
        return ctaValuationFunctions.getData(state, variantId);
      case "stepsSection":
        return stepsSectionFunctions.getData(state, variantId);
      case "testimonials":
        return testimonialsFunctions.getData(state, variantId);
      case "whyChooseUs":
        return whyChooseUsFunctions.getData(state, variantId);
      case "contactMapSection":
        return contactMapSectionFunctions.getData(state, variantId);
      case "grid":
        return gridFunctions.getData(state, variantId);
      case "filterButtons":
        return filterButtonsFunctions.getData(state, variantId);
      case "propertyFilter":
        return propertyFilterFunctions.getData(state, variantId);
      case "mapSection":
        return mapSectionFunctions.getData(state, variantId);
      case "contactCards":
        return contactCardsFunctions.getData(state, variantId);
      case "contactFormSection":
        return contactFormSectionFunctions.getData(state, variantId);
        default:
        // Fallback to generic component data with default data creation
        const data = state.componentStates[componentType]?.[variantId];
        if (!data || Object.keys(data).length === 0) {
          const defaultData = createDefaultData(componentType);
          return defaultData;
        }
        return data;
    }
  },

  setComponentData: (componentType, variantId, data) =>
    set((state) => {
      // Use specific component functions first for better consistency
      let newState: any = {};

      switch (componentType) {
        case "hero":
          newState = heroFunctions.setData(state, variantId, data);
          break;
        case "header":
          newState = headerFunctions.setData(state, variantId, data);
          break;
        case "footer":
          newState = footerFunctions.setData(state, variantId, data);
          break;
        case "halfTextHalfImage":
          newState = halfTextHalfImageFunctions.setData(state, variantId, data);
          break;
        case "propertySlider":
          newState = propertySliderFunctions.setData(state, variantId, data);
          break;
        case "ctaValuation":
          newState = ctaValuationFunctions.setData(state, variantId, data);
          break;
        case "stepsSection":
          newState = stepsSectionFunctions.setData(state, variantId, data);
          break;
        case "testimonials":
          newState = testimonialsFunctions.setData(state, variantId, data);
          break;
        case "whyChooseUs":
          newState = whyChooseUsFunctions.setData(state, variantId, data);
          break;
        case "contactMapSection":
          newState = contactMapSectionFunctions.setData(state, variantId, data);
          break;
        case "grid":
          newState = gridFunctions.setData(state, variantId, data);
          break;
        case "filterButtons":
          newState = filterButtonsFunctions.setData(state, variantId, data);
          break;
        case "propertyFilter":
          newState = propertyFilterFunctions.setData(state, variantId, data);
          break;
        case "mapSection":
          newState = mapSectionFunctions.setData(state, variantId, data);
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.setData(
            state,
            variantId,
            data,
          );
          break;
        case "contactCards":
          newState = contactCardsFunctions.setData(state, variantId, data);
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.setData(state, variantId, data);
          break;
        default:
          // Fallback to generic component handling
          newState = {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: data,
              },
            },
          } as any;
      }

      // Update pageComponents with the new data
      const updatedState = { ...state, ...newState };
      const updatedPageComponents =
        updatedState.pageComponentsByPage[updatedState.currentPage] || [];

      // Find and update the component in pageComponents
      const updatedComponents = updatedPageComponents.map((comp: any) => {
        if (comp.type === componentType && comp.id === variantId) {
          return {
            ...comp,
            data: data,
          };
        }
        return comp;
      });

      return {
        ...newState,
        pageComponentsByPage: {
          ...updatedState.pageComponentsByPage,
          [updatedState.currentPage]: updatedComponents,
        },
      };
    }),

  updateComponentByPath: (componentType, variantId, path, value) =>
    set((state) => {
      // Use specific component functions first for better consistency
      let newState: any = {};

      switch (componentType) {
        case "hero":
          newState = heroFunctions.updateByPath(state, variantId, path, value);
          break;
        case "header":
          newState = headerFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "footer":
          newState = footerFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "halfTextHalfImage":
          newState = halfTextHalfImageFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertySlider":
          newState = propertySliderFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "ctaValuation":
          newState = ctaValuationFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "stepsSection":
          newState = stepsSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "testimonials":
          newState = testimonialsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "whyChooseUs":
          newState = whyChooseUsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactMapSection":
          newState = contactMapSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "grid":
          newState = gridFunctions.updateByPath(state, variantId, path, value);
          break;
        case "filterButtons":
          newState = filterButtonsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "propertyFilter":
          newState = propertyFilterFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "mapSection":
          newState = mapSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactCards":
          newState = contactCardsFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        case "contactFormSection":
          newState = contactFormSectionFunctions.updateByPath(
            state,
            variantId,
            path,
            value,
          );
          break;
        default:
          // Fallback to generic component handling
          const source =
            state.componentStates[componentType]?.[variantId] || {};
          const segments = path
            .replace(/\[(\d+)\]/g, ".$1")
            .split(".")
            .filter(Boolean);
          const newData: any = { ...source };
          let cursor: any = newData;

          for (let i = 0; i < segments.length - 1; i++) {
            const key = segments[i]!;
            const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
            const existing = cursor[key];

            if (
              existing == null ||
              typeof existing === "string" ||
              typeof existing === "number" ||
              typeof existing === "boolean"
            ) {
              cursor[key] = nextIsIndex ? [] : {};
            } else if (Array.isArray(existing) && !nextIsIndex) {
              cursor[key] = {};
            } else if (
              typeof existing === "object" &&
              !Array.isArray(existing) &&
              nextIsIndex
            ) {
              cursor[key] = [];
            }
            cursor = cursor[key];
          }

          const lastKey = segments[segments.length - 1]!;
          cursor[lastKey] = value;

          newState = {
            componentStates: {
              ...state.componentStates,
              [componentType]: {
                ...state.componentStates[componentType],
                [variantId]: newData,
              },
            },
          } as any;
      }

      // Update pageComponents with the new data
      const updatedState = { ...state, ...newState };
      const updatedPageComponents =
        updatedState.pageComponentsByPage[updatedState.currentPage] || [];

      // Find and update the component in pageComponents
      const updatedComponents = updatedPageComponents.map((comp: any) => {
        if (comp.type === componentType && comp.id === variantId) {
          // Get the updated data from the store
          const updatedData =
            updatedState[`${componentType}States`]?.[variantId] || comp.data;
          return {
            ...comp,
            data: updatedData,
          };
        }
        return comp;
      });

      return {
        ...newState,
        pageComponentsByPage: {
          ...updatedState.pageComponentsByPage,
          [updatedState.currentPage]: updatedComponents,
        },
      };
    }),

  // Half Text Half Image functions using modular approach
  ensurehalfTextHalfImageVariant: (variantId, initial) =>
    set((state) =>
      halfTextHalfImageFunctions.ensureVariant(state, variantId, initial),
    ),
  gethalfTextHalfImageData: (variantId) => {
    const state = get();
    return halfTextHalfImageFunctions.getData(state, variantId);
  },
  sethalfTextHalfImageData: (variantId, data) =>
    set((state) => halfTextHalfImageFunctions.setData(state, variantId, data)),
  updatehalfTextHalfImageByPath: (variantId, path, value) =>
    set((state) =>
      halfTextHalfImageFunctions.updateByPath(state, variantId, path, value),
    ),

  // Property Slider functions using modular approach
  ensurePropertySliderVariant: (variantId, initial) =>
    set((state) =>
      propertySliderFunctions.ensureVariant(state, variantId, initial),
    ),
  getPropertySliderData: (variantId) => {
    const state = get();
    return propertySliderFunctions.getData(state, variantId);
  },
  setPropertySliderData: (variantId, data) =>
    set((state) => propertySliderFunctions.setData(state, variantId, data)),
  updatePropertySliderByPath: (variantId, path, value) =>
    set((state) =>
      propertySliderFunctions.updateByPath(state, variantId, path, value),
    ),

  // CTA Valuation functions using modular approach
  ensureCtaValuationVariant: (variantId, initial) =>
    set((state) =>
      ctaValuationFunctions.ensureVariant(state, variantId, initial),
    ),
  getCtaValuationData: (variantId) => {
    const state = get();
    return ctaValuationFunctions.getData(state, variantId);
  },
  setCtaValuationData: (variantId, data) =>
    set((state) => ctaValuationFunctions.setData(state, variantId, data)),
  updateCtaValuationByPath: (variantId, path, value) =>
    set((state) =>
      ctaValuationFunctions.updateByPath(state, variantId, path, value),
    ),

  // Steps Section functions using modular approach
  ensureStepsSectionVariant: (variantId, initial) =>
    set((state) =>
      stepsSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getStepsSectionData: (variantId) => {
    const state = get();
    return stepsSectionFunctions.getData(state, variantId);
  },
  setStepsSectionData: (variantId, data) =>
    set((state) => stepsSectionFunctions.setData(state, variantId, data)),
  updateStepsSectionByPath: (variantId, path, value) =>
    set((state) =>
      stepsSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Testimonials functions using modular approach
  ensureTestimonialsVariant: (variantId, initial) =>
    set((state) =>
      testimonialsFunctions.ensureVariant(state, variantId, initial),
    ),
  getTestimonialsData: (variantId) => {
    const state = get();
    return testimonialsFunctions.getData(state, variantId);
  },
  setTestimonialsData: (variantId, data) =>
    set((state) => testimonialsFunctions.setData(state, variantId, data)),
  updateTestimonialsByPath: (variantId, path, value) =>
    set((state) =>
      testimonialsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Why Choose Us functions using modular approach
  ensureWhyChooseUsVariant: (variantId, initial) =>
    set((state) =>
      whyChooseUsFunctions.ensureVariant(state, variantId, initial),
    ),
  getWhyChooseUsData: (variantId) => {
    const state = get();
    return whyChooseUsFunctions.getData(state, variantId);
  },
  setWhyChooseUsData: (variantId, data) =>
    set((state) => whyChooseUsFunctions.setData(state, variantId, data)),
  updateWhyChooseUsByPath: (variantId, path, value) =>
    set((state) =>
      whyChooseUsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Contact Map Section functions using modular approach
  ensureContactMapSectionVariant: (variantId, initial) =>
    set((state) =>
      contactMapSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getContactMapSectionData: (variantId) => {
    const state = get();
    return contactMapSectionFunctions.getData(state, variantId);
  },
  setContactMapSectionData: (variantId, data) =>
    set((state) => contactMapSectionFunctions.setData(state, variantId, data)),
  updateContactMapSectionByPath: (variantId, path, value) =>
    set((state) =>
      contactMapSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Grid functions using modular approach
  ensureGridVariant: (variantId, initial) =>
    set((state) => gridFunctions.ensureVariant(state, variantId, initial)),
  getGridData: (variantId) => {
    const state = get();
    return gridFunctions.getData(state, variantId);
  },
  setGridData: (variantId, data) =>
    set((state) => gridFunctions.setData(state, variantId, data)),
  updateGridByPath: (variantId, path, value) =>
    set((state) => gridFunctions.updateByPath(state, variantId, path, value)),

  // Filter Buttons functions using modular approach
  ensureFilterButtonsVariant: (variantId, initial) =>
    set((state) =>
      filterButtonsFunctions.ensureVariant(state, variantId, initial),
    ),
  getFilterButtonsData: (variantId) => {
    const state = get();
    return filterButtonsFunctions.getData(state, variantId);
  },
  setFilterButtonsData: (variantId, data) =>
    set((state) => filterButtonsFunctions.setData(state, variantId, data)),
  updateFilterButtonsByPath: (variantId, path, value) =>
    set((state) =>
      filterButtonsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Property Filter functions using modular approach
  ensurePropertyFilterVariant: (variantId, initial) =>
    set((state) =>
      propertyFilterFunctions.ensureVariant(state, variantId, initial),
    ),
  getPropertyFilterData: (variantId) => {
    const state = get();
    return propertyFilterFunctions.getData(state, variantId);
  },
  setPropertyFilterData: (variantId, data) =>
    set((state) => propertyFilterFunctions.setData(state, variantId, data)),
  updatePropertyFilterByPath: (variantId, path, value) =>
    set((state) =>
      propertyFilterFunctions.updateByPath(state, variantId, path, value),
    ),

  // Map Section functions using modular approach
  ensureMapSectionVariant: (variantId, initial) =>
    set((state) =>
      mapSectionFunctions.ensureVariant(state, variantId, initial),
    ),
  getMapSectionData: (variantId) => {
    const state = get();
    return mapSectionFunctions.getData(state, variantId);
  },
  setMapSectionData: (variantId, data) =>
    set((state) => mapSectionFunctions.setData(state, variantId, data)),
  updateMapSectionByPath: (variantId, path, value) =>
    set((state) =>
      mapSectionFunctions.updateByPath(state, variantId, path, value),
    ),

  // Contact Form Section functions using modular approach
  ensureContactFormSectionVariant: (variantId, initial) =>
    set((state) => {
      const newState = contactFormSectionFunctions.ensureVariant(state, variantId, initial);
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
      };
    }),
  getContactFormSectionData: (variantId) => {
    const state = get();
    return contactFormSectionFunctions.getData(state, variantId);
  },
  setContactFormSectionData: (variantId, data) =>
    set((state) => {
      const newState = contactFormSectionFunctions.setData(state, variantId, data);
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
      };
    }),
  updateContactFormSectionByPath: (variantId, path, value) =>
    set((state) => {
      const newState = contactFormSectionFunctions.updateByPath(state, variantId, path, value);
      return {
        ...state,
        contactFormSectionStates: newState.contactFormSectionStates,
        pageComponentsByPage: newState.pageComponentsByPage,
      };
    }),

  // Contact Cards functions using modular approach
  ensureContactCardsVariant: (variantId, initial) =>
    set((state) =>
      contactCardsFunctions.ensureVariant(state, variantId, initial),
    ),
  getContactCardsData: (variantId) => {
    const state = get();
    return contactCardsFunctions.getData(state, variantId);
  },
  setContactCardsData: (variantId, data) =>
    set((state) => contactCardsFunctions.setData(state, variantId, data)),
  updateContactCardsByPath: (variantId, path, value) =>
    set((state) =>
      contactCardsFunctions.updateByPath(state, variantId, path, value),
    ),

  // Contact Form Section functions (second set removed - using the one above)

  // Page components management
  setPageComponentsForPage: (page, components) =>
    set((state) => {
      const withPositions: ComponentInstanceWithPosition[] = components.map(
        (c, index) => ({ ...c, position: index }),
      );
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [page]: withPositions,
        },
      } as any;
    }),

  loadFromDatabase: (tenantData) =>
    set((state) => {
      if (!tenantData?.componentSettings) {
        return {} as any;
      }

      const newState: any = { ...state };

      // Load Global Header and Footer data
      if (
        tenantData.globalHeaderData &&
        Object.keys(tenantData.globalHeaderData).length > 0
      ) {
        newState.globalHeaderData = tenantData.globalHeaderData;
      } else {
        // Only initialize with default header data if not already set in editorStore
        if (
          !state.globalHeaderData ||
          Object.keys(state.globalHeaderData).length === 0
        ) {
          const defaultHeaderData = getDefaultHeaderData();
          newState.globalHeaderData = defaultHeaderData;
        } else {
          // Keep existing globalHeaderData from editorStore
          newState.globalHeaderData = state.globalHeaderData;
        }
      }

      if (
        tenantData.globalFooterData &&
        Object.keys(tenantData.globalFooterData).length > 0
      ) {
        newState.globalFooterData = tenantData.globalFooterData;
      } else {
        // Only initialize with default footer data if not already set in editorStore
        if (
          !state.globalFooterData ||
          Object.keys(state.globalFooterData).length === 0
        ) {
          const defaultFooterData = getDefaultFooterData();
          newState.globalFooterData = defaultFooterData;
        } else {
          // Keep existing globalFooterData from editorStore
          newState.globalFooterData = state.globalFooterData;
        }
      }

      // Load Global Components Data
      if (
        tenantData.globalComponentsData &&
        Object.keys(tenantData.globalComponentsData).length > 0
      ) {
        newState.globalComponentsData = tenantData.globalComponentsData;
      } else {
        // Only initialize with default data if not already set in editorStore
        if (
          !state.globalComponentsData ||
          Object.keys(state.globalComponentsData).length === 0
        ) {
          const defaultHeaderData = getDefaultHeaderData();
          const defaultFooterData = getDefaultFooterData();
          newState.globalComponentsData = {
            header: defaultHeaderData,
            footer: defaultFooterData,
          };
        } else {
          // Keep existing globalComponentsData from editorStore
          newState.globalComponentsData = state.globalComponentsData;
        }
      }

      // Load page components from componentSettings
      Object.entries(tenantData.componentSettings).forEach(
        ([page, pageSettings]: [string, any]) => {
          if (pageSettings && typeof pageSettings === "object") {
            const components = Object.entries(pageSettings).map(
              ([id, comp]: [string, any]) => ({
                id,
                ...comp,
                position: comp.position ?? 0,
              }),
            );
            newState.pageComponentsByPage[page] = components;
          }
        },
      );

      // Load component data into respective stores using modular functions
      Object.entries(tenantData.componentSettings).forEach(
        ([page, pageSettings]: [string, any]) => {
          if (pageSettings && typeof pageSettings === "object") {
            Object.entries(pageSettings).forEach(
              ([id, comp]: [string, any]) => {
                if (comp.data && comp.componentName) {
                  switch (comp.type) {
                    case "header":
                      newState.headerStates = headerFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).headerStates;
                      break;
                    case "hero":
                      newState.heroStates = heroFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).heroStates;
                      break;
                    case "halfTextHalfImage":
                      newState.halfTextHalfImageStates =
                        halfTextHalfImageFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).halfTextHalfImageStates;
                      break;
                    case "propertySlider":
                      newState.propertySliderStates =
                        propertySliderFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).propertySliderStates;
                      break;
                    case "ctaValuation":
                      newState.ctaValuationStates =
                        ctaValuationFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).ctaValuationStates;
                      break;
                    case "stepsSection":
                      newState.stepsSectionStates =
                        stepsSectionFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).stepsSectionStates;
                      break;
                    case "testimonials":
                      newState.testimonialsStates =
                        testimonialsFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).testimonialsStates;
                      break;
                    case "whyChooseUs":
                      newState.whyChooseUsStates = whyChooseUsFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).whyChooseUsStates;
                      break;
                    case "contactMapSection":
                      newState.contactMapSectionStates =
                        contactMapSectionFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).contactMapSectionStates;
                      break;
                    case "footer":
                      newState.footerStates = footerFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).footerStates;
                      break;
                    case "grid":
                      newState.gridStates = gridFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).gridStates;
                      break;
                    case "filterButtons":
                      newState.filterButtonsStates =
                        filterButtonsFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).filterButtonsStates;
                      break;
                    case "propertyFilter":
                      newState.propertyFilterStates =
                        propertyFilterFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).propertyFilterStates;
                      break;
                    case "mapSection":
                      newState.mapSectionStates = mapSectionFunctions.setData(
                        newState,
                        comp.componentName,
                        comp.data,
                      ).mapSectionStates;
                      break;
                    case "contactFormSection":
                      newState.contactFormSectionStates =
                        contactFormSectionFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).contactFormSectionStates;
                      break;
                    case "contactCards":
                      newState.contactCardsStates =
                        contactCardsFunctions.setData(
                          newState,
                          comp.componentName,
                          comp.data,
                        ).contactCardsStates;
                      break;
                  }
                }
              },
            );
          }
        },
      );

      return newState;
    }),

  createPage: (pageData) =>
    set((state) => {
      const newState: any = { ...state };

      if (pageData.components) {
        newState.pageComponentsByPage[pageData.slug] = pageData.components;

        // Initialize component data using modular functions
        pageData.components.forEach((comp) => {
          switch (comp.type) {
            case "header":
              newState.headerStates = headerFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).headerStates;
              break;
            case "hero":
              newState.heroStates = heroFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).heroStates;
              break;
            case "halfTextHalfImage":
              newState.halfTextHalfImageStates =
                halfTextHalfImageFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).halfTextHalfImageStates;
              break;
            case "propertySlider":
              newState.propertySliderStates = propertySliderFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).propertySliderStates;
              break;
            case "ctaValuation":
              newState.ctaValuationStates = ctaValuationFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).ctaValuationStates;
              break;
            case "stepsSection":
              newState.stepsSectionStates = stepsSectionFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).stepsSectionStates;
              break;
            case "testimonials":
              newState.testimonialsStates = testimonialsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).testimonialsStates;
              break;
            case "whyChooseUs":
              newState.whyChooseUsStates = whyChooseUsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).whyChooseUsStates;
              break;
            case "contactMapSection":
              newState.contactMapSectionStates =
                contactMapSectionFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactMapSectionStates;
              break;
            case "footer":
              newState.footerStates = footerFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).footerStates;
              break;
            case "grid":
              newState.gridStates = gridFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).gridStates;
              break;
            case "filterButtons":
              newState.filterButtonsStates = filterButtonsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).filterButtonsStates;
              break;
            case "propertyFilter":
              newState.propertyFilterStates = propertyFilterFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).propertyFilterStates;
              break;
            case "mapSection":
              newState.mapSectionStates = mapSectionFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).mapSectionStates;
              break;
            case "contactFormSection":
              newState.contactFormSectionStates =
                contactFormSectionFunctions.setData(
                  newState,
                  comp.componentName,
                  comp.data,
                ).contactFormSectionStates;
              break;
            case "contactCards":
              newState.contactCardsStates = contactCardsFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).contactCardsStates;
              break;
            case "contactFormSection":
              newState.contactFormSectionStates = contactFormSectionFunctions.setData(
                newState,
                comp.componentName,
                comp.data,
              ).contactFormSectionStates;
              break;
          }
        });
      }

      return newState;
    }),

  getAllPages: () => {
    const state = get();
    return Object.keys(state.pageComponentsByPage);
  },

  deletePage: (slug) =>
    set((state) => {
      const newPageComponentsByPage = { ...state.pageComponentsByPage };
      delete newPageComponentsByPage[slug];
      return { pageComponentsByPage: newPageComponentsByPage } as any;
    }),

  forceUpdatePageComponents: (slug, components) =>
    set((state) => {
      return {
        pageComponentsByPage: {
          ...state.pageComponentsByPage,
          [slug]: components,
        },
      };
    }),
}));
