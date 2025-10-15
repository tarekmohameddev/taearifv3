"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, RotateCcw } from "lucide-react";

interface RenewalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rental: any;
  formData: {
    rental_type: string;
    rental_duration: number;
    paying_plan: string;
    total_rental_amount: string;
    payment_frequency: string;
    description: string;
  };
  setFormData: (data: any) => void;
  onRenew: () => void;
  loading: boolean;
}

export function RenewalDialog({
  isOpen,
  onClose,
  rental,
  formData,
  setFormData,
  onRenew,
  loading,
}: RenewalDialogProps) {
  if (!isOpen || !rental) return null;

  // Function to calculate payment amounts based on contract type, duration, and payment frequency
  const calculatePaymentAmount = () => {
    if (
      !formData.total_rental_amount ||
      !formData.rental_duration ||
      !formData.rental_type ||
      !formData.paying_plan
    ) {
      return null;
    }

    const totalAmount = parseFloat(formData.total_rental_amount);
    const duration = formData.rental_duration;
    const contractType = formData.rental_type; // "monthly" or "annual"
    const paymentFrequency = formData.paying_plan; // "monthly", "quarterly", "semi_annual", "annual"

    // Convert duration to months
    const totalMonths = contractType === "annual" ? duration * 12 : duration;

    // Calculate how many payment periods based on frequency
    let paymentPeriods = 0;
    let periodName = "";

    switch (paymentFrequency) {
      case "monthly":
        paymentPeriods = totalMonths;
        periodName = "شهري";
        break;
      case "quarterly":
        paymentPeriods = Math.ceil(totalMonths / 3);
        periodName = "ربع سنوي";
        break;
      case "semi_annual":
        paymentPeriods = Math.ceil(totalMonths / 6);
        periodName = "نصف سنوي";
        break;
      case "annual":
        paymentPeriods = Math.ceil(totalMonths / 12);
        periodName = "سنوي";
        break;
      default:
        paymentPeriods = totalMonths;
        periodName = "شهري";
    }

    const paymentAmount = Math.round(totalAmount / paymentPeriods);

    return {
      paymentAmount,
      paymentPeriods,
      periodName,
      totalMonths,
      totalAmount,
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto sm:w-full">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900">
            تجديد عقد الإيجار
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            تجديد عقد الإيجار للمستأجر: {rental.tenant_full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* نوع الإيجار */}
            <div className="space-y-2">
              <Label
                htmlFor="renewal_rental_type"
                className="text-sm font-medium text-gray-700"
              >
                نوع الإيجار <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.rental_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, rental_type: value })
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* مدة الإيجار */}
            <div className="space-y-2">
              <Label
                htmlFor="renewal_rental_duration"
                className="text-sm font-medium text-gray-700"
              >
                مدة الإيجار <span className="text-red-500">*</span>
              </Label>
              <Input
                id="renewal_rental_duration"
                type="number"
                value={formData.rental_duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rental_duration: parseInt(e.target.value) || 0,
                  })
                }
                placeholder={formData.rental_type === "annual" ? "1" : "12"}
                min="1"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            {/* خطة الدفع */}
            <div className="space-y-2">
              <Label
                htmlFor="renewal_paying_plan"
                className="text-sm font-medium text-gray-700"
              >
                خطة الدفع <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.paying_plan}
                onValueChange={(value) =>
                  setFormData({ ...formData, paying_plan: value })
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

            {/* إجمالي مبلغ الإيجار */}
            <div className="space-y-2">
              <Label
                htmlFor="renewal_total_rental_amount"
                className="text-sm font-medium text-gray-700"
              >
                إجمالي مبلغ الإيجار <span className="text-red-500">*</span>
              </Label>
              <Input
                id="renewal_total_rental_amount"
                type="number"
                value={formData.total_rental_amount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_rental_amount: e.target.value,
                  })
                }
                placeholder="6500"
                min="100"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />

              {/* حساب تقسيم مبلغ الإيجار على المدة */}
              {(() => {
                const calculation = calculatePaymentAmount();
                if (!calculation) return null;

                return (
                  <div className="text-xs sm:text-sm bg-gradient-to-r from-blue-50 to-blue-100 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-blue-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="font-semibold text-blue-800 text-xs sm:text-sm">
                        المبلغ {calculation.periodName}:{" "}
                        {calculation.paymentAmount.toLocaleString()} ريال
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="bg-white px-2 sm:px-3 py-2 rounded-md border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
                          <div className="mb-1 sm:mb-0">
                            <span className="text-gray-600 block sm:inline">
                              المدة الإجمالية:
                            </span>
                            <span className="font-medium text-blue-800 block">
                              {calculation.totalMonths} شهر
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 block sm:inline">
                              عدد الدفعات:
                            </span>
                            <span className="font-medium text-blue-800 block">
                              {calculation.paymentPeriods} دفعة
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-blue-600 bg-white px-2 py-1 rounded-md border">
                        <span className="font-medium text-xs sm:text-sm">
                          {calculation.totalAmount.toLocaleString()} ÷{" "}
                          {calculation.paymentPeriods} ={" "}
                          {calculation.paymentAmount.toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* تكرار الدفع */}
            <div className="space-y-2">
              <Label
                htmlFor="renewal_payment_frequency"
                className="text-sm font-medium text-gray-700"
              >
                تكرار الدفع <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.payment_frequency}
                onValueChange={(value) =>
                  setFormData({ ...formData, payment_frequency: value })
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">مرة واحدة</SelectItem>
                  <SelectItem value="per_installment">لكل قسط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* الوصف */}
            <div className="space-y-2 lg:col-span-2">
              <Label
                htmlFor="renewal_description"
                className="text-sm font-medium text-gray-700"
              >
                الوصف
              </Label>
              <Textarea
                id="renewal_description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف تجديد العقد..."
                rows={3}
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 text-sm sm:text-base py-2 sm:py-2"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={onRenew}
              disabled={loading}
              className="w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base py-2 sm:py-2"
            >
              {loading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">جاري التجديد...</span>
                  <span className="sm:hidden">جاري...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="ml-2 h-4 w-4" />
                  <span className="hidden sm:inline">تجديد العقد</span>
                  <span className="sm:hidden">تجديد</span>
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
