"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OTPVerify } from "@/components/auth/otp-verify";
import { mockSendOTP, mockVerifyOTP, mockRegister } from "@/lib/mock/auth-mock";
import useAuthStore from "@/context/AuthContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

// ─── Step dots ───────────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {([1, 2, 3] as Step[]).map((n) => (
        <div
          key={n}
          className="h-1.5 rounded-full transition-all"
          style={{
            width: current === n ? 24 : 8,
            background: n <= current ? "#1A3C34" : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}

// ─── Shared micro-components ─────────────────────────────────────────────────

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

// ─── Step 1 — Phone ──────────────────────────────────────────────────────────

function PhoneStep({
  onOTPSent,
}: {
  onOTPSent: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const norm = digits.startsWith("0") ? digits.slice(1) : digits;
    if (!/^5\d{8}$/.test(norm)) {
      setError("رقم الجوال غير صالح. يجب أن يبدأ بـ 5 ويتكون من 9 أرقام");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const result = await mockSendOTP(norm, "+966");
      if (!result.success) { setError(result.error || "فشل إرسال الرمز"); return; }
      onOTPSent(norm);
    } catch {
      setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-bold" style={{ color: "#1A1A1A" }}>إنشاء حساب</h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>ابدأ بتأكيد رقم جوالك</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {error && <ErrorBanner message={error} />}

        <div className="relative">
          <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 pointer-events-none">
            <Image src="/SAUDI_FLAG.svg" alt="SA" width={18} height={13} className="rounded-sm" />
            <span className="text-xs font-medium" style={{ color: "#6B7280" }}>+966</span>
          </div>
          <Input
            type="tel"
            inputMode="numeric"
            placeholder="5XXXXXXXX"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(""); }}
            className="h-11 rounded-xl text-right text-sm pr-20"
            disabled={isLoading}
            maxLength={10}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-[20px] text-sm font-semibold"
          style={{ background: "#1A3C34", color: "#FFFFFF" }}
          disabled={isLoading}
        >
          {isLoading ? <Spinner label="جاري الإرسال..." /> : "إرسال رمز التحقق"}
        </Button>
      </form>

      <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
        لديك حساب؟{" "}
        <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: "#1A3C34" }}>
          سجّل الدخول
        </Link>
      </p>
    </div>
  );
}

// ─── Step 3 — Registration form ───────────────────────────────────────────────

function RegistrationStep({
  phone,
  verifiedToken,
}: {
  phone: string;
  verifiedToken: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refFromUrl = searchParams?.get("ref") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Auto-suggest subdomain from email
  useEffect(() => {
    if (email.includes("@") && !subdomain) {
      const base = email.split("@")[0].replace(/[^a-z0-9]/gi, "-").toLowerCase();
      setSubdomain(base);
    }
  }, [email, subdomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("البريد الإلكتروني غير صالح"); return;
    }
    if (!password || password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل"); return;
    }
    if (!subdomain || !/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) {
      setError("اسم الموقع غير صالح (أحرف إنجليزية صغيرة وأرقام وشرطات)"); return;
    }

    setIsLoading(true);
    try {
      const result = await mockRegister({
        email, password, phone,
        username: subdomain,
        verifiedToken,
        referralCode: refFromUrl || undefined,
      });

      if (!result.success || !result.user || !result.token) {
        setError(result.error || "فشل إنشاء الحساب"); return;
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
          onboarding_completed: false,
        },
      });

      setDone(true);
      setTimeout(() => router.push("/onboarding"), 1400);
    } catch {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10 space-y-3">
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#E8F5EF" }}>
          <CheckCircle2 className="h-7 w-7" style={{ color: "#4CAF82" }} />
        </div>
        <p className="text-lg font-bold" style={{ color: "#1A1A1A" }}>تم إنشاء الحساب!</p>
        <p className="text-sm" style={{ color: "#6B7280" }}>جاري التحويل...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-[22px] font-bold" style={{ color: "#1A1A1A" }}>أكمل بياناتك</h2>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>خطوة أخيرة لإنشاء حسابك</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate dir="rtl">
        {error && <ErrorBanner message={error} />}

        {/* Email */}
        <Input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          className="h-11 rounded-xl text-right text-sm"
          disabled={isLoading}
        />

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
            type={showPassword ? "text" : "password"}
            placeholder="كلمة المرور (8 أحرف على الأقل)"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            autoComplete="new-password"
            className="pl-10 h-11 rounded-xl text-right text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Subdomain */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-xs" style={{ color: "#9CA3AF" }}>.taearif.com</span>
          </div>
          <Input
            type="text"
            placeholder="اسم-موقعك"
            value={subdomain}
            onChange={(e) => { setSubdomain(e.target.value.toLowerCase()); setError(""); }}
            className="pl-28 h-11 rounded-xl text-sm"
            disabled={isLoading}
            dir="ltr"
          />
        </div>
        {subdomain && /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain) && (
          <p className="text-xs px-1" style={{ color: "#4CAF82" }}>
            ✓ {subdomain}.taearif.com
          </p>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-[20px] text-sm font-semibold mt-2"
          style={{ background: "#1A3C34", color: "#FFFFFF" }}
          disabled={isLoading}
        >
          {isLoading ? <Spinner label="جاري الإنشاء..." /> : "إنشاء الحساب"}
        </Button>
      </form>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function NewSignupPage() {
  const [step, setStep] = useState<Step>(1);
  const [phone, setPhone] = useState("");
  const [verifiedToken, setVerifiedToken] = useState("");

  return (
    <div dir="rtl">
      <StepDots current={step} />

      {step === 1 && (
        <PhoneStep
          onOTPSent={(ph) => { setPhone(ph); setStep(2); }}
        />
      )}

      {step === 2 && (
        <OTPVerify
          phone={phone}
          countryCode="+966"
          onVerified={(token) => { setVerifiedToken(token); setStep(3); }}
          onResend={async () => { await mockSendOTP(phone, "+966"); }}
          onBack={() => setStep(1)}
          verifyFn={mockVerifyOTP}
        />
      )}

      {step === 3 && (
        <RegistrationStep phone={phone} verifiedToken={verifiedToken} />
      )}
    </div>
  );
}
