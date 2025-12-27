"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  CreditCard,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogClose,
} from "@/components/customComponents/CustomDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WhatsappIcon } from "@/components/icons";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

interface WhatsAppNumber {
  id: number;
  phoneNumber: string;
  name: string | null;
  status: string;
  request_status: string;
  linkingMethod: string;
  apiMethod: string;
  requestId: string;
  created_at: string;
  updated_at: string;
  employee?: {
    id: number;
    name: string;
    email: string;
  };
}

interface WhatsAppPlan {
  id: number;
  name: string;
  price: number;
  duration: number;
  duration_unit: string;
  is_active: boolean;
}

interface WhatsAppResponse {
  success: boolean;
  data: {
    plans: WhatsAppPlan[];
    numbers: WhatsAppNumber[];
    quota: number;
    usage: number;
  };
}

interface RedirectResponse {
  success: boolean;
  redirect_url: string;
  mode: string;
  config_id: string;
}

interface AddonPurchaseResponse {
  success: boolean;
  redirect_url: string;
  mode: string;
  config_id: string;
}

export function WhatsAppCenterPage() {
  const [connectedNumbers, setConnectedNumbers] = useState<WhatsAppNumber[]>(
    [],
  );
  const [plans, setPlans] = useState<WhatsAppPlan[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [quota, setQuota] = useState(0);
  const [usage, setUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [numberToDelete, setNumberToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [togglingNumberId, setTogglingNumberId] = useState<number | null>(null);
  const [increaseLimitDialogOpen, setIncreaseLimitDialogOpen] = useState(false);
  const { userData } = useAuthStore();
  // Fetch WhatsApp data on component mount
  useEffect(() => {
    // Wait for userData to be available before making the request
    if (!userData?.token) {
      return;
    }

    const fetchWhatsAppData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // axiosInstance interceptor will automatically add the Authorization header
        const response = await axiosInstance.get<WhatsAppResponse>("/api/whatsapp/addons/plans");

        if (response.data.success && response.data.data) {
          const numbers = response.data.data.numbers || [];
          const plansData = response.data.data.plans || [];
          
          setConnectedNumbers(numbers);
          setPlans(plansData);
          
          setQuota(response.data.data.quota || 0);
          setUsage(response.data.data.usage || 0);
        } else {
          setError("فشل في تحميل البيانات");
        }
      } catch (err: any) {
        console.error("Error fetching WhatsApp data:", err);
        setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhatsAppData();
  }, [userData?.token]);

  // Set default selected plan when plans are loaded
  useEffect(() => {
    if (plans.length > 0 && !selectedPlan) {
      const activePlan = plans.find(plan => plan.is_active) || plans[0];
      if (activePlan) {
        setSelectedPlan(activePlan.id);
      }
    }
  }, [plans, selectedPlan]);

  const handleFacebookLogin = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const response = await axiosInstance.get("/whatsapp/meta/redirect", {
        params: {
          mode: "existing",
        },
      });

      if (response.data.success && response.data.redirect_url) {
        // Open redirect URL in new tab
        window.open(response.data.redirect_url, "_blank");
      } else {
        setError("فشل في الحصول على رابط التوجيه");
      }
    } catch (err: any) {
      console.error("Error getting redirect URL:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء محاولة الربط");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeleteNumber = async (id: number) => {
    try {
      await axiosInstance.delete(`/whatsapp/${id}`);
    setConnectedNumbers((prev) => prev.filter((num) => num.id !== id));
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } catch (err: any) {
      console.error("Error deleting number:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء حذف الرقم");
    } finally {
    setDeleteDialogOpen(false);
    setNumberToDelete(null);
    }
  };

  const confirmDelete = (id: number) => {
    setNumberToDelete(String(id));
    setDeleteDialogOpen(true);
  };

  const handleUnlinkNumber = async (id: number) => {
    try {
      setTogglingNumberId(id);
      setError(null);
      
      const response = await axiosInstance.post(`/whatsapp/${id}/unlink`);
      
      if (response.data.success) {
        // Refresh the numbers list
        const fetchResponse = await axiosInstance.get<WhatsAppResponse>("/api/whatsapp/addons/plans");
        if (fetchResponse.data.success && fetchResponse.data.data) {
          setConnectedNumbers(fetchResponse.data.data.numbers || []);
        }
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        setError("فشل في إلغاء تفعيل الرقم");
      }
    } catch (err: any) {
      console.error("Error unlinking number:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إلغاء تفعيل الرقم");
    } finally {
      setTogglingNumberId(null);
    }
  };

  const handleActivateNumber = async (id: number) => {
    try {
      setTogglingNumberId(id);
      setError(null);
      
      // Use the redirect endpoint with existing mode to reactivate
      const response = await axiosInstance.get("/whatsapp/meta/redirect", {
        params: {
          mode: "existing",
        },
      });

      if (response.data.success && response.data.redirect_url) {
        // Open redirect URL in new tab for reactivation
        window.open(response.data.redirect_url, "_blank");
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 5000);
      } else {
        setError("فشل في الحصول على رابط التفعيل");
      }
    } catch (err: any) {
      console.error("Error activating number:", err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تفعيل الرقم");
    } finally {
      setTogglingNumberId(null);
    }
  };

  const handlePurchaseAddon = async () => {
    try {
      setIsPurchasing(true);
      setError(null);

      if (!selectedPlan) {
        setError("يرجى اختيار خطة أولاً");
        setIsPurchasing(false);
        return;
      }

      // Get first active WhatsApp number
      const firstActiveNumber = connectedNumbers.find(
        (num) => num.status === "active",
      );

      if (!firstActiveNumber) {
        setError("لا يوجد رقم واتساب نشط. يرجى إضافة رقم أولاً");
        setIsPurchasing(false);
        return;
      }

      // Call the addon purchase API
      const response = await axiosInstance.post<AddonPurchaseResponse>(
        "/whatsapp/addons",
        {
          whatsapp_number_id: firstActiveNumber.id,
          qty: 1,
          plan_id: selectedPlan,
          payment_method: "test",
        },
      );

      if (response.data.success && response.data.redirect_url) {
        // Redirect to payment gateway
        window.location.href = response.data.redirect_url;
      } else {
        setError("فشل في إنشاء طلب الشراء");
      }
    } catch (err: any) {
      console.error("Error purchasing addon:", err);
      setError(
        err.response?.data?.message ||
          "حدث خطأ أثناء محاولة الشراء. يرجى المحاولة مرة أخرى",
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="whatsapp-center" />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                مركز الواتساب
              </h1>
              <p className="text-muted-foreground">
                قم بربط أرقام الواتساب الخاصة بك عبر فيسبوك بيزنس لإدارة الرسائل
                والتواصل مع العملاء
              </p>
            </div>

            {/* Success Alert */}
            {showSuccessAlert && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  تم الربط بنجاح!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  تم ربط رقم الواتساب الجديد بحسابك بنجاح. يمكنك الآن استخدامه
                  للتواصل مع العملاء.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الأرقام المتصلة
                  </CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : connectedNumbers.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    أرقام واتساب نشطة
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    الرسائل المرسلة
                  </CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? "..." : totalMessages.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">رسالة مرسلة</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    حالة الاتصال
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isLoading
                      ? "..."
                      : connectedNumbers.length > 0
                        ? "متصل"
                        : "غير متصل"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {connectedNumbers.length > 0
                      ? "جميع الأرقام تعمل بشكل طبيعي"
                      : "لا توجد أرقام متصلة"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Purchase Addon Card */}
            <Card className="border-2 border-green-200 bg-green-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  شراء رقم واتساب إضافي
                </CardTitle>
                <CardDescription>
                  قم بشراء رقم واتساب إضافي لتوسيع قنوات التواصل الخاصة بك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Usage Display */}
                <div className="bg-white rounded-lg p-4 border">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      الحد الحالي
                    </p>
                    <div className="text-3xl font-bold text-green-600">
                      {isLoading ? "..." : `${usage} / ${quota}`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      أرقام مستخدمة من أصل المتاحة
                    </p>
                  </div>
                </div>

                {/* Plan Selection */}
                {plans.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm font-medium mb-3">اختر خطة الاشتراك</p>
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                      {plans
                        .filter(plan => plan.is_active)
                        .map((plan) => (
                          <Button
                            key={plan.id}
                            variant={selectedPlan === plan.id ? "default" : "outline"}
                            onClick={() => setSelectedPlan(plan.id)}
                            className="flex flex-col items-start h-auto py-3 px-4"
                            disabled={isPurchasing}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{plan.name}</span>
                              <span className="text-sm font-bold">
                                ${plan.price}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground mt-1">
                              {plan.duration} {plan.duration_unit === "year" ? "سنة" : "شهر"}
                            </span>
                          </Button>
                        ))}
                    </div>
                    {selectedPlan && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {plans.find(p => p.id === selectedPlan)?.name || "خطة محددة"}
                      </p>
                    )}
                  </div>
                )}

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchaseAddon}
                  disabled={isPurchasing || isLoading || connectedNumbers.length === 0 || !selectedPlan}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isPurchasing ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      شراء رقم إضافي
                    </>
                  )}
                </Button>

                {connectedNumbers.length === 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    يرجى إضافة رقم واتساب أولاً قبل الشراء
                  </p>
                )}
                {!selectedPlan && plans.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    يرجى اختيار خطة أولاً
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Add New Number Card */}
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  إضافة رقم واتساب جديد
                </CardTitle>
                <CardDescription>
                  اربط رقم واتساب بيزنس جديد عبر حساب فيسبوك الخاص بك لبدء
                  التواصل مع العملاء
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>متطلبات الربط</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>
                        يجب ان يكون واتساب تطبيق اعمال حصرياً, وليس واتساب عادي
                      </li>
                      <li>حساب فيسبوك بيزنس مُفعّل</li>
                      <li>رقم هاتف غير مرتبط بحساب واتساب آخر</li>
                      <li>إمكانية استقبال رمز التحقق عبر SMS</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleFacebookLogin}
                  disabled={isConnecting}
                  className="w-full md:w-auto bg-[#1877F2] hover:bg-[#166FE5] text-white gap-2"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      جاري الربط...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      تسجيل الدخول عبر فيسبوك
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  بالنقر على الزر، ستتم إعادة توجيهك إلى فيسبوك لتسجيل الدخول
                  وربط حساب واتساب بيزنس الخاص بك.
                </p>
              </CardContent>
            </Card>

            {/* Connected Numbers Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <WhatsappIcon className="h-5 w-5 text-[#25D366]" />
                      الأرقام المتصلة
                    </CardTitle>
                    <CardDescription>
                      جميع أرقام الواتساب المرتبطة بحسابك
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setIncreaseLimitDialogOpen(true)}
                    variant="outline"
                    className="gap-2 w-full md:w-auto border-green-700 text-green-700 hover:bg-green-50 hover:border-green-800 hover:text-green-800"
                  >
                    <Plus className="h-4 w-4" />
                    زيادة الحد الحالي
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                    <p>جاري تحميل البيانات...</p>
                  </div>
                ) : connectedNumbers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>لا توجد أرقام متصلة حالياً</p>
                    <p className="text-sm">قم بإضافة رقم واتساب جديد للبدء</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">رقم الهاتف</TableHead>
                        <TableHead className="text-right">
                          الاسم المعروض
                        </TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">حالة الطلب</TableHead>
                        <TableHead className="text-right">
                          تاريخ الربط
                        </TableHead>
                        <TableHead className="text-right">آخر تحديث</TableHead>
                        <TableHead className="text-right">
                          الموظف المسؤول
                        </TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {connectedNumbers.map((number) => (
                        <TableRow key={number.id}>
                          <TableCell className="font-medium" dir="ltr">
                            {number.phoneNumber}
                          </TableCell>
                          <TableCell>{number.name || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                number.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                number.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : ""
                              }
                            >
                              {number.status === "active"
                                ? "نشط"
                                : number.status === "inactive"
                                  ? "غير نشط"
                                  : number.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                number.request_status === "active"
                                  ? "default"
                                  : number.request_status === "pending"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={
                                number.request_status === "active"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : number.request_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : ""
                              }
                            >
                              {number.request_status === "active"
                                ? "نشط"
                                : number.request_status === "pending"
                                  ? "قيد الانتظار"
                                  : number.request_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(number.created_at).toLocaleDateString(
                              "ar-US",
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(number.updated_at).toLocaleDateString(
                              "ar-US",
                            )}
                          </TableCell>
                          <TableCell>
                            {number.employee
                              ? `${number.employee.name} (${number.employee.email})`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    disabled={togglingNumberId === number.id}
                                  >
                                    {togglingNumberId === number.id ? (
                                      <RefreshCw className="h-4 w-4 animate-spin" />
                                    ) : (
                                <Settings className="h-4 w-4" />
                                    )}
                              </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rtl">
                                  {number.status === "active" ? (
                                    <DropdownMenuItem
                                      onClick={() => handleUnlinkNumber(number.id)}
                                      disabled={togglingNumberId === number.id}
                                      className="cursor-pointer"
                                    >
                                      <PowerOff className="h-4 w-4 ml-2" />
                                      إلغاء التفعيل
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      onClick={() => handleActivateNumber(number.id)}
                                      disabled={togglingNumberId === number.id}
                                      className="cursor-pointer"
                                    >
                                      <Power className="h-4 w-4 ml-2" />
                                      تفعيل
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => confirmDelete(number.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Help Section */}
            {/* مخفي حالياً */}
            {/* <Card>
              <CardHeader>
                <CardTitle>هل تحتاج مساعدة؟</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-blue-100">
                      <ExternalLink className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">دليل الإعداد</h4>
                      <p className="text-sm text-muted-foreground">تعرف على كيفية إعداد حساب واتساب بيزنس الخاص بك</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className="p-2 rounded-full bg-green-100">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">الدعم الفني</h4>
                      <p className="text-sm text-muted-foreground">تواصل مع فريق الدعم للحصول على المساعدة</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من أنك تريد فصل هذا الرقم؟ لن تتمكن من استقبال أو
              إرسال الرسائل عبره بعد الآن.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                numberToDelete && handleDeleteNumber(Number(numberToDelete))
              }
            >
              نعم، فصل الرقم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Increase Limit Dialog */}
      <CustomDialog
        open={increaseLimitDialogOpen}
        onOpenChange={setIncreaseLimitDialogOpen}
        maxWidth="max-w-md"
      >
        <CustomDialogContent>
          <CustomDialogClose onClose={() => setIncreaseLimitDialogOpen(false)} />
          <CustomDialogHeader>
            <CustomDialogTitle>زيادة الحد</CustomDialogTitle>
          </CustomDialogHeader>
          <div className="space-y-4 p-4 sm:p-6">
            {/* Limit Display */}
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">الحد الحالي</p>
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : `${usage} / ${quota}`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                أرقام مستخدمة من أصل المتاحة
              </p>
            </div>

            {/* Increase Limit Button */}
            <Button
              onClick={() => {
                setIncreaseLimitDialogOpen(false);
                handlePurchaseAddon();
              }}
              disabled={isPurchasing || isLoading || connectedNumbers.length === 0 || !selectedPlan}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
              size="lg"
            >
              {isPurchasing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  زيادة الحد
                </>
              )}
            </Button>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  );
}
