"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceBadge } from "./SourceBadge";
import { ActionQuickPanel } from "./ActionQuickPanel";
import type { CustomerAction } from "@/types/unified-customer";
import { Clock, AlertTriangle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IncomingActionsCardProps {
  action: CustomerAction;
  onComplete?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
  onSnooze?: (actionId: string, until: string) => void;
  className?: string;
}

const priorityColors = {
  urgent: "border-red-500 bg-red-50/50 dark:bg-red-950/30",
  high: "border-orange-500 bg-orange-50/50 dark:bg-orange-950/30",
  medium: "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/30",
  low: "border-green-500 bg-green-50/50 dark:bg-green-950/30",
};

const priorityLabels = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

export function IncomingActionsCard({
  action,
  onComplete,
  onDismiss,
  onSnooze,
  className,
}: IncomingActionsCardProps) {
  const isOverdue =
    action.dueDate && new Date(action.dueDate) < new Date();

  const timeUntilDue = action.dueDate
    ? Math.round(
        (new Date(action.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60)
      )
    : null;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-l-4",
        priorityColors[action.priority],
        isOverdue && "border-red-600",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href={`/ar/dashboard/customers-hub/${action.customerId}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors"
              >
                {action.customerName}
              </Link>
              <SourceBadge source={action.source} />
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  action.priority === "urgent" &&
                    "bg-red-100 text-red-700 border-red-200",
                  action.priority === "high" &&
                    "bg-orange-100 text-orange-700 border-orange-200",
                  action.priority === "medium" &&
                    "bg-yellow-100 text-yellow-700 border-yellow-200",
                  action.priority === "low" &&
                    "bg-green-100 text-green-700 border-green-200"
                )}
              >
                {priorityLabels[action.priority]}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  متأخر
                </Badge>
              )}
            </div>
            <CardTitle className="text-base mb-1">{action.title}</CardTitle>
            {action.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {action.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {action.dueDate && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {timeUntilDue !== null && (
                  <span
                    className={cn(
                      isOverdue && "text-red-600 font-medium",
                      timeUntilDue <= 2 &&
                        !isOverdue &&
                        "text-orange-600 font-medium"
                    )}
                  >
                    {isOverdue
                      ? `متأخر ${Math.abs(timeUntilDue)} ساعة`
                      : timeUntilDue === 0
                      ? "خلال ساعة"
                      : timeUntilDue < 24
                      ? `خلال ${timeUntilDue} ساعة`
                      : `خلال ${Math.round(timeUntilDue / 24)} يوم`}
                  </span>
                )}
              </div>
            )}
            {action.assignedToName && (
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{action.assignedToName}</span>
              </div>
            )}
          </div>

          <ActionQuickPanel
            action={action}
            onCall={() => {
              // TODO: Implement call functionality
              console.log("Call:", action.customerName);
            }}
            onWhatsApp={() => {
              // TODO: Implement WhatsApp functionality
              console.log("WhatsApp:", action.customerName);
            }}
            onSchedule={() => {
              // TODO: Implement schedule functionality
              console.log("Schedule:", action.customerName);
            }}
            onSnooze={(until) => onSnooze?.(action.id, until)}
            onAssign={() => {
              // TODO: Implement assign functionality
              console.log("Assign:", action.customerName);
            }}
            onComplete={() => onComplete?.(action.id)}
            onDismiss={() => onDismiss?.(action.id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
