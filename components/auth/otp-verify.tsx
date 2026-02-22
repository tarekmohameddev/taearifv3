"use client";

import { useState, useEffect, useCallback } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface OTPVerifyProps {
  phone: string;
  countryCode?: string;
  onVerified: (verifiedToken: string) => void;
  onResend: () => Promise<void>;
  onBack: () => void;
  verifyFn: (phone: string, code: string) => Promise<{
    success: boolean;
    error?: string;
    verified_token?: string;
  }>;
}

const RESEND_SECONDS = 60;

/**
 * OTP verification step.
 * Shows 6-slot OTP input, auto-submits when 6 digits are entered,
 * and shows a countdown before allowing resend.
 */
export function OTPVerify({
  phone,
  countryCode = "+966",
  onVerified,
  onResend,
  onBack,
  verifyFn,
}: OTPVerifyProps) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length < 6 || isVerifying) return;
      setIsVerifying(true);
      setError("");
      try {
        const result = await verifyFn(phone, code);
        if (result.success && result.verified_token) {
          setSuccess(true);
          setTimeout(() => onVerified(result.verified_token!), 600);
        } else {
          setError(result.error || "رمز التحقق غير صحيح");
          setOtp("");
        }
      } catch {
        setError("حدث خطأ. يرجى المحاولة مرة أخرى.");
        setOtp("");
      } finally {
        setIsVerifying(false);
      }
    },
    [phone, isVerifying, onVerified, verifyFn],
  );

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify(otp);
    }
  }, [otp, handleVerify]);

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");
    setOtp("");
    try {
      await onResend();
      setCountdown(RESEND_SECONDS);
    } catch {
      setError("فشل إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedPhone = `${countryCode} ${phone.slice(0, 3)}***${phone.slice(-2)}`;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-1">
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "#E8F5EF" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1A3C34"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 17z" />
          </svg>
        </div>
        <h2
          className="text-xl font-bold"
          style={{ color: "#1A1A1A" }}
        >
          أدخل رمز التحقق
        </h2>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          أرسلنا رمزاً مكوناً من 6 أرقام إلى
        </p>
        <p className="text-sm font-semibold" style={{ color: "#1A3C34" }} dir="ltr">
          {maskedPhone}
        </p>
      </div>

      {/* OTP Input */}
      <div className="flex justify-center" dir="ltr">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => {
            setError("");
            setOtp(val);
          }}
          disabled={isVerifying || success}
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="w-11 h-12 rounded-xl border-2 text-lg font-bold transition-all"
                style={
                  success
                    ? { borderColor: "#4CAF82", background: "#E8F5EF" }
                    : error
                      ? { borderColor: "#E07A3A" }
                      : undefined
                }
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Status messages */}
      {error && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: "#FEF3E2", color: "#E07A3A" }}
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: "#E8F5EF", color: "#1A3C34" }}
        >
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          تم التحقق بنجاح! جاري المتابعة...
        </div>
      )}

      {/* Resend & Loading indicator */}
      {isVerifying && (
        <p className="text-center text-sm" style={{ color: "#6B7280" }}>
          جاري التحقق...
        </p>
      )}

      {/* Resend */}
      <div className="text-center space-y-2">
        {countdown > 0 ? (
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            إعادة الإرسال متاحة بعد{" "}
            <span className="font-semibold tabular-nums" style={{ color: "#1A3C34" }}>
              {countdown}
            </span>{" "}
            ثانية
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 disabled:opacity-50"
            style={{ color: "#1A3C34" }}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
            {isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
          </button>
        )}
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isVerifying || success}
        className="w-full text-center text-sm transition-opacity hover:opacity-70"
        style={{ color: "#6B7280" }}
      >
        ← تغيير رقم الهاتف
      </button>

      {/* Hint */}
      <p className="text-xs text-center" style={{ color: "#9CA3AF" }}>
        الرمز للاختبار:{" "}
        <span className="font-mono font-bold" style={{ color: "#1A3C34" }}>
          123456
        </span>
      </p>
    </div>
  );
}
