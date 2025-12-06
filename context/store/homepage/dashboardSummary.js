import axiosInstance from "@/lib/axiosInstance";

export default (set) => ({
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
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/summary`,
      );
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardSummary: response.data,
          isDashboardSummaryUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
