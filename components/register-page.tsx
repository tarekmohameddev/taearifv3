"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuthStore from "@/context/AuthContext";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  HelpCircle,
  Info,
  ArrowRight,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Lock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";

// تعريف واجهة البيانات الخاصة بالنموذج
interface FormData {
  email: string;
  phone: string;
  subdomain: string;
  password: string;
}

// تعريف واجهة الأخطاء الخاصة بالنموذج
interface Errors {
  email: string;
  api: string;
  phone: string;
  subdomain: string;
  password: string;
  general: string;
}

export function RegisterPage() {
  const { UserIslogged } = useAuthStore();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    subdomain: "",
    password: "",
  });

  // حالة الأخطاء
  const [errors, setErrors] = useState<Errors>({
    email: "",
    api: "",
    phone: "",
    subdomain: "",
    password: "",
    general: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [subdomainFocused, setSubdomainFocused] = useState(false);
  const [subdomainSuggestions, setSubdomainSuggestions] = useState<string[]>(
    [],
  );

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "البريد الإلكتروني مطلوب";
    if (!emailRegex.test(email)) return "البريد الإلكتروني غير صالح";
    return "";
  };

  // Validate phone
  const validatePhone = (phone: string) => {
    // Saudi phone validation (9 digits after the country code)
    const phoneRegex = /^(5\d{8})$/;
    if (!phone) return "رقم الهاتف مطلوب";
    if (!phoneRegex.test(phone))
      return "رقم الهاتف غير صالح (يجب أن يبدأ بـ 5 ويتكون من 9 أرقام)";
    return "";
  };

  // Validate subdomain
  const validateSubdomain = (subdomain: string) => {
    // Check for Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    // Check for valid domain format (letters, numbers, hyphens, no spaces)
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

    if (!subdomain) return "اسم موقعك الإلكتروني مطلوب";
    if (arabicRegex.test(subdomain))
      return "لا يمكن استخدام الأحرف العربية في اسم الموقع";
    if (!subdomainRegex.test(subdomain))
      return "اسم الموقع يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط";
    return "";
  };

  // Validate password - simplified
  const validatePassword = (password: string) => {
    if (!password) return "كلمة المرور مطلوبة";
    return "";
  };

  useEffect(() => {
    if (UserIslogged == true) {
      router.push("/");
    }
  }, [UserIslogged]);

  // Generate subdomain suggestions based on email
  useEffect(() => {
    if (formData.email && formData.email.includes("@")) {
      const username = formData.email.split("@")[0];
      // Generate suggestions based on email username
      const suggestions = [
        username.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        `${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}-site`,
        `my-${username.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      ];
      setSubdomainSuggestions(suggestions);
    }
  }, [formData.email]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Handle subdomain suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      subdomain: suggestion,
    }));
    setErrors((prev) => ({
      ...prev,
      subdomain: "",
    }));
  };

  // Validate current step
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      const emailError = validateEmail(formData.email);
      const phoneError = validatePhone(formData.phone);

      newErrors.email = emailError;
      newErrors.phone = phoneError;

      if (emailError || phoneError) {
        isValid = false;
      }
    } else if (step === 2) {
      const subdomainError = validateSubdomain(formData.subdomain);
      newErrors.subdomain = subdomainError;

      if (subdomainError) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle previous step
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const newErrors: Errors = {
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      subdomain: validateSubdomain(formData.subdomain),
      password: validatePassword(formData.password),
      general: "", // تهيئة الحقل الجديد
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      try {
        // التحقق من توفر executeRecaptcha
        if (!executeRecaptcha) {
          setErrors((prev) => ({
            ...prev,
            general: "reCAPTCHA غير متاح. يرجى المحاولة لاحقًا.",
          }));
          setIsSubmitting(false);
          return;
        }

        // الحصول على رمز reCAPTCHA
        const token = await executeRecaptcha("register");

        const link = "https://taearif.com/api/register";
        const payload = {
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          username: formData.subdomain,
          recaptcha_token: token,
        };

        console.log("🚀 Sending registration request...");

        const response = await axios.post(link, payload, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.data.message || "فشل تسجيل الدخول");
        }

        console.log("✅ Registration response:", response.data);

        const { user, token: UserToken } = response.data;

        // إرسال بيانات المستخدم والتوكن إلى /api/user/setAuth
        const setAuthResponse = await fetch("/api/user/setAuth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user, UserToken }),
        });

        if (!setAuthResponse.ok) {
          const errorData = await setAuthResponse.json().catch(() => ({}));
          const errorMsg = errorData.error || "فشل في تعيين التوكن";
          console.error("❌ Error setting auth:", errorMsg);
          setErrors((prevErrors) => ({
            ...prevErrors,
            api: errorMsg,
          }));
          return;
        }

        console.log("✅ Auth token set successfully");
        if (setAuthResponse.ok) {
          await useAuthStore.getState().fetchUserData();
          useAuthStore.setState({
            UserIslogged: true,
            userData: {
              email: user.email,
              token: UserToken,
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          });
          setFormSubmitted(true);
          setTimeout(() => {
            router.push("/onboarding");
          }, 1500);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.message;
          console.error("❌ Axios error:", errorMessage);

          if (errorMessage.includes("The email has already been taken")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              api: "هذا البريد الإلكتروني مسجل بالفعل",
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              api: `${errorMessage}`,
            }));
          }
        } else {
          console.error("❌ Unexpected error:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            general: "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.",
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-2xl shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto bg-primary/10 p-2 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-base">
            أنشئ حسابك وابدأ في بناء موقعك الإلكتروني بسهولة
          </CardDescription>
        </CardHeader>

        {/* Step Indicator */}
        <div className="px-6 pb-2">
          <div className="flex justify-between items-center mb-4">
            <div
              className={`flex flex-col items-center ${currentStep >= 1 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <Mail className="h-5 w-5" />
              </div>
              <span className="text-xs">معلومات الاتصال</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? "bg-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center ${currentStep >= 2 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-xs">اسم موقعك</span>
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? "bg-primary" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex flex-col items-center ${currentStep >= 3 ? "text-primary" : "text-gray-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
              >
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-xs">كلمة المرور</span>
            </div>
          </div>
        </div>

        <CardContent>
          {formSubmitted ? (
            <div className="text-center py-8">
              <div className="mx-auto bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">
                تم إنشاء الحساب بنجاح!
              </h3>
              <p className="text-gray-600 mb-4">
                سيتم تحويلك إلى لوحة التحكم خلال لحظات...
              </p>
              <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-green-500 animate-progress"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-sm">
                        سنستخدم هذه المعلومات للتواصل معك وإرسال تحديثات مهمة
                        حول حسابك
                      </p>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="email" className="text-base font-medium">
                        البريد الإلكتروني
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400 mr-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>أدخل بريدك الإلكتروني الذي تستخدمه بانتظام</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pr-10 text-base py-6 ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 ml-1" />
                        {errors.email}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      مثال: yourname@gmail.com
                    </p>
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="phone" className="text-base font-medium">
                        رقم الهاتف
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400 mr-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>أدخل رقم هاتفك بدون الرمز الدولي</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="flex items-center bg-gray-100 p-1.5 rounded-md">
                          <Image
                            src="/saudi-flag.svg"
                            alt="Saudi Arabia"
                            width={24}
                            height={16}
                            className="rounded-sm ml-1"
                          />
                          <span className="text-sm font-medium">+966</span>
                        </div>
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="5XXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pr-28 text-base py-6 ${errors.phone ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 ml-1" />
                        {errors.phone}
                      </p>
                    )}
                    <div className="flex items-start">
                      <Phone className="h-4 w-4 text-gray-400 ml-1 mt-0.5" />
                      <p className="text-xs text-gray-500">
                        أدخل رقم هاتفك السعودي المكون من 9 أرقام ويبدأ بـ 5
                        (مثال: 5XXXXXXXX)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Website Name */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-sm">
                        اختر اسماً فريداً لموقعك الإلكتروني. سيكون هذا هو
                        العنوان الذي سيستخدمه الزوار للوصول إلى موقعك.
                      </p>
                    </div>
                  </div>

                  {/* Subdomain Field */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label
                        htmlFor="subdomain"
                        className="text-base font-medium"
                      >
                        اسم موقعك الإلكتروني
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400 mr-1 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>
                              هذا هو اسم موقعك الذي سيظهر في الرابط. استخدم أحرف
                              إنجليزية صغيرة وأرقام وشرطات فقط.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="relative">
                      <Globe className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="subdomain"
                        name="subdomain"
                        type="text"
                        placeholder="your-website-name"
                        value={formData.subdomain}
                        onChange={handleChange}
                        onFocus={() => setSubdomainFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setSubdomainFocused(false), 200)
                        }
                        className={`pr-10 pl-32 text-base py-6 ${errors.subdomain ? "border-red-500" : ""}`}
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-sm font-medium text-gray-500">
                          .example.com
                        </span>
                      </div>
                    </div>
                    {errors.subdomain && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 ml-1" />
                        {errors.subdomain}
                      </p>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Info className="h-4 w-4 ml-1 text-gray-500" />
                        إرشادات اختيار اسم الموقع:
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1 mr-5 list-disc">
                        <li>استخدم الأحرف الإنجليزية الصغيرة فقط (a-z)</li>
                        <li>يمكنك استخدام الأرقام (0-9)</li>
                        <li>يمكنك استخدام الشرطات (-) للفصل بين الكلمات</li>
                        <li>
                          لا تستخدم المسافات أو الأحرف العربية أو الرموز الخاصة
                        </li>
                        <li>اختر اسماً سهل التذكر ومرتبطاً بنشاطك</li>
                      </ul>
                    </div>

                    {/* Subdomain Suggestions */}
                    {subdomainFocused && subdomainSuggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium mb-2">اقتراحات:</p>
                        <div className="flex flex-wrap gap-2">
                          {subdomainSuggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">أمثلة جيدة:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          my-company
                        </span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          ahmed-store
                        </span>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          best-coffee123
                        </span>
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-medium mb-1">
                        أمثلة غير صحيحة:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                          شركتي (أحرف عربية)
                        </span>
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                          my company (مسافات)
                        </span>
                        <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                          my@company (رموز خاصة)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Password - Simplified */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex">
                      <Info className="h-5 w-5 text-blue-500 ml-2 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-sm">
                        أدخل كلمة مرور لحسابك. يمكنك استخدام أي كلمة مرور
                        تفضلها.
                      </p>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pr-10 text-base py-6 ${errors.password ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 flex items-center pl-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 ml-1" />
                        {errors.password}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      <Info className="h-4 w-4 text-gray-400 ml-1" />
                      <p className="text-xs text-gray-500">
                        تذكر كلمة المرور الخاصة بك، ستحتاجها لتسجيل الدخول
                        لاحقاً
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevStep}
                    className="flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 ml-1" />
                    السابق
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center"
                  >
                    التالي
                    <ArrowLeft className="h-4 w-4 mr-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex items-center">
                    إنشاء الحساب
                    <Check className="h-4 w-4 mr-1" />
                  </Button>
                )}
              </div>
              {errors.api && (
                <p className="text-red-500 text-sm flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.api}
                </p>
              )}
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              تسجيل الدخول
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Add custom animation for progress bar */}
      <style jsx global>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 2s linear forwards;
        }
      `}</style>
    </div>
  );
}
