import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

interface Permission {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string | null;
}

interface UserData {
  id: number;
  tenant_id: number | null;
  account_type: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string | null;
  profile_image: string | null;
  permissions: Permission[];
  [key: string]: any;
}

interface PermissionCheck {
  hasPermission: boolean;
  loading: boolean;
  userData: UserData | null;
  error: string | null;
}

export const usePermissions = () => {
  const [permissionCheck, setPermissionCheck] = useState<PermissionCheck>({
    hasPermission: false,
    loading: true,
    userData: null,
    error: null,
  });

  const pathname = usePathname();

  // Extract slug from pathname (remove locale and /dashboard prefix)
  const getPageSlug = (pathname: string): string => {
    // Remove locale prefix (e.g., /ar, /en)
    let cleanPath = pathname.replace(/^\/[a-z]{2}/, "");

    // Remove /dashboard prefix
    cleanPath = cleanPath.replace(/^\/dashboard/, "");

    // Remove leading slash and get the first segment
    const segments = cleanPath.split("/").filter(Boolean);
    return segments[0] || "";
  };

  // Map page slugs to permission names
  const getPermissionName = (slug: string): string => {
    const permissionMap: { [key: string]: string } = {
      customers: "customers.view",
      properties: "properties.view",
      rentals: "rentals.view",
      projects: "projects.view",
      employees: "employees.view",
      analytics: "analytics.view",
      settings: "settings.view",
      "access-control": "access.control",
      marketing: "marketing.view",
      templates: "templates.view",
      websites: "websites.view",
      "activity-logs": "activity.logs.view",
      "purchase-management": "purchase.management",
      "rental-management": "rental.management",
      "financial-reporting": "financial.reporting",
      affiliate: "affiliate.view",
      "help-center": "help.center",
      solutions: "solutions.view",
      apps: "apps.view",
      blogs: "blogs.view",
      messages: "messages.view",
      "whatsapp-ai": "whatsapp.ai",
    };

    return permissionMap[slug] || `${slug}.view`;
  };

  const checkPermission = async () => {
    setPermissionCheck((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Get current page slug
      const pageSlug = getPageSlug(pathname);

      if (!pageSlug) {
        // If no specific page, allow access (dashboard home)
        setPermissionCheck({
          hasPermission: true,
          loading: false,
          userData: null,
          error: null,
        });
        return;
      }

      // Get user data from API
      const response = await axiosInstance.get("/user");

      if (response.data.status === "success" && response.data.data) {
        const userData: UserData = response.data.data;
        const permissions = userData.permissions || [];

        // Special handling for access-control page - only for tenants
        if (pageSlug === "access-control") {
          if (userData.account_type === "tenant") {
            setPermissionCheck({
              hasPermission: true,
              loading: false,
              userData,
              error: null,
            });
          } else {
            setPermissionCheck({
              hasPermission: false,
              loading: false,
              userData,
              error: "هذه الصفحة متاحة فقط للمستأجرين",
            });
          }
          return;
        }

        // Check if user is a tenant - if so, give full access to other pages
        if (userData.account_type === "tenant") {
          setPermissionCheck({
            hasPermission: true,
            loading: false,
            userData,
            error: null,
          });
          return;
        }

        // Get required permission name for current page
        const requiredPermission = getPermissionName(pageSlug);

        // Check if user has the required permission
        const hasPermission = permissions.some(
          (permission) => permission.name === requiredPermission,
        );

        setPermissionCheck({
          hasPermission,
          loading: false,
          userData,
          error: null,
        });
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error: any) {
      console.error("Permission check error:", error);
      setPermissionCheck({
        hasPermission: false,
        loading: false,
        userData: null,
        error: error.message || "خطأ في التحقق من الصلاحيات",
      });
    }
  };

  useEffect(() => {
    checkPermission();
  }, [pathname]);

  return {
    ...permissionCheck,
    checkPermission,
    getPageSlug: () => getPageSlug(pathname),
    getPermissionName: (slug: string) => getPermissionName(slug),
  };
};
