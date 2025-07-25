"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Phone, Calendar, Check, CheckCircle, Clock, Star, Award, User, Shield, Handshake, TrendingUp } from "lucide-react"
import type { PipelineStage, Customer } from "@/types/crm"
import CustomerCard from "./customer-card"
// Helper function to get icon component
const getStageIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    'Target': Target,
    'Users': Users,
    'Phone': Phone,
    'Calendar': Calendar,
    'Check': Check,
    'Clock': Clock,
    'Star': Star,
    'Award': Award,
    'User': User,
    'Shield': Shield,
    'Handshake': Handshake,
    'TrendingUp': TrendingUp,
    'fa fa-user': User,
    'fa fa-users': Users,
    'fa fa-phone': Phone,
    'fa fa-calendar': Calendar,
    'fa fa-check': Check,
    'fa fa-clock': Clock,
    'fa fa-star': Star,
    'fa fa-trophy': Award,
    'fa fa-user-shield': Shield,
    'fa fa-check-circle': CheckCircle,
    'fa fa-handshake': Handshake,
    'fa fa-chart-line': TrendingUp
  }
  
  return iconMap[iconName] || Target
}

interface PipelineStageProps {
  stage: PipelineStage
  customers: Customer[]
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
  viewType: "mobile" | "tablet" | "desktop"
}

export default function PipelineStage({
  stage,
  customers,
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
  viewType,
}: PipelineStageProps) {
  const stageCustomers = customers.filter((customer: any) => String(customer.pipelineStage) === String(stage.id))
  const filteredStageCustomers = filteredCustomers.filter((c) => c.pipelineStage === stage.id)

  const renderMobileView = () => (
    <Card
      data-stage-id={stage.id}
      className={`transition-all duration-300 ${
        dragOverStage === stage.id
          ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 shadow-lg"
          : ""
      } ${
        isDragging && draggedCustomer?.pipelineStage !== stage.id
          ? "ring-1 ring-dashed ring-gray-300"
          : ""
      }`}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => onDragOver(e, stage.id)}
      onDragLeave={(e) => onDragLeave(e, stage.id)}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${stage.color} transition-all duration-300 ${
                dragOverStage === stage.id ? "animate-pulse scale-125" : ""
              }`}
            />
            {React.createElement(getStageIcon(stage.icon || 'Target'), {
              className: `h-5 w-5 transition-all duration-300 ${
                dragOverStage === stage.id ? "text-blue-600 scale-110" : ""
              }`
            })}
            <span
              className={`transition-all duration-300 ${
                dragOverStage === stage.id ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {stage.name}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`transition-all duration-300 ${
              dragOverStage === stage.id ? "bg-blue-100 text-blue-800" : ""
            }`}
          >
            {filteredStageCustomers.length}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{stage.description}</p>
        {dragOverStage === stage.id && (
          <div className="text-sm text-blue-600 font-medium animate-bounce">
            إفلات هنا لنقل العميل
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {stageCustomers.map((customer: any) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            stage={stage}
            isDragging={draggedCustomer?.id === customer.id}
            isFocused={focusedCustomer?.id === customer.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onKeyDown={onKeyDown}
            onViewDetails={onViewDetails}
            onAddNote={onAddNote}
            onAddReminder={onAddReminder}
            onAddInteraction={onAddInteraction}
            viewType="mobile"
          />
        ))}
        {filteredStageCustomers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-sm">لا توجد عملاء في هذه المرحلة</div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderTabletView = () => (
    <>
    <Card
      data-stage-id={stage.id}
      className={`flex flex-col transition-all duration-300 ${
        dragOverStage === stage.id
          ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 scale-[1.02] shadow-lg"
          : ""
      } ${
        isDragging && draggedCustomer?.pipelineStage !== stage.id
          ? "ring-1 ring-dashed ring-gray-300"
          : ""
      }`}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => onDragOver(e, stage.id)}
      onDragLeave={(e) => onDragLeave(e, stage.id)}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${stage.color} transition-all duration-300 ${
                dragOverStage === stage.id ? "animate-pulse scale-125" : ""
              }`}
            />
            {React.createElement(getStageIcon(stage.icon || 'Target'), {
              className: `h-4 w-4 transition-all duration-300 ${
                dragOverStage === stage.id ? "text-blue-600 scale-110" : ""
              }`
            })}
            <span
              className={`transition-all duration-300 truncate ${
                dragOverStage === stage.id ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {stage.name}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`transition-all duration-300 flex-shrink-0 ${
              dragOverStage === stage.id ? "bg-blue-100 text-blue-800" : ""
            }`}
          >
            {filteredStageCustomers.length}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2">{stage.description}</p>
        {dragOverStage === stage.id && (
          <div className="text-xs text-blue-600 font-medium animate-bounce">
            إفلات هنا لنقل العميل
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-0 overflow-y-auto">
        {stageCustomers.map((customer: any) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            stage={stage}
            isDragging={draggedCustomer?.id === customer.id}
            isFocused={focusedCustomer?.id === customer.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onKeyDown={onKeyDown}
            onViewDetails={onViewDetails}
            onAddNote={onAddNote}
            onAddReminder={onAddReminder}
            onAddInteraction={onAddInteraction}
            viewType="tablet"
          />
        ))}
        {filteredStageCustomers.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-xs">لا توجد عملاء</div>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )

  const renderDesktopView = () => (
    <>
    <Card
      data-stage-id={stage.id}
      className={`flex flex-col transition-all duration-300 ${
        dragOverStage === stage.id
          ? "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 scale-105 shadow-lg"
          : ""
      } ${
        isDragging && draggedCustomer?.pipelineStage !== stage.id
          ? "ring-1 ring-dashed ring-gray-300"
          : ""
      }`}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => onDragOver(e, stage.id)}
      onDragLeave={(e) => onDragLeave(e, stage.id)}
      onDrop={(e) => onDrop(e, stage.id)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${stage.color} transition-all duration-300 ${
                dragOverStage === stage.id ? "animate-pulse scale-125" : ""
              }`}
            />
            {React.createElement(getStageIcon(stage.icon || 'Target'), {
              className: `h-4 w-4 transition-all duration-300 ${
                dragOverStage === stage.id ? "text-blue-600 scale-110" : ""
              }`
            })}
            <span
              className={`transition-all duration-300 ${
                dragOverStage === stage.id ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {stage.name}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`transition-all duration-300 ${
              dragOverStage === stage.id ? "bg-blue-100 text-blue-800" : ""
            }`}
          >
            {filteredStageCustomers.length}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{stage.description}</p>
        {dragOverStage === stage.id && (
          <div className="text-xs text-blue-600 font-medium animate-bounce">
            إفلات هنا لنقل العميل
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 space-y-3 pt-0">
        {stageCustomers.map((customer: any) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            stage={stage}
            isDragging={draggedCustomer?.id === customer.id}
            isFocused={focusedCustomer?.id === customer.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onKeyDown={onKeyDown}
            onViewDetails={onViewDetails}
            onAddNote={onAddNote}
            onAddReminder={onAddReminder}
            onAddInteraction={onAddInteraction}
            viewType="desktop"
          />
        ))}
      </CardContent>
    </Card>
    </>
  )

  switch (viewType) {
    case "mobile":
      return renderMobileView()
    case "tablet":
      return renderTabletView()
    case "desktop":
      return renderDesktopView()
    default:
      return renderDesktopView()
  }
} 