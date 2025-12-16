// src/app/layout.tsx

import "@/styles/globals.css";
import React from "react";

// This root layout no longer needs to render <html> or <body>.
// It just passes children through.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
