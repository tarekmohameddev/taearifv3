'use client';

import React, { useState, useEffect } from 'react';
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
  MapPin,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

interface TenantAboutUsPageProps {
  tenantId: string;
}

export default function TenantAboutUsPage({ tenantId }: TenantAboutUsPageProps) {
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching tenant data
    const fetchTenantData = async () => {
      try {
        // This would be replaced with actual API call
        const mockData = {
          name: `شركة ${tenantId}`,
          description: "شركة عقارية رائدة في مجال الاستثمار العقاري",
          mission: "نقدم أفضل الخدمات العقارية لعملائنا",
          vision: "أن نكون الرائدين في السوق العقاري",
          values: [
            { title: "الجودة", description: "نلتزم بأعلى معايير الجودة" },
            { title: "الشفافية", description: "نؤمن بالشفافية الكاملة" },
            { title: "الابتكار", description: "نطور حلول مبتكرة" }
          ],
          team: [
            { name: "أحمد محمد", role: "المدير التنفيذي" },
            { name: "فاطمة علي", role: "مديرة المبيعات" },
            { name: "محمد حسن", role: "مدير التسويق" }
          ],
          stats: [
            { number: "100+", label: "عقار متاح" },
            { number: "50+", label: "عميل راضي" },
            { number: "5+", label: "سنوات خبرة" },
            { number: "95%", label: "معدل الرضا" }
          ],
          contact: {
            email: `info@${tenantId}.com`,
            phone: "+966 50 123 4567",
            address: "الرياض، المملكة العربية السعودية"
          }
        };
        
        setTenantData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [tenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!tenantData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">خطأ في التحميل</h1>
          <p className="text-gray-600">تعذر تحميل بيانات الشركة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">{tenantData.name}</h1>
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
              {tenantData.description}
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
                      {tenantData.vision}
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
                      {tenantData.mission}
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
            {tenantData.values.map((value: any, index: number) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
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
            {tenantData.team.map((member: any, index: number) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-black font-medium mb-3">{member.role}</p>
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
            {tenantData.stats.map((stat: any, index: number) => (
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
              <h3 className="text-xl font-bold mb-4">{tenantData.name}</h3>
              <p className="text-gray-400 leading-relaxed">
                {tenantData.description}
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
                <p className="flex items-center">
                  <Mail className="w-4 h-4 ml-2" />
                  {tenantData.contact.email}
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 ml-2" />
                  {tenantData.contact.phone}
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 ml-2" />
                  {tenantData.contact.address}
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {tenantData.name}. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
