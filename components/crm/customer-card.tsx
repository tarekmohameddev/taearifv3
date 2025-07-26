"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  StickyNote,
  Bell,
  Activity,
  Phone,
  MessageSquare,
  GripVertical,
  MapPin,
} from "lucide-react";
import { Customer, PipelineStage, Reminder } from "@/types/crm";

interface CustomerCardProps {
  customer: Customer;
  stage: PipelineStage;
  isDragging?: boolean;
  isFocused?: boolean;
  onDragStart: (e: any, customer: Customer) => void;
  onDragEnd: (e: any) => void;
  onKeyDown: (e: any, customer: Customer, stageId: string) => void;
  onViewDetails: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onAddReminder: (customer: Customer) => void;
  onAddInteraction: (customer: Customer) => void;
  viewType: "mobile" | "tablet" | "desktop";
}

export default function CustomerCard({
  customer,
  stage,
  isDragging = false,
  isFocused = false,
  onDragStart,
  onDragEnd,
  onKeyDown,
  onViewDetails,
  onAddNote,
  onAddReminder,
  onAddInteraction,
  viewType,
}: CustomerCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "border-red-500 text-red-700";
      case "متوسطة":
        return "border-yellow-500 text-yellow-700";
      case "منخفضة":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-500 text-gray-700";
    }
  };

  const renderMobileView = () => (
    <Card
      className={`p-4 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-1" : "hover:scale-[1.02]"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onDragStart={(e) => onDragStart(e, customer)}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">
                {customer.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {customer.customerType}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNote(customer)}>
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddReminder(customer)}>
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddInteraction(customer)}>
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="ml-2 h-4 w-4" />
                واتساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            {/* Deal value and probability can be added here */}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{customer.city}</span>
            </div>
          </div>
        </div>

        {customer.probability > 0 && (
          <Progress value={customer.probability} className="h-2" />
        )}

        <div className="flex items-center justify-between flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${getPriorityColor(customer.urgency)}`}
          >
            {customer.urgency}
          </Badge>
          {customer.reminders && customer.reminders.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Bell className="h-3 w-3" />
              <span>
                {
                  customer.reminders.filter(
                    (r: Reminder) => r.status !== "completed",
                  ).length
                }
              </span>
            </div>
          )}
          <div className="text-xs text-muted-foreground truncate flex-1 text-left">
            {customer.assignedAgent}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTabletView = () => (
    <Card
      className={`p-3 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-1" : "hover:scale-[1.02]"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onDragStart={(e) => onDragStart(e, customer)}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">
                {customer.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {customer.customerType}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNote(customer)}>
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddReminder(customer)}>
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddInteraction(customer)}>
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="ml-2 h-4 w-4" />
                واتساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          {customer.probability > 0 && (
            <Progress value={customer.probability} className="h-1" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{customer.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`text-xs ${getPriorityColor(customer.urgency)}`}
          >
            {customer.urgency}
          </Badge>
          {customer.reminders && customer.reminders.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Bell className="h-3 w-3" />
              <span>
                {
                  customer.reminders.filter(
                    (r: Reminder) => r.status !== "completed",
                  ).length
                }
              </span>
            </div>
          )}
          <div className="text-xs text-muted-foreground truncate max-w-[80px]">
            {customer.assignedAgent}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderDesktopView = () => (
    <Card
      className={`p-3 cursor-move hover:shadow-md transition-all duration-300 border-l-4 ${
        isFocused ? "ring-2 ring-blue-500 bg-blue-50" : ""
      } ${isDragging ? "opacity-50 scale-95 rotate-2" : "hover:scale-102"}`}
      style={{ borderLeftColor: stage.color?.replace("bg-", "#") }}
      draggable
      onDragStart={(e) => onDragStart(e, customer)}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`العميل ${customer.name} في مرحلة ${stage.name}. اضغط Enter للتحديد أو اسحب لنقل العميل`}
      onKeyDown={(e) => onKeyDown(e, customer, stage.id)}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div>
              <div className="font-medium text-sm">{customer.name}</div>
              <div className="text-xs text-muted-foreground">
                {customer.customerType}
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                <Eye className="ml-2 h-4 w-4" />
                عرض التفاصيل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddNote(customer)}>
                <StickyNote className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddReminder(customer)}>
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddInteraction(customer)}>
                <Activity className="ml-2 h-4 w-4" />
                تسجيل تفاعل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="ml-2 h-4 w-4" />
                واتساب
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          {customer.probability > 0 && (
            <Progress value={customer.probability} className="h-1" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{customer.city}</span>
          </div>
        </div>

        {customer.reminders && customer.reminders.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-orange-600">
            <Bell className="h-3 w-3" />
            <span>
              {
                customer.reminders.filter(
                  (r: Reminder) => r.status !== "completed",
                ).length
              }{" "}
              تذكير
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={getPriorityColor(customer.urgency)}
          >
            {customer.urgency}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {customer.assignedAgent}
          </div>
        </div>
      </div>
    </Card>
  );

  switch (viewType) {
    case "mobile":
      return renderMobileView();
    case "tablet":
      return renderTabletView();
    case "desktop":
      return renderDesktopView();
    default:
      return renderDesktopView();
  }
}
