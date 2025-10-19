"use client";

import { cn } from "@/lib/utils";

interface HeaderSkeletonProps {
  className?: string;
}

export function HeaderSkeleton({ className }: HeaderSkeletonProps) {
  return (
    <header
      className={cn(
        "w-full bg-white border-b border-gray-200 sticky top-0 z-50",
        className
      )}
      style={{
        height: "96px", // Desktop height
      }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-4 px-4">
        {/* Logo Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          <div className="hidden sm:block">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Desktop Navigation Skeleton */}
        <nav className="mx-auto hidden items-center gap-6 md:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-16 bg-gray-200 rounded animate-pulse"
              style={{
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </nav>

        {/* Actions Skeleton */}
        <div className="ms-auto flex items-center gap-2">
          {/* User Profile Skeleton */}
          <div className="p-1.5 md:p-2">
            <div className="size-5 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Mobile Menu Button Skeleton */}
          <div className="md:hidden">
            <div className="size-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Responsive CSS for mobile/tablet heights */}
      <style jsx>{`
        @media (max-width: 1024px) {
          header {
            height: 80px;
          }
        }
        @media (max-width: 768px) {
          header {
            height: 64px;
          }
        }
      `}</style>
    </header>
  );
}

export default HeaderSkeleton;
