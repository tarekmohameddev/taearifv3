"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontFamily: "inherit",
        },
        // Success toast
        success: {
          duration: 4000,
          style: {
            background: "hsl(142.1 76.2% 36.3%)",
            color: "white",
            border: "1px solid hsl(142.1 70.6% 45.3%)",
          },
          iconTheme: {
            primary: "white",
            secondary: "hsl(142.1 76.2% 36.3%)",
          },
        },
        // Error toast
        error: {
          duration: 6000,
          style: {
            background: "hsl(0 84.2% 60.2%)",
            color: "white",
            border: "1px solid hsl(0 72.2% 50.6%)",
          },
          iconTheme: {
            primary: "white",
            secondary: "hsl(0 84.2% 60.2%)",
          },
        },
        // Loading toast
        loading: {
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        },
      }}
    />
  );
}
