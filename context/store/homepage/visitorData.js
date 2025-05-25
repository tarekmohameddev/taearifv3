import axiosInstance from "@/lib/axiosInstance";

module.exports = (set) => ({
  visitorData: {
    7: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false
    },
    30: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false
    },
    90: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false
    },
    365: {
      data: [],
      totalVisits: 0,
      totalUniqueVisitors: 0,
      fetched: false
    },
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
            [timeRange]: {
              data: response.data.visitor_data,
              totalVisits: response.data.total_visits,
              totalUniqueVisitors: response.data.total_unique_visitors,
              fetched: true,
            },
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
