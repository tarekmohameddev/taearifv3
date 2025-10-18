"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Calendar,
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Users,
  Building2,
  Phone,
  Mail,
  Search,
  Filter,
  XCircle,
  User,
  Loader2,
  AlertCircle,
  Check,
  ChevronsUpDown,
  CreditCard,
  RotateCcw,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import useAuthStore from "@/context/AuthContext";
import useDailyFollowupStore from "@/context/store/dailyFollowup";
import toast from "react-hot-toast";

interface DailyFollowupServiceProps {
  openAddDialogCounter?: number;
}

interface PaymentData {
  rental_id: number;
  contract_number: string;
  tenant_name: string;
  mobile_number: string;
  email: string | null;
  unit_information: {
    unit_id: number;
    unit_name: string;
    unit_address: string;
  };
  building: {
    building_id: number | null;
    building_name: string;
  };
  project: {
    project_id: number | null;
    project_name: string;
  };
  installment_info: {
    installment_id: number;
    sequence_no: number;
    amount: number;
    paid_amount: number;
    remaining_amount: number;
  };
  amount_to_be_paid: number;
  rental_method: string;
  arrears: {
    total_unpaid_amount: number;
    overdue_amount: number;
  };
  due_date: string;
  days_overdue: number;
  contract_info: {
    contract_id: number;
    start_date: string;
    end_date: string;
    status: string;
  };
  contract_expiration_date: string;
  payment_status: string;
}

export function DailyFollowupService() {
  const router = useRouter();
  const { userData } = useAuthStore();
  
  const {
    paymentData,
    buildings,
    loading,
    error,
    searchTerm,
    statusFilter,
    buildingFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
    setSearchTerm,
    setStatusFilter,
    setBuildingFilter,
    setDateFilter,
    setCurrentPage,
    fetchDailyFollowupData,
    getFilteredData,
    formatCurrency,
    formatDate,
    getStatusColor,
    getStatusText
  } = useDailyFollowupStore();

  // جلب البيانات
  const fetchPaymentData = async () => {
    if (userData?.token) {
      await fetchDailyFollowupData();
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [searchTerm, statusFilter, buildingFilter, dateFilter, currentPage]);

  // فلترة البيانات
  const filteredData = getFilteredData();

  // حساب إجمالي الصفحات من API response
  const totalPages = Math.ceil(paymentData.length / itemsPerPage);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchPaymentData}>
            <Loader2 className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">متابعة المستحقات المالية</h2>
          <p className="text-gray-600 mt-1">متابعة المستحقات والمدفوعات المتأخرة</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر البحث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="ابحث عن مستأجر أو عقار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">حالة الدفع</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">قادم</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر التاريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">هذا الأسبوع</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="building">المبنى</Label>
              <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المبنى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المباني</SelectItem>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Payments Table */}
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
                  المبنى
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  المبلغ المستحق
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  تاريخ الاستحقاق
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  الحالة
                </th>
                <th className="px-6 py-5 text-right text-sm font-bold text-white tracking-wide">
                  المتأخرات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      <span className="mr-2 text-gray-500">جاري التحميل...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-center">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        لا توجد مستحقات للعرض
                      </h3>
                      <p className="text-gray-500 mb-4">
                        سيتم عرض المستحقات المالية هنا عند توفر البيانات
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={`${item.rental_id}-${item.installment_info?.installment_id || index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" alt={item.tenant_name || "غير محدد"} />
                          <AvatarFallback>
                            {(item.tenant_name || "غير محدد").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.tenant_name || "غير محدد"}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {item.mobile_number || "غير محدد"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.unit_information?.unit_name || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {item.unit_information?.unit_address || "غير محدد"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.building?.building_name || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.project?.project_name || "غير محدد"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.amount_to_be_paid || 0)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(item.due_date || "")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(item.payment_status)}>
                        {getStatusText(item.payment_status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {(item.arrears?.total_unpaid_amount || 0) > 0 ? (
                          <span className="text-red-600 font-medium">
                            {formatCurrency(item.arrears?.total_unpaid_amount || 0)}
                          </span>
                        ) : (
                          <span className="text-green-600">لا توجد متأخرات</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialogs will be added here */}
    </div>
  );
}