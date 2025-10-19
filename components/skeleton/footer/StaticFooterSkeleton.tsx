"use client";

import { cn } from "@/lib/utils";

interface StaticFooterSkeletonProps {
  className?: string;
}

export function StaticFooterSkeleton({ className }: StaticFooterSkeletonProps) {
  return (
    <footer
      className={cn(
        "w-full bg-gray-800 text-white relative overflow-hidden",
        className
      )}
      style={{
        minHeight: "400px", // Footer height
      }}
    >
      {/* Background overlay skeleton */}
      <div className="absolute inset-0 bg-gray-700 opacity-50" />
      
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-16">
        {/* Main content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company info column */}
          <div className="space-y-4">
            {/* Logo skeleton */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 bg-gray-600 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-600 rounded animate-pulse" />
            </div>
            
            {/* Company description skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-600 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-600 rounded animate-pulse w-1/2" />
            </div>
            
            {/* Social links skeleton */}
            <div className="flex gap-3 mt-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 bg-gray-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Quick links column */}
          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-600 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-600 rounded animate-pulse"
                  style={{ 
                    width: `${60 + (i * 8)}%`,
                    animationDelay: `${i * 100}ms` 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Services column */}
          <div className="space-y-4">
            <div className="h-6 w-20 bg-gray-600 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-600 rounded animate-pulse"
                  style={{ 
                    width: `${50 + (i * 10)}%`,
                    animationDelay: `${i * 100}ms` 
                  }}
                />
              ))}
            </div>
          </div>

          {/* Contact info column */}
          <div className="space-y-4">
            <div className="h-6 w-16 bg-gray-600 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {/* Address skeleton */}
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse mt-1" />
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4" />
                </div>
              </div>
              
              {/* Phone skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse" />
                <div className="h-4 bg-gray-600 rounded animate-pulse w-32" />
              </div>
              
              {/* Email skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-600 rounded animate-pulse" />
                <div className="h-4 bg-gray-600 rounded animate-pulse w-40" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section skeleton */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright skeleton */}
            <div className="h-4 bg-gray-600 rounded animate-pulse w-48" />
            
            {/* Legal links skeleton */}
            <div className="flex gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-600 rounded animate-pulse"
                  style={{ 
                    width: `${60 + (i * 20)}px`,
                    animationDelay: `${i * 100}ms` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
    </footer>
  );
}

export default StaticFooterSkeleton;
