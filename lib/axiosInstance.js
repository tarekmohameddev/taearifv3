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
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_Backend_URL,
  httpsAgent: httpsAgent,
});

// استخدام interceptor لإضافة Authorization header قبل كل طلب
axiosInstance.interceptors.request.use(
  (config) => {
    // إذا كان axios مقفل، نرفض الطلب مباشرة
    if (axiosLocked) {
      return Promise.reject(new Error("Authentication required. Please login again."));
    }
    
    const token = useAuthStore.getState().userData?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token available");
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

// معالج الاستجابة
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("Response error:", error.response);
    
    // معالجة أخطاء مختلفة
    if (error.response) {
      const { status, data } = error.response;
      
      // معالجة أخطاء المصادقة
      if (status === 401 || (data && data.message === "Too Many Attempts.")) {
        // قفل axios لمنع أي طلبات جديدة
        axiosLocked = true;
        
        // الحصول على store
        const authStore = useAuthStore.getState();
        
        // تحديث حالة المصادقة
        authStore.setAuthenticated(false);
        authStore.setUserIsLogged(false);
        
        // مسح بيانات المستخدم
        authStore.setUserData({
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
        });

        // مسح جميع ملفات تعريف الارتباط
        if (typeof window !== 'undefined') {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i];
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
              document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          }
        }
        
        // تعيين رسالة الخطأ
        authStore.setErrorLogin("تم فقدان التوثيق. الرجاء إعادة تسجيل الدخول.");
        
        // إعادة توجيه المستخدم لصفحة تسجيل الدخول
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
        }
      }
      
      // معالجة أخطاء الخادم (500)
      else if (status >= 500) {
        console.error("Server Error:", {
          status,
          message: data?.message || "خطأ في الخادم",
          url: error.config?.url,
          method: error.config?.method
        });
        
        // إضافة معلومات إضافية للخطأ
        error.serverError = {
          status,
          message: data?.message || "خطأ في الخادم",
          timestamp: new Date().toISOString(),
          url: error.config?.url
        };
      }
      
      // معالجة أخطاء العميل (400-499)
      else if (status >= 400 && status < 500) {
        console.error("Client Error:", {
          status,
          message: data?.message || "خطأ في الطلب",
          url: error.config?.url
        });
        
        error.clientError = {
          status,
          message: data?.message || "خطأ في الطلب",
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // معالجة أخطاء الشبكة
    else if (error.request) {
      console.error("Network Error:", error.message);
      error.networkError = {
        message: "خطأ في الاتصال بالخادم. تحقق من اتصال الإنترنت",
        timestamp: new Date().toISOString()
      };
    }
    
    // معالجة أخطاء أخرى
    else {
      console.error("Unknown Error:", error.message);
      error.unknownError = {
        message: error.message || "حدث خطأ غير متوقع",
        timestamp: new Date().toISOString()
      };
    }
    
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
