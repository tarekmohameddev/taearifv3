"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const MobileAppSection = () => {
  return (
    <section
      id="app"
      className="pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 "
      style={{ zIndex: 50 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Half - Content */}
          <div className="bg-[#E7FDF2] p-6 sm:p-8 lg:p-12 rounded-lg order-2 lg:order-1">
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Title */}
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                نظامك العقاري دايم معك، وين ما تروح.
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                تحكم في عقاراتك وعملاءك ورسائلك من أي مكان، بسرعة وأمان، والنظام
                شغال معك وين ما كنت.
              </motion.p>

              {/* App Store Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.a
                  href="#"
                  className="inline-block transition-transform duration-200 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="https://test.kingbellsa.com/wp-content/uploads/2025/10/Mobile-App-Google-Play.webp"
                    alt="Download on Google Play"
                    width={312}
                    height={96}
                    className="h-12 sm:h-14 md:h-16 w-auto rounded-2xl sm:rounded-3xl"
                  />
                </motion.a>
                <motion.a
                  href="#"
                  className="inline-block transition-transform duration-200 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src="https://test.kingbellsa.com/wp-content/uploads/2025/10/Mobile-App-App-Store.webp"
                    alt="Download on App Store"
                    width={312}
                    height={96}
                    className="h-12 sm:h-14 md:h-16 w-auto rounded-2xl sm:rounded-3xl"
                  />
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* Right Half - Mobile Screenshots */}
          <motion.div
            className="bg-[#E7FDF2] bottom-0 flex items-end justify-center px-4 sm:px-6 lg:px-8 rounded-lg order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 sm:gap-6 justify-center items-center">
              {/* First Mobile Screen */}
              <motion.div
                className="w-48 sm:w-56 md:w-64 lg:w-48 xl:w-56 h-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <Image
                  src="https://test.kingbellsa.com/wp-content/uploads/2025/10/mobile-app-screen-1.webp"
                  alt="Mobile App Screen 1"
                  width={900}
                  height={1230}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl"
                />
              </motion.div>

              {/* Second Mobile Screen */}
              <motion.div
                className="w-48 sm:w-56 md:w-64 lg:w-48 xl:w-56 h-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <Image
                  src="https://test.kingbellsa.com/wp-content/uploads/2025/10/mobile-app-screen-2.webp"
                  alt="Mobile App Screen 2"
                  width={900}
                  height={1438}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
