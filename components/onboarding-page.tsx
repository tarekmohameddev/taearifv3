"use client";
import useAuthStore from "@/context/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadSingleFile } from "@/utils/uploadSingle";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, FileImage, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import ColorPicker from "./color-picker";

const WEBSITE_CATEGORIES = [
  {
    id: "lawyer",
    title: "خدمات قانونية",
    description: "للمكاتب القانونية والمحامين",
    disabled: true,
  },
  {
    id: "realestate",
    title: "عقارات",
    description: "لقوائم العقارات وملفات الوكلاء",
    disabled: false,
  },
  {
    id: "personal",
    title: "موقع شخصي",
    description: "لعرض أعمالك، مدونتك، أو أعمالك الشخصية",
    disabled: true,
  },
];

const COLOR_PALETTES = [
  { primary: "#1e40af", secondary: "#3b82f6", accent: "#93c5fd" },
  { primary: "#047857", secondary: "#10b981", accent: "#6ee7b7" },
  { primary: "#7c2d12", secondary: "#ea580c", accent: "#fdba74" },
  { primary: "#4c1d95", secondary: "#8b5cf6", accent: "#c4b5fd" },
  { primary: "#0f172a", secondary: "#334155", accent: "#94a3b8" },
];

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [whereErrors, setWhereError] = useState<string>("");
  const { setOnboardingCompleted } = useAuthStore();
  const [websiteData, setWebsiteData] = useState({
    title: "",
    logo: null as string | null,
    favicon: null as string | null,
    logoFile: null as File | null,
    faviconFile: null as File | null,
    category: "realestate",
    colors: { ...COLOR_PALETTES[0] },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // الحصول على قيمة onboarding_completed من Zustand
  const onboarding_completed = useAuthStore(
    (state) => state.onboarding_completed,
  );

  // إذا كانت onboarding مفعلة (أي اكتملت)، يتم نقلك إلى الصفحة الرئيسية
  useEffect(() => {
    if (onboarding_completed) {
      router.push("/");
    }
  }, [onboarding_completed, router]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhereError("");
    setErrors("");
    setIsLoading(false);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setWebsiteData({
            ...websiteData,
            logo: event.target.result as string,
            logoFile: file,
          });
          toast.success("تم رفع الشعار بنجاح");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhereError("");
    setIsLoading(false);
    setErrors("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          setWebsiteData({
            ...websiteData,
            favicon: event.target.result as string,
            faviconFile: file,
          });
          toast.success("تم رفع أيقونة الموقع بنجاح");
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const useLogoAsFavicon = () => {
    setWhereError("");
    setIsLoading(false);
    setErrors("");
    if (websiteData.logo && websiteData.logoFile) {
      setWebsiteData({
        ...websiteData,
        favicon: websiteData.logo,
        faviconFile: websiteData.logoFile,
      });
      toast.success("تم استخدام الشعار كأيقونة للموقع");
    } else {
      toast.error("لم يتم رفع شعار بعد");
    }
  };

  const selectColorPalette = (palette: (typeof COLOR_PALETTES)[0]) => {
    setWebsiteData({
      ...websiteData,
      colors: { ...palette },
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = WEBSITE_CATEGORIES.find((c) => c.id === categoryId);
    if (category && !category.disabled) {
      setWebsiteData({
        ...websiteData,
        category: categoryId,
      });
    }
  };

  const SkipSetup = async () => {
    await setOnboardingCompleted(true);
    router.push("/");
  };

  const completeOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!websiteData.title.trim()) {
      toast.error("يرجى إدخال عنوان الموقع");
      return;
    }

    if (!websiteData.category) {
      toast.error("يرجى اختيار نوع الموقع");
      return;
    }

    setIsLoading(true);

    try {
      let logoUrl = null;
      if (websiteData.logoFile) {
        try {
          const logoResponse = await uploadSingleFile(
            websiteData.logoFile,
            "logo",
          );
          logoUrl = logoResponse.url;
        } catch (error) {
          setErrors(error.response.data.message);
          setWhereError("Logo");
          setIsLoading(false);
          return;
        }
      }

      let faviconUrl = null;
      if (websiteData.faviconFile) {
        try {
          const faviconResponse = await uploadSingleFile(
            websiteData.faviconFile,
            "logo",
          );
          faviconUrl = faviconResponse.url;
        } catch (error) {
          setWhereError("favicon");
          setErrors(error.response.data.message);
          setIsLoading(false);
          return;
        }
      }

      const onboardingData = {
        title: websiteData.title,
        category: websiteData.category,
        colors: websiteData.colors,
        logo: logoUrl,
        favicon: faviconUrl,
      };

      const response = await axiosInstance.post("/onboarding", onboardingData);
      toast.success("تم إكمال إعداد موقعك بنجاح!");

      setOnboardingCompleted(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast.error("حدث خطأ أثناء إكمال الإعداد");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Simple Menu */}
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
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">إعداد موقعك الجديد</h1>
            <p className="text-muted-foreground">أكمل المعلومات أدناه لبدء إنشاء موقعك</p>
          </div>

          <form onSubmit={completeOnboarding} className="space-y-8">
            {/* Website Title */}
            <div className="space-y-2">
              <Label htmlFor="website-title" className="text-foreground">اسم الموقع *</Label>
              <Input
                id="website-title"
                placeholder="مثال: شركة الأفق للعقارات"
                value={websiteData.title}
                onChange={(e) =>
                  setWebsiteData({ ...websiteData, title: e.target.value })
                }
                className="h-12"
                required
              />
            </div>

            {/* Logo and Favicon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">شعار الموقع (اختياري)</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!websiteData.logo ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">انقر لرفع شعار</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-32 h-32 mx-auto border border-border rounded-lg overflow-hidden">
                      <Image
                        src={websiteData.logo || "/placeholder.svg"}
                        alt="شعار الموقع"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        تغيير
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWebsiteData({ ...websiteData, logo: null, logoFile: null })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Favicon Upload */}
              <div className="space-y-2">
                <Label className="text-foreground">أيقونة الموقع (اختياري)</Label>
                <input
                  type="file"
                  ref={faviconInputRef}
                  onChange={handleFaviconUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!websiteData.favicon ? (
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground transition-colors"
                    onClick={() => faviconInputRef.current?.click()}
                  >
                    <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">انقر لرفع أيقونة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative w-16 h-16 mx-auto border border-border rounded-lg overflow-hidden bg-muted p-2">
                      <Image
                        src={websiteData.favicon || "/placeholder.svg"}
                        alt="أيقونة الموقع"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => faviconInputRef.current?.click()}
                      >
                        تغيير
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setWebsiteData({ ...websiteData, favicon: null, faviconFile: null })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {websiteData.logo && !websiteData.favicon && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={useLogoAsFavicon}
                    className="w-full mt-2"
                  >
                    استخدام الشعار كأيقونة
                  </Button>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <Label className="text-foreground">ألوان الموقع</Label>

              {/* Predefined Palettes */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {COLOR_PALETTES.map((palette, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      websiteData.colors.primary === palette.primary
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    onClick={() => selectColorPalette(palette)}
                  >
                    <div className="flex gap-1 justify-center">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.primary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.secondary }}
                      ></div>
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: palette.accent }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Colors */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-3">
                  أو اختر ألوانك المخصصة:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ColorPicker
                    color={websiteData.colors.primary}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, primary: color },
                      })
                    }
                    label="اللون الرئيسي"
                  />
                  <ColorPicker
                    color={websiteData.colors.secondary}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, secondary: color },
                      })
                    }
                    label="اللون الثانوي"
                  />
                  <ColorPicker
                    color={websiteData.colors.accent}
                    onChange={(color) =>
                      setWebsiteData({
                        ...websiteData,
                        colors: { ...websiteData.colors, accent: color },
                      })
                    }
                    label="لون التأكيد"
                  />
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors && (
              <div className="text-center text-destructive text-sm bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                في ال {whereErrors} نوع الملف{" "}
                {errors.replace("Invalid file type: ", "")} غير مدعوم، يرجى
                استخدام JPG أو PNG.
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإعداد...
                  </>
                ) : (
                  "إكمال الإعداد"
                )}
              </Button>
            </div>

            {/* Skip Setup */}
            <div className="text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="link"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={SkipSetup}
                    >
                      تخطي الإعداد
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>يمكنك إكمال الإعداد لاحقاً من صفحة الإعدادات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;