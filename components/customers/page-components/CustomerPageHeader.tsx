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
import useCustomersFiltersStore from "@/context/store/customersFilters";
import useAuthStore from "@/context/AuthContext";
import { z } from "zod";
import toast from "react-hot-toast";

interface Stage {
  id: number;
  stage_name: string;
  color: string | null;
  icon: string | null;
  description: string | null;
  order: number;
}

// Zod validation schema
const customerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z
    .string()
    .email("البريد الإلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  phone_number: z.string().min(1, "رقم الهاتف مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  city_id: z.number().nullable(),
  district_id: z.union([z.number(), z.string()]).nullable(),
  note: z.string().optional(),
  type_id: z.number().min(1, "نوع العميل مطلوب"),
  priority_id: z.number().min(1, "الأولوية مطلوبة"),
  stage_id: z.union([z.number(), z.null(), z.literal("")]).optional(),
  procedure_id: z.number().optional(),
});

// Error message translation mapping
const errorTranslations: Record<string, string> = {
  "The phone number has already been taken.":
    "رقم الهاتف مُستخدم بالفعل، يرجى استخدام رقم آخر",
  "The email has already been taken.":
    "البريد الإلكتروني مُستخدم بالفعل، يرجى استخدام بريد آخر",
  "The name field is required.": "حقل الاسم مطلوب",
  "The phone number field is required.": "حقل رقم الهاتف مطلوب",
  "The password field is required.": "حقل كلمة المرور مطلوب",
  "The email must be a valid email address.":
    "يجب أن يكون البريد الإلكتروني صحيحاً",
  "The phone number format is invalid.": "تنسيق رقم الهاتف غير صحيح",
  "The password must be at least 6 characters.":
    "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل",
  "The priority id field is required.": "حقل الأولوية مطلوب",
  "The selected type id is invalid.": "نوع العميل المحدد غير صحيح",
  "The selected procedure id is invalid.": "نوع الإجراء المحدد غير صحيح",
};

// Function to translate error messages
const translateErrorMessage = (message: string): string => {
  return errorTranslations[message] || message;
};

