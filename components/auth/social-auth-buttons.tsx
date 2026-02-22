"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockGoogleAuth, mockTwitterAuth } from "@/lib/mock/auth-mock";

interface SocialAuthButtonsProps {
  /** "login" | "signup" — affects button label copy */
  mode: "login" | "signup";
  onError?: (message: string) => void;
}

/**
 * Renders Google and X (Twitter) OAuth buttons.
 * On click each fetches the OAuth redirect URL from the mock service
 * (swap mockGoogleAuth / mockTwitterAuth with real fetch calls later)
 * then redirects the browser to that URL.
 */
export function SocialAuthButtons({ mode, onError }: SocialAuthButtonsProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  const label = mode === "login" ? "الدخول" : "التسجيل";

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      // Store return page so the OAuth callback knows where to redirect
      if (typeof window !== "undefined") {
        localStorage.setItem("oauth_return_page", mode === "signup" ? "register" : "login");
      }
      const result = await mockGoogleAuth();
      if (!result.success || !result.url) {
        throw new Error("تعذّر الحصول على رابط Google");
      }
      window.location.href = result.url;
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "فشل تسجيل الدخول بـ Google");
      setGoogleLoading(false);
    }
  };

  const handleTwitter = async () => {
    setTwitterLoading(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("oauth_return_page", mode === "signup" ? "register" : "login");
      }
      const result = await mockTwitterAuth();
      if (!result.success || !result.url) {
        throw new Error("تعذّر الحصول على رابط X");
      }
      window.location.href = result.url;
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "فشل تسجيل الدخول بـ X");
      setTwitterLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 rounded-[20px] border text-sm font-medium transition-all hover:bg-gray-50"
        style={{ borderColor: "#E5E7EB", color: "#374151" }}
        onClick={handleGoogle}
        disabled={googleLoading || twitterLoading}
      >
        {googleLoading ? (
          <Spinner />
        ) : (
          <GoogleIcon />
        )}
        {label} باستخدام Google
      </Button>

      {/* X / Twitter */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 rounded-[20px] border text-sm font-medium transition-all hover:bg-gray-50"
        style={{ borderColor: "#E5E7EB", color: "#374151" }}
        onClick={handleTwitter}
        disabled={googleLoading || twitterLoading}
      >
        {twitterLoading ? (
          <Spinner />
        ) : (
          <XIcon />
        )}
        {label} باستخدام X
      </Button>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 488 512" fill="none">
      <path
        fill="#4285F4"
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 300 300" fill="currentColor">
      <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300L178.57 127.15zm-36.31 41.09-11.87-16.63L36.12 19.88H76.7l76.28 106.96 11.87 16.63L263.87 280.9h-40.57l-81.04-112.66z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
