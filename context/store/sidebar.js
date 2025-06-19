import axiosInstance from "@/lib/axiosInstance";
import {
  Building2,
  FileText,
  Home,
  MessageSquare,
  Package,
  Settings,
  Users,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";

const getIconComponent = (iconName) => {
  switch (iconName) {
    case "panel":
      return LayoutDashboard;
    case "content-settings":
      return FileText;
    case "web-settings":
      return Settings;
    case "building":
      return Building2;
    case "home":
      return Home;
    case "message":
      return MessageSquare;
    case "package":
      return Package;
    case "users":
      return Users;
    case "external-link":
      return ExternalLink;
    default:
      return FileText;
  }
};

module.exports = (set, get) => ({
  sidebarData: {
    mainNavItems: [],
    isSidebarFetched: false,
    loading: false,
    error: null,
    isRefreshing: false, // إضافة حالة للتحديث في الخلفية
  },
  
  fetchSideMenus: async (app) => {
    const { sidebarData } = get();
    if (!app) {
      if (sidebarData.isSidebarFetched) return;
    }
    
    // إذا كانت هناك بيانات موجودة، استخدم isRefreshing بدلاً من loading
    const hasExistingData = sidebarData.mainNavItems.length > 0;
    
    set((state) => ({
      sidebarData: {
        ...state.sidebarData,
        loading: !hasExistingData, // فقط إظهار loading إذا لم تكن هناك بيانات
        isRefreshing: hasExistingData, // إظهار أنه يتم التحديث في الخلفية
        error: null,
      },
    }));
    
    try {
      const response = await axiosInstance.get("/settings/side-menus");
      const sections = response.data.data.sections;
      const items = sections.map((section) => ({
        id: section.path.split("/").pop(),
        label: section.title,
        description: section.description,
        icon: getIconComponent(section.icon),
        path: section.path,
      }));
      
      set((state) => ({
        sidebarData: {
          ...state.sidebarData,
          mainNavItems: items,
          isSidebarFetched: true,
          loading: false,
          isRefreshing: false,
        },
      }));
    } catch (error) {
      console.error("فشل في جلب القوائم الجانبية:", error);
      set((state) => ({
        sidebarData: {
          ...state.sidebarData,
          error: error.message || "حدث خطأ أثناء جلب بيانات القوائم الجانبية",
          loading: false,
          isRefreshing: false,
        },
      }));
    }
  },
  
  setSidebarData: (updates) =>
    set((state) => ({
      sidebarData: {
        ...state.sidebarData,
        ...updates,
      },
    })),
    
  // إعادة تعيين البيانات لإجبار إعادة جلبها
  resetSidebarData: () =>
    set((state) => ({
      sidebarData: {
        ...state.sidebarData,
        isSidebarFetched: false,
      },
    })),
});