"use client";

/**
 * مكون لعرض جميع أنواع الـ Shimmer الجديدة
 * يمكن استخدامه للاختبار والمقارنة
 */
export default function ShimmerShowcase() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen" dir="rtl">
      <h1 className="text-3xl font-bold text-center mb-8">عرض تأثيرات Shimmer الجديدة</h1>
      
      {/* Original Pulse */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Pulse الأصلي (3 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Enhanced Pulse */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Enhanced Pulse (3 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg animate-enhanced-pulse"></div>
      </div>

      {/* Shimmer */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Shimmer عادي (3 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Shimmer Slow */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Shimmer بطيء (4 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slow"></div>
        </div>
      </div>

      {/* Shimmer Ultra */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Shimmer Ultra ناعم (5 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-ultra"></div>
        </div>
      </div>

      {/* Wave */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Wave موجي (2.5 ثانية)</h2>
        <div className="h-16 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-wave"></div>
        </div>
      </div>

      {/* Gentle Fade */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Gentle Fade لطيف (2.5 ثانية)</h2>
        <div className="h-16 bg-gray-200 rounded-lg animate-gentle-fade"></div>
      </div>

      {/* Breathing */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Breathing تنفس (3 ثواني)</h2>
        <div className="h-16 bg-gray-200 rounded-lg animate-breathing"></div>
      </div>

      {/* Combined Effects */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">تأثيرات مدمجة</h2>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg animate-gentle-fade relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-ultra"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-shimmer-slow" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded-lg animate-breathing relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-slow" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded-lg animate-enhanced-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-wave" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      </div>

      {/* Performance Info */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">معلومات الأداء</h2>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>animate-shimmer-ultra:</strong> الأنعم والأبطأ (5 ثواني) - للعناصر المهمة</p>
          <p><strong>animate-shimmer-slow:</strong> بطيء ومتوسط (4 ثواني) - للمحتوى العادي</p>
          <p><strong>animate-shimmer:</strong> عادي (3 ثواني) - للاستخدام العام</p>
          <p><strong>animate-gentle-fade:</strong> تلاشي لطيف (2.5 ثانية) - للخلفيات</p>
          <p><strong>animate-breathing:</strong> تنفس (3 ثواني) - للعناصر التفاعلية</p>
          <p><strong>animate-wave:</strong> موجي (2.5 ثانية) - للتأثيرات الخاصة</p>
        </div>
      </div>
    </div>
  );
}
