"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

export interface Property {
  id: string;
  slug: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms: number;
  area: string;
  type: string;
  transactionType: string;
  image: string;
  status: string;
  createdAt: string;
  description: string;
  features: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
}

export interface PropertiesResponse {
  properties: Property[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };
}

type FilterType = "all" | "available" | "sold" | "rented";

interface PropertiesStore {
  // State
  allProperties: Property[]; // جميع العقارات المحفوظة
  filteredProperties: Property[]; // العقارات المفلترة
  loading: boolean;
  error: string | null;
  total: number;
  tenantId: string | null; // معرف المستأجر

  // Pagination State
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  };

  // Filter State
  transactionType: "rent" | "sale";
  activeFilter: FilterType;
  search: string;
  propertyType: string;
  price: string;

  // Actions
  setTransactionType: (type: "rent" | "sale") => void;
  setActiveFilter: (filter: FilterType) => void;
  setSearch: (search: string) => void;
  setPropertyType: (type: string) => void;
  setPrice: (price: string) => void;

  // Pagination Actions
  setCurrentPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;

  // API Actions
  setTenantId: (tenantId: string | null) => void; // تعيين معرف المستأجر
  fetchProperties: (page?: number) => Promise<void>; // جلب العقارات مع pagination
  fetchAllProperties: () => Promise<void>; // جلب جميع العقارات مرة واحدة (للتوافق العكسي)
  clearFilters: () => void;

  // Local Filtering
  applyFilters: () => void; // تطبيق الفلاتر محلياً

  // Computed
  getStatusFromFilter: (
    filter: FilterType,
  ) => "all" | "available" | "rented" | "sold";
}

