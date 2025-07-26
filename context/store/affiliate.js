// context/store/affiliate.js
import axiosInstance from "@/lib/axiosInstance";

module.exports = (set, get) => ({
  affiliateData: {
    data: null,
    loading: false,
    error: null,
    isFetched: false,
  },

  fetchAffiliateData: async () => {
    const { affiliateData } = get();
    if (affiliateData.isFetched) return;
    set((state) => ({
      affiliateData: {
        ...state.affiliateData,
        loading: true,
        error: null,
      },
    }));
    try {
      const res = await axiosInstance.get("/affiliate");
      if (res?.data?.success) {
        set((state) => ({
          affiliateData: {
            ...state.affiliateData,
            data: res.data.data,
            loading: false,
            isFetched: true,
            error: null,
          },
        }));
      } else {
        set((state) => ({
          affiliateData: {
            ...state.affiliateData,
            loading: false,
            error: res?.data?.message || "فشل في جلب البيانات",
          },
        }));
      }
    } catch (error) {
      set((state) => ({
        affiliateData: {
          ...state.affiliateData,
          loading: false,
          error: error.message || "فشل في جلب البيانات",
        },
      }));
    }
  },

  setAffiliateData: (updates) =>
    set((state) => ({
      affiliateData: {
        ...state.affiliateData,
        ...updates,
      },
    })),
});
