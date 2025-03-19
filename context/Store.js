import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

const useStore = create((set) => ({
  recentActivityData: [],
  isRecentActivityUpdated: false,
  loading: false,

  // قسم خاص بـ homepage
  homepage: {
    visitorData: {
      7: [], // بيانات الزوار لـ 7 أيام
      30: [], // بيانات الزوار لـ 30 يومًا
      90: [], // بيانات الزوار لـ 3 أشهر
      365: [], // بيانات الزوار لـ سنة
    },
    selectedTimeRange: "7", // الفترة الزمنية المختارة حاليًا (افتراضيًا 7 أيام)

    // ! ---------------------------------------------------------------------
    // قسم إدارة العقارات الجديد
    propertiesManagement: {
      viewMode: "grid",
      priceRange: [200000, 1000000],
      favorites: [],
      properties: [],
      loading: false,
      error: null,
      isInitialized: false,
    },

    // دوال إدارة العقارات
    setPropertiesManagement: (newState) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          propertiesManagement: {
            ...state.homepage.propertiesManagement,
            ...newState,
          },
        },
      })),

    fetchProperties: async () => {
      set((state) => ({
        homepage: {
          ...state.homepage,
          propertiesManagement: {
            ...state.homepage.propertiesManagement,
            loading: true,
            error: null,
          },
        },
      }));

      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/properties",
        );

        const mappedProperties = response.data.data.properties.map(
          (property) => ({
            ...property,
            thumbnail: property.featured_image,
            listingType: property.type === "residential" ? "للبيع" : "للإيجار",
            status: property.status === 1 ? "منشور" : "مسودة",
            lastUpdated: new Date(property.updated_at).toLocaleDateString(
              "ar-AE",
            ),
          }),
        );

        set((state) => ({
          homepage: {
            ...state.homepage,
            propertiesManagement: {
              ...state.homepage.propertiesManagement,
              properties: mappedProperties,
              loading: false,
              isInitialized: true,
            },
          },
        }));
      } catch (error) {
        set((state) => ({
          homepage: {
            ...state.homepage,
            propertiesManagement: {
              ...state.homepage.propertiesManagement,
              error: error.message || "حدث خطأ أثناء جلب بيانات العقارات",
              loading: false,
              isInitialized: true,
            },
          },
        }));
      }
    },
    // ! ---------------------------------------------------------------------
    // ! ---------------------------------------------------------------------
  // قسم إدارة المشاريع
  projectsManagement: {
    viewMode: "grid",
    projects: [],
    pagination: null,
    loading: true,
    error: null,
    isInitialized: false,
  },

  // دوال إدارة المشاريع
  setProjectsManagement: (newState) =>
    set((state) => ({
      homepage: {
        ...state.homepage,
        projectsManagement: {
          ...state.homepage.projectsManagement,
          ...newState,
        },
      },
    })),

  fetchProjects: async () => {
    set((state) => ({
      homepage: {
        ...state.homepage,
        projectsManagement: {
          ...state.homepage.projectsManagement,
          loading: true,
          error: null,
        },
      },
    }));
    
    try {
      const response = await axiosInstance.get(
        "https://taearif.com/api/projects"
      );
      
      set((state) => ({
        homepage: {
          ...state.homepage,
          projectsManagement: {
            ...state.homepage.projectsManagement,
            projects: response.data.data.projects,
            pagination: response.data.data.pagination,
            loading: false,
            isInitialized: true,
          },
        },
      }));
    } catch (error) {
      set((state) => ({
        homepage: {
          ...state.homepage,
          projectsManagement: {
            ...state.homepage.projectsManagement,
            error: error.message || "حدث خطأ أثناء جلب بيانات المشاريع",
            loading: false,
            isInitialized: true,
          },
        },
      }));
    }
  },
    // ! ---------------------------------------------------------------------
    // دالة لتحديث بيانات الزوار لفترة زمنية معينة
    setVisitorData: (timeRange, data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          visitorData: {
            ...state.homepage.visitorData,
            [timeRange]: data,
          },
        },
      })),

    // دالة لجلب بيانات الزوار من الـ API لفترة زمنية معينة
    fetchVisitorData: async (timeRange) => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/visitors",
          {
            params: { time_range: timeRange },
          },
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            visitorData: {
              ...state.homepage.visitorData,
              [timeRange]: response.data.visitor_data,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        set({ loading: false });
      }
    },

    // دالة لتحديث الفترة الزمنية المختارة
    setSelectedTimeRange: (range) =>
      set((state) => ({
        homepage: { ...state.homepage, selectedTimeRange: range },
      })),

    // بيانات الأجهزة
    dashboardDevice: [],
    isDashboardDeviceUpdated: false,
    setDashboardDevice: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardDevice: data,
          isDashboardDeviceUpdated: true,
        },
      })),
    fetchDashboardDevice: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/devices",
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            dashboardDevice: response.data.devices,
            isDashboardDeviceUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching dashboard devices:", error);
      } finally {
        set({ loading: false });
      }
    },

    // ملخص اللوحة
    dashboardSummary: null,
    isDashboardSummaryUpdated: false,
    setDashboardSummary: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          dashboardSummary: data,
          isDashboardSummaryUpdated: true,
        },
      })),
    fetchDashboardSummary: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/summary",
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            dashboardSummary: response.data,
            isDashboardSummaryUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      } finally {
        set({ loading: false });
      }
    },

    // مصادر الزيارات
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
          "https://taearif.com/api/dashboard/traffic-sources",
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

    // بيانات تقدم الإعداد (الإضافة الجديدة)
    setupProgressData: null,
    isSetupProgressDataUpdated: false,
    setSetupProgressData: (data) =>
      set((state) => ({
        homepage: {
          ...state.homepage,
          setupProgressData: data,
          isSetupProgressDataUpdated: true,
        },
      })),
    fetchSetupProgressData: async () => {
      set({ loading: true });
      try {
        const response = await axiosInstance.get(
          "https://taearif.com/api/dashboard/setup-progress",
        );
        set((state) => ({
          homepage: {
            ...state.homepage,
            setupProgressData: response.data,
            isSetupProgressDataUpdated: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching setup progress data:", error);
      } finally {
        set({ loading: false });
      }
    },
  },

  // دوال متعلقة بـ recentActivity
  setRecentActivityData: (data) =>
    set({ recentActivityData: data, isRecentActivityUpdated: true }),

  fetchRecentActivityData: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        "https://taearif.com/api/dashboard/recent-activity",
      );
      set({ recentActivityData: response.data, isRecentActivityUpdated: true });
    } catch (error) {
      console.error("Error fetching recent activity data:", error);
    } finally {
      set({ loading: false });
    }
  },






  
  contentManagement: {
    newSectionDialogOpen: false,
    statusFilter: "all", // القيم الممكنة: "all", "active", "inactive"
    searchQuery: "",
    sections: [],
    apiAvailableIcons: [],
    error: null,
    loading: true, // حالة التحميل
    newSectionName: "",
    newSectionDescription: "",
    newSectionStatus: true,
    newSectionIcon: "FileText",
  },

  // دالة لجلب بيانات الأقسام من الـ API
  fetchContentSections: async () => {
    // تفعيل حالة التحميل وتصفير الخطأ قبل الطلب
    set((state) => ({
      contentManagement: {
        ...state.contentManagement,
        loading: true,
        error: null,
      },
    }));
    try {
      const response = await axiosInstance.get("https://taearif.com/api/content/sections");
      // نفترض أن الاستجابة تأتي بالشكل { data: { availableIcons: [...], sections: [...] } }
      set((state) => ({
        contentManagement: {
          ...state.contentManagement,
          sections: response.data.data.sections,
          apiAvailableIcons: response.data.data.availableIcons,
          loading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        contentManagement: {
          ...state.contentManagement,
          error: error.message || "حدث خطأ أثناء جلب البيانات",
          loading: false,
        },
      }));
    }
  },
  setContentManagement: (updates) =>
    set((state) => ({
      contentManagement: {
        ...state.contentManagement,
        ...updates,
      },
    })),
}));

export default useStore;
