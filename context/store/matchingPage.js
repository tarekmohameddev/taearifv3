import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

export default (set, get) => ({
  matchingPage: {
    // Customers Data
    customers: [],
    customerStats: null,
    recentCustomers: [],

    // Matching Properties Data
    matchingProperties: [],
    selectedCustomerId: null,
    
    // Match Details Data
    matchDetails: null,
    loadingMatchDetails: false,

    // UI State
    loading: false,
    loadingStats: false,
    loadingProperties: false,
    error: null,
    isInitialized: false,

    // Pagination
    pagination: null,

    // Filters and Search
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",

    // Forms State
    isCreatingCustomer: false,
    isUpdatingCustomer: false,
    isDeletingCustomer: false,

    // Delete Confirmation Dialog
    deleteConfirmDialog: {
      isOpen: false,
      customerId: null,
      customerName: "",
    },
  },

  setMatchingPage: (newState) =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        ...newState,
      },
    })),

  // Fetch Customers
  fetchCustomers: async (page = 1, filters = {}) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        loading: true,
        error: null,
      },
    }));

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());

      // Add filters if provided
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value.length > 0) {
          if (Array.isArray(value)) {
            params.set(key, value.join(","));
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.get(
            `/v1/matching/customers`, // ${params.toString()} deleted because it was not working for now 2025-10-24
          );
        },
        3,
        1000,
      );

      const customersList = response.data.data || [];
      const pagination = response.data.pagination || null;

      // Transform API data to match component interface
      const transformedCustomers = customersList.map((customer, index) => ({
        id: customer.id?.toString() || `customer-${index}`,
        name: customer.customer_name || "عميل غير محدد",
        email: customer.email || "",
        phone: customer.phone || "",
        nationalId: customer.national_id || "",
        rating: customer.rating || 4.5,
        totalPurchases: customer.number_of_requests || 0,
        matchingProperties: customer.number_of_matching_properties || 0,
        status: customer.status || "active",
        createdAt: customer.created_at,
        lastActivity: customer.last_activity,
        preferences: customer.preferences || {},
        notes: customer.notes || "",
        assignedAgent: customer.assigned_user
          ? {
              name: customer.assigned_user.name || "غير محدد",
              email: customer.assigned_user.email || "agent@company.com",
              phone: customer.assigned_user.phone || "+966 50 000 0000",
              avatar: customer.assigned_user.avatar || "/placeholder.svg",
            }
          : {
              name: "غير محدد",
              email: "agent@company.com",
              phone: "+966 50 000 0000",
              avatar: "/placeholder.svg",
            },
      }));

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          customers: transformedCustomers,
          pagination: pagination,
          loading: false,
          isInitialized: true,
        },
      }));

      return transformedCustomers;
    } catch (error) {
      const errorInfo = logError(error, "fetchCustomers");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب بيانات العملاء",
          ),
          loading: false,
          isInitialized: true,
        },
      }));

      throw error;
    }
  },

  // Fetch Customer Stats
  fetchCustomerStats: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        loadingStats: true,
        error: null,
      },
    }));

    try {
      // Since we don't have a dedicated stats endpoint, we'll derive stats from the customers
      const customers = await get().fetchCustomers();

      const stats = {
        totalCustomers: customers.length,
        activeCustomers: customers.filter((c) => c.status === "active").length,
        inactiveCustomers: customers.filter((c) => c.status === "inactive").length,
        newCustomers: customers.filter((c) => {
          const createdDate = new Date(c.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate > thirtyDaysAgo;
        }).length,
        averageRating:
          customers.reduce((sum, c) => sum + c.rating, 0) / customers.length || 0,
        totalRequests: customers.reduce((sum, c) => sum + c.totalPurchases, 0),
        totalMatchingProperties: customers.reduce((sum, c) => sum + c.matchingProperties, 0),
        averageMatchingProperties: customers.length > 0 
          ? customers.reduce((sum, c) => sum + c.matchingProperties, 0) / customers.length 
          : 0,
        recentCustomers: customers.slice(0, 5), // Last 5 customers
      };

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          customerStats: stats,
          recentCustomers: stats.recentCustomers,
          loadingStats: false,
        },
      }));

      return stats;
    } catch (error) {
      const errorInfo = logError(error, "fetchCustomerStats");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب إحصائيات العملاء",
          ),
          loadingStats: false,
        },
      }));

      throw error;
    }
  },

  // Create Customer
  createCustomer: async (customerData) => {
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        isCreatingCustomer: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.post(
            "/v1/matching/customers",
            customerData,
          );
        },
        3,
        1000,
      );

      // Refresh the customers list
      await get().fetchCustomers();

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          isCreatingCustomer: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "createCustomer");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(error, "حدث خطأ أثناء إنشاء العميل"),
          isCreatingCustomer: false,
        },
      }));

      throw error;
    }
  },

  // Update Customer
  updateCustomer: async (id, customerData) => {
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        isUpdatingCustomer: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.patch(
            `/v1/matching/customers/${id}`,
            customerData,
          );
        },
        3,
        1000,
      );

      // Refresh the customers list
      await get().fetchCustomers();

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          isUpdatingCustomer: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "updateCustomer");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(error, "حدث خطأ أثناء تحديث العميل"),
          isUpdatingCustomer: false,
        },
      }));

      throw error;
    }
  },

  // Delete Customer
  deleteCustomer: async (id) => {
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        isDeletingCustomer: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.delete(`/v1/matching/customers/${id}`);
        },
        3,
        1000,
      );

      // Remove from local state
      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          customers: state.matchingPage.customers.filter(
            (customer) => customer.id !== id,
          ),
          isDeletingCustomer: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "deleteCustomer");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(error, "حدث خطأ أثناء حذف العميل"),
          isDeletingCustomer: false,
        },
      }));

      throw error;
    }
  },

  // Set Search Term
  setSearchTerm: (searchTerm) =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        searchTerm,
      },
    })),

  // Set Status Filter
  setStatusFilter: (statusFilter) =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        statusFilter,
      },
    })),

  // Set Priority Filter
  setPriorityFilter: (priorityFilter) =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        priorityFilter,
      },
    })),

  // Open Delete Confirmation Dialog
  openDeleteConfirmDialog: (customerId, customerName) =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        deleteConfirmDialog: {
          isOpen: true,
          customerId,
          customerName,
        },
      },
    })),

  // Close Delete Confirmation Dialog
  closeDeleteConfirmDialog: () =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        deleteConfirmDialog: {
          isOpen: false,
          customerId: null,
          customerName: "",
        },
      },
    })),

  // Fetch Matching Properties for Customer
  fetchMatchingProperties: async (customerPhoneNumber) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        loadingProperties: true,
        selectedCustomerId: customerPhoneNumber,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.get(
            `/v1/matching/customers/${customerPhoneNumber}/properties`,
          );
        },
        3,
        1000,
      );

      const propertiesList = response.data.data || [];

      // Transform API data to match component interface
      const transformedProperties = propertiesList.map((property) => ({
        id: property.match_id?.toString() || `property-${Math.random()}`,
        title: property.property_name || "عقار غير محدد",
        address: property.address || "موقع غير محدد",
        city: "الرياض", // Default city
        district: "غير محدد", // Default district
        type: property.for_rent_or_sale === "rent" ? "شقة" : "فيلا",
        price: parseFloat(property.rent_or_buy_amount || "0"),
        listingType: property.for_rent_or_sale === "rent" ? "للإيجار" : "للبيع",
        thumbnail: property.featured_image || "/placeholder.svg",
        bedrooms: property.bedrooms || 0,
        bathrooms: property.baths || 0,
        size: parseFloat(property.area || "0"),
        features: property.matched_criteria || [],
        matchingScore: property.matching_score || 0,
        matchExplanation: property.match_explanation || "",
        matchedCriteria: property.matched_criteria || [],
        unread: property.unread || false,
      }));

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          matchingProperties: transformedProperties,
          loadingProperties: false,
        },
      }));

      return transformedProperties;
    } catch (error) {
      const errorInfo = logError(error, "fetchMatchingProperties");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب العقارات المطابقة",
          ),
          loadingProperties: false,
        },
      }));

      throw error;
    }
  },

  // Fetch Match Details
  fetchMatchDetails: async (matchId) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        loadingMatchDetails: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.get(
            `/v1/matching/matches/${matchId}`,
          );
        },
        3,
        1000,
      );

      const matchData = response.data.data || {};

      // Transform API data to match component interface
      const transformedMatchDetails = {
        match: {
          id: matchData.match?.id,
          matchingScore: matchData.match?.matching_score || 0,
          matchExplanation: matchData.match?.match_explanation || "",
          matchedCriteria: matchData.match?.matched_criteria || [],
        },
        request: {
          id: matchData.request?.id,
          userId: matchData.request?.user_id,
          region: matchData.request?.region,
          propertyType: matchData.request?.property_type,
          categoryId: matchData.request?.category_id,
          cityId: matchData.request?.city_id,
          districtsId: matchData.request?.districts_id,
          areaFrom: matchData.request?.area_from,
          areaTo: matchData.request?.area_to,
          purchaseMethod: matchData.request?.purchase_method,
          budgetFrom: matchData.request?.budget_from,
          budgetTo: matchData.request?.budget_to,
          seriousness: matchData.request?.seriousness,
          purchaseGoal: matchData.request?.purchase_goal,
          wantsSimilarOffers: matchData.request?.wants_similar_offers,
          fullName: matchData.request?.full_name,
          phone: matchData.request?.phone,
          contactOnWhatsapp: matchData.request?.contact_on_whatsapp,
          notes: matchData.request?.notes,
          isRead: matchData.request?.is_read,
          isActive: matchData.request?.is_active,
          createdAt: matchData.request?.created_at,
          updatedAt: matchData.request?.updated_at,
        },
        property: {
          id: matchData.property?.id,
          name: matchData.property?.name,
          featuredImage: matchData.property?.featured_image,
          address: matchData.property?.address,
          forRentOrSale: matchData.property?.for_rent_or_sale,
          rentOrBuyAmount: parseFloat(matchData.property?.rent_or_buy_amount || "0"),
          bedrooms: matchData.property?.bedrooms || 0,
          baths: matchData.property?.baths || 0,
          area: parseFloat(matchData.property?.area || "0"),
        },
      };

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          matchDetails: transformedMatchDetails,
          loadingMatchDetails: false,
        },
      }));

      return transformedMatchDetails;
    } catch (error) {
      const errorInfo = logError(error, "fetchMatchDetails");

      set((state) => ({
        matchingPage: {
          ...state.matchingPage,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب تفاصيل المطابقة",
          ),
          loadingMatchDetails: false,
        },
      }));

      throw error;
    }
  },

  // Clear Error
  clearError: () =>
    set((state) => ({
      matchingPage: {
        ...state.matchingPage,
        error: null,
      },
    })),
});
