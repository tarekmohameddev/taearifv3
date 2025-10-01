import { ComponentData } from "@/lib/types";
import { createDefaultData } from "./types";

// Default data for contact form section
export const getDefaultContactFormSectionData = (): ComponentData => ({
  visible: true,
  layout: {
    container: {
      maxWidth: "1600px",
      padding: "px-4 py-8",
    },
    grid: {
      desktop: "md:flex-row",
      tablet: "md:flex-row",
      mobile: "flex-col",
    },
    gap: {
      desktop: "gap-[16px]",
      tablet: "gap-[16px]",
      mobile: "gap-[16px]",
    },
  },
  content: {
    title: {
      text: "زوروا صفحتنا على",
      style: {
        size: "text-[15px] md:text-[24px]",
        color: "#1f2937",
        weight: "font-normal",
        margin: "mb-[24px]",
      },
    },
    socialLinks: [
      {
        href: "https://facebook.com",
        alt: "facebook",
        text: "مكتب دليل الجواء التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://x.com",
        alt: "x",
        text: "مكتب دليل الجواء التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://www.instagram.com/guide__aljiwa?igsh=MWY1amdsaGlhZm1xOA==",
        alt: "instagram",
        text: "مكتب دليل الجواء التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://linkedin.com",
        alt: "linkedin",
        text: "مكتب دليل الجواء التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
      {
        href: "https://wa.me/966537120774",
        alt: "whatsapp",
        text: "مكتب دليل الجواء التلقائي",
        icon: {
          size: "24",
          color: "#1f2937",
        },
        textStyle: {
          size: "text-[14px] md:text-[16px]",
          color: "#1f2937",
          weight: "font-normal",
        },
      },
    ],
  },
  form: {
    layout: {
      width: "w-full md:w-[50%]",
      gap: "gap-[12px] md:gap-[24px]",
    },
    fields: {
      name: {
        enabled: true,
        placeholder: "أدخل اسمك",
        required: true,
        style: {
          border: "border rounded-[6px]",
          padding: "p-2",
          outline: "outline-custom-secondarycolor",
        },
      },
      email: {
        enabled: true,
        placeholder: "بريدك الإلكتروني",
        required: true,
        style: {
          border: "border rounded-[6px]",
          padding: "p-2",
          outline: "outline-custom-secondarycolor",
        },
      },
      message: {
        enabled: true,
        placeholder: "رسالتك",
        required: true,
        rows: 2,
        style: {
          border: "border rounded",
          padding: "p-2",
          margin: "mb-[12px]",
          outline: "outline-custom-secondarycolor",
        },
      },
    },
    submitButton: {
      text: "إرسال",
      enabled: true,
      style: {
        background: "#10b981",
        textColor: "#ffffff",
        borderRadius: "rounded-[6px]",
        width: "w-full",
        padding: "py-2 md:py-1",
        fontSize: "text-[14px] md:text-[20px]",
        hover: "hover:scale-105 transition duration-300",
      },
    },
  },
  responsive: {
    breakpoints: {
      mobile: "768px",
      tablet: "1024px",
      desktop: "1280px",
    },
    layout: {
      socialSection: {
        mobile: "w-full",
        tablet: "w-full md:w-[35%]",
        desktop: "w-full md:w-[35%]",
      },
      formSection: {
        mobile: "w-full",
        tablet: "w-full md:w-[50%]",
        desktop: "w-full md:w-[50%]",
      },
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fadeIn",
      duration: 500,
      delay: 0,
    },
    socialLinks: {
      enabled: true,
      type: "fadeInUp",
      duration: 400,
      delay: 100,
      stagger: 50,
    },
    form: {
      enabled: true,
      type: "fadeInUp",
      duration: 600,
      delay: 200,
    },
  },
});

// Contact form section functions
export const contactFormSectionFunctions = {
  // Get default data
  getDefaultData: getDefaultContactFormSectionData,

  // Create new contact form section data
  createNew: (): ComponentData => getDefaultContactFormSectionData(),

  // Ensure variant exists in store
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (!state.contactFormSectionStates) {
      state.contactFormSectionStates = {};
    }

    if (!state.contactFormSectionStates[variantId]) {
      const defaultData = getDefaultContactFormSectionData();
      const data: ComponentData = initial || defaultData;
      state.contactFormSectionStates[variantId] = data;
    }

    return {
      contactFormSectionStates: {
        ...state.contactFormSectionStates,
        [variantId]: state.contactFormSectionStates[variantId],
      },
    };
  },

  // Get data for variant
  getData: (state: any, variantId: string): ComponentData => {
    const data = state.contactFormSectionStates?.[variantId];
    if (!data || Object.keys(data).length === 0) {
      return getDefaultContactFormSectionData();
    }
    return data;
  },

  // Set data for variant
  setData: (state: any, variantId: string, data: ComponentData) => {
    return {
      contactFormSectionStates: {
        ...state.contactFormSectionStates,
        [variantId]: data,
      },
    };
  },

  // Update data by path
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const currentData =
      state.contactFormSectionStates?.[variantId] ||
      getDefaultContactFormSectionData();

    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    const newData: any = { ...currentData };
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

    return {
      contactFormSectionStates: {
        ...state.contactFormSectionStates,
        [variantId]: newData,
      },
    };
  },

  // Update contact form section data
  update: (
    currentData: ComponentData,
    updates: Partial<ComponentData>,
  ): ComponentData => ({
    ...currentData,
    ...updates,
  }),

  // Add new social link
  addSocialLink: (
    currentData: ComponentData,
    socialLink: any,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: [...(currentData.content?.socialLinks || []), socialLink],
    },
  }),

  // Remove social link
  removeSocialLink: (
    currentData: ComponentData,
    index: number,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: (currentData.content?.socialLinks || []).filter(
        (_, i) => i !== index,
      ),
    },
  }),

  // Update social link
  updateSocialLink: (
    currentData: ComponentData,
    index: number,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      socialLinks: (currentData.content?.socialLinks || []).map((link, i) =>
        i === index ? { ...link, ...updates } : link,
      ),
    },
  }),

  // Update form field
  updateFormField: (
    currentData: ComponentData,
    fieldName: string,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    form: {
      ...currentData.form,
      fields: {
        ...currentData.form?.fields,
        [fieldName]: {
          ...currentData.form?.fields?.[fieldName],
          ...updates,
        },
      },
    },
  }),

  // Update submit button
  updateSubmitButton: (
    currentData: ComponentData,
    updates: any,
  ): ComponentData => ({
    ...currentData,
    form: {
      ...currentData.form,
      submitButton: {
        ...currentData.form?.submitButton,
        ...updates,
      },
    },
  }),

  // Update title
  updateTitle: (currentData: ComponentData, updates: any): ComponentData => ({
    ...currentData,
    content: {
      ...currentData.content,
      title: {
        ...currentData.content?.title,
        ...updates,
      },
    },
  }),

  // Update animations
  updateAnimations: (
    currentData: ComponentData,
    animations: any,
  ): ComponentData => ({
    ...currentData,
    animations: {
      ...currentData.animations,
      ...animations,
    },
  }),

  // Update responsive settings
  updateResponsive: (
    currentData: ComponentData,
    responsive: any,
  ): ComponentData => ({
    ...currentData,
    responsive: {
      ...currentData.responsive,
      ...responsive,
    },
  }),

  // Validate contact form data
  validate: (data: ComponentData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.content?.title?.text) {
      errors.push("Title is required");
    }

    if (!data.content?.socialLinks || data.content.socialLinks.length === 0) {
      errors.push("At least one social link is required");
    }

    if (data.content?.socialLinks) {
      data.content.socialLinks.forEach((link: any, index: number) => {
        if (!link.href) {
          errors.push(`Social link ${index + 1} is missing URL`);
        }
        if (!link.text) {
          errors.push(`Social link ${index + 1} is missing display text`);
        }
        if (!link.alt) {
          errors.push(`Social link ${index + 1} is missing platform type`);
        }
      });
    }

    if (!data.form?.submitButton?.text) {
      errors.push("Submit button text is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Get form field configuration
  getFormFieldConfig: (data: ComponentData, fieldName: string) => {
    return (
      data.form?.fields?.[fieldName] || {
        enabled: false,
        placeholder: "",
        required: false,
        style: {
          border: "border rounded-[6px]",
          padding: "p-2",
          outline: "outline-custom-secondarycolor",
        },
      }
    );
  },

  // Get social link by platform
  getSocialLinkByPlatform: (data: ComponentData, platform: string) => {
    return data.content?.socialLinks?.find(
      (link: any) => link.alt === platform,
    );
  },

  // Update layout settings
  updateLayout: (currentData: ComponentData, layout: any): ComponentData => ({
    ...currentData,
    layout: {
      ...currentData.layout,
      ...layout,
    },
  }),
};
