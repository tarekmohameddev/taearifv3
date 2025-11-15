"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Move,
  Calendar,
  BarChart3,
  Bell,
  User,
  Loader2,
  Plus,
} from "lucide-react";
import { PipelineStage } from "@/types/crm";
import axiosInstance from "@/lib/axiosInstance";
import useCrmStore from "@/context/store/crm";
import useAuthStore from "@/context/AuthContext";

// Helper function to get priority label
const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 3:
      return "عالية";
    case 2:
      return "متوسطة";
    case 1:
      return "منخفضة";
    default:
      return "متوسطة";
  }
};

interface CrmFiltersProps {
  activeView: string;
  setActiveView: (view: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStage: string;
  setFilterStage: (stage: string) => void;
  filterUrgency: string;
  setFilterUrgency: (urgency: string) => void;
  pipelineStages: PipelineStage[];
  onSearchResults?: (results: any[]) => void;
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
  onSearchResults,
}: CrmFiltersProps) {
  const { userData } = useAuthStore();
  const { setShowAddDealDialog } = useCrmStore();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const { setCustomers, setPipelineStages } = useCrmStore();

  // Debounced search function
  const performSearch = useCallback(
    async (query: string, stageId: string, priority: string) => {
      // التحقق من وجود التوكن قبل إجراء الطلب
      if (!userData?.token) {
        return;
      }

      setIsSearching(true);
      try {
        // If no search query and no filters, load all customers from /crm
        if (!query.trim() && stageId === "all" && priority === "all") {
          const response = await axiosInstance.get("/crm");
          const crmData = response.data;

          if (crmData.status === "success") {
            // Transform stages data
            const transformedStages = crmData.stages_summary.map(
              (stage: any) => ({
                id: String(stage.stage_id),
                name: stage.stage_name,
                color: stage.color || "#6366f1",
                icon: stage.icon || "Target",
                count: stage.customer_count,
                value: 0,
              }),
            );

            // Add "unassigned" stage for customers without stage
            const unassignedCustomers = crmData.stages_with_customers.flatMap(
              (stage: any) =>
                (stage.customers || []).filter(
                  (customer: any) => !customer.stage_id,
                ),
            );

            if (unassignedCustomers.length > 0) {
              transformedStages.unshift({
                id: "unassigned",
                name: "غير محدد",
                color: "#9ca3af",
                icon: "User",
                count: unassignedCustomers.length,
                value: 0,
              });
            }

            // Transform customers data to match new API response format
            const allCustomersRaw = crmData.stages_with_customers.flatMap(
              (stage: any) =>
                (stage.customers || []).map((customer: any) => ({
                  id: customer.id || customer.customer_id,
                  user_id: customer.user_id || 0,
                  name: customer.name || "",
                  email: customer.email || null,
                  note: customer.note || null,
                  customer_type: customer.customer_type || null,
                  priority: customer.priority || 1,
                  stage_id: customer.stage_id || stage.stage_id || null,
                  procedure_id: customer.procedure_id || null,
                  city_id: customer.city_id || null,
                  district_id: customer.district_id || null,
                  phone_number: customer.phone_number || customer.phone || "",
                  created_at: customer.created_at || "",
                  updated_at: customer.updated_at || "",
                  // Backward compatibility fields
                  customer_id: customer.customer_id || customer.id,
                  nameEn: customer.name || "",
                  phone: customer.phone_number || customer.phone || "",
                  whatsapp: customer.whatsapp || "",
                  city: customer.city?.name_ar || customer.city || "",
                  district: customer.district || "",
                  assignedAgent: customer.assigned_agent || "",
                  lastContact: customer.last_contact || "",
                  urgency: customer.priority
                    ? getPriorityLabel(customer.priority)
                    : "",
                  pipelineStage: String(stage.stage_id),
                  dealValue: customer.deal_value || 0,
                  probability: customer.probability || 0,
                  avatar: customer.avatar || "",
                  reminders: customer.reminders || [],
                  interactions: customer.interactions || [],
                  appointments: customer.appointments || [],
                  notes: customer.notes || "",
                  joinDate: customer.created_at || "",
                  nationality: customer.nationality || "",
                  familySize: customer.family_size || 0,
                  leadSource: customer.lead_source || "",
                  satisfaction: customer.satisfaction || 0,
                  communicationPreference:
                    customer.communication_preference || "",
                  expectedCloseDate: customer.expected_close_date || "",
                })),
            );

            // Filter out duplicates, preferring customers with stage_id
            const allCustomers = allCustomersRaw.reduce(
              (acc: any[], customer: any) => {
                const existingCustomer = acc.find(
                  (c) => c.id === customer.id || c.name === customer.name,
                );

                if (!existingCustomer) {
                  acc.push(customer);
                } else {
                  // If current customer has stage_id and existing doesn't, replace it
                  if (
                    customer.stage_id !== null &&
                    existingCustomer.stage_id === null
                  ) {
                    const index = acc.indexOf(existingCustomer);
                    acc[index] = customer;
                  }
                  // If both have stage_id or both don't have stage_id, keep the first one
                }

                return acc;
              },
              [],
            );

            // Update store
            setPipelineStages(transformedStages);
            setCustomers(allCustomers);
            if (onSearchResults) {
              onSearchResults(allCustomers);
            }
          }
          return;
        }

        // If there's a search query or filters, use search API
        const params = new URLSearchParams();

        if (query.trim()) {
          params.append("query", query.trim());
        }

        if (stageId !== "all") {
          params.append("stage_id", stageId);
        }

        if (priority !== "all") {
          // Convert priority text to number
          const priorityMap: { [key: string]: string } = {
            عالية: "3",
            متوسطة: "2",
            منخفضة: "1",
          };
          params.append("priority", priorityMap[priority] || priority);
        }

        // Add pagination and sorting parameters
        params.append("page", "1");
        params.append("per_page", "50");
        params.append("sort_by", "created_at");
        params.append("sort_dir", "desc");

        const response = await axiosInstance.get(
          `/crm/customers/search?${params.toString()}`,
        );

        if (response.data.status === "success") {
          const results = response.data.data.customers || [];

          // Filter out duplicates, preferring customers with stage_id
          const uniqueCustomers = results.reduce(
            (acc: any[], customer: any) => {
              const existingCustomer = acc.find(
                (c) => c.id === customer.id || c.name === customer.name,
              );

              if (!existingCustomer) {
                acc.push(customer);
              } else {
                // If current customer has stage_id and existing doesn't, replace it
                if (
                  customer.stage_id !== null &&
                  existingCustomer.stage_id === null
                ) {
                  const index = acc.indexOf(existingCustomer);
                  acc[index] = customer;
                }
                // If both have stage_id or both don't have stage_id, keep the first one
              }

              return acc;
            },
            [],
          );

          setCustomers(uniqueCustomers);
          if (onSearchResults) {
            onSearchResults(uniqueCustomers);
          }
        }
      } catch (error) {
        console.error("خطأ في البحث:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [setCustomers, setPipelineStages, onSearchResults, userData?.token],
  );

  // Handle search input changes with debouncing
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      performSearch(value, filterStage, filterUrgency);
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  // Handle filter changes
  const handleStageChange = (stageId: string) => {
    setFilterStage(stageId);
    performSearch(searchTerm, stageId, filterUrgency);
  };

  const handleUrgencyChange = (priority: string) => {
    setFilterUrgency(priority);
    performSearch(searchTerm, filterStage, priority);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  // Load all customers on component mount
  useEffect(() => {
    performSearch("", "all", "all");
  }, []);
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
          variant="default"
          className="flex items-center gap-2"
          onClick={() => setShowAddDealDialog(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">انشاء صفقة جديدة</span>
          <span className="sm:hidden">انشاء صفقة</span>
        </Button>
        {/* <Button
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
        <Button
          variant={activeView === "inquiry" ? "default" : "outline"}
          onClick={() => setActiveView("inquiry")}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">طلبات العملاء</span>
          <span className="sm:hidden">طلبات العملاء</span>
        </Button> */}
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
          {isSearching ? (
            <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          )}
          <Input
            type="search"
            placeholder="العملاء..."
            className="pr-8 w-full sm:w-[250px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStage} onValueChange={handleStageChange}>
            <SelectTrigger className="w-full sm:w-[120px] lg:w-[150px]">
              <SelectValue placeholder="المراحل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              <SelectItem value="unassigned">غير محدد</SelectItem>
              {pipelineStages.map((stage) => (
                <SelectItem key={stage.id} value={stage.id}>
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUrgency} onValueChange={handleUrgencyChange}>
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
  );
}
