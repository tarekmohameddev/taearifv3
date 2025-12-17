"use client";

import { Building, Users, Briefcase } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function TaearifTypesCards() {
  const cards = [
    {
      id: 1,
      title: "موقع إلكتروني احترافي",
      subtitle: "إنشاء موقع إلكتروني احترافي",
      description:
        "عرّف عملاءك بعقاراتك من خلال موقع احترافي باسمك يعرض كل عروضك بسهولة وجاذبية.",
      icon: Building,
      bgColor: "bg-[#ff7b58]",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      image: "/images/landingPage/section2/3-1.png",
    },
    {
      id: 2,
      title: "الربط بالذكاء الصناعي",
      subtitle: "الربط بين العروض والطلبات بالذكاء الصناعي",
      description:
        "طابق عروضك العقارية مع طلبات العملاء تلقائيًا بالذكاء الصناعي، ووصل للعميل المناسب في الوقت المناسب بسهولة ودقّة.",
      icon: Users,
      bgColor: "bg-[#00b4a5]",
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      image: "/images/landingPage/section2/2-1.png",
    },
    {
      id: 3,
      title: "واتساب ذكي",
      subtitle: "الواتساب بالذكاء الصناعي",
      description:
        "فعّل واتسابك ليعمل عنك — يرد تلقائيًا على استفسارات العملاء ويقدّم تفاصيل العقارات بدقّة وسرعة على مدار الساعة.",
      icon: Briefcase,
      bgColor: "bg-[#3e7cf7]",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      image: "/images/landingPage/section2/1-3.png",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            تعاريف تجمع لك كل أدواتك في مكان واحد
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            من موقع إلكتروني احترافي، إلى ربط تلقائي بين العروض والطلبات، وصولًا
            إلى واتساب ذكي يرد على عملائك بالذكاء الصناعي.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                className={`${card.bgColor} rounded-2xl px-8 pt-8 hover:shadow-xl transition-all duration-1000 hover:-translate-y-2 flex flex-col h-full`}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  transition: { duration: 0.4, ease: "easeOut" },
                }}
              >
                {/* Content */}
                <motion.div
                  className="space-y-4 flex-grow text-center"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.0,
                    delay: index * 0.4 + 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <motion.h6
                    className="text-sm font-semibold text-white uppercase tracking-wide"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.4 + 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    {card.title}
                  </motion.h6>

                  <motion.h3
                    className="text-2xl font-bold text-white leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.4 + 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    {card.subtitle}
                  </motion.h3>

                  <motion.p
                    className="text-white leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.4 + 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    {card.description}
                  </motion.p>
                </motion.div>

                {/* Image at bottom */}
                <motion.div
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1.0,
                    delay: index * 0.4 + 1.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={1000}
                      height={150}
                      className="w-full max-w-[500px] h-auto object-contain"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
