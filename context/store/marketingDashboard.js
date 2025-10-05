import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import toast from "react-hot-toast";

module.exports = (set) => ({
  // Marketing Channels Management
  marketingChannels: {
    channels: [],
    loading: false,
    error: null,
  },

  fetchMarketingChannels: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        loading: true,
        error: null,
      },
    }));

    const loadingToast = toast.loading("جاري تحميل قنوات التسويق...");

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels`,
      );

      // تصفية القنوات لعرض فقط قنوات الواتساب
      const whatsappChannels = response.data.data?.filter(
        (channel) => channel.type === "whatsapp"
      ) || [];

      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: whatsappChannels,
          loading: false,
        },
      }));
      toast.success("تم تحميل قنوات التسويق بنجاح", { id: loadingToast });
    } catch (error) {
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
      toast.error(error.message || "حدث خطأ أثناء تحميل قنوات التسويق", {
        id: loadingToast,
      });
    }
  },

  setMarketingChannels: (updates) =>
    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        ...updates,
      },
    })),

  createMarketingChannel: async (channelData) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري إنشاء القناة...");

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels`,
        channelData
      );

      // إضافة القناة الجديدة إلى القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: [...state.marketingChannels.channels, response.data.data],
        },
      }));

      toast.success("تم إنشاء القناة بنجاح", { id: loadingToast });
      return { success: true, data: response.data.data };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء إنشاء القناة", {
        id: loadingToast,
      });
      return { success: false, error: error.message || "حدث خطأ أثناء إنشاء القناة" };
    }
  },

  deleteMarketingChannel: async (channelId) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return { success: false, error: "لا يوجد توكن" };
    }

    const loadingToast = toast.loading("جاري حذف القناة...");

    try {
      await axiosInstance.delete(
        `${process.env.NEXT_PUBLIC_Backend_URL}/v1/marketing/channels/${channelId}`
      );

      // إزالة القناة من القائمة
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: state.marketingChannels.channels.filter(
            (channel) => channel.id !== channelId
          ),
        },
      }));

      toast.success("تم حذف القناة بنجاح", { id: loadingToast });
      return { success: true };
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء حذف القناة", {
        id: loadingToast,
      });
      return { success: false, error: error.message || "حدث خطأ أثناء حذف القناة" };
    }
  },
});
