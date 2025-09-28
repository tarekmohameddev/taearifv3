"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface ResetConfirmDialogProps {
  componentType: string;
  componentName: string;
  onConfirmReset: () => void;
  className?: string;
}

export function ResetConfirmDialog({
  componentType,
  componentName,
  onConfirmReset,
  className = "",
}: ResetConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirmReset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:from-red-100 hover:to-orange-100 hover:border-red-300 transition-all duration-200 text-red-700 hover:text-red-800 ${className}`}
        >
          <RotateCcw className="w-4 h-4" />
          <span className="font-medium">Reset</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-700">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            Reset Component Warning
          </DialogTitle>
          <div className="text-gray-700 leading-relaxed pt-2">
            <div className="space-y-3">
              <div className="font-semibold text-red-600">
                ⚠️ This action cannot be undone!
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm">
                  You are about to reset the <strong>"{componentName}"</strong>{" "}
                  {componentType} component.
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>This will permanently remove:</strong>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-2 text-gray-600">
                  <li>All custom text content and titles</li>
                  <li>All color and styling modifications</li>
                  <li>All layout and display settings</li>
                  <li>All theme selections and customizations</li>
                  <li>
                    Any other configuration changes made to this component
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm text-blue-800">
                  <strong>
                    The component will be restored to its original default state
                  </strong>{" "}
                  as if it was just added to the page.
                </div>
              </div>

              <div className="text-sm font-medium text-gray-800">
                Are you absolutely sure you want to proceed with this reset?
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Yes, Reset Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
