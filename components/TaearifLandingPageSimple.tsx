"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Rocket,
  MessageCircle,
  Globe,
  Users,
  Bot,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Lock,
} from "lucide-react";
import SharedHeader from "./shared/SharedHeader";

export default function TaearifLandingPageSimple() {
  const router = useRouter();

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

    const animatedElements = document.querySelectorAll(
      ".animate-fade-in, .animate-slide-up",
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const toggleFAQ = (index: number) => {
    const answers = document.querySelectorAll(".faq-answer");
    const icons = document.querySelectorAll(".faq-icon");

    const currentAnswer = answers[index];
    const currentIcon = icons[index];

    // Close all other FAQs
    answers.forEach((answer, i) => {
      if (i !== index) {
        answer.classList.add("hidden");
        (icons[i] as HTMLElement).style.transform = "rotate(0deg)";
      }
    });

    // Toggle current FAQ
    if (currentAnswer.classList.contains("hidden")) {
      currentAnswer.classList.remove("hidden");
      (currentIcon as HTMLElement).style.transform = "rotate(180deg)";
    } else {
      currentAnswer.classList.add("hidden");
      (currentIcon as HTMLElement).style.transform = "rotate(0deg)";
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
      <SharedHeader activePage="home" />

      {/* Hero Section */}
      <section
        id="home"
        className="relative w-full overflow-hidden bg-gradient-to-b from-purple-50/30 via-white to-white py-16 md:py-24"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-gray-100/30 blur-2xl"></div>
          <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-cyan-100/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-gray-50/50 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-gray-50 text-purple-800 text-sm font-medium mb-6 animate-fade-in">
              <TrendingUp className="h-4 w-4" />
              <span>+2000 مكتب عقاري يثق بنا</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="text-black">غير معادلة </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                شغلك العقاري
              </span>
              <br />
              <span className="text-black">وخلك دايم </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                سابق غيرك
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              ابنِ موقعك العقاري باحترافية، رتّب عملاءك وعقاراتك في نظام واحد،
              وخلي المساعد الذكي يرد على عملاءك في واتساب ويخزن بياناتهم حتى
              وأنت نايم.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
              <button
                onClick={() => router.push("/register")}
                className="inline-flex items-center bg-black text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all text-lg"
              >
                <Rocket className="ml-2 h-5 w-5" />
                جرّب مجاناً الآن
              </button>
              <a
                href="https://wa.me/966592960339"
                className="inline-flex items-center border-2 border-gray-200 bg-transparent text-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all text-lg"
              >
                <MessageCircle className="ml-2 h-5 w-5" />
                تحدث مع المبيعات
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto flex items-center gap-2 text-sm text-gray-500">
                  <Lock className="h-4 w-4" />
                  <span>taearif.taearif.com</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <img
                  src="https://e.top4top.io/p_35164j4e51.jpg"
                  alt="موقعك العقاري الاحترافي"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 right-8 bg-white rounded-lg shadow-lg p-4 border border-cyan-200 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">مساعد واتساب</div>
                    <div className="text-xs text-gray-500">
                      يرد على العملاء 24/7
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-8 bg-white rounded-lg shadow-lg p-4 border border-blue-200 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">إدارة العملاء</div>
                    <div className="text-xs text-gray-500">نظام CRM متكامل</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <span>مميزاتنا الأساسية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">كل اللي تحتاجه </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                في مكان واحد
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منصة متكاملة تجمع كل احتياجاتك العقارية في نظام واحد سهل ومرن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Website */}
            <div className="rounded-2xl p-8 text-center hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 bg-white hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">موقع عقاري جاهز</h3>
              <p className="text-gray-600 mb-4">
                أنشئ موقعك خلال دقائق من قوالب جاهزة ومناسبة للجوال.
              </p>
              <ul className="text-right text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-cyan-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  قوالب احترافية جاهزة
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-cyan-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  متوافق مع الجوال
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-cyan-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  سرعة تحميل عالية
                </li>
              </ul>
            </div>

            {/* Feature 2: CRM */}
            <div className="rounded-2xl p-8 text-center hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-200 bg-white hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">CRM – إدارة العملاء</h3>
              <p className="text-gray-600 mb-4">
                سجل بيانات عملاءك، تابع استفساراتهم، وجدول مواعيدك.
              </p>
              <ul className="text-right text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  إدارة بيانات العملاء
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  تتبع الاستفسارات
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  جدولة المواعيد
                </li>
              </ul>
            </div>

            {/* Feature 3: WhatsApp AI */}
            <div className="rounded-2xl p-8 text-center hover:transform hover:-translate-y-2 transition-all duration-300 border-2 border-purple-200 bg-white hover:shadow-lg relative">
              <div className="absolute -top-3 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                الأكثر طلباً
              </div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                WhatsApp AI – المساعد الذكي
              </h3>
              <p className="text-gray-600 mb-4">
                يرد على العملاء مباشرة 24/7 ويحفظ استفساراتهم وأرقامهم تلقائي.
              </p>
              <ul className="text-right text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ردود تلقائية ذكية
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  حفظ بيانات العملاء
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  متاح 24/7
                </li>
              </ul>
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
                  <button
                    onClick={() => router.push("/")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/solutions")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الحلول
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/about-us")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    من نحن
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/updates")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    التحديثات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/privacy")}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    سياسة الخصوصية
                  </button>
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
