import axiosInstance from "@/lib/axiosInstance";

module.exports = (set) => ({
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
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/traffic-sources`
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
});
