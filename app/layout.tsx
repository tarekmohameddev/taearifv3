"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import useAuthStore from "@/context/AuthContext";
import ClientLayout from "./ClientLayout";
import { Toaster } from "react-hot-toast";
import { ReCaptchaWrapper } from "@/components/ReCaptchaWrapper";
export default function RootLayout({ children }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const fetchUserData = useAuthStore((state) => state.fetchUserData);

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, [fetchUserData]);

  if (!isMounted) {
    return (
      <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body />
      </html>
    );
  }

  return (
    <html lang="ar" dir="rtl" className="light" suppressHydrationWarning>
      <head>
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
