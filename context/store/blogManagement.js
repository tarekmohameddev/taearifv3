// context/store/blogManagement.js
import axiosInstance from "@/lib/axiosInstance";

module.exports = (set, get) => ({
  blogsData: {
    posts: [],
    pagination: null,
    isBlogsFetched: false, // حالة boolean للتحقق مما إذا تم جلب البيانات
    loading: false,
    error: null,
  },

  fetchBlogs: async () => {
    const { blogsData } = get();
    if (blogsData.isBlogsFetched) return; // إذا تم جلب البيانات مسبقًا، لا تجلبها مجددًا

    set((state) => ({
      blogsData: {
        ...state.blogsData,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/blogs`
      );
      set((state) => ({
        blogsData: {
          ...state.blogsData,
          posts: response.data.data.posts,
          pagination: response.data.data.pagination,
          isBlogsFetched: true, // تحديث الحالة للإشارة إلى أن البيانات جُلبت
          loading: false,
        },
      }));
    } catch (error) {
      set((state) => ({
        blogsData: {
          ...state.blogsData,
          error: error.message || "حدث خطأ أثناء جلب بيانات المدونة",
          loading: false,
        },
      }));
    }
  },

  setBlogsData: (updates) =>
    set((state) => ({
      blogsData: {
        ...state.blogsData,
        ...updates,
      },
    })),
});
