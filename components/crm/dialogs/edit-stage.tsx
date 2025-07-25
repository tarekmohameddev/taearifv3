"use client"

import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, AlertTriangle } from "lucide-react"
import useCrmStore from "@/context/store/crm"
import axiosInstance from "@/lib/axiosInstance"

interface EditStageDialogProps {
  onStageUpdated?: (stage: any) => void
}

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

export default function EditStageDialog({ onStageUpdated }: EditStageDialogProps) {
  const { 
    showEditStageDialog, 
    selectedStage, 
    setShowEditStageDialog,
    setSelectedStage
  } = useCrmStore()

  const [stageData, setStageData] = useState({
    stage_name: "",
    color: "#3b82f6",
    icon: "fa fa-user",
    order: 1,
    description: "",
    is_active: true
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill form when stage is selected
  useEffect(() => {
    if (selectedStage) {
      setStageData({
        stage_name: selectedStage.name || "",
        color: selectedStage.color || "#3b82f6",
        icon: selectedStage.icon || "fa fa-user",
        order: selectedStage.order || 1,
        description: selectedStage.description || "",
        is_active: selectedStage.is_active !== false
      })
    }
  }, [selectedStage])

  const handleClose = () => {
    setShowEditStageDialog(false)
    setTimeout(() => setSelectedStage(null), 150)
    setStageData({
      stage_name: "",
      color: "#3b82f6",
      icon: "fa fa-user",
      order: 1,
      description: "",
      is_active: true
    })
    setError(null)
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setStageData(prev => ({
      ...prev,
      [field]: value
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stageData.stage_name.trim() || !selectedStage) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axiosInstance.put(`/crm/stages/${selectedStage.id}`, stageData)
      
      if (response.data.status === "success") {
        // Update the stage in the store
        const updatedStage = {
          ...selectedStage,
          name: stageData.stage_name.trim(),
          color: stageData.color,
          icon: stageData.icon,
          order: stageData.order,
          description: stageData.description.trim(),
          is_active: stageData.is_active
        }
        
        // Update the stages list in the parent component
        if (onStageUpdated) {
          onStageUpdated(updatedStage)
        }
        
        handleClose()
      } else {
        setError("فشل في تحديث المرحلة")
      }
    } catch (err: any) {
      console.error("Error updating stage:", err)
      setError(err.response?.data?.message || "فشل في تحديث المرحلة")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedStage) return null

  return (
    <Dialog open={showEditStageDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            تعديل المرحلة
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">المرحلة الحالية:</p>
          <p className="font-medium">{selectedStage.name}</p>
        </div>

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
              value={stageData.stage_name}
              onChange={(e) => handleInputChange("stage_name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-description">وصف المرحلة</Label>
            <Textarea
              id="stage-description"
              placeholder="وصف مختصر للمرحلة..."
              value={stageData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage-color">لون المرحلة</Label>
            <Select value={stageData.color} onValueChange={(value) => handleInputChange("color", value)}>
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
            <Select value={stageData.icon} onValueChange={(value) => handleInputChange("icon", value)}>
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

          <div className="space-y-2">
            <Label htmlFor="stage-order">ترتيب المرحلة</Label>
            <Input
              id="stage-order"
              type="number"
              min="1"
              placeholder="1"
              value={stageData.order}
              onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="stage-active"
              checked={stageData.is_active}
              onCheckedChange={(checked) => handleInputChange("is_active", checked)}
            />
            <Label htmlFor="stage-active">مرحلة نشطة</Label>
          </div>

          {/* معاينة المرحلة */}
          <div className="p-3 bg-muted rounded-lg">
            <Label className="text-sm text-muted-foreground">معاينة:</Label>
            <div className="flex items-center gap-2 mt-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: stageData.color }}
              />
              <i className={stageData.icon}></i>
              <span className="font-medium">{stageData.stage_name || "اسم المرحلة"}</span>
              {!stageData.is_active && (
                <span className="text-xs text-muted-foreground">(غير نشطة)</span>
              )}
            </div>
            {stageData.description && (
              <p className="text-sm text-muted-foreground mt-1">{stageData.description}</p>
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
              disabled={!stageData.stage_name.trim() || isSubmitting}
            >
              {isSubmitting ? "جاري التحديث..." : "تحديث المرحلة"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 