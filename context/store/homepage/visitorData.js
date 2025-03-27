import axiosInstance from "@/lib/axiosInstance";

module.exports = (set) => ({
  visitorData: {
    7: [],
    30: [],
    90: [],
    365: [],
  },
  selectedTimeRange: "7",

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

  fetchVisitorData: async (timeRange) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        "https://taearif.com/api/dashboard/visitors",
        { time_range: timeRange },
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
});
