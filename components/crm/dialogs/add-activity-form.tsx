"use client";

import React, { useState } from "react";
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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Project, Property } from "./crm-activity-card";

// Helper function to detect text direction
const getTextDirection = (text: string): "rtl" | "ltr" => {
  if (!text || text.length === 0) return "rtl"; // Default to RTL for empty text

  const firstChar = text.trim()[0];

  // Check if first character is Latin (English, numbers, symbols)
  const latinRegex = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  return latinRegex.test(firstChar) ? "ltr" : "rtl";
};

interface AddActivityFormProps {
  projects: Project[];
  properties: Property[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const procedureOptions = [
  { value: "appointment", label: "مواعيد" },
  { value: "note", label: "ملاحظات" },
  { value: "reminder", label: "تذكيرات" },
  { value: "interaction", label: "تفاعلات" },
];

export function AddActivityForm({
  projects,
  properties,
  onSubmit,
  onCancel,
  isSubmitting,
}: AddActivityFormProps) {
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [procedure, setProcedure] = useState("note");
  const [project, setProject] = useState<string | undefined>();
  const [property, setProperty] = useState<string | undefined>();
  const [error, setError] = useState("");

  // Detect text direction for the content
  const textDirection = getTextDirection(content);
  const textAlignment = textDirection === "ltr" ? "text-left" : "text-right";

  const handleSubmit = () => {
    if (!content.trim()) {
      setError("محتوى النشاط مطلوب.");
      return;
    }
    setError("");
    const data = {
      card_content: content,
      card_procedure: procedure,
      card_project: project ? parseInt(project) : null,
      card_property: property ? parseInt(property) : null,
      card_date: date ? date.toISOString() : new Date().toISOString(),
    };
    onSubmit(data);
  };

  return (
    <Card className="mb-4 shadow-md bg-white dark:bg-gray-800 border-primary/20">
      <CardContent className="p-4">
        <Textarea
          placeholder="اكتب ملاحظة أو نشاط جديد..."
          className={`min-h-[80px] text-sm focus:ring-primary/50 ${textAlignment}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-gray-50 dark:bg-gray-900/50 p-2 sm:p-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                size="sm"
                className="w-[150px] justify-start text-left font-normal text-xs gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, "PPP") : <span>حدد تاريخ</span>}
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

          {/* <Select value={project} onValueChange={setProject}>
            <SelectTrigger className="w-[140px] text-xs h-9">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
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
            <SelectTrigger className="w-[140px] text-xs h-9">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
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
          </Select> */}

          <Select value={procedure} onValueChange={setProcedure}>
            <SelectTrigger className="w-[140px] text-xs h-9">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="mr-2">حفظ</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
