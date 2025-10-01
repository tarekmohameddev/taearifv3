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
      newErrors.pageName = t("validation.page_name_required");
    }

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

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = t("validation.meta_title_required");
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
        ? t("messages.page_created_with_defaults")
        : t("messages.custom_page_created");

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
      toast.error(t("messages.error_creating_page"));
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
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:text-white hover:scale-[calc(1.05)] border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
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
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto" dir="ltr">
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
                {t("editor.page_information")}
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
                  placeholder={t("forms.page_name_placeholder")}
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
                  {t("forms.slug")} *
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
                  {t("forms.url_preview", { tenantId, slug: formData.slug })}
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
                        {t("messages.default_components_note")}
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
                        {t("messages.custom_page_note")}
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
                {t("editor.seo_settings")}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="metaTitle"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("forms.meta_title")} *
                </Label>
                <Input
                  id="metaTitle"
                  placeholder={t("forms.meta_title_placeholder")}
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
                  {t("forms.meta_title_help")}
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="metaDescription"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("forms.meta_description")}
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder={t("forms.meta_description_placeholder")}
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
                  {t("forms.meta_description_help")}
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="metaKeywords"
                  className="text-sm font-medium text-gray-700"
                >
                  {t("forms.meta_keywords")}
                </Label>
                <Input
                  id="metaKeywords"
                  placeholder={t("forms.meta_keywords_placeholder")}
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
                  {t("forms.meta_keywords_help")}
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
                  {t("editor.quick_preview")}
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
                    t("forms.page_description_placeholder")}
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
            {t("common.cancel")}
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
                {t("common.creating")}
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
  const {
    liveEditorUser: user,
    liveEditorLoading: loading,
    userData,
  } = useAuthStore();
  const router = useRouter();
  const [recentlyAddedPages, setRecentlyAddedPages] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const [isAddPageDialogOpen, setIsAddPageDialogOpen] = useState(false);
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

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsDropdownOpen(false);
        }
      }
      if (isPagesDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.pages-dropdown-container')) {
          setIsPagesDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pageName.trim()) {
      newErrors.pageName = t("validation.page_name_required");
    }

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

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = t("validation.meta_title_required");
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

      // إضافة الصفحة إلى القائمة المحلية
      addPageToLocalList(formData.slug);

      // إعادة تعيين النموذج
      setFormData({
        pageName: "",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
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

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.push("/login");
  //   }
  // }, [user, loading, router]);

  // if (!user) {
  //   return null;
  // }

  return (
    <nav className="bg-white border-b-[1.5px] border-red-300 sticky top-0 z-[9999]" dir="ltr">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-1">
        {/* Desktop Layout - Single Row */}
        <div className="hidden md:flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{t("editor.title")}</h1>
              <span className="ml-2 text-sm text-gray-500">({tenantId})</span>
            </div>
            {/* Desktop Pages Navigation - Hidden on screens < 1100px */}
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
                  {page.name}
                </Link>
              ))}
            </div>

            {/* Mobile Pages Dropdown - Visible on screens < 1100px */}
            <div className="xl:hidden flex items-center mx-2">
              <div className="relative pages-dropdown-container">
                <button
                  onClick={() => setIsPagesDropdownOpen(!isPagesDropdownOpen)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
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
                            <span className="truncate">{page.name}</span>
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
            <button
              onClick={requestSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 focus:ring-blue-500"
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

            {/* Add Page Button for Desktop */}
            <button
              onClick={() => setIsAddPageDialogOpen(true)}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("editor.add_page")}
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
              href={getTenantUrl("/")}
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

          {/* Mobile/Tablet Actions Dropdown - Visible on screens <= 1400px */}
          <div className="xl:hidden flex items-center space-x-2">
            {/* Save Button - Outside dropdown */}
            <button
              onClick={requestSave}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 focus:ring-blue-500"
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
              <h1 className="text-lg font-bold text-gray-900">{t("editor.title")}</h1>
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
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
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
                            <span className="truncate">{page.name}</span>
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
              <button
                onClick={requestSave}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:scale-[calc(1.05)] bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 focus:ring-blue-500"
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
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto" dir="ltr">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pageName" className="text-sm font-medium">
                    {t("editor.page_name")} *
                  </Label>
                  <Input
                    id="pageName"
                    value={formData.pageName}
                    onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
                    placeholder={t("editor.page_name_placeholder")}
                    className={errors.pageName ? "border-red-500" : ""}
                  />
                  {errors.pageName && (
                    <p className="text-sm text-red-500">{errors.pageName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-medium">
                    {t("editor.slug")} *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={t("editor.slug_placeholder")}
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* معلومات SEO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-50 text-green-700">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {t("editor.seo_settings")}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle" className="text-sm font-medium">
                    {t("editor.meta_title")} *
                  </Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder={t("editor.meta_title_placeholder")}
                    className={errors.metaTitle ? "border-red-500" : ""}
                  />
                  {errors.metaTitle && (
                    <p className="text-sm text-red-500">{errors.metaTitle}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription" className="text-sm font-medium">
                    {t("editor.meta_description")}
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder={t("editor.meta_description_placeholder")}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaKeywords" className="text-sm font-medium">
                    {t("editor.meta_keywords")}
                  </Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder={t("editor.meta_keywords_placeholder")}
                  />
                </div>
              </div>
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

  // Token validation
  const { tokenValidation } = useTokenValidation();

  // تحديث الـ store عند تحميل الصفحة
  useEffect(() => {
    if (pathname) {
      const currentLang = pathname.split("/")[1] || "en";
      setLocale(currentLang as any);
    }
  }, [pathname, setLocale]);


  // Show loading while validating token
  if (tokenValidation.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        dir="ltr"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.validating_session")}</p>
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

            <EditorNavBar />

            <main className="flex-1" dir="ltr">{children}</main>
          </div>
        </EditorProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
