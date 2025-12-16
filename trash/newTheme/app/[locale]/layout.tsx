// src/app/[locale]/layout.tsx

import React from "react";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "../I18nProvider";
import { AuthProvider } from "../../context/AuthContext";
import ClientLayout from "./ClientLayout";

// Define the props type
interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // Await the params before using them
  const { locale } = await params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "light", "system"]}
        >
          <I18nProvider locale={locale}>
            <AuthProvider>
              <ClientLayout>{children}</ClientLayout>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
