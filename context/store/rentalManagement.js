// wrong data and functions
import axiosInstance from "@/lib/axiosInstance";

module.exports = (set, get) => ({
  projectsManagement: {
    viewMode: "grid",
    projects: [],
    pagination: null,
    loading: true,
    error: null,
    isInitialized: false,
  },

  setProjectsManagement: (newState) =>
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        ...newState,
      },
    })),

  updateProject: (projectId, updatedData) => {
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        projects: state.projectsManagement.projects.map((project) => {
          if (project.id == projectId) {
            return {
              ...project,
              ...updatedData,
              contents: project.contents?.map((content, index) => ({
                ...content,
                title: index === 0 ? updatedData.name : content.title,
                address: index === 0 ? updatedData.location : content.address,
                description:
                  index === 0 ? updatedData.description : content.description,
              })),
            };
          }
          return project;
        }),
      },
    }));
  },

  // Rental Applications slice
  rentalApplications: {
    rentals: [],
    loading: false,
    error: null,
    searchTerm: "",
    filterStatus: "all",
    selectedRental: null,
    isAddRentalDialogOpen: false,
    isEditRentalDialogOpen: false,
    editingRental: null,
    isSubmitting: false,
    isDeleteDialogOpen: false,
    deletingRental: null,
    isDeleting: false,
    isInitialized: false,
    lastProcessedOpenAddDialogCounter: -1,
  },
  setRentalApplications: (newState) =>
    set((state) => ({
      rentalApplications: {
        ...state.rentalApplications,
        ...newState,
      },
    })),

  // Rental Maintenance slice
  rentalMaintenance: {
    requests: [],
    loading: true,
    searchTerm: "",
    filterStatus: "all",
    filterPriority: "all",
    selectedRequest: null,
    isCreateRequestDialogOpen: false,
    rentals: [],
    rentalsLoading: false,
    stats: { total: 0, open: 0, inProgress: 0, completed: 0, urgent: 0 },
    formData: {
      rental_id: 1,
      category: "",
      priority: "",
      title: "",
      description: "",
      estimated_cost: "",
      payer: "",
      payer_share_percent: 100,
      scheduled_date: "",
      assigned_to_vendor_id: null,
      notes: "",
    },
    requestsInitialized: false,
    rentalsInitialized: false,
    lastProcessedOpenCreateDialogCounter: -1,
  },
  setRentalMaintenance: (newState) =>
    set((state) => ({
      rentalMaintenance: {
        ...state.rentalMaintenance,
        ...newState,
      },
    })),

  // Rental Overview slice
  rentalOverview: {
    stats: null,
    recentActivity: [],
    loading: false,
    isInitialized: false,
  },
  setRentalOverview: (newState) =>
    set((state) => ({
      rentalOverview: {
        ...state.rentalOverview,
        ...newState,
      },
    })),

  fetchProjects: async () => {
    set((state) => ({
      projectsManagement: {
        ...state.projectsManagement,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/projects`,
      );

      set((state) => ({
        projectsManagement: {
          ...state.projectsManagement,
          projects: response.data.data.projects,
          pagination: response.data.data.pagination,
          loading: false,
          isInitialized: true,
        },
      }));
    } catch (error) {
      set((state) => ({
        projectsManagement: {
          ...state.projectsManagement,
          error: error.message || "حدث خطأ أثناء جلب بيانات المشاريع",
          loading: false,
          isInitialized: true,
        },
      }));
    }
  },
});
