import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';

// Store للبيانات الأساسية
const useDailyFollowupStore = create((set, get) => ({
  // البيانات الأساسية
  summaryData: null,
  paymentData: [],
  buildings: [],
  pagination: null,
  filters: null,
  
  // حالات التحميل والأخطاء
  loading: false,
  error: null,
  
  // الفلاتر
  searchTerm: '',
  statusFilter: 'upcoming',
  buildingFilter: 'all',
  dateFilter: 'today',
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  
  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // تحديث الفلاتر
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setBuildingFilter: (buildingFilter) => set({ buildingFilter }),
  setDateFilter: (dateFilter) => set({ dateFilter }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  
  // جلب البيانات من API
  fetchDailyFollowupData: async (params = {}) => {
    const state = get();
    const {
      searchTerm,
      statusFilter,
      buildingFilter,
      dateFilter,
      currentPage,
      itemsPerPage
    } = state;
    
    try {
      set({ loading: true, error: null });
      
      // بناء المعاملات
      const apiParams = {
        status: statusFilter,
        from_date: dateFilter.from,
        to_date: dateFilter.to,
        page: currentPage,
        per_page: itemsPerPage,
        ...params
      };
      
      // إضافة building_id فقط إذا لم يكن "all"
      if (buildingFilter && buildingFilter !== 'all') {
        apiParams.building_id = buildingFilter;
      }
      
      const response = await axiosInstance.get('/v1/rms/daily-follow-up', {
        params: apiParams
      });
      
      if (response.data.status) {
        const data = response.data.data || [];
        const summary = response.data.summary || {};
        const pagination = response.data.pagination || {};
        const filters = response.data.filters || {};
        
        // استخراج المباني من البيانات
        const uniqueBuildings = new Map();
        data.forEach((item) => {
          if (item.building?.building_id) {
            const buildingId = item.building.building_id.toString();
            const buildingName = item.building.building_name;
            
            const displayName = buildingName && buildingName !== "N/A"
              ? buildingName
              : `المبنى ${buildingId}`;
            
            uniqueBuildings.set(buildingId, {
              id: buildingId,
              name: displayName
            });
          }
        });
        
        set({
          paymentData: data,
          summaryData: summary,
          buildings: Array.from(uniqueBuildings.values()),
          pagination: pagination,
          filters: filters,
          loading: false
        });
        
        return { data, summary, pagination, filters };
      } else {
        throw new Error(response.data.message || 'فشل في جلب البيانات');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'حدث خطأ أثناء جلب البيانات';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      throw err;
    }
  },
  
  // إعادة تعيين الفلاتر
  resetFilters: () => set({
    searchTerm: '',
    statusFilter: 'upcoming',
    buildingFilter: 'all',
    dateFilter: 'today',
    currentPage: 1
  }),
  
  // تصفية البيانات محلياً
  getFilteredData: () => {
    const { paymentData, searchTerm, statusFilter } = get();
    
    if (!paymentData || paymentData.length === 0) return [];
    
    return paymentData.filter((item) => {
      if (!item) return false;
      
      // البحث في النص
      const matchesSearch = 
        (item.tenant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.unit_information?.unit_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.mobile_number || '').includes(searchTerm);
      
      // تصفية الحالة
      let matchesStatus = true;
      if (statusFilter === 'overdue') {
        matchesStatus = item.payment_status === 'overdue';
      } else if (statusFilter === 'upcoming') {
        matchesStatus = item.payment_status === 'pending';
      }
      
      return matchesSearch && matchesStatus;
    });
  },
  
  // تنسيق العملة
  formatCurrency: (amount, currency = 'SAR') => {
    try {
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    } catch {
      return 'مبلغ غير صحيح';
    }
  },
  
  // تنسيق التاريخ
  formatDate: (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'تاريخ غير صحيح';
    }
  },
  
  // الحصول على لون الحالة
  getStatusColor: (status) => {
    switch (status) {
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  },
  
  // الحصول على نص الحالة
  getStatusText: (status) => {
    switch (status) {
      case 'overdue':
        return 'متأخر';
      case 'upcoming':
      case 'pending':
        return 'قادم';
      default:
        return 'غير محدد';
    }
  }
}));

export default useDailyFollowupStore;
