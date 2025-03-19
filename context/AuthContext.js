import { create } from "zustand";
import { serialize as serializeCookie } from "cookie";

const useAuthStore = create((set, get) => ({
  UserIslogged: false,
  IsLoading: true,
  IsDone: false,
  error: null,
  errorLogin: null,
  errorLoginATserver: null,
  userData: {
    email: null,
    token: null,
    username: null,
    first_name: null,
    last_name: null,
  },

  // ! --------------fetch User Data
  fetchUserData: async () => {
    set({ IsLoading: true, error: null });
    if (get().IsDone === true) return;
    set({ IsDone: true, error: null });
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo");

      if (!userInfoResponse.ok) {
        throw new Error("فشل في جلب بيانات المستخدم");
      }

      const userData = await userInfoResponse.json();
      set({ UserIslogged: true, userData });
    } catch (error) {
      set({
        error: error.message || "خطأ في جلب بيانات المستخدم",
        UserIslogged: false,
      });
    } finally {
      set({ IsLoading: false });
    }
  },

  // ! --------------login
  login: async (email, password) => {
    set({ IsLoading: true, errorLogin: null, errorLoginATserver: null });
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // إذا كانت الاستجابة غير ناجحة
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || "فشل تسجيل الدخول";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      const data = await response.json();

      // إذا كانت الاستجابة ناجحة لكن العملية لم تتم بنجاح
      if (!data.success) {
        const errorMsg = data.error || "فشل تسجيل الدخول";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      // في حال نجاح تسجيل الدخول
      const { password: _, ...userWithoutPassword } = data.user;
      const safeUserData = {
        ...userWithoutPassword,
        token: data.UserToken, // إضافة UserToken كـ token
      };
      set({ UserIslogged: true, userData: safeUserData });
      return { success: true };
    } catch (error) {
      // في حال حدوث خطأ أثناء الاتصال بالخادم
      const errorMsg = "حدث خطأ أثناء الاتصال بالخادم";
      set({ errorLoginATserver: errorMsg });
      return { success: false, error: errorMsg };
    } finally {
      set({ IsLoading: false });
    }
  },

  // ! --------------logout
  logout: async () => {
    try {
      console.log("userData2 on AuthContext", get().userData);
      // تعديل URL استدعاء API لتسجيل الخروج إلى المسار الصحيح
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: get().userData.token }),
      });

      if (response.ok) {
        set({ UserIslogged: false, userData: null });
        window.location.href = "/login";
      } else {
        console.error("فشل تسجيل الخروج");
      }
    } catch (error) {
      console.error("خطأ أثناء عملية تسجيل الخروج:", error);
    }
  },

  setErrorLogin: (error) => set({ errorLogin: error }),
}));

export default useAuthStore;
