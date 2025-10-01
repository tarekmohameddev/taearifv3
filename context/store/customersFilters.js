import { create } from "zustand";

const useCustomersFiltersStore = create((set, get) => ({
  // Filter states
  searchTerm: "",
  filterType: "all",
  filterCity: "all",
  filterDistrict: "all",
  filterPriority: "all",

  // Filter data from API - initialize with empty arrays to prevent undefined errors
  filterData: {
    cities: [],
    districts: [],
    types: [],
    priorities: [],
    stages: [],
    procedures: [],
  },
  loadingFilters: true,

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterCity: (city) => set({ filterCity: city }),
  setFilterDistrict: (district) => set({ filterDistrict: district }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  // Set filter data from API
  setFilterData: (data) =>
    set({
      filterData: {
        cities: data?.cities || [],
        districts: data?.districts || [],
        types: data?.types || [],
        priorities: data?.priorities || [],
        stages: data?.stages || [],
        procedures: data?.procedures || [],
      },
      loadingFilters: false,
    }),
  setLoadingFilters: (loading) => set({ loadingFilters: loading }),

  // Clear all filters
  clearAllFilters: () =>
    set({
      searchTerm: "",
      filterType: "all",
      filterCity: "all",
      filterDistrict: "all",
      filterPriority: "all",
    }),

  // Check if any filters are applied
  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchTerm.trim() ||
      state.filterType !== "all" ||
      state.filterCity !== "all" ||
      state.filterDistrict !== "all" ||
      state.filterPriority !== "all"
    );
  },

  // Get current filter state as object
  getCurrentFilters: () => {
    const state = get();
    return {
      searchTerm: state.searchTerm,
      filterType: state.filterType,
      filterCity: state.filterCity,
      filterDistrict: state.filterDistrict,
      filterPriority: state.filterPriority,
    };
  },
}));

export default useCustomersFiltersStore;
