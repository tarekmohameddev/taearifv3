"use client";

import { memo } from "react";
import { 
  StaticHeaderSkeleton1,
  HeroSkeleton1,
  GridSkeleton1
} from "@/components/skeleton";

// تحسين الأداء باستخدام memo
const UpdatesLoadingContent = memo(function UpdatesLoadingContent() {
  return (
    <main className="flex-1">
    </main>
  );
});

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
    </div>
  );
}
