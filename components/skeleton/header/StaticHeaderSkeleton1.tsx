"use client";

export default function StaticHeaderSkeleton1() {
  return (
    <>
      {/* Dynamic CSS for responsive heights - matching original */}
      <style jsx>{`
        .responsive-header-skeleton {
          height: 96px; /* Desktop height */
        }
        @media (max-width: 1024px) {
          .responsive-header-skeleton {
            height: 80px; /* Tablet height */
          }
        }
        @media (max-width: 768px) {
          .responsive-header-skeleton {
            height: 64px; /* Mobile height */
          }
        }
      `}</style>

      <header
        className="w-full transition-all duration-1000 responsive-header-skeleton sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200 animate-pulse"
        dir="rtl"
      >
        {/* Ultra Smooth Background Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-ultra"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer-slow"
          style={{ animationDelay: "2.5s" }}
        ></div>

        <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4 relative z-10">
          {/* Logo Section Skeleton */}
          <div className="flex items-center gap-2">
            {/* Logo Image Skeleton */}
            <div className="h-12 w-12 md:h-16 md:w-16 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "3s" }}
              ></div>
            </div>

            {/* Logo Text Skeleton */}
            <div className="hidden sm:block">
              <div className="h-6 w-32 md:h-7 md:w-40 bg-gray-200 rounded animate-breathing relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "3.5s" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Skeleton */}
          <nav className="mx-auto hidden items-center gap-6 md:flex">
            {/* Generate 5 navigation items (matching default menu) */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="relative pb-2">
                {/* Navigation Link Skeleton */}
                <div
                  className={`h-6 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden ${
                    index === 0
                      ? "w-16" // الرئيسية
                      : index === 1
                        ? "w-14" // للإيجار
                        : index === 2
                          ? "w-12" // للبيع
                          : index === 3
                            ? "w-16" // من نحن
                            : "w-20" // تواصل معنا
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                    style={{ animationDelay: `${1.5 + index * 0.5}s` }}
                  ></div>
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
                    style={{ animationDelay: `${4 + index * 0.5}s` }}
                  ></div>
                </div>

                {/* Active Link Indicator (first item active) */}
                {index === 0 && (
                  <div className="absolute inset-x-0 -bottom-[6px] mx-auto block h-[2px] w-8 rounded-full bg-gray-300 animate-breathing relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/70 to-transparent animate-shimmer-slow"
                      style={{ animationDelay: `${2 + index * 0.5}s` }}
                    ></div>
                    <div
                      className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer-ultra"
                      style={{ animationDelay: `${4.5 + index * 0.5}s` }}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions Section Skeleton */}
          <div className="ms-auto flex items-center gap-2">
            {/* Search Input Skeleton (Desktop) */}
            <div className="relative hidden md:block">
              <div className="w-48 h-10 bg-gray-100 border border-gray-200 rounded-lg animate-gentle-fade relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "5s" }}
                ></div>
              </div>
              {/* Search Icon Skeleton */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="w-4 h-4 bg-gray-300 rounded animate-breathing relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer-slow"
                    style={{ animationDelay: "3s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* User Profile Icon Skeleton */}
            <div className="p-1.5 md:p-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "3.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "6s" }}
                ></div>
              </div>
            </div>

            {/* Cart Icon Skeleton (Optional) */}
            <div className="p-1.5 md:p-2 relative">
              <div className="w-5 h-5 bg-gray-200 rounded animate-breathing relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "4s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "6.5s" }}
                ></div>
              </div>
              {/* Cart Badge Skeleton */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-300 rounded-full animate-gentle-fade relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "4.5s" }}
                ></div>
              </div>
            </div>

            {/* Wishlist Icon Skeleton (Optional) */}
            <div className="p-1.5 md:p-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "7.5s" }}
                ></div>
              </div>
            </div>

            {/* Notifications Icon Skeleton (Optional) */}
            <div className="p-1.5 md:p-2 relative">
              <div className="w-5 h-5 bg-gray-200 rounded animate-breathing relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "5.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "8s" }}
                ></div>
              </div>
              {/* Notification Badge Skeleton */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full animate-gentle-fade relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "6s" }}
                ></div>
              </div>
            </div>

            {/* Mobile Menu Button Skeleton */}
            <div className="md:hidden">
              <div className="w-10 h-10 bg-transparent border border-gray-200 rounded-md animate-gentle-fade flex items-center justify-center relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/40 to-transparent animate-shimmer-slow"
                  style={{ animationDelay: "6.5s" }}
                ></div>
                <div
                  className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-50/20 to-transparent animate-shimmer-ultra"
                  style={{ animationDelay: "9s" }}
                ></div>
                {/* Menu Icon Skeleton */}
                <div className="w-5 h-5 bg-gray-300 rounded animate-breathing relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer-ultra"
                    style={{ animationDelay: "7s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
