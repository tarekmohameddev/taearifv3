"use client"

import { useRouter } from "next/navigation"
import { Home, Search, ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"

interface PropertyNotFoundProps {
  propertyId?: string
}

export default function PropertyNotFound({ propertyId }: PropertyNotFoundProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* الرمز الرئيسي */}
        <div className="relative mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center shadow-2xl">
            <Building2 className="w-16 h-16 text-emerald-600" />
          </div>
          
          {/* تأثيرات بصرية */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 -left-8 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600 mb-6">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          العقار غير موجود
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          {propertyId 
            ? `عذراً، لا يمكننا العثور على العقار رقم ${propertyId}. قد يكون العقار غير متاح أو تم حذفه.`
            : "عذراً، لا يمكننا العثور على العقار المطلوب. قد يكون العقار غير متاح أو تم حذفه."
          }
        </p>

        {/* البطاقات التفاعلية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* بطاقة البحث */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
              <Search className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ابحث عن عقارات أخرى</h3>
            <p className="text-gray-600 text-sm">استكشف مجموعة واسعة من العقارات المتاحة</p>
          </div>

          {/* بطاقة الصفحة الرئيسية */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">العودة للرئيسية</h3>
            <p className="text-gray-600 text-sm">انتقل إلى الصفحة الرئيسية لاستكشاف المزيد</p>
          </div>

          {/* بطاقة الرجوع */}
          <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <ArrowLeft className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">العودة للخلف</h3>
            <p className="text-gray-600 text-sm">ارجع إلى الصفحة السابقة</p>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/properties"
            className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
          >
            <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            تصفح العقارات
          </Link>
          
          <Link 
            href="/"
            className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            الصفحة الرئيسية
          </Link>
          
          <button 
            onClick={() => router.back()}
            className="group bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            العودة للخلف
          </button>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-16 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">هل تحتاج مساعدة؟</h4>
          <p className="text-gray-600 mb-4">
            إذا كنت تبحث عن عقار معين أو تحتاج مساعدة في العثور على ما تريد، لا تتردد في التواصل معنا.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:+966533150222" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              📞 0533150222
            </a>
            <span className="hidden sm:block text-gray-300">•</span>
            <a 
              href="tel:+966537180774" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              📞 0537180774
            </a>
            <span className="hidden sm:block text-gray-300">•</span>
            <a 
              href="mailto:guidealjwa22@gmail.com" 
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              ✉️ guidealjwa22@gmail.com
            </a>
          </div>
        </div>

        {/* تأثيرات بصرية إضافية */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-40 right-10 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}
