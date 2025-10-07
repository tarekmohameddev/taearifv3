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

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  rental: any;
  onStatusChange: (status: string) => void;
  isLoading: boolean;
}

export function StatusChangeDialog({
  isOpen,
  onClose,
  rental,
  onStatusChange,
  isLoading
}: StatusChangeDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // Get available status options based on current status
  const getAvailableStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case "draft":
        return [
          { value: "active", label: "نشط" },
          { value: "cancelled", label: "ملغي" }
        ];
      case "active":
        return [
          { value: "ended", label: "منتهي" },
          { value: "cancelled", label: "ملغي" }
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
          <DialogTitle>تغيير حالة العقد</DialogTitle>
          <DialogDescription>
            اختر الحالة الجديدة للعقد
          </DialogDescription>
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

