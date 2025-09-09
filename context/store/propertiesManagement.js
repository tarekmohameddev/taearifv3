import axiosInstance from "@/lib/axiosInstance";
import { getErrorInfo, retryWithBackoff, logError, formatErrorMessage } from "@/utils/errorHandler";

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

  fetchProperties: async (page = 1, filters = {}) => {
    // تحديث حالة التحميل
    set((state) => ({
      propertiesManagement: {
        ...state.propertiesManagement,
        loading: true,
        error: null,
      },
    }));

    try {
      // بناء معاملات الفلترة
      const params = new URLSearchParams();
      params.set('page', page.toString());
      
      // إضافة فلاتر إذا كانت موجودة
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.length > 0) {
          if (Array.isArray(value)) {
            params.set(key, value.join(','));
          } else {
            params.set(key, value.toString());
          }
        }
      });

      // استخدام نظام إعادة المحاولة مع معالجة الأخطاء المحسنة
      const response = await retryWithBackoff(async () => {
        return await axiosInstance.get(
          `/properties?${params.toString()}`,
        );
      }, 3, 1000);

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
        // التأكد من أن features مصفوفة
        features: Array.isArray(property.features) ? property.features : [],
      }));

      set((state) => ({
        propertiesManagement: {
          ...state.propertiesManagement,
          properties: mappedProperties,
          pagination: pagination,
          propertiesAllData: propertiesAllData,
          loading: false,
          isInitialized: true,
        },
      }));
    } catch (error) {
      // تسجيل الخطأ مع السياق
      const errorInfo = logError(error, 'fetchProperties');
      
      // تحديث الحالة مع رسالة خطأ مناسبة للمستخدم
      set((state) => ({
        propertiesManagement: {
          ...state.propertiesManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء جلب بيانات العقارات"),
          loading: false,
          isInitialized: true,
        },
      }));
    }
  },
});
