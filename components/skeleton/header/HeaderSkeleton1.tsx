"use client";

export default function HeaderSkeleton1() {
  return (
    <header
      className="w-full transition-all duration-300"
      style={{
        position: "sticky", // Default position
        top: 0,
        zIndex: 50,
        backgroundColor: "#ffffff", // Default background
        opacity: 0.8,
        backdropFilter: "blur(8px)", // Default blur
        height: "96px", // Default desktop height
      }}
      dir="rtl"
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Logo Image Skeleton */}
          <div className="h-16 w-16 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
              style={{ animationDelay: "3s" }}
            ></div>

            {/* Logo Icon Placeholder */}
            <div className="absolute inset-2 bg-gray-300 rounded animate-pulse opacity-60">
              <div className="absolute inset-1 bg-gray-400 rounded-sm animate-pulse opacity-40"></div>
            </div>
          </div>

          {/* Logo Text Skeleton */}
          <div className="h-6 bg-gray-200 rounded animate-breathing w-32 relative overflow-hidden">
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

        {/* Desktop Navigation Skeleton */}
        <nav className="mx-auto hidden items-center gap-6 md:flex">
          {[1, 2, 3, 4].map((index) => (
            <NavigationLinkSkeleton key={index} delay={index * 0.1} />
          ))}
        </nav>

        {/* Actions Section */}
        <div className="ms-auto flex items-center gap-2">
          {/* User Profile Icon Skeleton */}
          <div className="p-1.5 md:p-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-gentle-fade relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/60 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "2s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-200/40 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "4.5s" }}
              ></div>

              {/* User Icon Shape */}
              <div className="absolute inset-0.5 bg-gray-300 rounded-full animate-pulse opacity-50"></div>
            </div>
          </div>

          {/* Mobile Menu Button Skeleton */}
          <div className="md:hidden">
            <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded animate-breathing relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-ultra"
                style={{ animationDelay: "2.5s" }}
              ></div>
              <div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer-slow"
                style={{ animationDelay: "5s" }}
              ></div>

              {/* Menu Icon Lines */}
              <div className="absolute inset-2 flex flex-col justify-center gap-0.5">
                <div className="h-0.5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-0.5 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-0.5 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Individual Navigation Link Skeleton Component
function NavigationLinkSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative pb-2">
      {/* Link Text Skeleton */}
      <div className="h-5 bg-gray-100 rounded animate-gentle-fade w-16 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/50 to-transparent animate-shimmer-slow"
          style={{ animationDelay: `${delay * 2 + 1.5}s` }}
        ></div>
        <div
          className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-100/30 to-transparent animate-shimmer-ultra"
          style={{ animationDelay: `${delay * 2 + 4}s` }}
        ></div>
      </div>

      {/* Active Link Underline Skeleton (for first link to show active state) */}
      {delay === 0 && (
        <div className="absolute inset-x-0 -bottom-[6px] mx-auto">
          <div className="h-0.5 w-8 bg-gray-300 rounded-full animate-breathing relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent animate-shimmer-slow"
              style={{ animationDelay: `${delay * 2 + 2}s` }}
            ></div>
            <div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-shimmer-ultra"
              style={{ animationDelay: `${delay * 2 + 4.5}s` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
