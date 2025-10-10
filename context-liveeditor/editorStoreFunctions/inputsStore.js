// Store functions for inputs component
// دوال الـ store لمكون inputs

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper function to get component data from store
export const getInputsData = (store, variantId = "inputs1") => {
  const componentData = store.componentStates?.inputs?.[variantId];
  if (componentData && Object.keys(componentData).length > 0) {
    return componentData;
  }
  return defaultInputsData;
};

// Helper function to set component data in store
export const setInputsData = (store, variantId = "inputs1", data) => {
  return {
    componentStates: {
      ...store.componentStates,
      inputs: {
        ...store.componentStates?.inputs,
        [variantId]: data,
      },
    },
  };
};

// Helper function to update component data by path
export const updateInputsByPath = (
  store,
  variantId = "inputs1",
  path,
  value,
) => {
  const currentData = getInputsData(store, variantId);
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  let newData = { ...currentData };
  let cursor = newData;

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i];
    if (!cursor[key]) {
      cursor[key] = {};
    }
    cursor = cursor[key];
  }

  const lastKey = segments[segments.length - 1];
  cursor[lastKey] = value;

  return setInputsData(store, variantId, newData);
};

// Helper function to add new card
export const addInputsCard = (store, variantId = "inputs1", cardData) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: [...(currentData.cards || []), cardData],
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to remove card
export const removeInputsCard = (store, variantId = "inputs1", cardId) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: (currentData.cards || []).filter((card) => card.id !== cardId),
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to add new field to card
export const addInputsField = (
  store,
  variantId = "inputs1",
  cardId,
  fieldData,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: (currentData.cards || []).map((card) =>
      card.id === cardId
        ? { ...card, fields: [...(card.fields || []), fieldData] }
        : card,
    ),
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to remove field from card
export const removeInputsField = (
  store,
  variantId = "inputs1",
  cardId,
  fieldId,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: (currentData.cards || []).map((card) =>
      card.id === cardId
        ? {
            ...card,
            fields: (card.fields || []).filter((field) => field.id !== fieldId),
          }
        : card,
    ),
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to update field in card
export const updateInputsField = (
  store,
  variantId = "inputs1",
  cardId,
  fieldId,
  fieldData,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: (currentData.cards || []).map((card) =>
      card.id === cardId
        ? {
            ...card,
            fields: (card.fields || []).map((field) =>
              field.id === fieldId ? { ...field, ...fieldData } : field,
            ),
          }
        : card,
    ),
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to update card
export const updateInputsCard = (
  store,
  variantId = "inputs1",
  cardId,
  cardData,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    cards: (currentData.cards || []).map((card) =>
      card.id === cardId ? { ...card, ...cardData } : card,
    ),
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to get all cards
export const getInputsCards = (store, variantId = "inputs1") => {
  const currentData = getInputsData(store, variantId);
  return currentData.cards || [];
};

// Helper function to get card by id
export const getInputsCard = (store, variantId = "inputs1", cardId) => {
  const currentData = getInputsData(store, variantId);
  return (currentData.cards || []).find((card) => card.id === cardId);
};

// Helper function to get fields for a card
export const getInputsCardFields = (store, variantId = "inputs1", cardId) => {
  const card = getInputsCard(store, variantId, cardId);
  return card?.fields || [];
};

// Helper function to get field by id
export const getInputsField = (
  store,
  variantId = "inputs1",
  cardId,
  fieldId,
) => {
  const fields = getInputsCardFields(store, variantId, cardId);
  return fields.find((field) => field.id === fieldId);
};

// Helper function to get theme
export const getInputsTheme = (store, variantId = "inputs1") => {
  const currentData = getInputsData(store, variantId);
  return currentData.theme || {};
};

// Helper function to update theme
export const updateInputsTheme = (store, variantId = "inputs1", themeData) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    theme: { ...currentData.theme, ...themeData },
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to get submit button settings
export const getInputsSubmitButton = (store, variantId = "inputs1") => {
  const currentData = getInputsData(store, variantId);
  return currentData.submitButton || {};
};

// Helper function to update submit button settings
export const updateInputsSubmitButton = (
  store,
  variantId = "inputs1",
  submitButtonData,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    submitButton: { ...currentData.submitButton, ...submitButtonData },
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to get layout settings
export const getInputsLayout = (store, variantId = "inputs1") => {
  const currentData = getInputsData(store, variantId);
  return currentData.layout || {};
};

// Helper function to update layout settings
export const updateInputsLayout = (
  store,
  variantId = "inputs1",
  layoutData,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    layout: { ...currentData.layout, ...layoutData },
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to get visibility setting
export const getInputsVisibility = (store, variantId = "inputs1") => {
  const currentData = getInputsData(store, variantId);
  return currentData.visible !== false;
};

// Helper function to update visibility setting
export const updateInputsVisibility = (
  store,
  variantId = "inputs1",
  visible,
) => {
  const currentData = getInputsData(store, variantId);
  const newData = {
    ...currentData,
    visible,
  };
  return setInputsData(store, variantId, newData);
};

// Helper function to reset to default data
export const resetInputsData = (store, variantId = "inputs1") => {
  return setInputsData(store, variantId, defaultInputsData);
};

// Helper function to get all data
export const getAllInputsData = (store, variantId = "inputs1") => {
  return getInputsData(store, variantId);
};

// Helper function to set all data
export const setAllInputsData = (store, variantId = "inputs1", data) => {
  return setInputsData(store, variantId, data);
};

// Default data for inputs component
const defaultInputsData = {
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "max-w-7xl",
    containerPadding: "p-4",
    cardsSpacing: "space-y-8",
  },
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#2563eb",
    accentColor: "#1d4ed8",
    submitButtonGradient: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  },
  submitButton: {
    show: true,
    text: "حفظ جميع البيانات",
    style: {
      className:
        "px-8 py-4 text-white rounded-xl transition-all duration-300 flex items-center space-x-2 rtl:space-x-reverse font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed",
      padding: "px-8 py-4",
      borderRadius: "rounded-xl",
      fontWeight: "font-bold",
      fontSize: "text-lg",
      shadow: "shadow-lg hover:shadow-xl",
    },
    animation: {
      enabled: true,
      type: "gradient-shift",
      duration: 3,
      delay: 0,
    },
  },
  cards: [
    {
      id: "expenses",
      title: "إدارة المصاريف",
      description: "تتبع وإدارة جميع المصاريف الشهرية",
      icon: {
        type: "DollarSign",
        size: 24,
      },
      color: "blue",
      customColors: {
        primary: "#3b82f6",
        secondary: "#2563eb",
        hover: "#1d4ed8",
        shadow: "rgba(59, 130, 246, 0.15)",
      },
      isCollapsible: true,
      showAddButton: true,
      addButtonText: "إضافة مصروف جديد",
      fields: [
        {
          id: "expense_type",
          type: "select",
          label: "نوع المصروف",
          required: true,
          options: [
            { value: "rent", label: "إيجار" },
            { value: "utilities", label: "مرافق" },
            { value: "maintenance", label: "صيانة" },
            { value: "other", label: "أخرى" },
          ],
          icon: {
            type: "Tag",
            size: 20,
          },
        },
        {
          id: "expense_amount",
          type: "currency",
          label: "المبلغ",
          placeholder: "أدخل المبلغ",
          required: true,
          validation: {
            min: 0,
            message: "المبلغ يجب أن يكون أكبر من صفر",
          },
          icon: {
            type: "DollarSign",
            size: 20,
          },
        },
        {
          id: "expense_date",
          type: "date",
          label: "تاريخ المصروف",
          required: true,
          icon: {
            type: "Calendar",
            size: 20,
          },
        },
        {
          id: "expense_description",
          type: "textarea",
          label: "وصف المصروف",
          placeholder: "أدخل وصف مفصل للمصروف",
          icon: {
            type: "FileText",
            size: 20,
          },
        },
      ],
    },
    {
      id: "property_info",
      title: "معلومات العقار",
      description: "البيانات الأساسية للعقار",
      icon: {
        type: "Building",
        size: 24,
      },
      color: "indigo",
      customColors: {
        primary: "#6366f1",
        secondary: "#4f46e5",
        hover: "#4338ca",
        shadow: "rgba(99, 102, 241, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "property_name",
          type: "text",
          label: "اسم العقار",
          placeholder: "أدخل اسم العقار",
          required: true,
          icon: {
            type: "Building",
            size: 20,
          },
        },
        {
          id: "property_address",
          type: "textarea",
          label: "عنوان العقار",
          placeholder: "أدخل العنوان الكامل",
          required: true,
        },
        {
          id: "property_type",
          type: "select",
          label: "نوع العقار",
          required: true,
          options: [
            { value: "apartment", label: "شقة" },
            { value: "villa", label: "فيلا" },
            { value: "office", label: "مكتب" },
            { value: "shop", label: "محل" },
          ],
        },
        {
          id: "property_size",
          type: "number",
          label: "المساحة (م²)",
          placeholder: "أدخل المساحة",
          required: true,
          validation: {
            min: 1,
            message: "المساحة يجب أن تكون أكبر من صفر",
          },
        },
        {
          id: "property_price",
          type: "currency",
          label: "سعر العقار",
          placeholder: "أدخل السعر",
          required: true,
          validation: {
            min: 0,
            message: "السعر يجب أن يكون أكبر من صفر",
          },
          icon: {
            type: "DollarSign",
            size: 20,
          },
        },
      ],
    },
    {
      id: "contact_info",
      title: "معلومات الاتصال",
      description: "بيانات التواصل مع المالك أو المستأجر",
      icon: {
        type: "User",
        size: 24,
      },
      color: "purple",
      customColors: {
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        hover: "#6d28d9",
        shadow: "rgba(139, 92, 246, 0.15)",
      },
      isCollapsible: false,
      fields: [
        {
          id: "contact_name",
          type: "text",
          label: "الاسم",
          placeholder: "أدخل الاسم الكامل",
          required: true,
          icon: {
            type: "User",
            size: 20,
          },
        },
        {
          id: "contact_phone",
          type: "text",
          label: "رقم الهاتف",
          placeholder: "أدخل رقم الهاتف",
          required: true,
          validation: {
            pattern: "^[0-9+\\-\\s()]+$",
            message: "رقم الهاتف غير صحيح",
          },
          icon: {
            type: "Phone",
            size: 20,
          },
        },
        {
          id: "contact_email",
          type: "email",
          label: "البريد الإلكتروني",
          placeholder: "أدخل البريد الإلكتروني",
          required: true,
          icon: {
            type: "Mail",
            size: 20,
          },
        },
        {
          id: "contact_password",
          type: "password",
          label: "كلمة المرور",
          placeholder: "أدخل كلمة المرور",
          required: true,
          validation: {
            min: 6,
            message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          },
        },
      ],
    },
    {
      id: "payment_method",
      title: "طريقة الدفع",
      description: "اختر طريقة الدفع المفضلة",
      icon: {
        type: "CreditCard",
        size: 24,
      },
      color: "pink",
      customColors: {
        primary: "#ec4899",
        secondary: "#db2777",
        hover: "#be185d",
        shadow: "rgba(236, 72, 153, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "payment_type",
          type: "select",
          label: "نوع الدفع",
          required: true,
          options: [
            { value: "cash", label: "نقداً" },
            { value: "bank_transfer", label: "تحويل بنكي" },
            { value: "credit_card", label: "بطاقة ائتمان" },
            { value: "check", label: "شيك" },
          ],
          icon: {
            type: "CreditCard",
            size: 20,
          },
        },
        {
          id: "payment_notes",
          type: "textarea",
          label: "ملاحظات الدفع",
          placeholder: "أدخل أي ملاحظات إضافية",
          description: "هذا الحقل اختياري",
        },
      ],
    },
    {
      id: "additional_info",
      title: "معلومات إضافية",
      description: "بيانات إضافية ومهمة للعقار",
      icon: {
        type: "FileText",
        size: 24,
      },
      color: "emerald",
      customColors: {
        primary: "#10b981",
        secondary: "#059669",
        hover: "#047857",
        shadow: "rgba(16, 185, 129, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "notes",
          type: "textarea",
          label: "ملاحظات إضافية",
          placeholder: "أدخل أي ملاحظات إضافية",
          description: "هذا الحقل اختياري",
        },
        {
          id: "priority",
          type: "select",
          label: "الأولوية",
          required: true,
          options: [
            { value: "high", label: "عالية" },
            { value: "medium", label: "متوسطة" },
            { value: "low", label: "منخفضة" },
          ],
        },
      ],
    },
  ],
  cardStyle: {
    container: {
      className:
        "bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300",
      backgroundColor: "bg-white dark:bg-gray-800",
      borderRadius: "rounded-2xl",
      shadow: "shadow-lg",
      border: "border border-gray-200 dark:border-gray-700",
      transition: "transition-all duration-300",
    },
    header: {
      className: "p-6 text-white transition-all duration-300",
      padding: "p-6",
      textColor: "text-white",
      transition: "transition-all duration-300",
    },
    content: {
      className: "p-6",
      padding: "p-6",
      grid: {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        gap: "gap-6",
        columns: {
          mobile: "grid-cols-1",
          tablet: "md:grid-cols-2",
          desktop: "lg:grid-cols-3",
        },
      },
    },
  },
  inputStyle: {
    container: {
      className: "relative",
    },
    label: {
      className:
        "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
      fontSize: "text-sm",
      fontWeight: "font-medium",
      color: "text-gray-700 dark:text-gray-300",
      marginBottom: "mb-2",
    },
    input: {
      className:
        "w-full px-4 py-3 pr-10 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white border-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
      padding: "px-4 py-3 pr-10",
      borderRadius: "rounded-xl",
      transition: "transition-all duration-300",
      focus:
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      darkMode: "dark:bg-gray-800 dark:border-gray-600 dark:text-white",
      hover: "hover:border-gray-400 dark:hover:border-gray-500",
    },
    error: {
      className: "border-red-500 bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-500",
      backgroundColor: "bg-red-50 dark:bg-red-900/20",
    },
    errorMessage: {
      className: "flex items-center mt-2 text-red-500 text-sm",
      color: "text-red-500",
      fontSize: "text-sm",
      marginTop: "mt-2",
    },
  },
  animations: {
    card: {
      enabled: true,
      type: "fade-up",
      duration: 400,
      delay: 0,
      stagger: 100,
    },
    fields: {
      enabled: true,
      type: "fade-up",
      duration: 300,
      delay: 0,
      stagger: 50,
    },
    submitButton: {
      enabled: true,
      type: "fade-up",
      duration: 500,
      delay: 500,
    },
  },
  responsive: {
    mobile: {
      containerPadding: "p-4",
      cardsSpacing: "space-y-6",
      gridColumns: "grid-cols-1",
      cardPadding: "p-4",
    },
    tablet: {
      containerPadding: "md:p-6",
      cardsSpacing: "md:space-y-8",
      gridColumns: "md:grid-cols-2",
      cardPadding: "md:p-6",
    },
    desktop: {
      containerPadding: "lg:p-8",
      cardsSpacing: "lg:space-y-10",
      gridColumns: "lg:grid-cols-3",
      cardPadding: "lg:p-8",
    },
  },
  colors: {
    background: "#f9fafb",
    cardBackground: "#ffffff",
    textPrimary: "#111827",
    textSecondary: "#6b7280",
    borderColor: "#e5e7eb",
    focusColor: "#3b82f6",
    errorColor: "#ef4444",
    successColor: "#10b981",
  },
};

// Zustand store for inputs component
export const useInputsStore = create(
  persist(
    (set, get) => ({
      // State
      inputsData: defaultInputsData,

      // Actions
      updateInputsData: (newData) => {
        set((state) => ({
          inputsData: { ...state.inputsData, ...newData },
        }));
      },

      updateInputsField: (fieldPath, value) => {
        set((state) => {
          const newData = { ...state.inputsData };
          const keys = fieldPath.split(".");
          let current = newData;

          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }

          current[keys[keys.length - 1]] = value;

          return { inputsData: newData };
        });
      },

      addCard: (cardData) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: [...state.inputsData.cards, cardData],
          },
        }));
      },

      updateCard: (cardId, cardData) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: state.inputsData.cards.map((card) =>
              card.id === cardId ? { ...card, ...cardData } : card,
            ),
          },
        }));
      },

      removeCard: (cardId) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: state.inputsData.cards.filter((card) => card.id !== cardId),
          },
        }));
      },

      addField: (cardId, fieldData) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: state.inputsData.cards.map((card) =>
              card.id === cardId
                ? { ...card, fields: [...card.fields, fieldData] }
                : card,
            ),
          },
        }));
      },

      updateField: (cardId, fieldId, fieldData) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: state.inputsData.cards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    fields: card.fields.map((field) =>
                      field.id === fieldId ? { ...field, ...fieldData } : field,
                    ),
                  }
                : card,
            ),
          },
        }));
      },

      removeField: (cardId, fieldId) => {
        set((state) => ({
          inputsData: {
            ...state.inputsData,
            cards: state.inputsData.cards.map((card) =>
              card.id === cardId
                ? {
                    ...card,
                    fields: card.fields.filter((field) => field.id !== fieldId),
                  }
                : card,
            ),
          },
        }));
      },

      resetInputsData: () => {
        set({ inputsData: defaultInputsData });
      },

      // Getters
      getInputsData: () => get().inputsData,
      getCardById: (cardId) => {
        const { inputsData } = get();
        return inputsData.cards.find((card) => card.id === cardId);
      },
      getFieldById: (cardId, fieldId) => {
        const { inputsData } = get();
        const card = inputsData.cards.find((card) => card.id === cardId);
        return card?.fields.find((field) => field.id === fieldId);
      },
    }),
    {
      name: "inputs-store",
      version: 1,
    },
  ),
);

// Export default data for external use
export { defaultInputsData };
