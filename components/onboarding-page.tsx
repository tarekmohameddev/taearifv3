"use client"
import useAuthStore from "@/context/AuthContext";
import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { uploadSingleFile } from "@/utils/uploadSingle";
import axiosInstance from "@/lib/axiosInstance";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  Info,
  Trash2,
  Palette,
  Layout,
  Home,
  FileImage,
  Check,
  FileText,
  User,
  LockIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import ColorPicker from "./color-picker"

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
]

const COLOR_PALETTES = [
  { primary: "#1e40af", secondary: "#3b82f6", accent: "#93c5fd" },
  { primary: "#047857", secondary: "#10b981", accent: "#6ee7b7" },
  { primary: "#7c2d12", secondary: "#ea580c", accent: "#fdba74" },
  { primary: "#4c1d95", secondary: "#8b5cf6", accent: "#c4b5fd" },
  { primary: "#0f172a", secondary: "#334155", accent: "#94a3b8" },
]

const STEPS = [
  { id: "welcome", title: "مرحباً بك" },
  { id: "branding", title: "الشعار والأيقونة" },
  { id: "design", title: "التصميم والألوان" },
  { id: "complete", title: "اكتمل الإعداد" },
]

const OnboardingPage: React.FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [whereErrors, setWhereError] = useState<string>("");
  const { setOnboardingCompleted } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0)
  const [websiteData, setWebsiteData] = useState({
    title: "",
    logo: null as string | null,
    favicon: null as string | null,
    logoFile: null as File | null, // لتخزين ملف الشعار الأصلي
    faviconFile: null as File | null, // لتخزين ملف الأيقونة الأصلي
    category: "realestate",
    colors: { ...COLOR_PALETTES[0] },
  });

  const fileInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  setWhereError("")
  setErrors("")
  setIsLoading("")
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        setWebsiteData({
          ...websiteData,
          logo: event.target.result as string, // للمعاينة
          logoFile: file, // الملف الأصلي
        });
        toast({
          title: "تم رفع الشعار بنجاح",
          description: "يمكنك تغييره في أي وقت لاحقاً",
        });
      }
    };

    reader.readAsDataURL(file);
  }
};

