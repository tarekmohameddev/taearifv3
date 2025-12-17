"use client";

import { useState, useEffect } from "react";

export default function PricingSection() {
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

    const element = document.getElementById("pricing");
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
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 ">
          {/* الباقة المبدئية */}
          <div
            className={`bg-white border-2 border-gray-200 rounded-lg p-6 relative transition-all duration-500 transform scale-95 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6 transition-all duration-500 hover:scale-110">
              <svg
                className="w-8 h-8 text-[#FFC100] transition-all duration-500 hover:rotate-12"
                fill="currentColor"
                viewBox="0 0 512 512"
              >
                <path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 64c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z"></path>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              الباقة المبدئية
            </h2>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  1 الموقع الإلكتروني للعقارات
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  نطاق مخصص + (5 جيجابايت)
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  مدير إدراج الممتلكات
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  أدوات إدارة علاقات العملاء الأساسية
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  تكامل واتساب والدردشة المباشرة
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  إشعارات البريد الإلكتروني
                </span>
              </li>
            </ul>

            {/* Price */}
            <h3 className="text-3xl font-bold text-black text-center mb-4 transition-all duration-500 hover:scale-105 hover:text-[#FF8C24]">
              39 ريال سعودي/شهرياً
            </h3>

            {/* Additional Info */}
            <p className="text-sm text-gray-600 text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              ما يصل إلى 3 مستخدمين كحد أقصى → + 7 ريال سعودي لكل مستخدم إضافي
            </p>

            {/* Button */}
            <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-lg">
              التسجيل
            </button>
          </div>

          {/* الخطة الاحترافية - الأكثر شهرة */}
          <div
            className={`bg-white border-2 border-[#FF8C24] rounded-lg p-8 relative transition-all duration-500 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 hover:scale-110">
              <div className="bg-[#FF8C24] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 hover:shadow-lg">
                الأكثر شهرة
              </div>
            </div>

            {/* Arrow Image */}
            {/* <div className="absolute -top-8 right-4 transform rotate-12 transition-all duration-500 hover:scale-110 hover:rotate-6">
              <img 
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/SEO-Agency-Arrow.webp" 
                alt="Arrow" 
                className="w-20 h-24 object-contain transition-all duration-500"
              />
            </div> */}

            {/* Icon */}
            <div className="flex justify-center mb-6 mt-4 transition-all duration-500 hover:scale-110">
              <svg
                className="w-8 h-8 text-[#9C30FF] transition-all duration-500 hover:rotate-12"
                fill="currentColor"
                viewBox="0 0 576 512"
              >
                <path d="M576 240c0-23.63-12.95-44.04-32-55.12V32.01C544 23.26 537.02 0 512 0c-7.12 0-14.19 2.38-19.98 7.02l-85.03 68.03C364.28 109.19 310.66 128 256 128H64c-35.35 0-64 28.65-64 64v96c0 35.35 28.65 64 64 64h33.7c-1.39 10.48-2.18 21.14-2.18 32 0 39.77 9.26 77.35 25.56 110.94 5.19 10.69 16.52 17.06 28.4 17.06h74.28c26.05 0 41.69-29.84 25.9-50.56-16.4-21.52-26.15-48.36-26.15-77.44 0-11.11 1.62-21.79 4.41-32H256c54.66 0 108.28 18.81 150.98 52.95l85.03 68.03a32.023 32.023 0 0 0 19.98 7.02c24.92 0 32-22.78 32-32V295.13C563.05 284.04 576 263.63 576 240zm-96 141.42l-33.05-26.44C392.95 311.78 325.12 288 256 288v-96c69.12 0 136.95-23.78 190.95-66.98L480 98.58v282.84z"></path>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              الخطة الاحترافية
            </h2>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  2 موقعين إلكترونيين كاملين + 3 نطاقات فرعية
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  إدارة علاقات العملاء مع تتبع العملاء المحتملين
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  الردود الآلية على واتساب
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  اقتراحات خاصية الذكاء الاصطناعي
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  تحليلات أداء الوكيل
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  الدعم عبر البريد الإلكتروني والدردشة المباشرة
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  خيارات العلامات التجارية المخصصة
                </span>
              </li>
            </ul>

            {/* Price */}
            <h3 className="text-3xl font-bold text-black text-center mb-4 transition-all duration-500 hover:scale-105 hover:text-[#FF8C24]">
              79 ريال سعودي/شهرياً
            </h3>

            {/* Additional Info */}
            <p className="text-sm text-gray-600 text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              ما يصل إلى 5 مستخدمين كحد أقصى → + 7 ريال سعودي لكل مستخدم إضافي
            </p>

            {/* Button */}
            <button className="w-full bg-[#FF8C24] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#E67E22] transition-all duration-500 hover:scale-105 hover:shadow-lg">
              التسجيل
            </button>
          </div>

          {/* خطة المؤسسة */}
          <div
            className={`bg-white border-2 border-gray-200 rounded-lg p-6 relative transition-all duration-500 delay-500 transform scale-95 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6 transition-all duration-500 hover:scale-110">
              <svg
                className="w-8 h-8 text-[#00DBBF] transition-all duration-500 hover:rotate-12"
                fill="currentColor"
                viewBox="0 0 384 512"
              >
                <path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"></path>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              خطة المؤسسة
            </h2>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  قوائم عقارات غير محدودة
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  نظام إدارة الفروع المتعددة
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  أتمتة كاملة ومساعد ذكاء اصطناعي
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  وحدة إدارة الإيجار
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  لوحة معلومات التقارير المتقدمة
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  الدعم ذو الأولوية (24/7)
                </span>
              </li>
              <li className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                <svg
                  className="w-5 h-5 text-[#17BD37] mt-0.5 flex-shrink-0 transition-all duration-500 hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 transition-all duration-500 hover:text-[#FF8C24]">
                  مدير نجاح مخصص يتابعك خطوة بخطوة ويضمن إن كل شي في منصتك ماشي
                  تمام.
                </span>
              </li>
            </ul>

            {/* Price */}
            <h3 className="text-3xl font-bold text-black text-center mb-4 transition-all duration-500 hover:scale-105 hover:text-[#FF8C24]">
              119 ريال سعودي/شهرياً
            </h3>

            {/* Additional Info */}
            <p className="text-sm text-gray-600 text-center mb-6 transition-all duration-500 hover:text-[#FF8C24]">
              حتى 10 مستخدمين → + 7 ريال سعودي لكل مستخدم إضافي
            </p>

            {/* Button */}
            <button className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-all duration-500 hover:scale-105 hover:shadow-lg">
              التسجيل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
