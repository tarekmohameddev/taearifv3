"use client";

import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // إضافة CSS لضمان RTL
    const style = document.createElement('style');
    style.id = 'dashboard-rtl-styles';
    style.textContent = `
      html {
        direction: rtl !important;
      }
      body {
        direction: rtl !important;
      }
      * {
        direction: rtl !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log("🔄 Dashboard Layout: Applied RTL styling");
    
    // تنظيف عند الخروج من المجلد
    return () => {
      // إزالة الـ CSS
      const styleElement = document.getElementById('dashboard-rtl-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      console.log("🔄 Dashboard Layout: Removed RTL styling");
    };
  }, []);

  return (
    <div dir="rtl" style={{ direction: 'rtl' }}>
      {children}
    </div>
  );
}
