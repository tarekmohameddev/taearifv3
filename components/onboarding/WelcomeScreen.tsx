"use client";

import { motion } from "framer-motion";
import { Laptop, Star } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding";

export function WelcomeScreen() {
  const { setExperienceLevel } = useOnboardingStore();

  return (
    <div className="min-h-full p-6" style={{ background: "#F4F5F7" }} dir="rtl">
      <div className="max-w-2xl mx-auto">

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-8 overflow-hidden relative mb-6"
          style={{ background: "linear-gradient(135deg, #1A3C34 0%, #2D6A4F 100%)" }}
        >
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full opacity-10 bg-white" />
          <div className="absolute -left-4 -bottom-8 w-24 h-24 rounded-full opacity-10 bg-white" />

          <div className="relative z-10 text-center">
            <div className="text-5xl mb-4">👋</div>
            <h1 className="text-2xl font-bold text-white mb-2">اهلاً وسهلاً فيك!</h1>
            <p className="text-white/75 text-base leading-relaxed">
              عشان نساعدك بأفضل طريقة، نبي نعرف شوي عنك
            </p>
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-4"
        >
          <p className="text-center text-[#1A1A1A] font-bold text-lg mb-1">
            هل سبق لك تسوي موقع إلكتروني؟
          </p>
          <p className="text-center text-[#6B7280] text-sm">
            اختر الخيار اللي ينطبق عليك
          </p>
        </motion.div>

        {/* Choice cards */}
        <div className="space-y-3">
          {/* Experienced */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setExperienceLevel("experienced")}
            className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-white p-5 flex items-center gap-5 text-right transition-all hover:border-[#1A3C34] hover:shadow-md group"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-colors group-hover:bg-[#E8F5EF]"
              style={{ background: "#F4F5F7" }}
            >
              <Laptop className="w-8 h-8 text-[#1A3C34]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1A1A1A] text-base mb-1">
                نعم، عندي خبرة سابقة
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                سبق لي استخدمت منصات مثل ووردبريس أو ويكس أو غيرها
              </p>
            </div>
            <div className="w-6 h-6 rounded-full border-2 border-[#E5E7EB] flex-shrink-0 group-hover:border-[#1A3C34] transition-colors" />
          </motion.button>

          {/* Beginner */}
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.28 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setExperienceLevel("beginner")}
            className="w-full rounded-2xl border-2 bg-white p-5 flex items-center gap-5 text-right transition-all hover:shadow-md group relative overflow-hidden"
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
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-colors"
              style={{ background: "#E8F5EF" }}
            >
              <Star className="w-8 h-8 text-[#4CAF82]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1A1A1A] text-base mb-1">
                لا، أول مرة أسوي موقع
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                ما عندي خبرة وأحتاج شرح وتوجيه في كل خطوة
              </p>
            </div>
            <div
              className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
              style={{ borderColor: "#4CAF82", background: "#4CAF82" }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </motion.button>
        </div>

        {/* Reassurance note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center text-xs text-[#9CA3AF] mt-5"
        >
          يمكنك تغيير هذا الاختيار في أي وقت لاحقاً
        </motion.p>
      </div>
    </div>
  );
}
