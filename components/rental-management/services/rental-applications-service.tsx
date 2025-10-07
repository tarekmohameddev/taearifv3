"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusChangeDialog } from "./status-change-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination2";
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  MoreVertical,
  Check,
  ChevronsUpDown,
  CreditCard,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import { RentalDetailsDialog } from "../rental-details-dialog";
import { UpdatedAddRentalForm } from "./updated-rental-form";
import { PaymentCollectionDialog } from "../payment-collection-dialog";
import { RentalWhatsAppDialog } from "../rental-whatsapp-dialog";
import useAuthStore from "@/context/AuthContext";
import { MessageSquare, Activity } from "lucide-react";

interface Property {
  id: number;
  featured_image: string;
  price: string;
  beds: number;
  bath: number;
  area: string;
  latitude: string;
  longitude: string;
}

interface RentalData {
  id: number;
  user_id: number;
  property_number: string;
  unit_label: string;
  tenant_full_name: string;
  tenant_phone: string;
  tenant_email: string;
  tenant_job_title: string;
  tenant_social_status: string;
  tenant_national_id: string;
  base_rent_amount: string;
  currency: string;
  deposit_amount: string;
  move_in_date: string;
  paying_plan: string;
  rental_period_months: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
  property: Property;
  next_payment_due_date?: string;
  next_payment_amount?: string;
}

