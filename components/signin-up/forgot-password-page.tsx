"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Mail, Phone, ArrowRight, ArrowLeft, Copy, Check, Eye, EyeOff, ExternalLink, Shield, Lock, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";
import useStore from "@/context/Store";

export function ForgotPasswordPage() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  
  // Zustand store
  const {
    userIdentifier,
    userMethod,
    resetCode,
    isCodeVerified,
    resetAttempts,
    isBlocked,
    setUserIdentifier,
    setUserMethod,
    setResetCode,
    setIsCodeVerified,
    setResetAttempts,
    setIsBlocked,
    resetUserAuth,
  } = useStore();

  // Local state
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  // حساب قوة كلمة المرور
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني أو رقم الهاتف");
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: identifier.trim(),
            method: method,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إرسال رمز إعادة التعيين");
      }

      // حفظ البيانات في Zustand store
      setUserIdentifier(identifier.trim());
      setUserMethod(method);
      setResetAttempts(data.attempts_remaining);
      setCountdown(60);
      setResendCountdown(60); // إضافة countdown لإعادة الإرسال
      
      if (data.attempts_remaining === 0) {
        setIsBlocked(true);
        toast.error("تم تجاوز الحد الأقصى للمحاولات. يرجى التواصل مع فريق الدعم.");
      } else {
        toast.success(`تم إرسال رمز إعادة التعيين بنجاح (المحاولة ${data.attempts_used}/3)`);
        setShowCodeForm(true);
        
        // إنشاء رابط إعادة التعيين
        const resetUrl = `app.taearif.com/reset?code=${data.code_for_testing || data.code}`;
        setResetUrl(resetUrl);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء الاتصال بالخادم";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetCode.trim()) {
      toast.error("يرجى إدخال رمز التحقق");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("يرجى إدخال كلمة المرور الجديدة");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("reset_password");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: resetCode.trim(),
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Invalid or expired code") {
          toast.error("الكود غير صحيح أو منتهي الصلاحية");
        } else {
          throw new Error(data.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
        }
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح");
      resetUserAuth(); // إعادة تعيين البيانات
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء الاتصال بالخادم";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.");
      return;
    }

    setIsLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("forgot_password");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: userIdentifier,
            method: userMethod,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إرسال رمز إعادة التعيين");
      }

      setResetAttempts(data.attempts_remaining);
      setResendCountdown(60);
      
      if (data.attempts_remaining === 0) {
        setIsBlocked(true);
        toast.error("تم تجاوز الحد الأقصى للمحاولات. يرجى التواصل مع فريق الدعم.");
      } else {
        toast.success(`تم إرسال رمز إعادة التعيين بنجاح (المحاولة ${data.attempts_used}/3)`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء الاتصال بالخادم";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(resetUrl);
      setCopied(true);
      toast.success("تم نسخ الرابط بنجاح");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("فشل في نسخ الرابط");
    }
  };

  const openResetLink = () => {
    window.open(`http://${resetUrl}`, '_blank');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // إذا كان المستخدم في مرحلة إدخال الكود وكلمة المرور
  if (showCodeForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4" dir="rtl">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
            <div className="md:absolute md:top-1 md:right-10">
              <Image
                src="/logo.png"
                alt="Website Builder Logo"
                width={200}
                height={142}
                className="h-[7rem] md:h-[7rem] w-auto object-contain invert"
              />
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white">
            <CardHeader className="text-center pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCodeForm(false);
                  resetUserAuth();
                }}
                className="absolute right-4 top-4 text-black hover:bg-gray-100"
              >
                <ArrowRight className="h-4 w-4 ml-1" />
                رجوع
              </Button>
              <CardTitle className="text-2xl font-bold text-black">
                إعادة تعيين كلمة المرور
              </CardTitle>
              <p className="text-sm text-gray-600">
                أدخل رمز التحقق وكلمة المرور الجديدة
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600">آمن ومشفر</span>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* Identifier Display */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-black">
                    {userMethod === "email" ? "البريد الإلكتروني" : "رقم الهاتف"}
                  </Label>
                  <Input
                    value={userIdentifier}
                    disabled
                    className="py-5 text-right bg-gray-100 text-gray-600"
                  />
                </div>

                {/* Verification Code */}
                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-sm font-medium text-black">
                    رمز التحقق
                  </Label>
                  <div className="relative">
                    <Input
                      id="resetCode"
                      type="text"
                      placeholder="●●●●●●"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="py-5 text-right text-center text-2xl font-bold tracking-[0.5em] placeholder:tracking-[0.5em] placeholder:text-gray-400"
                      maxLength={6}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <Key className="absolute inset-y-0 left-0 flex items-center pl-3 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {/* Resend Code Button with Countdown */}
                  <div className="flex justify-center mt-4">
                    {resendCountdown > 0 ? (
                      <div className="relative">
                        <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl shadow-lg backdrop-blur-sm">
                          {/* Animated Spinner */}
                          <div className="relative">
                            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-300 rounded-full animate-ping"></div>
                          </div>
                          
                          {/* Text */}
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium text-blue-700">
                              إعادة الإرسال متاحة خلال
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Countdown Timer */}
                              <div className="relative">
                                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg">
                                  <span className="text-xl font-bold">{resendCountdown}</span>
                                </div>
                                {/* Pulse Effect */}
                                <div className="absolute inset-0 w-12 h-12 bg-blue-400 rounded-xl animate-ping opacity-30"></div>
                              </div>
                              <span className="text-sm font-medium text-blue-600">ثانية</span>
                            </div>
                          </div>
                          
                          {/* Progress Ring */}
                          <div className="relative w-8 h-8">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-blue-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-blue-500"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray={`${(resendCountdown / 60) * 100}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={isLoading}
                        className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border border-green-200 text-green-700 hover:from-green-100 hover:via-emerald-100 hover:to-teal-100 hover:border-green-300 hover:shadow-lg transition-all duration-300 rounded-2xl shadow-md hover:scale-105"
                      >
                        <div className="relative">
                          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <span className="font-medium">إعادة إرسال الكود</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </Button>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-black">
                    كلمة المرور الجديدة
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="أدخل كلمة المرور الجديدة"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="py-5 text-right"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? "bg-red-500"
                                  : passwordStrength <= 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        {passwordStrength <= 2 && "ضعيف"}
                        {passwordStrength === 3 && "متوسط"}
                        {passwordStrength >= 4 && "قوي"}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-black">
                    تأكيد كلمة المرور
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="py-5 text-right"
                      autoComplete="new-password"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 mt-2 bg-black hover:bg-gray-800 text-white"
                  disabled={isLoading || !resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      جاري إعادة تعيين كلمة المرور...
                    </div>
                  ) : (
                    "إعادة تعيين كلمة المرور"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
          <div className="md:absolute md:top-1 md:right-10">
            <Image
              src="/logo.png"
              alt="Website Builder Logo"
              width={200}
              height={142}
              className="h-[7rem] md:h-[7rem] w-auto object-contain invert"
            />
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="text-center pb-4">
            <Link href="/login" className="absolute right-4 top-4">
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 ml-1" />
                رجوع
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-black">
              نسيت كلمة المرور؟
            </CardTitle>
            <p className="text-sm text-gray-600">
              أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز إعادة التعيين
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Lock className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500">آمن ومشفر</span>
            </div>
          </CardHeader>
          <CardContent>
            {isBlocked ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">تم تجاوز الحد الأقصى للمحاولات</p>
                  <p className="text-sm mt-1">
                    يرجى التواصل مع فريق الدعم للمساعدة
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = "mailto:support@taearif.com"}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  التواصل مع الدعم
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Tabs value={method} onValueChange={(value) => setMethod(value as "email" | "phone")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                      <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                        <Mail className="h-4 w-4" />
                        البريد الإلكتروني
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-black">
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@gmail.com"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="py-5 text-right"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="phone" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-black">
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+966 50 123 4567"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="py-5 text-right"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {resetAttempts < 3 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
                      <p>المحاولات المتبقية: {resetAttempts}</p>
                    </div>
                  )}

                  {countdown > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm text-center">
                      <p>يرجى الانتظار قبل إعادة المحاولة</p>
                      <p className="font-mono text-lg font-bold">{formatTime(countdown)}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-6 mt-2 bg-black hover:bg-gray-800 text-white"
                    disabled={isLoading || countdown > 0 || !identifier.trim()}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        جاري الإرسال...
                      </div>
                    ) : (
                      "إرسال رمز إعادة التعيين"
                    )}
                  </Button>
                </form>

                {resetUrl && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700 mb-2">تم إنشاء رابط إعادة التعيين:</p>
                    <div className="flex items-center gap-2">
                      <Input
                        value={resetUrl}
                        readOnly
                        className="text-sm cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => window.open(`http://${resetUrl}`, '_blank')}
                        title="اضغط لفتح الرابط في tab جديدة"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyToClipboard}
                        className="flex-shrink-0 border-gray-300 hover:bg-gray-100"
                        title="نسخ الرابط"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openResetLink}
                        className="flex-shrink-0 border-gray-300 hover:bg-gray-100"
                        title="فتح الرابط في tab جديدة"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      💡 اضغط على الرابط أو الزر الأزرق لفتحه في tab جديدة
                    </p>
                  </div>
                )}

                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    تذكر كلمة المرور؟{" "}
                    <Link
                      href="/login"
                      className="text-black font-semibold hover:underline"
                    >
                      تسجيل الدخول
                    </Link>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 