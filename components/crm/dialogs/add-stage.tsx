"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, AlertTriangle } from "lucide-react"
import useCrmStore from "@/context/store/crm"
import axiosInstance from "@/lib/axiosInstance"

const stageColors = [
  { value: "#3b82f6", label: "أزرق", color: "#3b82f6" },
  { value: "#22c55e", label: "أخضر", color: "#22c55e" },
  { value: "#eab308", label: "أصفر", color: "#eab308" },
  { value: "#ef4444", label: "أحمر", color: "#ef4444" },
  { value: "#a855f7", label: "بنفسجي", color: "#a855f7" },
  { value: "#ec4899", label: "وردي", color: "#ec4899" },
  { value: "#6366f1", label: "نيلي", color: "#6366f1" },
  { value: "#14b8a6", label: "تركوازي", color: "#14b8a6" },
  { value: "#f97316", label: "برتقالي", color: "#f97316" },
  { value: "#84cc16", label: "ليموني", color: "#84cc16" }
]

const stageIcons = [
  { value: "fa fa-user", label: "مستخدم" },
  { value: "fa fa-users", label: "مجموعة مستخدمين" },
  { value: "fa fa-phone", label: "هاتف" },
  { value: "fa fa-calendar", label: "تقويم" },
  { value: "fa fa-check", label: "صح" },
  { value: "fa fa-clock", label: "ساعة" },
  { value: "fa fa-star", label: "نجمة" },
  { value: "fa fa-trophy", label: "كأس" },
  { value: "fa fa-user-shield", label: "مستخدم محمي" },
  { value: "fa fa-check-circle", label: "دائرة صح" },
  { value: "fa fa-handshake", label: "مصافحة" },
  { value: "fa fa-chart-line", label: "رسم بياني" }
]

interface AddStageDialogProps {
  onStageAdded?: (stage: any) => void
}

export default function AddStageDialog({ onStageAdded }: AddStageDialogProps) {
  const { 
    showAddStageDialog, 
    newStage,
    setShowAddStageDialog,
    updateNewStage,
    setNewStage
  } = useCrmStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setShowAddStageDialog(false)
    setNewStage({
      name: "",
      description: "",
      color: "bg-blue-500",
      iconName: "Target"
    })
  }

  const handleInputChange = (field: string, value: string) => {
    updateNewStage({ [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStage.name.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare data for API
      const stageData = {
        stage_name: newStage.name.trim(),
        color: newStage.color,
        icon: newStage.iconName,
        order: 1, // Default order
        description: newStage.description.trim(),
        is_active: true
      }

      const response = await axiosInstance.post("/crm/stages", stageData)
      
      if (response.data.status === "success") {
        // Add the new stage to the store
        const newStageData = {
          id: response.data.data?.id || Date.now().toString(),
          name: stageData.stage_name,
          color: stageData.color,
          icon: stageData.icon,
          count: 0,
          value: 0,
          description: stageData.description,
          order: stageData.order,
          is_active: stageData.is_active
        }
        
        // Update the stages list in the parent component
        if (onStageAdded) {
          onStageAdded(newStageData)
        }
        
        handleClose()
      } else {
        setError("فشل في إضافة المرحلة")
      }
    } catch (err: any) {
      console.error("خطأ في إضافة المرحلة:", err)
      setError(err.response?.data?.message || "فشل في إضافة المرحلة")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={showAddStageDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            إضافة مرحلة جديدة
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stage-name">اسم المرحلة *</Label>
            <Input
              id="stage-name"
              placeholder="مثال: عملاء محتملون"
              value={newStage.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description">وصف المرحلة</Label>
            <Textarea
              id="stage-description"
              placeholder="وصف مختصر للمرحلة..."
              value={newStage.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-color">لون المرحلة</Label>
            <Select value={newStage.color} onValueChange={(value) => handleInputChange("color", value)}>
              <SelectTrigger id="stage-color">
                <SelectValue placeholder="اختر لون المرحلة" />
              </SelectTrigger>
              <SelectContent>
                {stageColors.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color.color }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-icon">أيقونة المرحلة</Label>
            <Select value={newStage.iconName} onValueChange={(value) => handleInputChange("iconName", value)}>
              <SelectTrigger id="stage-icon">
                <SelectValue placeholder="اختر أيقونة المرحلة" />
              </SelectTrigger>
              <SelectContent>
                {stageIcons.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <i className={icon.value}></i>
                      {icon.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* معاينة المرحلة */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">معاينة:</Label>
            <div className="flex items-center gap-2 mt-2">
              <div 
                className={`w-4 h-4 rounded-full ${newStage.color}`}
              />
              <span className="font-medium">{newStage.name || "اسم المرحلة"}</span>
            </div>
            {newStage.description && (
              <p className="text-sm text-muted-foreground mt-1">{newStage.description}</p>
            )}
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
              disabled={!newStage.name.trim() || isSubmitting}
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة المرحلة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 