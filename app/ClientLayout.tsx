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
    if (isMounted && !IsLoading && !UserIslogged && !pathname?.startsWith("/oauth")) {
      router.push("/login");
    }
  }, [isMounted, IsLoading, UserIslogged, router]);

  useEffect(() => {
    async function fetchUser() {
      if (isMounted && !IsLoading && UserIslogged && !onboardingCompleted) {
        if (router.asPath !== "/onboarding") {
          try {
            const response = await axiosInstance.get("/user");
            const completed = response.data.onboarding_completed;
            setOnboardingCompleted(completed);
            if (completed === false) {
              router.push("/onboarding");
            }
          } catch (error) {
            router.push("/onboarding");
          }
        }
      }
    }
    fetchUser();
  }, [isMounted, IsLoading, UserIslogged, router, onboardingCompleted]);

  if (
    pathname !== "/login" &&
    pathname?.startsWith("/oauth")&&
    pathname !== "/register" &&
    pathname !== "/onboarding"
  ) {
    if (!UserIslogged) {
      return <></>;
    }
  }
  if (
    pathname == "/login" &&

    !pathname?.startsWith("/oauth")&&

    pathname == "/register" &&
    pathname == "/onboarding"
  ) {
    if (UserIslogged) {
    }
  }
  return <>{children}</>;
}
