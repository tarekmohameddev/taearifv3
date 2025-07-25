import axios from "axios";
import https from "https";
import useAuthStore from "@/context/AuthContext";


let axiosLocked = false;
// إنشاء httpsAgent لتجاوز التحقق من الشهادة
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// إنشاء instance مع تعيين عنوان القاعدة (baseURL) وإعدادات HTTPS
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
  httpsAgent: httpsAgent,
});

// استخدام interceptor لإضافة Authorization header قبل كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    if (axiosLocked) {
      return new Promise(() => {}); // promise لا ينتهي
    }
    const token = useAuthStore.getState().userData?.token;

    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("!token", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("error.response", error.response);
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.message === "Unauthenticated."
    ) {
      axiosLocked = true;
      useAuthStore.getState().setAuthenticated(false);
      useAuthStore.getState().setErrorLogin("تم فقدان التوثيق. الرجاء إعادة تسجيل الدخول.");
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
