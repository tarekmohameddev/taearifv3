"use client"

export default function PropertiesSkeleton() {
  return (
    <div className="py-8 animate-pulse">
      <div className="mx-auto max-w-[1600px] px-4">
        
        {/* Filter Section Skeleton */}
        <div className="mb-8">
          <div className="h-12 w-full bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Properties Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              
              {/* Image Skeleton */}
              <div className="relative h-64 bg-gray-200">
                <div className="absolute top-4 right-4">
                  <div className="w-16 h-6 bg-gray-300 rounded"></div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                
                {/* Location */}
                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                
                {/* Price */}
                <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                
                {/* Features */}
                <div className="flex gap-2">
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
