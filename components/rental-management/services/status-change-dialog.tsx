"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rental: any;
  onStatusChange: (status: string) => void;
  isLoading: boolean;
  onOpenRenewal?: () => void;
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  rental,
  onStatusChange,
  isLoading,
  onOpenRenewal,
}: StatusChangeDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Get available status options based on current status
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
        return []; // Cannot change from final state
      case "cancelled":
        return []; // Cannot change from final state
      default:
        return [];
    }
  };

  const availableOptions = getAvailableStatusOptions(rental?.status || "");

  const handleSave = () => {
    if (selectedStatus) {
      onStatusChange(selectedStatus);
    } else {
      console.log("❌ No status selected");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>تغيير حالة العقد</DialogTitle>
              <DialogDescription>اختر الحالة الجديدة للعقد</DialogDescription>
            </div>
            {onOpenRenewal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose(); // إغلاق dialog تغيير الحالة
                  onOpenRenewal(); // فتح dialog التجديد
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 text-xs"
              >
                <RotateCcw className="ml-1 h-3 w-3" />
                تجديد العقد
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>الحالة الحالية: {rental?.status || "غير محدد"}</Label>
          </div>

          {availableOptions.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="status-select">الحالة الجديدة</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة الجديدة" />
                </SelectTrigger>
                <SelectContent>
                  {availableOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">لا يمكن تغيير حالة هذا العقد</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          {availableOptions.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={!selectedStatus || isLoading}
            >
              {isLoading ? "جاري الحفظ..." : "حفظ"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
