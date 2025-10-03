import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface TokenValidation {
  isValid: boolean | null;
  message: string;
  loading: boolean;
}

export const useTokenValidation = () => {
  const [tokenValidation, setTokenValidation] = useState<TokenValidation>({
    isValid: null,
    message: "",
    loading: true,
  });
  const [isSameAccount, setIsSameAccount] = useState(false);
  const [newUserData, setNewUserData] = useState<any>(null);
  const [userData, setUserDataState] = useState<any>(null);

  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const setUserData = useAuthStore((state) => state.setUserData);
  const setUserIsLogged = useAuthStore((state) => state.setUserIsLogged);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);

  const fetchUserInfo = async () => {
    try {
      const userInfoResponse = await fetch("/api/user/getUserInfo");
      const userData = await userInfoResponse.json();
      setUserDataState(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  const validateToken = async (token: string) => {
    setTokenValidation({ isValid: null, message: "", loading: true });

    try {
      const response = await axiosInstance.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const userData = response.data;
        const newUser = userData.data || userData;
        setNewUserData(newUser);

        // التحقق من تطابق الحساب
        const currentUser = userData;
        const isSame = currentUser && currentUser.email === newUser.email;
        setIsSameAccount(isSame);

        if (isSame) {
          setTokenValidation({
            isValid: true,
            message: "نفس الحساب المسجل دخول بالفعل",
            loading: false,
          });
        } else {
          setTokenValidation({
            isValid: true,
            message: "الـ token صالح - يمكن تسجيل الدخول",
            loading: false,
          });
        }
      } else {
        throw new Error("Invalid response");
      }
    } catch (error: any) {
      let errorMessage = "الـ token غير صالح";

      if (error.response?.status === 401) {
        errorMessage = "الـ token منتهي الصلاحية أو غير صحيح";

        // حذف authToken cookie عند الحصول على 401
        clearAuthCookie();

        // حذف جميع البيانات من AuthContext مباشرة
        clearAuthContextData();

        // تسجيل الخروج من AuthContext (كإجراء إضافي)
        try {
          await logout({ redirect: false, clearStore: true });
        } catch (logoutError) {
          console.error("❌ Error during AuthContext logout:", logoutError);
        }
      } else if (error.response?.status === 500) {
        errorMessage = "خطأ في الخادم";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setTokenValidation({
        isValid: false,
        message: errorMessage,
        loading: false,
      });
    }
  };

  const clearAuthCookie = () => {
    // حذف authToken cookie المحدد
    document.cookie = "authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = `authToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
  };

  const clearAuthContextData = () => {
    // حذف جميع البيانات من AuthContext مباشرة
    setUserData({
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
      message: null,
      company_name: null,
    });
    setUserIsLogged(false);
    setAuthenticated(false);
    setIsLoading(false);
  };

  const clearAllCookies = () => {
    // حذف authToken cookie أولاً
    clearAuthCookie();

    // حذف جميع الـ cookies الأخرى
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });

    // حذف localStorage
    localStorage.clear();

    // حذف sessionStorage
    sessionStorage.clear();
  };

  const handleInvalidToken = () => {
    clearAllCookies();
    router.push("/login");
  };

  useEffect(() => {
    const initializeTokenValidation = async () => {
      // التحقق من أن المستخدم ليس في صفحة register
      const currentPath = window.location.pathname;
      // فحص register مع أو بدون locale (مثل /register أو /en/register أو /ar/register)
      const isRegisterPage =
        currentPath === "/register" ||
        currentPath.startsWith("/register/") ||
        /^\/[a-z]{2}\/register(\/|$)/.test(currentPath);

      if (isRegisterPage) {
        setTokenValidation({
          isValid: null,
          message: "تخطي التحقق - صفحة التسجيل",
          loading: false,
        });
        return;
      }

      // جلب بيانات المستخدم من API
      const userInfo = await fetchUserInfo();

      if (!userInfo || !userInfo.token) {
        setTokenValidation({
          isValid: false,
          message: "لا يوجد token",
          loading: false,
        });
        handleInvalidToken();
        return;
      }

      // التحقق من صحة الـ token
      validateToken(userInfo.token);
    };

    initializeTokenValidation();
  }, []);

  useEffect(() => {
    // التحقق من أن المستخدم ليس في صفحة register قبل إعادة التوجيه
    const currentPath = window.location.pathname;
    // فحص register مع أو بدون locale (مثل /register أو /en/register أو /ar/register)
    const isRegisterPage =
      currentPath === "/register" ||
      currentPath.startsWith("/register/") ||
      /^\/[a-z]{2}\/register(\/|$)/.test(currentPath);

    if (isRegisterPage) {
      return;
    }

    if (tokenValidation.isValid === false && !tokenValidation.loading) {
      handleInvalidToken();
    }
  }, [tokenValidation.isValid, tokenValidation.loading]);

  return {
    tokenValidation,
    isSameAccount,
    newUserData,
    validateToken,
    clearAuthCookie,
    clearAuthContextData,
    clearAllCookies,
    handleInvalidToken,
  };
};
