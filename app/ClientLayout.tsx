"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

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
    (state) => state.onboarding_completed,
  );
  const userData = useAuthStore((state) => state.userData);
  const setUserData = useAuthStore((state) => state.setUserData);
  const setUserIsLogged = useAuthStore((state) => state.setUserIsLogged);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const { setOnboardingCompleted } = useAuthStore();

  //   setUserData({
  //     email: userData.email,
  //     token: userData.token,
  //     username: userData.username,
  //     first_name: userData.first_name,
  //     last_name: userData.last_name,
  //     onboarding_completed: userData.onboarding_completed || false,
  //   });
  // setUserIsLogged(true);
  //
  useEffect(() => {
    setIsMounted(true);
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    console.log("ClientLayout check:", {
      isMounted,
      IsLoading,
      UserIslogged,
      pathname,
      shouldRedirect: isMounted &&
        !IsLoading &&
        !UserIslogged &&
        !pathname?.startsWith("/oauth") &&
        !pathname?.startsWith("/not-found") &&
        !pathname?.startsWith("/forgot-password") &&
        !pathname?.startsWith("/reset") &&
        !pathname?.startsWith("/register") &&
        pathname !== "/login"
    });

    if (
      isMounted &&
      !IsLoading &&
      !UserIslogged &&
      !pathname?.startsWith("/oauth") &&
      !pathname?.startsWith("/not-found") &&
      !pathname?.startsWith("/forgot-password") &&
      !pathname?.startsWith("/reset") &&
      !pathname?.startsWith("/register") &&
      pathname !== "/login"
    ) {
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
              router.push("/");
            }
          } catch (error) {
            router.push("/onboarding");
          }
        }
      } else {
        console.log("onboardingCompleted", onboardingCompleted);
        console.log("UserIslogged", UserIslogged);
      }
    }
    fetchUser();
  }, [isMounted, IsLoading, UserIslogged, router, onboardingCompleted]);

  useEffect(() => {
    if (pathname?.startsWith("/login")) {
      if (userData && userData.email) {
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
    "/test-reset"
  ];

  const isPublicPage = publicPages.some(page => pathname?.startsWith(page)) || 
                      pathname?.startsWith("/oauth") || 
                      pathname?.startsWith("/not-found");

  if (!UserIslogged && !isPublicPage) {
    return null;
  }

  return <>{children}</>;
}