interface ApiResponse {
  status: boolean;
  data: RentalData[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

interface RentalApplicationsServiceProps {
  openAddDialogCounter?: number;
}

export function RentalApplicationsService({
  openAddDialogCounter = 0,
}: RentalApplicationsServiceProps) {
  const {
    rentalApplications,
    setRentalApplications,
    openRentalDetailsDialog,
    openPaymentCollectionDialog,
    openRentalWhatsAppDialog,
    closeRentalWhatsAppDialog,
    marketingChannels,
    fetchMarketingChannels,
  } = useStore();

  // Status change dialog state
  const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
    useState(false);
  const [selectedRentalForStatusChange, setSelectedRentalForStatusChange] =
    useState<any>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);

  // Function to open status change dialog
  const openStatusChangeDialog = (rental: any) => {
    setSelectedRentalForStatusChange(rental);
    setNewStatus("");
    setIsStatusChangeDialogOpen(true);
  };

  // Function to close status change dialog
  const closeStatusChangeDialog = () => {
    setIsStatusChangeDialogOpen(false);
    setSelectedRentalForStatusChange(null);
    setNewStatus("");
  };

  // Function to get available status options based on current status
  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "draft":
        return [
          { value: "active", label: "نشط" },
          { value: "cancelled", label: "ملغي" },
        ];
      case "active":
        return [
          { value: "ended", label: "منتهي" },
          { value: "cancelled", label: "ملغي" },
        ];
      case "ended":
      case "cancelled":
        return []; // Cannot change from final states
      default:
        return [];
    }
  };

  // Function to handle status change
  const handleStatusChange = async (status: string) => {
    console.log("🔄 handleStatusChange called with status:", status);
    console.log(
      "🔄 selectedRentalForStatusChange:",
      selectedRentalForStatusChange,
    );

    if (!selectedRentalForStatusChange || !status) {
      console.log("❌ Missing rental or status");
      return;
    }

    setStatusChangeLoading(true);
    try {
      const response = await axiosInstance.patch(
        `/v1/rms/rentals/${selectedRentalForStatusChange.id}/status`,
        {
          status: status,
        },
      );

      if (response.data.status) {
        // Update the rental status in the local state
        const updatedRentals = rentals.map((rental: any) =>
          rental.id === selectedRentalForStatusChange.id
            ? { ...rental, status: status }
            : rental,
        );
        setRentalApplications({
          ...rentalApplications,
          rentals: updatedRentals,
        });

        // Close dialog
        closeStatusChangeDialog();

        // Show success message (you can add toast notification here)
        console.log("Status changed successfully");
      } else {
        throw new Error("Failed to change status");
      }
    } catch (error: any) {
      console.error("Error changing status:", error);
      // Handle error (you can add error notification here)
    } finally {
      setStatusChangeLoading(false);
    }
  };

  const {
    rentals,
    pagination,
    loading,
    error,
    searchTerm,
    filterStatus,
    selectedRental,
    isAddRentalDialogOpen,
    isEditRentalDialogOpen,
    editingRental,
    isSubmitting,
    isDeleteDialogOpen,
    deletingRental,
    isDeleting,
    isInitialized,
    lastProcessedOpenAddDialogCounter,
  } = rentalApplications;
  const { userData } = useAuthStore();

  // التحقق من وجود قناة واتساب صالحة
  const hasValidCRMWhatsAppChannel = () => {
    return marketingChannels.channels.some(
      (channel: any) =>
        channel.is_verified === true &&
        channel.is_connected === true &&
        channel.rental_page_integration_enabled === true,
    );
  };

  // Debug: Log selectedRental changes
  useEffect(() => {
    console.log("selectedRental changed:", selectedRental);
  }, [selectedRental]);

  // جلب قنوات التسويق عند تحميل المكون
  useEffect(() => {
    fetchMarketingChannels();
  }, [fetchMarketingChannels]);

  // Dialog states are now managed by Zustand store

  // Dialog functions are now managed by Zustand store

  // Open Add Rental dialog when the counter changes from parent
  useEffect(() => {
    // Simplified logic: if counter > last processed, open dialog
    if (
      openAddDialogCounter > 0 &&
      openAddDialogCounter > lastProcessedOpenAddDialogCounter
    ) {
      setRentalApplications({
        isAddRentalDialogOpen: true,
        lastProcessedOpenAddDialogCounter: openAddDialogCounter,
      });
    } else if (
      lastProcessedOpenAddDialogCounter === -1 &&
      openAddDialogCounter >= 0
    ) {
      setRentalApplications({
        lastProcessedOpenAddDialogCounter: openAddDialogCounter,
      });
    }
  }, [
    openAddDialogCounter,
    lastProcessedOpenAddDialogCounter,
    setRentalApplications,
  ]);

  useEffect(() => {
    if (!isInitialized && userData?.token) {
      fetchRentals();
    }
  }, [isInitialized, userData?.token]);

  // دالة مساعدة للتعامل مع البيانات المفقودة
  const getSafeValue = (value: any, fallback: string = "غير محدد") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return value;
  };

  // دالة للحصول على اسم المستأجر مع معالجة البيانات المفقودة
  const getTenantName = (rental: RentalData) => {
    return getSafeValue(rental.tenant_full_name, "مستأجر غير محدد");
  };

  // دالة للحصول على رمز الوحدة مع معالجة البيانات المفقودة
  const getUnitLabel = (rental: RentalData) => {
    return getSafeValue(rental.unit_label, "غير محدد");
  };

  // دالة للحصول على رقم العقار مع معالجة البيانات المفقودة
  const getPropertyNumber = (rental: RentalData) => {
    return getSafeValue(rental.property_number, "غير محدد");
  };

  // دالة للحصول على المهنة مع معالجة البيانات المفقودة
  const getJobTitle = (rental: RentalData) => {
    return getSafeValue(rental.tenant_job_title, "غير محدد");
  };

  // دالة للحصول على رقم الهاتف مع معالجة البيانات المفقودة
  const getPhoneNumber = (rental: RentalData) => {
    return getSafeValue(rental.tenant_phone, "غير محدد");
  };

  // دالة للحصول على البريد الإلكتروني مع معالجة البيانات المفقودة
  const getEmail = (rental: RentalData) => {
    return getSafeValue(rental.tenant_email, "غير محدد");
  };

  // دالة للحصول على تفاصيل العقار مع معالجة البيانات المفقودة
  const getPropertyDetails = (rental: RentalData) => {
    if (!rental.property) {
      return { beds: "غير محدد", bath: "غير محدد", area: "غير محدد" };
    }
    return {
      beds: getSafeValue(rental.property.beds, "غير محدد"),
      bath: getSafeValue(rental.property.bath, "غير محدد"),
      area: getSafeValue(rental.property.area, "غير محدد"),
    };
  };

  const fetchRentals = async (page: number = 1) => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchRentals");
      setRentalApplications({
        loading: false,
        error: "Authentication required. Please login.",
      });
      return;
    }

    try {
      setRentalApplications({ loading: true, error: null });
      const response = await axiosInstance.get<ApiResponse>(
        `/v1/rms/rentals?page=${page}`,
      );

      if (response.data.status) {
        setRentalApplications({
          rentals: response.data.data,
          pagination: (response.data as any).pagination,
          isInitialized: true,
        });
      } else {
        setRentalApplications({ error: "فشل في جلب البيانات" });
      }
    } catch (err) {
      setRentalApplications({ error: "حدث خطأ أثناء جلب البيانات" });
    } finally {
      setRentalApplications({ loading: false });
    }
  };

  const handlePageChange = (page: number) => {
    fetchRentals(page);
  };

  const filteredRentals = (rentals || []).filter((rental: RentalData) => {
    const matchesSearch =
      getTenantName(rental).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUnitLabel(rental).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getPhoneNumber(rental).includes(searchTerm) ||
      getEmail(rental).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || getSafeValue(rental.status) === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string | null | undefined) => {
    const safeStatus = getSafeValue(status, "unknown");
    switch (safeStatus) {
      case "active":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string | null | undefined) => {
    const safeStatus = getSafeValue(status, "unknown");
    switch (safeStatus) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "expired":
        return <XCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "draft":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string | null | undefined) => {
    const safeStatus = getSafeValue(status, "unknown");
    switch (safeStatus) {
      case "active":
        return "نشط";
      case "pending":
        return "قيد الانتظار";
      case "expired":
        return "منتهي الصلاحية";
      case "cancelled":
        return "ملغي";
      case "draft":
        return "مسودة";
      default:
        return "غير محدد";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "تاريخ غير صحيح";
      return date.toLocaleDateString("ar-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "تاريخ غير صحيح";
    }
  };

  const formatCurrency = (
    amount: string | null | undefined,
    currency: string | null | undefined,
  ) => {
    if (!amount || isNaN(parseFloat(amount))) return "غير محدد";
    try {
      return new Intl.NumberFormat("ar-US", {
        style: "currency",
        currency: currency || "SAR",
      }).format(parseFloat(amount));
    } catch (error) {
      return "مبلغ غير صحيح";
    }
  };

  const handleCreateRental = async (formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true });

      const response = await axiosInstance.post("/v1/rms/rentals", formData);

      if (response.data.status) {
        // إغلاق النافذة المنبثقة أولاً
        setRentalApplications({ isAddRentalDialogOpen: false });

        // إعادة جلب البيانات من API لضمان الحصول على أحدث البيانات
        await fetchRentals(1);

        // يمكن إضافة toast notification هنا
        console.log("تم إضافة الإيجار بنجاح وإعادة تحميل البيانات");
      } else {
        alert(
          "فشل في إضافة الإيجار: " + (response.data.message || "خطأ غير معروف"),
        );
      }
    } catch (err: any) {
      alert(
        "خطأ في إضافة الإيجار: " +
          (err.response?.data?.message || err.message || "خطأ غير معروف"),
      );
      // إغلاق النافذة المنبثقة في حالة الخطأ
      setRentalApplications({ isAddRentalDialogOpen: false });
    } finally {
      setRentalApplications({ isSubmitting: false });
    }
  };

  const handleUpdateRental = async (rentalId: number, formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true });
      const response = await axiosInstance.patch(
        `/v1/rms/rentals/${rentalId}`,
        formData,
      );

      if (response.data.status) {
        // تحديث الإيجار في القائمة بالبيانات الجديدة
        const updated = rentals.map((rental: RentalData) =>
          rental.id === rentalId ? response.data.data : rental,
        );
        setRentalApplications({
          rentals: updated,
          isEditRentalDialogOpen: false,
          editingRental: null,
        });
        // يمكن إضافة toast notification هنا
      }
    } catch (err) {
      // يمكن إضافة toast error هنا
      // إغلاق النافذة المنبثقة في حالة الخطأ
      setRentalApplications({
        isEditRentalDialogOpen: false,
        editingRental: null,
      });
    } finally {
      setRentalApplications({ isSubmitting: false });
    }
  };

  const handleDeleteRental = async (rentalId: number) => {
    try {
      setRentalApplications({ isDeleteDialogOpen: false, isDeleting: true });
      const response = await axiosInstance.delete(
        `/v1/rms/rentals/${rentalId}`,
      );

      if (response.status) {
        const updated = rentals.filter(
          (rental: RentalData) => rental.id !== rentalId,
        );
        setRentalApplications({
          rentals: updated,
          isDeleteDialogOpen: false,
          deletingRental: null,
        });
      }
    } catch (err) {
      setRentalApplications({
        isDeleteDialogOpen: false,
        deletingRental: null,
      });
    } finally {
      setRentalApplications({ isDeleting: false });
    }
  };

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-500">
            يرجى تسجيل الدخول لعرض المحتوى
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchRentals()}>
          <Loader2 className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Dialog
          open={isAddRentalDialogOpen}
          onOpenChange={(open) =>
            setRentalApplications({ isAddRentalDialogOpen: open })
          }
        >
          <DialogTrigger asChild>
            <Button className="bg-gray-700 hover:bg-gray-800">
              <Plus className="ml-2 h-4 w-4" />
              إضافة إيجار جديد
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto text-right"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle className="text-right" dir="rtl">
                إضافة عقد إيجار جديد
              </DialogTitle>
              <DialogDescription className="text-right" dir="rtl">
                أدخل تفاصيل طلب الإيجار الجديد
              </DialogDescription>
            </DialogHeader>
            <UpdatedAddRentalForm
              onSubmit={handleCreateRental}
              onCancel={() =>
                setRentalApplications({ isAddRentalDialogOpen: false })
              }
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الإيجارات..."
            value={searchTerm}
            onChange={(e) =>
              setRentalApplications({ searchTerm: e.target.value })
            }
            className="pr-10"
          />
        </div>
        <Select
          value={filterStatus}
          onValueChange={(v) => setRentalApplications({ filterStatus: v })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="draft">مسودة</SelectItem>
            <SelectItem value="expired">منتهي الصلاحية</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيجارات</p>
              <p className="text-2xl font-bold text-gray-900">{rentals.length}</p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">الإيجارات النشطة</p>
              <p className="text-2xl font-bold text-gray-900">
                {rentals.filter((r: RentalData) => getSafeValue(r.status) === 'active').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
              <p className="text-2xl font-bold text-yellow-600">
                {rentals.filter((r: RentalData) => getSafeValue(r.status) === 'pending').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  rentals.reduce((sum: number, r: RentalData) => {
                    const amount = r.base_rent_amount ? parseFloat(r.base_rent_amount) : 0
                    return sum + (isNaN(amount) ? 0 : amount)
                  }, 0).toString(),
                  'SAR'
                )}
              </p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Modern Rentals Table */}
      <div
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        dir="rtl"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-300">
              <tr>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  المستأجر
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  الوحدة
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  مبلغ الإيجار
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  مدة الإيجار
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  تاريخ الانتقال
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  الحالة
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRentals.map((rental: RentalData, index: number) => (
                <tr
                  key={rental.id}
                  onClick={(e) => {
                    // منع فتح dialog إذا تم الضغط على dropdown menu أو أزرار
                    if (
                      (e.target as any).closest?.("[data-dropdown]") ||
                      (e.target as any).closest?.("button") ||
                      (e.target as any).closest?.('[role="menuitem"]') ||
                      (e.target as any).closest?.(".cursor-pointer")
                    ) {
                      return;
                    }
                    openRentalDetailsDialog(rental.id);
                  }}
                  className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 hover:shadow-sm cursor-pointer ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-25"
                  }`}
                >
                  {/* المستأجر */}
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {getTenantName(rental)
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .slice(0, 2) || "??"}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-gray-900 truncate">
                          {getTenantName(rental)}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {getJobTitle(rental)}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          <Phone className="h-3 w-3 ml-1" />
                          {getPhoneNumber(rental)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* الوحدة */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">
                      {getUnitLabel(rental)}
                    </div>
                    <div className="text-sm text-gray-500">
                      رقم العقار: {getPropertyNumber(rental)}
                    </div>
                    {rental.property && (
                      <div className="text-xs text-gray-400 mt-1">
                        {getPropertyDetails(rental).beds} غرف •{" "}
                        {getPropertyDetails(rental).bath} حمام
                      </div>
                    )}
                  </td>

                  {/* مبلغ الإيجار */}
                  <td className="px-6 py-5">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(rental.base_rent_amount, rental.currency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      الضمان:{" "}
                      {formatCurrency(rental.deposit_amount, rental.currency)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getSafeValue(rental.paying_plan) === "monthly"
                        ? "شهري"
                        : getSafeValue(rental.paying_plan) === "quarterly"
                          ? "ربع سنوي"
                          : getSafeValue(rental.paying_plan) === "semi_annual"
                            ? "نصف سنوي"
                            : getSafeValue(rental.paying_plan) === "annual"
                              ? "سنوي"
                              : getSafeValue(rental.paying_plan)}
                    </div>
                  </td>

                  {/* مدة الإيجار */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">
                      {getSafeValue(rental.rental_period_months, "غير محدد")}{" "}
                      شهر
                    </div>
                    <div className="text-xs text-gray-500">
                      من {formatDate(rental.move_in_date)}
                    </div>
                  </td>

                  {/* تاريخ الانتقال */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(rental.move_in_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rental.created_at).toLocaleDateString("ar-US")}
                    </div>
                  </td>

                  {/* تاريخ الاستحقاق */}
                  <td className="px-6 py-5">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatDate(rental.next_payment_due_date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rental.next_payment_amount
                        ? `${rental.next_payment_amount} ريال سعودي`
                        : "غير محدد"}
                    </div>
                  </td>

                  {/* الحالة */}
                  <td className="px-6 py-5">
                    <div className="flex items-center">
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(rental.status)}`}
                      >
                        {getStatusIcon(rental.status)}
                        <span className="mr-1">
                          {getStatusText(rental.status)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* الإجراءات */}
                  <td className="px-6 py-5 z-[9999]">
                    <div className="flex items-center justify-center z-[9999]">
                      <DropdownMenu data-dropdown>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                            className="h-8 w-8 p-0 border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200 shadow-sm"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openRentalDetailsDialog(rental.id);
                            }}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 ml-2 text-gray-600" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openPaymentCollectionDialog(rental.id);
                            }}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <CreditCard className="h-4 w-4 ml-2 text-gray-600" />
                            تحصيل المدفوعات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openStatusChangeDialog(rental);
                            }}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <CreditCard className="h-4 w-4 ml-2 text-gray-600" />
                            تغيير حالة العقد
                          </DropdownMenuItem>
                          {hasValidCRMWhatsAppChannel() && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log(
                                  "Setting rental for WhatsApp:",
                                  rental,
                                );
                                openRentalWhatsAppDialog(rental);
                              }}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              <Activity className="h-4 w-4 ml-2 text-gray-600" />
                              ارسال رسالة واتساب
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setRentalApplications({
                                editingRental: rental,
                                isEditRentalDialogOpen: true,
                              });
                            }}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4 ml-2 text-gray-600" />
                            تعديل الإيجار
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setRentalApplications({
                                deletingRental: rental,
                                isDeleteDialogOpen: true,
                              });
                            }}
                            className="cursor-pointer hover:bg-gray-100 text-gray-600"
                          >
                            <Trash2 className="h-4 w-4 ml-2 text-gray-600" />
                            حذف الإيجار
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRentals.length === 0 && (
          <div className="text-center py-16">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد إيجارات
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "جرب تعديل معايير البحث"
                : "ابدأ بإضافة إيجار جديد"}
            </p>
            <Button
              onClick={() =>
                setRentalApplications({ isAddRentalDialogOpen: true })
              }
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="ml-2 h-4 w-4" />
              إضافة إيجار جديد
            </Button>
          </div>
        )}
      </div>

      {/* Rental Details Dialog */}
      <Dialog
        open={!!selectedRental}
        onOpenChange={() => setRentalApplications({ selectedRental: null })}
      >
        <DialogContent
          className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto text-right"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-right" dir="rtl">
              تفاصيل طلب الإيجار
            </DialogTitle>
            <DialogDescription className="text-right" dir="rtl">
              {selectedRental?.tenant_full_name} - {selectedRental?.unit_label}
            </DialogDescription>
          </DialogHeader>
          {selectedRental && (
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-3" dir="rtl">
                <TabsTrigger value="tenant">المستأجر</TabsTrigger>
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="contract">العقد</TabsTrigger>
              </TabsList>

              <TabsContent value="tenant" className="space-y-6" dir="rtl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      المعلومات الشخصية
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          الاسم الكامل
                        </Label>
                        <p className="text-sm text-gray-900 font-medium">
                          {selectedRental.tenant_full_name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          رقم الهوية
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.tenant_national_id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          الحالة الاجتماعية
                        </Label>
                        <p className="text-sm text-gray-900 capitalize">
                          {selectedRental.tenant_social_status}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          رقم الهاتف
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.tenant_phone}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          البريد الإلكتروني
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.tenant_email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      المعلومات المهنية
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          المهنة
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.tenant_job_title}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          مبلغ الإيجار
                        </Label>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(
                            selectedRental.base_rent_amount,
                            selectedRental.currency,
                          )}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          مبلغ الضمان
                        </Label>
                        <p className="text-sm text-gray-900 font-medium">
                          {formatCurrency(
                            selectedRental.deposit_amount,
                            selectedRental.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="property" className="space-y-6" dir="rtl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      تفاصيل العقار
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          العمارة
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          عدد الغرف
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.beds} غرف
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          عدد الحمامات
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.bath} حمام
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          المساحة
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.area} متر مربع
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4" dir="rtl">
                    <h4 className="font-semibold text-lg text-gray-900">
                      الموقع
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          خط الطول
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.latitude}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          خط العرض
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.property?.longitude}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contract" className="space-y-6" dir="rtl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      تفاصيل العقد
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          رقم العقد
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          الحالة
                        </Label>
                        <Badge
                          className={getStatusColor(selectedRental.status)}
                        >
                          {getStatusIcon(selectedRental.status)}
                          <span className="mr-1">
                            {getStatusText(selectedRental.status)}
                          </span>
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          مدة الإيجار
                        </Label>
                        <p className="text-sm text-gray-900">
                          {selectedRental.rental_period_months} شهر
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          خطة الدفع
                        </Label>
                        <p className="text-sm text-gray-900 capitalize">
                          {selectedRental.paying_plan}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      التواريخ
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          تاريخ الانتقال
                        </Label>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedRental.move_in_date)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          تاريخ الإنشاء
                        </Label>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedRental.created_at)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          آخر تحديث
                        </Label>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedRental.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRental.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ملاحظات
                    </h4>
                    <p className="text-sm text-gray-800">
                      {selectedRental.notes}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRentalApplications({ selectedRental: null })}
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rental Dialog */}
      <Dialog
        open={isEditRentalDialogOpen}
        onOpenChange={() =>
          setRentalApplications({ isEditRentalDialogOpen: false })
        }
      >
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل طلب الإيجار</DialogTitle>
            <DialogDescription>تعديل تفاصيل طلب الإيجار</DialogDescription>
          </DialogHeader>
          {editingRental && (
            <EditRentalForm
              rental={editingRental}
              onSubmit={(formData) =>
                handleUpdateRental(editingRental.id, formData)
              }
              onCancel={() => {
                setRentalApplications({
                  isEditRentalDialogOpen: false,
                  editingRental: null,
                });
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() =>
          setRentalApplications({ isDeleteDialogOpen: false })
        }
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              تأكيد حذف الإيجار
            </DialogTitle>
            <DialogDescription className="text-red-700">
              ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!
            </DialogDescription>
          </DialogHeader>

          {deletingRental && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  هل أنت متأكد من حذف الإيجار التالي؟
                </p>
                <div className="space-y-2 text-sm text-red-700">
                  <p>
                    <strong>المستأجر:</strong> {deletingRental.tenant_full_name}
                  </p>
                  <p>
                    <strong>الوحدة:</strong> {deletingRental.unit_label}
                  </p>
                  <p>
                    <strong>مبلغ الإيجار:</strong>{" "}
                    {formatCurrency(
                      deletingRental.base_rent_amount,
                      deletingRental.currency,
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>تحذير:</strong> سيتم حذف جميع البيانات المرتبطة بهذا
                  الإيجار نهائياً ولا يمكن استردادها.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRentalApplications({
                  isDeleteDialogOpen: false,
                  deletingRental: null,
                });
              }}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                deletingRental && handleDeleteRental(deletingRental.id)
              }
              disabled={isDeleting}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف نهائي
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rental Details Dialog */}
      <RentalDetailsDialog />

      {/* Payment Collection Dialog */}
      <PaymentCollectionDialog />

      {/* Status Change Dialog */}
      <StatusChangeDialog
        isOpen={isStatusChangeDialogOpen}
        onClose={closeStatusChangeDialog}
        rental={selectedRentalForStatusChange}
        onStatusChange={handleStatusChange}
        isLoading={statusChangeLoading}
      />

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page > 1) {
                      handlePageChange(pagination.current_page - 1);
                    }
                  }}
                  className={
                    pagination.current_page <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1,
              ).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow =
                  page === 1 ||
                  page === pagination.last_page ||
                  (page >= pagination.current_page - 1 &&
                    page <= pagination.current_page + 1);

                if (!shouldShow) {
                  // Show ellipsis for gaps
                  if (page === 2 && pagination.current_page > 3) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  if (
                    page === pagination.last_page - 1 &&
                    pagination.current_page < pagination.last_page - 2
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${page}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                      isActive={page === pagination.current_page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page < pagination.last_page) {
                      handlePageChange(pagination.current_page + 1);
                    }
                  }}
                  className={
                    pagination.current_page >= pagination.last_page
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Pagination Info */}
          <div className="mt-4 text-center text-sm text-gray-500">
            عرض {pagination.from} إلى {pagination.to} من {pagination.total}{" "}
            نتيجة
          </div>
        </div>
      )}

      {/* Rental WhatsApp Dialog */}
      <RentalWhatsAppDialog
        isOpen={rentalApplications.isRentalWhatsAppDialogOpen || false}
        onClose={closeRentalWhatsAppDialog}
        rental={rentalApplications.selectedRentalForWhatsApp}
      />
    </div>
  );
}

