"use client";

import { memo } from "react";
import {
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  FilterButtonsSkeleton1,
} from "@/components/skeleton";

// تحسين الأداء باستخدام memo
const LandingLoadingContent = memo(function LandingLoadingContent() {
  return (
    <main className="flex-1">
      <HeroSkeleton1 />
      <FilterButtonsSkeleton1 />
    </main>
  );
});

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeaderSkeleton1 />
      <LandingLoadingContent />
    </div>
  );
}
