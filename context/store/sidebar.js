import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
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
  LayoutGrid,
  Dock,
  Bot,
  Link as LinkIcon,
  SquarePen,
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
    case "link":
      return LinkIcon;
    case "dock":
      return Dock;
    case "layout-grid":
      return LayoutGrid;
    case "bot":
      return Bot;
      case "square-pen":
        return SquarePen;
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
  },

  fetchSideMenus: async (app) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    const { sidebarData } = get();
    if (!app) {
      if (sidebarData.isSidebarFetched) return;
    }

    // فقط إظهار loading إذا لم تكن هناك بيانات موجودة
    const showLoading = sidebarData.mainNavItems.length === 0;

    set((state) => ({
      sidebarData: {
        ...state.sidebarData,
        loading: showLoading,
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
        isAPP: section.isAPP || false,
      }));

      set((state) => ({
        sidebarData: {
          ...state.sidebarData,
          mainNavItems: items,
          isSidebarFetched: true,
          loading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        sidebarData: {
          ...state.sidebarData,
          error: error.message || "حدث خطأ أثناء جلب بيانات القوائم الجانبية",
          loading: false,
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
