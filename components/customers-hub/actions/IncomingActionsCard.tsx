"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SourceBadge } from "./SourceBadge";
import { ActionQuickPanel } from "./ActionQuickPanel";
import { ScheduleAppointmentDialog } from "./ScheduleAppointmentDialog";
import type { CustomerAction, UnifiedCustomer } from "@/types/unified-customer";
import { Clock, AlertTriangle, User, GripVertical, StickyNote, Send, Eye, Phone, Building2, MapPin, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PropertyBlock = {
  title?: string;
  type?: string;
  price?: number;
  location?: string;
  /** When true, this is from customer preferences (request summary) not a specific listing */
  fromPreferences?: boolean;
};

/** Minimal property data that may be stored in action.metadata for property requests */
function getPropertyFromMetadata(metadata: Record<string, unknown> | undefined): PropertyBlock | null {
  if (!metadata || typeof metadata !== "object") return null;
  try {
    const title =
      (metadata.propertyTitle as string) ??
      (metadata.property_title as string) ??
      (metadata.title as string);
    const type =
      (metadata.propertyType as string) ??
      (metadata.property_type as string) ??
      (metadata.type as string);
    const price =
      (metadata.propertyPrice as number) ??
      (metadata.property_price as number) ??
      (metadata.price as number);
    const location =
      (metadata.propertyLocation as string) ??
      (metadata.property_location as string) ??
      (metadata.location as string) ??
      (metadata.address as string);
    if (!title && !type && price == null && !location) return null;
    return { title, type, price, location, fromPreferences: false };
  } catch {
    return null;
  }
}

/** Build minimal property/request summary from customer preferences when no metadata property */
function getPropertyFromPreferences(customer: UnifiedCustomer | undefined): PropertyBlock | null {
  if (!customer?.preferences) return null;
  const p = customer.preferences;
  const type =
    p.propertyType?.length
      ? p.propertyType.join("، ")
      : undefined;
  const price =
    p.budgetMin != null || p.budgetMax != null
      ? (p.budgetMin ?? p.budgetMax)!
      : undefined;
  const priceRange =
    p.budgetMin != null && p.budgetMax != null && p.budgetMin !== p.budgetMax
      ? `${(p.budgetMin / 1_000_000).toFixed(1)}–${(p.budgetMax / 1_000_000).toFixed(1)} م.ر`
      : p.budgetMin != null
        ? `${(p.budgetMin / 1_000_000).toFixed(1)} م.ر`
        : undefined;
  const location =
    p.preferredAreas?.length
      ? p.preferredAreas.slice(0, 2).join(" · ")
      : p.preferredCities?.length
        ? p.preferredCities.slice(0, 2).join("، ")
        : undefined;
  if (!type && !priceRange && !location) return null;
  return {
    title: priceRange ?? undefined,
    type,
    price: p.budgetMin ?? p.budgetMax,
    location,
    fromPreferences: true,
  };
}

interface IncomingActionsCardProps {
  action: CustomerAction;
  /** When provided, customer phone (and WhatsApp) are shown on the card for quick contact */
  customer?: UnifiedCustomer;
  onComplete?: (actionId: string) => void;
  onDismiss?: (actionId: string) => void;
  onSnooze?: (actionId: string, until: string) => void;
  onAddNote?: (actionId: string, note: string) => void;
  onQuickView?: (actionId: string) => void;
  isSelected?: boolean;
  onSelect?: (actionId: string, selected: boolean) => void;
  showCheckbox?: boolean;
  isCompact?: boolean;
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
  customer,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  isSelected = false,
  onSelect,
  showCheckbox = true,
  isCompact = false,
  className,
}: IncomingActionsCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const propertyFromMeta = getPropertyFromMetadata(action.metadata);
  const propertyFromPrefs = getPropertyFromPreferences(customer);
  /** Prefer specific property from metadata; fallback to request summary from customer preferences */
  const property = propertyFromMeta ?? propertyFromPrefs;
  const showPropertyBlock = property && (property.title || property.type || property.price != null || property.location);

  const isOverdue =
    action.dueDate && new Date(action.dueDate) < new Date();

  const timeUntilDue = action.dueDate
    ? Math.round(
        (new Date(action.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60)
      )
    : null;

  const handleCardClick = (e: React.MouseEvent) => {
    // Only toggle selection if clicking on the card background, not on interactive elements
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, [role="checkbox"], input, [data-interactive]');
    if (!isInteractive && onSelect && showCheckbox) {
      onSelect(action.id, !isSelected);
    }
  };

  const handleAddNote = () => {
    if (noteText.trim() && onAddNote) {
      onAddNote(action.id, noteText.trim());
      setNoteText("");
      setShowNoteInput(false);
    }
  };

  const existingNotes = action.metadata?.notes || [];

  // Compact view for dense mode
  if (isCompact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 border-r-4 rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-all cursor-pointer",
          priorityColors[action.priority],
          isOverdue && "border-red-600",
          isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
          className
        )}
        onClick={handleCardClick}
      >
        {showCheckbox && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect?.(action.id, checked as boolean)}
            className="h-4 w-4 data-[state=checked]:bg-blue-600"
            data-interactive="true"
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/ar/dashboard/customers-hub/${action.customerId}`}
              className="font-medium text-sm hover:text-blue-600 transition-colors truncate max-w-[150px]"
              data-interactive="true"
            >
              {action.customerName}
            </Link>
            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {customer.phone}
              </a>
            )}
            <span className="text-sm text-gray-600 truncate flex-1">{action.title}</span>
            <SourceBadge source={action.source} className="text-xs" />
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                action.priority === "urgent" && "bg-red-100 text-red-700 border-red-200",
                action.priority === "high" && "bg-orange-100 text-orange-700 border-orange-200"
              )}
            >
              {priorityLabels[action.priority]}
            </Badge>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                متأخر
              </Badge>
            )}
          </div>
          {showPropertyBlock && (
            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
              {property?.title && (
                <span className="flex items-center gap-1 truncate max-w-[100px]">
                  <DollarSign className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  <span className="truncate">{property.title}</span>
                </span>
              )}
              {property?.type && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  {property.type}
                </span>
              )}
              {property?.location && (
                <span className="flex items-center gap-1 truncate max-w-[90px]">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                  <span className="truncate">{property.location}</span>
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onQuickView && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(action.id);
              }}
              data-interactive="true"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 px-2 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.(action.id);
            }}
            data-interactive="true"
          >
            تم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg border-l-4 cursor-pointer group",
        priorityColors[action.priority],
        isOverdue && "border-red-600",
        isSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/30",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          {/* Selection Checkbox */}
          {showCheckbox && (
            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect?.(action.id, checked as boolean)}
                className="h-5 w-5 data-[state=checked]:bg-blue-600"
                data-interactive="true"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href={`/ar/dashboard/customers-hub/${action.customerId}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors"
                data-interactive="true"
              >
                {action.customerName}
              </Link>
              {onQuickView && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView(action.id);
                  }}
                  data-interactive="true"
                >
                  <Eye className="h-4 w-4 text-gray-400 hover:text-blue-600" />
                </Button>
              )}
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
            {/* Customer phone for quick contact */}
            {customer?.phone && (
              <a
                href={`tel:${customer.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 text-sm text-gray-600 hover:text-blue-600 dir-ltr"
                dir="ltr"
                data-interactive="true"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-4 w-4 shrink-0" />
                {customer.phone}
                {customer.whatsapp && customer.whatsapp !== customer.phone && (
                  <span className="text-gray-400"> / واتساب: {customer.whatsapp}</span>
                )}
              </a>
            )}
            {/* Minimal property data: icon-first, simple layout */}
            {showPropertyBlock && property && (
              <div className="mt-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {property.title && (
                    <span className="flex items-center gap-1.5 min-w-0">
                      <DollarSign className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">{property.title}</span>
                    </span>
                  )}
                  {property.type && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 shrink-0 text-gray-500" />
                      <span>{property.type}</span>
                    </span>
                  )}
                  {property.price != null && property.price > 0 && !property.fromPreferences && (
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 shrink-0 text-gray-500" />
                      {property.price.toLocaleString("ar-SA")} ر.س
                    </span>
                  )}
                  {property.location && (
                    <span className="flex items-center gap-1.5 min-w-0 max-w-[220px]">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate">{property.location}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
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
            {/* Quick Note Toggle */}
            {onAddNote && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 gap-1 text-gray-500 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNoteInput(!showNoteInput);
                }}
                data-interactive="true"
              >
                <StickyNote className="h-4 w-4" />
                {existingNotes.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-xs">
                    {existingNotes.length}
                  </Badge>
                )}
              </Button>
            )}
          </div>

          <ActionQuickPanel
            action={action}
            onSchedule={() => setShowScheduleDialog(true)}
            onSnooze={(until) => onSnooze?.(action.id, until)}
            onAssign={() => {
              // TODO: Implement assign functionality
              console.log("Assign:", action.customerName);
            }}
            onComplete={() => onComplete?.(action.id)}
            onDismiss={() => onDismiss?.(action.id)}
          />
        </div>

        <ScheduleAppointmentDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          customerId={action.customerId}
          customerName={action.customerName}
          onScheduled={() => onComplete?.(action.id)}
        />

        {/* Quick Notes Section */}
        {showNoteInput && onAddNote && (
          <div 
            className="border-t pt-3 mt-2"
            onClick={(e) => e.stopPropagation()}
            data-interactive="true"
          >
            {/* Existing Notes */}
            {existingNotes.length > 0 && (
              <div className="mb-2 space-y-1">
                {existingNotes.slice(-3).map((note: { text: string; createdAt: string }, idx: number) => (
                  <div key={idx} className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                    <span>{note.text}</span>
                    <span className="text-gray-400 mr-2">
                      - {new Date(note.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Add Note Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="أضف ملاحظة سريعة..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddNote();
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={handleAddNote}
                disabled={!noteText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
