'use client';

import React from 'react';
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
  Handshake
} from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">تعاريف</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">الرئيسية</a>
              <a href="/about-us" className="text-gray-900 font-medium">من نحن</a>
              <a href="/solutions" className="text-gray-600 hover:text-gray-900 transition-colors">الحلول</a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">اتصل بنا</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30`}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up">
              من <span className="text-black">نحن</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in-up">
              نحن فريق من الخبراء المتفانين في تطوير الحلول العقارية المبتكرة التي تساعد عملائنا على تحقيق أهدافهم الاستثمارية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                اكتشف المزيد
                <ArrowRight className="inline-block mr-2 w-4 h-4" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                رؤيتنا ورسالتنا
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">رؤيتنا</h3>
                    <p className="text-gray-600 leading-relaxed">
                      أن نكون الرائدين في مجال الحلول العقارية الرقمية في المنطقة، ونقدم تجربة استثمارية متميزة لعملائنا
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">رسالتنا</h3>
                    <p className="text-gray-600 leading-relaxed">
                      تطوير منصات عقارية مبتكرة تسهل عملية البحث والاستثمار في العقارات، مع توفير شفافية كاملة وخدمة عملاء متميزة
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-slide-up">
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Building2 className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">صورة توضيحية للفريق</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              قيمنا الأساسية
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نؤمن بقيم أساسية توجه عملنا وتساعدنا على تقديم أفضل الخدمات لعملائنا
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "الشفافية",
                description: "نؤمن بالشفافية الكاملة في جميع معاملاتنا وعلاقاتنا مع العملاء"
              },
              {
                icon: Heart,
                title: "الاهتمام بالعميل",
                description: "نضع احتياجات عملائنا في المقدمة ونعمل على تلبية توقعاتهم"
              },
              {
                icon: Zap,
                title: "الابتكار",
                description: "نستمر في تطوير حلول مبتكرة تستخدم أحدث التقنيات"
              },
              {
                icon: Award,
                title: "الجودة",
                description: "نلتزم بأعلى معايير الجودة في جميع خدماتنا ومنتجاتنا"
              },
              {
                icon: Users,
                title: "العمل الجماعي",
                description: "نؤمن بقوة العمل الجماعي والتعاون لتحقيق الأهداف المشتركة"
              },
              {
                icon: Globe,
                title: "الاستدامة",
                description: "نعمل على تطوير حلول مستدامة تفيد المجتمع والبيئة"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              فريقنا المتميز
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              فريق من الخبراء المتخصصين في مختلف المجالات التقنية والعقارية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد محمد",
                role: "المدير التنفيذي",
                description: "خبرة 15 عام في مجال التطوير العقاري والتكنولوجيا"
              },
              {
                name: "فاطمة علي",
                role: "مديرة التطوير",
                description: "متخصصة في تطوير الحلول التقنية المبتكرة"
              },
              {
                name: "محمد حسن",
                role: "مدير التسويق",
                description: "خبير في التسويق الرقمي والعلاقات العامة"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-black font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              إنجازاتنا بالأرقام
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              أرقام تعكس نجاحنا وتطورنا المستمر في مجال الحلول العقارية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "عميل راضي" },
              { number: "1000+", label: "عقار متاح" },
              { number: "50+", label: "مطور شريك" },
              { number: "99%", label: "معدل الرضا" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              انضم إلى رحلة النجاح معنا
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              ابدأ رحلتك الاستثمارية اليوم واكتشف الفرص العقارية المتميزة التي نقدمها
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                ابدأ الآن
                <ArrowRight className="inline-block mr-2 w-4 h-4" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200">
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">تعاريف</h3>
              <p className="text-gray-400 leading-relaxed">
                منصة عقارية متكاملة تقدم حلول مبتكرة للاستثمار العقاري
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</a></li>
                <li><a href="/about-us" className="text-gray-400 hover:text-white transition-colors">من نحن</a></li>
                <li><a href="/solutions" className="text-gray-400 hover:text-white transition-colors">الحلول</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">الخدمات</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">البحث عن عقارات</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">التقييم العقاري</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">الاستشارات</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">إدارة العقارات</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2 text-gray-400">
                <p>البريد الإلكتروني: info@taearif.com</p>
                <p>الهاتف: +966 50 123 4567</p>
                <p>العنوان: الرياض، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 تعاريف. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
