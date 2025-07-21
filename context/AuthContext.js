import { create } from "zustand";
import { serialize as serializeCookie } from "cookie";
import axiosInstance from "@/lib/axiosInstance";

const useAuthStore = create((set, get) => ({
  UserIslogged: false,
  IsLoading: true,
  IsDone: false,
  authenticated: false,
  error: null,
  errorLogin: null,
  errorLoginATserver: null,
  onboarding_completed: false,
  clickedOnSubButton: "domains",
  userData: {
    email: null,
    token: null,
    username: null,
    domain: null,
    first_name: null,
    last_name: null,
    is_free_plan: null,
    days_remaining: null,
    package_title: null,
    package_features: [],
    project_limit_number: null,
    real_estate_limit_number: null,
  },
  googleUrlFetched: false,

  clickedONSubButton: async () => {
    set({ clickedOnSubButton: "subscription" });
  },

  // ! --------------fetch User Data
  fetchUserData: async () => {
    set({ IsLoading: true, error: null });
    if (get().IsDone === true) return;
    set({ IsDone: true, error: null });
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo");

      if (!userInfoResponse.ok) {
        set({ authenticated: false });
        throw new Error("فشل في جلب بيانات المستخدم");
      }

      const userData = await userInfoResponse.json();
      set({
        UserIslogged: true,
        userData: {
          ...userData,
          onboarding_completed: userData.onboarding_completed || false,
        },
       IsLoading: true,
       error: null 
      });
      if (get().userData.is_free_plan == null) {
        const ress = await axiosInstance.get("/user");
        const subscriptionDATA = ress.data.data;
        set({
          authenticated: true,
          userData: {
            ...userData,
            days_remaining: subscriptionDATA.membership.days_remaining || null,
            is_free_plan: subscriptionDATA.membership.is_free_plan || false,
            package_title: subscriptionDATA.membership.package.title || null,
            package_features:
              subscriptionDATA.membership.package.features || [],
            project_limit_number:
              subscriptionDATA.membership.package.project_limit_number || null,
            real_estate_limit_number:
              subscriptionDATA.membership.package.real_estate_limit_number ||
              null,
            domain: subscriptionDATA.domain || null,
          },
        });
      }

      set({ IsDone: false, error: null });
    } catch (error) {
      set({
        error: error.message || "خطأ في جلب بيانات المستخدم",
        authenticated: false,
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
      const externalResponse = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            recaptcha_token: recaptchaToken,
          }),
        }
      );
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
        onboarding_completed: user.onboarding_completed || false, 
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
        set({ UserIslogged: false, authenticated: false, userData: null });
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
  setAuthenticated: (value) => set({ authenticated: value }),
  setUserData: (data) => set({ userData: data }),
  setUserIsLogged: (isLogged) => set({ UserIslogged: isLogged }),
  setIsLoading: (loading) => set({ IsLoading: loading }),
  setHasAttemptedLogin: (attempted) => set({ hasAttemptedLogin: attempted }),
  setGoogleUrlFetched: (value) => set({ googleUrlFetched: value }),
  /**
   * تسجيل الدخول باستخدام التوكن فقط (بدون recaptcha أو باسورد)
   * - يحفظ التوكن في الstore
   * - يجلب بيانات المستخدم من /user
   * - يحفظ البيانات في الstore
   * - ينشئ الكوكي بنفس طريقة تسجيل الدخول العادي
   * @param {string} token - التوكن القادم من URL أو أي مصدر خارجي
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  loginWithToken: async (token) => {
    try {
      console.log("token",token)
      set((state) => ({
        userData: {
          ...state.userData,
          token,
        },
      }));

      console.log("done 1111111111")

      const response = await axiosInstance.get("/user");
      console.log("done 2222222222222222")
      const user = response.data.data?.user || response.data.data || response.data.user || response.data;
      console.log("done 33333333333333333")

      set({
        UserIslogged: true,
        authenticated: true,
        userData: {
          ...user,
          token,
          onboarding_completed: user.onboarding_completed || false,
        },
      });
      console.log("done 444444444444444444")

      const setAuthResponse = await fetch("/api/user/setAuth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, UserToken: token }),
      });
      console.log("done 555555555555555")

      if (!setAuthResponse.ok) {
        const errorData = await setAuthResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "فشل في تعيين التوكن");
      }

      return { success: true };
    } catch (error) {
      set({ errorLoginATserver: "حدث خطأ أثناء الاتصال بالخادم!" });
      return { success: false, error: error.message || "خطأ غير معروف" };
    }
  },
}));

export default useAuthStore;
