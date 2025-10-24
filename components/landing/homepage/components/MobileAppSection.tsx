"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const MobileAppSection = () => {
  return (
    <section
      id="app"
      className=" "
      style={{ zIndex: 50 }}
    >
      <div className="container mx-auto">
        {/* Single Card */}
        <motion.div
          className="bg-[#E7FDF2] rounded-lg "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col sm:flex-row p-5 sm:pr-10 pt-10">
            {/* Left Half - Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-1 sm:w-1/2">
              {/* Title */}
              <motion.h2
                className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight "
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                نظامك العقاري دايم معك، وين ما تروح.
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-[400px]"
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
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <Link href="/register">
                  <motion.button
                    className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    جرب مجاناً الأن
                  </motion.button>
                </Link>
                <a href="https://wa.me/966592960339" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    className="bg-white text-black border-2 border-black px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-black hover:text-white hover:shadow-lg hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    تحدث مع المبيعات
                  </motion.button>
                </a>
              </motion.div>
            </div>

            {/* Right Half - Mobile Screenshots */}
            <div className="flex flex-row bottom-0 lg:flex-col xl:flex-row gap-4 sm:gap-6 justify-center -mb-6 sm:-mb-8 lg:-mb-10 order-2 sm:w-1/2">
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
                  height={1438}
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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileAppSection;
