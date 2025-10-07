// ملف تكوين خاص لتحسين البناء للصفحات الثابتة
module.exports = {
  // صفحات Taearif التي يجب أن تكون ثابتة
  staticPages: ["/", "/solutions", "/updates", "/landing", "/about-us"],

  // إعدادات تحسين الأداء
  performance: {
    // تحسين البناء للصفحات الثابتة
    staticGeneration: {
      enabled: true,
      timeout: 1000,
      revalidate: false,
    },

    // تحسين cache
    caching: {
      staticPages: "public, max-age=31536000, immutable",
      dynamicPages: "public, max-age=3600",
    },
  },

  // إعدادات البناء
  build: {
    // تحسين حجم البناء
    optimize: true,
    // تحسين الأداء
    performance: true,
    // تحسين cache
    cache: true,
  },
};
