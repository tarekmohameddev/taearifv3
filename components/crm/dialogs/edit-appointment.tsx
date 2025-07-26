"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Calendar, Clock, AlertTriangle, Edit } from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";

interface EditAppointmentDialogProps {
  onAppointmentUpdated?: (appointment: any) => void;
}

export default function EditAppointmentDialog({
  onAppointmentUpdated,
}: EditAppointmentDialogProps) {
  const {
    showEditAppointmentDialog,
    selectedAppointment,
    setShowEditAppointmentDialog,
    setSelectedAppointment,
  } = useCrmStore();

  const [appointmentData, setAppointmentData] = useState({
    title: "",
    type: "call",
    priority: "2",
    note: "",
    date: "",
    time: "",
    duration: "30",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when appointment is selected
  useEffect(() => {
    if (selectedAppointment) {
      // Parse datetime if it exists
      let date = "";
      let time = "";
      if (selectedAppointment.datetime) {
        const dateObj = new Date(selectedAppointment.datetime);
        date = dateObj.toISOString().split("T")[0];
        time = dateObj.toTimeString().split(" ")[0].substring(0, 5);
      }

      setAppointmentData({
        title: selectedAppointment.title || "",
        type: selectedAppointment.type || "call",
        priority: selectedAppointment.priority || "2",
        note: selectedAppointment.notes || "",
        date: date,
        time: time,
        duration: selectedAppointment.duration?.toString() || "30",
      });
    }
  }, [selectedAppointment]);

  const handleClose = () => {
    setShowEditAppointmentDialog(false);
    setTimeout(() => setSelectedAppointment(null), 150);
    setAppointmentData({
      title: "",
      type: "call",
      priority: "2",
      note: "",
      date: "",
      time: "",
      duration: "30",
    });
    setError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setAppointmentData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedAppointment ||
      !appointmentData.title.trim() ||
      !appointmentData.date ||
      !appointmentData.time
    ) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Combine date and time for API
      const datetime = `${appointmentData.date} ${appointmentData.time}:00`;

      const response = await axiosInstance.put(
        `/crm/customer-appointments/${selectedAppointment.id}`,
        {
          title: appointmentData.title.trim(),
          type: appointmentData.type,
          priority: parseInt(appointmentData.priority),
          note: appointmentData.note.trim(),
          datetime: datetime,
          duration: parseInt(appointmentData.duration),
        },
      );

      if (response.data.status === "success") {
        // Update the appointment in the store
        const updatedAppointment = {
          ...selectedAppointment,
          title: appointmentData.title.trim(),
          type: appointmentData.type,
          priority: appointmentData.priority,
          priority_label:
            appointmentData.priority === "3"
              ? "High"
              : appointmentData.priority === "2"
                ? "Medium"
                : "Low",
          note: appointmentData.note.trim(),
          datetime: datetime,
          duration: parseInt(appointmentData.duration),
        };

        // Update the appointments list in the parent component
        if (onAppointmentUpdated) {
          onAppointmentUpdated(updatedAppointment);
        }

        handleClose();
      } else {
        setError("فشل في تحديث الموعد");
      }
    } catch (error: any) {
      console.error("خطأ في تحديث الموعد:", error);
      setError(error.response?.data?.message || "حدث خطأ أثناء تحديث الموعد");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedAppointment) return null;

  return (
    <Dialog open={showEditAppointmentDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تعديل الموعد
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">الموعد الحالي:</p>
          <p className="font-medium">{selectedAppointment.title}</p>
          {selectedAppointment.customer && (
            <p className="text-sm text-muted-foreground">
              العميل: {selectedAppointment.customer.name}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appointment-title">عنوان الموعد</Label>
            <Input
              id="appointment-title"
              placeholder="مثال: استشارة عقارية"
              value={appointmentData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-type">نوع الموعد</Label>
              <Select
                value={appointmentData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">مكالمة</SelectItem>
                  <SelectItem value="meeting">اجتماع</SelectItem>
                  <SelectItem value="visit">زيارة</SelectItem>
                  <SelectItem value="consultation">استشارة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-priority">الأولوية</Label>
              <Select
                value={appointmentData.priority}
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="appointment-date"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                التاريخ
              </Label>
              <Input
                id="appointment-date"
                type="date"
                value={appointmentData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="appointment-time"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                الوقت
              </Label>
              <Input
                id="appointment-time"
                type="time"
                value={appointmentData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointment-duration">المدة (دقيقة)</Label>
              <Select
                value={appointmentData.duration}
                onValueChange={(value) => handleInputChange("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="المدة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="45">45 دقيقة</SelectItem>
                  <SelectItem value="60">ساعة</SelectItem>
                  <SelectItem value="90">ساعة ونصف</SelectItem>
                  <SelectItem value="120">ساعتان</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment-note">ملاحظات (اختياري)</Label>
            <Textarea
              id="appointment-note"
              placeholder="ملاحظات حول الموعد..."
              value={appointmentData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              rows={3}
            />
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
              disabled={isSubmitting || !appointmentData.title.trim()}
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث الموعد"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
