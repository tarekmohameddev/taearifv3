"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { format } from "date-fns";

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
  card_content: string;
  card_procedure: string;
  card_project: number | null;
  card_property: number | null;
  card_date: string;
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
}: CrmActivityCardProps) {
  const [date, setDate] = useState<Date | undefined>(
    card.card_date ? new Date(card.card_date) : undefined
  );
  const [procedure, setProcedure] = useState(card.card_procedure);
  const [project, setProject] = useState(card.card_project?.toString());
  const [property, setProperty] = useState(card.card_property?.toString());

  // Detect text direction for the card content
  const textDirection = getTextDirection(card.card_content);
  const textAlignment = textDirection === 'ltr' ? 'text-left' : 'text-right';

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      <CardContent className="p-3 sm:p-4">
        <p className={`text-gray-800 dark:text-gray-200 text-sm leading-relaxed ${textAlignment}`}>
          {card.card_content}
        </p>
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
      </CardFooter>
    </Card>
  );
}
