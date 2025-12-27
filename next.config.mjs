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
    // تعطيل الميزات التجريبية صراحة لمنع تعليق البناء
    optimizeCss: false, // معطل - يسبب تعليق البناء
    scrollRestoration: false, // معطل - يسبب تعليق البناء
  },
  // تحسينات للأداء
  compiler: {
    // تعطيل removeConsole مؤقتاً لتجنب مشاكل البناء
    // removeConsole: process.env.NODE_ENV === "production" ? {
    //   exclude: ["error", "warn"], // احتفظ بالأخطاء والتحذيرات
    // } : false,
  },
  // تحسين cache
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // إزالة standalone output - يسبب تعليق البناء على Windows
  // output: process.env.VERCEL ? undefined : process.platform === "win32" ? undefined : "standalone",
  // إعدادات Turbopack (Next.js 16)
  // إضافة turbopack فارغة لإيقاف تحذير webpack config
  turbopack: {},
};

// إضافة webpack config فقط عند استخدام --webpack flag
// استخدم: npm run build:webpack
if (process.env.NEXT_BUILD_WEBPACK === "true") {
  nextConfig.webpack = (config, { isServer }) => {
    // استبعاد مجلدات كبيرة من المراقبة والبناء
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        ...(Array.isArray(config.watchOptions?.ignored)
          ? config.watchOptions.ignored
          : config.watchOptions?.ignored
            ? [config.watchOptions.ignored]
            : []),
        "**/node_modules/**",
        "**/.next/**",
        "**/trash/**",
        "**/docs/**",
        "**/out/**",
        "**/build/**",
      ],
    };

    // تعديل القواعد الموجودة لاستبعاد هذه المجلدات
    if (config.module?.rules) {
      config.module.rules.forEach((rule) => {
        if (rule && typeof rule === "object" && !Array.isArray(rule)) {
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
            if (!rule.exclude.some((ex) => ex?.toString().includes("node_modules"))) {
              rule.exclude.push(/node_modules/);
            }
          }
        }
      });
    }

    return config;
  };
}

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