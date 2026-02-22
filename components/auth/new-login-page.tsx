"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockLogin } from "@/lib/mock/auth-mock";
import useAuthStore from "@/context/AuthContext";

type InputMode = "email" | "phone" | "unknown";

function detectInputMode(value: string): InputMode {
  const trimmed = value.trim();
  if (!trimmed) return "unknown";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "email";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length <= 9 && /^(05|5)/.test(digits)) return "phone";
  return "unknown";
}

function normalizePhone(value: string): string {
  const d = value.replace(/\D/g, "");
  return d.startsWith("0") ? d.slice(1) : d;
}

export function NewLoginPage() {
  const router = useRouter();
  const { UserIslogged, userData } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("unknown");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [twitterLoading, setTwitterLoading] = useState(false);

  useEffect(() => {
    if (UserIslogged && userData?.email) router.push("/dashboard");
  }, [UserIslogged, userData, router]);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    setError("");
    setInputMode(detectInputMode(e.target.value));
  };

  const handleSocial = async (provider: "google" | "twitter") => {
    const setLoading = provider === "google" ? setGoogleLoading : setTwitterLoading;
    setLoading(true);
    setError("");
    try {
      const { mockGoogleAuth, mockTwitterAuth } = await import("@/lib/mock/auth-mock");
      const result = provider === "google" ? await mockGoogleAuth() : await mockTwitterAuth();
      if (result.success && result.url) {
        if (typeof window !== "undefined") {
          localStorage.setItem("oauth_return_page", "login");
          window.location.href = result.url;
        }
      } else {
        setError(`فشل تسجيل الدخول بـ ${provider === "google" ? "Google" : "X"}`);
      }
    } catch {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      const id = identifier.trim();
      if (!id || !password) {
        setError("يرجى تعبئة جميع الحقول");
        return;
      }
      const loginId = inputMode === "phone" ? normalizePhone(id) : id;
      setIsLoading(true);
      try {
        const result = await mockLogin(loginId, password);
        if (!result.success || !result.user || !result.token) {
          setError(result.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
          return;
        }
        const res = await fetch("/api/user/setAuth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: result.user, UserToken: result.token }),
        });
        if (!res.ok) { setError("فشل في حفظ بيانات الجلسة"); return; }
        useAuthStore.setState({
          UserIslogged: true,
          userData: {
            email: result.user.email,
            token: result.token,
            username: result.user.username,
            first_name: result.user.first_name,
            last_name: result.user.last_name,
            onboarding_completed: result.user.onboarding_completed,
          },
        });
        router.push("/dashboard");
      } catch {
        setError("حدث خطأ أثناء الاتصال بالخادم");
      } finally {
        setIsLoading(false);
      }
    },
    [identifier, password, inputMode, router],
  );

  const anyLoading = isLoading || googleLoading || twitterLoading;

  return (
    <div dir="rtl">
      {/* Title */}
      <div className="mb-7 text-center">
        <h2 className="text-[22px] font-bold" style={{ color: "#1A1A1A" }}>
          تسجيل الدخول
        </h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          مرحباً بعودتك
        </p>
      </div>

      {/* Social — side by side */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <SocialBtn
          onClick={() => handleSocial("google")}
          loading={googleLoading}
          disabled={anyLoading}
          icon={<GoogleIcon />}
          label="Google"
        />
        <SocialBtn
          onClick={() => handleSocial("twitter")}
          loading={twitterLoading}
          disabled={anyLoading}
          icon={<XIcon />}
          label="X"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
        <span className="text-xs" style={{ color: "#9CA3AF" }}>أو</span>
        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {error && <ErrorBanner message={error} />}

        {/* Identifier */}
        <div className="relative">
          {inputMode === "phone" && (
            <div className="absolute inset-y-0 right-3 flex items-center gap-1 pointer-events-none">
              <Image src="/SAUDI_FLAG.svg" alt="SA" width={18} height={13} className="rounded-sm" />
              <span className="text-xs font-medium" style={{ color: "#6B7280" }}>+966</span>
            </div>
          )}
          <Input
            id="identifier"
            name="identifier"
            type="text"
            inputMode={inputMode === "phone" ? "numeric" : "email"}
            placeholder="البريد الإلكتروني أو رقم الجوال"
            value={identifier}
            onChange={handleIdentifierChange}
            autoComplete="username"
            className={`h-11 rounded-xl text-right text-sm ${inputMode === "phone" ? "pr-20" : "pr-4"}`}
            disabled={anyLoading}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 left-3 flex items-center"
            tabIndex={-1}
          >
            {showPassword
              ? <EyeOff className="h-4 w-4" style={{ color: "#9CA3AF" }} />
              : <Eye className="h-4 w-4" style={{ color: "#9CA3AF" }} />}
          </button>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            autoComplete="current-password"
            className="pl-10 h-11 rounded-xl text-right text-sm"
            disabled={anyLoading}
          />
        </div>

        {/* Forgot password */}
        <div className="flex justify-start">
          <Link href="/forgot-password" className="text-xs hover:underline" style={{ color: "#1A3C34" }}>
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 rounded-[20px] text-sm font-semibold mt-1"
          style={{ background: "#1A3C34", color: "#FFFFFF" }}
          disabled={anyLoading}
        >
          {isLoading ? <Spinner label="جاري تسجيل الدخول..." /> : "تسجيل الدخول"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
        ليس لديك حساب؟{" "}
        <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: "#1A3C34" }}>
          سجّل مجاناً
        </Link>
      </p>
    </div>
  );
}

// ── Shared micro-components ──────────────────────────────────────────────────

function SocialBtn({
  onClick, loading, disabled, icon, label,
}: {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 h-11 rounded-xl border text-sm font-medium transition-colors hover:bg-gray-50 disabled:opacity-60"
      style={{ borderColor: "#E5E7EB", color: "#374151" }}
    >
      {loading ? <Spinner /> : icon}
      {label}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm" style={{ background: "#FEF3E2", color: "#E07A3A" }}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      {message}
    </div>
  );
}

function Spinner({ label }: { label?: string }) {
  return (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {label}
    </span>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 488 512">
      <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 300 300" fill="currentColor">
      <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300L178.57 127.15zm-36.31 41.09-11.87-16.63L36.12 19.88H76.7l76.28 106.96 11.87 16.63L263.87 280.9h-40.57l-81.04-112.66z" />
    </svg>
  );
}
