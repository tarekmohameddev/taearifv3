"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Move, Calendar, BarChart3, Bell } from "lucide-react"
import { PipelineStage } from "@/types/crm"

interface CrmFiltersProps {
  activeView: string
  setActiveView: (view: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterStage: string
  setFilterStage: (stage: string) => void
  filterUrgency: string
  setFilterUrgency: (urgency: string) => void
  pipelineStages: PipelineStage[]
}

export default function CrmFilters({
  activeView,
  setActiveView,
  searchTerm,
  setSearchTerm,
  filterStage,
  setFilterStage,
  filterUrgency,
  setFilterUrgency,
  pipelineStages,
}: CrmFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeView === "pipeline" ? "default" : "outline"}
          onClick={() => setActiveView("pipeline")}
          className="flex items-center gap-2"
        >
          <Move className="h-4 w-4" />
          <span className="hidden sm:inline">مراحل العملاء</span>
          <span className="sm:hidden">المراحل</span>
        </Button>
        <Button
          variant={activeView === "appointments" ? "default" : "outline"}
          onClick={() => setActiveView("appointments")}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">المواعيد</span>
          <span className="sm:hidden">المواعيد</span>
        </Button>
        <Button
          variant={activeView === "reminders" ? "default" : "outline"}
          onClick={() => setActiveView("reminders")}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">التذكيرات</span>
          <span className="sm:hidden">التذكيرات</span>
        </Button>
        {/* <Button
          variant={activeView === "analytics" ? "default" : "outline"}
          onClick={() => setActiveView("analytics")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">التحليلات</span>
          <span className="sm:hidden">التحليلات</span>
        </Button> */}
      </div>

      {/* Responsive Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="البحث في العملاء..."
            className="pr-8 w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full sm:w-[120px] lg:w-[150px]">
              <SelectValue placeholder="المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-full sm:w-[100px] lg:w-[120px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="عالية">عالية</SelectItem>
              <SelectItem value="متوسطة">متوسطة</SelectItem>
              <SelectItem value="منخفضة">منخفضة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
} 