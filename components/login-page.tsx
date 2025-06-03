"use client";
import Image from "next/image";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "@/context/AuthContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const { login, errorLogin, IsLoading, userData } = useAuthStore();
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  useEffect(() => {
    if (userData.email) {
      router.push("/");
    }
  }, [userData, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      email: !formData.email ? "البريد الإلكتروني مطلوب" : "",
      password: !formData.password ? "كلمة المرور مطلوبة" : "",
      general: "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== "")) return;

    // Check if reCAPTCHA is available
    if (!executeRecaptcha) {
      console.log("!executeRecaptcha");
      setErrors((prev) => ({
        ...prev,
        general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
      }));
      return;
    }

    setIsLoading(true);
    try {
      const token = await executeRecaptcha("login");
      const result = await login(formData.email, formData.password, token);
      if (!result.success) {
        setErrors((prev) => ({
          ...prev,
          general: result.error || "فشل تسجيل الدخول",
        }));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء الاتصال بالخادم";
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-background p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Logo - Positioned absolute top right - Larger size */}
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
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          تسجيل الدخول
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 ml-2" />
              {errors.general}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={`py-5 text-right ${errors.email ? "border-destructive" : ""}`}
            />
            {errors.email && (
              <p className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-3 w-3 ml-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Link
                href="/forgot-password"
                className="text-sm text-foreground hover:underline"
              >
                نسيت كلمة المرور؟
              </Link>
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                كلمة المرور
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                className={`py-5 text-right ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-3 w-3 ml-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-medium cursor-pointer text-foreground"
            >
              تذكرني
            </Label>
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
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link
              href="/register"
              className="text-foreground font-semibold hover:underline"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              أو الدخول باستخدام
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full py-5 flex items-center justify-center"
          onClick={() => {
            // Handle Google sign-in
          }}
        >
          <svg
            className="ml-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Google
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-8">
          بالاستمرار، فإنك توافق على{" "}
          <Link
            href="/terms"
            className="text-foreground underline hover:no-underline"
          >
            شروط الخدمة
          </Link>{" "}
          و{" "}
          <Link
            href="/privacy"
            className="text-foreground underline hover:no-underline"
          >
            سياسة الخصوصية
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