export const CustomerPageHeader = ({
  showAddCustomerDialog,
  setShowAddCustomerDialog,
  newCustomer,
  handleNewCustomerChange,
  handleNewCustomerInputChange,
  validationErrors,
  clientErrors,
  isSubmitting,
  setValidationErrors,
  setClientErrors,
  setIsSubmitting,
  setNewCustomer,
  onCustomerAdded,
}: any) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [fetchingStages, setFetchingStages] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get filter data from store
  const { filterData } = useCustomersFiltersStore();
  const { userData } = useAuthStore();

  // جلب المراحل من الAPI عند تحميل المكون
  useEffect(() => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchStages");
      return;
    }
    fetchStages();
  }, [userData?.token]);

  const fetchStages = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchStages");
      return;
    }

    setFetchingStages(true);
    try {
      const response = await axiosInstance.get("/crm/stages");
      if (response.data.status === "success") {
        // ترتيب المراحل حسب order
        const sortedStages = response.data.data.sort(
          (a: Stage, b: Stage) => a.order - b.order,
        );
        setStages(sortedStages);
      }
    } catch (error) {
      console.error("Error fetching stages:", error);
    } finally {
      setFetchingStages(false);
    }
  };

  // Client-side validation function
  const validateForm = () => {
    try {
      customerSchema.parse(newCustomer);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        return false;
      }
      return false;
    }
  };

  // Enhanced add customer function with validation
  const handleAddCustomerWithValidation = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log(
        "No token available, skipping handleAddCustomerWithValidation",
      );
      alert("Authentication required. Please login.");
      return;
    }

    // Clear previous errors
    setFormErrors({});
    setValidationErrors({});
    setClientErrors({});

    // Client-side validation
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء في النموذج", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // معالجة stage_id قبل الإرسال
      const customerDataToSend: any = {
        ...newCustomer,
        stage_id: newCustomer.stage_id === null ? "" : newCustomer.stage_id,
      };

      // إزالة stage_id إذا كان فارغاً لتجنب مشاكل الـ API
      if (customerDataToSend.stage_id === "") {
        delete customerDataToSend.stage_id;
      }

      const response = await axiosInstance.post(
        "/customers",
        customerDataToSend,
      );

      // Add the new customer to the list
      if (onCustomerAdded && response.data.data) {
        onCustomerAdded(response.data.data);
      }

      // Show success toast
      toast.success("تم إضافة العميل بنجاح! 🎉", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "12px 20px",
          borderRadius: "8px",
        },
      });

      setShowAddCustomerDialog(false);
      // Reset form - clear all inputs
      setNewCustomer({
        name: "",
        email: "",
        phone_number: "",
        password: "",
        city_id: null,
        district_id: null,
        note: "",
        type_id: 1,
        priority_id: 1,
        stage_id: null,
        procedure_id: null,
      });
      // Clear any existing errors
      setFormErrors({});
      setClientErrors({});
      setValidationErrors({});
    } catch (error: any) {
      console.error("Error adding customer:", error);

      if (error?.response && error?.response?.status === 422) {
        const serverErrors = error?.response?.data?.errors || {};
        // Translate server error messages to Arabic
        const translatedErrors: Record<string, string[]> = {};
        Object.keys(serverErrors).forEach((field) => {
          translatedErrors[field] = serverErrors[field].map((msg: string) =>
            translateErrorMessage(msg),
          );
        });
        setValidationErrors(translatedErrors);

        // Show error toast with first error message
        const firstError = Object.values(translatedErrors)[0]?.[0];
        if (firstError) {
          toast.error(firstError, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "#EF4444",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              padding: "12px 20px",
              borderRadius: "8px",
            },
          });
        }
      } else {
        // Handle other types of errors
        toast.error("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#EF4444",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "12px 20px",
            borderRadius: "8px",
          },
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to check if field has error
  const hasError = (fieldName: string): boolean => {
    return !!(
      formErrors[fieldName] ||
      validationErrors[fieldName] ||
      clientErrors[fieldName]
    );
  };

  // Helper function to get error message
  const getErrorMessage = (fieldName: string): string => {
    return (
      formErrors[fieldName] ||
      validationErrors[fieldName]?.[0] ||
      clientErrors[fieldName] ||
      ""
    );
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
              setFormErrors({});
              setIsSubmitting(false);
              setNewCustomer({
                name: "",
                email: "",
                phone_number: "",
                password: "",
                city_id: null,
                district_id: null,
                note: "",
                type_id: 1,
                priority_id: 1,
                stage_id: null,
                procedure_id: null,
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
                  <Label
                    htmlFor="name"
                    className={hasError("name") ? "text-red-500" : ""}
                  >
                    الاسم بالعربية <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="أحمد محمد العلي"
                    value={newCustomer.name}
                    onChange={handleNewCustomerInputChange("name")}
                    className={
                      hasError("name")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {hasError("name") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("name")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className={hasError("email") ? "text-red-500" : ""}
                  >
                    البريد الإلكتروني
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    value={newCustomer.email}
                    onChange={handleNewCustomerInputChange("email")}
                    className={
                      hasError("email")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {hasError("email") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("email")}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="phone"
                    className={hasError("phone_number") ? "text-red-500" : ""}
                  >
                    رقم الهاتف <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+966 50 123 4567"
                    value={newCustomer.phone_number}
                    onChange={handleNewCustomerInputChange("phone_number")}
                    className={
                      hasError("phone_number")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {hasError("phone_number") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("phone_number")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className={hasError("password") ? "text-red-500" : ""}
                  >
                    كلمة المرور <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={newCustomer.password}
                    onChange={handleNewCustomerInputChange("password")}
                    className={
                      hasError("password")
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {hasError("password") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("password")}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="type_id"
                    className={hasError("type_id") ? "text-red-500" : ""}
                  >
                    نوع العميل <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleNewCustomerChange("type_id")(parseInt(value, 10))
                    }
                    value={String(newCustomer.type_id || "")}
                  >
                    <SelectTrigger
                      className={
                        hasError("type_id")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData?.types?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      )) || [
                        <SelectItem key="1" value="1">
                          مشتري
                        </SelectItem>,
                        <SelectItem key="2" value="2">
                          مستثمر
                        </SelectItem>,
                        <SelectItem key="3" value="3">
                          مستأجر
                        </SelectItem>,
                        <SelectItem key="4" value="4">
                          مستأجر
                        </SelectItem>,
                        <SelectItem key="5" value="5">
                          بائع
                        </SelectItem>,
                      ]}
                    </SelectContent>
                  </Select>
                  {hasError("type_id") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("type_id")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    className={hasError("priority_id") ? "text-red-500" : ""}
                  >
                    الأولوية <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleNewCustomerChange("priority_id")(
                        parseInt(value, 10),
                      )
                    }
                    value={String(newCustomer.priority_id || "")}
                  >
                    <SelectTrigger
                      className={
                        hasError("priority_id")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData?.priorities?.map((priority: any) => (
                        <SelectItem
                          key={priority.id}
                          value={priority.id.toString()}
                        >
                          {priority.name}
                        </SelectItem>
                      )) || [
                        <SelectItem key="1" value="1">
                          منخفضة
                        </SelectItem>,
                        <SelectItem key="2" value="2">
                          متوسطة
                        </SelectItem>,
                        <SelectItem key="3" value="3">
                          عالية
                        </SelectItem>,
                      ]}
                    </SelectContent>
                  </Select>
                  {hasError("priority_id") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("priority_id")}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    className={hasError("procedure_id") ? "text-red-500" : ""}
                  >
                    نوع الإجراء
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      handleNewCustomerChange("procedure_id")(
                        parseInt(value, 10),
                      )
                    }
                    value={String(newCustomer.procedure_id || "")}
                  >
                    <SelectTrigger
                      className={
                        hasError("procedure_id")
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="اختر نوع الإجراء" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterData?.procedures?.map((procedure: any) => (
                        <SelectItem
                          key={procedure.id}
                          value={procedure.id.toString()}
                        >
                          {procedure.name}
                        </SelectItem>
                      )) || [
                        <SelectItem key="1" value="1">
                          لقاء
                        </SelectItem>,
                        <SelectItem key="2" value="2">
                          زيارة
                        </SelectItem>,
                      ]}
                    </SelectContent>
                  </Select>
                  {hasError("procedure_id") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("procedure_id")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="stage">المرحلة (اختياري)</Label>
                  {fetchingStages ? (
                    <div className="flex items-center justify-center py-2 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      <span className="text-sm text-muted-foreground">
                        جاري التحميل...
                      </span>
                    </div>
                  ) : (
                    <Select
                      onValueChange={(value) =>
                        handleNewCustomerChange("stage_id")(
                          value === "none" ? null : parseInt(value, 10),
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
                          <SelectItem
                            key={stage.id}
                            value={stage.id.toString()}
                          >
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="city"
                    className={hasError("city_id") ? "text-red-500" : ""}
                  >
                    المدينة
                  </Label>
                  <CitySelector
                    selectedCityId={newCustomer.city_id}
                    onCitySelect={handleNewCustomerChange("city_id")}
                    className={hasError("city_id") ? "border-red-500" : ""}
                  />
                  {hasError("city_id") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("city_id")}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="district"
                    className={hasError("district_id") ? "text-red-500" : ""}
                  >
                    الحي
                  </Label>
                  <DistrictSelector
                    selectedCityId={newCustomer.city_id}
                    selectedDistrictId={newCustomer.district_id}
                    onDistrictSelect={handleNewCustomerChange("district_id")}
                    className={hasError("district_id") ? "border-red-500" : ""}
                  />
                  {hasError("district_id") && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage("district_id")}
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
                <Button
                  onClick={handleAddCustomerWithValidation}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    "إضافة العميل"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
