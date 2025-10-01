"use client";

import {
  Zap,
  ShieldCheck,
  Headphones,
  TrendingUp,
  Smartphone,
  DollarSign,
} from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-black">لماذا تختار</span>
            <span className="gradient-text">حلول تعاريف؟</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نقدم لك مزايا فريدة تجعل أعمالك العقارية أكثر كفاءة ونجاحاً
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">سرعة في التنفيذ</h3>
            <p className="text-gray-600">
              ابدأ عملك خلال دقائق وليس أسابيع. حلولنا جاهزة للاستخدام فوراً
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-cyan-100 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">أمان وموثوقية</h3>
            <p className="text-gray-600">
              بياناتك محمية بأعلى معايير الأمان مع نسخ احتياطية تلقائية
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <Headphones className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">دعم فني 24/7</h3>
            <p className="text-gray-600">
              فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي وقت
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">نمو مستدام</h3>
            <p className="text-gray-600">
              حلول قابلة للتوسع تنمو مع نمو أعمالك دون قيود أو تعقيدات
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">متوافق مع الجوال</h3>
            <p className="text-gray-600">
              جميع حلولنا مصممة للعمل بسلاسة على جميع الأجهزة والشاشات
            </p>
          </div>

          {/* Benefit 6 */}
          <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 hover-lift">
            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-4">أسعار تنافسية</h3>
            <p className="text-gray-600">
              احصل على أفضل قيمة مقابل استثمارك مع خطط مرنة تناسب ميزانيتك
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
