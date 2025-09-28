"use client"

export default function PropertySkeleton() {
  return (
    <div className="py-12 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              
              {/* العنوان ونوع العرض */}
              <div className="flex flex-row items-center justify-between">
                <div className="h-8 w-20 bg-gray-200 rounded-md md:h-11 md:w-28"></div>
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
              </div>

              {/* تفاصيل العقار */}
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded md:h-8"></div>
                <div className="h-6 w-full bg-gray-200 rounded"></div>
                <div className="h-8 w-1/2 bg-gray-200 rounded md:h-9"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* تفاصيل العقار في شبكة */}
              <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div className="w-4 h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded md:w-24"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded md:w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6">
                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                <div className="absolute bottom-2 right-2">
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Carousel للصور المصغرة */}
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative h-24 w-24 flex-shrink-0">
                    <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                    <div className="absolute bottom-1 right-1">
                      <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <div className="h-2 w-4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          
          {/* وصف العقار ونموذج الحجز */}
          <div className="flex-1">
            <div className="mb-8 md:mb-18">
              <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                <div className="h-6 w-32 bg-gray-200 rounded lg:h-7"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* نموذج الحجز */}
            <div className="flex flex-col gap-y-6">
              <div className="h-10 w-full bg-gray-200 rounded-md"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              
              <div className="flex flex-col gap-y-6 md:gap-y-8">
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-6 flex-1">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  <div className="flex flex-col gap-y-6 flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                <div className="flex flex-row gap-x-4">
                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>

                <div className="w-54 h-12 bg-gray-200 rounded-md mx-auto"></div>
              </div>
            </div>
          </div>

          {/* العقارات المشابهة */}
          <div className="flex-1">
            <div>
              <div className="h-10 w-full bg-gray-200 rounded-md mb-8"></div>
              
              {/* عرض العقارات المشابهة للديسكتوب */}
              <div className="hidden md:block space-y-8">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200">
                    <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                      <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-5 w-1/2 bg-gray-200 rounded"></div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="h-6 w-20 bg-gray-200 rounded"></div>
                        <div className="h-5 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="relative flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                      <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                      <div className="absolute bottom-5 right-2">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <div className="h-2 w-4 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* عرض العقارات المشابهة للموبايل */}
              <div className="block md:hidden">
                <div className="flex gap-4 overflow-x-auto">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px]">
                      <div className="w-full h-64 bg-gray-200 rounded-2xl"></div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded mt-4"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mt-2"></div>
                      <div className="flex flex-row items-center justify-between pt-4">
                        <div className="h-5 w-20 bg-gray-200 rounded"></div>
                        <div className="h-5 w-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
