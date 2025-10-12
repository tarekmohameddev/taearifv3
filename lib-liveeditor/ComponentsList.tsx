// ملف مركزي لإدارة جميع المكونات والخدمات في النظام
// Central file for managing all components and services in the system

/*
كيفية استخدام الدوال المترجمة:

1. استيراد دالة الترجمة:
   import { useEditorT } from "@/context-liveeditor/editorI18nStore";
   const t = useEditorT();

2. استخدام الدوال المترجمة:
   - getAllComponentsTranslated(t) - للحصول على جميع المكونات مترجمة
   - getAllSectionsTranslated(t) - للحصول على جميع الأقسام مترجمة
   - getComponentByIdTranslated('hero', t) - للحصول على مكون محدد مترجم
   - getSectionByIdTranslated('homepage', t) - للحصول على قسم محدد مترجم

3. مثال على الاستخدام في مكون React:
   const components = getAllComponentsTranslated(t);
   const sections = getAllSectionsTranslated(t);

ملاحظة: الدوال القديمة (بدون Translated) تبقى متاحة للتوافق مع الكود الموجود
*/

import { heroStructure } from "@/componentsStructure/hero";
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { headerStructure } from "@/componentsStructure/header";
import { halfTextHalfImageStructure } from "@/componentsStructure/halfTextHalfImage";
import { propertySliderStructure } from "@/componentsStructure/propertySlider";
import { ctaValuationStructure } from "@/componentsStructure/ctaValuation";
import { stepsSectionStructure } from "@/componentsStructure/stepsSection";
import { footerStructure } from "@/componentsStructure/footer";
import { testimonialsStructure } from "@/componentsStructure/testimonials";
import { contactMapSectionStructure } from "@/componentsStructure/contactMapSection";
import { whyChooseUsStructure } from "@/componentsStructure/whyChooseUs";
import { gridStructure } from "@/componentsStructure/grid";
import { filterButtonsStructure } from "@/componentsStructure/filterButtons";
import { propertyFilterStructure } from "@/componentsStructure/propertyFilter";
import { mapSectionStructure } from "@/componentsStructure/mapSection";
import { contactFormSectionStructure } from "@/componentsStructure/contactFormSection";
import { contactCardsStructure } from "@/componentsStructure/contactCards";
import { propertiesPageStructure } from "@/componentsStructure/propertiesPage";
import { inputsStructure } from "@/componentsStructure/inputs";
import { inputs2Structure } from "@/componentsStructure/inputs2";

export interface ComponentType {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  section: string;
  subPath: string;
  variants: any[];
  icon: string;
  hasStore?: boolean;
  hasStructure?: boolean;
  defaultTheme?: string;
}

export interface SectionType {
  id: string;
  name: string;
  displayName: string;
  path: string;
  description: string;
  icon: string;
  components: string[];
}

// دالة للحصول على الأقسام مع الترجمة
export const getSections = (
  t: (key: string) => string,
): Record<string, SectionType> => ({
  homepage: {
    id: "homepage",
    name: "homepage",
    displayName: t("sections.homepage.display_name"),
    path: "homepage",
    description: t("sections.homepage.description"),
    icon: "🏠",
    components: [
      "header",
      "hero",
      "halfTextHalfImage",
      "propertySlider",
      "ctaValuation",
      "stepsSection",
      "whyChooseUs",
      "testimonials",
      "contactMapSection",
      "footer",
      "grid",
      "filterButtons",
      "propertyFilter",
      "mapSection",
      "contactFormSection",
      "contactCards",
      "propertiesPage",
      "inputs",
      "inputs2",
    ],
  },
});

// قائمة جميع الأقسام المتاحة (للتوافق مع الكود الموجود)
export const SECTIONS: Record<string, SectionType> = {
  homepage: {
    id: "homepage",
    name: "homepage",
    displayName: "الصفحة الرئيسية",
    path: "homepage",
    description: "مكونات الصفحة الرئيسية للموقع",
    icon: "🏠",
    components: [
      "header",
      "hero",
      "halfTextHalfImage",
      "propertySlider",
      "ctaValuation",
      "stepsSection",
      "whyChooseUs",
      "testimonials",
      "contactMapSection",
      "footer",
      "grid",
      "filterButtons",
      "propertyFilter",
      "mapSection",
      "contactFormSection",
      "contactCards",
      "propertiesPage",
      "inputs",
      "inputs2",
    ],
  },
};

