// app/not-found.tsx (للـ App Router) أو pages/404.tsx (للـ Pages Router)
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ArrowRight, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NotFoundPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(20);

  // عد تنازلي للتوجيه التلقائي
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="Website Builder Logo"
            width={150}
            height={107}
            className="h-20 w-auto mx-auto object-contain dark:invert"
          />
        </div>

        {/* رقم 404 كبير */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-black dark:text-white leading-none">
            404
          </h1>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-1 bg-black dark:bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* النصوص الرئيسية */}
        <div className="mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
            عذراً، الصفحة غير موجودة
          </h2>
          <p className="text-lg text-black dark:text-white max-w-md mx-auto leading-relaxed">
            يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها أو أن الرابط غير صحيح
          </p>
        </div>

        {/* شريط البحث */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث عن ما تريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-3 text-right text-lg border-2 border-black dark:border-white focus:border-black dark:focus:border-white rounded-full text-black dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black dark:text-white hover:text-black dark:hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button
            onClick={() => router.push("/")}
            className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="ml-2 h-5 w-5" />
            العودة للرئيسية
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 text-black dark:text-white"
          >
            <ArrowRight className="ml-2 h-5 w-5" />
            العودة للخلف
          </Button>

          <Button
            onClick={() => window.location.reload()}
            variant="ghost"
            className="text-black dark:text-white hover:text-black dark:hover:text-white px-6 py-3 rounded-full text-lg font-medium transition-all duration-300"
          >
            <RefreshCw className="ml-2 h-5 w-5" />
            إعادة تحميل
          </Button>
        </div>

        {/* العد التنازلي */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 inline-block border border-black dark:border-white">
            <p className="text-black dark:text-white">
              سيتم توجيهك للصفحة الرئيسية خلال{" "}
              <span className="font-bold text-black dark:text-white text-xl">
                {countdown}
              </span>{" "}
              ثانية
            </p>
          </div>
        </div>

        {/* روابط مفيدة */}
        <div className="border-t border-black dark:border-white pt-8">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            روابط مفيدة:
          </h3>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/login" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              تسجيل الدخول
            </Link>
            <span className="text-black dark:text-white">•</span>
            <Link 
              href="/register" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              إنشاء حساب
            </Link>
            <span className="text-black dark:text-white">•</span>
            <Link 
              href="/help" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              المساعدة
            </Link>
            <span className="text-black dark:text-white">•</span>
            <Link 
              href="/contact" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              اتصل بنا
            </Link>
          </div>
        </div>

        {/* تأثيرات بصرية */}
        <div className="absolute top-1/4 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}