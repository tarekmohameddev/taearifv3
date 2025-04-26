import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

module.exports = (set) => ({
  contentManagement: {
    newSectionDialogOpen: false,
    statusFilter: "all",
    searchQuery: "",
    sections: [],
    apiAvailableIcons: [],
    error: null,
    loading: true,
    newSectionName: "",
    newSectionDescription: "",
    newSectionStatus: true,
    newSectionIcon: "FileText",
  },

  fetchContentSections: async () => {
    set((state) => ({
      contentManagement: {
        ...state.contentManagement,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل الأقسام...");

    try {
      const response = await axiosInstance.get(
        "https://taearif.com/api/content/sections",
      );
      console.log("response.data.data", response.data.data);
      console.log(response.data.data.sections);

      // تعيين البيانات مع التحقق من وجودها
      set((state) => ({
        contentManagement: {
          ...state.contentManagement,
          sections: response.data.data?.sections || [],
          apiAvailableIcons: response.data.data?.availableIcons || [],
          loading: false,
        },
      }));
      toast.success("تم تحميل الأقسام بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        contentManagement: {
          ...state.contentManagement,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل الأقسام", {
        id: loadingToast,
      });
    }
  },

  setContentManagement: (updates) =>
    set((state) => ({
      contentManagement: {
        ...state.contentManagement,
        ...updates,
      },
    })),
});
