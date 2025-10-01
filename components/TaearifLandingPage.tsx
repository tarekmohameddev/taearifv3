"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Rocket,
  MessageCircle,
  Globe,
  Users,
  Building2,
  Home,
  Bot,
  Link,
  Zap,
  Layers,
  Headphones,
  PlayCircle,
  UserPlus,
  Upload,
  CheckCircle,
  ArrowLeft,
  Heart,
  Star,
  HelpCircle,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Lock,
} from "lucide-react";
import styles from "./TaearifLandingPage.module.css";

export default function TaearifLandingPage() {
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
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
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
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
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
              className="hidden sm:inline-flex btn btn-outline text-sm"
            >
              تسجيل الدخول
            </a>
            <a href={`register/`} className="btn btn-success text-sm">
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
          <div className="container h-full flex flex-col py-6">
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
                className="text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-50"
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
                className="btn btn-outline w-full py-3"
              >
                تسجيل الدخول
              </a>
              <a href={`register/`} className="btn btn-success w-full py-3">
                جرّب مجاناً الآن
              </a>
            </div>
          </div>
        </div>
      )}

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

        <div className="container relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-gray-50 text-purple-800 text-sm font-medium mb-6 animate-fade-in">
                <TrendingUp className="h-4 w-4" />
                <span>+2000 مكتب عقاري يثق بنا</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                <span className="text-black">غير معادلة </span>
                <span className="gradient-success">شغلك العقاري</span>
                <br />
                <span className="text-black">وخلك دايم</span>
                <span className="gradient-text">سابق غيرك</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up">
                ابنِ موقعك العقاري باحترافية، رتّب عملاءك وعقاراتك في نظام واحد،
                وخلي المساعد الذكي يرد على عملاءك في واتساب ويخزن بياناتهم حتى
                وأنت نايم.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
                <a
                  href={`register/`}
                  className="btn btn-success text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
                >
                  <Rocket className="ml-2 h-5 w-5" />
                  جرّب مجاناً الآن
                </a>
                <a
                  href="https://wa.me/966592960339"
                  className="btn btn-outline text-lg px-8 py-4 rounded-full flex items-center"
                >
                  <MessageCircle className="ml-2 h-5 w-5 whatsapp-icon" />
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
                      <div className="text-xs text-gray-500">
                        نظام CRM متكامل
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the content will be added in the next part */}
    </div>
  );
}
