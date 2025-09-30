"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/context/AuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import InfoPopup from "@/components/ui/popup";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const fetchUserData = useAuthStore((state) => state.fetchUserData);
  const UserIslogged = useAuthStore((state) => state.UserIslogged);
  const IsLoading = useAuthStore((state) => state.IsLoading);
  const onboardingCompleted = useAuthStore(
    (state) => state.onboarding_completed
  );
  
  const userData = useAuthStore((state) => state.userData);
  const { setOnboardingCompleted } = useAuthStore();
  const [showPopup, setShowPopup] = useState(false);
  const clearMessage = useAuthStore((state) => state.clearMessage);
  const setMessage = useAuthStore((state) => state.setMessage);

  //   setUserData({
  //     email: userData.email,
  //     token: userData.token,
  //     username: userData.username,
  //     first_name: userData.first_name,
  //     last_name: userData.last_name,
  //     onboarding_completed: userData.onboarding_completed || false,
  //   });
  // setUserIsLogged(true);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // لا نحتاج لمسح الرسالة هنا لأن InfoPopup سيقوم بذلك
  };

  // function لاختبار الـ popup في development mode
  const testPopup = () => {
    setMessage("هذه رسالة اختبار للـ popup! 🎉");
    setShowPopup(true);
  };

  // مراقبة التغييرات في userData.message
  useEffect(() => {
    if (userData?.message && !showPopup) {
      setShowPopup(true);
    }
  }, [userData?.message, showPopup]);

  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, [fetchUserData]);

  // دالة للتحقق من الصفحات العامة مع دعم الـ locale
  const isPublicPageWithLocale = (pathname: string) => {
    const publicPages = [
      "/", // الصفحة الرئيسية
      "/oauth",
      "/not-found", 
      "/forgot-password",
      "/reset",
      "/register",
      "/login",
      "/landing",
      "/live-editor",
      "/properties",
      "/property",
      "/for-sale",
      "/for-rent"
    ];
    
    // التحقق من الصفحات العامة بدون locale
    if (publicPages.some(page => pathname?.startsWith(page))) {
      return true;
    }
    
    // التحقق من الصفحات العامة مع locale (en/ar/أو أي locale آخر)
    const localePattern = /^\/[a-z]{2}\//;
    if (localePattern.test(pathname)) {
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}\//, '/');
      return publicPages.some(page => pathWithoutLocale.startsWith(page));
    }
    
    // التحقق من الصفحات العامة مع locale فقط (مثل /en, /ar)
    const localeOnlyPattern = /^\/[a-z]{2}$/;
    if (localeOnlyPattern.test(pathname)) {
      return true; // الصفحة الرئيسية مع locale
    }
    
    return false;
  };

  useEffect(() => {
    if (
      isMounted &&
      !IsLoading &&
      !UserIslogged &&
      !isPublicPageWithLocale(pathname || "")
    ) {
      console.log("🔄 Redirecting to login - User not logged in");
      console.log("🔍 Auth state:", { isMounted, IsLoading, UserIslogged, pathname });
      router.push("/login");
    }
  }, [isMounted, IsLoading, UserIslogged, pathname, router]);

  useEffect(() => {
    async function fetchUser() {
      if (isMounted && !IsLoading && UserIslogged && !onboardingCompleted) {
        if (pathname !== "/onboarding") {
          try {
            const response = await axiosInstance.get("/user");
            const completed = response.data.data.onboarding_completed;
            setOnboardingCompleted(completed);
            if (completed == undefined) {
              router.push("/onboarding");
            }
          } catch (error) {
            router.push("/onboarding");
          }
        } else {
          try {
            const response = await axiosInstance.get("/user");
            const completed = response.data.data.onboarding_completed;
            setOnboardingCompleted(completed);
            if (completed == undefined) {
              router.push("/onboarding");
            } else {
              console.error("testtttttttttttttt");
              console.warn("testtttttttttttttt");
        
              router.push("/");
            }
          } catch (error) {
            router.push("/onboarding");
          }
        }
      } else {
      }
    }
    fetchUser();
  }, [isMounted, IsLoading, UserIslogged, router, onboardingCompleted]);

  useEffect(() => {
    if (pathname?.startsWith("/login")) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasToken = urlParams.get("token");
      if (userData && userData.email && !hasToken) {
        console.error("testtttttttttttttt 222222222222222");
        console.warn("testtttttttttttttt 222222222222222");
        router.push("/");
      }
    }
  }, [userData, router]);

  // السماح بصفحات معينة بدون تسجيل دخول
  const publicPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset",
    "/onboarding",
    "/test-reset",
    "/landing",
    "/live-editor",
  ];

  const isPublicPage = isPublicPageWithLocale(pathname || "") ||
    pathname?.startsWith("/oauth") ||
    pathname?.startsWith("/not-found");

  if (!UserIslogged && !isPublicPage) {
    return null;
  }

  return (
    <AuthProvider>
      {children}

      {showPopup && userData?.message && (
        <InfoPopup
          message={userData.message}
          isVisible={showPopup}
          onClose={handleClosePopup}
        />
      )}
    </AuthProvider>
  );
}
