import axiosInstance from "@/lib/axiosInstance";

export default (set) => ({
  setupProgressData: null,
  isSetupProgressDataUpdated: false,

  fetchSetupProgressData: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/steps/progress"); // ← تأكد من المسار الصحيح
      set((state) => ({
        homepage: {
          ...state.homepage,
          setupProgressData: response.data, // نخزن الكل: { steps, progress, continue_path }
          isSetupProgressDataUpdated: true,
        },
      }));
    } catch (error) {
      // Handle error silently
    } finally {
      set({ loading: false });
    }
  },
});
