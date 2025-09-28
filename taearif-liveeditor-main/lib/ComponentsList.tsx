// ملف مركزي لإدارة جميع المكونات والخدمات في النظام
// Central file for managing all components and services in the system

import { heroStructure } from "@/componentsStructure/hero";
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

// قائمة جميع الأقسام المتاحة
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
    ],
  },
};

// قائمة جميع المكونات المتاحة
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

export const getComponentsByHasStore = (hasStore: boolean): ComponentType[] => {
  return Object.values(COMPONENTS).filter((comp) => comp.hasStore === hasStore);
};

export const getComponentsByHasStructure = (
  hasStructure: boolean
): ComponentType[] => {
  return Object.values(COMPONENTS).filter(
    (comp) => comp.hasStructure === hasStructure
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

// Export types for external use
