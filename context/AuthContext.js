import { create } from "zustand";
import { serialize as serializeCookie } from "cookie";

const useAuthStore = create((set, get) => ({
  UserIslogged: false,
  IsLoading: true,
  IsDone: false,
  error: null,
  errorLogin: null,
  errorLoginATserver: null,
  onboarding_completed: false,
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
      set({
        UserIslogged: true,
        userData: {
          ...userData,
          onboarding_completed: userData.onboarding_completed || false,
        },
      });
      set({ IsDone: false, error: null });
    } catch (error) {
      set({
        error: error.message || "خطأ في جلب بيانات المستخدم",
        UserIslogged: false,
      });
      set({ IsDone: false, error: null });
    } finally {
      set({ IsLoading: false });
      set({ IsDone: false, error: null });
    }
  },

  // ! --------------login
  login: async (email, password, recaptchaToken) => {
    set({ IsLoading: true, errorLogin: null, errorLoginATserver: null });
    try {
      const externalResponse = await fetch("https://taearif.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, 'recaptcha_token': recaptchaToken, }),
      });
      if (!externalResponse.ok) {
        const errorData = await externalResponse.json().catch(() => ({}));
        let errorMsg = errorData.message || "فشل تسجيل الدخول";
        if (errorMsg == "Invalid credentials") {
          errorMsg = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
        }
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      const { user, token: UserToken } = await externalResponse.json();

      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, UserToken }),
      });

      if (!setAuthResponse.ok) {
        const errorData = await setAuthResponse.json().catch(() => ({}));
        const errorMsg = errorData.error || "فشل في تعيين التوكن";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }

      const data = await setAuthResponse.json();
      if (!data.success) {
        const errorMsg = data.error || "فشل في تعيين التوكن";
        set({ errorLogin: errorMsg });
        return { success: false, error: errorMsg };
      }
      const safeUserData = {
        email: user.email,
        token: UserToken,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        onboarding_completed: user.onboarding_completed || false, // إضافة onboarding_completed
      };
      set({ UserIslogged: true, userData: safeUserData });
      return { success: true };
    } catch (error) {
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

  // ! --------------set Onboarding Completed
  setOnboardingCompleted: (boolean) => set({ onboarding_completed: boolean }),
  setErrorLogin: (error) => set({ errorLogin: error }),
  setUserData: (data) => set({ userData: data }),
  setUserIsLogged: (isLogged) => set({ UserIslogged: isLogged }),
  setIsLoading: (loading) => set({ IsLoading: loading }),
  setHasAttemptedLogin: (attempted) => set({ hasAttemptedLogin: attempted }),
}));

export default useAuthStore;
