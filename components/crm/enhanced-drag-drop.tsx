"use client";

import React from "react";
import type { Customer, PipelineStage } from "@/types/crm";

interface EnhancedDragDropProps {
  isDragging: boolean;
  draggedCustomer: Customer | null;
  dragOverStage: string | null;
  dragPreview: Customer | null;
  dragOffset: { x: number; y: number };
  onDragStart: (e: any, customer: Customer) => void;
  onDragEnd: (e: any) => void;
  onDragOver: (e: any, stageId: string) => void;
  onDragLeave: (e: any, stageId: string) => void;
  onDrop: (e: any, stageId: string) => void;
  onMouseMove: (e: any) => void;
  onGlobalDragEnd: (e: any) => void;
  onGlobalDragCancel: (e: any) => void;
  onAnnounceToScreenReader: (message: string) => void;
  onShowSuccessAnimation: (stageId: string) => void;
}

export default function EnhancedDragDrop({
  isDragging,
  draggedCustomer,
  dragOverStage,
  dragPreview,
  dragOffset,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onMouseMove,
  onGlobalDragEnd,
  onGlobalDragCancel,
  onAnnounceToScreenReader,
  onShowSuccessAnimation,
}: EnhancedDragDropProps) {
  const handleDragStart = (e: any, customer: Customer) => {
    // Clean up any previous drag state first
    onDragEnd(e);

    // Remove any existing drag visual effects
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    draggableElements.forEach((element) => {
      element.classList.remove("opacity-50", "scale-95", "rotate-2");
    });

    // Set new drag state
    onDragStart(e, customer);

    // Set drag image to be transparent (we'll use our custom preview)
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    // Store the offset from mouse to element
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", customer.id);

    // Add dragging class for visual feedback
    e.currentTarget.classList.add("opacity-50", "scale-95", "rotate-2");

    // Announce drag start for screen readers
    const announcement = `بدء سحب العميل ${customer.name}`;
    onAnnounceToScreenReader(announcement);
  };

  const handleDragEnd = (e: any) => {
    // Remove dragging visual effects
    e.currentTarget.classList.remove("opacity-50", "scale-95", "rotate-2");
    onDragEnd(e);
  };

  const handleDragOver = (e: any, stageId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    // Only set drag over stage if we're actually dragging
    if (dragOverStage !== stageId) {
      onDragOver(e, stageId);
    }
  };

  const handleDragLeave = (e: any, stageId: string) => {
    // Only clear drag over if we're actually leaving the stage area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      onDragLeave(e, stageId);
    }

    // If we're leaving the entire drag area, clean up drag state
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      // Don't immediately clear drag state, but ensure visual effects are removed
      const draggableElements = document.querySelectorAll('[draggable="true"]');
      draggableElements.forEach((element) => {
        if (element !== e.currentTarget) {
          element.classList.remove("opacity-50", "scale-95", "rotate-2");
        }
      });
    }
  };

  const handleDrop = async (e: any, targetStage: string) => {
    e.preventDefault();

    if (draggedCustomer && draggedCustomer.pipelineStage !== targetStage) {
      const sourceStage = draggedCustomer.pipelineStage;
      const targetStageObj = targetStage;

      // Optimistic update - update UI immediately
      onDrop(e, targetStage);

      // Announce successful move for screen readers
      const announcement = `تم نقل العميل ${draggedCustomer.name} بنجاح`;
      onAnnounceToScreenReader(announcement);

      // Show success animation
      onShowSuccessAnimation(targetStage);
    }

    // Always clean up drag state
    onDragEnd(e);

    // Remove dragging visual effects from all draggable elements
    const draggableElements = document.querySelectorAll('[draggable="true"]');
    draggableElements.forEach((element) => {
      element.classList.remove("opacity-50", "scale-95", "rotate-2");
    });
  };

  const handleMouseMove = (e: any) => {
    onMouseMove(e);
  };

  const handleGlobalDragEnd = (e: any) => {
    // Clean up drag state if drag ends anywhere on the page
    if (isDragging) {
      onGlobalDragEnd(e);

      // Remove dragging visual effects from all draggable elements
      const draggableElements = document.querySelectorAll('[draggable="true"]');
      draggableElements.forEach((element) => {
        element.classList.remove("opacity-50", "scale-95", "rotate-2");
      });
    }
  };

  const handleGlobalDragCancel = (e: any) => {
    // Clean up drag state if drag is cancelled
    if (isDragging) {
      onGlobalDragCancel(e);

      // Remove dragging visual effects from all draggable elements
      const draggableElements = document.querySelectorAll('[draggable="true"]');
      draggableElements.forEach((element) => {
        element.classList.remove("opacity-50", "scale-95", "rotate-2");
      });
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleMouseMove,
    handleGlobalDragEnd,
    handleGlobalDragCancel,
  };
}