// دالة للحصول على المكونات مع الترجمة
export const getComponents = (
  t: (key: string) => string,
): Record<string, any> => ({
  hero: {
    id: "hero",
    name: "hero",
    displayName: t("components.hero.display_name"),
    description: t("components.hero.description"),
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    ...heroStructure,
  },
  header: {
    id: "header",
    name: "header",
    displayName: t("components.header.display_name"),
    description: t("components.header.description"),
    category: "navigation",
    section: "homepage",
    subPath: "header",
    icon: "📄",
    ...headerStructure,
  },
  halfTextHalfImage: {
    id: "halfTextHalfImage",
    name: "halfTextHalfImage",
    displayName: t("components.halfTextHalfImage.display_name"),
    description: t("components.halfTextHalfImage.description"),
    category: "content",
    section: "homepage",
    subPath: "halfTextHalfImage",
    icon: "🖼️",
    ...halfTextHalfImageStructure,
  },
  propertySlider: {
    id: "propertySlider",
    name: "propertySlider",
    displayName: t("components.propertySlider.display_name"),
    description: t("components.propertySlider.description"),
    category: "content",
    section: "homepage",
    subPath: "propertySlider",
    icon: "🏠",
    ...propertySliderStructure,
  },
  ctaValuation: {
    id: "ctaValuation",
    name: "ctaValuation",
    displayName: t("components.ctaValuation.display_name"),
    description: t("components.ctaValuation.description"),
    category: "content",
    section: "homepage",
    subPath: "ctaValuation",
    icon: "💰",
    ...ctaValuationStructure,
  },
  stepsSection: {
    id: "stepsSection",
    name: "stepsSection",
    displayName: t("components.stepsSection.display_name"),
    description: t("components.stepsSection.description"),
    category: "content",
    section: "homepage",
    subPath: "stepsSection",
    icon: "📋",
    ...stepsSectionStructure,
  },
  whyChooseUs: {
    id: "whyChooseUs",
    name: "whyChooseUs",
    displayName: t("components.whyChooseUs.display_name"),
    description: t("components.whyChooseUs.description"),
    category: "content",
    section: "homepage",
    subPath: "whyChooseUs",
    icon: "✨",
    ...whyChooseUsStructure,
  },
  testimonials: {
    id: "testimonials",
    name: "testimonials",
    displayName: t("components.testimonials.display_name"),
    description: t("components.testimonials.description"),
    category: "content",
    section: "homepage",
    subPath: "testimonials",
    icon: "💬",
    ...testimonialsStructure,
  },
  contactMapSection: {
    id: "contactMapSection",
    name: "contactMapSection",
    displayName: t("components.contactMapSection.display_name"),
    description: t("components.contactMapSection.description"),
    category: "contact",
    section: "homepage",
    subPath: "contactMapSection",
    icon: "📍",
    ...contactMapSectionStructure,
  },
  footer: {
    id: "footer",
    name: "footer",
    displayName: t("components.footer.display_name"),
    description: t("components.footer.description"),
    category: "navigation",
    section: "homepage",
    subPath: "footer",
    icon: "🔽",
    ...footerStructure,
  },
  grid: {
    id: "grid",
    name: "grid",
    displayName: t("components.grid.display_name"),
    description: t("components.grid.description"),
    category: "content",
    section: "homepage",
    subPath: "grid",
    icon: "🏗️",
    ...gridStructure,
  },
  filterButtons: {
    id: "filterButtons",
    name: "filterButtons",
    displayName: t("components.filterButtons.display_name"),
    description: t("components.filterButtons.description"),
    category: "interaction",
    section: "homepage",
    subPath: "filterButtons",
    icon: "🔘",
    ...filterButtonsStructure,
  },
  propertyFilter: {
    id: "propertyFilter",
    name: "propertyFilter",
    displayName: t("components.propertyFilter.display_name"),
    description: t("components.propertyFilter.description"),
    category: "interaction",
    section: "homepage",
    subPath: "propertyFilter",
    icon: "🔍",
    ...propertyFilterStructure,
  },
  mapSection: {
    id: "mapSection",
    name: "mapSection",
    displayName: t("components.mapSection.display_name"),
    description: t("components.mapSection.description"),
    category: "content",
    section: "homepage",
    subPath: "mapSection",
    icon: "🗺️",
    ...mapSectionStructure,
  },
  contactFormSection: {
    id: "contactFormSection",
    name: "contactFormSection",
    displayName: t("components.contactFormSection.display_name"),
    description: t("components.contactFormSection.description"),
    category: "content",
    section: "homepage",
    subPath: "contactFormSection",
    icon: "📝",
    ...contactFormSectionStructure,
  },
  contactCards: {
    id: "contactCards",
    name: "contactCards",
    displayName: t("components.contactCards.display_name"),
    description: t("components.contactCards.description"),
    category: "content",
    section: "homepage",
    subPath: "contactCards",
    icon: "📇",
    ...contactCardsStructure,
  },
  propertiesPage: {
    id: "propertiesPage",
    name: "propertiesPage",
    displayName: t("components.propertiesPage.display_name"),
    description: t("components.propertiesPage.description"),
    category: "page",
    section: "homepage",
    subPath: "propertiesPage",
    icon: "🏘️",
    ...propertiesPageStructure,
  },
  inputs: {
    id: "inputs",
    name: "inputs",
    displayName: t("components.inputs.display_name"),
    description: t("components.inputs.description"),
    category: "form",
    section: "homepage",
    subPath: "inputs",
    icon: "📝",
    ...inputsStructure,
  },
  inputs2: {
    id: "inputs2",
    name: "inputs2",
    displayName: t("components.inputs2.display_name"),
    description: t("components.inputs2.description"),
    category: "form",
    section: "homepage",
    subPath: "inputs2",
    icon: "📝",
    ...inputs2Structure,
  },
});

