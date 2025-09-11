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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity } from "lucide-react";
import useCrmStore from "@/context/store/crm";

const interactionTypes = [
  "مكالمة هاتفية",
  "رسالة واتساب",
  "بريد إلكتروني",
  "لقاء شخصي",
  "عرض تقديم",
  "متابعة",
  "أخرى",
];

export default function AddInteractionDialog() {
  const {
    showAddInteractionDialog,
    selectedCustomer,
    setShowAddInteractionDialog,
    updateCustomer,
  } = useCrmStore();

  const [interactionData, setInteractionData] = useState({
    type: "",
    notes: "",
    duration: "",
    agent: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setShowAddInteractionDialog(false);
    setInteractionData({
      type: "",
      notes: "",
      duration: "",
      agent: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setInteractionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedCustomer ||
      !interactionData.type ||
      !interactionData.notes.trim()
    )
      return;

    setIsSubmitting(true);

    try {
      const newInteraction = {
        id: Date.now(),
        type: interactionData.type,
        notes: interactionData.notes.trim(),
        duration: interactionData.duration || "غير محدد",
        agent: interactionData.agent || "المستخدم الحالي",
        date: new Date().toLocaleDateString("ar-US"),
        timestamp: new Date().toISOString(),
      };

      // تحديث العميل في الـ store
      const currentInteractions = Array.isArray(selectedCustomer.interactions)
        ? selectedCustomer.interactions
        : [];
      updateCustomer(selectedCustomer.id, {
        interactions: [newInteraction, ...currentInteractions] as any,
      });

      // إغلاق الـ dialog وتنظيف النموذج
      handleClose();
    } catch (error) {
      console.error("خطأ في إضافة التفاعل:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAddInteractionDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            تسجيل تفاعل جديد
          </DialogTitle>
        </DialogHeader>

        {selectedCustomer && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">العميل:</p>
            <p className="font-medium">{selectedCustomer.name}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interaction-type">نوع التفاعل</Label>
            <Select
              value={interactionData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger id="interaction-type">
                <SelectValue placeholder="اختر نوع التفاعل" />
              </SelectTrigger>
              <SelectContent>
                {interactionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interaction-notes">ملاحظات التفاعل</Label>
            <Textarea
              id="interaction-notes"
              placeholder="تفاصيل التفاعل مع العميل..."
              value={interactionData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="interaction-duration">المدة</Label>
              <Input
                id="interaction-duration"
                placeholder="مثال: 30 دقيقة"
                value={interactionData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interaction-agent">المسؤول</Label>
              <Input
                id="interaction-agent"
                placeholder="اسم المسؤول"
                value={interactionData.agent}
                onChange={(e) => handleInputChange("agent", e.target.value)}
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
                !interactionData.type ||
                !interactionData.notes.trim()
              }
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ التفاعل"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
