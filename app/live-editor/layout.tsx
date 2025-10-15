"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { EditorProvider } from "@/context-liveeditor/EditorProvider";
import { ReactNode, useEffect, useMemo, useState } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import useAuthStore from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import { LanguageSwitcher } from "@/components/tenant/live-editor/LanguageSwitcher";
import {
  useEditorT,
  useEditorLocale,
} from "@/context-liveeditor/editorI18nStore";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { LanguageDropdown } from "@/components/tenant/live-editor/LanguageDropdown";
import { AuthProvider } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";

// مكون إضافة صفحة جديدة
function AddPageDialog({
  onPageCreated,
  open: externalOpen,
  onOpenChange,
}: {
  onPageCreated?: (pageSlug: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    // Basic Meta Tags
    TitleAr: "",
    TitleEn: "",
    DescriptionAr: "",
    DescriptionEn: "",
    KeywordsAr: "",
    KeywordsEn: "",
    // Advanced Meta Tags
    Author: "",
    AuthorEn: "",
    Robots: "",
    RobotsEn: "",
    // Open Graph
    "og:title": "",
    "og:description": "",
    "og:keywords": "",
    "og:author": "",
    "og:robots": "",
    "og:url": "",
    "og:image": "",
    "og:type": "",
    "og:locale": "",
    "og:locale:alternate": "",
    "og:site_name": "",
    "og:image:width": "",
    "og:image:height": "",
    "og:image:type": "",
    "og:image:alt": "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const t = useEditorT();

  const { tenantData } = useTenantStore();
  const { userData } = useAuthStore();
  const router = useRouter();
  const { locale } = useEditorLocale();

  // دالة لحساب عنوان الصفحة حسب اللغة
  const getPageTitle = (page: any) => {
    // إذا كانت الصفحة باللغة العربية
    if (locale === 'ar' && page.seo?.TitleAr) {
      return page.seo.TitleAr;
    }
    // إذا كانت الصفحة باللغة الإنجليزية
    if (locale === 'en' && page.seo?.TitleEn) {
      return page.seo.TitleEn;
    }
    // إذا لم تكن هناك بيانات SEO، استخدم page.name
    if (page.name) {
      return page.name;
    }
    // إذا لم يكن هناك page.name، استخدم page.slug
    return page.slug || 'Homepage';
  };

  // التأكد من وجود tenantId من userData.username
  const tenantId = userData?.username;

  // إذا لم يكن هناك tenantId، لا نعرض المكون
  if (!tenantId) {
    return null;
  }

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = t("validation.slug_required");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t("validation.slug_format");
    }

    // التحقق من عدم تكرار الـ slug
    const existingSlugs = tenantData?.componentSettings
      ? Object.keys(tenantData.componentSettings)
      : [];
    if (existingSlugs.includes(formData.slug)) {
      newErrors.slug = t("validation.slug_exists");
    }

    if (!formData.TitleAr.trim()) {
      newErrors.TitleAr = "عنوان الصفحة بالعربي مطلوب";
    }

    if (!formData.TitleEn.trim()) {
      newErrors.TitleEn = "عنوان الصفحة بالإنجليزي مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء صفحة جديدة مع WebsiteLayout
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // استخدام createPage من editorStore
      const { createPage } = useEditorStore.getState();

      createPage({
        slug: formData.slug,
        name: formData.slug, // استخدام slug كاسم الصفحة
        metaTitle: formData.TitleAr, // للتوافق مع النظام القديم
        metaDescription: formData.DescriptionAr,
        metaKeywords: formData.KeywordsAr,
      });

      // تحديث tenantStore لإضافة الصفحة الجديدة إلى componentSettings
      const { tenantData } = useTenantStore.getState();
      const updatedTenantData = {
        ...tenantData,
        componentSettings: {
          ...tenantData?.componentSettings,
          [formData.slug]: {}, // إضافة الصفحة الجديدة مع object فارغ للمكونات
        },
        // إضافة WebsiteLayout
        WebsiteLayout: {
          ...tenantData?.WebsiteLayout,
          metaTags: {
            ...tenantData?.WebsiteLayout?.metaTags,
            pages: [
              ...(tenantData?.WebsiteLayout?.metaTags?.pages || []),
              {
                TitleAr: formData.TitleAr,
                TitleEn: formData.TitleEn,
                DescriptionAr: formData.DescriptionAr || formData.TitleAr,
                DescriptionEn: formData.DescriptionEn || formData.TitleEn,
                KeywordsAr: formData.KeywordsAr || formData.TitleAr,
                KeywordsEn: formData.KeywordsEn || formData.TitleEn,
                Author: formData.Author || formData.TitleAr,
                AuthorEn: formData.AuthorEn || formData.TitleEn,
                Robots: formData.Robots || "index, follow",
                RobotsEn: formData.RobotsEn || "index, follow",
                "og:title": formData["og:title"] || formData.TitleAr,
                "og:description":
                  formData["og:description"] ||
                  formData.DescriptionAr ||
                  formData.TitleAr,
                "og:keywords":
                  formData["og:keywords"] ||
                  formData.KeywordsAr ||
                  formData.TitleAr,
                "og:author":
                  formData["og:author"] || formData.Author || formData.TitleAr,
                "og:robots":
                  formData["og:robots"] || formData.Robots || "index, follow",
                "og:url": formData["og:url"] || `/${formData.slug}`,
                "og:image": formData["og:image"] || "",
                "og:type": formData["og:type"] || "website",
                "og:locale": formData["og:locale"] || "ar",
                "og:locale:alternate": formData["og:locale:alternate"] || "en",
                "og:site_name": formData["og:site_name"] || formData.TitleAr,
                "og:image:width": formData["og:image:width"] || "",
                "og:image:height": formData["og:image:height"] || "",
                "og:image:type": formData["og:image:type"] || "",
                "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
                path: `/${formData.slug}`,
              },
            ],
          },
        },
      };

      // تحديث الـ store
      useTenantStore.setState({ tenantData: updatedTenantData });

      // تحديث editorStore مع WebsiteLayout
      const { addPageToWebsiteLayout } = useEditorStore.getState();
      addPageToWebsiteLayout({
        TitleAr: formData.TitleAr,
        TitleEn: formData.TitleEn,
        DescriptionAr: formData.DescriptionAr || formData.TitleAr,
        DescriptionEn: formData.DescriptionEn || formData.TitleEn,
        KeywordsAr: formData.KeywordsAr || formData.TitleAr,
        KeywordsEn: formData.KeywordsEn || formData.TitleEn,
        Author: formData.Author || formData.TitleAr,
        AuthorEn: formData.AuthorEn || formData.TitleEn,
        Robots: formData.Robots || "index, follow",
        RobotsEn: formData.RobotsEn || "index, follow",
        "og:title": formData["og:title"] || formData.TitleAr,
        "og:description":
          formData["og:description"] ||
          formData.DescriptionAr ||
          formData.TitleAr,
        "og:keywords":
          formData["og:keywords"] || formData.KeywordsAr || formData.TitleAr,
        "og:author":
          formData["og:author"] || formData.Author || formData.TitleAr,
        "og:robots":
          formData["og:robots"] || formData.Robots || "index, follow",
        "og:url": formData["og:url"] || `/${formData.slug}`,
        "og:image": formData["og:image"] || "",
        "og:type": formData["og:type"] || "website",
        "og:locale": formData["og:locale"] || "ar",
        "og:locale:alternate": formData["og:locale:alternate"] || "en",
        "og:site_name": formData["og:site_name"] || formData.TitleAr,
        "og:image:width": formData["og:image:width"] || "",
        "og:image:height": formData["og:image:height"] || "",
        "og:image:type": formData["og:image:type"] || "",
        "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
        path: `/${formData.slug}`,
      });

      // التحقق من نوع الصفحة
      const predefinedPages = [
        "homepage",
        "about",
        "contact",
        "products",
        "collections",
      ];
      const isPredefinedPage = predefinedPages.includes(formData.slug);

      const successMessage = isPredefinedPage
        ? "تم إنشاء الصفحة مع المكونات الافتراضية"
        : "تم إنشاء الصفحة المخصصة بنجاح";

      toast.success(successMessage);
      setOpen(false);

      // إضافة الصفحة إلى القائمة المحلية
      onPageCreated?.(formData.slug);

      // إعادة توجيه إلى الصفحة الجديدة
      router.push(`/live-editor/${formData.slug}`);

      // إعادة تعيين النموذج
      setFormData({
        slug: "",
        TitleAr: "",
        TitleEn: "",
        DescriptionAr: "",
        DescriptionEn: "",
        KeywordsAr: "",
        KeywordsEn: "",
        Author: "",
        AuthorEn: "",
        Robots: "",
        RobotsEn: "",
        "og:title": "",
        "og:description": "",
        "og:keywords": "",
        "og:author": "",
        "og:robots": "",
        "og:url": "",
        "og:image": "",
        "og:type": "",
        "og:locale": "",
        "og:locale:alternate": "",
        "og:site_name": "",
        "og:image:width": "",
        "og:image:height": "",
        "og:image:type": "",
        "og:image:alt": "",
      });
    } catch (error) {
      toast.error("حدث خطأ في إنشاء الصفحة");
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:text-white hover:scale-[calc(1.05)] border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-2000 shadow-lg hover:shadow-xl"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {t("editor.add_page")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto relative"
        dir="ltr"
      >
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t("editor.add_page")}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-1">
                {t("editor.page_information")} و {t("editor.seo_settings")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* معلومات الصفحة الأساسية */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {t("editor.basic_info")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="slug"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.slug")} *
                </Label>
                <Input
                  id="slug"
                  placeholder="homepage"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className={`transition-all duration-200 ${errors.slug ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                />
                {errors.slug && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.slug}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* إعدادات SEO الأساسية */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-purple-50 text-purple-700"
              >
                <svg
                  className="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                {t("editor.seo_settings")} الأساسية
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="TitleAr"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_title_ar")} *
                </Label>
                <Input
                  id="TitleAr"
                  placeholder={t("editor.page_title_ar_placeholder")}
                  value={formData.TitleAr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      TitleAr: e.target.value,
                    }))
                  }
                  className={`transition-all duration-200 ${errors.TitleAr ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                />
                {errors.TitleAr && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.TitleAr}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="TitleEn"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_title_en")} *
                </Label>
                <Input
                  id="TitleEn"
                  placeholder={t("editor.page_title_en_placeholder")}
                  value={formData.TitleEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      TitleEn: e.target.value,
                    }))
                  }
                  className={`transition-all duration-200 ${errors.TitleEn ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                />
                {errors.TitleEn && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.TitleEn}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="DescriptionAr"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_description_ar")}
                </Label>
                <Textarea
                  id="DescriptionAr"
                  placeholder="وصف مختصر للصفحة باللغة العربية"
                  value={formData.DescriptionAr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      DescriptionAr: e.target.value,
                    }))
                  }
                  className="resize-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="DescriptionEn"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_description_en")}
                </Label>
                <Textarea
                  id="DescriptionEn"
                  placeholder="Brief description of the page in English"
                  value={formData.DescriptionEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      DescriptionEn: e.target.value,
                    }))
                  }
                  className="resize-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="KeywordsAr"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_keywords_ar")}
                </Label>
                <Input
                  id="KeywordsAr"
                  placeholder={t("editor.page_keywords_ar_placeholder")}
                  value={formData.KeywordsAr}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      KeywordsAr: e.target.value,
                    }))
                  }
                  className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="KeywordsEn"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("editor.page_keywords_en")}
                </Label>
                <Input
                  id="KeywordsEn"
                  placeholder={t("editor.page_keywords_en_placeholder")}
                  value={formData.KeywordsEn}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      KeywordsEn: e.target.value,
                    }))
                  }
                  className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* إعدادات متقدمة */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-700"
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {t("editor.advanced_settings")}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2"
              >
                {showAdvanced
                  ? t("editor.hide_advanced")
                  : t("editor.show_advanced")}{" "}
                {t("editor.advanced_settings_toggle")}
                <svg
                  className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>

            {showAdvanced && (
              <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
                {/* Author & Robots */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {t("editor.author_ar")}
                    </Label>
                    <Input
                      placeholder="اسم المؤلف"
                      value={formData.Author}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Author: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {t("editor.author_en")}
                    </Label>
                    <Input
                      placeholder="Author Name"
                      value={formData.AuthorEn}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          AuthorEn: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {t("editor.robots_ar")}
                    </Label>
                    <Input
                      placeholder="index, follow"
                      value={formData.Robots}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          Robots: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {t("editor.robots_en")}
                    </Label>
                    <Input
                      placeholder="index, follow"
                      value={formData.RobotsEn}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          RobotsEn: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Open Graph */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Open Graph
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        og:title
                      </Label>
                      <Input
                        placeholder={t("editor.og_title")}
                        value={formData["og:title"]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            "og:title": e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        og:description
                      </Label>
                      <Input
                        placeholder={t("editor.og_description")}
                        value={formData["og:description"]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            "og:description": e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        og:url
                      </Label>
                      <Input
                        placeholder={t("editor.og_url")}
                        value={formData["og:url"]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            "og:url": e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        og:image
                      </Label>
                      <Input
                        placeholder={t("editor.og_image")}
                        value={formData["og:image"]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            "og:image": e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            {t("editor.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-2000"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
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
                جاري الإنشاء...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                إنشاء الصفحة
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Coming Soon Overlay - Disabled add page functionality - Only show in production */}
      {process.env.NODE_ENV !== "development" && (
        <div
          className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          style={{
            zIndex: 9999,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              {t("live_editor.coming_soon")}
            </h2>
            <p className="text-red-500 font-medium">
              {t("live_editor.components_disabled")}
            </p>
          </div>
        </div>
      )}
    </Dialog>
  );
}

// مكون الشريط العلوي الجديد ليستطيع الوصول للسياق
function EditorNavBar({ showArrowTooltip }: { showArrowTooltip: boolean }) {
  const pathname = usePathname();
  const requestSave = useEditorStore((state) => state.requestSave);
  const {
    liveEditorUser: user,
    liveEditorLoading: loading,
    userData,
  } = useAuthStore();
  const router = useRouter();
  const { locale } = useEditorLocale();
  const [recentlyAddedPages, setRecentlyAddedPages] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // دالة لحساب عنوان الصفحة حسب اللغة
  const getPageTitle = (page: any) => {
    // إذا كانت الصفحة باللغة العربية
    if (locale === 'ar' && page.seo?.TitleAr) {
      return page.seo.TitleAr;
    }
    // إذا كانت الصفحة باللغة الإنجليزية
    if (locale === 'en' && page.seo?.TitleEn) {
      return page.seo.TitleEn;
    }
    // إذا لم تكن هناك بيانات SEO، استخدم page.name
    if (page.name) {
      return page.name;
    }
    // إذا لم يكن هناك page.name، استخدم page.slug
    return page.slug || 'Homepage';
  };
  const [formData, setFormData] = useState({
    slug: "",
    // Basic Meta Tags
    TitleAr: "",
    TitleEn: "",
    DescriptionAr: "",
    DescriptionEn: "",
    KeywordsAr: "",
    KeywordsEn: "",
    // Advanced Meta Tags
    Author: "",
    AuthorEn: "",
    Robots: "",
    RobotsEn: "",
    // Open Graph
    "og:title": "",
    "og:description": "",
    "og:keywords": "",
    "og:author": "",
    "og:robots": "",
    "og:url": "",
    "og:image": "",
    "og:type": "",
    "og:locale": "",
    "og:locale:alternate": "",
    "og:site_name": "",
    "og:image:width": "",
    "og:image:height": "",
    "og:image:type": "",
    "og:image:alt": "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useEditorT();

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".dropdown-container")) {
          setIsDropdownOpen(false);
        }
      }
      if (isPagesDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest(".pages-dropdown-container")) {
          setIsPagesDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isPagesDropdownOpen]);

  const tenantId = userData?.username || "";
  const basePath = `/live-editor`;
  const currentPath = (pathname || "").replace(basePath, "") || "";

  // إنشاء URL كامل مع tenantId.domain.com
  const getTenantUrl = (path: string = "") => {
    if (!tenantId) return path;

    // في التطوير: tenantId.localhost:3000
    // في الإنتاج: tenantId.domain.com
    const isDevelopment = process.env.NODE_ENV === "development";
    const domain = isDevelopment ? "localhost:3000" : "taearif.com";

    return `http${isDevelopment ? "" : "s"}://${tenantId}.${domain}${path}`;
  };
  const { fetchTenantData, tenantData, loadingTenantData, error } =
    useTenantStore();

  // الحصول على WebsiteLayout من editorStore في أعلى المكون
  const editorStoreWebsiteLayout = useEditorStore((state) => state.WebsiteLayout);
  const editorWebsiteLayout = editorStoreWebsiteLayout?.metaTags?.pages || [];

  // دالة للحصول على البيانات الافتراضية للصفحة
  const getDefaultSeoData = (pageSlug: string) => {
    const defaultData = {
      "/": {
        TitleAr: "الصفحة الرئيسية",
        TitleEn: "Homepage",
        DescriptionAr: "مرحباً بكم في موقعنا - الصفحة الرئيسية",
        DescriptionEn: "Welcome to our website - Homepage",
        KeywordsAr: "الرئيسية, الموقع, الصفحة الرئيسية",
        KeywordsEn: "homepage, main, website",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "الصفحة الرئيسية",
        "og:description": "مرحباً بكم في موقعنا",
        "og:keywords": "الرئيسية, الموقع",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "الصفحة الرئيسية"
      },
      "": {
        TitleAr: "الصفحة الرئيسية",
        TitleEn: "Homepage",
        DescriptionAr: "مرحباً بكم في موقعنا - الصفحة الرئيسية",
        DescriptionEn: "Welcome to our website - Homepage",
        KeywordsAr: "الرئيسية, الموقع, الصفحة الرئيسية",
        KeywordsEn: "homepage, main, website",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "الصفحة الرئيسية",
        "og:description": "مرحباً بكم في موقعنا",
        "og:keywords": "الرئيسية, الموقع",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "الصفحة الرئيسية"
      },
      "create-request": {
        TitleAr: "إنشاء طلب",
        TitleEn: "Create Request",
        DescriptionAr: "إنشاء طلب جديد للحصول على الخدمات",
        DescriptionEn: "Create a new request to get our services",
        KeywordsAr: "إنشاء طلب, خدمات, طلب جديد",
        KeywordsEn: "create request, services, new request",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "إنشاء طلب",
        "og:description": "إنشاء طلب جديد للحصول على الخدمات",
        "og:keywords": "إنشاء طلب, خدمات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "إنشاء طلب"
      },
      "for-rent": {
        TitleAr: "عقارات للإيجار",
        TitleEn: "For Rent",
        DescriptionAr: "عقارات متاحة للإيجار",
        DescriptionEn: "Properties available for rent",
        KeywordsAr: "للإيجار, عقارات, شقق, منازل",
        KeywordsEn: "for rent, properties, apartments, houses",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "للإيجار",
        "og:description": "عقارات متاحة للإيجار",
        "og:keywords": "للإيجار, عقارات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "للإيجار"
      },
      "for-sale": {
        TitleAr: "عقارات للبيع",
        TitleEn: "For Sale",
        DescriptionAr: "عقارات متاحة للبيع",
        DescriptionEn: "Properties available for sale",
        KeywordsAr: "للبيع, عقارات, شقق, منازل",
        KeywordsEn: "for sale, properties, apartments, houses",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "للبيع",
        "og:description": "عقارات متاحة للبيع",
        "og:keywords": "للبيع, عقارات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "للبيع"
      },
      "projects": {
        TitleAr: "المشاريع",
        TitleEn: "Projects",
        DescriptionAr: "مشاريعنا العقارية المتميزة",
        DescriptionEn: "Our distinguished real estate projects",
        KeywordsAr: "مشاريع, عقارية, تطوير, بناء",
        KeywordsEn: "projects, real estate, development, construction",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "المشاريع",
        "og:description": "مشاريعنا العقارية المتميزة",
        "og:keywords": "مشاريع, عقارية",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "المشاريع"
      }
    };

    return (defaultData as any)[pageSlug] || {
      TitleAr: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
      TitleEn: pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
      DescriptionAr: `صفحة ${pageSlug}`,
      DescriptionEn: `${pageSlug} page`,
      KeywordsAr: pageSlug,
      KeywordsEn: pageSlug,
      Author: "الموقع",
      AuthorEn: "Website",
      Robots: "index, follow",
      RobotsEn: "index, follow",
      "og:title": pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1),
      "og:description": `صفحة ${pageSlug}`,
      "og:keywords": pageSlug,
      "og:author": "الموقع",
      "og:robots": "index, follow",
      "og:url": "",
      "og:image": "",
      "og:type": "website",
      "og:locale": "ar",
      "og:locale:alternate": "en",
      "og:site_name": "الموقع",
      "og:image:width": null,
      "og:image:height": null,
      "og:image:type": null,
      "og:image:alt": pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1)
    };
  };

  // إنشاء قائمة الصفحات المتاحة من الـ backend مع دمج WebsiteLayout
  const availablePages = useMemo(() => {
    const pages: any[] = [];

    // تحويل componentSettings إلى object عادي إذا كان Map
    const componentSettings =
      tenantData?.componentSettings instanceof Map
        ? Object.fromEntries(tenantData.componentSettings)
        : tenantData?.componentSettings;

    // تحويل WebsiteLayout إلى object عادي إذا كان Map
    const websiteLayout =
      tenantData?.WebsiteLayout instanceof Map
        ? Object.fromEntries(tenantData.WebsiteLayout)
        : tenantData?.WebsiteLayout;

    // إضافة الصفحات من componentSettings مع دمج WebsiteLayout
    if (componentSettings && typeof componentSettings === "object") {
      const componentSettingsKeys = Object.keys(componentSettings);

      componentSettingsKeys.forEach((pageSlug) => {
        if (pageSlug !== "homepage") {
          const pageName = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);
          
          // البحث عن بيانات SEO للصفحة في WebsiteLayout
          let seoData = null;
          if (websiteLayout?.metaTags?.pages) {
            seoData = websiteLayout.metaTags.pages.find(
              (page: any) => page.path === `/${pageSlug}` || page.path === pageSlug
            );
          }

          // التحقق من وجود بيانات SEO
          const hasSeoData = seoData && (seoData.TitleAr || seoData.TitleEn || seoData.DescriptionAr || seoData.DescriptionEn);

          // إنشاء كائن الصفحة مع دمج البيانات
          const pageData = {
            slug: pageSlug,
            name: pageName,
            path: `/${pageSlug}`,
            // إضافة بيانات SEO إذا كانت موجودة، وإلا إضافة البيانات الافتراضية
            seo: hasSeoData ? {
              TitleAr: seoData.TitleAr,
              TitleEn: seoData.TitleEn,
              DescriptionAr: seoData.DescriptionAr,
              DescriptionEn: seoData.DescriptionEn,
              KeywordsAr: seoData.KeywordsAr,
              KeywordsEn: seoData.KeywordsEn,
              Author: seoData.Author,
              AuthorEn: seoData.AuthorEn,
              Robots: seoData.Robots,
              RobotsEn: seoData.RobotsEn,
              "og:title": seoData["og:title"],
              "og:description": seoData["og:description"],
              "og:keywords": seoData["og:keywords"],
              "og:author": seoData["og:author"],
              "og:robots": seoData["og:robots"],
              "og:url": seoData["og:url"],
              "og:image": seoData["og:image"],
              "og:type": seoData["og:type"],
              "og:locale": seoData["og:locale"],
              "og:locale:alternate": seoData["og:locale:alternate"],
              "og:site_name": seoData["og:site_name"],
              "og:image:width": seoData["og:image:width"],
              "og:image:height": seoData["og:image:height"],
              "og:image:type": seoData["og:image:type"],
              "og:image:alt": seoData["og:image:alt"],
            } : getDefaultSeoData(pageSlug)
          };

          pages.push(pageData);
        }
      });
    }

    // إضافة الصفحات المضافة حديثاً
    recentlyAddedPages.forEach((pageSlug) => {
      const exists = pages.some((page) => page.slug === pageSlug);
      if (!exists) {
        const pageName = pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);
        pages.push({
          slug: pageSlug,
          name: pageName,
          path: `/${pageSlug}`,
        });
      }
    });

    console.log("🔍 tenantData WebsiteLayout:", websiteLayout?.metaTags?.pages);
    console.log("🔍 editorStore WebsiteLayout:", editorWebsiteLayout);

    // إضافة الصفحة الرئيسية في النهاية مع البيانات الافتراضية
    const homepageExists = pages.some((page) => page.slug === "" || page.path === "");
    if (!homepageExists) {
      pages.unshift({
        slug: "",
        name: "Homepage",
        path: "",
        seo: getDefaultSeoData("")
      });
    }

    // Console log لعرض availablePages بعد الـ merge
    console.log("🔍 availablePages after merge:", pages);
    
    return pages;
  }, [tenantData, recentlyAddedPages, editorWebsiteLayout]);

  // دالة لإضافة صفحة جديدة إلى القائمة المحلية
  const addPageToLocalList = (pageSlug: string) => {
    setRecentlyAddedPages((prev) => [...prev, pageSlug]);
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = t("validation.slug_required");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t("validation.slug_format");
    }

    // التحقق من عدم تكرار الـ slug
    const existingSlugs = tenantData?.componentSettings
      ? Object.keys(tenantData.componentSettings)
      : [];
    if (existingSlugs.includes(formData.slug)) {
      newErrors.slug = t("validation.slug_exists");
    }

    if (!formData.TitleAr.trim()) {
      newErrors.TitleAr = "عنوان الصفحة بالعربي مطلوب";
    }

    if (!formData.TitleEn.trim()) {
      newErrors.TitleEn = "عنوان الصفحة بالإنجليزي مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء صفحة جديدة
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // استخدام createPage من editorStore
      const { createPage } = useEditorStore.getState();

      createPage({
        slug: formData.slug,
        name: formData.slug, // استخدام slug كاسم الصفحة
        metaTitle: formData.TitleAr, // للتوافق مع النظام القديم
        metaDescription: formData.DescriptionAr,
        metaKeywords: formData.KeywordsAr,
      });

      // تحديث tenantStore لإضافة الصفحة الجديدة إلى componentSettings
      const { tenantData } = useTenantStore.getState();
      const updatedTenantData = {
        ...tenantData,
        componentSettings: {
          ...tenantData?.componentSettings,
          [formData.slug]: {}, // إضافة الصفحة الجديدة مع object فارغ للمكونات
        },
        // إضافة WebsiteLayout
        WebsiteLayout: {
          ...tenantData?.WebsiteLayout,
          metaTags: {
            ...tenantData?.WebsiteLayout?.metaTags,
            pages: [
              ...(tenantData?.WebsiteLayout?.metaTags?.pages || []),
              {
                TitleAr: formData.TitleAr,
                TitleEn: formData.TitleEn,
                DescriptionAr: formData.DescriptionAr || formData.TitleAr,
                DescriptionEn: formData.DescriptionEn || formData.TitleEn,
                KeywordsAr: formData.KeywordsAr || formData.TitleAr,
                KeywordsEn: formData.KeywordsEn || formData.TitleEn,
                Author: formData.Author || formData.TitleAr,
                AuthorEn: formData.AuthorEn || formData.TitleEn,
                Robots: formData.Robots || "index, follow",
                RobotsEn: formData.RobotsEn || "index, follow",
                "og:title": formData["og:title"] || formData.TitleAr,
                "og:description":
                  formData["og:description"] ||
                  formData.DescriptionAr ||
                  formData.TitleAr,
                "og:keywords":
                  formData["og:keywords"] ||
                  formData.KeywordsAr ||
                  formData.TitleAr,
                "og:author":
                  formData["og:author"] || formData.Author || formData.TitleAr,
                "og:robots":
                  formData["og:robots"] || formData.Robots || "index, follow",
                "og:url": formData["og:url"] || `/${formData.slug}`,
                "og:image": formData["og:image"] || "",
                "og:type": formData["og:type"] || "website",
                "og:locale": formData["og:locale"] || "ar",
                "og:locale:alternate": formData["og:locale:alternate"] || "en",
                "og:site_name": formData["og:site_name"] || formData.TitleAr,
                "og:image:width": formData["og:image:width"] || "",
                "og:image:height": formData["og:image:height"] || "",
                "og:image:type": formData["og:image:type"] || "",
                "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
                path: `/${formData.slug}`,
              },
            ],
          },
        },
      };

      // تحديث الـ store
      useTenantStore.setState({ tenantData: updatedTenantData });

      // تحديث editorStore مع WebsiteLayout
      const { addPageToWebsiteLayout } = useEditorStore.getState();
      addPageToWebsiteLayout({
        TitleAr: formData.TitleAr,
        TitleEn: formData.TitleEn,
        DescriptionAr: formData.DescriptionAr || formData.TitleAr,
        DescriptionEn: formData.DescriptionEn || formData.TitleEn,
        KeywordsAr: formData.KeywordsAr || formData.TitleAr,
        KeywordsEn: formData.KeywordsEn || formData.TitleEn,
        Author: formData.Author || formData.TitleAr,
        AuthorEn: formData.AuthorEn || formData.TitleEn,
        Robots: formData.Robots || "index, follow",
        RobotsEn: formData.RobotsEn || "index, follow",
        "og:title": formData["og:title"] || formData.TitleAr,
        "og:description":
          formData["og:description"] ||
          formData.DescriptionAr ||
          formData.TitleAr,
        "og:keywords":
          formData["og:keywords"] || formData.KeywordsAr || formData.TitleAr,
        "og:author":
          formData["og:author"] || formData.Author || formData.TitleAr,
        "og:robots":
          formData["og:robots"] || formData.Robots || "index, follow",
        "og:url": formData["og:url"] || `/${formData.slug}`,
        "og:image": formData["og:image"] || "",
        "og:type": formData["og:type"] || "website",
        "og:locale": formData["og:locale"] || "ar",
        "og:locale:alternate": formData["og:locale:alternate"] || "en",
        "og:site_name": formData["og:site_name"] || formData.TitleAr,
        "og:image:width": formData["og:image:width"] || "",
        "og:image:height": formData["og:image:height"] || "",
        "og:image:type": formData["og:image:type"] || "",
        "og:image:alt": formData["og:image:alt"] || formData.TitleAr,
        path: `/${formData.slug}`,
      });

      // التحقق من نوع الصفحة
      const predefinedPages = [
        "homepage",
        "about",
        "contact",
        "products",
        "collections",
      ];
      const isPredefinedPage = predefinedPages.includes(formData.slug);

      // إضافة الصفحة إلى القائمة المحلية
      addPageToLocalList(formData.slug);

      // إعادة تعيين النموذج
      setFormData({
        slug: "",
        TitleAr: "",
        TitleEn: "",
        DescriptionAr: "",
        DescriptionEn: "",
        KeywordsAr: "",
        KeywordsEn: "",
        Author: "",
        AuthorEn: "",
        Robots: "",
        RobotsEn: "",
        "og:title": "",
        "og:description": "",
        "og:keywords": "",
        "og:author": "",
        "og:robots": "",
        "og:url": "",
        "og:image": "",
        "og:type": "",
        "og:locale": "",
        "og:locale:alternate": "",
        "og:site_name": "",
        "og:image:width": "",
        "og:image:height": "",
        "og:image:type": "",
        "og:image:alt": "",
      });
      setErrors({});

      // إغلاق الـ dialog
      setIsAddPageDialogOpen(false);

      // إظهار رسالة نجاح
      toast.success(t("editor.page_created_successfully"));

      // التنقل إلى الصفحة الجديدة
      router.push(`${basePath}/${formData.slug}`);
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error(t("editor.error_creating_page"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId && !tenantData && !loadingTenantData) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, tenantData, loadingTenantData, fetchTenantData]);

  // تحميل جميع البيانات من componentSettings أو البيانات الافتراضية
  useEffect(() => {
    if (!tenantData) return;

    const { setPageComponentsForPage } = useEditorStore.getState();

    // التحقق من وجود componentSettings وأنها ليست فارغة
    const hasComponentSettings =
      tenantData.componentSettings &&
      typeof tenantData.componentSettings === "object" &&
      !Array.isArray(tenantData.componentSettings) &&
      Object.keys(tenantData.componentSettings).length > 0;

    if (hasComponentSettings) {
      // تحميل جميع الصفحات من componentSettings
      Object.entries(tenantData.componentSettings).forEach(
        ([pageSlug, pageData]: [string, any]) => {
          const components = Object.entries(pageData).map(
            ([id, component]: [string, any]) => ({
              id,
              type: component.type,
              name: component.name,
              componentName: component.componentName,
              data: component.data || {},
              position: component.position || 0,
              layout: component.layout || { row: 0, col: 0, span: 2 },
            }),
          );

          // تحديث كل صفحة في الـ store
          setPageComponentsForPage(pageSlug, components);
        },
      );
    } else {
      // تحميل البيانات الافتراضية من PAGE_DEFINITIONS
      const {
        PAGE_DEFINITIONS,
      } = require("@/lib-liveeditor/defaultComponents");

      Object.entries(PAGE_DEFINITIONS).forEach(
        ([pageSlug, pageData]: [string, any]) => {
          const components = Object.entries(pageData).map(
            ([id, component]: [string, any]) => ({
              id,
              type: component.type,
              name: component.name,
              componentName: component.componentName,
              data: component.data || {},
              position: component.position || 0,
              layout: component.layout || { row: 0, col: 0, span: 2 },
            }),
          );

          // تحديث كل صفحة في الـ store
          setPageComponentsForPage(pageSlug, components);
        },
      );
    }
  }, [tenantData]);

  // إضافة بيانات افتراضية للصفحات المحددة إذا لم تكن موجودة في WebsiteLayout
  useEffect(() => {
    if (!tenantData) return;

    const { addPageToWebsiteLayout } = useEditorStore.getState();
    
    // الصفحات المحددة مع بياناتها الافتراضية
    const defaultPages = [
      {
        path: "/",
        TitleAr: "الصفحة الرئيسية",
        TitleEn: "Homepage",
        DescriptionAr: "مرحباً بكم في موقعنا - الصفحة الرئيسية",
        DescriptionEn: "Welcome to our website - Homepage",
        KeywordsAr: "الرئيسية, الموقع, الصفحة الرئيسية",
        KeywordsEn: "homepage, main, website",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "الصفحة الرئيسية",
        "og:description": "مرحباً بكم في موقعنا",
        "og:keywords": "الرئيسية, الموقع",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "الصفحة الرئيسية"
      },
      {
        path: "/create-request",
        TitleAr: "إنشاء طلب",
        TitleEn: "Create Request",
        DescriptionAr: "إنشاء طلب جديد للحصول على الخدمات",
        DescriptionEn: "Create a new request to get our services",
        KeywordsAr: "إنشاء طلب, خدمات, طلب جديد",
        KeywordsEn: "create request, services, new request",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "إنشاء طلب",
        "og:description": "إنشاء طلب جديد للحصول على الخدمات",
        "og:keywords": "إنشاء طلب, خدمات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "إنشاء طلب"
      },
      {
        path: "/for-rent",
        TitleAr: "للإيجار",
        TitleEn: "For Rent",
        DescriptionAr: "عقارات متاحة للإيجار",
        DescriptionEn: "Properties available for rent",
        KeywordsAr: "للإيجار, عقارات, شقق, منازل",
        KeywordsEn: "for rent, properties, apartments, houses",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "للإيجار",
        "og:description": "عقارات متاحة للإيجار",
        "og:keywords": "للإيجار, عقارات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "للإيجار"
      },
      {
        path: "/for-sale",
        TitleAr: "للبيع",
        TitleEn: "For Sale",
        DescriptionAr: "عقارات متاحة للبيع",
        DescriptionEn: "Properties available for sale",
        KeywordsAr: "للبيع, عقارات, شقق, منازل",
        KeywordsEn: "for sale, properties, apartments, houses",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "للبيع",
        "og:description": "عقارات متاحة للبيع",
        "og:keywords": "للبيع, عقارات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "للبيع"
      },
      {
        path: "/projects",
        TitleAr: "المشاريع",
        TitleEn: "Projects",
        DescriptionAr: "مشاريعنا العقارية المتميزة",
        DescriptionEn: "Our distinguished real estate projects",
        KeywordsAr: "مشاريع, عقارية, تطوير, بناء",
        KeywordsEn: "projects, real estate, development, construction",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "المشاريع",
        "og:description": "مشاريعنا العقارية المتميزة",
        "og:keywords": "مشاريع, عقارية",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "المشاريع"
      },
      {
        path: "/contact-us",
        TitleAr: "اتصل بنا",
        TitleEn: "Contact Us",
        DescriptionAr: "تواصل معنا للحصول على المساعدة",
        DescriptionEn: "Contact us for assistance",
        KeywordsAr: "اتصل بنا, تواصل, مساعدة, خدمة العملاء",
        KeywordsEn: "contact us, communication, help, customer service",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "اتصل بنا",
        "og:description": "تواصل معنا للحصول على المساعدة",
        "og:keywords": "اتصل بنا, تواصل",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "اتصل بنا"
      },
      {
        path: "/about-us",
        TitleAr: "من نحن",
        TitleEn: "About Us",
        DescriptionAr: "تعرف على شركتنا وخدماتنا",
        DescriptionEn: "Learn about our company and services",
        KeywordsAr: "من نحن, شركة, خدمات, معلومات",
        KeywordsEn: "about us, company, services, information",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "من نحن",
        "og:description": "تعرف على شركتنا وخدماتنا",
        "og:keywords": "من نحن, شركة",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "من نحن"
      },
      {
        path: "/about",
        TitleAr: "حول",
        TitleEn: "About",
        DescriptionAr: "معلومات حول شركتنا",
        DescriptionEn: "Information about our company",
        KeywordsAr: "حول, معلومات, شركة",
        KeywordsEn: "about, information, company",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "حول",
        "og:description": "معلومات حول شركتنا",
        "og:keywords": "حول, معلومات",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "حول"
      },
      {
        path: "/contact",
        TitleAr: "تواصل",
        TitleEn: "Contact",
        DescriptionAr: "تواصل معنا",
        DescriptionEn: "Contact us",
        KeywordsAr: "تواصل, اتصال, مساعدة",
        KeywordsEn: "contact, communication, help",
        Author: "الموقع",
        AuthorEn: "Website",
        Robots: "index, follow",
        RobotsEn: "index, follow",
        "og:title": "تواصل",
        "og:description": "تواصل معنا",
        "og:keywords": "تواصل, اتصال",
        "og:author": "الموقع",
        "og:robots": "index, follow",
        "og:url": "",
        "og:image": "",
        "og:type": "website",
        "og:locale": "ar",
        "og:locale:alternate": "en",
        "og:site_name": "الموقع",
        "og:image:width": null,
        "og:image:height": null,
        "og:image:type": null,
        "og:image:alt": "تواصل"
      }
    ];

    // التحقق من كل صفحة بشكل منفصل
    const existingPages = tenantData.WebsiteLayout?.metaTags?.pages || [];
    const existingPaths = existingPages.map((page: any) => page.path);
    
    // إضافة الصفحات المفقودة
    const addedPages: string[] = [];
    defaultPages.forEach(defaultPage => {
      if (!existingPaths.includes(defaultPage.path)) {
        console.log(`🔧 Adding default data for page: ${defaultPage.path}`);
        addPageToWebsiteLayout(defaultPage);
        addedPages.push(defaultPage.path);
      } else {
        console.log(`ℹ️ Page ${defaultPage.path} already exists in WebsiteLayout`);
      }
    });
    
    if (addedPages.length > 0) {
      console.log(`✅ Added default data for ${addedPages.length} pages:`, addedPages);
    } else {
      console.log(`ℹ️ All default pages already exist in WebsiteLayout`);
    }
  }, [tenantData]);

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

  // if (!user) {
  //   return null;
  // }

  return (
    <nav
      className="bg-white border-b-[1.5px] border-red-300 sticky top-0 z-[9999]"
      dir="ltr"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Desktop Layout - Single Row */}
        <div className="hidden md:flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {t("editor.title")}
              </h1>
              <span className="ml-2 text-sm text-gray-500">({tenantId})</span>
            </div>
            {/* Desktop Pages Navigation - Show as links if less than 5 pages, otherwise show dropdown */}
            {availablePages.length < 5 ? (
              <div className="hidden xl:ml-6 xl:flex xl:space-x-8">
                {availablePages.map((page) => (
                  <Link
                    key={page.slug || "homepage"}
                    href={`${basePath}${page.path}`}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      currentPath === page.path
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {getPageTitle(page)}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="hidden xl:ml-6 xl:flex items-center">
                <div className="relative pages-dropdown-container">
                  <button
                    onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    aria-expanded={isPagesDropdownOpen}
                    aria-haspopup="true"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                    {t("editor.pages")}
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Pages Dropdown Menu */}
                  {isPagesDropdownOpen && (
                    <div className="absolute mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          {t("editor.pages")}
                        </h3>
                        <div className="space-y-1">
                          {availablePages.map((page) => (
                            <Link
                              key={page.slug || "homepage"}
                              href={`${basePath}${page.path}`}
                              onClick={() => setIsPagesDropdownOpen(false)}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                currentPath === page.path
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <svg
                                className="w-4 h-4 mr-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <span className="truncate">{getPageTitle(page)}</span>
                              {currentPath === page.path && (
                                <svg
                                  className="w-4 h-4 ml-auto text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Pages Dropdown - Visible on screens < 1100px */}
            <div className="xl:hidden flex items-center mx-2">
              <div className="relative pages-dropdown-container">
                <button
                  onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000"
                  aria-expanded={isPagesDropdownOpen}
                  aria-haspopup="true"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {t("editor.pages")}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Pages Dropdown Menu */}
                {isPagesDropdownOpen && (
                  <div className="absolute  mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {t("editor.pages")}
                      </h3>
                      <div className="space-y-1">
                        {availablePages.map((page) => (
                          <Link
                            key={page.slug || "homepage"}
                            href={`${basePath}${page.path}`}
                            onClick={() => setIsPagesDropdownOpen(false)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              currentPath === page.path
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="truncate">{getPageTitle(page)}</span>
                            {currentPath === page.path && (
                              <svg
                                className="w-4 h-4 ml-auto text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Actions - Hidden on screens <= 1400px */}
          <div className="hidden xl:flex items-center space-x-4">
            {/* Save Button - Always visible */}
            <div className="relative">
              <button
                onClick={requestSave}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-2000 focus:ring-blue-500 ${
                  showArrowTooltip
                    ? "bg-red-500 hover:bg-red-900 animate-pulse shadow-lg shadow-red-500/50"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {t("editor.save_changes")}
              </button>
            </div>

            {/* Add Page Button for Desktop */}
            <button
              onClick={() => setIsAddPageDialogOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("editor.add_page")}
            </button>

            <Link
              href={getTenantUrl(currentPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("editor.preview")}
            </Link>
            <Link
              href={getTenantUrl("/")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000 hover:scale-[calc(1.02)]"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              {t("editor.live_preview")}
            </Link>

            {/* Language Dropdown */}
            <LanguageDropdown />
          </div>

          {/* Mobile/Tablet Actions Dropdown - Visible on screens <= 1400px */}
          <div className="xl:hidden flex items-center space-x-2">
            {/* Save Button - Outside dropdown */}
            <div className="relative">
              <button
                onClick={requestSave}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-2000 focus:ring-blue-500 ${
                  showArrowTooltip
                    ? "bg-red-500 hover:bg-red-900 animate-pulse shadow-lg shadow-red-500/50"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {t("editor.save_changes")}
              </button>
            </div>

            <LanguageDropdown />

            {/* Modern Dropdown Menu */}
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {/* Add Page Button */}
                  <button
                    onClick={() => {
                      setIsAddPageDialogOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    {t("editor.add_page")}
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Preview Button */}
                  <Link
                    href={getTenantUrl(currentPath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t("editor.preview")}
                  </Link>

                  {/* Live Preview Button */}
                  <Link
                    href={getTenantUrl("/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {t("editor.live_preview")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout - Two Rows for screens < 820px */}
        <div className="md:hidden">
          {/* First Row - Title */}
          <div className="flex items-center justify-center py-3">
            <div className="flex-shrink-0 flex items-center pb-2 relative">
              <h1 className="text-lg font-bold text-gray-900">
                {t("editor.title")}
              </h1>
              <span className="ml-2 text-sm text-gray-500">({tenantId})</span>
              {/* Custom border width - يمكن تعديل العرض هنا */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[400px] h-px bg-gray-200"></div>
            </div>
          </div>

          {/* Second Row - Navigation and Actions */}
          <div className="flex items-center justify-between py-2">
            {/* Pages Dropdown */}
            <div className="flex items-center">
              <div className="relative pages-dropdown-container">
                <button
                  onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-2000"
                  aria-expanded={isPagesDropdownOpen}
                  aria-haspopup="true"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {t("editor.pages")}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Pages Dropdown Menu */}
                {isPagesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {t("editor.pages")}
                      </h3>
                      <div className="space-y-1">
                        {availablePages.map((page) => (
                          <Link
                            key={page.slug || "homepage"}
                            href={`${basePath}${page.path}`}
                            onClick={() => setIsPagesDropdownOpen(false)}
                            className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                              currentPath === page.path
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <svg
                              className="w-4 h-4 mr-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="truncate">{getPageTitle(page)}</span>
                            {currentPath === page.path && (
                              <svg
                                className="w-4 h-4 ml-auto text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Save Button */}
              <div className="relative">
                <button
                  onClick={requestSave}
                  className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-1000 focus:ring-blue-500 ${
                    showArrowTooltip
                      ? "bg-red-700 hover:bg-red-700 animate-pulse shadow-lg shadow-red-500/50"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span className="inline">{t("editor.save_changes")}</span>
                </button>
              </div>

              <LanguageDropdown />

              {/* Actions Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {/* Add Page Button */}
                    <button
                      onClick={() => {
                        setIsAddPageDialogOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      {t("editor.add_page")}
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Preview Button */}
                    <Link
                      href={getTenantUrl(currentPath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {t("editor.preview")}
                    </Link>

                    {/* Live Preview Button */}
                    <Link
                      href={getTenantUrl("/")}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      {t("editor.live_preview")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Page Dialog */}
      <Dialog open={isAddPageDialogOpen} onOpenChange={setIsAddPageDialogOpen}>
        <DialogContent
          className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto"
          dir="ltr"
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {t("editor.add_component")}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {t("editor.page_settings")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* معلومات الصفحة الأساسية */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("editor.basic_info")}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {t("editor.slug")} *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="homepage"
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* إعدادات SEO الأساسية */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-purple-50 text-purple-700"
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  {t("editor.seo_settings")} الأساسية
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="TitleAr" className="text-sm font-medium">
                    {t("editor.page_title_ar")} *
                  </Label>
                  <Input
                    id="TitleAr"
                    value={formData.TitleAr}
                    onChange={(e) =>
                      setFormData({ ...formData, TitleAr: e.target.value })
                    }
                    placeholder={t("editor.page_title_ar_placeholder")}
                    className={errors.TitleAr ? "border-red-500" : ""}
                  />
                  {errors.TitleAr && (
                    <p className="text-sm text-red-500">{errors.TitleAr}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="TitleEn" className="text-sm font-medium">
                    {t("editor.page_title_en")} *
                  </Label>
                  <Input
                    id="TitleEn"
                    value={formData.TitleEn}
                    onChange={(e) =>
                      setFormData({ ...formData, TitleEn: e.target.value })
                    }
                    placeholder={t("editor.page_title_en_placeholder")}
                    className={errors.TitleEn ? "border-red-500" : ""}
                  />
                  {errors.TitleEn && (
                    <p className="text-sm text-red-500">{errors.TitleEn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="DescriptionAr"
                    className="text-sm font-medium"
                  >
                    {t("editor.page_description_ar")}
                  </Label>
                  <Textarea
                    id="DescriptionAr"
                    value={formData.DescriptionAr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        DescriptionAr: e.target.value,
                      })
                    }
                    placeholder={t("editor.page_description_ar_placeholder")}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="DescriptionEn"
                    className="text-sm font-medium"
                  >
                    {t("editor.page_description_en")}
                  </Label>
                  <Textarea
                    id="DescriptionEn"
                    value={formData.DescriptionEn}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        DescriptionEn: e.target.value,
                      })
                    }
                    placeholder={t("editor.page_description_en_placeholder")}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="KeywordsAr" className="text-sm font-medium">
                    {t("editor.page_keywords_ar")}
                  </Label>
                  <Input
                    id="KeywordsAr"
                    value={formData.KeywordsAr}
                    onChange={(e) =>
                      setFormData({ ...formData, KeywordsAr: e.target.value })
                    }
                    placeholder={t("editor.page_keywords_ar_placeholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="KeywordsEn" className="text-sm font-medium">
                    {t("editor.page_keywords_en")}
                  </Label>
                  <Input
                    id="KeywordsEn"
                    value={formData.KeywordsEn}
                    onChange={(e) =>
                      setFormData({ ...formData, KeywordsEn: e.target.value })
                    }
                    placeholder={t("editor.page_keywords_en_placeholder")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* إعدادات متقدمة */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-700"
                  >
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {t("editor.advanced_settings")}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2"
                >
                  {showAdvanced
                    ? t("editor.hide_advanced")
                    : t("editor.show_advanced")}{" "}
                  {t("editor.advanced_settings_toggle")}
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </div>

              {showAdvanced && (
                <div className="space-y-6 p-4 bg-gray-50 rounded-lg border">
                  {/* Author & Robots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("editor.author_ar")}
                      </Label>
                      <Input
                        placeholder={t("editor.author_ar_placeholder")}
                        value={formData.Author}
                        onChange={(e) =>
                          setFormData({ ...formData, Author: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("editor.author_en")}
                      </Label>
                      <Input
                        placeholder={t("editor.author_en_placeholder")}
                        value={formData.AuthorEn}
                        onChange={(e) =>
                          setFormData({ ...formData, AuthorEn: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("editor.robots_ar")}
                      </Label>
                      <Input
                        placeholder={t("editor.robots_ar_placeholder")}
                        value={formData.Robots}
                        onChange={(e) =>
                          setFormData({ ...formData, Robots: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {t("editor.robots_en")}
                      </Label>
                      <Input
                        placeholder={t("editor.robots_ar_placeholder")}
                        value={formData.RobotsEn}
                        onChange={(e) =>
                          setFormData({ ...formData, RobotsEn: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Open Graph */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Open Graph
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          og:title
                        </Label>
                        <Input
                          placeholder={t("editor.og_title")}
                          value={formData["og:title"]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              "og:title": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          og:description
                        </Label>
                        <Input
                          placeholder={t("editor.og_description")}
                          value={formData["og:description"]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              "og:description": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          og:url
                        </Label>
                        <Input
                          placeholder={t("editor.og_url")}
                          value={formData["og:url"]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              "og:url": e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          og:image
                        </Label>
                        <Input
                          placeholder={t("editor.og_image")}
                          value={formData["og:image"]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              "og:image": e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddPageDialogOpen(false)}
              disabled={isLoading}
            >
              {t("editor.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {t("editor.creating")}
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {t("editor.create_page")}
                </>
              )}
            </Button>
          </DialogFooter>
          {/* Coming Soon Overlay - Disabled add page functionality - Only show in production */}
          {process.env.NODE_ENV !== "development" && (
            <div
              className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-start justify-center pointer-events-auto"
              style={{ paddingTop: "250px" }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  {t("live_editor.coming_soon")}
                </h2>
                <p className="text-red-500 font-medium">
                  {t("live_editor.components_disabled")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default function LiveEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { setLocale } = useEditorLocale();
  const t = useEditorT();
  const pathname = usePathname();

  // State for arrow tooltip
  const [showArrowTooltip, setShowArrowTooltip] = useState(false);
  const [previousHasChangesMade, setPreviousHasChangesMade] = useState(false);
  const hasChangesMade = useEditorStore((s) => s.hasChangesMade);

  // Token validation
  const { tokenValidation } = useTokenValidation();

  // تحديث الـ store عند تحميل الصفحة
  useEffect(() => {
    if (pathname) {
      const currentLang = pathname.split("/")[1] || "en";
      setLocale(currentLang as any);
    }
  }, [pathname, setLocale]);

  // Detect when hasChangesMade changes from false to true
  useEffect(() => {
    if (hasChangesMade && !previousHasChangesMade) {
      setShowArrowTooltip(true);
      // Auto-hide after 7 seconds
      setTimeout(() => {
        setShowArrowTooltip(false);
      }, 15000);
    }
    setPreviousHasChangesMade(hasChangesMade);
  }, [hasChangesMade, previousHasChangesMade]);

  // Show loading while validating token
  if (tokenValidation.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="ltr"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    // إضافة I18nProvider و EditorProvider و AuthProvider لتوفير السياق لكل الأبناء
    <I18nProvider>
      <AuthProvider>
        <EditorProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col" dir="ltr">
            {/* إضافة Toaster هنا ليعمل في كل مكان */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Translation Test Component - Remove in production */}

            <EditorNavBar showArrowTooltip={showArrowTooltip} />

            <main className="flex-1" dir="ltr">
              {children}
            </main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