// قائمة جميع المكونات المتاحة (للتوافق مع الكود الموجود)
export const COMPONENTS: Record<string, any> = {
  hero: {
    id: "hero",
    name: "hero",
    displayName: "Hero",
    description:
      "Main banner section with compelling headline and call-to-action",
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    defaultTheme: "hero1",
    ...heroStructure,
  },
  header: {
    id: "header",
    name: "header",
    displayName: "Header",
    description: "Navigation bar with logo, menu, and user actions",
    category: "navigation",
    section: "homepage",
    subPath: "header",
    icon: "📄",
    ...headerStructure,
  },
  halfTextHalfImage: {
    id: "halfTextHalfImage",
    name: "halfTextHalfImage",
    displayName: "Half Text Half Image",
    description: "Section with text content and image side by side",
    category: "content",
    section: "homepage",
    subPath: "halfTextHalfImage",
    icon: "🖼️",
    ...halfTextHalfImageStructure,
  },
  propertySlider: {
    id: "propertySlider",
    name: "propertySlider",
    displayName: "Property Slider",
    description:
      "Carousel section displaying property cards in a slider format",
    category: "content",
    section: "homepage",
    subPath: "propertySlider",
    icon: "🏠",
    ...propertySliderStructure,
  },
  ctaValuation: {
    id: "ctaValuation",
    name: "ctaValuation",
    displayName: "CTA Valuation",
    description: "Call-to-action section with valuation content and image",
    category: "content",
    section: "homepage",
    subPath: "ctaValuation",
    icon: "💰",
    ...ctaValuationStructure,
  },
  stepsSection: {
    id: "stepsSection",
    name: "stepsSection",
    displayName: "Steps Section",
    description: "Section displaying steps or process in a grid layout",
    category: "content",
    section: "homepage",
    subPath: "stepsSection",
    icon: "📋",
    ...stepsSectionStructure,
  },
  whyChooseUs: {
    id: "whyChooseUs",
    name: "whyChooseUs",
    displayName: "Why Choose Us",
    description:
      "Section displaying features and reasons to choose the service",
    category: "content",
    section: "homepage",
    subPath: "whyChooseUs",
    icon: "✨",
    ...whyChooseUsStructure,
  },
  testimonials: {
    id: "testimonials",
    name: "testimonials",
    displayName: "Testimonials",
    description:
      "Section displaying customer testimonials and reviews in a carousel format",
    category: "content",
    section: "homepage",
    subPath: "testimonials",
    icon: "💬",
    ...testimonialsStructure,
  },
  contactMapSection: {
    id: "contactMapSection",
    name: "contactMapSection",
    displayName: "Contact Map Section",
    description: "Section displaying a map for contact information",
    category: "contact",
    section: "homepage",
    subPath: "contactMapSection",
    icon: "📍",
    ...contactMapSectionStructure,
  },
  footer: {
    id: "footer",
    name: "footer",
    displayName: "Footer",
    description:
      "Footer section with company information, links, and contact details",
    category: "navigation",
    section: "homepage",
    subPath: "footer",
    icon: "🔽",
    ...footerStructure,
  },
  grid: {
    id: "grid",
    name: "grid",
    displayName: "Property Grid",
    description:
      "Grid layout for displaying property cards in a responsive grid",
    category: "content",
    section: "homepage",
    subPath: "grid",
    icon: "🏗️",
    ...gridStructure,
  },
  filterButtons: {
    id: "filterButtons",
    name: "filterButtons",
    displayName: "Filter Buttons",
    description:
      "Filter buttons for property status (available, sold, rented) with inspection request button",
    category: "interaction",
    section: "homepage",
    subPath: "filterButtons",
    icon: "🔘",
    ...filterButtonsStructure,
  },
  propertyFilter: {
    id: "propertyFilter",
    name: "propertyFilter",
    displayName: "Property Filter",
    description:
      "Search and filter form for properties with location, type, and price filters",
    category: "interaction",
    section: "homepage",
    subPath: "propertyFilter",
    icon: "🔍",
    ...propertyFilterStructure,
  },
  mapSection: {
    id: "mapSection",
    name: "mapSection",
    displayName: "Map Section",
    description:
      "Interactive map section with markers, info windows, and customizable content overlay",
    category: "content",
    section: "homepage",
    subPath: "mapSection",
    icon: "🗺️",
    ...mapSectionStructure,
  },
  contactFormSection: {
    id: "contactFormSection",
    name: "contactFormSection",
    displayName: "Contact Form Section",
    description:
      "Contact form section with social media links and contact form",
    category: "content",
    section: "homepage",
    subPath: "contactFormSection",
    icon: "📝",
    ...contactFormSectionStructure,
  },
  contactCards: {
    id: "contactCards",
    name: "contactCards",
    displayName: "Contact Cards",
    description: "Contact information cards with icons, titles, and content",
    category: "content",
    section: "homepage",
    subPath: "contactCards",
    icon: "📇",
    ...contactCardsStructure,
  },
  propertiesPage: {
    id: "propertiesPage",
    name: "propertiesPage",
    displayName: "Properties Page",
    description:
      "Complete properties listing page with filter, search, and grid components",
    category: "page",
    section: "homepage",
    subPath: "propertiesPage",
    icon: "🏘️",
    ...propertiesPageStructure,
  },
  inputs: {
    id: "inputs",
    name: "inputs",
    displayName: "Advanced Inputs System",
    description:
      "Dynamic form system with customizable cards, fields, and validation",
    category: "form",
    section: "homepage",
    subPath: "inputs",
    icon: "📝",
    ...inputsStructure,
  },
  inputs2: {
    id: "inputs2",
    name: "inputs2",
    displayName: "Advanced Inputs System 2",
    description:
      "Enhanced dynamic form system with improved cards, fields, and validation",
    category: "form",
    section: "homepage",
    subPath: "inputs2",
    icon: "📝",
    ...inputs2Structure,
  },
};

