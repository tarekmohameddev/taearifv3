# Editor Store Functions - Complete Reference

## Critical Understanding for AI

This document explains ALL component function files in `context-liveeditor/editorStoreFunctions/`.

**Total**: 21 files (19 component types + types.ts + index.ts)

---

## Table of Contents

### Foundation

1. [types.ts](#typests) - Shared utilities
2. [index.ts](#indexts) - Export aggregator

### Component Functions (Alphabetical)

3. [applicationFormFunctions](#applicationformfunctions)
4. [contactCardsFunctions](#contactcardsfunctions)
5. [contactFormSectionFunctions](#contactformsectionfunctions)
6. [contactMapSectionFunctions](#contactmapsectionfunctions)
7. [ctaValuationFunctions](#ctavaluationfunctions)
8. [filterButtonsFunctions](#filterbuttonsfunctions)
9. [footerFunctions](#footerfunctions)
10. [gridFunctions](#gridfunctions)
11. [halfTextHalfImageFunctions](#halftexthalfimagefunctions)
12. [headerFunctions](#headerfunctions)
13. [heroFunctions](#herofunctions)
14. [inputs2Functions](#inputs2functions)
15. [inputsFunctions](#inputsfunctions)
16. [mapSectionFunctions](#mapsectionfunctions)
17. [propertyFilterFunctions](#propertyfilterfunctions)
18. [propertySliderFunctions](#propertysliderfunctions)
19. [stepsSectionFunctions](#stepssectionfunctions)
20. [testimonialsFunctions](#testimonialsfunctions)
21. [whyChooseUsFunctions](#whychooseusfunctions)

---

## types.ts

**Location**: `context-liveeditor/editorStoreFunctions/types.ts`

**Purpose**: Shared types and utility functions for ALL component functions

**Size**: 86 lines

### Exports

#### 1. ComponentState Type

```typescript
export type ComponentState = Record<string, ComponentData>;
```

**Meaning**:

- Key = variantId (UUID of component instance)
- Value = ComponentData (component's data object)

**Example**:

```typescript
heroStates: {
  "abc-123-def": { visible: true, content: {...} },
  "xyz-456-uvw": { visible: true, content: {...} }
}
```

#### 2. ComponentFunctions Interface

```typescript
export interface ComponentFunctions {
  ensureVariant: (variantId: string, initial?: ComponentData) => any;
  getData: (variantId: string) => ComponentData;
  setData: (variantId: string, data: ComponentData) => any;
  updateByPath: (variantId: string, path: string, value: any) => any;
}
```

**This is the CONTRACT that ALL component functions must follow**.

---

### Utility Functions

#### createDefaultData

```typescript
export const createDefaultData = (type: string): ComponentData => {
  return {
    visible: true,
    texts: {
      title: `${type} Title`,
      subtitle: "This is a sample subtitle for the section.",
    },
    colors: {
      background: "#FFFFFF",
      textColor: "#1F2937",
    },
    settings: {
      enabled: true,
      layout: "default",
    },
  };
};
```

**Purpose**: Generic fallback defaults

**Used When**: Component-specific defaults not available

**Example**:

```typescript
createDefaultData("newComponent")
// Returns:
{
  visible: true,
  texts: { title: "newComponent Title", subtitle: "..." },
  colors: { background: "#FFFFFF", textColor: "#1F2937" },
  settings: { enabled: true, layout: "default" }
}
```

---

#### updateDataByPath

```typescript
export const updateDataByPath = (
  source: any,
  path: string,
  value: any,
): any => {
  // ... implementation
};
```

**Purpose**: Update nested data using dot-separated path

**The Most IMPORTANT utility function**

**Features**:

1. Cleans duplicate path segments
2. Creates missing nested objects/arrays
3. Deep clones (no mutation)
4. Handles array indices

**Implementation Breakdown**:

```typescript
// STEP 1: Parse path
const segments = path
  .replace(/\[(\d+)\]/g, ".$1") // array[0] → array.0
  .split(".")
  .filter(Boolean); // Remove empty strings

// STEP 2: Clean duplicates
// "spacing.padding.padding.top.top" → "spacing.padding.top"
const cleanedSegments = segments.reduce((acc, segment, index) => {
  if (index === 0 || segment !== acc[acc.length - 1]) {
    acc.push(segment);
  }
  return acc;
}, []);

// STEP 3: Deep clone source
const newData = JSON.parse(JSON.stringify(source));
let cursor = newData;

// STEP 4: Navigate and create structure
for (let i = 0; i < cleanedSegments.length - 1; i++) {
  const key = cleanedSegments[i];
  const nextIsIndex = !Number.isNaN(Number(cleanedSegments[i + 1]));

  // Create if missing
  if (cursor[key] == null) {
    cursor[key] = nextIsIndex ? [] : {};
  }

  // Fix type mismatch
  if (nextIsIndex && !Array.isArray(cursor[key])) {
    cursor[key] = [];
  } else if (!nextIsIndex && Array.isArray(cursor[key])) {
    cursor[key] = {};
  }

  cursor = cursor[key];
}

// STEP 5: Set final value
const lastKey = cleanedSegments[cleanedSegments.length - 1];
cursor[lastKey] = value;

return newData;
```

**Examples**:

```typescript
const data = {
  content: {
    title: "Old Title",
  },
};

// Update simple path
updateDataByPath(data, "content.title", "New Title");
// Result: { content: { title: "New Title" } }

// Create nested path
updateDataByPath(data, "background.image.src", "image.jpg");
// Result: { content: {...}, background: { image: { src: "image.jpg" } } }

// Update array
updateDataByPath(data, "items.0.name", "First Item");
// Result: { content: {...}, items: [{ name: "First Item" }] }

// Fix duplicates
updateDataByPath(data, "spacing.padding.padding.top", 10);
// Cleans to: "spacing.padding.top"
// Result: { content: {...}, spacing: { padding: { top: 10 } } }
```

---

## index.ts

**Location**: `context-liveeditor/editorStoreFunctions/index.ts`

**Purpose**: Export aggregator for all component functions

**Size**: 16 lines

```typescript
export * from "./types";
export * from "./heroFunctions";
export * from "./headerFunctions";
export * from "./footerFunctions";
export * from "./halfTextHalfImageFunctions";
export * from "./propertySliderFunctions";
export * from "./stepsSectionFunctions";
export * from "./ctaValuationFunctions";
export * from "./testimonialsFunctions";
export * from "./whyChooseUsFunctions";
export * from "./contactMapSectionFunctions";
export * from "./gridFunctions";
export * from "./filterButtonsFunctions";
export * from "./propertyFilterFunctions";
```

**Usage**:

```typescript
// Import all at once
import {
  heroFunctions,
  headerFunctions,
  updateDataByPath,
} from "@/context-liveeditor/editorStoreFunctions";
```

---

## Component Function Pattern

**ALL component function files follow this pattern**:

```typescript
import { ComponentData } from "@/lib/types";
import { updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA (one or more variant-specific defaults)
// ═══════════════════════════════════════════════════════════
export const getDefault{Type}Data = (): ComponentData => ({
  visible: true,
  // ... component-specific fields
});

// Optional: Variant 2 defaults
export const getDefault{Type}2Data = (): ComponentData => ({
  visible: true,
  // ... variant 2 fields
});

// ═══════════════════════════════════════════════════════════
// FUNCTIONS OBJECT (4 required functions)
// ═══════════════════════════════════════════════════════════
export const {type}Functions = {
  ensureVariant: (state, variantId, initial?) => {
    // Initialize if not exists
    if (state.{type}States[variantId]) return {};

    const defaultData = getDefault{Type}Data();
    const data = initial || state.tempData || defaultData;

    return {
      {type}States: { ...state.{type}States, [variantId]: data }
    };
  },

  getData: (state, variantId) =>
    state.{type}States[variantId] || getDefault{Type}Data(),

  setData: (state, variantId, data) => ({
    {type}States: { ...state.{type}States, [variantId]: data }
  }),

  updateByPath: (state, variantId, path, value) => {
    const source = state.{type}States[variantId] || {};
    const newData = updateDataByPath(source, path, value);

    return {
      {type}States: { ...state.{type}States, [variantId]: newData }
    };
  }
};
```

---

## heroFunctions

**File**: `heroFunctions.ts` | **Lines**: 221

### Default Data

**Two variants**: hero1 (full) and hero2 (simple)

#### getDefaultHeroData (hero1)

```typescript
export const getDefaultHeroData = (): ComponentData => ({
  visible: true,

  // Height configuration
  height: {
    desktop: "90vh",
    tablet: "90vh",
    mobile: "90vh"
  },
  minHeight: {
    desktop: "520px",
    tablet: "520px",
    mobile: "520px"
  },

  // Background
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "صورة خلفية لغرفة معيشة حديثة",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000"
    }
  },

  // Content
  content: {
    title: "اكتشف عقارك المثالي في أفضل المواقع",
    subtitle: "نقدم لك أفضل الخيارات العقارية...",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff",
        lineHeight: "1.25"
      },
      subtitle: {
        family: "Tajawal",
        size: { desktop: "2xl", tablet: "2xl", mobile: "2xl" },
        weight: "normal",
        color: "rgba(255, 255, 255, 0.85)"
      }
    },
    alignment: "center",
    maxWidth: "5xl",
    paddingTop: "200px"
  },

  // Search form configuration
  searchForm: {
    enabled: true,
    position: "bottom",
    offset: "32",
    background: {
      color: "#ffffff",
      opacity: "1",
      shadow: "2xl",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "lg"
    },
    fields: {
      purpose: {
        enabled: true,
        options: [
          { value: "rent", label: "إيجار" },
          { value: "sell", label: "بيع" }
        ],
        default: "rent"
      },
      city: {
        enabled: true,
        placeholder: "أدخل المدينة أو المنطقة",
        icon: "MapPin"
      },
      type: {
        enabled: true,
        placeholder: "نوع العقار",
        icon: "Home",
        options: ["شقة", "فيلا", "دوبلكس", "أرض", ...]
      },
      price: {
        enabled: true,
        placeholder: "السعر",
        icon: "CircleDollarSign",
        options: [
          { id: "any", label: "أي سعر" },
          { id: "0-200k", label: "0 - 200 ألف" },
          ...
        ]
      },
      keywords: {
        enabled: true,
        placeholder: "كلمات مفتاحية..."
      }
    },
    responsive: {
      desktop: "all-in-row",
      tablet: "two-rows",
      mobile: "stacked"
    }
  },

  // Animations
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200
    },
    subtitle: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400
    },
    searchForm: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600
    }
  }
});
```

#### getDefaultHero2Data (hero2)

```typescript
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
        family: "Tajawal",
        size: { desktop: "36px", tablet: "36px", mobile: "36px" },
        weight: "bold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      description: {
        family: "Tajawal",
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
```

### Functions

#### ensureVariant

```typescript
ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
  if (
    state.heroStates[variantId] &&
    Object.keys(state.heroStates[variantId]).length > 0
  ) {
    return {} as any; // Already exists
  }

  // Determine default data based on variant
  const defaultData =
    variantId === "hero2" ? getDefaultHero2Data() : getDefaultHeroData();

  const data: ComponentData = initial || state.tempData || defaultData;

  return {
    heroStates: { ...state.heroStates, [variantId]: data },
  } as any;
};
```

**Key Logic**:

- Checks if variant already exists
- Selects appropriate default based on `variantId`
- Uses `initial` if provided, else `tempData`, else default
- Returns new state with variant initialized

---

## headerFunctions

**File**: `headerFunctions.ts` | **Lines**: 160

### Default Data

#### getDefaultHeaderData

```typescript
export const getDefaultHeaderData = (): ComponentData => ({
  visible: true,

  position: {
    type: "sticky",
    top: 0,
    zIndex: 50,
  },

  height: {
    desktop: 96, // h-24 = 96px
    tablet: 80,
    mobile: 64,
  },

  background: {
    type: "solid",
    opacity: "0.8",
    blur: true,
    colors: {
      from: "#ffffff",
      to: "#ffffff",
    },
  },

  colors: {
    text: "#1f2937",
    link: "#6b7280",
    linkHover: "#111827",
    linkActive: "#059669",
    icon: "#374151",
    iconHover: "#1f2937",
    border: "#e5e7eb",
    accent: "#059669",
  },

  logo: {
    type: "image+text",
    image: "https://dalel-lovat.vercel.app/images/logo.svg",
    text: "الشركة العقارية",
    font: {
      family: "Tajawal",
      size: 24,
      weight: "600",
    },
    url: "/",
    clickAction: "navigate",
  },

  menu: [
    {
      id: "home",
      type: "link",
      text: "الرئيسية",
      url: "/",
    },
    {
      id: "for-rent",
      type: "link",
      text: "للإيجار",
      url: "/for-rent",
    },
    {
      id: "for-sale",
      type: "link",
      text: "للبيع",
      url: "/for-sale",
    },
    {
      id: "about",
      type: "link",
      text: "من نحن",
      url: "/about-us",
    },
    {
      id: "contact",
      type: "link",
      text: "تواصل معنا",
      url: "/contact-us",
    },
  ],

  actions: {
    search: {
      enabled: false,
      placeholder: "بحث...",
    },
    user: {
      showProfile: false,
      showCart: false,
      showWishlist: false,
      showNotifications: false,
    },
    mobile: {
      showLogo: true,
      showLanguageToggle: false,
      showSearch: false,
    },
  },

  responsive: {
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280,
    },
    mobileMenu: {
      side: "right",
      width: 320,
      overlay: true,
    },
  },

  animations: {
    menuItems: {
      enabled: true,
      duration: 200,
      delay: 50,
    },
    mobileMenu: {
      enabled: true,
      duration: 300,
      easing: "ease-in-out",
    },
  },
});
```

**Structure**: Complex navigation configuration with responsive design

---

## footerFunctions

**File**: `footerFunctions.ts` | **Lines**: 140

### Default Data

```typescript
export const getDefaultFooterData = (): ComponentData => ({
  visible: true,

  background: {
    type: "image",
    image: "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
    alt: "خلفية الفوتر",
    color: "#1f2937",
    gradient: {
      enabled: false,
      direction: "to-r",
      startColor: "#1f2937",
      endColor: "#374151",
      middleColor: "#4b5563",
    },
    overlay: {
      enabled: true,
      opacity: "0.7",
      color: "#000000",
      blendMode: "multiply",
    },
  },

  layout: {
    columns: "3",
    spacing: "8",
    padding: "16",
    maxWidth: "7xl",
  },

  content: {
    companyInfo: {
      enabled: true,
      name: "الشركة العقارية",
      description: "نقدم لك أفضل الحلول العقارية...",
      tagline: "للخدمات العقارية",
      logo: "",
    },
    quickLinks: {
      enabled: true,
      title: "روابط مهمة",
      links: [
        { text: "الرئيسية", url: "/" },
        { text: "البيع", url: "/for-sale" },
        { text: "الإيجار", url: "/for-rent" },
        { text: "من نحن", url: "/about-us" },
        { text: "تواصل معنا", url: "/contact-us" },
      ],
    },
    contactInfo: {
      enabled: true,
      title: "معلومات التواصل",
      address: "المملكة العربية السعودية",
      phone1: "0000",
      phone2: "0000",
      email: "info@example.com",
    },
    socialMedia: {
      enabled: true,
      title: "وسائل التواصل الاجتماعي",
      platforms: [
        { name: "واتساب", icon: "FaWhatsapp", url: "#", color: "#25D366" },
        { name: "لينكد إن", icon: "Linkedin", url: "#", color: "#0077B5" },
        { name: "إنستغرام", icon: "Instagram", url: "#", color: "#E4405F" },
        { name: "تويتر", icon: "Twitter", url: "#", color: "#1DA1F2" },
        { name: "فيسبوك", icon: "Facebook", url: "#", color: "#1877F2" },
      ],
    },
  },

  footerBottom: {
    enabled: true,
    copyright: "© 2024 الشركة العقارية للخدمات العقارية. جميع الحقوق محفوظة.",
    legalLinks: [
      { text: "سياسة الخصوصية", url: "/privacy" },
      { text: "الشروط والأحكام", url: "/terms" },
    ],
  },

  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.7)",
      accent: "#10b981",
      border: "rgba(255, 255, 255, 0.2)",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "sm",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "none",
    },
  },
});
```

---

## halfTextHalfImageFunctions

**File**: `halfTextHalfImageFunctions.ts` | **Lines**: 421

**Special Feature**: EXTENSIVE logging for debugging

### Default Data (3 Variants)

#### Variant 1: getDefaultHalfTextHalfImageData

```typescript
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
    description: "نقدم لك أفضل الخدمات العقارية...",
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
```

#### Variant 2: getDefaultHalfTextHalfImage2Data

**Key Differences**: Includes stats counters

```typescript
export const getDefaultHalfTextHalfImage2Data = (): ComponentData => ({
  visible: true,

  // ... layout, spacing similar to variant 1

  content: {
    eyebrow: "تجربتك العقارية تبدأ هنا",
    title: "إيجاد عقار مناسب هو هدفنا",
    description: "يقدم لك الشركة العقارية العقاري...",
    stats: {
      stat1: { value: "+100", label: "عميل سعيد" },
      stat2: { value: "+50", label: "عقار تم بيعه" },
      stat3: { value: "+250", label: "عقار تم تأجيره" },
      stat4: { value: "40", label: "تقييمات العملاء" },
    },
  },

  // ... typography, image, responsive, animations
});
```

#### Variant 3: getDefaultHalfTextHalfImage3Data

**Key Differences**: Simplified structure for about-us pages

```typescript
export const getDefaultHalfTextHalfImage3Data = (): ComponentData => ({
  visible: true,

  // Legacy props for backward compatibility
  title: "رسالتنا",
  description: "نحن في الشركة العقارية العقاري نطمح...",
  imageSrc: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
  imageAlt: "Choose Us",
  imagePosition: "left",

  // New structure - MUST match legacy props
  content: {
    title: "رسالتنا",
    description: "نحن في الشركة العقارية العقاري نطمح...",
    imagePosition: "left",
  },

  image: {
    src: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
    alt: "Choose Us",
  },
});
```

### Functions with Logging

#### ensureVariant (with debug logs)

```typescript
ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
  // LOG: Function call
  logEditorStore("ENSURE_VARIANT_CALLED", variantId, "unknown", {
    variantId,
    hasInitial: !!(initial && Object.keys(initial).length > 0),
    initialKeys: initial ? Object.keys(initial) : [],
    existingData: state.halfTextHalfImageStates[variantId]
      ? Object.keys(state.halfTextHalfImageStates[variantId])
      : [],
    allVariants: Object.keys(state.halfTextHalfImageStates),
  });

  // If initial data provided, ALWAYS use it (even if exists)
  if (initial && Object.keys(initial).length > 0) {
    logEditorStore("OVERRIDE_EXISTING_DATA", variantId, "unknown", {
      oldData: state.halfTextHalfImageStates[variantId],
      newData: initial,
      reason: "Initial data provided",
    });

    const newState = {
      halfTextHalfImageStates: {
        ...state.halfTextHalfImageStates,
        [variantId]: initial,
      },
    };

    logEditorStore("ENSURE_VARIANT_RESULT", variantId, "unknown", {
      newState: newState,
      allVariantsAfter: Object.keys(newState.halfTextHalfImageStates),
    });

    return newState as any;
  }

  // If already exists, skip
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

  // Determine default data
  let defaultData;

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
};
```

#### setData (updates pageComponentsByPage too)

```typescript
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
};
```

---

## propertySliderFunctions

**File**: `propertySliderFunctions.ts` | **Lines**: 139

### Default Data

```typescript
export const getDefaultPropertySliderData = (): ComponentData => ({
  visible: true,

  layout: {
    maxWidth: "1600px",
    padding: {
      top: "56px",
      bottom: "56px",
    },
  },

  spacing: {
    titleBottom: "24px",
    slideGap: "16px",
  },

  content: {
    title: "أحدث العقارات للإيجار",
    description: "اكتشف أفضل العقارات المتاحة للإيجار في أفضل المواقع",
    viewAllText: "عرض الكل",
    viewAllUrl: "#",
  },

  typography: {
    title: {
      fontFamily: "Tajawal",
      fontSize: {
        desktop: "2xl",
        tablet: "xl",
        mobile: "lg",
      },
      fontWeight: "extrabold",
      color: "#1f2937",
    },
    subtitle: {
      fontFamily: "Tajawal",
      fontSize: {
        desktop: "lg",
        tablet: "base",
        mobile: "sm",
      },
      fontWeight: "normal",
      color: "#6b7280",
    },
    link: {
      fontSize: "sm",
      color: "#059669",
      hoverColor: "#047857",
    },
  },

  carousel: {
    desktopCount: 4,
    autoplay: true,
  },

  background: {
    color: "transparent",
  },

  cardSettings: {
    theme: "card1",
    showImage: true,
    showPrice: true,
    showDetails: true,
    showViews: true,
    showStatus: true,
    cardStyle: {
      borderRadius: "rounded-xl",
      shadow: "lg",
      hoverEffect: "scale",
    },
    imageSettings: {
      aspectRatio: "16/10",
      objectFit: "cover",
      overlay: {
        enabled: false,
        color: "rgba(0, 0, 0, 0.3)",
        gradient: false,
      },
    },
    contentSettings: {
      titleStyle: {
        fontSize: "lg",
        fontWeight: "bold",
        color: "#1f2937",
      },
      priceStyle: {
        fontSize: "xl",
        color: "#059669",
        currency: "ريال",
      },
    },
    interactionSettings: {
      clickable: true,
      buttonText: "تفاصيل",
      buttonStyle: {
        variant: "ghost",
        color: "#059669",
      },
    },
  },
});
```

---

## testimonialsFunctions

**File**: `testimonialsFunctions.ts` | **Lines**: 123

### Default Data

```typescript
export const getDefaultTestimonialsData = (): ComponentData => ({
  visible: true,
  title: "آراء عملائنا",
  description: "نحن نفخر بشركائنا وعملائنا...",

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
    autoplay: true,
    intervalMs: 5000,
    slidesPerView: 1,
    showNavigation: true,
    showPagination: true,
    loop: true,
  },

  testimonials: [
    {
      id: "1",
      quote: "خدمة ممتازة وسريعة، ساعدوني في العثور...",
      name: "أحمد محمد",
      location: "الرياض",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
    {
      id: "2",
      quote: "فريق محترف ومتفهم لاحتياجات العملاء...",
      name: "فاطمة علي",
      location: "جدة",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
    {
      id: "3",
      quote: "تجربة رائعة من البداية للنهاية...",
      name: "محمد السعد",
      location: "الدمام",
      rating: 5,
      avatar: "",
      company: "",
      date: "2024",
    },
  ],

  styling: {
    cardBackground: "#ffffff",
    textColor: "#1f2937",
    quoteColor: "#374151",
    nameColor: "#059669",
    locationColor: "#6b7280",
  },
});
```

---

## contactCardsFunctions

**File**: `contactCardsFunctions.ts` | **Lines**: 583

**Special Feature**: EXTENSIVE helper functions for card manipulation

### Default Data

```typescript
export const getDefaultContactCardsData = (): ComponentData => ({
  visible: true,

  layout: {
    container: {
      padding: {
        vertical: "py-[48px] md:py-[104px]",
        horizontal: "px-4 sm:px-10",
      },
    },
    grid: {
      columns: {
        mobile: "grid-cols-1",
        desktop: "md:grid-cols-3",
      },
      gap: "gap-[24px]",
      borderRadius: "rounded-[10px]",
    },
  },

  cards: [
    {
      icon: {
        src: "https://dalel-lovat.vercel.app/images/contact-us/address.svg",
        alt: "address Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
      },
      title: {
        text: "العنوان",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "text",
        text: "المملكة العربية السعودية",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
    // ... 2 more cards (email, phone)
  ],

  responsive: {
    breakpoints: {
      mobile: "768px",
      desktop: "1024px",
    },
    gridColumns: {
      mobile: 1,
      desktop: 3,
    },
  },

  animations: {
    cards: {
      enabled: true,
      type: "fadeInUp",
      duration: 500,
      delay: 0,
      stagger: 100,
    },
    icons: {
      enabled: true,
      type: "scaleIn",
      duration: 300,
      delay: 200,
    },
  },
});
```

### Extended Functions

**In addition to the 4 standard functions, contactCardsFunctions includes**:

```typescript
export const contactCardsFunctions = {
  // Standard 4
  ensureVariant: (state, variantId, initial?) => {...},
  getData: (state, variantId) => {...},
  setData: (state, variantId, data) => {...},
  updateByPath: (state, variantId, path, value) => {...},

  // Helper functions
  getDefaultData: getDefaultContactCardsData,
  createNew: () => getDefaultContactCardsData(),

  // Update functions
  update: (currentData, updates) => ({...currentData, ...updates}),

  // Card management
  addContactCard: (currentData, card) => ({
    ...currentData,
    cards: [...(currentData.cards || []), card]
  }),

  removeContactCard: (currentData, index) => ({
    ...currentData,
    cards: (currentData.cards || []).filter((_, i) => i !== index)
  }),

  updateContactCard: (currentData, index, updates) => ({
    ...currentData,
    cards: (currentData.cards || []).map((card, i) =>
      i === index ? { ...card, ...updates } : card
    )
  }),

  // Link management
  addLinkToCard: (currentData, cardIndex, link) => {...},
  removeLinkFromCard: (currentData, cardIndex, linkIndex) => {...},

  // Style management
  updateCardIcon: (currentData, cardIndex, icon) => {...},
  updateCardTitle: (currentData, cardIndex, title) => {...},
  updateCardContent: (currentData, cardIndex, content) => {...},
  updateCardStyle: (currentData, cardIndex, style) => {...},

  // Layout management
  updateLayout: (currentData, layout) => {...},
  updateAnimations: (currentData, animations) => {...},
  updateResponsive: (currentData, responsive) => {...},

  // Validation
  validate: (data) => {
    const errors: string[] = [];

    if (!data.cards || data.cards.length === 0) {
      errors.push("At least one contact card is required");
    }

    if (data.cards) {
      data.cards.forEach((card, index) => {
        if (!card.icon?.src) {
          errors.push(`Card ${index + 1} is missing icon source`);
        }
        if (!card.title?.text) {
          errors.push(`Card ${index + 1} is missing title`);
        }
        if (!card.content) {
          errors.push(`Card ${index + 1} is missing content`);
        }
        if (
          card.content?.type === "links" &&
          (!card.content.links || card.content.links.length === 0)
        ) {
          errors.push(`Card ${index + 1} with links type must have at least one link`);
        }
        if (card.content?.type === "text" && !card.content.text) {
          errors.push(`Card ${index + 1} with text type must have text content`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Getters
  getCard: (data, index) => data.cards?.[index] || null,
  getCardsCount: (data) => data.cards?.length || 0,

  // Reorder
  reorderCards: (currentData, fromIndex, toIndex) => {
    const cards = [...(currentData.cards || [])];
    const [movedCard] = cards.splice(fromIndex, 1);
    cards.splice(toIndex, 0, movedCard);

    return {
      ...currentData,
      cards
    };
  }
};
```

**Usage Example**:

```typescript
const { contactCardsFunctions } = await import("./contactCardsFunctions");

// Add new card
const updatedData = contactCardsFunctions.addContactCard(currentData, {
  icon: { src: "...", alt: "..." },
  title: { text: "New Card" },
  content: { type: "text", text: "Content" },
  cardStyle: {...}
});

// Validate data
const { isValid, errors } = contactCardsFunctions.validate(currentData);
if (!isValid) {
  console.error("Validation errors:", errors);
}

// Reorder cards
const reorderedData = contactCardsFunctions.reorderCards(currentData, 0, 2);
```

---

## inputs2Functions

**File**: `inputs2Functions.ts` | **Lines**: 525

**Special Feature**: Complex form builder with cards, fields, and visibility controls

### Default Data Structure

```typescript
export const getDefaultInputs2Data = (): ComponentData => ({
  visible: true,

  // Generic component data (from types.ts)
  texts: {
    title: "Advanced Inputs System Title",
    subtitle: "This is a sample subtitle for the section.",
  },
  colors: {
    background: "#FFFFFF",
    textColor: "#1F2937",
  },
  settings: {
    enabled: true,
    layout: "default",
  },

  // Component-specific data
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
    columns: "1",
  },

  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    accentColor: "#60a5fa",
    submitButtonGradient: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  },

  submitButton: {
    text: "إرسال",
    show: true,
    className: "max-w-[50%]",
    backgroundColor: "#059669",
    textColor: "#ffffff",
    hoverColor: "#067a55",
    borderRadius: "8px",
    padding: "12px 24px",
    apiEndpoint: "https://api.taearif.com/api/v1/property-requests/public",
  },

  cardsLayout: {
    columns: "1",
    gap: "24px",
    responsive: {
      mobile: "1",
      tablet: "2",
      desktop: "3",
    },
  },

  fieldsLayout: {
    columns: "2",
    gap: "16px",
    responsive: {
      mobile: "1",
      tablet: "2",
      desktop: "2",
    },
  },

  // ═══════════════════════════════════════════════════════════
  // VISIBILITY CONTROLS (1% of data - but very important!)
  // ═══════════════════════════════════════════════════════════
  cardVisibility: {
    propertyInfoCard: true,
    budgetCard: true,
    additionalDetailsCard: true,
    contactCard: true,
  },

  fieldVisibility: {
    propertyType: true,
    propertyCategory: true,
    city: true,
    district: true,
    areaFrom: true,
    areaTo: true,
    purchaseMethod: true,
    budgetFrom: true,
    budgetTo: true,
    seriousness: true,
    purchaseGoal: true,
    similarOffers: true,
    fullName: true,
    phone: true,
    whatsapp: true,
    notes: true,
  },

  fieldRequired: {
    propertyType: true,
    propertyCategory: true,
    city: true,
    district: true,
    areaFrom: false,
    areaTo: false,
    purchaseMethod: true,
    budgetFrom: true,
    budgetTo: false,
    seriousness: false,
    purchaseGoal: false,
    similarOffers: false,
    fullName: true,
    phone: true,
    whatsapp: false,
    notes: false,
  },

  // ═══════════════════════════════════════════════════════════
  // CARDS AND FIELDS CONFIGURATION (99% of data)
  // ═══════════════════════════════════════════════════════════
  cards: [
    {
      title: "معلومات العقار المطلوب",
      description: null,
      icon: [],
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: null,
      fields: [
        {
          label: "نوع العقار",
          placeholder: "نوع العقار",
          description: "نوع العقار",
          required: true,
          type: "select",
          options: [
            { value: "14", label: "آخرى" },
            { value: "4", label: "أرض" },
            { value: "7", label: "استراحة" },
            { value: "13", label: "دور في فيلا" },
            { value: "18", label: "شقة" },
            { value: "2", label: "شقة في برج" },
            { value: "3", label: "شقة في عمارة" },
            { value: "17", label: "شقة في فيلا" },
            { value: "15", label: "عمارة" },
            { value: "1", label: "فيلا" },
            { value: "5", label: "قصر" },
            { value: "12", label: "مبنى" },
            { value: "8", label: "محل تجاري" },
            { value: "6", label: "مزرعة" },
            { value: "11", label: "معرض" },
            { value: "9", label: "مكتب" },
            { value: "10", label: "منتجع" },
          ],
          validation: null,
          icon: null,
          id: "property_type",
        },
        {
          label: "نوع الملكية",
          placeholder: "نوع الملكية",
          description: null,
          required: false,
          type: "radio",
          options: [
            { value: "زراعي", label: "زراعي" },
            { value: "صناعي", label: "صناعي" },
            { value: "تجاري", label: "تجاري" },
            { value: "سكني", label: "سكني" },
          ],
          validation: null,
          icon: null,
          id: "category",
        },
        {
          id: "region",
          type: "select",
          label: "المدينة",
          placeholder: "المدينة",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "districts_id",
          type: "select",
          label: "الحي",
          placeholder: "الحي",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "area_from",
          type: null,
          label: "المساحة من",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "area_to",
          type: null,
          label: "المساحة إلى",
          placeholder: "المساحة إلى",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
    {
      id: "معلومات الميزانية والدفع",
      title: "معلومات الميزانية والدفع",
      description: null,
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "purchase_method",
          type: "radio",
          label: "طريقة الشراء",
          placeholder: "طريقة الشراء",
          required: false,
          description: null,
          icon: null,
          options: [
            { value: "كاش", label: "كاش" },
            { value: "تمويل بنكي", label: "تمويل بنكي" },
          ],
          validation: null,
        },
        {
          id: "budget_from",
          type: null,
          label: "الميزانية من",
          placeholder: "الميزانية من",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "budget_to",
          type: null,
          label: "الميزانية إلى",
          placeholder: "الميزانية إلى",
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
    {
      id: "تفاصيل إضافية",
      title: "تفاصيل إضافية",
      description: "تفاصيل إضافية",
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "seriousness",
          type: "radio",
          label: "الجدية",
          placeholder: "الجدية",
          required: false,
          description: null,
          icon: null,
          options: [
            { value: "مستعد فورًا", label: "مستعد فورًا" },
            { value: "خلال شهر", label: "خلال شهر" },
            { value: "خلال 3 أشهر", label: "خلال 3 أشهر" },
            { value: "لاحقًا / استكشاف فقط", label: "لاحقًا / استكشاف فقط" },
          ],
          validation: null,
        },
        {
          id: "purchase_goal",
          type: "radio",
          label: "هدف الشراء",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: [
            { value: "سكن خاص", label: "سكن خاص" },
            { value: "استثمار وتأجير", label: "استثمار وتأجير" },
            { value: "بناء وبيع", label: "بناء وبيع" },
            { value: "مشروع تجاري", label: "مشروع تجاري" },
          ],
          validation: null,
        },
        {
          id: "wants_similar_offers",
          type: "radio",
          label: "يريد عروض مشابهة",
          placeholder: "يريد عروض مشابهة",
          required: false,
          description: null,
          icon: null,
          options: [
            { value: "نعم", label: "نعم" },
            { value: "لا", label: "لا" },
          ],
          validation: null,
        },
      ],
    },
    {
      id: "بيانات التواصل",
      title: "بيانات التواصل",
      description: "بيانات التواصل",
      icon: null,
      color: "green",
      customColors: [],
      isCollapsible: false,
      showAddButton: false,
      addButtonText: "إضافة جديد",
      fields: [
        {
          id: "full_name",
          type: null,
          label: "الاسم الكامل",
          placeholder: null,
          required: true,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "phone",
          type: null,
          label: "رقم الهاتف",
          placeholder: "رقم الهاتف",
          required: true,
          description: "رقم الهاتف",
          icon: null,
          options: null,
          validation: null,
        },
        {
          id: "contact_on_whatsapp",
          type: "radio",
          label: "التواصل عبر واتساب",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: [
            { value: "نعم", label: "نعم" },
            { value: "لا", label: "لا" },
          ],
          validation: null,
        },
        {
          id: "notes",
          type: "textarea",
          label: "ملاحظات",
          placeholder: null,
          required: false,
          description: null,
          icon: null,
          options: null,
          validation: null,
        },
      ],
    },
  ],
});
```

**Important Note**: This is the most complex default data structure. It represents a full form builder system.

---

## Remaining Component Functions (Summary)

Due to space constraints, here's a summary of the remaining component functions. **All follow the same 4-function pattern**.

### ctaValuationFunctions

**Purpose**: Call-to-action sections for property valuation

**Default Data**: Button, title, description, background image

**Variants**: 1

---

### stepsSectionFunctions

**Purpose**: Step-by-step process displays

**Default Data**: Array of steps with icons, titles, descriptions

**Variants**: 1

---

### whyChooseUsFunctions

**Purpose**: Feature highlights / reasons to choose company

**Default Data**: Grid of features with icons

**Variants**: 1

---

### contactMapSectionFunctions

**Purpose**: Contact page with embedded map

**Default Data**: Map configuration, contact info

**Variants**: 1

---

### gridFunctions

**Purpose**: Generic grid layouts

**Default Data**: Grid configuration, items

**Variants**: 1

---

### filterButtonsFunctions

**Purpose**: Property filter buttons (rent/sale/etc)

**Default Data**: Button array, active state

**Variants**: 1

---

### propertyFilterFunctions

**Purpose**: Advanced property search filters

**Default Data**: All filter fields (type, price, location, etc.)

**Variants**: 1

---

### mapSectionFunctions

**Purpose**: Map display component

**Default Data**: Map center, zoom, markers

**Variants**: 1

---

### contactFormSectionFunctions

**Purpose**: Contact form

**Default Data**: Form fields, submit button, API endpoint

**Variants**: 1

---

### applicationFormFunctions

**Purpose**: Application form for property requests

**Default Data**: Multi-step form configuration

**Variants**: 1

---

### inputsFunctions

**Purpose**: Generic input component (simpler than inputs2)

**Default Data**: Input field configuration

**Variants**: 1

---

## Common Patterns Across All Functions

### Pattern 1: Variant Detection

```typescript
// In ensureVariant
const defaultData = variantId === "{specificVariant}"
  ? getDefault{Type}2Data()
  : getDefault{Type}Data();
```

**Used by**: hero, halfTextHalfImage (multiple variants)

### Pattern 2: Simple Fallback

```typescript
// In ensureVariant
const defaultData = getDefault{Type}Data();
const data = initial || state.tempData || defaultData;
```

**Used by**: Most components (single variant)

### Pattern 3: Existence Check

```typescript
// In ensureVariant
if (state.{type}States[variantId]) {
  return {};  // or return state
}
```

**Prevents**: Overwriting existing data

### Pattern 4: updateByPath with pageComponentsByPage Sync

```typescript
updateByPath: (state, variantId, path, value) => {
  const source = state.{type}States[variantId] || {};
  const newData = updateDataByPath(source, path, value);

  // Update pageComponentsByPage too
  const currentPage = state.currentPage;
  const updatedPageComponents = state.pageComponentsByPage[currentPage] || [];
  const updatedComponents = updatedPageComponents.map((comp) => {
    if (comp.type === "{type}" && comp.id === variantId) {
      return { ...comp, data: newData };
    }
    return comp;
  });

  return {
    {type}States: { ...state.{type}States, [variantId]: newData },
    pageComponentsByPage: {
      ...state.pageComponentsByPage,
      [currentPage]: updatedComponents
    }
  };
}
```

**Used by**: halfTextHalfImage, contactCards (components that update pageComponentsByPage)

**Why**: Keeps pageComponentsByPage in sync for saving

---

## Integration with editorStore

### How editorStore Routes to Component Functions

```typescript
// In editorStore.ts
import {
  heroFunctions,
  headerFunctions,
  footerFunctions,
  // ... all other functions
} from "./editorStoreFunctions";

const useEditorStore = create((set, get) => ({
  // ... all component state properties

  // Generic functions that route to specific component functions
  getComponentData: (componentType, variantId) => {
    const state = get();

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
      // ... all 19 component types
      default:
        return state.componentStates[componentType]?.[variantId] || {};
    }
  },

  setComponentData: (componentType, variantId, data) => {
    const state = get();

    switch (componentType) {
      case "hero":
        set(heroFunctions.setData(state, variantId, data));
        break;
      case "header":
        set(headerFunctions.setData(state, variantId, data));
        break;
      // ... all 19 component types
    }
  },

  updateComponentByPath: (componentType, variantId, path, value) => {
    const state = get();

    switch (componentType) {
      case "hero":
        set(heroFunctions.updateByPath(state, variantId, path, value));
        break;
      case "header":
        set(headerFunctions.updateByPath(state, variantId, path, value));
        break;
      // ... all 19 component types
    }
  },

  ensureComponentVariant: (componentType, variantId, initial?) => {
    const state = get();

    switch (componentType) {
      case "hero":
        set(heroFunctions.ensureVariant(state, variantId, initial));
        break;
      case "header":
        set(headerFunctions.ensureVariant(state, variantId, initial));
        break;
      // ... all 19 component types
    }
  },
}));
```

---

## Summary for AI

### Critical Understanding

1. **19 component types** = 19 function files
2. **Each file exports**:
   - 1+ default data functions (`getDefault{Type}Data`)
   - 1 functions object with 4 required functions
3. **Functions object must have**:
   - `ensureVariant` - Initialize if not exists
   - `getData` - Retrieve data
   - `setData` - Set/replace data
   - `updateByPath` - Update specific field
4. **All use `updateDataByPath` from types.ts** for nested updates
5. **Some components**:
   - Have multiple variants (hero, halfTextHalfImage)
   - Update pageComponentsByPage (halfTextHalfImage, contactCards)
   - Include extensive helper functions (contactCards)
   - Include debugging logs (halfTextHalfImage)

### Component Function Files Map

| Component Type     | File                           | Variants | Special Features     |
| ------------------ | ------------------------------ | -------- | -------------------- |
| hero               | heroFunctions.ts               | 2        | Search form config   |
| header             | headerFunctions.ts             | 1        | Menu navigation      |
| footer             | footerFunctions.ts             | 1        | Social media, links  |
| halfTextHalfImage  | halfTextHalfImageFunctions.ts  | 3        | Logging, stats       |
| propertySlider     | propertySliderFunctions.ts     | 1        | Carousel config      |
| ctaValuation       | ctaValuationFunctions.ts       | 1        | CTA button           |
| stepsSection       | stepsSectionFunctions.ts       | 1        | Steps array          |
| testimonials       | testimonialsFunctions.ts       | 1        | Carousel, ratings    |
| whyChooseUs        | whyChooseUsFunctions.ts        | 1        | Features grid        |
| contactMapSection  | contactMapSectionFunctions.ts  | 1        | Map embed            |
| grid               | gridFunctions.ts               | 1        | Generic grid         |
| filterButtons      | filterButtonsFunctions.ts      | 1        | Filter buttons       |
| propertyFilter     | propertyFilterFunctions.ts     | 1        | Advanced filters     |
| mapSection         | mapSectionFunctions.ts         | 1        | Map display          |
| contactFormSection | contactFormSectionFunctions.ts | 1        | Contact form         |
| contactCards       | contactCardsFunctions.ts       | 1        | Extended helpers     |
| applicationForm    | applicationFormFunctions.ts    | 1        | Multi-step form      |
| inputs             | inputsFunctions.ts             | 1        | Simple inputs        |
| inputs2            | inputs2Functions.ts            | 1        | Complex form builder |

---

**For AI**: This is the complete reference for all component function files. Each follows the same pattern but with component-specific default data structures.
