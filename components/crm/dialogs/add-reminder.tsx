"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Calendar, Clock, AlertTriangle } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";

interface AddReminderDialogProps {
  onReminderAdded?: (reminder: any) => void;
}

export default function AddReminderDialog({
  onReminderAdded,
}: AddReminderDialogProps) {
  const {
    showAddReminderDialog,
    selectedCustomer,
    setShowAddReminderDialog,
    customers,
  } = useCrmStore();

  const [reminderData, setReminderData] = useState({
    customer_id: "",
    title: "",
    priority: "2", // 1=low, 2=medium, 3=high
    date: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setShowAddReminderDialog(false);
    setReminderData({
      customer_id: "",
      title: "",
      priority: "2",
      date: "",
      time: "",
    });
    setError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setReminderData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const customerId = selectedCustomer
      ? selectedCustomer.customer_id
      : reminderData.customer_id;
    if (
      !customerId ||
      !reminderData.title.trim() ||
      !reminderData.date ||
      !reminderData.time
    ) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time for API
      const datetime = `${reminderData.date} ${reminderData.time}:00`;

      const response = await axiosInstance.post("/crm/customer-reminders", {
        customer_id: parseInt(customerId),
        title: reminderData.title.trim(),
        priority: parseInt(reminderData.priority),
        datetime: datetime,
      });

      if (response.data.status === "success") {
        // Add the new reminder to the store
        const newReminder = {
          id: response.data.data?.id || Date.now(),
          title: reminderData.title.trim(),
          priority: parseInt(reminderData.priority),
          priority_label:
            reminderData.priority === "3"
              ? "High"
              : reminderData.priority === "2"
                ? "Medium"
                : "Low",
          datetime: datetime,
          customer: selectedCustomer
            ? {
                id: parseInt(selectedCustomer.customer_id),
                name: selectedCustomer.name,
              }
            : customers.find((c) => c.customer_id === reminderData.customer_id)
              ? {
                  id: parseInt(reminderData.customer_id),
                  name: customers.find(
                    (c) => c.customer_id === reminderData.customer_id,
                  )!.name,
                }
              : undefined,
        };

        // Update the reminders list in the parent component
        if (onReminderAdded) {
          onReminderAdded(newReminder);
        }

        handleClose();
      } else {
        setError("فشل في إضافة التذكير");
      }
    } catch (error: any) {
      console.error("خطأ في إضافة التذكير:", error);
      setError(error.response?.data?.message || "حدث خطأ أثناء إضافة التذكير");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAddReminderDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            إضافة تذكير جديد
          </DialogTitle>
        </DialogHeader>

        {selectedCustomer && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">العميل:</p>
            <p className="font-medium">{selectedCustomer.name}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!selectedCustomer && (
            <div className="space-y-2">
              <Label htmlFor="customer-select">العميل</Label>
              <Select
                value={reminderData.customer_id}
                onValueChange={(value) =>
                  handleInputChange("customer_id", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر العميل" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.customer_id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="reminder-title">عنوان التذكير</Label>
            <Input
              id="reminder-title"
              placeholder="مثال: متابعة العميل"
              value={reminderData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder-priority">الأولوية</Label>
            <Select
              value={reminderData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="reminder-date"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                التاريخ
              </Label>
              <Input
                id="reminder-date"
                type="date"
                value={reminderData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reminder-time"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                الوقت
              </Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !reminderData.title.trim() ||
                !reminderData.date ||
                !reminderData.time
              }
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التذكير"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
