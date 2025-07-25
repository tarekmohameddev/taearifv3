"use client"

import React from "react"
import type { Customer, PipelineStage } from "@/types/crm"

interface KeyboardNavigationProps {
  focusedCustomer: Customer | null
  focusedStage: PipelineStage | null
  pipelineStages: PipelineStage[]
  onKeyDown: (e: any, customer: Customer, stageId: string) => void
  onMoveCustomerToStage: (customer: Customer, targetStageId: string) => void
  onSetFocusedCustomer: (customer: Customer | null) => void
  onSetFocusedStage: (stage: PipelineStage | null) => void
  onAnnounceToScreenReader: (message: string) => void
}

export default function KeyboardNavigation({
  focusedCustomer,
  focusedStage,
  pipelineStages,
  onKeyDown,
  onMoveCustomerToStage,
  onSetFocusedCustomer,
  onSetFocusedStage,
  onAnnounceToScreenReader,
}: KeyboardNavigationProps) {
  const handleKeyDown = (e: any, customer: Customer, stageId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSetFocusedCustomer(customer)
      const stage = pipelineStages.find((s: PipelineStage) => s.id === stageId)
      onSetFocusedStage(stage || null)

      // Announce selection for screen readers
      const stageName = stage?.name
      onAnnounceToScreenReader(
        `تم تحديد العميل ${customer.name} في مرحلة ${stageName}. استخدم الأسهم للتنقل بين المراحل واضغط Enter للنقل`,
      )
    }

    if (focusedCustomer && focusedCustomer.id === customer.id) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault()
        const currentIndex = pipelineStages.findIndex((s: PipelineStage) => s.id === focusedStage?.id)
        const direction = e.key === "ArrowRight" ? 1 : -1
        const newIndex = Math.max(0, Math.min(pipelineStages.length - 1, currentIndex + direction))
        const newStage = pipelineStages[newIndex]

        if (newStage) {
          onSetFocusedStage(newStage)
          onAnnounceToScreenReader(`التنقل إلى مرحلة ${newStage.name}`)
        }
      }

      if (e.key === "Enter" && focusedStage?.id !== customer.pipelineStage) {
        e.preventDefault()
        if (focusedStage) {
          onMoveCustomerToStage(customer, focusedStage.id)
        }
      }

      if (e.key === "Escape") {
        e.preventDefault()
        onSetFocusedCustomer(null)
        onSetFocusedStage(null)
        onAnnounceToScreenReader("تم إلغاء التحديد")
      }
    }
  }

  const moveCustomerToStage = (customer: Customer, targetStageId: string) => {
    if (customer.pipelineStage === targetStageId) return

    const sourceStage = pipelineStages.find((s: PipelineStage) => s.id === customer.pipelineStage)
    const targetStage = pipelineStages.find((s: PipelineStage) => s.id === targetStageId)

    // Update customer's pipeline stage in store
    onMoveCustomerToStage(customer, targetStageId)

    // Clear focus
    onSetFocusedCustomer(null)
    onSetFocusedStage(null)

    // Announce successful move
    const announcement = `تم نقل العميل ${customer.name} بنجاح من ${sourceStage?.name} إلى ${targetStage?.name}`
    onAnnounceToScreenReader(announcement)
  }

  return {
    handleKeyDown,
    moveCustomerToStage,
  }
} 