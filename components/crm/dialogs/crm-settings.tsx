"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
} from "lucide-react";
import useCrmStore from "@/context/store/crm";
import axiosInstance from "@/lib/axiosInstance";

interface CrmSettingsDialogProps {
  onStageDeleted?: (stageId: string) => void;
}

export default function CrmSettingsDialog({
  onStageDeleted,
}: CrmSettingsDialogProps) {
  const {
    showCrmSettingsDialog,
    pipelineStages,
    setShowCrmSettingsDialog,
    setShowAddStageDialog,
    setShowEditStageDialog,
    setSelectedStage,
  } = useCrmStore();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setShowCrmSettingsDialog(false);
  };

  const handleAddStage = () => {
    setShowAddStageDialog(true);
  };

  const handleEditStage = (stage: any) => {
    setSelectedStage(stage);
    setShowEditStageDialog(true);
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه المرحلة؟")) {
      return;
    }

    setIsDeleting(stageId);
    setError(null);

    try {
      const response = await axiosInstance.delete(`/crm/stages/${stageId}`);

      if (response.data.status === "success") {
        // Remove the stage from the list
        if (onStageDeleted) {
          onStageDeleted(stageId);
        }
      } else {
        setError("فشل في حذف المرحلة");
      }
    } catch (err: any) {
      console.error("Error deleting stage:", err);
      setError(err.response?.data?.message || "فشل في حذف المرحلة");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMoveStageUp = (stageId: string) => {
    console.log("نقل المرحلة لأعلى:", stageId);
  };

  const handleMoveStageDown = (stageId: string) => {
    console.log("نقل المرحلة لأسفل:", stageId);
  };

  return (
    <Dialog open={showCrmSettingsDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            إعدادات CRM
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* إدارة مراحل البيع */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>إدارة مراحل البيع</CardTitle>
                <Button onClick={handleAddStage} size="sm">
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة مرحلة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pipelineStages && pipelineStages.length > 0 ? (
                <div className="space-y-3">
                  {pipelineStages.map((stage: any, index: number) => (
                    <div
                      key={stage.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${stage.color}`}
                        />
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {stage.description}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {stage.count || 0} عميل
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveStageUp(stage.id)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveStageDown(stage.id)}
                          disabled={index === pipelineStages.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditStage(stage)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteStage(stage.id)}
                          disabled={isDeleting === stage.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          {isDeleting === stage.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد مراحل مُعرّفة بعد. قم بإضافة المرحلة الأولى.
                </p>
              )}
            </CardContent>
          </Card>

        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose}>إغلاق</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
