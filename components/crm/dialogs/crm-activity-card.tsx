"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Briefcase,
  Building,
  Calendar as CalendarIcon,
  ListChecks,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "@/lib/axiosInstance";

// Helper function to detect text direction
const getTextDirection = (text: string): 'rtl' | 'ltr' => {
  if (!text || text.length === 0) return 'rtl'; // Default to RTL for empty text
  
  const firstChar = text.trim()[0];
  
  // Check if first character is Latin (English, numbers, symbols)
  const latinRegex = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  
  return latinRegex.test(firstChar) ? 'ltr' : 'rtl';
};

// Interfaces for the data structures
export interface CrmCard {
  id: number;
  user_id?: number;
  card_customer_id?: number;
  card_content: string;
  card_procedure: string;
  card_project: number | null;
  card_property: number | null;
  card_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Project {
  id: number;
  contents: { title: string }[];
}

export interface Property {
  id: number;
  title: string;
}

interface CrmActivityCardProps {
  card: CrmCard;
  projects: Project[];
  properties: Property[];
  onCardUpdate?: (updatedCard: CrmCard) => void;
}

const procedureOptions = [
  { value: "appointment", label: "مواعيد" },
  { value: "note", label: "ملاحظات" },
  { value: "reminder", label: "تذكيرات" },
  { value: "interaction", label: "تفاعلات" },
];

export function CrmActivityCard({
  card,
  projects,
  properties,
  onCardUpdate,
}: CrmActivityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    card.card_date ? new Date(card.card_date) : undefined
  );
  const [procedure, setProcedure] = useState(card.card_procedure);
  const [project, setProject] = useState(card.card_project?.toString());
  const [property, setProperty] = useState(card.card_property?.toString());
  const [content, setContent] = useState(card.card_content);

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    date: card.card_date ? new Date(card.card_date) : undefined,
    procedure: card.card_procedure,
    project: card.card_project?.toString(),
    property: card.card_property?.toString(),
    content: card.card_content,
  });

  // Check if any values have changed
  const hasChanges = 
    content !== originalValues.content ||
    procedure !== originalValues.procedure ||
    project !== originalValues.project ||
    property !== originalValues.property ||
    (date?.getTime() !== originalValues.date?.getTime());

  // Detect text direction for the card content
  const textDirection = getTextDirection(content);
  const textAlignment = textDirection === 'ltr' ? 'text-left' : 'text-right';

  const handleSave = async () => {
    if (!hasChanges) return;
    
    setIsSaving(true);
    try {
      const payload = {
        card_customer_id: card.card_customer_id || 8, // fallback if not provided
        card_content: content,
        card_procedure: procedure,
        card_project: project ? parseInt(project) : null,
        card_property: property ? parseInt(property) : null,
        card_date: date ? date.toISOString() : new Date().toISOString(),
      };

      const response = await axiosInstance.put(`/v1/crm/cards/${card.id}`, payload);
      
      if (response.data.status === "success") {
        // Get the updated card data from the response
        const updatedCard = response.data.data.card;
        
        // Update the original values to reflect the saved state
        setOriginalValues({
          date: updatedCard.card_date ? new Date(updatedCard.card_date) : undefined,
          procedure: updatedCard.card_procedure,
          project: updatedCard.card_project?.toString(),
          property: updatedCard.card_property?.toString(),
          content: updatedCard.card_content,
        });
        
        // Update local state with the server response data
        setDate(updatedCard.card_date ? new Date(updatedCard.card_date) : undefined);
        setProcedure(updatedCard.card_procedure);
        setProject(updatedCard.card_project?.toString());
        setProperty(updatedCard.card_property?.toString());
        setContent(updatedCard.card_content);
        
        // Call the parent callback if provided
        if (onCardUpdate) {
          onCardUpdate(updatedCard);
        }
        
        setIsEditing(false);
      } else {
        console.error("Failed to update card:\n", response.data.message);
      }
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setDate(originalValues.date);
    setProcedure(originalValues.procedure);
    setProject(originalValues.project);
    setProperty(originalValues.property);
    setContent(originalValues.content);
    setIsEditing(false);
  };

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <CardContent className="p-3 sm:p-4">
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`min-h-[80px] resize-none ${textAlignment} text-sm`}
            placeholder="أدخل المحتوى هنا..."
            dir={textDirection}
            autoFocus
          />
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-gray-800 dark:text-gray-200 text-sm leading-relaxed flex-1 ${textAlignment}`}
              onClick={() => setIsEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsEditing(true); }}
            >
              {content}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                size="sm"
                className="w-full sm:w-[120px] justify-start text-left font-normal text-xs gap-1 flex-shrink-0 h-8 sm:h-9"
              >
                <CalendarIcon className="h-3 w-3" />
                {date ? format(date, "PP") : <span>التاريخ</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="w-full sm:w-[110px] text-xs h-8 sm:h-9 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                <SelectValue placeholder="المشروع" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.contents[0]?.title || `مشروع ${p.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={property} onValueChange={setProperty}>
            <SelectTrigger className="w-full sm:w-[110px] text-xs h-8 sm:h-9 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                <SelectValue placeholder="الوحدة" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={procedure} onValueChange={setProcedure}>
            <SelectTrigger className="w-full sm:w-[110px] text-xs h-8 sm:h-9 flex-shrink-0">
              <div className="flex items-center gap-1">
                <ListChecks className="h-3 w-3" />
                <SelectValue placeholder="الإجراء" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {procedureOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasChanges && (
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="gap-1 text-xs h-8 sm:h-9"
            >
              <X className="h-3 w-3" />
              <span className="hidden sm:inline">إلغاء</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-1 text-xs h-8 sm:h-9"
            >
              {isSaving ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">حفظ</span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
