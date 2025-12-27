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
  // Vercel لا يحتاج إلى standalone output - هذا قد يسبب تعليق البناء
  output: process.env.VERCEL ? undefined : process.platform === "win32" ? undefined : "standalone",
};

// إضافة webpack config فقط عند الحاجة (للتطوير المحلي مع webpack)
// ملاحظة: في Next.js 16 مع Turbopack (الافتراضي على Vercel)، webpack config لا يُستخدم
if (process.env.NEXT_BUILD_WEBPACK === "true") {
  nextConfig.webpack = (config, { isServer }) => {
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
