"use client";

export default function HeroSkeleton2() {
  return (
    <section className="relative w-full min-h-[229px] md:min-h-[368px] flex items-center justify-center overflow-hidden bg-white">
      {/* White Background with Subtle Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 to-transparent animate-shimmer"></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/20 to-transparent animate-shimmer"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Light Overlay for Contrast */}
      <div className="absolute inset-0 bg-gray-100/20"></div>

      {/* Content Container */}
      <div className="relative z-10 text-center px-4">
        {/* Main Title Skeleton */}
        <div className="mb-4 md:mb-10">
          {/* Desktop Title (60px) */}
          <div className="hidden md:block space-y-3">
            <div className="h-14 lg:h-16 bg-gray-200 rounded-lg animate-pulse mx-auto w-3/4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
            <div className="h-14 lg:h-16 bg-gray-200 rounded-lg animate-pulse mx-auto w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-14 lg:h-16 bg-gray-200 rounded-lg animate-pulse mx-auto w-2/3 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.4s" }}
              ></div>
            </div>
          </div>

          {/* Mobile Title (36px) */}
          <div className="block md:hidden space-y-2">
            <div className="h-9 bg-gray-200 rounded-lg animate-pulse mx-auto w-4/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
            <div className="h-9 bg-gray-200 rounded-lg animate-pulse mx-auto w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.2s" }}
              ></div>
            </div>
            <div className="h-9 bg-gray-200 rounded-lg animate-pulse mx-auto w-3/4 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer"
                style={{ animationDelay: "1.4s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="text-center">
          {/* Desktop Description (30px) */}
          <div className="hidden md:block space-y-2 max-w-2xl mx-auto">
            <div className="h-7 lg:h-8 bg-gray-100 rounded-lg animate-pulse mx-auto w-5/6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
            <div className="h-7 lg:h-8 bg-gray-100 rounded-lg animate-pulse mx-auto w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.8s" }}
              ></div>
            </div>
            <div className="h-7 lg:h-8 bg-gray-100 rounded-lg animate-pulse mx-auto w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>

          {/* Mobile Description (15px) */}
          <div className="block md:hidden space-y-1 max-w-sm mx-auto">
            <div className="h-4 bg-gray-100 rounded-lg animate-pulse mx-auto w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.6s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.6s" }}
              ></div>
            </div>
            <div className="h-4 bg-gray-100 rounded-lg animate-pulse mx-auto w-5/6 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "0.8s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "1.8s" }}
              ></div>
            </div>
            <div className="h-4 bg-gray-100 rounded-lg animate-pulse mx-auto w-4/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-shimmer"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/30 to-transparent animate-shimmer"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Decorative Elements */}
      <div className="absolute top-4 left-4 w-3 h-3 bg-gray-200 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-8 right-6 w-2 h-2 bg-gray-200 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-6 left-8 w-4 h-4 bg-gray-200 rounded-full animate-pulse opacity-20"></div>
      <div className="absolute bottom-4 right-4 w-3 h-3 bg-gray-200 rounded-full animate-pulse opacity-35"></div>
    </section>
  );
}
