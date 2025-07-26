"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import useCrmStore from "@/context/store/crm";

export default function AddNoteDialog() {
  const {
    showAddNoteDialog,
    selectedCustomer,
    setShowAddNoteDialog,
    updateCustomer,
  } = useCrmStore();

  const [noteContent, setNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setShowAddNoteDialog(false);
    setNoteContent("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !noteContent.trim()) return;

    setIsSubmitting(true);

    try {
      const newNote = {
        id: Date.now(),
        content: noteContent.trim(),
        author: "المستخدم الحالي", // يمكن استبداله بالمستخدم الحالي
        date: new Date().toLocaleDateString("ar-SA"),
        timestamp: new Date().toISOString(),
      };

      // تحديث العميل في الـ store
      const currentNotes = Array.isArray(selectedCustomer.notes)
        ? selectedCustomer.notes
        : [];
      updateCustomer(selectedCustomer.id, {
        notes: [newNote, ...currentNotes] as any,
      });

      // إغلاق الـ dialog وتنظيف النموذج
      handleClose();
    } catch (error) {
      console.error("خطأ في إضافة الملاحظة:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showAddNoteDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            إضافة ملاحظة جديدة
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
            <Label htmlFor="note-content">محتوى الملاحظة</Label>
            <Textarea
              id="note-content"
              placeholder="اكتب ملاحظتك هنا..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={4}
              required
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
              disabled={isSubmitting || !noteContent.trim()}
            >
              {isSubmitting ? "جاري الحفظ..." : "حفظ الملاحظة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
