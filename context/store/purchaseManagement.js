import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  getErrorInfo,
  retryWithBackoff,
  logError,
  formatErrorMessage,
} from "@/utils/errorHandler";

module.exports = (set, get) => ({
  purchaseManagement: {
    // Purchase Requests Data
    purchaseRequests: [],
    purchaseRequestStats: null,
    recentRequests: [],

    // Properties Data
    properties: [],

    // Properties Data
    projects: [],

    // UI State
    loading: false,
    loadingProperties: false,
    loadingProjects: false,
    loadingStats: false,
    error: null,
    isInitialized: false,

    // Pagination
    pagination: null,

    // Filters and Search
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",

    // Forms State
    isCreatingRequest: false,
    isUpdatingRequest: false,
    isTransitioningStage: false,
    isDeletingRequest: false,

    // Delete Confirmation Dialog
    deleteConfirmDialog: {
      isOpen: false,
      requestId: null,
      requestNumber: "",
      clientName: "",
    },
  },

  setPurchaseManagement: (newState) =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        ...newState,
      },
    })),

  // Fetch Purchase Requests
  fetchPurchaseRequests: async (page = 1, filters = {}) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
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
            `/v1/pms/purchase-requests?${params.toString()}`,
          );
        },
        3,
        1000,
      );

      const requestsList = response.data.data || [];
      const pagination = response.data.pagination || null;

      // Transform API data to match component interface
      const transformedRequests = requestsList.map((request) => ({
        id: request.id.toString(),
        requestNumber: request.request_number,
        client: {
          name: request.client_name,
          email: request.client_email,
          phone: request.client_phone,
          nationalId: request.client_national_id,
          rating: 4.5, // Default rating
          totalPurchases: 1, // Default value
        },
        property: {
          title: request.property?.title || "عقار غير محدد",
          type: request.property?.type || "غير محدد",
          price: parseFloat(request.property?.price || "0"),
          area: parseFloat(request.property?.area || "0"),
          bedrooms: request.property?.beds || 0,
          bathrooms: request.property?.bath || 0,
          location: request.property?.address || "موقع غير محدد",
          developer: request.project?.developer || "مطور غير محدد",
          images: [request.property?.featured_image_url || "/placeholder.svg"],
        },
        currentStage: mapApiStatusToStage(request.overall_status),
        priority: mapApiPriorityToPriority(request.priority),
        progress: request.progress_percentage || 0,
        createdAt: request.created_at,
        assignedAgent: request.assigned_user
          ? {
              name: request.assigned_user.name || "غير محدد",
              email: request.assigned_user.email || "agent@company.com",
              phone: "+966 50 000 0000",
              avatar: "/placeholder.svg",
            }
          : {
              name: "غير محدد",
              email: "agent@company.com",
              phone: "+966 50 000 0000",
              avatar: "/placeholder.svg",
            },
        stages: {
          reservation: {
            status:
              request.stages[0]?.status === "قيد التنفيذ"
                ? "in-progress"
                : request.stages[0]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: request.stages[0]?.completed_at || undefined,
            documents: request.stages[0]?.documents || [],
            notes: request.stages[0]?.notes || "",
          },
          contract: {
            status:
              request.stages[1]?.status === "قيد التنفيذ"
                ? "in-progress"
                : request.stages[1]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: request.stages[1]?.completed_at || undefined,
            documents: request.stages[1]?.documents || [],
            notes: request.stages[1]?.notes || "",
          },
          completion: {
            status:
              request.stages[2]?.status === "قيد التنفيذ"
                ? "in-progress"
                : request.stages[2]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: request.stages[2]?.completed_at || undefined,
            documents: request.stages[2]?.documents || [],
            notes: request.stages[2]?.notes || "",
          },
          receiving: {
            status:
              request.stages[3]?.status === "قيد التنفيذ"
                ? "in-progress"
                : request.stages[3]?.status === "الانتظار"
                  ? "pending"
                  : "completed",
            completedAt: request.stages[3]?.completed_at || undefined,
            documents: request.stages[3]?.documents || [],
            notes: request.stages[3]?.notes || "",
          },
        },
        notes: request.notes,
      }));

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          purchaseRequests: transformedRequests,
          pagination: pagination,
          loading: false,
          isInitialized: true,
        },
      }));

      return transformedRequests;
    } catch (error) {
      const errorInfo = logError(error, "fetchPurchaseRequests");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب بيانات طلبات الشراء",
          ),
          loading: false,
          isInitialized: true,
        },
      }));

      throw error;
    }
  },

  // Fetch Purchase Request Stats
  fetchPurchaseRequestStats: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        loadingStats: true,
        error: null,
      },
    }));

    try {
      // Since we don't have a dedicated stats endpoint, we'll derive stats from the requests
      const requests = await get().fetchPurchaseRequests();

      const stats = {
        totalRequests: requests.length,
        activeRequests: requests.filter((r) => r.currentStage !== "completed")
          .length,
        completedRequests: requests.filter(
          (r) => r.currentStage === "completed",
        ).length,
        highPriorityRequests: requests.filter((r) => r.priority === "high")
          .length,
        averageProgress:
          requests.reduce((sum, r) => sum + r.progress, 0) / requests.length ||
          0,
        priorityBreakdown: {
          high: requests.filter((r) => r.priority === "high").length,
          medium: requests.filter((r) => r.priority === "medium").length,
          low: requests.filter((r) => r.priority === "low").length,
          urgent: requests.filter((r) => r.priority === "urgent").length,
        },
        recentRequests: requests.slice(0, 5), // Last 5 requests
      };

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          purchaseRequestStats: stats,
          recentRequests: stats.recentRequests,
          loadingStats: false,
        },
      }));

      return stats;
    } catch (error) {
      const errorInfo = logError(error, "fetchPurchaseRequestStats");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(
            error,
            "حدث خطأ أثناء جلب إحصائيات طلبات الشراء",
          ),
          loadingStats: false,
        },
      }));

      throw error;
    }
  },

  // Fetch Properties
  fetchProperties: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      return;
    }

    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        loadingProperties: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.get("/properties");
        },
        3,
        1000,
      );

      const propertiesList = response.data.data.properties || [];

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          properties: propertiesList,
          loadingProperties: false,
        },
      }));

      return propertiesList;
    } catch (error) {
      const errorInfo = logError(error, "fetchProperties");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء جلب بيانات العقارات"),
          loadingProperties: false,
        },
      }));

      throw error;
    }
  },

  // Create Purchase Request
  createPurchaseRequest: async (requestData) => {
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        isCreatingRequest: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.post(
            "/v1/pms/purchase-requests",
            requestData,
          );
        },
        3,
        1000,
      );

      // Refresh the requests list
      await get().fetchPurchaseRequests();

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          isCreatingRequest: false,
        },
      }));

      // Return full axios response so caller can check status (200/201)
      return response;
    } catch (error) {
      const errorInfo = logError(error, "createPurchaseRequest");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء إنشاء طلب الشراء"),
          isCreatingRequest: false,
        },
      }));

      throw error;
    }
  },

  // Update Purchase Request
  updatePurchaseRequest: async (id, requestData) => {
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        isUpdatingRequest: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.patch(
            `/v1/pms/purchase-requests/${id}`,
            requestData,
          );
        },
        3,
        1000,
      );

      // Refresh the requests list
      await get().fetchPurchaseRequests();

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          isUpdatingRequest: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "updatePurchaseRequest");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء تحديث طلب الشراء"),
          isUpdatingRequest: false,
        },
      }));

      throw error;
    }
  },

  // Transition to Next Stage
  transitionToNextStage: async (id, transitionData) => {
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        isTransitioningStage: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.post(
            `/v1/pms/purchase-requests/${id}/simple-transition-stage`,
            transitionData,
          );
        },
        3,
        1000,
      );

      // Refresh the requests list
      await get().fetchPurchaseRequests();

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          isTransitioningStage: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "transitionToNextStage");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء انتقال المرحلة"),
          isTransitioningStage: false,
        },
      }));

      throw error;
    }
  },

  // Delete Purchase Request
  deletePurchaseRequest: async (id) => {
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        isDeletingRequest: true,
        error: null,
      },
    }));

    try {
      const response = await retryWithBackoff(
        async () => {
          return await axiosInstance.delete(`/v1/pms/purchase-requests/${id}`);
        },
        3,
        1000,
      );

      // Remove from local state
      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          purchaseRequests: state.purchaseManagement.purchaseRequests.filter(
            (req) => req.id !== id,
          ),
          isDeletingRequest: false,
        },
      }));

      return response.data;
    } catch (error) {
      const errorInfo = logError(error, "deletePurchaseRequest");

      set((state) => ({
        purchaseManagement: {
          ...state.purchaseManagement,
          error: formatErrorMessage(error, "حدث خطأ أثناء حذف طلب الشراء"),
          isDeletingRequest: false,
        },
      }));

      throw error;
    }
  },

  // Set Search Term
  setSearchTerm: (searchTerm) =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        searchTerm,
      },
    })),

  // Set Status Filter
  setStatusFilter: (statusFilter) =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        statusFilter,
      },
    })),

  // Set Priority Filter
  setPriorityFilter: (priorityFilter) =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        priorityFilter,
      },
    })),

  // Open Delete Confirmation Dialog
  openDeleteConfirmDialog: (requestId, requestNumber, clientName) =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        deleteConfirmDialog: {
          isOpen: true,
          requestId,
          requestNumber,
          clientName,
        },
      },
    })),

  // Close Delete Confirmation Dialog
  closeDeleteConfirmDialog: () =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        deleteConfirmDialog: {
          isOpen: false,
          requestId: null,
          requestNumber: "",
          clientName: "",
        },
      },
    })),

  // Clear Error
  clearError: () =>
    set((state) => ({
      purchaseManagement: {
        ...state.purchaseManagement,
        error: null,
      },
    })),
});

// Helper functions
function mapApiStatusToStage(status) {
  switch (status) {
    case "in_progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "pending":
      return "pending";
    default:
      return "pending";
  }
}

function mapApiPriorityToPriority(priority) {
  switch (priority) {
    case "عالية":
      return "high";
    case "متوسطة":
      return "medium";
    case "منخفضة":
      return "low";
    case "عاجل":
      return "urgent";
    default:
      return "medium";
  }
}
