"use client";

import { motion } from "framer-motion";

export default function DashboardSection() {
  return (
    <section id="dashboard" className="sm:py-20  relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Background Images with Animations */}
          <div className="relative h-[400px] lg:h-[700px]">
            {/* Main Dashboard Image */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <img
                src="https://test.kingbellsa.com/wp-content/uploads/2025/10/ssss.webp"
                alt="Dashboard"
                className="w-full max-w-7xl h-auto rounded-lg"
              />
            </motion.div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 mt-16">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-6xl font-bold text-black mb-8 leading-tight">
                كل أعمالك العقارية في{" "}
                <span className="text-[#17BD37]">لوحة تحكم واحدة</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-[#6E6E75] mb-8 leading-relaxed max-w-3xl mx-auto">
                من إدارة العقارات والعملاء إلى الصفقات والرسائل — نظام ذكي يشتغل
                عنك، مو عليك.
              </p>

              {/* Rating */}
              {/* <div className="flex items-center justify-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-6 h-6 text-[#FF8C24]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span className="text-2xl font-bold text-black ml-2">4.9</span>
              </div> */}

              {/* Trust Text */}
              {/* <p className="text-sm text-[#6E6E75]">
                مجرب من المحترفين العقاريين بكل مناطق السعودية.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
