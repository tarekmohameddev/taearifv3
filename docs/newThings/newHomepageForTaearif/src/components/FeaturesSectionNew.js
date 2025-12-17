"use client";

import { useState, useEffect } from "react";

export default function FeaturesSectionNew() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("features-new");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section
      id="features-new"
      className="py-20 bg-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            <span className="relative inline-block">
              <span className="relative z-10 text-black">
                مزايا قوية مصمّمة تخدم شغلك العقاري.
              </span>
              <span className="ui-e-headline-text ui-e-headline-stroke7">
                <span className="whitespace"></span>
                <span>
                  <span className="ui-e-headline-text ui-e-headline-highlighted relative z-10">
                    للعقارات
                  </span>
                  <span className="uicore-svg-wrapper">
                    <svg
                      className="absolute -bottom-10 left-0 w-full h-[25rem] text-[#FF8C24]"
                      viewBox="0 0 500 150"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M15.2,133.3L15.2,133.3c121.9-7.6,244-9.9,366.1-6.8c34.6,0.9,69.1,2.3,103.7,4"
                        stroke="currentColor"
                        strokeWidth="9"
                        fill="none"
                        className={`transition-all duration-2000 ${isVisible ? "opacity-100" : "opacity-0"}`}
                        style={{
                          strokeDasharray: isVisible ? "1500 1500" : "0 1500",
                          transition:
                            "stroke-dasharray 2s cubic-bezier(0.29, 1.11, 0.74, 1.04)",
                        }}
                      />
                    </svg>
                  </span>
                </span>
                <span className="whitespace"> </span>
              </span>
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="relative min-h-[600px]">
          {/* Central Monitor/Dashboard */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
              </svg>
            </div>
          </div>

          {/* Feature 1: CRM - Top Center */}
          <div
            className={`absolute top-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex flex-col items-center gap-4 p-4">
              <div className="w-16 h-16 bg-[#FF8C24] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <div className="max-w-xs text-center">
                <h4 className="text-sm font-semibold text-black">
                  نظام CRM ذكي يرتّب لك كل صفقة بخطوات واضحة ومنظمة.
                </h4>
              </div>
            </div>
          </div>

          {/* Feature 2: AI - Top Right */}
          <div
            className={`absolute top-20 right-10 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex flex-col items-end gap-4 p-4">
              <div className="w-16 h-16 bg-[#17BD37] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div className="max-w-xs text-right">
                <h4 className="text-sm font-semibold text-black">
                  الذكاء الصناعي يرد على عملاءك تلقائي ٢٤ ساعة باليوم.
                </h4>
              </div>
            </div>
          </div>

          {/* Feature 3: Website - Left */}
          <div
            className={`absolute top-1/2 left-10 transform -translate-y-1/2 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex flex-col items-start gap-4 p-4">
              <div className="w-16 h-16 bg-[#9C30FF] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="max-w-xs text-left">
                <h4 className="text-sm font-semibold text-black">
                  موقع عقارات احترافي — جاهز خلال دقائق.
                </h4>
              </div>
            </div>
          </div>

          {/* Feature 4: WhatsApp - Bottom Right */}
          <div
            className={`absolute bottom-20 right-10 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex flex-col items-end gap-4 p-4">
              <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <div className="max-w-xs text-right">
                <h4 className="text-sm font-semibold text-black">
                  ربط مباشر مع الواتساب يجمع لك العملاء فورًا.
                </h4>
              </div>
            </div>
          </div>

          {/* Feature 5: Dashboard - Bottom Left */}
          <div
            className={`absolute bottom-20 left-10 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div className="flex flex-col items-start gap-4 p-4">
              <div className="w-16 h-16 bg-[#00DBBF] rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                </svg>
              </div>
              <div className="max-w-xs text-left">
                <h4 className="text-sm font-semibold text-black">
                  لوحة تحكم يورّيك الأرقام اللي تهمّك فعلاً.
                </h4>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-20">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-3.webp"
              alt="Decoration"
              className="w-14 h-14 opacity-60"
            />
          </div>

          <div className="absolute top-32 right-32">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-5.webp"
              alt="Decoration"
              className="w-8 h-8 opacity-60"
            />
          </div>

          <div className="absolute bottom-32 left-32">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-1.webp"
              alt="Decoration"
              className="w-18 h-18 opacity-60"
            />
          </div>

          <div className="absolute bottom-10 right-20">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-4.webp"
              alt="Decoration"
              className="w-9 h-9 opacity-60"
            />
          </div>

          <div className="absolute top-1/2 right-20 transform -translate-y-1/2">
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-2.webp"
              alt="Decoration"
              className="w-12 h-12 opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
