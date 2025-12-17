"use client";

import { useState, useEffect } from "react";

export default function ClientsSection() {
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

    const element = document.getElementById("clients");
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
      id="clients"
      className="py-20 bg-[#d7f7ec] relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <img
        src="/bghero.webp"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="container mx-auto px-4 relative z-10">
        {/* Main heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
            موثوق من{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-black">خبراء العقار.</span>
              <svg
                className="absolute -bottom-[9.5rem] -left-3 w-full h-[50rem] text-[#FF8C24]"
                viewBox="0 0 150 150"
                preserveAspectRatio="none"
              >
                <path
                  d="M15.2,120L15.2,120c80-5,160-6,240-4c20,0.5,40,1,60,1.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className=""
                />
              </svg>
            </span>{" "}
            في جميع أنحاء المملكة.
          </h2>
        </div>

        {/* Spacer */}
        <div className="h-8"></div>

        {/* Description */}
        <div className="text-center mb-16">
          <p className="text-xl text-[#6E6E75] max-w-4xl mx-auto leading-relaxed">
            من المسوّقين إلى المكاتب والمطوّرين — يعتمدون على تعاريف كل يوم
            لإدارة العقارات، وأتمتة التواصل، وزيادة الصفقات بسرعة وذكاء.
          </p>
        </div>

        {/* Client logos grid */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Client Logo 1 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/1.png"
              alt="Client Logo 1"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 2 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/2.png"
              alt="Client Logo 2"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 3 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/3.png"
              alt="Client Logo 3"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 4 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/6.png"
              alt="Client Logo 4"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 5 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/5.png"
              alt="Client Logo 5"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          {/* Client Logo 6 */}
          <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300 group">
            <img
              src="/images/landingPage/4.png"
              alt="Client Logo 6"
              className="max-w-full h-auto opacity-70 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
