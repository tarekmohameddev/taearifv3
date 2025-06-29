import axiosInstance from "@/lib/axiosInstance";

module.exports = (set) => ({
  recentActivityData: [],
  isRecentActivityUpdated: false,

  setRecentActivityData: (data) =>
    set({ recentActivityData: data, isRecentActivityUpdated: true }),

  fetchRecentActivityData: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/recent-activity`
      );
      set({ recentActivityData: response.data, isRecentActivityUpdated: true });
    } catch (error) {
      console.error("Error fetching recent activity data:", error);
    } finally {
      set({ loading: false });
    }
  },
});
