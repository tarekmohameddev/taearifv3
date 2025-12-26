let userConfig = undefined;
try {
  userConfig = await import("./v0-user-next.config");
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // في Next.js 16، Turbopack هو الافتراضي
    // تحسينات للأداء
    optimizeCss: true,
    scrollRestoration: true,
  },
  // تحسينات للأداء
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // تحسين cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // تحسين البناء للصفحات الثابتة - معالجة مشكلة symlink على Windows
  output: process.platform === "win32" ? undefined : "standalone",
  // استبعاد مجلدات trash و docs من البناء
  webpack: (config, { isServer }) => {
    // استبعاد مجلدات trash و docs من المراقبة أثناء التطوير
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored)
          ? config.watchOptions.ignored
          : config.watchOptions?.ignored
            ? [config.watchOptions.ignored]
            : []),
        "**/trash/**",
        "**/docs/**",
        "**/README.md",
      ],
    };

    // تعديل القواعد الموجودة لاستبعاد هذه المجلدات
    if (config.module?.rules) {
      config.module.rules.forEach((rule) => {
        if (rule && typeof rule === "object" && !Array.isArray(rule)) {
          // إضافة exclude للقواعد الموجودة
          if (rule.test && !rule.exclude) {
            rule.exclude = [];
          }
          if (rule.exclude && Array.isArray(rule.exclude)) {
            if (!rule.exclude.some((ex) => ex?.toString().includes("trash"))) {
              rule.exclude.push(/trash/);
            }
            if (!rule.exclude.some((ex) => ex?.toString().includes("docs"))) {
              rule.exclude.push(/docs/);
            }
            // استبعاد ملفات README.md
            if (!rule.exclude.some((ex) => ex?.toString().includes("README"))) {
              rule.exclude.push(/README\.md$/);
            }
          }
        }
      });
    }

    // إضافة قاعدة جديدة لاستبعاد ملفات README.md من المعالجة
    // إرجاع module فارغ عند محاولة استيراد README.md
    config.module.rules.push({
      test: /README\.md$/,
      type: "asset/source",
    });

    return config;
  },
  // إعدادات Turbopack (Next.js 16)
  // إضافة turbopack فارغة لإيقاف تحذير webpack config
  turbopack: {},
};

mergeConfig(nextConfig, userConfig);

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return;
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      };
    } else {
      nextConfig[key] = userConfig[key];
    }
  }
}

export default nextConfig;
