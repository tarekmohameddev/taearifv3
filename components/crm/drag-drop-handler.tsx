"use client"

import React, { useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Customer } from "@/types/crm"

interface DragDropHandlerProps {
  isDragging: boolean
  draggedCustomer: Customer | null
  dragPreview: Customer | null
  dragOffset: { x: number; y: number }
  onMouseMove: (e: any) => void
  onGlobalDragEnd: (e: any) => void
  onGlobalDragCancel: (e: any) => void
}

export default function DragDropHandler({
  isDragging,
  draggedCustomer,
  dragPreview,
  dragOffset,
  onMouseMove,
  onGlobalDragEnd,
  onGlobalDragCancel,
}: DragDropHandlerProps) {
  const dragPreviewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("dragend", onGlobalDragEnd)
      document.addEventListener("dragcancel", onGlobalDragCancel)
      return () => {
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("dragend", onGlobalDragEnd)
        document.removeEventListener("dragcancel", onGlobalDragCancel)
      }
    }
  }, [isDragging, onMouseMove, onGlobalDragEnd, onGlobalDragCancel])

  if (!isDragging || !dragPreview) {
    return null
  }

  return (
    <div
      ref={dragPreviewRef}
      className="fixed z-50 pointer-events-none opacity-80 transform rotate-3 scale-105"
      style={{ left: 0, top: 0 }}
    >
      <Card className="p-3 shadow-2xl border-2 border-blue-500 bg-white">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={dragPreview.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {dragPreview.name
                .split(" ")
                .slice(0, 2)
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-sm">{dragPreview.name}</div>
            <div className="text-xs text-muted-foreground">{dragPreview.customerType}</div>
          </div>
        </div>
      </Card>
    </div>
  )
} 