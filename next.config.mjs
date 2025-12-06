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
