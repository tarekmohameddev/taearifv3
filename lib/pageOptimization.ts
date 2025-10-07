// ملف تحسين الصفحات - يجعل مكونات Taearif static
export const optimizeTaearifComponents = () => {
  // إعدادات تحسين لمكونات Taearif
  return {
    // تحسين cache للمكونات الثابتة
    staticComponents: {
      TaearifLandingPageSimple: {
        cache: "public, max-age=31536000, immutable",
        preload: true,
        static: true,
      },
      TaearifUpdatesPage: {
        cache: "public, max-age=31536000, immutable",
        preload: true,
        static: true,
      },
      SolutionsPage: {
        cache: "public, max-age=31536000, immutable",
        preload: true,
        static: true,
      },
      LandingPage: {
        cache: "public, max-age=31536000, immutable",
        preload: true,
        static: true,
      },
      AboutUsPage: {
        cache: "public, max-age=31536000, immutable",
        preload: true,
        static: true,
      },
    },

    // تحسين الأداء للصفحات
    pageOptimization: {
      // الصفحات تبقى dynamic للتحقق من tenantId
      pages: {
        "/": "dynamic",
        "/solutions": "dynamic",
        "/updates": "dynamic",
        "/landing": "dynamic",
        "/about-us": "dynamic",
      },

      // المكونات تصبح static
      components: {
        TaearifLandingPageSimple: "static",
        TaearifUpdatesPage: "static",
        SolutionsPage: "static",
        LandingPage: "static",
        AboutUsPage: "static",
      },
    },
  };
};

// دالة لتحسين تحميل المكونات
export const preloadTaearifComponents = async () => {
  const components = [
    "TaearifLandingPageSimple",
    "TaearifUpdatesPage",
    "SolutionsPage",
    "LandingPage",
    "AboutUsPage",
  ];

  // تحميل المكونات مسبقاً
  const preloadPromises = components.map(async (component) => {
    try {
      // محاولة تحميل المكون من cache
      const cached = localStorage.getItem(`component_${component}`);
      if (cached) {
        return JSON.parse(cached);
      }

      // إذا لم يكن في cache، تحميله
      const module = await import(`@/components/${component}`);
      localStorage.setItem(
        `component_${component}`,
        JSON.stringify({
          component: module.default,
          timestamp: Date.now(),
        }),
      );

      return module.default;
    } catch (error) {
      console.warn(`Failed to preload ${component}:`, error);
      return null;
    }
  });

  return Promise.all(preloadPromises);
};

// دالة لتحسين cache headers
export const getOptimizedCacheHeaders = (componentName: string) => {
  const staticComponents = [
    "TaearifLandingPageSimple",
    "TaearifUpdatesPage",
    "SolutionsPage",
    "LandingPage",
    "AboutUsPage",
  ];

  if (staticComponents.includes(componentName)) {
    return {
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Component-Type": "static",
    };
  }

  return {
    "Cache-Control": "public, max-age=3600",
    "X-Component-Type": "dynamic",
  };
};
