"use client";

import { useState, useEffect } from "react";
import { useMarketingDashboardStore } from "@/context/store/marketingDashboard";
import {
  Plus,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit,
  MessageSquare,
  Users,
  Calendar,
  Activity,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WhatsappIcon } from "@/components/icons";

interface WhatsAppNumber {
  id: number;
  user_id: number;
  name: string;
  description: string;
  type: string;
  number: string;
  business_id: string;
  phone_id: string;
  access_token: string;
  is_verified: boolean;
  is_connected: boolean;
  sent_messages_count: number;
  received_messages_count: number;
  additional_settings: any[];
  created_at: string;
  updated_at: string;
}

export function WhatsAppNumbersManagement() {
  // استخدام الـ store الجديد
  const {
    whatsappNumbers,
    connectedNumbers,
    verifiedNumbers,
    loading,
    error,
    fetchWhatsAppNumbers,
    addWhatsAppNumber,
    deleteWhatsAppNumber,
  } = useMarketingDashboardStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNumber, setNewNumber] = useState({
    phoneNumber: "",
    displayName: "",
    description: "",
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    fetchWhatsAppNumbers();
  }, [fetchWhatsAppNumbers]);

  const handleAddNumber = async () => {
    try {
      setIsConnecting(true);
      
      await addWhatsAppNumber({
        phone_number: newNumber.phoneNumber,
        display_name: newNumber.displayName,
        business_name: newNumber.description,
      });
      
      // إعادة تعيين النموذج
      setNewNumber({
        phoneNumber: "",
        displayName: "",
        description: "",
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("خطأ في إضافة رقم WhatsApp:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveNumber = async (id: number) => {
    try {
      await deleteWhatsAppNumber(id);
    } catch (error) {
      console.error("خطأ في حذف رقم WhatsApp:", error);
    }
  };

  const getStatusColor = (number: WhatsAppNumber) => {
    if (number.is_connected) {
      return "bg-green-100 text-green-800 border-green-200";
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (number: WhatsAppNumber) => {
    if (number.is_connected) {
      return <CheckCircle className="h-4 w-4" />;
    } else {
      return <XCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (number: WhatsAppNumber) => {
    if (number.is_connected) {
      return "متصل";
    } else {
      return "غير متصل";
    }
  };

  const getVerificationStatus = (number: WhatsAppNumber) => {
    if (number.is_verified) {
      return "verified";
    } else {
      return "pending";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">جاري تحميل أرقام WhatsApp...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <WhatsappIcon className="h-5 w-5 ml-2 text-green-600" />
            أرقام الواتساب
          </h2>
          <p className="text-sm text-muted-foreground">
            إدارة أرقام الواتساب المتصلة مع Meta Cloud API
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة رقم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle>إضافة رقم واتساب جديد</DialogTitle>
              <DialogDescription>
                سيتم توجيهك إلى Meta Cloud API لربط رقم الواتساب
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">رقم الواتساب</Label>
                <Input
                  id="phone"
                  placeholder="+966501234567"
                  value={newNumber.phoneNumber}
                  onChange={(e) =>
                    setNewNumber({ ...newNumber, phoneNumber: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="displayName">الاسم المعروض</Label>
                <Input
                  id="displayName"
                  placeholder="مثل: الرقم الرئيسي للشركة"
                  value={newNumber.displayName}
                  onChange={(e) =>
                    setNewNumber({ ...newNumber, displayName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">وصف (اختياري)</Label>
                <Textarea
                  id="description"
                  placeholder="وصف مختصر لاستخدام هذا الرقم"
                  value={newNumber.description}
                  onChange={(e) =>
                    setNewNumber({ ...newNumber, description: e.target.value })
                  }
                />
              </div>

              <Alert>
                <ExternalLink className="h-4 w-4" />
                <AlertDescription>
                  سيتم فتح نافذة Meta Cloud API لإكمال عملية الربط والتحقق من
                  الرقم
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddNumber}
                  disabled={
                    !newNumber.phoneNumber ||
                    !newNumber.displayName ||
                    isConnecting
                  }
                  className="flex-1"
                >
                  {isConnecting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الربط...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 ml-2" />
                      ربط مع Meta API
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Numbers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {whatsappNumbers.map((number: any) => (
          <Card key={number.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <WhatsappIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{number.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {number.number}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(number)}>
                    {getStatusIcon(number)}
                    <span className="mr-1">{getStatusText(number)}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Status Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">حالة التحقق:</span>
                  <div className="flex items-center gap-1 mt-1">
                    {getVerificationStatus(number) === "verified" ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-yellow-600" />
                    )}
                    <span className="text-xs">
                      {getVerificationStatus(number) === "verified"
                        ? "مُحقق"
                        : "في الانتظار"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground">تاريخ الإضافة:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span className="text-xs">
                      {new Date(number.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600">
                    <MessageSquare className="h-4 w-4" />
                    <span className="font-semibold">
                      {number.sent_messages_count}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    رسائل مُرسلة
                  </span>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">
                      {number.received_messages_count}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    رسائل مُستقبلة
                  </span>
                </div>
              </div>

              {/* Meta API Details */}
              {number.business_id && (
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Business Account ID: {number.business_id}</div>
                  {number.phone_id && (
                    <div>Phone Number ID: {number.phone_id}</div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <Edit className="h-3 w-3 ml-1" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  <Activity className="h-3 w-3 ml-1" />
                  الإحصائيات
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveNumber(number.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {whatsappNumbers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <WhatsappIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد أرقام واتساب</h3>
            <p className="text-muted-foreground mb-4">
              ابدأ بإضافة رقم واتساب الأول لبدء إرسال الرسائل
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة رقم واتساب
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Alert */}
      <Alert dir="rtl">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>ملاحظة:</strong> يتطلب ربط أرقام الواتساب حساب Meta Business
          وموافقة على شروط استخدام WhatsApp Business API. تأكد من أن رقمك مُحقق
          ومُعتمد من Meta قبل البدء في إرسال الرسائل.
        </AlertDescription>
      </Alert>
    </div>
  );
}
