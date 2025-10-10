import axios from "axios";
import https from "https";
import useAuthStore from "@/context/AuthContext";

// متغير لتتبع حالة القفل
let axiosLocked = false;

// إنشاء httpsAgent لتجاوز التحقق من الشهادة في بيئة التطوير
const httpsAgent = new https.Agent({
  rejectUnauthorized: process.env.NODE_ENV === "development" ? false : true,
});

// إنشاء instance مع تعيين عنوان القاعدة (baseURL) وإعدادات HTTPS
const baseURL = process.env.NEXT_PUBLIC_Backend_URL;
console.log("🔧 axiosInstance baseURL:", baseURL);
console.log("🔧 NODE_ENV:", process.env.NODE_ENV);

const axiosInstance = axios.create({
  baseURL: baseURL,
  httpsAgent: httpsAgent,
});

// استخدام interceptor لإضافة Authorization header قبل كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "📡 Making request to:",
      config.url,
      "with baseURL:",
      config.baseURL,
    );
    console.log("📡 Full URL:", `${config.baseURL}${config.url}`);

    // إذا كان axios مقفل، نرفض الطلب مباشرة
    if (axiosLocked) {
      console.warn("🔒 axios is locked, rejecting request to:", config.url);
      return Promise.reject(
        new Error("Authentication required. Please login again."),
      );
    }

    const token = useAuthStore.getState().userData?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token added to request");
    } else {
      console.warn("⚠️ No token available for request:", config.url);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// معالج الاستجابة
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("❌ Response error:", error.response);
    console.error("❌ Error config:", error.config);

    // معالجة أخطاء مختلفة
    if (error.response) {
      const { status, data } = error.response;
      console.error("❌ Error response details:", {
        status,
        data,
        url: error.config?.url,
      });

      // معالجة أخطاء المصادقة
      if (status === 401 || (data && data.message === "Too Many Attempts.")) {
        console.warn(
          "Received 401 error, but not locking axios to allow retry after login",
        );
        // لا نقفل axios تلقائياً - نسمح بإعادة المحاولة
        // axiosLocked = true; // تم تعطيل القفل التلقائي
      }

      // معالجة أخطاء الخادم (500)
      else if (status >= 500) {
        console.error("Server Error:", {
          status,
          message: data?.message || "خطأ في الخادم",
          url: error.config?.url,
          method: error.config?.method,
        });

        // إضافة معلومات إضافية للخطأ
        error.serverError = {
          status,
          message: data?.message || "خطأ في الخادم",
          timestamp: new Date().toISOString(),
          url: error.config?.url,
        };
      }

      // معالجة أخطاء العميل (400-499)
      else if (status >= 400 && status < 500) {
        console.error("Client Error:", {
          status,
          message: data?.message || "خطأ في الطلب",
          url: error.config?.url,
        });

        error.clientError = {
          status,
          message: data?.message || "خطأ في الطلب",
          timestamp: new Date().toISOString(),
        };
      }
    }

    // معالجة أخطاء الشبكة
    else if (error.request) {
      console.error("🌐 Network Error:", error.message);
      console.error("🌐 Network Error details:", {
        message: error.message,
        code: error.code,
        config: error.config,
      });
      error.networkError = {
        message: "خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت",
        timestamp: new Date().toISOString(),
      };
    }

    // معالجة أخطاء أخرى
    else {
      console.error("❓ Unknown Error:", error.message);
      console.error("❓ Unknown Error details:", {
        message: error.message,
        stack: error.stack,
        config: error.config,
      });
      error.unknownError = {
        message: error.message || "حدث خطأ غير متوقع",
        timestamp: new Date().toISOString(),
      };
    }

    console.error("🚫 Final error being rejected:", error);
    return Promise.reject(error);
  },
);

// دالة لإعادة تفعيل axios بعد تسجيل الدخول
export const unlockAxios = () => {
  axiosLocked = false;
};

// دالة للتحقق من حالة القفل
export const isAxiosLocked = () => axiosLocked;

// دالة لقفل axios يدوياً
export const lockAxios = () => {
  axiosLocked = true;
};

export default axiosInstance;
