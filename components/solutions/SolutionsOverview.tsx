"use client";

import { Globe, Users, Home, Bot, Check } from "lucide-react";

export default function SolutionsOverview() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-black">أربعة حلول </span>
            <span className="gradient-text">في منصة واحدة</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم لك حلول متكاملة تغطي جميع احتياجاتك العقارية من بناء الموقع إلى
            إدارة العملاء والأملاك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Solution 1: Website Builder */}
          <div className="solution-card rounded-2xl p-8 hover-lift">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  منشئ المواقع العقارية
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  أنشئ موقعك العقاري الاحترافي خلال دقائق مع قوالب مصممة خصيصاً
                  للسوق العقاري السعودي
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    قوالب احترافية متنوعة
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    تصميم متجاوب مع الجوال
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    تحسين محركات البحث SEO
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Solution 2: CRM */}
          <div className="solution-card rounded-2xl p-8 hover-lift">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  نظام إدارة العملاء CRM
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  نظام متطور لإدارة علاقاتك مع العملاء وتتبع جميع التفاعلات
                  والصفقات بكفاءة عالية
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    قاعدة بيانات العملاء الشاملة
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    تتبع المكالمات والمواعيد
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-500" />
                    تقارير الأداء التفصيلية
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Solution 3: PMS */}
          <div className="solution-card rounded-2xl p-8 hover-lift">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Home className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  نظام إدارة الأملاك PMS
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  أدر محفظتك العقارية بسهولة مع تتبع الإيجارات والصيانة
                  والمدفوعات في مكان واحد
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    إدارة عقود الإيجار
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    تتبع المدفوعات والمستحقات
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-orange-500" />
                    إدارة طلبات الصيانة
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Solution 4: WhatsApp AI */}
          <div className="solution-card rounded-2xl p-8 hover-lift border-2 border-purple-200 relative">
            <div className="absolute -top-3 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              الأكثر طلباً
            </div>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  المساعد الذكي للواتساب
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  مساعد ذكي يعمل على مدار الساعة للرد على استفسارات العملاء وحفظ
                  بياناتهم تلقائياً
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    ردود تلقائية ذكية 24/7
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    حفظ بيانات العملاء تلقائياً
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-500" />
                    تكامل مع نظام CRM
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
