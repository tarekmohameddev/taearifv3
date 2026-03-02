"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/store/onboarding";

/**
 * Redirects first-time users to the onboarding page automatically.
 * Runs once per store lifetime (controlled by `hasSeenWelcome`).
 * Does NOT redirect if the user is already on the onboarding page.
 */
export function OnboardingAutoRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { hasSeenWelcome, allCompleted, setHasSeenWelcome } = useOnboardingStore();

  useEffect(() => {
    if (
      !hasSeenWelcome &&
      !allCompleted &&
      !pathname?.includes("/dashboard/onboarding")
    ) {
      setHasSeenWelcome();
      const timer = setTimeout(() => {
        router.push("/dashboard/onboarding");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasSeenWelcome, allCompleted, pathname, router, setHasSeenWelcome]);

  return null;
}
