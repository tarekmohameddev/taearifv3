"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Clock,
  ArrowLeft,
  Filter,
  Zap,
  Search,
  ChevronDown,
  Timer,
  CalendarDays,
  Target,
  TrendingUp,
  RefreshCcw,
  Download,
  Bell,
  X,
  Sparkles,
  Inbox,
  CalendarClock,
  List,
  MessageSquare,
  Globe,
  UserPlus,
  Users,
  CheckSquare,
  Keyboard,
  LayoutGrid,
  LayoutList,
  History,
  Undo2,
  FileSpreadsheet,
  Eye,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "./IncomingActionsCard";
import { BulkActionsToolbar } from "./BulkActionsToolbar";
import { QuickViewPanel } from "./QuickViewPanel";
import { ActionHistoryList } from "./ActionHistoryList";
import { SavedFiltersPanel, SavedFilter } from "./SavedFiltersPanel";
import { SourceBadge } from "./SourceBadge";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority, UnifiedCustomer } from "@/types/unified-customer";
import {
  filterActionsByStatus,
  filterActionsByType,
  getOverdueActions,
  getActionsDueToday,
  groupActionsBySource,
  groupActionsByType,
  sortActionsByPriority,
} from "@/lib/utils/action-helpers";

const priorityLabels: Record<Priority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

const actionTypeLabels: Record<CustomerActionType, string> = {
  new_inquiry: "استفسار جديد",
  callback_request: "طلب اتصال",
  property_match: "مطابقة عقار",
  follow_up: "متابعة",
  document_required: "مستندات",
  payment_due: "دفع مستحق",
  site_visit: "معاينة",
  whatsapp_incoming: "واتساب",
  ai_recommended: "موصى به",
};

