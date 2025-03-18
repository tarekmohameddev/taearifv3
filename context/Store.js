import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

const useStore = create((set) => ({
  recentActivityData: [],
  isRecentActivityUpdated: false,
  loading: false,

  // قسم خاص بـ homepage
  homepage: {
    visitorData: {
      7: [],   // بيانات الزوار لـ 7 أيام
      30: [],  // بيانات الزوار لـ 30 يومًا
      90: [],  // بيانات الزوار لـ 3 أشهر
      365: [], // بيانات الزوار لـ سنة
    },
    selectedTimeRange: "7", // الفترة الزمنية المختارة حاليًا (افتراضيًا 7 أيام)

    // دالة لتحديث بيانات الزوار لفترة زمنية معينة
    setVisitorData: (timeRange, data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          visitorData: {
            ...state.homepage.visitorData,
            [timeRange]: data,
          },
        },
      })),

    // دالة لجلب بيانات الزوار من الـ API لفترة زمنية معينة
    fetchVisitorData: async (timeRange) => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/visitors",
          {
            params: { time_range: timeRange },
          }
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            visitorData: {
              ...state.homepage.visitorData,
              [timeRange]: response.data.visitor_data,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        set({ loading: false });
      }
    },

    // دالة لتحديث الفترة الزمنية المختارة
    setSelectedTimeRange: (range) =>
      set((state) => ({
        homepage: { ...state.homepage, selectedTimeRange: range },
      })),

    // بيانات الأجهزة
    dashboardDevice: [],
    isDashboardDeviceUpdated: false,
    setDashboardDevice: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardDevice: data,
          isDashboardDeviceUpdated: true,
        },
      })),
    fetchDashboardDevice: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/devices"
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            dashboardDevice: response.data.devices,
            isDashboardDeviceUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching dashboard devices:", error);
      } finally {
        set({ loading: false });
      }
    },

    // ملخص اللوحة
    dashboardSummary: null,
    isDashboardSummaryUpdated: false,
    setDashboardSummary: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardSummary: data,
          isDashboardSummaryUpdated: true,
        },
      })),
    fetchDashboardSummary: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/summary"
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            dashboardSummary: response.data,
            isDashboardSummaryUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        set({ loading: false });
      }
    },

    // مصادر الزيارات
    trafficSources: [],
    isTrafficSourcesUpdated: false,
    setTrafficSources: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          trafficSources: data,
          isTrafficSourcesUpdated: true,
        },
      })),
    fetchTrafficSources: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/traffic-sources"
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            trafficSources: response.data.sources,
            isTrafficSourcesUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching traffic sources:", error);
      } finally {
        set({ loading: false });
      }
    },

    // بيانات تقدم الإعداد (الإضافة الجديدة)
    setupProgressData: null,
    isSetupProgressDataUpdated: false,
    setSetupProgressData: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          setupProgressData: data,
          isSetupProgressDataUpdated: true,
        },
      })),
    fetchSetupProgressData: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/setup-progress"
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            setupProgressData: response.data,
            isSetupProgressDataUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching setup progress data:", error);
      } finally {
        set({ loading: false });
      }
    },
  },

  // دوال متعلقة بـ recentActivity
  setRecentActivityData: (data) =>
    set({ recentActivityData: data, isRecentActivityUpdated: true }),

  fetchRecentActivityData: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        "https://taearif.com/api/dashboard/recent-activity"
      );
      set({ recentActivityData: response.data, isRecentActivityUpdated: true });
    } catch (error) {
      console.error("Error fetching recent activity data:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useStore;