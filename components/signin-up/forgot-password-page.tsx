"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Mail, Phone, ArrowRight, ArrowLeft, Copy, Check, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";

export function ForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [isBlocked, setIsBlocked] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Check for reset code in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const identifierParam = urlParams.get("identifier");
      
      if (code && identifierParam) {
        setResetCode(code);
        setIdentifier(identifierParam);
        setShowResetForm(true);
      }
    }
  }, []);

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

      setAttemptsRemaining(data.attempts_remaining);
      setCountdown(60);
      
      if (data.attempts_remaining === 0) {
        setIsBlocked(true);
        toast.error("تم تجاوز الحد الأقصى للمحاولات. يرجى التواصل مع فريق الدعم.");
      } else {
        toast.success(`تم إرسال رمز إعادة التعيين بنجاح (المحاولة ${data.attempts_used}/3)`);
        
        // إنشاء رابط إعادة التعيين
        const resetUrl = `app.taearif.com/reset?code=${data.code_for_testing}&identifier=${identifier}`;
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
            identifier: identifier,
            code: resetCode,
            new_password: newPassword,
            new_password_confirmation: confirmPassword,
            recaptcha_token: recaptchaToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }

      toast.success("تم تغيير كلمة المرور بنجاح");
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

  if (showResetForm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4" dir="rtl">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
            <div className="md:absolute md:top-1 md:right-10">
              <Image
                src="/logo.png"
                alt="Website Builder Logo"
                width={200}
                height={142}
                className="h-[7rem] md:h-[7rem] w-auto object-contain dark:invert"
              />
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResetForm(false)}
                className="absolute right-4 top-4"
              >
                <ArrowRight className="h-4 w-4 ml-1" />
                رجوع
              </Button>
              <CardTitle className="text-2xl font-bold text-foreground">
                إعادة تعيين كلمة المرور
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                أدخل كلمة المرور الجديدة
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
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
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-3"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 mt-2 bg-foreground hover:bg-foreground/90 text-background"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-background"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="w-full flex justify-center md:justify-end mb-8 md:mb-6">
          <div className="md:absolute md:top-1 md:right-10">
            <Image
              src="/logo.png"
              alt="Website Builder Logo"
              width={200}
              height={142}
              className="h-[7rem] md:h-[7rem] w-auto object-contain dark:invert"
            />
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <Link href="/login" className="absolute right-4 top-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 ml-1" />
                رجوع
              </Button>
            </Link>
            <CardTitle className="text-2xl font-bold text-foreground">
              نسيت كلمة المرور؟
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رمز إعادة التعيين
            </p>
          </CardHeader>
          <CardContent>
            {isBlocked ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-md">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">تم تجاوز الحد الأقصى للمحاولات</p>
                  <p className="text-sm mt-1">
                    يرجى التواصل مع فريق الدعم للمساعدة
                  </p>
                </div>
                <Button
                  onClick={() => window.location.href = "mailto:support@taearif.com"}
                  className="w-full"
                >
                  التواصل مع الدعم
                </Button>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Tabs value={method} onValueChange={(value) => setMethod(value as "email" | "phone")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        البريد الإلكتروني
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        رقم الهاتف
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="email" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
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
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
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

                  {attemptsRemaining < 3 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
                      <p>المحاولات المتبقية: {attemptsRemaining}</p>
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
                    className="w-full py-6 mt-2 bg-foreground hover:bg-foreground/90 text-background"
                    disabled={isLoading || countdown > 0}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-background"
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
                        className="flex-shrink-0"
                        title="نسخ الرابط"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={openResetLink}
                        className="flex-shrink-0"
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
                  <p className="text-sm text-muted-foreground">
                    تذكر كلمة المرور؟{" "}
                    <Link
                      href="/login"
                      className="text-foreground font-semibold hover:underline"
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