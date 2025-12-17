"use client";

import { useState } from "react";
import Image from "next/image";
import { Flag } from "lucide-react";
import { motion } from "framer-motion";

const WhyUsSection = () => {
  const [openAccordion, setOpenAccordion] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const accordionItems = [
    {
      id: 1,
      title: "💼 كل أدواتك في منصة واحدة",
      content:
        "نظام متكامل يجمع إدارة العقارات، العملاء، الصفقات، والإيجارات — كل شيء في لوحة تحكم موحّدة تربط أعمالك ببعض تلقائيًا.",
    },
    {
      id: 2,
      title: "⚙️ ذكاء صناعي يشتغل عنك",
      content:
        "من الردود التلقائية في الواتساب إلى الربط بين العروض والطلبات، الأتمتة في تعاريف توفّر وقتك وتضاعف إنتاجيتك.",
    },
    {
      id: 3,
      title: "📊 تحليلات تساعدك تتخذ القرار الصح",
      content:
        "لوحات تفاعلية تعطيك رؤية فورية لأداء فريقك، حركة السوق، ونسبة الإقبال على العقارات — لتقود عملك بالبيانات لا بالتخمين.",
    },
    {
      id: 4,
      title: "🔒 موثوق وآمن 100٪ داخل السعودية",
      content:
        "بياناتك محفوظة بأنظمة أمان مشددة واستضافة محلية تضمن لك الخصوصية والاعتمادية العالية.",
    },
    {
      id: 5,
      title: "🚀 جاهزة للنمو معك",
      content:
        "سواء كنت مسوّق مستقل أو مطوّر تدير مشاريع ضخمة، تعاريف تتكيّف معك وتكبر مع توسّع أعمالك.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? -1 : index);
  };

  return (
    <section id="why" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-100 rounded-full animate-bounce hidden sm:block"></div>

            {/* Main Image */}
            <div className="relative z-10">
              <div className="absolute top-[60%] right-4 w-20 h-20 bg-green-500 rounded-2xl shadow-lg z-20"></div>
              <div className="absolute top-[10%] left-4 w-15 h-15 bg-[#FF8C24] rounded-2xl shadow-lg z-20"></div>
              <Image
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/heyyyz.webp"
                alt="Why Choose Us"
                width={811}
                height={900}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>

            {/* Text Box */}
            <motion.div
              className="absolute left-0 bottom-0 sm:bottom-8 sm:left-8 bg-white p-4 rounded-lg shadow-lg border border-gray-100 z-[99] max-w-[300px]"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute -top-8 -right-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-[1]"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Flag className="w-7 h-7 text-white" />
              </motion.div>
              <p className="text-sm sm:text-md text-gray-700 max-w-xs">
                سوينا تعاريف عشان نساعد المسوّقين والمكاتب العقارية في السعودية
                بتقنية تشتغل لخدمتهم، مو تعقّد شغلهم.
              </p>
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8 ">
            {/* Title */}
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                لماذا تعاريف هي شريك العقار الذكي؟
              </h2>
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {accordionItems.map((item, index) => (
                <div
                  key={item.id}
                  className="overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className={`w-full px-6 py-4 text-right transition-all duration-300 flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-[1.02] ${
                      openAccordion === index
                        ? "bg-[#EFFEF6]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg font-medium text-[#7D7D83]">
                      {item.title}
                    </span>
                    <div className="shrink-0 ml-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-gray-200 hover:scale-110 hover:shadow-lg cursor-pointer">
                        <span className="text-lg font-bold text-black transition-colors duration-200">
                          {openAccordion === index ? "−" : "+"}
                        </span>
                      </div>
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordion === index
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-4 bg-[#EFFEF6]">
                      <p className="text-gray-700 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4 justify-center sm:justify-end">
              <button
                className="relative bg-black text-white px-8 py-4 rounded-lg font-medium transition-colors duration-300 hover:bg-[#FA8923] overflow-hidden flex items-center gap-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span
                  className={`block transition-all duration-300 ${isHovered ? "-translate-y-full  opacity-0" : "translate-y-0"}`}
                >
                  اكتشف المزيد
                </span>
                <span
                  className={`block transition-transform duration-300 ${isHovered ? "translate-y-0 " : "translate-y-full "} absolute top-0 right-4 w-full h-full flex items-center justify-center gap-3`}
                >
                  اكتشف المزيد
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
