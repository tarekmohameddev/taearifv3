import axiosInstance from "@/lib/axiosInstance";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

module.exports = (set) => ({
  propertiesManagement: {
    viewMode: "grid",
    priceRange: [200000, 1000000],
    favorites: [],
    properties: [],
    loading: false,
    error: null,
    isInitialized: false,
    pagination: null,
    propertiesAllData: null,
  },

  setPropertiesManagement: (newState) =>
    set((state) => {
      console.log("🔄 setPropertiesManagement CALLED with:", newState);
      return {
        propertiesManagement: {
          ...state.propertiesManagement,
          ...newState,
        },
      };
    }),
});
