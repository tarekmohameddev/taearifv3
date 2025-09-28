"use client"

import { useState } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface PropertiesErrorProps {
  error: string
  onRetry?: () => void
}

export default function PropertiesError({ error, onRetry }: PropertiesErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true)
      try {
        await onRetry()
      } finally {
        setIsRetrying(false)
      }
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto text-center px-4">
        
        {/* Error Icon */}
        <div className="relative mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          
          {/* تأثيرات بصرية */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-400 rounded-full animate-bounce"></div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          حدث خطأ في تحميل العقارات
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {error}
        </p>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="group bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
            {isRetrying ? 'جاري المحاولة...' : 'المحاولة مرة أخرى'}
          </button>
        )}

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">هل تحتاج مساعدة؟</h4>
          <p className="text-gray-600 mb-4">
            إذا استمرت المشكلة، يمكنك التواصل معنا للحصول على المساعدة.
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
      </div>
    </div>
  )
}
