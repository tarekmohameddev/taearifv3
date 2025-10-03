"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Target,
  Lightbulb,
  Award,
  Heart,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  Star,
  ArrowRight,
  Building2,
  TrendingUp,
  Users2,
  Handshake,
  BookOpen,
  Eye,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Facebook,
  Instagram,
} from "lucide-react";
import SharedHeader from "./shared/SharedHeader";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen bg-gray-50 overflow-x-hidden"
      dir="rtl"
      style={{ fontFamily: "Tajawal, sans-serif" }}
    >
      <SharedHeader activePage="about-us" />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-purple-50/30 via-white to-white py-16 md:py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 h-32 w-32 rounded-full bg-purple-100/30 blur-2xl"></div>
          <div className="absolute bottom-20 left-10 h-40 w-40 rounded-full bg-cyan-100/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-60 w-60 rounded-full bg-purple-50/50 blur-3xl"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>من نحن</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-black">نحن فريق </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                تعاريف
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              نؤمن بأن التكنولوجيا يجب أن تكون في خدمة الإنسان، لذلك نطور حلولاً
              عقارية مبتكرة تساعد المطورين والوسطاء على النجاح والنمو
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section
        className="py-20 bg-white"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="opacity-100 transform translate-y-0 transition-all duration-700 ease-out">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>قصتنا</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-black">بدأت الفكرة من </span>
                <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                  تحدٍ حقيقي
                </span>
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  في عام 2024، لاحظنا أن العديد من المطورين العقاريين والوسطاء
                  يواجهون صعوبات في إدارة أعمالهم رقمياً. كانوا يحتاجون إلى حلول
                  متعددة ومعقدة لبناء مواقعهم وإدارة عملائهم.
                </p>
                <p>
                  قررنا أن نغير هذا الواقع من خلال تطوير منصة واحدة تجمع كل ما
                  يحتاجونه: موقع احترافي، نظام إدارة عملاء، ومساعد ذكي للواتساب.
                </p>
                <p>
                  اليوم، نفخر بخدمة أكثر من{" "}
                  <strong className="text-black">67+ عميل</strong> في المملكة
                  العربية السعودية ودول الخليج.
                </p>
              </div>
            </div>
            <div className="opacity-100 transform translate-y-0 transition-all duration-700 ease-out">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">
                        67+
                      </div>
                      <div className="text-gray-600">عميل راضٍ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">
                        2+
                      </div>
                      <div className="text-gray-600">سنوات خبرة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">
                        24/7
                      </div>
                      <div className="text-gray-600">دعم فني</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-black mb-2">
                        99%
                      </div>
                      <div className="text-gray-600">وقت تشغيل</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50/30">
        <div className="container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-800 text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              <span>قيمنا</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="text-black">القيم التي </span>
              <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                نؤمن به
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              هذه القيم توجه كل قرار نتخذه وكل منتج نطوره
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1: Innovation */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">الابتكار</h3>
              <p className="text-gray-600">
                نسعى دائماً لتطوير حلول مبتكرة تواكب احتياجات السوق العقاري
                المتغيرة
              </p>
            </div>

            {/* Value 2: Quality */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-cyan-100 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">الجودة</h3>
              <p className="text-gray-600">
                نلتزم بأعلى معايير الجودة في كل منتج نطوره وكل خدمة نقدمها
              </p>
            </div>

            {/* Value 3: Customer Focus */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">التركيز على العميل</h3>
              <p className="text-gray-600">
                عملاؤنا في المقدمة دائماً، ونعمل على تحقيق أهدافهم ونجاحهم
              </p>
            </div>

            {/* Value 4: Transparency */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">الشفافية</h3>
              <p className="text-gray-600">
                نؤمن بالشفافية الكاملة في التعامل مع عملائنا وشركائنا
              </p>
            </div>

            {/* Value 5: Continuous Learning */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">التعلم المستمر</h3>
              <p className="text-gray-600">
                نستثمر في التطوير المستمر لفريقنا ومنتجاتنا لنبقى في المقدمة
              </p>
            </div>

            {/* Value 6: Social Impact */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-black hover:-translate-y-1 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">التأثير الإيجابي</h3>
              <p className="text-gray-600">
                نسعى لإحداث تأثير إيجابي في المجتمع من خلال تمكين رواد الأعمال
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section
        className="py-20 bg-gray-50/30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="opacity-100 transform translate-y-0 transition-all duration-700 ease-out">
              <div className="bg-white rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                    مهمتنا
                  </span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  تمكين المطورين العقاريين والوسطاء من النجاح في العصر الرقمي من
                  خلال توفير حلول تقنية متكاملة وسهلة الاستخدام تساعدهم على
                  إدارة أعمالهم بكفاءة أكبر وتحقيق نمو مستدام.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="opacity-100 transform translate-y-0 transition-all duration-700 ease-out">
              <div className="bg-white rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 mb-6 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Eye className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                    رؤيتنا
                  </span>
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  أن نكون المنصة الرائدة في المنطقة لتقديم الحلول التقنية
                  المتكاملة للقطاع العقاري، ونساهم في تحويل الصناعة العقارية إلى
                  بيئة رقمية متطورة تخدم جميع الأطراف بكفاءة وشفافية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container">
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
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <i className="fa-brands fa-snapchat h-5"></i>
                </a>
                <a
                  href="https://www.facebook.com/share/1HZffKAhn2/"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/taearif1"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@taearif"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
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
                    onClick={() => router.push('/')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/solutions')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    الحلول
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/about-us')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    من نحن
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/updates')}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    التحديثات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/privacy')}
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
