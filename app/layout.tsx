import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { ReCaptchaWrapper } from "@/components/ReCaptchaWrapper";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const pathname = headersList.get("x-pathname") || "";

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

  // التحقق من أن الصفحة مسموح بها وليس هناك subdomain
  const shouldLoadAnalytics = !tenantId && allowedPages.some(page => 
    pathname === page || pathname.startsWith(page + "/")
  );

  return (
    <html lang="ar" dir="ltr" className="light" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager - فقط للصفحات المسموح بها وبدون subdomain */}
        {shouldLoadAnalytics && (
          <script
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
          <script
            type="text/javascript"
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
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBL37C9T"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        )}
        {/* End Google Tag Manager (noscript) */}

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster />
          <ReCaptchaWrapper>
            <ClientLayout>{children}</ClientLayout>
          </ReCaptchaWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
