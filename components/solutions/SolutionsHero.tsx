"use client";

import { Layers, Play, Phone } from "lucide-react";

export default function SolutionsHero() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-purple-50/30 via-white to-white py-16 md:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-purple-100/30 blur-2xl"></div>
        <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-cyan-100/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-purple-50/50 blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-800 text-sm font-medium mb-6 animate-fade-in">
            <Layers className="h-4 w-4" />
            <span>حلول متكاملة للعقارات</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in ">
            <span className="text-black">حلول&nbsp;</span>
            <span className="gradient-text">تعاريف</span>

            <br />
            <span className="gradient-success">المتكاملة</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            اكتشف مجموعة شاملة من الحلول التقنية المصممة خصيصاً لتطوير أعمالك
            العقارية وتحقيق النجاح المستدام
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <a
              href={`register/`}
              className="btn btn-success text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
            >
              <Play className="ml-2 h-5 w-5" />
              ابدأ رحلتك الآن
            </a>
            <a
              href="https://wa.me/966592960339"
              className="btn btn-outline text-lg px-8 py-4 rounded-full flex items-center"
            >
              <Phone className="ml-2 h-5 w-5" />
              استشارة مجانية
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