export function ActionsPage() {
  const { 
    customers, 
    actions, 
    completeAction, 
    dismissAction, 
    snoozeAction,
    completeMultipleActions,
    dismissMultipleActions,
    snoozeMultipleActions,
    assignMultipleActions,
    updateMultipleActionsPriority,
    undoStack,
    undoLastAction,
    restoreAction,
    getCompletedActions,
    addActionNote,
    getCustomerById,
  } = useUnifiedCustomersStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CustomerActionType[]>([]);
  
  // Additional Filters
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<'all' | 'overdue' | 'today' | 'week' | 'no_date'>('all');
  const [leadScoreMin, setLeadScoreMin] = useState<number | null>(null);
  const [leadScoreMax, setLeadScoreMax] = useState<number | null>(null);
  const [hasNotesFilter, setHasNotesFilter] = useState<boolean | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Bulk Selection State
  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  
  // New Feature States
  const [isCompactView, setIsCompactView] = useState(false);
  const [showDueDateGroups, setShowDueDateGroups] = useState(false);
  const [quickViewAction, setQuickViewAction] = useState<CustomerAction | null>(null);
  const [quickViewCustomer, setQuickViewCustomer] = useState<UnifiedCustomer | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Get all actions (both from store and AI-generated)
  const allActions = useMemo(() => {
    // Get stored actions
    const storedActions = [...actions];
    
    // Generate AI-recommended actions from customers (legacy support)
    const aiActions: CustomerAction[] = customers
      .filter((c) => c.aiInsights.nextBestAction && !actions.find(a => a.customerId === c.id))
      .map((customer) => ({
        id: `ai_${customer.id}`,
        customerId: customer.id,
        customerName: customer.name,
        type: 'ai_recommended' as CustomerActionType,
        title: customer.aiInsights.nextBestAction || '',
        description: customer.aiInsights.nextBestAction,
        priority: customer.priority,
        status: 'pending' as const,
        source: customer.source,
        dueDate: customer.nextFollowUpDate,
        assignedTo: customer.assignedEmployeeId,
        assignedToName: customer.assignedEmployee?.name,
        createdAt: customer.createdAt,
        metadata: {
          leadScore: customer.leadScore,
          dealValue: customer.totalDealValue,
        },
      }));
    
    return [...storedActions, ...aiActions];
  }, [actions, customers]);

  // Get unique assignees from actions
  const uniqueAssignees = useMemo(() => {
    const assignees = new Map<string, string>();
    allActions.forEach((action) => {
      if (action.assignedTo && action.assignedToName) {
        assignees.set(action.assignedTo, action.assignedToName);
      }
    });
    return Array.from(assignees.entries()).map(([id, name]) => ({ id, name }));
  }, [allActions]);

  // Filter actions
  const filteredActions = useMemo(() => {
    let filtered = allActions.filter((a) => a.status === 'pending' || a.status === 'in_progress');

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(query) ||
          a.title.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query)
      );
    }

    // Source filter
    if (selectedSources.length > 0) {
      filtered = filtered.filter((a) => selectedSources.includes(a.source));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((a) => selectedPriorities.includes(a.priority));
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((a) => selectedTypes.includes(a.type));
    }

    // Assignee filter
    if (selectedAssignees.length > 0) {
      filtered = filtered.filter((a) => a.assignedTo && selectedAssignees.includes(a.assignedTo));
    }

    // Due date filter
    if (dueDateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() + 7);

      filtered = filtered.filter((a) => {
        if (dueDateFilter === 'no_date') {
          return !a.dueDate;
        }
        if (!a.dueDate) return false;
        
        const dueDate = new Date(a.dueDate);
        
        switch (dueDateFilter) {
          case 'overdue':
            return dueDate < now;
          case 'today':
            return dueDate >= today && dueDate < tomorrow;
          case 'week':
            return dueDate >= today && dueDate < weekEnd;
          default:
            return true;
        }
      });
    }

    // Lead score filter
    if (leadScoreMin !== null || leadScoreMax !== null) {
      filtered = filtered.filter((a) => {
        const customer = getCustomerById(a.customerId);
        if (!customer) return true;
        const score = customer.leadScore;
        if (leadScoreMin !== null && score < leadScoreMin) return false;
        if (leadScoreMax !== null && score > leadScoreMax) return false;
        return true;
      });
    }

    // Has notes filter
    if (hasNotesFilter !== null) {
      filtered = filtered.filter((a) => {
        const hasNotes = a.metadata?.notes && a.metadata.notes.length > 0;
        return hasNotesFilter ? hasNotes : !hasNotes;
      });
    }

    return sortActionsByPriority(filtered);
  }, [allActions, searchQuery, selectedSources, selectedPriorities, selectedTypes, selectedAssignees, dueDateFilter, leadScoreMin, leadScoreMax, hasNotesFilter, getCustomerById]);

  // Categorize actions
  const incomingActions = useMemo(() => {
    return filteredActions.filter(
      (a) => a.type === 'new_inquiry' || a.type === 'whatsapp_incoming' || a.type === 'callback_request'
    );
  }, [filteredActions]);

  const followUpActions = useMemo(() => {
    return filteredActions.filter((a) => a.type === 'follow_up' || a.type === 'site_visit');
  }, [filteredActions]);

  const aiRecommendedActions = useMemo(() => {
    return filteredActions.filter((a) => a.type === 'ai_recommended');
  }, [filteredActions]);

  const overdueActions = useMemo(() => getOverdueActions(filteredActions), [filteredActions]);
  const todayActions = useMemo(() => getActionsDueToday(filteredActions), [filteredActions]);
  
  // Completed/History Actions
  const completedActions = useMemo(() => getCompletedActions(), [actions]);
  
  // Due Date Grouped Actions
  const dueDateGroupedActions = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const groups: Record<string, CustomerAction[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      noDueDate: [],
    };
    
    filteredActions.forEach((action) => {
      if (!action.dueDate) {
        groups.noDueDate.push(action);
        return;
      }
      
      const dueDate = new Date(action.dueDate);
      if (dueDate < now) {
        groups.overdue.push(action);
      } else if (dueDate.toDateString() === now.toDateString()) {
        groups.today.push(action);
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        groups.tomorrow.push(action);
      } else if (dueDate <= nextWeek) {
        groups.thisWeek.push(action);
      } else {
        groups.later.push(action);
      }
    });
    
    return groups;
  }, [filteredActions]);

  // Statistics
  const stats = useMemo(() => {
    const pending = allActions.filter((a) => a.status === 'pending' || a.status === 'in_progress');
    const completed = allActions.filter((a) => a.status === 'completed');
    const total = allActions.length;
    const completionRate = total > 0 ? Math.round((completed.length / total) * 100) : 0;
    const urgentCount = pending.filter((a) => a.priority === 'urgent').length;
    const overdueCount = overdueActions.length;
    const todayCount = todayActions.length;
    const bySource = groupActionsBySource(pending);

    return {
      pending: pending.length,
      completed: completed.length,
      total,
      completionRate,
      urgentCount,
      overdueCount,
      todayCount,
      bySource,
    };
  }, [allActions, overdueActions, todayActions]);

  // Action handlers
  const handleComplete = (actionId: string) => {
    completeAction(actionId);
    // Remove from selection if selected
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  };

  const handleDismiss = (actionId: string) => {
    dismissAction(actionId);
    // Remove from selection if selected
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  };

  const handleSnooze = (actionId: string, until: string) => {
    snoozeAction(actionId, until);
    // Remove from selection if selected
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(actionId);
      return newSet;
    });
  };

  // Selection handlers
  const handleSelectAction = useCallback((actionId: string, selected: boolean) => {
    setSelectedActionIds((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(actionId);
      } else {
        newSet.delete(actionId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    // Select all actions in the current tab/view
    const currentActions = getCurrentTabActions();
    setSelectedActionIds(new Set(currentActions.map((a) => a.id)));
  }, [activeTab, filteredActions]);

  const handleDeselectAll = useCallback(() => {
    setSelectedActionIds(new Set());
  }, []);

  // Get actions for current tab
  const getCurrentTabActions = useCallback(() => {
    switch (activeTab) {
      case "incoming":
        return incomingActions;
      case "followup":
        return followUpActions;
      case "ai":
        return aiRecommendedActions;
      default:
        return filteredActions;
    }
  }, [activeTab, incomingActions, followUpActions, aiRecommendedActions, filteredActions]);

  // Check if all current tab actions are selected
  const isAllSelected = useMemo(() => {
    const currentActions = getCurrentTabActions();
    if (currentActions.length === 0) return false;
    return currentActions.every((a) => selectedActionIds.has(a.id));
  }, [getCurrentTabActions, selectedActionIds]);

  // Bulk action handlers
  const handleBulkComplete = useCallback(() => {
    const ids = Array.from(selectedActionIds);
    completeMultipleActions(ids);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, completeMultipleActions]);

  const handleBulkDismiss = useCallback(() => {
    const ids = Array.from(selectedActionIds);
    dismissMultipleActions(ids);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, dismissMultipleActions]);

  const handleBulkSnooze = useCallback((until: string) => {
    const ids = Array.from(selectedActionIds);
    snoozeMultipleActions(ids, until);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, snoozeMultipleActions]);

  const handleBulkAssign = useCallback((employeeId: string, employeeName: string) => {
    const ids = Array.from(selectedActionIds);
    assignMultipleActions(ids, employeeId, employeeName);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, assignMultipleActions]);

  const handleBulkChangePriority = useCallback((priority: Priority) => {
    const ids = Array.from(selectedActionIds);
    updateMultipleActionsPriority(ids, priority);
    setSelectedActionIds(new Set());
  }, [selectedActionIds, updateMultipleActionsPriority]);

  // Handle undo - defined before keyboard shortcuts to avoid reference error
  const handleUndo = useCallback(() => {
    undoLastAction();
  }, [undoLastAction]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        handleSelectAll();
      }

      // Escape: Deselect all
      if (e.key === "Escape") {
        handleDeselectAll();
      }

      // Ctrl/Cmd + Enter: Complete selected
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && selectedActionIds.size > 0) {
        e.preventDefault();
        handleBulkComplete();
      }

      // Delete/Backspace: Dismiss selected
      if ((e.key === "Delete" || e.key === "Backspace") && selectedActionIds.size > 0) {
        e.preventDefault();
        handleBulkDismiss();
      }

      // ? : Show keyboard shortcuts
      if (e.key === "?") {
        setShowKeyboardShortcuts((prev) => !prev);
      }

      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && undoStack.length > 0) {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectAll, handleDeselectAll, handleBulkComplete, handleBulkDismiss, selectedActionIds.size, undoStack.length, handleUndo]);

  // Clear selection when tab changes
  useEffect(() => {
    setSelectedActionIds(new Set());
  }, [activeTab]);

  // Quick View handlers
  const handleQuickView = useCallback((actionId: string) => {
    const action = filteredActions.find((a) => a.id === actionId) || 
                   completedActions.find((a) => a.id === actionId);
    if (action) {
      const customer = getCustomerById(action.customerId);
      setQuickViewAction(action);
      setQuickViewCustomer(customer || null);
      setShowQuickView(true);
    }
  }, [filteredActions, completedActions, getCustomerById]);

  // Handle add note
  const handleAddNote = useCallback((actionId: string, note: string) => {
    addActionNote(actionId, note);
  }, [addActionNote]);

  // Handle restore action from history
  const handleRestoreAction = useCallback((actionId: string) => {
    restoreAction(actionId);
  }, [restoreAction]);

  // Export to CSV
  const handleExportCSV = useCallback(() => {
    const currentActions = getCurrentTabActions();
    const headers = ["اسم العميل", "العنوان", "النوع", "الأولوية", "المصدر", "تاريخ الاستحقاق", "الموظف المعين"];
    
    const rows = currentActions.map((action) => [
      action.customerName,
      action.title,
      actionTypeLabels[action.type],
      priorityLabels[action.priority],
      action.source,
      action.dueDate ? new Date(action.dueDate).toLocaleDateString("ar-SA") : "",
      action.assignedToName || "",
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `actions-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [getCurrentTabActions]);

  // Apply saved filter
  const handleApplySavedFilter = useCallback((filter: SavedFilter) => {
    setSelectedSources(filter.sources);
    setSelectedPriorities(filter.priorities);
    setSelectedTypes(filter.types);
    setSearchQuery(filter.searchQuery);
    setSelectedAssignees(filter.assignees || []);
    setDueDateFilter(filter.dueDateFilter || 'all');
    setLeadScoreMin(filter.leadScoreMin ?? null);
    setLeadScoreMax(filter.leadScoreMax ?? null);
    setHasNotesFilter(filter.hasNotesFilter ?? null);
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSources([]);
    setSelectedPriorities([]);
    setSelectedTypes([]);
    setSelectedAssignees([]);
    setDueDateFilter('all');
    setLeadScoreMin(null);
    setLeadScoreMax(null);
    setHasNotesFilter(null);
  };

  const hasActiveFilters =
    searchQuery || 
    selectedSources.length > 0 || 
    selectedPriorities.length > 0 || 
    selectedTypes.length > 0 ||
    selectedAssignees.length > 0 ||
    dueDateFilter !== 'all' ||
    leadScoreMin !== null ||
    leadScoreMax !== null ||
    hasNotesFilter !== null;
  
  const activeFilterCount = [
    searchQuery ? 1 : 0,
    selectedSources.length,
    selectedPriorities.length,
    selectedTypes.length,
    selectedAssignees.length,
    dueDateFilter !== 'all' ? 1 : 0,
    (leadScoreMin !== null || leadScoreMax !== null) ? 1 : 0,
    hasNotesFilter !== null ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ar/dashboard/customers-hub/list">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                قائمة العملاء
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white">
                  <Zap className="h-6 w-6" />
                </div>
                مركز الإجراءات
              </h1>
              <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                إجراءات العملاء التي تتطلب اهتمامك
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {/* Undo Button */}
              {undoStack.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleUndo}
                      className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      <Undo2 className="h-4 w-4" />
                      تراجع
                      <Badge variant="secondary" className="text-xs">
                        {undoStack.length}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>التراجع عن آخر إجراء (Ctrl+Z)</TooltipContent>
                </Tooltip>
              )}

              {/* View Mode Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isCompactView ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setIsCompactView(!isCompactView)}
                  >
                    {isCompactView ? <LayoutList className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isCompactView ? "العرض العادي" : "العرض المضغوط"}</TooltipContent>
              </Tooltip>

              {/* Due Date Grouping Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showDueDateGroups ? "default" : "outline"} 
                    size="icon"
                    onClick={() => setShowDueDateGroups(!showDueDateGroups)}
                  >
                    <CalendarDays className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تجميع حسب تاريخ الاستحقاق</TooltipContent>
              </Tooltip>

              {/* Keyboard Shortcuts Help */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowKeyboardShortcuts((prev) => !prev)}
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="text-sm space-y-1">
                    <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+A</kbd> تحديد الكل</p>
                    <p><kbd className="px-1 bg-gray-100 rounded">Esc</kbd> إلغاء التحديد</p>
                    <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Enter</kbd> إكمال المحدد</p>
                    <p><kbd className="px-1 bg-gray-100 rounded">Delete</kbd> رفض المحدد</p>
                    <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Z</kbd> تراجع</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Button variant="outline" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>

              {/* Export Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExportCSV}>
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تصدير إلى Excel</TooltipContent>
              </Tooltip>

              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </TooltipProvider>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">تقدم اليوم</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-bold">{stats.completionRate}%</span>
                  <span className="text-white/70 mb-1">من الإجراءات مكتملة</span>
                </div>
                <Progress value={stats.completionRate} className="h-2 bg-white/20" />
                <div className="flex items-center justify-between mt-2 text-sm text-white/70">
                  <span>{stats.completed} مكتمل</span>
                  <span>{stats.pending} متبقي</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <AlertTriangle className="h-6 w-6 mx-auto mb-1 text-red-300" />
                  <div className="text-2xl font-bold">{stats.urgentCount}</div>
                  <div className="text-xs text-white/70">عاجل</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <Timer className="h-6 w-6 mx-auto mb-1 text-orange-300" />
                  <div className="text-2xl font-bold">{stats.overdueCount}</div>
                  <div className="text-xs text-white/70">متأخر</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <CalendarDays className="h-6 w-6 mx-auto mb-1 text-blue-300" />
                  <div className="text-2xl font-bold">{stats.todayCount}</div>
                  <div className="text-xs text-white/70">اليوم</div>
                </div>
                <div className="text-center p-3 bg-white/10 rounded-xl">
                  <Inbox className="h-6 w-6 mx-auto mb-1 text-green-300" />
                  <div className="text-2xl font-bold">{incomingActions.length}</div>
                  <div className="text-xs text-white/70">وارد</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters & Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في الإجراءات..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Source Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        المصدر
                        {selectedSources.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedSources.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>مصدر العميل</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(['whatsapp', 'inquiry', 'manual', 'referral', 'import'] as CustomerSource[]).map((source) => (
                        <DropdownMenuCheckboxItem
                          key={source}
                          checked={selectedSources.includes(source)}
                          onCheckedChange={(checked) => {
                            setSelectedSources((prev) =>
                              checked ? [...prev, source] : prev.filter((s) => s !== source)
                            );
                          }}
                        >
                          <SourceBadge source={source} className="text-xs" />
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Priority Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        الأولوية
                        {selectedPriorities.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedPriorities.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(['urgent', 'high', 'medium', 'low'] as Priority[]).map((priority) => (
                        <DropdownMenuCheckboxItem
                          key={priority}
                          checked={selectedPriorities.includes(priority)}
                          onCheckedChange={(checked) => {
                            setSelectedPriorities((prev) =>
                              checked ? [...prev, priority] : prev.filter((p) => p !== priority)
                            );
                          }}
                        >
                          {priorityLabels[priority]}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Type Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <List className="h-4 w-4" />
                        النوع
                        {selectedTypes.length > 0 && (
                          <Badge variant="secondary" className="mr-1">
                            {selectedTypes.length}
                          </Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>نوع الإجراء</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {(Object.keys(actionTypeLabels) as CustomerActionType[]).map((type) => (
                        <DropdownMenuCheckboxItem
                          key={type}
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            setSelectedTypes((prev) =>
                              checked ? [...prev, type] : prev.filter((t) => t !== type)
                            );
                          }}
                        >
                          {actionTypeLabels[type]}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Assignee Filter */}
                  {uniqueAssignees.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          الموظف
                          {selectedAssignees.length > 0 && (
                            <Badge variant="secondary" className="mr-1">
                              {selectedAssignees.length}
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الموظف المعين</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {uniqueAssignees.map((assignee) => (
                          <DropdownMenuCheckboxItem
                            key={assignee.id}
                            checked={selectedAssignees.includes(assignee.id)}
                            onCheckedChange={(checked) => {
                              setSelectedAssignees((prev) =>
                                checked ? [...prev, assignee.id] : prev.filter((a) => a !== assignee.id)
                              );
                            }}
                          >
                            {assignee.name}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Due Date Filter */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Timer className="h-4 w-4" />
                        الموعد
                        {dueDateFilter !== 'all' && (
                          <Badge variant="secondary" className="mr-1">1</Badge>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>تصفية حسب الموعد</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDueDateFilter('all')}>
                        <span className={cn(dueDateFilter === 'all' && "font-bold")}>الكل</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter('overdue')}>
                        <span className={cn("text-red-600", dueDateFilter === 'overdue' && "font-bold")}>
                          المتأخرة فقط
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter('today')}>
                        <span className={cn("text-orange-600", dueDateFilter === 'today' && "font-bold")}>
                          اليوم فقط
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter('week')}>
                        <span className={cn("text-blue-600", dueDateFilter === 'week' && "font-bold")}>
                          هذا الأسبوع
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDueDateFilter('no_date')}>
                        <span className={cn("text-gray-500", dueDateFilter === 'no_date' && "font-bold")}>
                          بدون تاريخ
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Advanced Filters Toggle */}
                  <Button
                    variant={showAdvancedFilters ? "default" : "outline"}
                    size="icon"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="relative"
                  >
                    <Filter className="h-4 w-4" />
                    {(leadScoreMin !== null || leadScoreMax !== null || hasNotesFilter !== null) && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && (
                <div className="border-t pt-4 mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lead Score Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      نقاط العميل (Lead Score)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="من"
                        min={0}
                        max={100}
                        value={leadScoreMin ?? ''}
                        onChange={(e) => setLeadScoreMin(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-20 h-9"
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        type="number"
                        placeholder="إلى"
                        min={0}
                        max={100}
                        value={leadScoreMax ?? ''}
                        onChange={(e) => setLeadScoreMax(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-20 h-9"
                      />
                      {(leadScoreMin !== null || leadScoreMax !== null) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setLeadScoreMin(null);
                            setLeadScoreMax(null);
                          }}
                          className="h-9 px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Has Notes Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      الملاحظات
                    </label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={hasNotesFilter === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHasNotesFilter(null)}
                        className="h-9"
                      >
                        الكل
                      </Button>
                      <Button
                        variant={hasNotesFilter === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHasNotesFilter(true)}
                        className="h-9"
                      >
                        مع ملاحظات
                      </Button>
                      <Button
                        variant={hasNotesFilter === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHasNotesFilter(false)}
                        className="h-9"
                      >
                        بدون ملاحظات
                      </Button>
                    </div>
                  </div>

                  {/* Quick Filter Presets */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      فلاتر سريعة
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDueDateFilter('overdue');
                          setSelectedPriorities(['urgent', 'high']);
                        }}
                        className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                      >
                        عاجل ومتأخر
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setLeadScoreMin(70);
                          setLeadScoreMax(null);
                        }}
                        className="h-8 text-xs text-green-600 border-green-200 hover:bg-green-50"
                      >
                        عملاء مميزون
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAssignees([]);
                          setDueDateFilter('today');
                        }}
                        className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        مهام اليوم
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Filters */}
              <div className="flex items-center justify-between">
                <SavedFiltersPanel
                  currentFilters={{
                    sources: selectedSources,
                    priorities: selectedPriorities,
                    types: selectedTypes,
                    searchQuery,
                    assignees: selectedAssignees,
                    dueDateFilter,
                    leadScoreMin,
                    leadScoreMax,
                    hasNotesFilter,
                  }}
                  onApplyFilter={handleApplySavedFilter}
                />
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">
                    الفلاتر النشطة ({activeFilterCount}):
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      بحث: {searchQuery}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                    </Badge>
                  )}
                  {selectedSources.map((source) => (
                    <Badge key={source} variant="secondary" className="gap-1">
                      <SourceBadge source={source} className="text-xs" />
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          setSelectedSources((prev) => prev.filter((s) => s !== source))
                        }
                      />
                    </Badge>
                  ))}
                  {selectedPriorities.map((priority) => (
                    <Badge key={priority} variant="secondary" className="gap-1">
                      {priorityLabels[priority]}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          setSelectedPriorities((prev) => prev.filter((p) => p !== priority))
                        }
                      />
                    </Badge>
                  ))}
                  {selectedTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="gap-1">
                      {actionTypeLabels[type]}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() =>
                          setSelectedTypes((prev) => prev.filter((t) => t !== type))
                        }
                      />
                    </Badge>
                  ))}
                  {selectedAssignees.map((assigneeId) => {
                    const assignee = uniqueAssignees.find((a) => a.id === assigneeId);
                    return (
                      <Badge key={assigneeId} variant="secondary" className="gap-1">
                        موظف: {assignee?.name || assigneeId}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() =>
                            setSelectedAssignees((prev) => prev.filter((a) => a !== assigneeId))
                          }
                        />
                      </Badge>
                    );
                  })}
                  {dueDateFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      الموعد: {
                        dueDateFilter === 'overdue' ? 'متأخر' :
                        dueDateFilter === 'today' ? 'اليوم' :
                        dueDateFilter === 'week' ? 'هذا الأسبوع' :
                        'بدون تاريخ'
                      }
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setDueDateFilter('all')} />
                    </Badge>
                  )}
                  {(leadScoreMin !== null || leadScoreMax !== null) && (
                    <Badge variant="secondary" className="gap-1">
                      نقاط: {leadScoreMin ?? 0} - {leadScoreMax ?? 100}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          setLeadScoreMin(null);
                          setLeadScoreMax(null);
                        }} 
                      />
                    </Badge>
                  )}
                  {hasNotesFilter !== null && (
                    <Badge variant="secondary" className="gap-1">
                      {hasNotesFilter ? 'مع ملاحظات' : 'بدون ملاحظات'}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setHasNotesFilter(null)} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600">
                    مسح الكل
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="incoming" className="gap-2">
                <Inbox className="h-4 w-4" />
                وارد ({incomingActions.length})
              </TabsTrigger>
              <TabsTrigger value="followup" className="gap-2">
                <CalendarClock className="h-4 w-4" />
                متابعة ({followUpActions.length})
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="h-4 w-4" />
                موصى به ({aiRecommendedActions.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <List className="h-4 w-4" />
                الكل ({filteredActions.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                السجل ({completedActions.length})
              </TabsTrigger>
            </TabsList>

            {/* Quick Select All */}
            {getCurrentTabActions().length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    }}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="select-all"
                    className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                  >
                    تحديد الكل
                  </label>
                </div>
                {selectedActionIds.size > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    {selectedActionIds.size} محدد
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Incoming Tab */}
          <TabsContent value="incoming">
            <div className={cn("space-y-3", isCompactView && "space-y-1")}>
              {incomingActions.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="text-center">
                    <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">لا توجد إجراءات واردة</h3>
                    <p className="text-gray-500">جميع العملاء الجدد تمت معالجتهم</p>
                  </CardContent>
                </Card>
              ) : showDueDateGroups ? (
                <DueDateGroupedView
                  groups={dueDateGroupedActions}
                  onComplete={handleComplete}
                  onDismiss={handleDismiss}
                  onSnooze={handleSnooze}
                  onAddNote={handleAddNote}
                  onQuickView={handleQuickView}
                  selectedActionIds={selectedActionIds}
                  onSelect={handleSelectAction}
                  isCompact={isCompactView}
                  filterFn={(a) => a.type === 'new_inquiry' || a.type === 'whatsapp_incoming' || a.type === 'callback_request'}
                />
              ) : (
                incomingActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                    onAddNote={handleAddNote}
                    onQuickView={handleQuickView}
                    isSelected={selectedActionIds.has(action.id)}
                    onSelect={handleSelectAction}
                    showCheckbox={true}
                    isCompact={isCompactView}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Follow-up Tab */}
          <TabsContent value="followup">
            <div className={cn("space-y-3", isCompactView && "space-y-1")}>
              {followUpActions.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="text-center">
                    <CalendarClock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">لا توجد متابعات مجدولة</h3>
                    <p className="text-gray-500">جميع المتابعات مكتملة</p>
                  </CardContent>
                </Card>
              ) : (
                followUpActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                    onAddNote={handleAddNote}
                    onQuickView={handleQuickView}
                    isSelected={selectedActionIds.has(action.id)}
                    onSelect={handleSelectAction}
                    showCheckbox={true}
                    isCompact={isCompactView}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* AI Recommended Tab */}
          <TabsContent value="ai">
            <div className={cn("space-y-3", isCompactView && "space-y-1")}>
              {aiRecommendedActions.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="text-center">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">لا توجد توصيات من الذكاء الاصطناعي</h3>
                    <p className="text-gray-500">سيتم إنشاء توصيات بناءً على بيانات العملاء</p>
                  </CardContent>
                </Card>
              ) : (
                aiRecommendedActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                    onAddNote={handleAddNote}
                    onQuickView={handleQuickView}
                    isSelected={selectedActionIds.has(action.id)}
                    onSelect={handleSelectAction}
                    showCheckbox={true}
                    isCompact={isCompactView}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* All Actions Tab */}
          <TabsContent value="all">
            <div className={cn("space-y-3", isCompactView && "space-y-1")}>
              {filteredActions.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {hasActiveFilters ? "لا توجد نتائج" : "ممتاز! لا توجد إجراءات معلقة"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {hasActiveFilters
                        ? "جرب تغيير معايير البحث أو الفلترة"
                        : "لقد أكملت جميع الإجراءات المطلوبة"}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        مسح الفلاتر
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : showDueDateGroups ? (
                <DueDateGroupedView
                  groups={dueDateGroupedActions}
                  onComplete={handleComplete}
                  onDismiss={handleDismiss}
                  onSnooze={handleSnooze}
                  onAddNote={handleAddNote}
                  onQuickView={handleQuickView}
                  selectedActionIds={selectedActionIds}
                  onSelect={handleSelectAction}
                  isCompact={isCompactView}
                />
              ) : (
                filteredActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                    onAddNote={handleAddNote}
                    onQuickView={handleQuickView}
                    isSelected={selectedActionIds.has(action.id)}
                    onSelect={handleSelectAction}
                    showCheckbox={true}
                    isCompact={isCompactView}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <ActionHistoryList
              actions={completedActions}
              onRestore={handleRestoreAction}
            />
          </TabsContent>
        </Tabs>

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedCount={selectedActionIds.size}
          totalCount={getCurrentTabActions().length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onCompleteAll={handleBulkComplete}
          onDismissAll={handleBulkDismiss}
          onSnoozeAll={handleBulkSnooze}
          onAssignAll={handleBulkAssign}
          onChangePriority={handleBulkChangePriority}
          isAllSelected={isAllSelected}
        />

        {/* Keyboard Shortcuts Modal */}
        {showKeyboardShortcuts && (
          <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Keyboard className="h-5 w-5" />
                    اختصارات لوحة المفاتيح
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowKeyboardShortcuts(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>تحديد الكل</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + A</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>إلغاء التحديد</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Esc</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>إكمال المحدد</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>رفض المحدد</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Delete</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>تراجع</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">Ctrl + Z</kbd>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>إظهار/إخفاء هذه النافذة</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">?</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick View Panel */}
        <QuickViewPanel
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          customer={quickViewCustomer}
          action={quickViewAction}
        />
      </div>
    </div>
  );
}

// Due Date Grouped View Component
interface DueDateGroupedViewProps {
  groups: Record<string, CustomerAction[]>;
  onComplete: (actionId: string) => void;
  onDismiss: (actionId: string) => void;
  onSnooze: (actionId: string, until: string) => void;
  onAddNote: (actionId: string, note: string) => void;
  onQuickView: (actionId: string) => void;
  selectedActionIds: Set<string>;
  onSelect: (actionId: string, selected: boolean) => void;
  isCompact: boolean;
  filterFn?: (action: CustomerAction) => boolean;
}

const dueDateGroupLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  overdue: { label: "متأخر", color: "text-red-600", icon: <AlertTriangle className="h-4 w-4" /> },
  today: { label: "اليوم", color: "text-orange-600", icon: <Clock className="h-4 w-4" /> },
  tomorrow: { label: "غداً", color: "text-yellow-600", icon: <CalendarDays className="h-4 w-4" /> },
  thisWeek: { label: "هذا الأسبوع", color: "text-blue-600", icon: <CalendarClock className="h-4 w-4" /> },
  later: { label: "لاحقاً", color: "text-gray-600", icon: <Calendar className="h-4 w-4" /> },
  noDueDate: { label: "بدون تاريخ", color: "text-gray-400", icon: <List className="h-4 w-4" /> },
};

function DueDateGroupedView({
  groups,
  onComplete,
  onDismiss,
  onSnooze,
  onAddNote,
  onQuickView,
  selectedActionIds,
  onSelect,
  isCompact,
  filterFn,
}: DueDateGroupedViewProps) {
  const groupOrder = ['overdue', 'today', 'tomorrow', 'thisWeek', 'later', 'noDueDate'];
  
  return (
    <div className="space-y-6">
      {groupOrder.map((groupKey) => {
        let actions = groups[groupKey] || [];
        if (filterFn) {
          actions = actions.filter(filterFn);
        }
        
        if (actions.length === 0) return null;
        
        const groupInfo = dueDateGroupLabels[groupKey];
        
        return (
          <div key={groupKey}>
            <div className={cn("flex items-center gap-2 mb-3", groupInfo.color)}>
              {groupInfo.icon}
              <h3 className="font-medium">{groupInfo.label}</h3>
              <Badge variant="secondary" className="text-xs">
                {actions.length}
              </Badge>
            </div>
            <div className={cn("space-y-3", isCompactView && "space-y-1")}>
              {actions.map((action) => (
                <IncomingActionsCard
                  key={action.id}
                  action={action}
                  onComplete={onComplete}
                  onDismiss={onDismiss}
                  onSnooze={onSnooze}
                  onAddNote={onAddNote}
                  onQuickView={onQuickView}
                  isSelected={selectedActionIds.has(action.id)}
                  onSelect={onSelect}
                  showCheckbox={true}
                  isCompact={isCompact}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
