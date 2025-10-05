import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { ReCaptchaWrapper } from "@/components/ReCaptchaWrapper";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const pathname = headersList.get("x-pathname") || "";
  const locale = headersList.get("x-locale") || "";

  // إعادة التوجيه من الإنجليزية إلى العربية (استثناء live-editor)
  if (locale === "en" && pathname !== "/live-editor" && !pathname.startsWith("/live-editor/")) {
    redirect(`/ar${pathname}`);
  }

  // تحديد الصفحات المسموح بها لـ GTM و Clarity
  const allowedPages = [
    "/dashboard",
    "/live-editor", 
    "/login",
    "/register",
    "/", // الصفحة الرئيسية للشركة
    "/about-us",
    "/solutions",
    "/updates",
    "/landing"
  ];

  // تحديد الصفحات التي يجب أن تظهر فيها ReCaptcha
  const recaptchaPages = [
    "/dashboard/affiliate",
    "/dashboard/analytics", 
    "/dashboard/apps",
    "/dashboard/blog",
    "/dashboard/blogs",
    "/dashboard/content",
    "/dashboard/crm",
    "/dashboard/customers",
    "/dashboard/forgot-password",
    "/dashboard/marketing",
    "/dashboard/messages",
    "/dashboard/projects",
    "/dashboard/properties",
    "/dashboard/property-requests",
    "/dashboard/purchase-management",
    "/dashboard/rental-management",
    "/dashboard/reset",
    "/dashboard/settings",
    "/dashboard/templates",
    "/dashboard/whatsapp-ai",
    "/dashboard",
    "/register",
    "/login",
    "/live-editor",
    "/oauth/token/success",
    "/oauth/social/extra-info",
    "/onboarding"
  ];

  // التحقق من أن الصفحة مسموح بها وليس هناك subdomain
  const shouldLoadAnalytics = !tenantId && allowedPages.some(page => 
    pathname === page || pathname.startsWith(page + "/")
  );

  // التحقق من أن الصفحة تحتاج ReCaptcha (مع مراعاة locale)
  const shouldLoadReCaptcha = recaptchaPages.some(page => {
    // التحقق من المسار المباشر
    if (pathname === page || pathname.startsWith(page + "/")) {
      return true;
    }
    // التحقق من المسارات مع locale (مثل /en/live-editor, /ar/dashboard)
    const localePattern = /^\/(en|ar)\/(.+)$/;
    const match = pathname.match(localePattern);
    if (match) {
      const [, , pathWithoutLocale] = match;
      return pathWithoutLocale === page || pathWithoutLocale.startsWith(page + "/");
    }
    return false;
  });

  return (
    <html lang="ar" dir="ltr" className="light" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KBL37C9T');`,
            }}
          />
        )}
        {/* End Google Tag Manager */}

        {/* Microsoft Clarity - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "ppln6ugd3t");
              `,
            }}
          />
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript) - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KBL37C9T"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster />
          {shouldLoadReCaptcha ? (
            <ReCaptchaWrapper>
              <ClientLayout>{children}</ClientLayout>
            </ReCaptchaWrapper>
          ) : (
            <ClientLayout>{children}</ClientLayout>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
