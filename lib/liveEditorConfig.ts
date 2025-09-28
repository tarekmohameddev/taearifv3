// lib/liveEditorConfig.ts - إعدادات Live Editor
export const liveEditorConfig = {
  // إعدادات المكونات المتاحة
  availableComponents: [
    {
      id: "hero",
      name: "Hero Section",
      description: "قسم البطل الرئيسي",
      icon: "🎯",
      category: "layout"
    },
    {
      id: "header",
      name: "Header",
      description: "رأس الصفحة",
      icon: "📋",
      category: "navigation"
    },
    {
      id: "footer",
      name: "Footer",
      description: "تذييل الصفحة",
      icon: "📄",
      category: "navigation"
    },
    {
      id: "halfTextHalfImage",
      name: "Half Text Half Image",
      description: "نص وصورة جنباً إلى جنب",
      icon: "🖼️",
      category: "content"
    },
    {
      id: "propertySlider",
      name: "Property Slider",
      description: "عرض العقارات",
      icon: "🏠",
      category: "properties"
    },
    {
      id: "testimonials",
      name: "Testimonials",
      description: "الشهادات",
      icon: "💬",
      category: "content"
    }
  ],

  // إعدادات التخطيط
  layout: {
    maxComponents: 50,
    defaultSpacing: "4",
    responsiveBreakpoints: {
      mobile: "768px",
      tablet: "1024px",
      desktop: "1280px"
    }
  },

  // إعدادات التحرير
  editing: {
    autoSave: true,
    autoSaveInterval: 30000, // 30 ثانية
    undoRedoLimit: 20,
    dragDropEnabled: true,
    resizeEnabled: true
  },

  // إعدادات التصدير
  export: {
    formats: ["html", "json"],
    includeStyles: true,
    includeScripts: true,
    minify: false
  }
};

export default liveEditorConfig;
