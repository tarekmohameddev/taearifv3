import axiosInstance from "@/lib/axiosInstance";

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
    set((state) => ({
      propertiesManagement: {
        ...state.propertiesManagement,
        ...newState,
      },
    })),

  fetchProperties: async (page = 1) => {
    // تحديث حالة التحميل
    set((state) => ({
      propertiesManagement: {
        ...state.propertiesManagement,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/properties?page=${page}`
      );

      const propertiesList = response.data.data.properties || [];
      const pagination = response.data.data.pagination || null;
      const propertiesAllData = response.data.data || null;

      const mappedProperties = propertiesList.map((property) => ({
        ...property,
        thumbnail: property.featured_image,
        listingType:
          String(property.transaction_type) === "1" ||
          property.transaction_type === "sale"
            ? "للبيع"
            : "للإيجار",
        status: property.status === 1 ? "منشور" : "مسودة",
        lastUpdated: new Date(property.updated_at).toLocaleDateString("ar-AE"),
      }));

      set((state) => ({
        propertiesManagement: {
          ...state.propertiesManagement,
          properties: mappedProperties,
          pagination: pagination, // إضافة بيانات الـ pagination
          propertiesAllData: propertiesAllData, // إضافة بيانات الـ propertiesAllData
          loading: false,
          isInitialized: true,
        },
      }));
    } catch (error) {
      set((state) => ({
        propertiesManagement: {
          ...state.propertiesManagement,
          error: error.message || "حدث خطأ أثناء جلب بيانات العقارات",
          loading: false,
          isInitialized: true,
        },
      }));
    }
  },
});
