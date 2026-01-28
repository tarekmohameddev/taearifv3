"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { LIFECYCLE_STAGES } from "@/types/unified-customer";

export function AddCustomerDialog() {
  const { showAddCustomerDialog, setShowAddCustomerDialog } = useUnifiedCustomersStore();

  return (
    <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>إضافة عميل جديد</DialogTitle>
          <DialogDescription>
            أدخل معلومات العميل الأساسية
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input id="name" placeholder="محمد أحمد" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الجوال *</Label>
              <Input id="phone" placeholder="+966512345678" dir="ltr" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="email@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">المصدر</Label>
              <Select defaultValue="manual">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">إدخال يدوي</SelectItem>
                  <SelectItem value="inquiry">استفسار موقع</SelectItem>
                  <SelectItem value="whatsapp">واتساب</SelectItem>
                  <SelectItem value="referral">إحالة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">المرحلة</Label>
              <Select defaultValue="new_lead">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIFECYCLE_STAGES.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">الأولوية</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">عاجل</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">منخفض</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="أي معلومات إضافية عن العميل..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddCustomerDialog(false)}
          >
            إلغاء
          </Button>
          <Button onClick={() => setShowAddCustomerDialog(false)}>
            إضافة العميل
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