// مكون إضافة إيجار جديد
interface AddRentalFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function AddRentalForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AddRentalFormProps) {
  const [formData, setFormData] = useState({
    tenant_full_name: "",
    contract_number: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_job_title: "",
    tenant_social_status: "single",
    tenant_national_id: "",
    office_commission_type: "percentage",
    office_commission_value: "",
    property_number: "",
    property_id: "",
    project_id: "",
    unit_label: "",
    move_in_date: "",
    rental_period: 12,
    paying_plan: "monthly",
    base_rent_amount: "",
    currency: "SAR",
    deposit_amount: "",
    platform_fee: "",
    water_fee: "",
    notes: "",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openProject, setOpenProject] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);

  // جلب البيانات عند فتح النموذج
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, propertiesRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/properties"),
        ]);

        // معالجة بيانات المشاريع - البيانات في data.projects
        if (
          projectsRes.data?.data?.projects &&
          Array.isArray(projectsRes.data.data.projects)
        ) {
          setProjects(projectsRes.data.data.projects);
        } else if (
          projectsRes.data?.projects &&
          Array.isArray(projectsRes.data.projects)
        ) {
          setProjects(projectsRes.data.projects);
        } else {
          setProjects([]);
        }

        // معالجة بيانات العقارات - البيانات في data.properties
        if (
          propertiesRes.data?.data?.properties &&
          Array.isArray(propertiesRes.data.data.properties)
        ) {
          setProperties(propertiesRes.data.data.properties);
        } else if (
          propertiesRes.data?.properties &&
          Array.isArray(propertiesRes.data.properties)
        ) {
          setProperties(propertiesRes.data.properties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        setErrors({ general: "حدث خطأ في جلب البيانات" });
        setProjects([]);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة التحقق من البيانات
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // التحقق من الحقول الإجبارية
    if (!formData.tenant_full_name.trim()) {
      newErrors.tenant_full_name = "الاسم الكامل مطلوب";
    }
    if (!formData.tenant_phone.trim()) {
      newErrors.tenant_phone = "رقم الهاتف مطلوب";
    }
    if (!formData.move_in_date.trim()) {
      newErrors.move_in_date = "تاريخ الانتقال مطلوب";
    }
    if (!formData.rental_period || formData.rental_period <= 0) {
      newErrors.rental_period = "مدة الإيجار مطلوبة ولا تقل عن شهر واحد";
    }
    if (
      !formData.base_rent_amount ||
      parseFloat(formData.base_rent_amount) < 100
    ) {
      newErrors.base_rent_amount = "مبلغ الإيجار مطلوب ولا يقل عن 100 ريال";
    }

    // التحقق من صحة رقم الهاتف
    if (
      formData.tenant_phone &&
      !/^[0-9+\-\s()]+$/.test(formData.tenant_phone)
    ) {
      newErrors.tenant_phone = "رقم الهاتف غير صحيح";
    }

    // التحقق من صحة البريد الإلكتروني (إذا تم إدخاله)
    if (
      formData.tenant_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)
    ) {
      newErrors.tenant_email = "البريد الإلكتروني غير صحيح";
    }

    // التحقق من صحة تاريخ الانتقال
    if (formData.move_in_date) {
      const selectedDate = new Date(formData.move_in_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // إزالة الوقت للمقارنة الصحيحة

      if (selectedDate < today) {
        newErrors.move_in_date = "تاريخ الانتقال لا يمكن أن يكون في الماضي";
      }
    }

    // التحقق من صحة مدة الإيجار
    if (
      formData.rental_period &&
      (isNaN(formData.rental_period) || formData.rental_period <= 0)
    ) {
      newErrors.rental_period = "مدة الإيجار يجب أن تكون رقم صحيح أكبر من 0";
    }

    // التحقق من صحة مبلغ الإيجار
    if (
      formData.base_rent_amount &&
      (isNaN(parseFloat(formData.base_rent_amount)) ||
        parseFloat(formData.base_rent_amount) < 100)
    ) {
      newErrors.base_rent_amount =
        "مبلغ الإيجار يجب أن يكون رقم صحيح لا يقل عن 100 ريال";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تحويل البيانات إلى الأنواع الصحيحة
    const processedFormData: any = {
      ...formData,
      property_id: formData.property_id ? parseInt(formData.property_id) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      rental_period: Number(formData.rental_period) || 12,
      base_rent_amount: formData.base_rent_amount
        ? parseFloat(formData.base_rent_amount)
        : 0,
      deposit_amount: formData.deposit_amount
        ? parseFloat(formData.deposit_amount)
        : 0,
    };

    onSubmit(processedFormData);
  };

  return (
    <div className="bg-white rounded-lg">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              معلومات المستأجر
            </h4>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_full_name"
                className="text-sm font-medium text-gray-700"
              >
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tenant_full_name"
                value={formData.tenant_full_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_full_name: e.target.value,
                  }));
                  if (errors.tenant_full_name) {
                    setErrors((prev) => ({ ...prev, tenant_full_name: "" }));
                  }
                }}
                placeholder="أدخل الاسم الكامل"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_full_name ? "border-red-500" : ""}`}
              />
              {errors.tenant_full_name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_phone"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tenant_phone"
                value={formData.tenant_phone}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_phone: e.target.value,
                  }));
                  if (errors.tenant_phone) {
                    setErrors((prev) => ({ ...prev, tenant_phone: "" }));
                  }
                }}
                placeholder="0551234567"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_phone ? "border-red-500" : ""}`}
              />
              {errors.tenant_phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_email"
                className="text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </Label>
              <Input
                id="tenant_email"
                type="email"
                value={formData.tenant_email}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_email: e.target.value,
                  }));
                  if (errors.tenant_email) {
                    setErrors((prev) => ({ ...prev, tenant_email: "" }));
                  }
                }}
                placeholder="example@email.com"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_email ? "border-red-500" : ""}`}
              />
              {errors.tenant_email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_job_title"
                className="text-sm font-medium text-gray-700"
              >
                المهنة
              </Label>
              <Input
                id="tenant_job_title"
                value={formData.tenant_job_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_job_title: e.target.value,
                  }))
                }
                placeholder="مهندس، طبيب، معلم..."
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_social_status"
                className="text-sm font-medium text-gray-700"
              >
                الحالة الاجتماعية
              </Label>
              <Select
                value={formData.tenant_social_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_social_status: value,
                  }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">أعزب</SelectItem>
                  <SelectItem value="married">متزوج</SelectItem>
                  <SelectItem value="divorced">مطلق</SelectItem>
                  <SelectItem value="widowed">أرمل</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="tenant_national_id"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهوية
              </Label>
              <Input
                id="tenant_national_id"
                value={formData.tenant_national_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_national_id: e.target.value,
                  }))
                }
                placeholder="1234567890"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              تفاصيل العقد
            </h4>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                المشروع
              </Label>
              <Popover open={openProject} onOpenChange={setOpenProject}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProject}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.project_id
                      ? projects.find(
                          (project) =>
                            project.id.toString() === formData.project_id,
                        )?.contents?.[0]?.title ||
                        `مشروع ${formData.project_id}`
                      : "اختر مشروع..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن مشروع..." />
                    <CommandList>
                      <CommandEmpty>لم يتم العثور على مشروع.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(projects) &&
                          projects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={
                                project.contents?.[0]?.title ||
                                `مشروع ${project.id}`
                              }
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  project_id: project.id.toString(),
                                }));
                                setOpenProject(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.project_id === project.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {project.contents?.[0]?.title ||
                                `مشروع ${project.id}`}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                العقار
              </Label>
              <Popover open={openProperty} onOpenChange={setOpenProperty}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProperty}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.property_id
                      ? properties.find(
                          (property) =>
                            property.id.toString() === formData.property_id,
                        )?.title || `عقار ${formData.property_id}`
                      : "اختر عقار..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن عقار..." />
                    <CommandList>
                      <CommandEmpty>لا يوجد عقارات متاحة</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(properties) &&
                          properties.map((property) => (
                            <CommandItem
                              key={property.id}
                              value={property.title || `عقار ${property.id}`}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  property_id: property.id.toString(),
                                }));
                                setOpenProperty(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.property_id ===
                                  property.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {property.title || `عقار ${property.id}`}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="move_in_date"
                className="text-sm font-medium text-gray-700"
              >
                تاريخ الانتقال <span className="text-red-500">*</span>
              </Label>
              <Input
                id="move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    move_in_date: e.target.value,
                  }));
                  if (errors.move_in_date) {
                    setErrors((prev) => ({ ...prev, move_in_date: "" }));
                  }
                }}
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.move_in_date ? "border-red-500" : ""}`}
              />
              {errors.move_in_date && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.move_in_date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="rental_period_months"
                className="text-sm font-medium text-gray-700"
              >
                مدة الإيجار (بالشهور) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rental_period_months"
                type="number"
                value={formData.rental_period}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setFormData((prev) => ({ ...prev, rental_period: value }));

                  // التحقق الفوري من القيمة
                  if (value <= 0) {
                    setErrors((prev) => ({
                      ...prev,
                      rental_period: "مدة الإيجار مطلوبة ولا تقل عن شهر واحد",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, rental_period: "" }));
                  }
                }}
                min="1"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.rental_period ? "border-red-500" : ""}`}
              />
              {errors.rental_period && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.rental_period}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="paying_plan"
                className="text-sm font-medium text-gray-700"
              >
                خطة الدفع
              </Label>
              <Select
                value={formData.paying_plan}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paying_plan: value }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="base_rent_amount"
                className="text-sm font-medium text-gray-700"
              >
                مبلغ الإيجار <span className="text-red-500">*</span>
              </Label>
              <Input
                id="base_rent_amount"
                type="number"
                value={formData.base_rent_amount}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    base_rent_amount: e.target.value,
                  }));
                  if (errors.base_rent_amount) {
                    setErrors((prev) => ({ ...prev, base_rent_amount: "" }));
                  }
                }}
                placeholder="6500"
                min="100"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.base_rent_amount ? "border-red-500" : ""}`}
              />
              {errors.base_rent_amount && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.base_rent_amount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="deposit_amount"
                className="text-sm font-medium text-gray-700"
              >
                مبلغ الضمان
              </Label>
              <Input
                id="deposit_amount"
                type="number"
                value={formData.deposit_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deposit_amount: e.target.value,
                  }))
                }
                placeholder="10000"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
            ملاحظات
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="ملاحظات إضافية حول العقد..."
            rows={3}
            className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  إضافة الإيجار
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}