// Helper Functions
export const getComponentById = (id: string): ComponentType | undefined => {
  return COMPONENTS[id];
};

export const getComponentsBySection = (sectionId: string): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.section === sectionId);
};

export const getComponentsByCategory = (category: string): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.category === category);
};

export const getSectionById = (id: string): SectionType | undefined => {
  return SECTIONS[id];
};

export const getAllSections = (): SectionType[] => {
  return Object.values(SECTIONS);
};

export const getAllComponents = (): ComponentType[] => {
  return Object.values(COMPONENTS);
};

// دوال جديدة تدعم الترجمة
// استخدام: const component = getComponentByIdTranslated('hero', t);
export const getComponentByIdTranslated = (
  id: string,
  t: (key: string) => string,
): ComponentType | undefined => {
  const components = getComponents(t);
  return components[id];
};

// استخدام: const components = getComponentsBySectionTranslated('homepage', t);
export const getComponentsBySectionTranslated = (
  sectionId: string,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.section === sectionId);
};

// استخدام: const components = getComponentsByCategoryTranslated('content', t);
export const getComponentsByCategoryTranslated = (
  category: string,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.category === category);
};

// استخدام: const section = getSectionByIdTranslated('homepage', t);
export const getSectionByIdTranslated = (
  id: string,
  t: (key: string) => string,
): SectionType | undefined => {
  const sections = getSections(t);
  return sections[id];
};

