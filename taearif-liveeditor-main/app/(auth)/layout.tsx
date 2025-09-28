import type React from "react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { LanguageSelector } from "@/components/ui/language-selector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <AnimatedBackground />
      
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <LanguageSelector />
      </div>
      
      <div className="flex min-h-screen flex-col items-center justify-center relative z-10">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center space-x-3 text-2xl font-bold text-gray-900"
        >
          <div className="relative">
            <Icons.logo className="h-8 w-8 text-blue-600" />
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg" />
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Taearif Platform
          </span>
        </Link>
        
        {/* Main Content Card */}
        <div className="mx-auto w-full max-w-md">
          <div className="relative">
            {/* Card Background with Glass Effect */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl" />
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
              {children}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Taearif Platform. All rights reserved.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
