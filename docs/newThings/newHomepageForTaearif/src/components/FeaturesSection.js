"use client";

import { useState, useEffect } from "react";

export default function FeaturesSection() {
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

    const element = document.getElementById("features");
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
    <section id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-[#FF8C24] opacity-10 rounded-full transform rotate-45"></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 bg-[#17BD37] opacity-10 rounded-full transform -rotate-12"></div>
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-[#9C30FF] opacity-10 rounded-full transform rotate-12"></div>
      <div className="absolute bottom-10 right-10 w-14 h-14 bg-[#00DBBF] opacity-10 rounded-full transform -rotate-45"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            مزايا قوية مصمّمة تخدم شغلك العقاري.{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#17BD37]">للعقارات</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-4 text-[#FF8C24]"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
              >
                <path
                  d="M15.2 133.3H485"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="animate-pulse"
                />
              </svg>
            </span>
          </h2>
        </div>

        {/* Features showcase */}
        <div className="relative">
          {/* Main screenshot */}
          <div
            className={`flex justify-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/screeeeeeen-1.webp"
              alt="Features Screenshot"
              className="max-w-full h-[50rem] rounded-lg "
            />
          </div>

          {/* Feature annotations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* CRM Feature */}
            <div
              className={`absolute -top-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <div className="flex flex-col items-center gap-4 p-4">
                <div className="max-w-xs text-center">
                  <h4 className="text-sm font-semibold text-black">
                    نظام CRM ذكي يرتّب لك كل صفقة بخطوات واضحة ومنظمة.
                  </h4>
                </div>
                <div className="w-16 h-16 bg-[#FF8C24] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* AI Feature */}
            <div
              className={`absolute top-[20%] right-0 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <div className="">
                <div className="w-16 h-16 bg-[#17BD37] rounded-full flex items-center justify-center mr-[20rem]">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <div className="text-right mr-[10rem] max-w-[200px] -mt-[9rem]">
                <h4 className="text-md font-semibold text-black">
                  الذكاء الصناعي يرد على عملاءك تلقائي ٢٤ ساعة باليوم.
                </h4>
              </div>
            </div>

            {/* Website Feature */}
            <div
              className={`absolute top-1/2 left-1/6 transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <div className="flex flex-col items-start gap-4 p-4">
                <div className="w-16 h-16 bg-[#9C30FF] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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

            {/* WhatsApp Feature */}
            <div
              className={`absolute top-2/3 right-1/6 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <div className="flex flex-col items-end gap-4 p-4 rounded-lg">
                <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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

            {/* Dashboard Feature */}
            <div
              className={`absolute bottom-1/4 left-1/3 transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <div className="flex flex-col items-start gap-4 p-4">
                <div className="w-16 h-16 bg-[#00DBBF] rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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

            {/* Decorative ornaments */}
            <div
              className={`absolute top-1/6 right-1/6 w-14 h-14 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-3.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className={`absolute bottom-1/6 left-1/6 w-8 h-8 transition-all duration-1000 delay-800 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-5.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className={`absolute top-1/2 right-1/8 w-16 h-16 transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-1.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className={`absolute bottom-1/3 right-1/3 w-16 h-16 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-1.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className={`absolute top-1/3 left-1/8 w-9 h-9 transition-all duration-1000 delay-1100 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-4.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className={`absolute bottom-1/2 right-1/4 w-16 h-16 transition-all duration-1000 delay-1200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/App-Landing-ornament-2.webp"
                alt="Ornament"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
