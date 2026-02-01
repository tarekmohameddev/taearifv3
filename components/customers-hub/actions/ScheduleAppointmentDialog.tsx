"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import type { Appointment, Priority } from "@/types/unified-customer";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Calendar } from "lucide-react";

const APPOINTMENT_TYPES: { value: Appointment["type"]; label: string }[] = [
  { value: "site_visit", label: "معاينة عقار" },
  { value: "office_meeting", label: "اجتماع مكتب" },
  { value: "phone_call", label: "مكالمة هاتفية" },
  { value: "video_call", label: "مكالمة فيديو" },
  { value: "contract_signing", label: "توقيع عقد" },
  { value: "other", label: "أخرى" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "urgent", label: "عاجل" },
  { value: "high", label: "مهم" },
  { value: "medium", label: "متوسط" },
  { value: "low", label: "منخفض" },
];

interface ScheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
  customerName: string;
  onScheduled?: (customerId: string) => void;
}

export function ScheduleAppointmentDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
  onScheduled,
}: ScheduleAppointmentDialogProps) {
  const { addAppointment } = useUnifiedCustomersStore();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Appointment["type"]>("office_meeting");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTitle("");
    setType("office_meeting");
    setDate(tomorrow.toISOString().slice(0, 10));
    setTime("10:00");
    setDuration(30);
    setLocation("");
    setNotes("");
    setPriority("medium");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    setIsSubmitting(true);
    const now = new Date().toISOString();
    const datetime = new Date(`${date}T${time}`).toISOString();
    const appointment: Appointment = {
      id: `apt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title: title.trim() || (APPOINTMENT_TYPES.find((t) => t.value === type)?.label ?? "موعد"),
      type,
      date: datetime,
      time,
      datetime,
      duration,
      location: location.trim() || undefined,
      status: "scheduled",
      priority,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    addAppointment(customerId, appointment);
    setIsSubmitting(false);
    handleOpenChange(false);
    onScheduled?.(customerId);
  };

  // Set default date/time when opening
  React.useEffect(() => {
    if (open && !date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDate(tomorrow.toISOString().slice(0, 10));
      setTime("10:00");
    }
  }, [open, date]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            جدولة موعد — {customerName}
          </DialogTitle>
          <DialogDescription>
            حدد تفاصيل الموعد للعميل. يمكنك مراجعته لاحقاً من صفحة العميل.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-type">نوع الموعد</Label>
              <Select value={type} onValueChange={(v) => setType(v as Appointment["type"])}>
                <SelectTrigger id="apt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-priority">الأولوية</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger id="apt-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apt-title">عنوان (اختياري)</Label>
            <Input
              id="apt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: معاينة فيلا الرياض"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-date">التاريخ</Label>
              <Input
                id="apt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-time">الوقت</Label>
              <Input
                id="apt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="apt-duration">المدة (دقيقة)</Label>
              <Select
                value={String(duration)}
                onValueChange={(v) => setDuration(Number(v))}
              >
                <SelectTrigger id="apt-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[15, 30, 45, 60, 90, 120].map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} دقيقة
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apt-location">المكان (اختياري)</Label>
              <Input
                id="apt-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="العنوان أو الرابط"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apt-notes">ملاحظات (اختياري)</Label>
            <Input
              id="apt-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفاصيل إضافية"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "جاري الحفظ..." : "جدولة الموعد"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
