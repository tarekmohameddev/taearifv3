"use client";

import { motion } from "framer-motion";
import { Laptop, Star } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";

const FEATURE_LIST = [
  { icon: "🏷️", label: "هوية الموقع" },
  { icon: "📞", label: "بيانات التواصل" },
  { icon: "🏠", label: "أول عقار" },
  { icon: "🌐", label: "رابط الموقع" },
  { icon: "🔗", label: "الربط والتكامل" },
];

export function WelcomeScreen() {
  const { setExperienceLevel } = useOnboardingStore();

  return (
    <div className="min-h-screen flex" dir="rtl">
      {/* Left decorative panel (desktop only) */}
      <div
        className="hidden md:flex flex-col justify-between w-2/5 xl:w-1/3 p-10"
        style={{ background: "linear-gradient(160deg, #1A3C34 0%, #2D6A4F 100%)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            ت
          </div>
          <div>
            <p className="text-white font-bold text-base leading-tight">تعاريف</p>
            <p className="text-white/50 text-xs">منصة العقارات الاحترافية</p>
          </div>
        </div>

        {/* Central illustration area */}
        <div className="text-center space-y-5">
          <div className="text-6xl">🚀</div>
          <div>
            <h2 className="text-white font-bold text-xl leading-snug mb-2">
              موقعك الاحترافي جاهز خلال دقائق
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              سنوجّهك لإعداد موقعك خطوة بخطوة بطريقة سهلة وسريعة
            </p>
          </div>

          {/* Steps preview */}
          <div className="space-y-2 text-right">
            {FEATURE_LIST.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 bg-white/8 rounded-xl px-4 py-2.5"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-white/80 text-sm font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-white/30 text-xs text-center">
          يمكنك تعديل هذه الإعدادات في أي وقت لاحقاً
        </p>
      </div>

      {/* Right content panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile brand */}
          <div className="md:hidden flex items-center justify-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#1A3C34] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              ت
            </div>
            <p className="text-[#1A3C34] font-bold text-lg">تعاريف</p>
          </div>

          {/* Welcome heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">أهلاً وسهلاً بك!</h1>
            <p className="text-[#6B7280] text-sm leading-relaxed">
              عشان نساعدك بأفضل طريقة، نبي نعرف شوي عنك
            </p>
          </motion.div>

          {/* Question */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center"
          >
            <p className="text-[#1A1A1A] font-bold text-lg mb-1">
              هل سبق لك تسوي موقع إلكتروني؟
            </p>
            <p className="text-[#9CA3AF] text-sm">اختر الخيار اللي ينطبق عليك</p>
          </motion.div>

          {/* Experience choices */}
          <div className="space-y-3">
            {/* Experienced */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setExperienceLevel("experienced")}
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white p-5 flex items-center gap-4 text-right transition-all hover:border-[#1A3C34] hover:shadow-md group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-[#E8F5EF]"
                style={{ background: "#F4F5F7" }}
              >
                <Laptop className="w-7 h-7 text-[#1A3C34]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1A1A1A] text-base mb-0.5">
                  نعم، عندي خبرة سابقة
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  سبق لي استخدمت منصات مثل ووردبريس أو ويكس أو غيرها
                </p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 group-hover:border-[#1A3C34] transition-colors" />
            </motion.button>

            {/* Beginner */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.28 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setExperienceLevel("beginner")}
              className="w-full rounded-2xl border-2 bg-white p-5 flex items-center gap-4 text-right transition-all hover:shadow-md group relative overflow-hidden"
              style={{ borderColor: "#4CAF82" }}
            >
              {/* Recommended badge */}
              <div
                className="absolute top-3 left-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                style={{ background: "#4CAF82" }}
              >
                الأكثر شيوعاً
              </div>

              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#E8F5EF" }}
              >
                <Star className="w-7 h-7 text-[#4CAF82]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1A1A1A] text-base mb-0.5">
                  لا، أول مرة أسوي موقع
                </p>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  ما عندي خبرة وأحتاج شرح وتوجيه في كل خطوة
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                style={{ borderColor: "#4CAF82", background: "#4CAF82" }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </motion.button>
          </div>

          {/* Reassurance */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            className="text-center text-xs text-[#9CA3AF]"
          >
            يمكنك تغيير هذا الاختيار في أي وقت لاحقاً
          </motion.p>
        </div>
      </div>
    </div>
  );
}