// استخدام: const sections = getAllSectionsTranslated(t);
export const getAllSectionsTranslated = (
  t: (key: string) => string,
): SectionType[] => {
  const sections = getSections(t);
  return Object.values(sections);
};

// استخدام: const components = getAllComponentsTranslated(t);
export const getAllComponentsTranslated = (
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components);
};

export const getComponentsByHasStore = (hasStore: boolean): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.hasStore === hasStore);
};

export const getComponentsByHasStructure = (
  hasStructure: boolean,
): ComponentType[] => {
  return Object.values(COMPONENTS).filter(
    (comp) => comp.hasStructure === hasStructure,
  );
};

export const isValidComponentType = (type: string): boolean => {
  return type in COMPONENTS;
};

export const isValidSectionType = (section: string): boolean => {
  return section in SECTIONS;
};

export const getComponentDisplayName = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.displayName : type;
};

export const getComponentDefaultTheme = (type: string): string => {
  const component = COMPONENTS[type];
  return component ? component.defaultTheme || `${type}1` : `${type}1`;
};

export const getComponentSubPath = (baseName: string): string | undefined => {
  const component = COMPONENTS[baseName];
  return component?.subPath;
};

export const getSectionPath = (section: string): string => {
  const sectionObj = SECTIONS[section];
  return sectionObj ? sectionObj.path : section;
};

// دوال إضافية تدعم الترجمة
// استخدام: const components = getComponentsByHasStoreTranslated(true, t);
export const getComponentsByHasStoreTranslated = (
  hasStore: boolean,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter((comp) => comp.hasStore === hasStore);
};

// استخدام: const components = getComponentsByHasStructureTranslated(true, t);
export const getComponentsByHasStructureTranslated = (
  hasStructure: boolean,
  t: (key: string) => string,
): ComponentType[] => {
  const components = getComponents(t);
  return Object.values(components).filter(
    (comp) => comp.hasStructure === hasStructure,
  );
};

// استخدام: const displayName = getComponentDisplayNameTranslated('hero', t);
export const getComponentDisplayNameTranslated = (
  type: string,
  t: (key: string) => string,
): string => {
  const components = getComponents(t);
  const component = components[type];
  return component ? component.displayName : type;
};

// استخدام: const theme = getComponentDefaultThemeTranslated('hero', t);
export const getComponentDefaultThemeTranslated = (
  type: string,
  t: (key: string) => string,
): string => {
  const components = getComponents(t);
  const component = components[type];
  return component ? component.defaultTheme || `${type}1` : `${type}1`;
};

// استخدام: const subPath = getComponentSubPathTranslated('hero', t);
export const getComponentSubPathTranslated = (
  baseName: string,
  t: (key: string) => string,
): string | undefined => {
  const components = getComponents(t);
  const component = components[baseName];
  return component?.subPath;
};

// استخدام: const path = getSectionPathTranslated('homepage', t);
export const getSectionPathTranslated = (
  section: string,
  t: (key: string) => string,
): string => {
  const sections = getSections(t);
  const sectionObj = sections[section];
  return sectionObj ? sectionObj.path : section;
};

// Export types for external use
