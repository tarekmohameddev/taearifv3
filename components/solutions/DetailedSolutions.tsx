'use client';

import { Globe, Users, Palette, Image, Search, Map, Database, Activity, Bell, Rocket } from 'lucide-react';

export default function DetailedSolutions() {
  return (
    <section className="py-20 bg-gray-50/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-black">تفاصيل</span>
            <span className="gradient-success">الحلول</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف كيف يمكن لكل حل أن يساهم في نمو أعمالك العقارية
          </p>
        </div>

        {/* Website Builder Details */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 text-purple-800 text-sm font-medium mb-6">
                <Globe className="h-4 w-4" />
                <span>منشئ المواقع</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">موقعك العقاري الاحترافي في دقائق</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                لا تحتاج لخبرة تقنية لإنشاء موقع عقاري متميز. اختر من بين قوالبنا المصممة خصيصاً للسوق السعودي وخصص موقعك ليعكس هويتك التجارية.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Palette className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">تخصيص الألوان والخطوط</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Image className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">معرض صور احترافي</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Search className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">محرك بحث متقدم</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Map className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">خرائط تفاعلية</span>
                </div>
              </div>
              <a href={`register/`} className="btn btn-success">
                <Rocket className="ml-2 h-5 w-5" />
                ابدأ إنشاء موقعك
              </a>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="aspect-video bg-gradient-to-br from-purple-50 to-cyan-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="h-8 w-8 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">موقعك العقاري</h4>
                    <p className="text-gray-600">جاهز للعرض والتسويق</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CRM Details */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold">أحمد محمد</div>
                      <div className="text-sm text-gray-500">مهتم بشقة في الرياض</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold">مكالمة مجدولة</div>
                      <div className="text-sm text-gray-500">غداً الساعة 2:00 م</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold">موعد معاينة</div>
                      <div className="text-sm text-gray-500">الأحد الساعة 10:00 ص</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-800 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>نظام CRM</span>
              </div>
              <h3 className="text-3xl font-bold mb-6">إدارة العملاء بذكاء</h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                احتفظ بجميع بيانات عملائك في مكان واحد، تابع تفاعلاتهم، وجدول مواعيدك بكفاءة. نظام CRM المصمم خصيصاً للوسطاء العقاريين.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">قاعدة بيانات شاملة للعملاء</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">تتبع نشاط العملاء والتفاعلات</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">تذكيرات تلقائية للمتابعة</span>
                </div>
              </div>
              <a href={`register/`} className="btn btn-primary">
                <Users className="ml-2 h-5 w-5" />
                جرب نظام CRM
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
