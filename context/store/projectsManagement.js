import axiosInstance from "@/lib/axiosInstance";

module.exports = (set) => ({
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
        `${process.env.NEXT_PUBLIC_Backend_URL}/projects`
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
