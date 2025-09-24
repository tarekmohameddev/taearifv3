// context/Store.js
const { create } = require("zustand");
const axiosInstance = require("@/lib/axiosInstance");

const useStore = create((set, get) => {
  return {
    loading: false,
    homepage: {
      ...require("./store/homepage/dashboardDevice")(set),
      ...require("./store/homepage/dashboardSummary")(set),
      ...require("./store/homepage/visitorData")(set),
      ...require("./store/homepage/setupProgress")(set),
      ...require("./store/homepage/trafficSources")(set),

      setSelectedTimeRange: (range) =>
        set((state) => ({
          homepage: { ...state.homepage, selectedTimeRange: range },
        })),
    },
    ...require("./store/contentManagement")(set),
    ...require("./store/recentActivity")(set),
    ...require("./store/projectsManagement")(set),
    ...require("./store/propertiesManagement")(set),
    ...require("./store/blogManagement")(set, get),
    ...require("./store/affiliate")(set, get),
    ...require("./store/sidebar")(set, get),
    ...require("./store/rentalManagement")(set, get),
    ...require("./store/purchaseManagement")(set, get),
    ...require("./store/userAuth")(set),
  };
});

module.exports = useStore;
