import axiosInstance from "@/lib/axiosInstance";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set) => ({
  propertiesManagement: {
    viewMode: "grid", // Can be "grid", "list", or "map"
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
    set((state) => ({
      propertiesManagement: {
        ...state.propertiesManagement,
        ...newState,
      },
    })),
});
