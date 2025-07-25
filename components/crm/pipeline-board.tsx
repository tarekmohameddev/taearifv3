"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"
import type { Customer, PipelineStage as PipelineStageType } from "@/types/crm"
import PipelineStage from "./pipeline-stage"

interface PipelineBoardProps {
  pipelineStages: PipelineStageType[]
  customersData: Customer[]
  filteredCustomers: Customer[]
  isDragging: boolean
  draggedCustomer: Customer | null
  dragOverStage: string | null
  focusedCustomer: Customer | null
  onDragStart: (e: any, customer: Customer) => void
  onDragEnd: (e: any) => void
  onDragOver: (e: any, stageId: string) => void
  onDragLeave: (e: any, stageId: string) => void
  onDrop: (e: any, stageId: string) => void
  onKeyDown: (e: any, customer: Customer, stageId: string) => void
  onViewDetails: (customer: Customer) => void
  onAddNote: (customer: Customer) => void
  onAddReminder: (customer: Customer) => void
  onAddInteraction: (customer: Customer) => void
}

export default function PipelineBoard({
  pipelineStages,
  customersData,
  filteredCustomers,
  isDragging,
  draggedCustomer,
  dragOverStage,
  focusedCustomer,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onKeyDown,
  onViewDetails,
  onAddNote,
  onAddReminder,
  onAddInteraction,
}: PipelineBoardProps) {
  return (
    <div className="space-y-4">
      {/* Mobile View - Stacked Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4">
        </div>
      </div>

      {/* Tablet View - 2 Columns */}
      <div className="hidden lg:block xl:hidden">
        <div className="grid grid-cols-2 gap-4 min-h-[600px]">
          {pipelineStages.map((stage) => (
            <PipelineStage
              key={stage.id}
              stage={stage}
              customers={customersData}
              filteredCustomers={filteredCustomers}
              isDragging={isDragging}
              draggedCustomer={draggedCustomer}
              dragOverStage={dragOverStage}
              focusedCustomer={focusedCustomer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={onKeyDown}
              onViewDetails={onViewDetails}
              onAddNote={onAddNote}
              onAddReminder={onAddReminder}
              onAddInteraction={onAddInteraction}
              viewType="tablet"
            />
          ))}
        </div>
      </div>

      {/* Desktop View - Full Grid */}
      <div className="hidden xl:block">
        <div
          className={`grid gap-4 min-h-[600px] ${
            pipelineStages.length <= 3
              ? "grid-cols-3"
              : pipelineStages.length <= 4
                ? "grid-cols-4"
                : pipelineStages.length <= 6
                  ? "grid-cols-6"
                  : "grid-cols-6"
          }`}
        >
          {pipelineStages.map((stage) => (
            <PipelineStage
              key={stage.id}
              stage={stage}
              customers={customersData}
              filteredCustomers={filteredCustomers}
              isDragging={isDragging}
              draggedCustomer={draggedCustomer}
              dragOverStage={dragOverStage}
              focusedCustomer={focusedCustomer}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onKeyDown={onKeyDown}
              onViewDetails={onViewDetails}
              onAddNote={onAddNote}
              onAddReminder={onAddReminder}
              onAddInteraction={onAddInteraction}
              viewType="desktop"
            />
          ))}
        </div>
      </div>

      {/* Keyboard Navigation Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Target className="h-4 w-4" />
            <span className="font-medium">إرشادات التنقل بلوحة المفاتيح:</span>
          </div>
          <div className="mt-2 text-sm text-blue-700 space-y-1">
            <div>
              • اضغط <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> أو{" "}
              <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Space</kbd> لتحديد عميل
            </div>
            <div>
              • استخدم <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">←</kbd> و{" "}
              <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">→</kbd> للتنقل بين المراحل
            </div>
            <div>
              • اضغط <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> لنقل العميل إلى
              المرحلة المحددة
            </div>
            <div>
              • اضغط <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Esc</kbd> لإلغاء التحديد
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 