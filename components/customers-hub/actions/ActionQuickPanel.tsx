"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  UserPlus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { CustomerAction } from "@/types/unified-customer";

interface ActionQuickPanelProps {
  action: CustomerAction;
  onCall?: () => void;
  onWhatsApp?: () => void;
  onSchedule?: () => void;
  onSnooze?: (duration: string) => void;
  onAssign?: () => void;
  onComplete?: () => void;
  onDismiss?: () => void;
}

export function ActionQuickPanel({
  action,
  onCall,
  onWhatsApp,
  onSchedule,
  onSnooze,
  onAssign,
  onComplete,
  onDismiss,
}: ActionQuickPanelProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        {/* Call */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={onCall}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>اتصال</TooltipContent>
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={onWhatsApp}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>واتساب</TooltipContent>
        </Tooltip>

        {/* Schedule */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={onSchedule}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>جدولة موعد</TooltipContent>
        </Tooltip>

        {/* Snooze Dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <Clock className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>تأجيل</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>تأجيل حتى</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setHours(date.getHours() + 1);
                onSnooze?.(date.toISOString());
              }}
            >
              ساعة واحدة
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setHours(date.getHours() + 4);
                onSnooze?.(date.toISOString());
              }}
            >
              4 ساعات
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                onSnooze?.(date.toISOString());
              }}
            >
              غداً
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                onSnooze?.(date.toISOString());
              }}
            >
              الأسبوع القادم
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Assign */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={onAssign}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>تعيين لموظف</TooltipContent>
        </Tooltip>

        {/* Complete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
              onClick={onComplete}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>تم</TooltipContent>
        </Tooltip>

        {/* Dismiss */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              onClick={onDismiss}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>إلغاء</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
