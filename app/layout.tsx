import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { ReCaptchaWrapper } from "@/components/ReCaptchaWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="ltr" className="light" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KBL37C9T');`,
          }}
        />
        {/* End Google Tag Manager */}
        
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
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KBL37C9T"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />
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
