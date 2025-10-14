"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PaymentCollectionDialog } from "./payment-collection-dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  MapPin,
  Hash,
  Loader2,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import useStore from "@/context/Store";
import useAuthStore from "@/context/AuthContext";

interface RentalDetails {
  rental: {
    id: number;
    tenant_full_name: string;
    tenant_phone: string;
    tenant_email: string;
    tenant_job_title: string;
    tenant_social_status: string;
    tenant_national_id: string;
    base_rent_amount: number;
    deposit_amount: number;
    currency: string;
    move_in_date: string;
    paying_plan: string;
    rental_period_months: number;
    status: string;
    notes: string;
  };
  property: {
    id: number;
    name: string;
    unit_label: string;
    property_number: string;
    project: {
      id: number;
      name: string | null;
    };
  };
  contract: {
    id: number;
    contract_number: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  payment_details: {
    items: Array<{
      id: number;
      sequence_no: number;
      due_date: string;
      amount: number;
      paid_amount: number;
      status: string;
      payment_type: string;
      payment_status: string;
      reference: string | null;
      paid_at: string | null;
    }>;
  };
}

export function RentalDetailsDialog() {
  const {
    rentalApplications,
    openPaymentCollectionDialog,
    closeRentalDetailsDialog,
  } = useStore();

  const { isRentalDetailsDialogOpen, selectedRentalId } = rentalApplications;

  const { userData } = useAuthStore();

  const [details, setDetails] = useState<RentalDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("tenant");
  
  // States for expenses data
  const [expensesData, setExpensesData] = useState<any>(null);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [expensesError, setExpensesError] = useState<string | null>(null);

  // Fetch rental details when dialog opens
  useEffect(() => {
    if (isRentalDetailsDialogOpen && selectedRentalId && userData?.token) {
      fetchRentalDetails();
      // Reset expenses data when opening new rental
      setExpensesData(null);
      setExpensesError(null);
    }
  }, [isRentalDetailsDialogOpen, selectedRentalId, userData?.token]);

  // Fetch expenses data when expenses tab is active
  useEffect(() => {
    if (activeTab === "expenses" && details?.property?.id) {
      fetchExpensesData();
    }
  }, [activeTab, details?.property?.id]);

  const fetchRentalDetails = async () => {
    if (!selectedRentalId) return;

    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchRentalDetails");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/rentals/${selectedRentalId}/details`,
      );

      if (response.data.status) {
        setDetails(response.data.data);
      } else {
        setError("فشل في تحميل تفاصيل طلب الإيجار");
      }
    } catch (err: any) {
      console.error("Error fetching rental details:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل التفاصيل");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpensesData = async () => {
    if (!details?.property?.id) return;

    setExpensesLoading(true);
    setExpensesError(null);

    try {
      const response = await axiosInstance.get(
        `/v1/rms/payment-report?property_id=${details.property.id}`,
      );

      if (response.data.status) {
        setExpensesData(response.data.data);
      } else {
        setExpensesError("فشل في تحميل بيانات المصروفات");
      }
    } catch (err: any) {
      console.error("Error fetching expenses data:", err);
      
      // Check if the error is about invalid property_id
      if (err.response?.data?.errors?.property_id?.includes("The selected property id is invalid.")) {
        setExpensesError("العقار تم حذفه من النظام");
      } else {
        setExpensesError(err.response?.data?.message || "حدث خطأ أثناء تحميل بيانات المصروفات");
      }
    } finally {
      setExpensesLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat("ar-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 ml-1" />;
      case "pending":
        return <Clock className="h-4 w-4 ml-1" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 ml-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 ml-1" />;
      default:
        return <AlertCircle className="h-4 w-4 ml-1" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "pending":
        return "في الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (payment: any) => {
    // إذا كان المبلغ المدفوع يساوي أو أكبر من المبلغ المطلوب، اعرضه باللون الأخضر
    if (payment.paid_amount >= payment.amount) {
      return "bg-green-100 text-green-800 border-green-200";
    }

    // إذا كان status هو paid أو paid_in_full، اعرضه باللون الأخضر
    if (payment.status === "paid" || payment.status === "paid_in_full") {
      return "bg-green-100 text-green-800 border-green-200";
    }

    // باقي الحالات حسب payment_status
    switch (payment.payment_status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "not_due":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusText = (payment: any) => {
    // إذا كان المبلغ المدفوع يساوي أو أكبر من المبلغ المطلوب، اعرضه كمدفوع
    if (payment.paid_amount >= payment.amount) {
      return "مدفوع";
    }

    // إذا كان status هو paid أو paid_in_full، اعرضه كمدفوع
    if (payment.status === "paid" || payment.status === "paid_in_full") {
      return "مدفوع";
    }

    // باقي الحالات حسب payment_status
    switch (payment.payment_status) {
      case "pending":
        return "في الانتظار";
      case "overdue":
        return "متأخر";
      case "not_due":
        return "غير مستحق";
      default:
        return payment.payment_status;
    }
  };

  const handleOpenPaymentCollection = () => {
    if (selectedRentalId) {
      openPaymentCollectionDialog(selectedRentalId);
    }
  };

  if (!isRentalDetailsDialogOpen) return null;

  return (
    <>
      <Dialog
        open={isRentalDetailsDialogOpen}
        onOpenChange={closeRentalDetailsDialog}
      >
        <DialogContent
          className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6"
          dir="rtl"
        >
          <DialogHeader className="space-y-2 sm:space-y-4 text-right">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                تفاصيل طلب الإيجار
              </DialogTitle>
              <div className="flex items-center gap-2">
                {details && details.rental && (
                  <Badge
                    className={`${getStatusColor(details.rental.status)} border`}
                  >
                    {getStatusIcon(details.rental.status)}
                    <span className="mr-1">
                      {getStatusText(details.rental.status)}
                    </span>
                  </Badge>
                )}
                <button
                  onClick={fetchRentalDetails}
                  disabled={loading}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>
          </DialogHeader>

          {loading && (
            <div className="flex items-center justify-center py-8 sm:py-12 text-right">
              <span className="ml-2 text-sm sm:text-base text-gray-500">
                جاري تحميل التفاصيل...
              </span>
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8 sm:py-12 text-right">
              <span className="text-sm sm:text-base text-red-500">{error}</span>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
            </div>
          )}

          {details && details.rental && details.property && !loading && (
            <div className="space-y-4 sm:space-y-6 text-right">
              {/* Custom Tabs Navigation */}
              <div className="w-full" dir="rtl">
                <div
                  className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg"
                  dir="rtl"
                >
                  <button
                    onClick={() => setActiveTab("tenant")}
                    className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                      activeTab === "tenant" ? "bg-white " : ""
                    }`}
                    dir="rtl"
                  >
                    <span className="hidden lg:inline">بيانات المستأجر</span>
                    <span className="lg:hidden">المستأجر</span>
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("property")}
                    className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                      activeTab === "property" ? "bg-white " : ""
                    }`}
                    dir="rtl"
                  >
                    <span className="hidden lg:inline">بيانات العقار</span>
                    <span className="lg:hidden">العقار</span>
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("contract")}
                    className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                      activeTab === "contract" ? "bg-white " : ""
                    }`}
                    dir="rtl"
                  >
                    <span className="hidden lg:inline">العقد</span>
                    <span className="lg:hidden">العقد</span>
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("payments")}
                    className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                      activeTab === "payments" ? "bg-white " : ""
                    }`}
                    dir="rtl"
                  >
                    <span className="hidden lg:inline">المدفوعات</span>
                    <span className="lg:hidden">المدفوعات</span>
                    <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`flex items-center justify-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                      activeTab === "expenses" ? "bg-white " : ""
                    }`}
                    dir="rtl"
                  >
                    <span className="hidden lg:inline">المصروفات</span>
                    <span className="lg:hidden">المصروفات</span>
                    <ClipboardList className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "tenant" && (
                <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle
                        className="flex items-center gap-2 text-right text-base sm:text-lg"
                        dir="rtl"
                      >
                        معلومات المستأجر
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                      dir="rtl"
                    >
                      <div
                        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                        dir="rtl"
                      >
                        <div className="space-y-1 text-right" dir="rtl">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                            {details.rental.tenant_full_name || "غير محدد"}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 text-right">
                            {details.rental.tenant_job_title || "غير محدد"}
                          </p>
                          <Badge
                            variant="outline"
                            className="w-fit text-xs sm:text-sm"
                          >
                            {details.rental.tenant_social_status === "married"
                              ? "متزوج"
                              : "أعزب"}
                          </Badge>
                        </div>
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-600 text-white text-lg sm:text-xl font-bold">
                            {details.rental.tenant_full_name
                              ? details.rental.tenant_full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                              : "??"}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <Separator />

                      <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
                        dir="rtl"
                      >
                        <div className="space-y-2 sm:space-y-3">
                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            dir="rtl"
                          >
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">
                                رقم الهاتف
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-right">
                                {details.rental.tenant_phone || "غير محدد"}
                              </p>
                            </div>
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            dir="rtl"
                          >
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">
                                البريد الإلكتروني
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-right break-all">
                                {details.rental.tenant_email || "غير محدد"}
                              </p>
                            </div>
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            dir="rtl"
                          >
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">
                                رقم الهوية
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-right">
                                {details.rental.tenant_national_id ||
                                  "غير محدد"}
                              </p>
                            </div>
                            <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      {details.rental.notes && (
                        <>
                          <Separator />
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-2 text-right">
                              ملاحظات
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg text-right">
                              {details.rental.notes}
                            </p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "property" && (
                <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle
                        className="flex items-center gap-2 text-right text-base sm:text-lg"
                        dir="rtl"
                      >
                        معلومات العقار
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                      dir="rtl"
                    >
                      <div
                        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                        dir="rtl"
                      >
                        <div className="space-y-1 text-right" dir="rtl">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                            {details.property.name || "غير محدد"}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 text-right">
                            الوحدة: {details.property.unit_label || "غير محدد"}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 text-right">
                            رقم العقار:{" "}
                            {details.property.property_number || "غير محدد"}
                          </p>
                        </div>
                        <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                          <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                      </div>

                      <Separator />

                      <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4"
                        dir="rtl"
                      >
                        <div className="space-y-2 sm:space-y-3">
                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            dir="rtl"
                          >
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">
                                رقم العقار
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-right">
                                {details.property.property_number || "غير محدد"}
                              </p>
                            </div>
                            <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                          <div
                            className="flex items-center gap-2 sm:gap-3"
                            dir="rtl"
                          >
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">
                                الوحدة
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-right">
                                {details.property.unit_label || "غير محدد"}
                              </p>
                            </div>
                            <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {details.property.project?.name && (
                            <div
                              className="flex items-center gap-2 sm:gap-3"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  المشروع
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-right">
                                  {details.property.project.name}
                                </p>
                              </div>
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "contract" && (
                <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle
                        className="flex items-center gap-2 text-right text-base sm:text-lg"
                        dir="rtl"
                      >
                        تفاصيل العقد
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent
                      className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6"
                      dir="rtl"
                    >
                      <div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
                        dir="rtl"
                      >
                        <Badge
                          className={`${getStatusColor(details.contract?.status || "unknown")} border text-xs sm:text-sm`}
                        >
                          {getStatusIcon(details.contract?.status || "unknown")}
                          <span className="mr-1">
                            {getStatusText(
                              details.contract?.status || "unknown",
                            )}
                          </span>
                        </Badge>
                        <div className="text-right" dir="rtl">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                            {details.contract?.contract_number || "غير محدد"}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 text-right">
                            رقم العقد
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                        dir="rtl"
                      >
                        <div className="space-y-3 sm:space-y-4">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              مبلغ الإيجار الأساسي
                            </p>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                              {formatCurrency(
                                details.rental.base_rent_amount || 0,
                                details.rental.currency || "SAR",
                              )}
                            </p>
                          </div>
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              مبلغ الضمان
                            </p>
                            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                              {formatCurrency(
                                details.rental.deposit_amount || 0,
                                details.rental.currency || "SAR",
                              )}
                            </p>
                          </div>
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              خطة الدفع
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                              {details.rental.paying_plan === "monthly"
                                ? "شهري"
                                : details.rental.paying_plan === "quarterly"
                                  ? "ربع سنوي"
                                  : details.rental.paying_plan === "semi_annual"
                                    ? "نصف سنوي"
                                    : details.rental.paying_plan === "annual"
                                      ? "سنوي"
                                      : details.rental.paying_plan ||
                                        "غير محدد"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              مدة الإيجار
                            </p>
                            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                              {details.rental.rental_period_months || 0} شهر
                            </p>
                          </div>
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              تاريخ بداية العقد
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                              {details.contract?.start_date
                                ? formatDate(details.contract.start_date)
                                : "غير محدد"}
                            </p>
                          </div>
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">
                              تاريخ انتهاء العقد
                            </p>
                            <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                              {details.contract?.end_date
                                ? formatDate(details.contract.end_date)
                                : "غير محدد"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                  {/* Payment Collection Button */}
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={handleOpenPaymentCollection}
                      className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-800 hover:border-gray-900"
                      dir="rtl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold">دفع المستحقات</span>
                        <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </Button>
                  </div>

                  <Card>
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle
                        className="flex items-center gap-2 text-right text-base sm:text-lg"
                        dir="rtl"
                      >
                        جدول المدفوعات
                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                      <div className="space-y-3" dir="rtl">
                        {details.payment_details.items.map((payment, index) => (
                          <div
                            key={payment.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-4"
                            dir="rtl"
                          >
                            <div
                              className="flex items-center gap-3 sm:gap-4"
                              dir="rtl"
                            >
                              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                                {payment.sequence_no}
                              </div>
                              <div className="text-right" dir="rtl">
                                <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                  الدفعة رقم {payment.sequence_no}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 text-right">
                                  مستحق في: {formatDate(payment.due_date)}
                                </p>
                              </div>
                            </div>
                            <div
                              className="flex items-center gap-3 sm:gap-4"
                              dir="rtl"
                            >
                              <div className="text-right" dir="rtl">
                                <p className="text-sm sm:text-base font-bold text-gray-900 text-right">
                                  {formatCurrency(
                                    payment.amount,
                                    details.rental.currency || "SAR",
                                  )}
                                </p>
                                {payment.paid_amount > 0 && (
                                  <p className="text-xs sm:text-sm text-green-600 text-right">
                                    مدفوع:{" "}
                                    {formatCurrency(
                                      payment.paid_amount,
                                      details.rental.currency || "SAR",
                                    )}
                                  </p>
                                )}
                              </div>
                              <Badge
                                className={`${getPaymentStatusColor(payment)} border text-xs sm:text-sm`}
                              >
                                {getPaymentStatusText(payment)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === "expenses" && (
                <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                  <Card>
                    <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                      {expensesLoading && (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-600">جاري تحميل بيانات المدفوعات...</p>
                          </div>
                        </div>
                      )}

                      {expensesError && (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-red-600">{expensesError}</p>
                          </div>
                        </div>
                      )}

                      {expensesData && !expensesLoading && (
                        <div className="space-y-6">
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <p className="text-sm text-gray-600 mb-1">إجمالي المتوقع</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(expensesData.summary?.total_expected || 0)}
                              </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <p className="text-sm text-gray-600 mb-1">إجمالي المحصل</p>
                              <p className="text-xl font-bold text-green-700">
                                {formatCurrency(expensesData.summary?.total_collected || 0)}
                              </p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                              <p className="text-sm text-gray-600 mb-1">إجمالي المتبقي</p>
                              <p className="text-xl font-bold text-red-700">
                                {formatCurrency(expensesData.summary?.total_outstanding || 0)}
                              </p>
                            </div>
                          </div>

                          {/* Payment History Only */}
                          {expensesData.properties?.map((property: any, propertyIndex: number) => (
                            <div key={propertyIndex} className="space-y-4">
                              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                                {/* Payment History */}
                                {property.rentals?.map((rental: any, rentalIndex: number) => (
                                  rental.payment_history?.length > 0 && (
                                    <div key={`history-${rentalIndex}`} className="border-t border-gray-200">
                                      <div className="px-4 py-3 bg-gray-50">
                                        <h4 className="font-medium text-gray-900">
                                          سجل المدفوعات - {rental.tenant_name}
                                        </h4>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead className="bg-gray-100">
                                            <tr>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                نوع الدفع
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                المبلغ
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                تاريخ الدفع
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 border-b border-gray-200">
                                                المرجع
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rental.payment_history.map((payment: any, paymentIndex: number) => (
                                              <tr key={paymentIndex} className="border-b border-gray-100">
                                                <td className="px-4 py-2 text-xs text-gray-900">
                                                  {payment.payment_type === "rent" ? "إيجار" : payment.payment_type}
                                                </td>
                                                <td className="px-4 py-2 text-xs font-medium text-gray-900">
                                                  {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-600">
                                                  {new Date(payment.payment_date).toLocaleDateString("ar-US")}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-600">
                                                  {payment.reference || "غير محدد"}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!expensesData && !expensesLoading && !expensesError && (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <ClipboardList className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              لا توجد بيانات مدفوعات
                            </h3>
                            <p className="text-gray-600">
                              لم يتم العثور على أي بيانات مدفوعات لهذا العقار
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Collection Dialog */}
      <PaymentCollectionDialog />
    </>
  );
}