export const usePropertiesStore = create<PropertiesStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      allProperties: [], // جميع العقارات
      filteredProperties: [], // العقارات المفلترة
      loading: false,
      error: null,
      total: 0,
      tenantId: null, // معرف المستأجر

      // Pagination State
      pagination: {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
      },

      // Filter State
      transactionType: "rent",
      activeFilter: "all",
      search: "",
      propertyType: "",
      price: "",

      // Actions
      setTransactionType: (type) => {
        set({ transactionType: type });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      setActiveFilter: (filter) => {
        set({ activeFilter: filter });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      setSearch: (search) => {
        set({ search });
        // Clear existing data before fetching new data
        set({ allProperties: [], filteredProperties: [] });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      setPropertyType: (type) => {
        set({ propertyType: type });
        // Clear existing data before fetching new data
        set({ allProperties: [], filteredProperties: [] });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      setPrice: (price) => {
        set({ price });
        // Clear existing data before fetching new data
        set({ allProperties: [], filteredProperties: [] });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      // Pagination Actions
      setCurrentPage: (page) => {
        get().fetchProperties(page);
      },

      goToNextPage: () => {
        const state = get();
        if (state.pagination.current_page < state.pagination.last_page) {
          get().fetchProperties(state.pagination.current_page + 1);
        }
      },

      goToPreviousPage: () => {
        const state = get();
        if (state.pagination.current_page > 1) {
          get().fetchProperties(state.pagination.current_page - 1);
        }
      },

      // API Actions
      setTenantId: (tenantId) => {
        set({ tenantId });
        // إذا تم تعيين tenantId وكان هناك فلاتر، جلب البيانات
        if (tenantId) {
          get().fetchProperties(1);
        }
      },

      fetchProperties: async (page = 1) => {
        const state = get();

        // منع الـ duplicate calls
        if (state.loading) {
          return;
        }

        set({ loading: true, error: null });

        try {
          // الحصول على tenantId من الـ store
          if (!state.tenantId) {
            set({ loading: false });
            return;
          }

          const tenantId = state.tenantId;

          // بناء URL مع pagination والفلاتر
          const params = new URLSearchParams();
          params.append("page", page.toString());

          if (state.transactionType) {
            params.append("purpose", state.transactionType);
          }
          if (state.activeFilter && state.activeFilter !== "all") {
            params.append("status", state.activeFilter);
          }
          if (state.propertyType) {
            params.append("type", state.propertyType);
          }
          if (state.search) {
            params.append("search", state.search);
          }
          if (state.price) {
            params.append("max_price", state.price);
          }

          const url = `/v1/tenant-website/${tenantId}/properties?${params.toString()}`;


          const response = await axiosInstance.get(url);


          const result: PropertiesResponse = response.data;

          if (result.properties) {
            set({
              allProperties: result.properties, // حفظ العقارات الحالية
              filteredProperties: result.properties, // عرض العقارات الحالية
              loading: false,
              total: result.pagination.total,
              pagination: result.pagination,
            });
          } else {
            // Handle empty results - clear the store
            set({
              allProperties: [],
              filteredProperties: [],
              loading: false,
              total: 0,
              pagination: result.pagination || {
                total: 0,
                per_page: 20,
                current_page: 1,
                last_page: 1,
                from: 0,
                to: 0,
              },
            });
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      fetchAllProperties: async () => {
        const state = get();

        // منع الـ duplicate calls
        if (state.loading) {
          return;
        }

        set({ loading: true, error: null });

        try {
          // الحصول على tenantId من الـ store
          if (!state.tenantId) {
            set({ loading: false });
            return;
          }

          const tenantId = state.tenantId;

          // جلب جميع العقارات من الـ API الجديد
          const url = `/v1/tenant-website/${tenantId}/properties`;


          const response = await axiosInstance.get(url);


          const result: PropertiesResponse = response.data;

          if (result.properties) {
            set({
              allProperties: result.properties, // حفظ جميع العقارات
              loading: false,
              total: result.pagination.total,
            });

            // تطبيق الفلاتر الحالية على البيانات الجديدة
            get().applyFilters();
          } else {
            throw new Error("Failed to fetch properties");
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error occurred";
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      clearFilters: () => {
        set({
          activeFilter: "all",
          search: "",
          propertyType: "",
          price: "",
        });
        get().fetchProperties(1); // إعادة جلب البيانات من الصفحة الأولى
      },

      // Local Filtering
      applyFilters: () => {
        const state = get();

        let filtered = [...state.allProperties];

        // فلترة حسب نوع المعاملة
        if (state.transactionType) {
          filtered = filtered.filter((property) => {
            // تحويل القيم للتطابق مع البيانات الجديدة
            const normalizedTransactionType =
              state.transactionType === "sale" ? "sale" : "rent";
            const propertyTransactionType =
              property.transactionType.toLowerCase();

            return (
              propertyTransactionType === normalizedTransactionType ||
              (normalizedTransactionType === "sale" &&
                propertyTransactionType === "sold") ||
              (normalizedTransactionType === "rent" &&
                (propertyTransactionType === "rent" ||
                  propertyTransactionType === "rented"))
            );
          });
        }

        // فلترة حسب الحالة
        const status = state.getStatusFromFilter(state.activeFilter);
        if (status && status !== "all") {
          filtered = filtered.filter((property) => {
            const propertyStatus = property.status.toLowerCase();
            return propertyStatus === status.toLowerCase();
          });
        }

        // فلترة حسب نوع العقار
        if (state.propertyType) {
          filtered = filtered.filter((property) =>
            property.type
              .toLowerCase()
              .includes(state.propertyType.toLowerCase()),
          );
        }

        // فلترة حسب البحث (العنوان أو المنطقة)
        if (state.search) {
          filtered = filtered.filter(
            (property) =>
              property.title
                .toLowerCase()
                .includes(state.search.toLowerCase()) ||
              property.district
                .toLowerCase()
                .includes(state.search.toLowerCase()),
          );
        }

        // فلترة حسب السعر
        if (state.price) {
          const priceValue = parseFloat(state.price);
          if (!isNaN(priceValue)) {
            filtered = filtered.filter((property) => {
              const propertyPrice = parseFloat(
                property.price.replace(/[^\d.]/g, ""),
              );
              return propertyPrice <= priceValue;
            });
          }
        }


        set({
          filteredProperties: filtered,
          total: filtered.length,
        });
      },

      // Computed
      getStatusFromFilter: (
        filter: FilterType,
      ): "all" | "available" | "rented" | "sold" => {
        switch (filter) {
          case "available":
            return "available";
          case "rented":
            return "rented";
          case "sold":
            return "sold";
          default:
            return "all";
        }
      },
    }),
    {
      name: "properties-store",
    },
  ),
);