// مكون تعديل الإيجار
interface EditRentalFormProps {
  rental: RentalData;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function EditRentalForm({
  rental,
  onSubmit,
  onCancel,
  isSubmitting,
}: EditRentalFormProps) {
  const [formData, setFormData] = useState({
    tenant_full_name: rental.tenant_full_name || "",
    tenant_phone: rental.tenant_phone || "",
    tenant_email: rental.tenant_email || "",
    tenant_job_title: rental.tenant_job_title || "",
    tenant_social_status: rental.tenant_social_status || "single",
    tenant_national_id: rental.tenant_national_id || "",
    property_id: rental.property?.id?.toString() || "",
    project_id: "",
    unit_label: rental.unit_label || "",
    move_in_date: rental.move_in_date ? rental.move_in_date.split("T")[0] : "",
    rental_period: rental.rental_period_months || 12,
    paying_plan: rental.paying_plan || "monthly",
    base_rent_amount: rental.base_rent_amount || "",
    currency: rental.currency || "SAR",
    deposit_amount: rental.deposit_amount || "",
    notes: rental.notes || "",
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openProject, setOpenProject] = useState(false);
  const [openProperty, setOpenProperty] = useState(false);

  // جلب البيانات عند فتح النموذج
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, propertiesRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/properties"),
        ]);