const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  setWhereError("")
  setIsLoading("")
  setErrors("")
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        setWebsiteData({
          ...websiteData,
          favicon: event.target.result as string, // للمعاينة
          faviconFile: file, // الملف الأصلي
        });
        toast({
          title: "تم رفع أيقونة الموقع بنجاح",
          description: "ستظهر في تبويب المتصفح",
        });
      }
    };

    reader.readAsDataURL(file);
  }
};

  const useLogoAsFavicon = () => {
    setWhereError("")
  setIsLoading("")
  setErrors("")
    if (websiteData.logo && websiteData.logoFile) {
      setWebsiteData({
        ...websiteData,
        favicon: websiteData.logo,
        faviconFile: websiteData.logoFile,
      });
      toast({
        title: "تم استخدام الشعار كأيقونة للموقع",
        description: "يمكنك تغييرها في أي وقت لاحقاً",
      });
    } else {
      toast({
        title: "لم يتم رفع شعار بعد",
        description: "يرجى رفع شعار أولاً",
        variant: "destructive",
      });
    }
  };

  const selectColorPalette = (palette: (typeof COLOR_PALETTES)[0]) => {
    setWebsiteData({
      ...websiteData,
      colors: { ...palette },
    })
  }

  const handleCategorySelect = (categoryId: string) => {
    const category = WEBSITE_CATEGORIES.find((c) => c.id === categoryId)
    if (category && !category.disabled) {
      setWebsiteData({
        ...websiteData,
        category: categoryId,
      })
    }
  }

  const nextStep = () => {
    if (currentStep === 0 && !websiteData.title.trim()) {
      toast({
        title: "يرجى إدخال عنوان الموقع",
        description: "عنوان الموقع مطلوب للمتابعة",
        variant: "destructive",
      })
      return
    }
    
    if (currentStep === 2 && !websiteData.category) {
      toast({
        title: "يرجى اختيار نوع الموقع",
        description: "اختيار نوع الموقع مطلوب للمتابعة",
        variant: "destructive",
      })
      return
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      setErrors("");
      setIsLoading("")
      setWhereError("")
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const SkipSetup = async() => {
    await setOnboardingCompleted(true);
    router.push("/");
  }
  
  const completeOnboarding = async () => {
    setIsLoading(true);

    try {
      let logoUrl = null;
      if (websiteData.logoFile) {

        try {
          const logoResponse = await uploadSingleFile(websiteData.logoFile, "logo");
          logoUrl = logoResponse.url; 
        } catch (error) {
          setErrors(error.response.data.message)
          setWhereError("Logo")
          if (currentStep > 0) {
            setCurrentStep(1)
            window.scrollTo(0, 0)
          }
          return
         };
      }
  
      let faviconUrl = null;
      if (websiteData.faviconFile) {


        try {
          const faviconResponse = await uploadSingleFile(websiteData.faviconFile, "logo");
          faviconUrl = faviconResponse.url;
        } catch (error) {
          setWhereError("favicon")
          setErrors(error.response.data.message)
          return
         };
      }
  
      const onboardingData = {
        title: websiteData.title,
        category: websiteData.category,
        colors: websiteData.colors,
        logo: logoUrl,
        favicon: faviconUrl,
      };
  
      const response = await axiosInstance.post("/onboarding", onboardingData);
  
      toast({
        title: "تم إكمال إعداد موقعك بنجاح!",
        description: "سيتم توجيهك إلى لوحة التحكم",
      });
      setOnboardingCompleted(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "حدث خطأ أثناء إكمال الإعداد",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (STEPS[currentStep].id) {
      case "welcome":
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <CardTitle className="text-3xl">مرحباً بك في منشئ المواقع!</CardTitle>
              <CardDescription className="text-xl">سنساعدك على إعداد موقعك الجديد في خطوات بسيطة</CardDescription>

              <div className="bg-muted/50 p-4 rounded-lg text-right">
                <p className="text-lg font-medium mb-2">ماذا ستحتاج:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>عنوان لموقعك</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>شعار وأيقونة (اختياري)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>اختيار نوع الموقع وألوانه</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-8 mt-8">
              <div className="text-center mb-6">
                <CardTitle className="text-2xl mb-2">ما هو عنوان موقعك؟</CardTitle>
                <CardDescription>هذا هو الاسم الذي سيظهر في أعلى موقعك وفي نتائج البحث</CardDescription>
              </div>

              <div className="space-y-4">
                <Label htmlFor="website-title" className="flex items-center gap-1">
                  عنوان الموقع
                  <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground">(مطلوب)</span>
                </Label>
                <Input
                  id="website-title"
                  placeholder="مثال: شركة الأفق للعقارات"
                  value={websiteData.title}
                  onChange={(e) => setWebsiteData({ ...websiteData, title: e.target.value })}
                  className="text-lg h-12"
                />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    نصائح لاختيار عنوان جيد:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>استخدم اسماً سهل التذكر ومرتبط بنشاطك</li>
                    <li>تجنب الأسماء الطويلة جداً</li>
                    <li>يمكن استخدام اسم شركتك أو اسمك الشخصي</li>
                  </ul>
                </div>

                {websiteData.title && (
                  <div className="mt-6 border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-2">معاينة:</p>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-md"></div>
                      <p className="font-bold text-xl">{websiteData.title}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "branding":
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              
              <CardTitle className="text-2xl mb-2">شعار وأيقونة موقعك</CardTitle>
              <CardDescription>الشعار سيظهر في أعلى موقعك، والأيقونة ستظهر في تبويب المتصفح</CardDescription>
            </div>
            {errors && (
    <p className="text-sm text-red-500 text-center">
    في ال {whereErrors}  نوع الملف {errors.replace("Invalid file type: ", "")} غير مدعوم، يرجى استخدام JPG أو PNG.
    </p>
  )}
            {/* Logo Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">شعار الموقع</h3>

              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

              {!websiteData.logo ? (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">انقر لرفع شعار</p>
                  <p className="text-sm text-muted-foreground">أو اسحب الملف وأفلته هنا</p>
                  <p className="text-xs text-muted-foreground mt-4">يفضل صيغة PNG أو JPG بحجم 200×200 بكسل على الأقل</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="relative w-40 h-40 mx-auto border rounded-lg overflow-hidden">
                    <Image
                      src={websiteData.logo || "/placeholder.svg"}
                      alt="شعار الموقع"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      تغيير الشعار
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => setWebsiteData({ ...websiteData, logo: null })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Favicon Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">أيقونة الموقع (Favicon)</h3>
              <p className="text-sm text-muted-foreground">
                هي الأيقونة الصغيرة التي تظهر في تبويب المتصفح وفي المفضلة
              </p>

              <input
                type="file"
                ref={faviconInputRef}
                onChange={handleFaviconUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-1/2">
                  {!websiteData.favicon ? (
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors h-full"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      <FileImage className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                      <p className="font-medium mb-2">انقر لرفع أيقونة الموقع</p>
                      <p className="text-xs text-muted-foreground mt-2">يفضل صورة مربعة بصيغة PNG بحجم 32×32 بكسل</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="relative w-20 h-20 mx-auto border rounded-lg overflow-hidden bg-muted p-2">
                        <Image
                          src={websiteData.favicon || "/placeholder.svg"}
                          alt="أيقونة الموقع"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" onClick={() => faviconInputRef.current?.click()}>
                          تغيير الأيقونة
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => setWebsiteData({ ...websiteData, favicon: null })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-1/2 border-t sm:border-t-0 sm:border-r pt-4 sm:pt-0 sm:pr-6">
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium mb-2">ما هي أيقونة الموقع؟</p>
                        <p className="text-sm text-muted-foreground">
                          هي صورة صغيرة تظهر بجانب عنوان موقعك في تبويب المتصفح، وتساعد المستخدمين على التعرف على موقعك
                          بسهولة.
                        </p>
                      </div>
                    </div>
                  </div>

                  {websiteData.logo && !websiteData.favicon && (
                    <div className="text-center">
                      <Button variant="outline" onClick={useLogoAsFavicon} className="w-full">
                        استخدام الشعار كأيقونة
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case "design":
        return (
          <div className="space-y-8">
            <div className="text-center mb-6">
              <CardTitle className="text-2xl mb-2">تصميم موقعك</CardTitle>
              <CardDescription>اختر نوع موقعك وألوانه المناسبة</CardDescription>
            </div>

            {/* Category Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium mb-4">نوع الموقع</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {WEBSITE_CATEGORIES.map((category) => {
                  // Define which icon to use based on category id
                  let CategoryIcon = FileText
                  if (category.id === "realestate") CategoryIcon = Home
                  if (category.id === "personal") CategoryIcon = User

                  return (
                    <div
                      key={category.id}
                      className={`border rounded-lg p-6 ${
                        category.disabled
                          ? "opacity-60 cursor-not-allowed bg-muted/30"
                          : "cursor-pointer hover:border-primary hover:shadow-md"
                      } ${websiteData.category === category.id ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-16 h-16 flex items-center justify-center mb-2 relative">
                          <CategoryIcon
                            className={`w-12 h-12 ${category.disabled ? "text-muted-foreground" : "text-primary"}`}
                          />
                          {category.disabled && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <LockIcon className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-xl font-medium">{category.title}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        {category.disabled && <p className="text-xs text-muted-foreground mt-2">(قريباً)</p>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {websiteData.category && (
                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <p className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    ميزات متاحة لهذا النوع:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {websiteData.category === "personal" && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>صفحة السيرة الذاتية</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>معرض الأعمال</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>نموذج التواصل</span>
                        </li>
                      </>
                    )}
                    {websiteData.category === "realestate" && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>عرض العقارات مع التصفية</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>خريطة تفاعلية للمواقع</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>نماذج حجز المعاينة</span>
                        </li>
                      </>
                    )}
                    {websiteData.category === "lawyer" && (
                      <>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>صفحات الخدمات القانونية</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>نماذج طلب الاستشارة</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span>صفحة الأسئلة الشائعة</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium mb-4">ألوان الموقع</h3>

              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="font-medium">اختر من المجموعات الجاهزة:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COLOR_PALETTES.map((palette, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
                          websiteData.colors.primary === palette.primary ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => selectColorPalette(palette)}
                      >
                        <div className="flex gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: palette.primary }}></div>
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: palette.secondary }}></div>
                          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: palette.accent }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">مجموعة {index + 1}</span>
                          {websiteData.colors.primary === palette.primary && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t mt-6">
                  <p className="font-medium">أو اختر ألوانك المخصصة:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium mb-3 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    معاينة الألوان المختارة:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md"
                        style={{ backgroundColor: websiteData.colors.primary }}
                      ></div>
                      <div>
                        <p className="font-medium">اللون الرئيسي</p>
                        <p className="text-xs text-muted-foreground">{websiteData.colors.primary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md"
                        style={{ backgroundColor: websiteData.colors.secondary }}
                      ></div>
                      <div>
                        <p className="font-medium">اللون الثانوي</p>
                        <p className="text-xs text-muted-foreground">{websiteData.colors.secondary}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-md"
                        style={{ backgroundColor: websiteData.colors.accent }}
                      ></div>
                      <div>
                        <p className="font-medium">لون التأكيد</p>
                        <p className="text-xs text-muted-foreground">{websiteData.colors.accent}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "complete":
        return (
          <div className="text-center space-y-6">
            <CardTitle className="text-3xl">تهانينا! تم إعداد موقعك بنجاح</CardTitle>
            <CardDescription className="text-xl">يمكنك الآن البدء في بناء موقعك وتخصيصه</CardDescription>

            <div className="bg-muted/50 p-4 rounded-lg text-right">
              <p className="text-lg font-medium mb-2">ملخص الإعدادات:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  <span>
                    اسم الموقع: <span className="font-medium text-foreground">{websiteData.title}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  <span>
                    نوع الموقع:{" "}
                    <span className="font-medium text-foreground">
                      {WEBSITE_CATEGORIES.find((c) => c.id === websiteData.category)?.title || "غير محدد"}
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <span>
                    الألوان:
                    <span className="inline-flex items-center gap-1 mr-2">
                      <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: websiteData.colors.primary }}
                      ></span>
                      <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: websiteData.colors.secondary }}
                      ></span>
                      <span
                        className="w-4 h-4 rounded-full inline-block"
                        style={{ backgroundColor: websiteData.colors.accent }}
                      ></span>
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <p className="text-muted-foreground">سيتم توجيهك إلى لوحة التحكم للبدء في بناء موقعك</p>
          </div>
        )

      default:
        return null
    }
  }

  // Render progress steps
  const renderProgressSteps = () => {
    return (
      <div className="flex justify-between items-center mb-8 px-2">
        {STEPS.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                      ? "bg-primary/20 text-primary border-2 border-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 ${index < currentStep ? "bg-primary" : "bg-muted"}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card className="border-none shadow-lg">
        <CardHeader className="pb-0">
          {currentStep > 0 && currentStep < STEPS.length - 1 && renderProgressSteps()}
        </CardHeader>

        <CardContent className="pt-6 pb-4">{renderStepContent()}</CardContent>

        <CardFooter className="flex justify-between border-t pt-6">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={prevStep} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}

<div className="gap-5 flex flex-col">
  {currentStep < STEPS.length - 1 ? (
    <Button onClick={nextStep} className="flex items-center gap-1">
      التالي
      <ChevronLeft className="h-4 w-4" />
    </Button>
  ) : (
    <Button
      onClick={() => {
          setErrors("");
          nextStep()
      }}
      className="flex items-center gap-1"
      disabled={isLoading}
    >
    {isLoading 
  ? (errors ? "حل الخطأ أولاً" : "جاري الحفظ")
  : (errors ? "حل الخطأ أولاً" : "الانتقال إلى لوحة التحكم")
}

    </Button>
  )}
  {errors && (
    <p className="text-sm text-red-500">
      نوع الملف {errors.replace("Invalid file type: ", "")} غير مدعوم، يرجى استخدام JPG أو PNG.
    </p>
  )}
</div>


        </CardFooter>
      </Card>

      <TooltipProvider>
        <div className="mt-6 text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="link" className="text-muted-foreground" onClick={SkipSetup}>
                تخطي الإعداد
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>يمكنك إكمال الإعداد لاحقاً من صفحة الإعدادات</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default OnboardingPage

