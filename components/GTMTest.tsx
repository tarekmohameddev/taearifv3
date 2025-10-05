"use client";

import { useEffect, useState } from "react";
import { trackEvent, trackPageView } from "@/lib/gtm";

export function GTMTest() {
  const [gtmStatus, setGtmStatus] = useState<string>("Checking...");

  useEffect(() => {
    // Check if GTM is loaded
    const checkGTM = () => {
      if (typeof window !== "undefined") {
        if (window.dataLayer && window.gtag) {
          setGtmStatus("✅ GTM is loaded and ready!");
          
          // Test page view tracking
          trackPageView("/test", "GTM Test Page");
          
          // Test event tracking
          trackEvent("gtm_test", {
            test_type: "component_load",
            timestamp: new Date().toISOString(),
          });
        } else if (window.dataLayer) {
          setGtmStatus("⚠️ DataLayer exists but gtag not ready");
        } else {
          setGtmStatus("❌ GTM not detected");
        }
      }
    };

    // Check immediately
    checkGTM();

    // Check again after a short delay
    const timeout = setTimeout(checkGTM, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  const testEvent = () => {
    trackEvent("button_click", {
      button_name: "gtm_test_button",
      page: "gtm_test",
    });
    alert("Test event sent! Check your GTM container.");
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">GTM Status</h3>
      <p className="text-xs mb-3">{gtmStatus}</p>
      
      <div className="space-y-2">
        <button
          onClick={testEvent}
          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
        >
          Test Event
        </button>
        
        <div className="text-xs text-gray-600">
          <p>Container: GTM-KBL37C9T</p>
          <p>Check Tag Assistant for verification</p>
        </div>
      </div>
    </div>
  );
}