        // معالجة بيانات المشاريع - البيانات في data.projects
        if (
          projectsRes.data?.data?.projects &&
          Array.isArray(projectsRes.data.data.projects)
        ) {
          setProjects(projectsRes.data.data.projects);
        } else if (
          projectsRes.data?.projects &&
          Array.isArray(projectsRes.data.projects)
        ) {
          setProjects(projectsRes.data.projects);
        } else {
          setProjects([]);
        }

        // معالجة بيانات العقارات - البيانات في data.properties
        if (
          propertiesRes.data?.data?.properties &&
          Array.isArray(propertiesRes.data.data.properties)
        ) {
          setProperties(propertiesRes.data.data.properties);
        } else if (
          propertiesRes.data?.properties &&
          Array.isArray(propertiesRes.data.properties)
        ) {
          setProperties(propertiesRes.data.properties);
        } else {
          setProperties([]);
        }
      } catch (error) {
        setErrors({ general: "حدث خطأ في جلب البيانات" });
        setProjects([]);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // دالة التحقق من البيانات
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // التحقق من الحقول الإجبارية
    if (!formData.tenant_full_name.trim()) {
      newErrors.tenant_full_name = "الاسم الكامل مطلوب";
    }
    if (!formData.tenant_phone.trim()) {
      newErrors.tenant_phone = "رقم الهاتف مطلوب";
    }
    if (!formData.move_in_date.trim()) {
      newErrors.move_in_date = "تاريخ الانتقال مطلوب";
    }
    if (!formData.rental_period || formData.rental_period <= 0) {
      newErrors.rental_period = "مدة الإيجار مطلوبة ولا تقل عن شهر واحد";
    }
    if (
      !formData.base_rent_amount ||
      parseFloat(formData.base_rent_amount) < 100
    ) {
      newErrors.base_rent_amount = "مبلغ الإيجار مطلوب ولا يقل عن 100 ريال";
    }

    // التحقق من صحة رقم الهاتف
    if (
      formData.tenant_phone &&
      !/^[0-9+\-\s()]+$/.test(formData.tenant_phone)
    ) {
      newErrors.tenant_phone = "رقم الهاتف غير صحيح";
    }

    // التحقق من صحة البريد الإلكتروني (إذا تم إدخاله)
    if (
      formData.tenant_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)
    ) {
      newErrors.tenant_email = "البريد الإلكتروني غير صحيح";
    }

    // التحقق من صحة تاريخ الانتقال
    if (formData.move_in_date) {
      const selectedDate = new Date(formData.move_in_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // إزالة الوقت للمقارنة الصحيحة

      if (selectedDate < today) {
        newErrors.move_in_date = "تاريخ الانتقال لا يمكن أن يكون في الماضي";
      }
    }

    // التحقق من صحة مدة الإيجار
    if (
      formData.rental_period &&
      (isNaN(formData.rental_period) || formData.rental_period <= 0)
    ) {
      newErrors.rental_period = "مدة الإيجار يجب أن تكون رقم صحيح أكبر من 0";
    }

    // التحقق من صحة مبلغ الإيجار
    if (
      formData.base_rent_amount &&
      (isNaN(parseFloat(formData.base_rent_amount)) ||
        parseFloat(formData.base_rent_amount) < 100)
    ) {
      newErrors.base_rent_amount =
        "مبلغ الإيجار يجب أن يكون رقم صحيح لا يقل عن 100 ريال";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // تحويل البيانات إلى الأنواع الصحيحة
    const processedFormData: any = {
      ...formData,
      property_id: formData.property_id ? parseInt(formData.property_id) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      rental_period: Number(formData.rental_period) || 12,
      base_rent_amount: formData.base_rent_amount
        ? parseFloat(formData.base_rent_amount)
        : 0,
      deposit_amount: formData.deposit_amount
        ? parseFloat(formData.deposit_amount)
        : 0,
    };

    onSubmit(processedFormData);
  };

  return (
    <div className="bg-white rounded-lg">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">
              معلومات المستأجر
            </h4>

            <div className="space-y-2">
              <Label
                htmlFor="edit_tenant_full_name"
                className="text-sm font-medium text-gray-700"
              >
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit_tenant_full_name"
                value={formData.tenant_full_name}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_full_name: e.target.value,
                  }));
                  if (errors.tenant_full_name) {
                    setErrors((prev) => ({ ...prev, tenant_full_name: "" }));
                  }
                }}
                placeholder="أدخل الاسم الكامل"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_full_name ? "border-red-500" : ""}`}
              />
              {errors.tenant_full_name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit_tenant_phone"
                className="text-sm font-medium text-gray-700"
              >
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit_tenant_phone"
                value={formData.tenant_phone}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_phone: e.target.value,
                  }));
                  if (errors.tenant_phone) {
                    setErrors((prev) => ({ ...prev, tenant_phone: "" }));
                  }
                }}
                placeholder="0551234567"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_phone ? "border-red-500" : ""}`}
              />
              {errors.tenant_phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="edit_tenant_email"
                className="text-sm font-medium text-gray-700"
              >
                البريد الإلكتروني
              </Label>
              <Input
                id="edit_tenant_email"
                type="email"
                value={formData.tenant_email}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tenant_email: e.target.value,
                  }));
                  if (errors.tenant_email) {
                    setErrors((prev) => ({ ...prev, tenant_email: "" }));
                  }
                }}
                placeholder="example@email.com"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_email ? "border-red-500" : ""}`}
              />
              {errors.tenant_email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_tenant_job_title">المهنة</Label>
              <Input
                id="edit_tenant_job_title"
                value={formData.tenant_job_title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_job_title: e.target.value,
                  }))
                }
                placeholder="مهندس، طبيب، معلم..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_tenant_social_status">
                الحالة الاجتماعية
              </Label>
              <Select
                value={formData.tenant_social_status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_social_status: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">أعزب</SelectItem>
                  <SelectItem value="married">متزوج</SelectItem>
                  <SelectItem value="divorced">مطلق</SelectItem>
                  <SelectItem value="widowed">أرمل</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_tenant_national_id">رقم الهوية</Label>
              <Input
                id="edit_tenant_national_id"
                value={formData.tenant_national_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tenant_national_id: e.target.value,
                  }))
                }
                placeholder="1234567890"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">
              تفاصيل العقد
            </h4>

            {/* اختيار المشروع */}
            <div className="space-y-2">
              <Label htmlFor="edit_project">المشروع</Label>
              <Popover open={openProject} onOpenChange={setOpenProject}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProject}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.project_id
                      ? projects.find(
                          (project) =>
                            project.id.toString() === formData.project_id,
                        )?.contents?.[0]?.title ||
                        `مشروع ${formData.project_id}`
                      : "اختر مشروع..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن مشروع..." />
                    <CommandList>
                      <CommandEmpty>لم يتم العثور على مشروع.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(projects) &&
                          projects.map((project) => (
                            <CommandItem
                              key={project.id}
                              value={
                                project.contents?.[0]?.title ||
                                `مشروع ${project.id}`
                              }
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  project_id: project.id.toString(),
                                }));
                                setOpenProject(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.project_id === project.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {project.contents?.[0]?.title ||
                                `مشروع ${project.id}`}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* اختيار العقار */}
            <div className="space-y-2">
              <Label htmlFor="edit_property">العقار</Label>
              <Popover open={openProperty} onOpenChange={setOpenProperty}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProperty}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.property_id
                      ? properties.find(
                          (property) =>
                            property.id.toString() === formData.property_id,
                        )?.title || `عقار ${formData.property_id}`
                      : "اختر عقار..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن عقار..." />
                    <CommandList>
                      <CommandEmpty>لا يوجد عقارات متاحة</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(properties) &&
                          properties.map((property) => (
                            <CommandItem
                              key={property.id}
                              value={property.title || `عقار ${property.id}`}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  property_id: property.id.toString(),
                                }));
                                setOpenProperty(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  formData.property_id ===
                                  property.id.toString()
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {property.title || `عقار ${property.id}`}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_move_in_date">تاريخ الانتقال *</Label>
              <Input
                id="edit_move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    move_in_date: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_rental_period_months">
                مدة الإيجار (بالشهور) *
              </Label>
              <Input
                id="edit_rental_period_months"
                type="number"
                value={formData.rental_period}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rental_period: parseInt(e.target.value),
                  }))
                }
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_paying_plan">خطة الدفع</Label>
              <Select
                value={formData.paying_plan}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, paying_plan: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_base_rent_amount">مبلغ الإيجار *</Label>
              <Input
                id="edit_base_rent_amount"
                type="number"
                value={formData.base_rent_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    base_rent_amount: e.target.value,
                  }))
                }
                placeholder="6500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_deposit_amount">مبلغ الضمان *</Label>
              <Input
                id="edit_deposit_amount"
                type="number"
                value={formData.deposit_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deposit_amount: e.target.value,
                  }))
                }
                placeholder="10000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit_notes">ملاحظات</Label>
          <Textarea
            id="edit_notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="ملاحظات إضافية حول العقد..."
            rows={3}
          />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
          <div className="flex gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Edit className="ml-2 h-4 w-4" />
                  تحديث الإيجار
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}
