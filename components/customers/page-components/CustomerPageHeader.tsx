
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Move, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import CitySelector from "@/components/CitySelector";
import DistrictSelector from "@/components/DistrictSelector";
import axiosInstance from "@/lib/axiosInstance";
import { useState, useEffect } from "react";

interface Stage {
  id: number;
  stage_name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  order: number;
}

export const CustomerPageHeader = ({
  showAddCustomerDialog,
  setShowAddCustomerDialog,
  newCustomer,
  handleNewCustomerChange,
  handleNewCustomerInputChange,
  validationErrors,
  clientErrors,
  handleAddCustomer,
  isSubmitting,
  setValidationErrors,
  setClientErrors,
  setIsSubmitting,
  setNewCustomer,
}: any) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [fetchingStages, setFetchingStages] = useState(false);

  // جلب المراحل من الAPI عند تحميل المكون
  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    setFetchingStages(true);
    try {
      const response = await axiosInstance.get("/crm/stages");
      if (response.data.status === "success") {
        // ترتيب المراحل حسب order
        const sortedStages = response.data.data.sort((a: Stage, b: Stage) => a.order - b.order);
        setStages(sortedStages);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    } finally {
      setFetchingStages(false);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة العملاء</h1>
        <p className="text-muted-foreground">
          عرض وإدارة بيانات العملاء في جدول منظم
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Dialog
          open={showAddCustomerDialog}
          onOpenChange={(isOpen) => {
            setShowAddCustomerDialog(isOpen);
            if (!isOpen) {
              setValidationErrors({});
              setClientErrors({});
              setIsSubmitting(false);
              setNewCustomer({
                name: "",
                email: "",
                phone_number: "",
                password: "",
                city_id: null,
                district_id: null,
                note: "",
                customer_type: "مشتري",
                priority: 1,
                                 stage_id: null,
              });
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="ml-2 h-4 w-4" />
              إضافة عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة عميل جديد</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    الاسم بالعربية <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="أحمد محمد العلي"
                    value={newCustomer.name}
                    onChange={handleNewCustomerInputChange("name")}
                    className={
                      validationErrors.name || clientErrors.name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {(validationErrors.name || clientErrors.name) && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.name?.[0] || clientErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    value={newCustomer.email}
                    onChange={handleNewCustomerInputChange("email")}
                    className={
                      validationErrors.email || clientErrors.email
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {(validationErrors.email || clientErrors.email) && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.email?.[0] || clientErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+966 50 123 4567"
                    value={newCustomer.phone_number}
                    onChange={handleNewCustomerInputChange("phone_number")}
                    className={
                      validationErrors.phone_number ||
                      clientErrors.phone_number
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {(validationErrors.phone_number ||
                    clientErrors.phone_number) && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.phone_number?.[0] ||
                        clientErrors.phone_number}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">
                    كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newCustomer.password}
                    onChange={handleNewCustomerInputChange("password")}
                    className={
                      validationErrors.password || clientErrors.password
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {(validationErrors.password || clientErrors.password) && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.password?.[0] ||
                        clientErrors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_type">نوع العميل</Label>
                  <Select
                    onValueChange={handleNewCustomerChange("customer_type")}
                    value={newCustomer.customer_type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="مشتري">مشتري</SelectItem>
                      <SelectItem value="بائع">بائع</SelectItem>
                      <SelectItem value="مستأجر">مستأجر</SelectItem>
                      <SelectItem value="مؤجر">مؤجر</SelectItem>
                      <SelectItem value="مستثمر">مستثمر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الأولوية</Label>
                  <Select
                    onValueChange={(value) =>
                      handleNewCustomerChange("priority")(parseInt(value, 10))
                    }
                    value={String(newCustomer.priority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">منخفضة</SelectItem>
                      <SelectItem value="2">متوسطة</SelectItem>
                      <SelectItem value="3">عالية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">المرحلة (اختياري)</Label>
                  {fetchingStages ? (
                    <div className="flex items-center justify-center py-2 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      <span className="text-sm text-muted-foreground">جاري التحميل...</span>
                    </div>
                  ) : (
                                          <Select
                        onValueChange={(value) =>
                          handleNewCustomerChange("stage_id")(
                            value === "none" ? null : parseInt(value, 10)
                          )
                        }
                        value={newCustomer.stage_id?.toString() || "none"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر المرحلة (اختياري)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">بدون مرحلة</SelectItem>
                          {stages.map((stage) => (
                            <SelectItem key={stage.id} value={stage.id.toString()}>
                              <div className="flex items-center gap-2">
                                {stage.color && (
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: stage.color }}
                                  />
                                )}
                                <span>{stage.stage_name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  )}
                </div>
                <div>
                  {/* حقل فارغ للحفاظ على التخطيط */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">المدينة</Label>
                  <CitySelector
                    selectedCityId={newCustomer.city_id}
                    onCitySelect={handleNewCustomerChange("city_id")}
                    className={
                      validationErrors.city_id ? "border-red-500" : ""
                    }
                  />
                  {validationErrors.city_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.city_id[0]}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="district">الحي</Label>
                  <DistrictSelector
                    selectedCityId={newCustomer.city_id}
                    selectedDistrictId={newCustomer.district_id}
                    onDistrictSelect={handleNewCustomerChange("district_id")}
                    className={
                      validationErrors.district_id ? "border-red-500" : ""
                    }
                  />
                  {validationErrors.district_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors.district_id[0]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="أدخل أي ملاحظات مهمة عن العميل..."
                  value={newCustomer.note}
                  onChange={handleNewCustomerInputChange("note")}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddCustomerDialog(false)}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
                <Button onClick={handleAddCustomer} disabled={isSubmitting}>
                  {isSubmitting ? "جاري الإضافة..." : "إضافة العميل"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 