"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

// Animated Counter Component
function AnimatedCounter({ end, suffix = "", delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const counter = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(counter);
  }, [isVisible, end]);

  return (
    <motion.span>
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export default function TeamSection() {
  return (
    <section className="sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Main heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-black mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            فريق من المصممين والمهندسين وأهل العقار، يشتغلون مع بعض لتطوير أدوات
            تساعدك تبيع أسرع وتشتغل أذكى.
          </motion.h2>
        </motion.div>

        {/* Description and Image */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Image */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.img
              src="https://test.kingbellsa.com/wp-content/uploads/2025/10/Untitled-design-80-2.png"
              alt="Team"
              className="w-full h-auto rounded-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.p
              className="text-lg text-[#6E6E75] leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              نمزج خبرتنا في السوق العقاري مع برمجيات ذكية وسهلة الاستخدام.
              <br />
              من مواقع المسوّقين إلى أنظمة الـCRM المدعومة بالذكاء الصناعي،
              هدفنا واحد — نوفّر لك نظام يحوّل المحادثات إلى صفقات حقيقية.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Sites Counter */}
          <motion.div
            className="text-center bg-[#E7FDF2] p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <motion.div
              className="text-4xl lg:text-5xl font-bold text-[#000000] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <AnimatedCounter end={700} suffix="+" delay={0.2} />
            </motion.div>
            <motion.p
              className="text-md text-[#999EA7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              المواقع التي تم إطلاقها
            </motion.p>
          </motion.div>

          {/* Leads Counter */}
          <motion.div
            className="text-center bg-[#E7FDF2] p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <motion.div
              className="text-4xl lg:text-5xl font-bold text-[#000000] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 1.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <AnimatedCounter end={10} suffix="K+" delay={0.4} />
            </motion.div>
            <motion.p
              className="text-md text-[#999EA7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 2.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              التقاط العملاء المحتملين وتنظيمها
            </motion.p>
          </motion.div>

          {/* Properties Counter */}
          <motion.div
            className="text-center bg-[#E7FDF2] p-8 rounded-lg"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 1.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
          >
            <motion.div
              className="text-4xl lg:text-5xl font-bold text-[#000000] mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 2.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <AnimatedCounter end={180} suffix="K+" delay={0.6} />
            </motion.div>
            <motion.p
              className="text-md text-[#999EA7]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 2.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-50px" }}
            >
              العقارات المدرجة والمدارة
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
