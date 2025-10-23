"use client";
import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const useOwnerAuthStore = create((set, get) => ({
  // State
  ownerIsLogged: false,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  errorLogin: null,
  errorRegister: null,
  ownerData: {
    email: null,
    token: null,
    first_name: null,
    last_name: null,
    tenant_id: null,
    owner_id: null,
    permissions: [],
  },

  // Actions
  login: async (email, password) => {
    set({ isLoading: true, errorLogin: null });

    try {
      const response = await axios.post("https://taearif.com/api/v1/owner-rental/login", {
        email,
        password,
      });

      const { success, data } = response.data;
      
      if (success && data && data.token && data.owner_rental) {
        const { owner_rental: user, token } = data;
        
        // Set cookie with JWT token
        const cookieOptions = {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };
        
        document.cookie = `owner_token=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
        document.cookie = `ownerRentalToken=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;

        const safeOwnerData = {
          email: user.email,
          token: token,
          first_name: user.name ? user.name.split(' ')[0] : null,
          last_name: user.name ? user.name.split(' ').slice(1).join(' ') : null,
          tenant_id: user.tenant_id,
          owner_id: user.id,
          permissions: user.permissions || [],
        };

        set({
          ownerIsLogged: true,
          isAuthenticated: true,
          ownerData: safeOwnerData,
          errorLogin: null,
        });

        // Store in localStorage
        try {
          localStorage.setItem("owner_user", JSON.stringify(safeOwnerData));
        } catch (error) {
          console.error("Error storing owner data in localStorage:", error);
        }

        toast.success("تم تسجيل الدخول بنجاح!");
        return { success: true, user: safeOwnerData };
      } else {
        throw new Error("استجابة غير صحيحة من الخادم");
      }
    } catch (error) {
      let errorMessage = "فشل تسجيل الدخول";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.response?.status === 404) {
        errorMessage = "المستخدم غير موجود";
      } else if (error.response?.status >= 500) {
        errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً";
      }

      set({ errorLogin: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, firstName, lastName, phone) => {
    set({ isLoading: true, errorRegister: null });

    try {
      const response = await axios.post("https://taearif.com/api/v1/owner-rental/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      const { success, data } = response.data;
      
      if (success && data && data.token && data.owner_rental) {
        const { owner_rental: user, token } = data;
        
        // Set cookie with JWT token
        const cookieOptions = {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };
        
        document.cookie = `owner_token=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
        document.cookie = `ownerRentalToken=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;

        const safeOwnerData = {
          email: user.email,
          token: token,
          first_name: user.name ? user.name.split(' ')[0] : firstName,
          last_name: user.name ? user.name.split(' ').slice(1).join(' ') : lastName,
          tenant_id: user.tenant_id,
          owner_id: user.id,
          permissions: user.permissions || [],
        };

        set({
          ownerIsLogged: true,
          isAuthenticated: true,
          ownerData: safeOwnerData,
          errorRegister: null,
        });

        // Store in localStorage
        try {
          localStorage.setItem("owner_user", JSON.stringify(safeOwnerData));
        } catch (error) {
          console.error("Error storing owner data in localStorage:", error);
        }

        toast.success("تم التسجيل بنجاح!");
        return { success: true, user: safeOwnerData };
      } else {
        throw new Error("استجابة غير صحيحة من الخادم");
      }
    } catch (error) {
      let errorMessage = "فشل التسجيل";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "البيانات المدخلة غير صحيحة";
      } else if (error.response?.status === 409) {
        errorMessage = "البريد الإلكتروني موجود بالفعل";
      } else if (error.response?.status >= 500) {
        errorMessage = "خطأ في الخادم، يرجى المحاولة لاحقاً";
      }

      set({ errorRegister: errorMessage });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // Clear cookies
      document.cookie = "owner_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "ownerRentalToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear localStorage
      localStorage.removeItem("owner_user");
      
      // Clear store
      set({
        ownerIsLogged: false,
        isAuthenticated: false,
        ownerData: {
          email: null,
          token: null,
          first_name: null,
          last_name: null,
          tenant_id: null,
          owner_id: null,
          permissions: [],
        },
        error: null,
        errorLogin: null,
        errorRegister: null,
      });

      toast.success("تم تسجيل الخروج بنجاح");
      return { success: true };
    } catch (error) {
      console.error("Error during logout:", error);
      return { success: false, error: "فشل تسجيل الخروج" };
    }
  },

  fetchOwnerData: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/owner/getOwnerInfo");
      
      if (!response.ok) {
        throw new Error("فشل في جلب بيانات المالك");
      }

      const ownerData = await response.json();
      
      const safeOwnerData = {
        email: ownerData.email,
        token: ownerData.token,
        first_name: ownerData.first_name,
        last_name: ownerData.last_name,
        tenant_id: ownerData.tenant_id,
        owner_id: ownerData.owner_id,
        permissions: ownerData.permissions || [],
      };

      set({
        ownerIsLogged: true,
        isAuthenticated: true,
        ownerData: safeOwnerData,
        error: null,
      });

      // Update localStorage
      try {
        localStorage.setItem("owner_user", JSON.stringify(safeOwnerData));
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }

      return { success: true, user: safeOwnerData };
    } catch (error) {
      set({
        error: error.message || "فشل في جلب بيانات المالك",
        ownerIsLogged: false,
        isAuthenticated: false,
      });
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  initializeFromStorage: async () => {
    try {
      const storedOwner = localStorage.getItem("owner_user");
      if (storedOwner) {
        const ownerData = JSON.parse(storedOwner);
        
        // Check if token exists in cookie
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('owner_token=') || row.startsWith('ownerRentalToken='))
          ?.split('=')[1];

        if (token) {
          set({
            ownerIsLogged: true,
            isAuthenticated: true,
            ownerData: {
              ...ownerData,
              token: token,
            },
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error initializing owner from storage:", error);
      return false;
    }
  },

  // Setters
  setErrorLogin: (error) => set({ errorLogin: error }),
  setErrorRegister: (error) => set({ errorRegister: error }),
  setError: (error) => set({ error }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setOwnerData: (data) => set({ ownerData: data }),
  setOwnerIsLogged: (isLogged) => set({ ownerIsLogged: isLogged }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
}));

export default useOwnerAuthStore;

// React Context for backward compatibility
import { createContext, useContext, useState, useEffect } from "react";

export const OwnerAuthContext = createContext();

export const OwnerAuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedOwner = localStorage.getItem("owner_user");
    if (storedOwner) {
      const parsedOwner = JSON.parse(storedOwner);
      setOwner(parsedOwner);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("https://taearif.com/api/v1/owner-rental/login", {
        email,
        password,
      });

      const { success, data } = response.data;
      
      if (success && data && data.token && data.owner_rental) {
        const { owner_rental: user, token } = data;
        
        // Set cookie with JWT token
        const cookieOptions = {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };
        
        document.cookie = `owner_token=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
        document.cookie = `ownerRentalToken=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;

        const ownerData = {
          email: user.email,
          token: token,
          first_name: user.name ? user.name.split(' ')[0] : null,
          last_name: user.name ? user.name.split(' ').slice(1).join(' ') : null,
          tenant_id: user.tenant_id,
          owner_id: user.id,
          permissions: user.permissions || [],
        };

        setOwner(ownerData);
        localStorage.setItem("owner_user", JSON.stringify(ownerData));
        toast.success("تم تسجيل الدخول بنجاح!");
        return { success: true, user: ownerData };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل تسجيل الدخول";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, firstName, lastName, phone) => {
    try {
      setLoading(true);
      const response = await axios.post("https://taearif.com/api/v1/owner-rental/register", {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone,
      });

      const { success, data } = response.data;
      
      if (success && data && data.token && data.owner_rental) {
        const { owner_rental: user, token } = data;
        
        // Set cookie with JWT token
        const cookieOptions = {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };
        
        document.cookie = `owner_token=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;
        document.cookie = `ownerRentalToken=${token}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; secure=${cookieOptions.secure}; samesite=${cookieOptions.sameSite}`;

        const ownerData = {
          email: user.email,
          token: token,
          first_name: user.name ? user.name.split(' ')[0] : firstName,
          last_name: user.name ? user.name.split(' ').slice(1).join(' ') : lastName,
          tenant_id: user.tenant_id,
          owner_id: user.id,
          permissions: user.permissions || [],
        };

        setOwner(ownerData);
        localStorage.setItem("owner_user", JSON.stringify(ownerData));
        toast.success("تم التسجيل بنجاح!");
        return { success: true, user: ownerData };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "فشل التسجيل";
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Clear cookies
      document.cookie = "owner_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "ownerRentalToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // Clear localStorage
      localStorage.removeItem("owner_user");
      setOwner(null);
    } catch {
      // Ignore errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerAuthContext.Provider
      value={{
        owner,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </OwnerAuthContext.Provider>
  );
};

export const useOwnerAuth = () => {
  const context = useContext(OwnerAuthContext);
  if (context === undefined) {
    throw new Error("useOwnerAuth must be used within an OwnerAuthProvider");
  }
  return context;
};
