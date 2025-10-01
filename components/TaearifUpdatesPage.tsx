"use client";

import { useState, useEffect } from "react";
import {
  Zap,
  ArrowDown,
  Rocket,
  CheckCircle,
  MessageCircle,
  Database,
  Calendar,
  Smartphone,
  Check,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
} from "lucide-react";

export default function TaearifUpdatesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
          }
        });
      },
      { threshold: 0.1 },
    );

    const animatedElements = document.querySelectorAll(".animate-slide-up");

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative group">
              <svg
                version="1.0"
                width="150"
                height="100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 565.000000 162.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                  fill="#000000"
                  stroke="none"
                >
                  <path
                    d="M4182 1488 c-17 -17 -17 -1279 0 -1296 9 -9 128 -12 473 -12 l460 0
                  188 188 187 187 0 457 c0 402 -2 458 -16 472 -14 14 -86 16 -648 16 -478 0
                  -635 -3 -644 -12z m1030 -265 c17 -15 18 -37 18 -270 l0 -253 -112 0 c-150 0
                  -148 2 -148 -147 l0 -113 -140 0 -140 0 0 110 c0 97 -2 112 -20 130 -18 18
                  -33 20 -130 20 l-110 0 0 260 c0 236 2 260 18 269 10 7 152 11 381 11 325 0
                  366 -2 383 -17z"
                  ></path>
                  <path
                    d="M837 1274 c-4 -4 -7 -43 -7 -86 l0 -78 95 0 96 0 -3 83 -3 82 -85 3
                  c-47 1 -89 0 -93 -4z"
                  ></path>
                  <path
                    d="M2150 934 l0 -345 73 -90 72 -89 625 2 c613 3 626 3 670 24 55 26
                  103 76 125 128 9 22 19 82 22 133 l6 93 -82 0 -81 0 0 -55 c0 -121 -36 -145
                  -218 -145 l-129 0 -5 109 c-4 92 -8 117 -32 164 -30 63 -69 100 -136 131 -37
                  17 -65 21 -160 21 -140 0 -195 -14 -255 -67 -55 -48 -85 -123 -85 -210 0 -60
                  2 -64 42 -105 l42 -43 -167 0 -167 0 0 345 0 345 -80 0 -80 0 0 -346z m875
                  -110 c39 -26 55 -71 55 -159 l0 -75 -190 0 -190 0 0 63 c0 110 28 166 96 187
                  48 16 196 5 229 -16z"
                  ></path>
                  <path d="M3330 1010 l0 -80 90 0 90 0 0 80 0 80 -90 0 -90 0 0 -80z"></path>
                  <path d="M3550 1010 l0 -80 95 0 95 0 0 80 0 80 -95 0 -95 0 0 -80z"></path>
                  <path
                    d="M780 1007 c-101 -28 -157 -87 -185 -192 -26 -100 -22 -123 32 -177
                  l47 -48 -307 0 -307 0 0 -90 0 -91 773 3 c858 3 810 -1 886 71 51 49 72 105
                  78 213 l6 94 -82 0 -81 0 0 -55 c0 -31 -7 -69 -15 -85 -27 -51 -58 -60 -218
                  -60 l-144 0 -6 98 c-7 127 -32 196 -93 252 -25 23 -62 49 -82 57 -49 21 -240
                  28 -302 10z m232 -167 c20 -6 48 -24 62 -41 24 -28 26 -39 26 -120 l0 -89
                  -185 0 -185 0 0 75 c0 112 25 159 93 175 48 12 147 11 189 0z"
                  ></path>
                  <path
                    d="M1880 565 c0 -148 -4 -233 -12 -249 -17 -38 -56 -59 -122 -65 l-59
                  -6 -33 -73 -33 -72 103 0 c136 0 193 17 256 78 73 71 80 106 80 384 l0 228
                  -90 0 -90 0 0 -225z"
                  ></path>
                  <path d="M1160 180 l0 -80 90 0 90 0 0 80 0 80 -90 0 -90 0 0 -80z"></path>
                  <path d="M1380 180 l0 -80 95 0 95 0 0 80 0 80 -95 0 -95 0 0 -80z"></path>
                </g>
              </svg>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              الرئيسية
            </a>
            <a
              href="/solutions"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              الحلول
            </a>
            <a
              href="/updates"
              className="text-sm font-medium text-black border-b-2 border-purple-500"
            >
              التحديثات
            </a>
            <a
              href="/about-us"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              من نحن
            </a>
            <a
              href="https://wa.me/966592960339"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              اتصل بنا
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a
              href={`login/`}
              className="hidden sm:inline-flex items-center justify-center border-2 border-gray-200 bg-transparent text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors text-sm"
            >
              تسجيل الدخول
            </a>
            <a
              href={`register/`}
              className="inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              جرّب مجاناً الآن
            </a>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 transition-all duration-300 md:hidden">
          <div className="max-w-6xl mx-auto px-4 h-full flex flex-col py-6">
            <div className="flex justify-between items-center mb-8">
              <div className="text-xl font-bold">تعاريف</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-right">
              <a
                href="#home"
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                الرئيسية
              </a>
              <a
                href="/solutions"
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                الحلول
              </a>
              <a
                href="/updates"
                className="text-lg font-medium py-3 px-4 rounded-lg bg-purple-50 text-purple-700"
              >
                التحديثات
              </a>
              <a
                href="/about-us"
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                من نحن
              </a>
              <a
                href="https://wa.me/966592960339"
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
              >
                اتصل بنا
              </a>
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <a
                href="https://app.taearif.com"
                className="w-full py-3 px-4 border-2 border-gray-200 bg-transparent text-black rounded-lg hover:bg-black hover:text-white transition-colors text-center"
              >
                تسجيل الدخول
              </a>
              <a
                href={`register/`}
                className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
              >
                جرّب الآن
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-purple-600" />
              <span>آخر التحديثات</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">مميزات جديدة</span>
              <br />
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                تطور مستمر
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              نعمل باستمرار على تطوير منصة تعاريف لتقديم أفضل تجربة لعملائنا في
              القطاع العقاري
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#latest-updates"
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                <ArrowDown className="h-5 w-5 ml-2" />
                شاهد التحديثات
              </a>
              <a
                href={`register/`}
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-all text-lg"
              >
                <Rocket className="h-5 w-5 ml-2" />
                جرّب الآن
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section id="latest-updates" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">التحديثات</span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                الأخيرة
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              اكتشف أحدث المميزات والتحسينات التي أضفناها لمنصة تعاريف
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Update Card 1 */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black to-gray-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center ml-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">ديسمبر 2024</div>
                  <div className="text-sm text-green-600 font-medium">
                    متاح الآن
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3">تحسين واجهة المستخدم</h3>
              <p className="text-gray-600 mb-4">
                واجهة أسرع وأسهل في الاستخدام مع تصميم محدث
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  UI/UX
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  تحسين الأداء
                </span>
              </div>
            </div>

            {/* Update Card 2 */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black to-gray-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ml-4">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">نوفمبر 2024</div>
                  <div className="text-sm text-blue-600 font-medium">
                    متاح الآن
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3">ردود واتساب الذكية</h3>
              <p className="text-gray-600 mb-4">
                ردود آلية أكثر ذكاءً وتفاعلاً مع العملاء
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  واتساب
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  ذكاء اصطناعي
                </span>
              </div>
            </div>

            {/* Update Card 3 */}
            <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black to-gray-600"></div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center ml-4">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-lg">أكتوبر 2024</div>
                  <div className="text-sm text-purple-600 font-medium">
                    متاح الآن
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-xl mb-3">تحسين قاعدة البيانات</h3>
              <p className="text-gray-600 mb-4">
                أداء أسرع وموثوقية أعلى في حفظ البيانات
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  قاعدة البيانات
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  الأداء
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">قريباً</span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                جداً
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              مميزات جديدة ومثيرة في الطريق إليكم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Coming Soon Feature 1 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-green-500 rounded-xl flex items-center justify-center ml-4">
                  <Calendar className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">يناير 2025</div>
                  <div className="text-sm text-purple-600 font-medium">
                    متاح قريباً
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4">جدولة الردود الآلية</h3>
              <p className="text-gray-600 mb-6 text-lg">
                برمج ردود واتساب لتصل في أوقات محددة وتفاعل مع العملاء بشكل أكثر
                احترافية
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  جدولة الرسائل مسبقاً
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  ردود تلقائية ذكية
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  تتبع حالة الرسائل
                </li>
              </ul>
            </div>

            {/* Coming Soon Feature 2 */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:transform hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-purple-500 rounded-xl flex items-center justify-center ml-4">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="font-bold text-xl">فبراير 2025</div>
                  <div className="text-sm text-green-600 font-medium">
                    قيد التطوير
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-2xl mb-4">تطبيق الجوال</h3>
              <p className="text-gray-600 mb-6 text-lg">
                تطبيق جوال متكامل لإدارة عقاراتك وعملائك من أي مكان
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  رفع الصور والفيديو مباشرة
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  إشعارات فورية
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 ml-2" />
                  عمل بدون إنترنت
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">خارطة</span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                الطريق
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تابع رحلة تطوير منصة تعاريف والمميزات القادمة
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Timeline Item 1 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="absolute right-1 top-3 w-0.5 h-full bg-gradient-to-b from-black to-transparent"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الأولى - مكتملة
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      مكتمل
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    إطلاق المنصة الأساسية مع مميزات إدارة العقارات والعملاء
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      إدارة العقارات
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      CRM
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      واتساب
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="absolute right-1 top-3 w-0.5 h-full bg-gradient-to-b from-black to-transparent"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الثانية - جاري العمل
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      قيد التطوير
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    تطوير الذكاء الاصطناعي وتحسين تجربة المستخدم
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      ذكاء اصطناعي
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تحليلات متقدمة
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      أتمتة العمليات
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative pr-8">
                <div className="absolute right-0 top-0 w-3 h-3 bg-black rounded-full border-3 border-white shadow-lg"></div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">
                      المرحلة الثالثة - قريباً
                    </h3>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      مخطط
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    إطلاق تطبيق الجوال والتكامل مع منصات خارجية
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تطبيق الجوال
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      API متقدم
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      تكاملات خارجية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <svg
                  version="1.0"
                  width="120"
                  height="80"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 565.000000 162.000000"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(0.000000,162.000000) scale(0.100000,-0.100000)"
                    fill="#FFFFFF"
                    stroke="none"
                  >
                    <path
                      d="M4182 1488 c-17 -17 -17 -1279 0 -1296 9 -9 128 -12 473 -12 l460 0
                    188 188 187 187 0 457 c0 402 -2 458 -16 472 -14 14 -86 16 -648 16 -478 0
                    -635 -3 -644 -12z m1030 -265 c17 -15 18 -37 18 -270 l0 -253 -112 0 c-150 0
                    -148 2 -148 -147 l0 -113 -140 0 -140 0 0 110 c0 97 -2 112 -20 130 -18 18
                    -33 20 -130 20 l-110 0 0 260 c0 236 2 260 18 269 10 7 152 11 381 11 325 0
                    366 -2 383 -17z"
                    ></path>
                    <path
                      d="M837 1274 c-4 -4 -7 -43 -7 -86 l0 -78 95 0 96 0 -3 83 -3 82 -85 3
                    c-47 1 -89 0 -93 -4z"
                    ></path>
                  </g>
                </svg>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                منصة تعاريف هي الحل الشامل لإدارة أعمالك العقارية بكفاءة
                واحترافية عالية
              </p>
              <div className="flex gap-4">
                <a
                  href="https://snapchat.com/t/WRXySyZi"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <i className="fa-brands fa-snapchat h-5"></i>
                </a>
                <a
                  href="https://www.facebook.com/share/1HZffKAhn2/"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/taearif1"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@taearif"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                >
                  <i className="fa-brands fa-tiktok h-5"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a
                    href="/solutions"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الحلول
                  </a>
                </li>
                <li>
                  <a
                    href="/about-us"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    من نحن
                  </a>
                </li>
                <li>
                  <a
                    href="/updates"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    التحديثات
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <Mail className="h-4 w-4" />
                  <span>info@taearif.com</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <Phone className="h-4 w-4" />
                  <span>+966592960339</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 تعاريف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
