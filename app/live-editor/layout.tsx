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
import { useEditorT, useEditorLocale } from "@/context-liveeditor/editorI18nStore";
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
}: {
  onPageCreated?: (pageSlug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pageName: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const t = useEditorT();

  const { tenantData } = useTenantStore();
  const { userData } = useAuthStore();
  const router = useRouter();
  const { locale } = useEditorLocale();

  // التأكد من وجود tenantId من userData.username
  const tenantId = userData?.username;

  // إذا لم يكن هناك tenantId، لا نعرض المكون
  if (!tenantId) {
    return null;
  }

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pageName.trim()) {
      newErrors.pageName = "Page name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    // التحقق من عدم تكرار الـ slug
    const existingSlugs = tenantData?.componentSettings
      ? Object.keys(tenantData.componentSettings)
      : [];
    if (existingSlugs.includes(formData.slug)) {
      newErrors.slug = "This slug already exists";
    }

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = "Meta title is required";
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
        name: formData.pageName,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
      });

      // تحديث tenantStore لإضافة الصفحة الجديدة إلى componentSettings
      const { tenantData } = useTenantStore.getState();
      const updatedTenantData = {
        ...tenantData,
        componentSettings: {
          ...tenantData?.componentSettings,
          [formData.slug]: {}, // إضافة الصفحة الجديدة مع object فارغ للمكونات
        },
      };

      // تحديث الـ store
      useTenantStore.setState({ tenantData: updatedTenantData });

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
        ? "Page created successfully with default components!"
        : "Custom page created successfully!";

      toast.success(successMessage);
      setOpen(false);

      // إضافة الصفحة إلى القائمة المحلية
      onPageCreated?.(formData.slug);

      // إعادة توجيه إلى الصفحة الجديدة
      router.push(`/live-editor/${formData.slug}`);

      // إعادة تعيين النموذج
      setFormData({
        pageName: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      });
    } catch (error) {
      toast.error("Error creating page");
      console.error("Error creating page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث الـ slug تلقائياً بناءً على اسم الصفحة
  const handlePageNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      pageName: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim(),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`inline-flex ${locale == "ar"? "mx-4": "" } items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:text-white hover:scale-[calc(1.05)] border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl`}
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
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
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
                Page Information
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="pageName"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("forms.name")} *
                </Label>
                <Input
                  id="pageName"
                  placeholder="e.g., Products Page"
                  value={formData.pageName}
                  onChange={(e) => handlePageNameChange(e.target.value)}
                  className={`transition-all duration-200 ${errors.pageName ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                />
                {errors.pageName && (
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
                    {errors.pageName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="slug"
                  className="text-sm font-medium text-gray-700"
                >
                  Slug (Page URL) *
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    /tenant/{tenantId}/
                  </span>
                  <Input
                    id="slug"
                    placeholder="products"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className={`pl-32 transition-all duration-200 ${errors.slug ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                  />
                </div>
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
                <p className="text-xs text-gray-500">
                  URL will be: /tenant/{tenantId}/{formData.slug}
                </p>
                {formData.slug && (
                  <div className="mt-2">
                    {[
                      "homepage",
                      "about",
                      "contact",
                      "products",
                      "collections",
                    ].includes(formData.slug) ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-md">
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
                        This page will be created with default components
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        This will be a custom page (empty by default)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* إعدادات SEO */}
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
                SEO Settings
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="metaTitle"
                  className="text-sm font-medium text-gray-700"
                >
                  Meta Title *
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="Page title for search engines"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  className={`transition-all duration-300 ${errors.metaTitle ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "focus:border-blue-500 focus:ring-blue-200"}`}
                />
                {errors.metaTitle && (
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
                    {errors.metaTitle}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  This title will appear in search results
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="metaDescription"
                  className="text-sm font-medium text-gray-700"
                >
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Brief description of the page for search results"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  className="resize-none focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="metaKeywords"
                  className="text-sm font-medium text-gray-700"
                >
                  Meta Keywords
                </Label>
                <Input
                  id="metaKeywords"
                  placeholder="keyword1, keyword2, keyword3"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaKeywords: e.target.value,
                    }))
                  }
                  className="focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          </div>

          {/* معاينة سريعة */}
          {formData.metaTitle && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700"
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Quick Preview
                </Badge>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-blue-600 text-sm truncate">
                  /tenant/{tenantId}/{formData.slug}
                </div>
                <div className="text-lg font-medium text-gray-900 truncate mt-1">
                  {formData.metaTitle}
                </div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {formData.metaDescription ||
                    "Page description will appear here..."}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
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
                Creating...
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
                {t("editor.add_component")}
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// مكون الشريط العلوي الجديد ليستطيع الوصول للسياق
function EditorNavBar() {
  const pathname = usePathname();
  const requestSave = useEditorStore((state) => state.requestSave);
  const { liveEditorUser: user, liveEditorLoading: loading, userData } = useAuthStore();
  const router = useRouter();
  const [recentlyAddedPages, setRecentlyAddedPages] = useState<string[]>([]);
  const t = useEditorT();

  const tenantId = userData?.username || "";
  const basePath = `/live-editor`;
  const currentPath = (pathname || "").replace(basePath, "") || "";
  
  // إنشاء URL كامل مع tenantId.domain.com
  const getTenantUrl = (path: string = "") => {
    if (!tenantId) return path;
    
    // في التطوير: tenantId.localhost:3000
    // في الإنتاج: tenantId.domain.com
    const isDevelopment = process.env.NODE_ENV === 'development';
    const domain = isDevelopment ? 'localhost:3000' : 'taearif.com';
    
    return `http${isDevelopment ? '' : 's'}://${tenantId}.${domain}${path}`;
  };
  const { fetchTenantData, tenantData, loadingTenantData, error } =
    useTenantStore();

  // إنشاء قائمة الصفحات المتاحة من الـ backend
  const availablePages = useMemo(() => {
    const pages = [{ slug: "", name: "Homepage", path: "" }];

    // إضافة الصفحات من الـ backend إذا كانت موجودة
    if (tenantData?.componentSettings) {
      // تحويل componentSettings إلى object عادي إذا كان Map
      const componentSettings =
        tenantData.componentSettings instanceof Map
          ? Object.fromEntries(tenantData.componentSettings)
          : tenantData.componentSettings;

      if (componentSettings && typeof componentSettings === "object") {
        const componentSettingsKeys = Object.keys(componentSettings);

        componentSettingsKeys.forEach((pageSlug) => {
          if (pageSlug !== "homepage") {
            const pageName =
              pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);
            pages.push({
              slug: pageSlug,
              name: pageName,
              path: `/${pageSlug}`,
            });
          }
        });
      } else {
      }
    } else {
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

    // إضافة الصفحات الافتراضية فقط إذا كانت componentSettings فارغة
    const defaultPages = [
      { slug: "for-rent", name: "For-rent", path: "/for-rent" },
      { slug: "for-sale", name: "For-sale", path: "/for-sale" },
      { slug: "about-us", name: "About-us", path: "/about-us" },
      { slug: "Contact-us", name: "Contact-us", path: "/contact-us" },
    ];

    // تحويل componentSettings للاستخدام في التحقق
    const componentSettings =
      tenantData?.componentSettings instanceof Map
        ? Object.fromEntries(tenantData.componentSettings)
        : tenantData?.componentSettings;

    // إضافة الصفحات الافتراضية فقط إذا كانت componentSettings فارغة أو غير موجودة
    const hasComponentSettings =
      componentSettings && Object.keys(componentSettings).length > 0;

    if (!hasComponentSettings) {
      defaultPages.forEach((defaultPage) => {
        pages.push(defaultPage);
      });
    } else {
    }

    return pages;
  }, [tenantData, recentlyAddedPages]);

  // دالة لإضافة صفحة جديدة إلى القائمة المحلية
  const addPageToLocalList = (pageSlug: string) => {
    setRecentlyAddedPages((prev) => [...prev, pageSlug]);
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
    const hasComponentSettings = tenantData.componentSettings && 
                                  typeof tenantData.componentSettings === 'object' && 
                                  !Array.isArray(tenantData.componentSettings) &&
                                  Object.keys(tenantData.componentSettings).length > 0;

    if (hasComponentSettings) {
      // تحميل جميع الصفحات من componentSettings
      Object.entries(tenantData.componentSettings).forEach(([pageSlug, pageData]: [string, any]) => {
        const components = Object.entries(pageData).map(([id, component]: [string, any]) => ({
          id,
          type: component.type,
          name: component.name,
          componentName: component.componentName,
          data: component.data || {},
          position: component.position || 0,
          layout: component.layout || { row: 0, col: 0, span: 2 }
        }));
        
        // تحديث كل صفحة في الـ store
        setPageComponentsForPage(pageSlug, components);
      });
    } else {
      // تحميل البيانات الافتراضية من PAGE_DEFINITIONS
      const { PAGE_DEFINITIONS } = require("@/lib-liveeditor/defaultComponents");
      
      Object.entries(PAGE_DEFINITIONS).forEach(([pageSlug, pageData]: [string, any]) => {
        const components = Object.entries(pageData).map(([id, component]: [string, any]) => ({
          id,
          type: component.type,
          name: component.name,
          componentName: component.componentName,
          data: component.data || {},
          position: component.position || 0,
          layout: component.layout || { row: 0, col: 0, span: 2 }
        }));
        
        // تحديث كل صفحة في الـ store
        setPageComponentsForPage(pageSlug, components);
      });
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
    <nav className="bg-white border-b-[1.5px] border-red-300 sticky top-0 z-[9999]">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Live Editor</h1>
              <span className="ml-2 text-sm text-gray-500">({tenantId})</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
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
                  {page.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AddPageDialog onPageCreated={addPageToLocalList} />
            
            <button
              onClick={requestSave} // عند الضغط، يتم استدعاء الدالة من السياق
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 focus:ring-blue-500 "
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
            <Link
              href={getTenantUrl(currentPath)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-[calc(1.02)]"
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
              href={getTenantUrl('/')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-[calc(1.02)]"
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
        </div>
      </div>
    </nav>
  );
}

export default function LiveEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { setLocale } = useEditorLocale();
  const pathname = usePathname();
  
  // Token validation
  const { tokenValidation } = useTokenValidation();

  // تحديث الـ store عند تحميل الصفحة
  useEffect(() => {
    if (pathname) {
      const currentLang = pathname.split('/')[1] || 'en';
      setLocale(currentLang as any);
    }
  }, [pathname, setLocale]);

  // Show loading while validating token
  if (tokenValidation.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من صحة الجلسة...</p>
        </div>
      </div>
    );
  }

  return (
    // إضافة I18nProvider و EditorProvider و AuthProvider لتوفير السياق لكل الأبناء
    <I18nProvider>
      <AuthProvider>
        <EditorProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* إضافة Toaster هنا ليعمل في كل مكان */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Translation Test Component - Remove in production */}

            <EditorNavBar />

            <main className="flex-1">{children}</main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
