import axios from "axios";
import https from "https";
import useAuthStore from "@/context/AuthContext";

// إنشاء httpsAgent لتجاوز التحقق من الشهادة
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// إنشاء instance مع تعيين عنوان القاعدة (baseURL) وإعدادات HTTPS
const axiosInstance = axios.create({
  baseURL: "https://taearif.com/api",
  httpsAgent: httpsAgent,
});

// استخدام interceptor لإضافة Authorization header قبل كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    // الحصول على التوكن من Zustand
    const token = useAuthStore.getState().userData?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("!token", token);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
