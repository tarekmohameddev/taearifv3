"use client";

import React, { useState, useMemo } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Filter,
  Zap,
  Search,
  LayoutList,
  LayoutGrid,
  Kanban,
  SortAsc,
  SortDesc,
  ChevronDown,
  Timer,
  CalendarDays,
  CalendarClock,
  Target,
  TrendingUp,
  MoreHorizontal,
  RefreshCcw,
  Download,
  Bell,
  FileText,
  X,
  Sparkles,
  ArrowUpRight,
  PlayCircle,
  PauseCircle,
  SkipForward,
} from "lucide-react";
import { getStageNameAr } from "@/types/unified-customer";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ActionPriority = "urgent" | "high" | "medium" | "low";
type ActionType = "call" | "email" | "meeting" | "follow_up" | "document" | "other";
type ViewMode = "list" | "grid" | "kanban";
type SortBy = "priority" | "dueDate" | "leadScore" | "customerName";
type TimeFilter = "all" | "overdue" | "today" | "thisWeek" | "upcoming";

interface RecommendedAction {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  stage: string;
  action: string;
  type: ActionType;
  priority: ActionPriority;
  dueDate?: string;
  leadScore: number;
  estimatedValue?: number;
}

const priorityColors: Record<ActionPriority, string> = {
  urgent: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300",
  high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
  low: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300",
};

const priorityBgColors: Record<ActionPriority, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const priorityLabels: Record<ActionPriority, string> = {
  urgent: "عاجل",
  high: "مهم",
  medium: "متوسط",
  low: "منخفض",
};

const actionTypeIcons: Record<ActionType, React.ReactNode> = {
  call: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  meeting: <Calendar className="h-4 w-4" />,
  follow_up: <Clock className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  other: <MessageSquare className="h-4 w-4" />,
};

const actionTypeLabels: Record<ActionType, string> = {
  call: "مكالمة",
  email: "بريد إلكتروني",
  meeting: "اجتماع",
  follow_up: "متابعة",
  document: "مستند",
  other: "أخرى",
};

const actionTypeColors: Record<ActionType, string> = {
  call: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  email: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  meeting: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  follow_up: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  document: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function ActionsPage() {
  const { customers } = useUnifiedCustomersStore();
  
  // State
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedTypes, setSelectedTypes] = useState<ActionType[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<ActionPriority[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");

  // Generate recommended actions from customers data
  const allActions: RecommendedAction[] = useMemo(() => {
    return customers
      .filter((c) => c.aiInsights.nextBestAction)
      .map((customer) => {
        let type: ActionType = "other";
        const action = customer.aiInsights.nextBestAction?.toLowerCase() || "";

        if (action.includes("اتصال") || action.includes("مكالمة") || action.includes("call")) type = "call";
        else if (action.includes("بريد") || action.includes("إيميل") || action.includes("email")) type = "email";
        else if (action.includes("اجتماع") || action.includes("موعد") || action.includes("meeting")) type = "meeting";
        else if (action.includes("متابعة") || action.includes("follow")) type = "follow_up";
        else if (action.includes("مستند") || action.includes("عقد") || action.includes("document")) type = "document";

        return {
          id: customer.id,
          customerId: customer.id,
          customerName: customer.name,
          stage: customer.stage,
          action: customer.aiInsights.nextBestAction || "",
          type,
          priority: customer.priority as ActionPriority,
          dueDate: customer.nextFollowUpDate,
          leadScore: customer.leadScore,
          estimatedValue: customer.dealValue,
        };
      });
  }, [customers]);

  // Filter and sort actions
  const filteredActions = useMemo(() => {
    let filtered = allActions.filter((a) => !completedActions.has(a.id));

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.customerName.toLowerCase().includes(query) ||
          a.action.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((a) => selectedTypes.includes(a.type));
    }

    // Priority filter
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter((a) => selectedPriorities.includes(a.priority));
    }

    // Time filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    if (timeFilter !== "all") {
      filtered = filtered.filter((a) => {
        if (!a.dueDate) return timeFilter === "upcoming";
        const dueDate = new Date(a.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        switch (timeFilter) {
          case "overdue":
            return dueDate < today;
          case "today":
            return dueDate.getTime() === today.getTime();
          case "thisWeek":
            return dueDate >= today && dueDate <= endOfWeek;
          case "upcoming":
            return dueDate > endOfWeek;
          default:
            return true;
        }
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "dueDate":
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          comparison = dateA - dateB;
          break;
        case "leadScore":
          comparison = b.leadScore - a.leadScore;
          break;
        case "customerName":
          comparison = a.customerName.localeCompare(b.customerName, "ar");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allActions, completedActions, searchQuery, selectedTypes, selectedPriorities, timeFilter, sortBy, sortOrder]);

  // Group actions by time
  const groupedByTime = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const groups = {
      overdue: [] as RecommendedAction[],
      today: [] as RecommendedAction[],
      thisWeek: [] as RecommendedAction[],
      upcoming: [] as RecommendedAction[],
      noDueDate: [] as RecommendedAction[],
    };

    filteredActions.forEach((action) => {
      if (!action.dueDate) {
        groups.noDueDate.push(action);
        return;
      }
      const dueDate = new Date(action.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) groups.overdue.push(action);
      else if (dueDate.getTime() === today.getTime()) groups.today.push(action);
      else if (dueDate <= endOfWeek) groups.thisWeek.push(action);
      else groups.upcoming.push(action);
    });

    return groups;
  }, [filteredActions]);

  // Group actions by priority
  const groupedByPriority = useMemo(() => {
    return {
      urgent: filteredActions.filter((a) => a.priority === "urgent"),
      high: filteredActions.filter((a) => a.priority === "high"),
      medium: filteredActions.filter((a) => a.priority === "medium"),
      low: filteredActions.filter((a) => a.priority === "low"),
    };
  }, [filteredActions]);

  // Group actions by type
  const groupedByType = useMemo(() => {
    const groups: Record<ActionType, RecommendedAction[]> = {
      call: [],
      email: [],
      meeting: [],
      follow_up: [],
      document: [],
      other: [],
    };
    filteredActions.forEach((action) => {
      groups[action.type].push(action);
    });
    return groups;
  }, [filteredActions]);

  // Statistics
  const stats = useMemo(() => {
    const pending = allActions.filter((a) => !completedActions.has(a.id));
    const completed = completedActions.size;
    const total = allActions.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const urgentCount = pending.filter((a) => a.priority === "urgent").length;
    const todayCount = groupedByTime.today.length;
    const overdueCount = groupedByTime.overdue.length;
    const totalValue = pending.reduce((sum, a) => sum + (a.estimatedValue || 0), 0);

    return { pending: pending.length, completed, total, completionRate, urgentCount, todayCount, overdueCount, totalValue };
  }, [allActions, completedActions, groupedByTime]);

  // Actions handlers
  const handleComplete = (id: string) => {
    setCompletedActions((prev) => new Set([...prev, id]));
    setSelectedActions((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleBulkComplete = () => {
    setCompletedActions((prev) => new Set([...prev, ...selectedActions]));
    setSelectedActions(new Set());
  };

  const handleSelectAll = () => {
    if (selectedActions.size === filteredActions.length) {
      setSelectedActions(new Set());
    } else {
      setSelectedActions(new Set(filteredActions.map((a) => a.id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedPriorities([]);
    setTimeFilter("all");
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || selectedPriorities.length > 0 || timeFilter !== "all";

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="space-y-6 p-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/ar/dashboard/customers-hub">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
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
                  إجراءات مقترحة بالذكاء الاصطناعي لتحسين أدائك
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تحديث</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تصدير</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>التنبيهات</TooltipContent>
              </Tooltip>
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
                    <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-300" />
                    <div className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(1)}م</div>
                    <div className="text-xs text-white/70">قيمة الصفقات</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters & Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                {/* Search and View Mode */}
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
                    {/* Time Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <CalendarClock className="h-4 w-4" />
                          {timeFilter === "all" ? "كل الأوقات" : 
                           timeFilter === "overdue" ? "متأخرة" :
                           timeFilter === "today" ? "اليوم" :
                           timeFilter === "thisWeek" ? "هذا الأسبوع" : "قادمة"}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTimeFilter("all")}>كل الأوقات</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFilter("overdue")}>
                          <Timer className="h-4 w-4 ml-2 text-red-500" />
                          متأخرة ({groupedByTime.overdue.length})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFilter("today")}>
                          <CalendarDays className="h-4 w-4 ml-2 text-blue-500" />
                          اليوم ({groupedByTime.today.length})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFilter("thisWeek")}>
                          <Calendar className="h-4 w-4 ml-2 text-green-500" />
                          هذا الأسبوع ({groupedByTime.thisWeek.length})
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTimeFilter("upcoming")}>
                          <CalendarClock className="h-4 w-4 ml-2 text-purple-500" />
                          قادمة ({groupedByTime.upcoming.length})
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Type Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Filter className="h-4 w-4" />
                          النوع
                          {selectedTypes.length > 0 && (
                            <Badge variant="secondary" className="mr-1">{selectedTypes.length}</Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>نوع الإجراء</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(Object.keys(actionTypeLabels) as ActionType[]).map((type) => (
                          <DropdownMenuCheckboxItem
                            key={type}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              setSelectedTypes((prev) =>
                                checked ? [...prev, type] : prev.filter((t) => t !== type)
                              );
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {actionTypeIcons[type]}
                              {actionTypeLabels[type]}
                            </span>
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
                            <Badge variant="secondary" className="mr-1">{selectedPriorities.length}</Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الأولوية</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(Object.keys(priorityLabels) as ActionPriority[]).map((priority) => (
                          <DropdownMenuCheckboxItem
                            key={priority}
                            checked={selectedPriorities.includes(priority)}
                            onCheckedChange={(checked) => {
                              setSelectedPriorities((prev) =>
                                checked ? [...prev, priority] : prev.filter((p) => p !== priority)
                              );
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", priorityBgColors[priority])} />
                              {priorityLabels[priority]}
                            </span>
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                          ترتيب
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortBy("priority")}>
                          الأولوية {sortBy === "priority" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("dueDate")}>
                          تاريخ الاستحقاق {sortBy === "dueDate" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("leadScore")}>
                          جودة العميل {sortBy === "leadScore" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("customerName")}>
                          اسم العميل {sortBy === "customerName" && "✓"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                          {sortOrder === "asc" ? "تنازلي" : "تصاعدي"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* View Mode */}
                    <div className="flex items-center border rounded-lg p-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === "list" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("list")}
                          >
                            <LayoutList className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>عرض قائمة</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("grid")}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>عرض شبكي</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={viewMode === "kanban" ? "secondary" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setViewMode("kanban")}
                          >
                            <Kanban className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>عرض كانبان</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-500">الفلاتر النشطة:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        بحث: {searchQuery}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                      </Badge>
                    )}
                    {timeFilter !== "all" && (
                      <Badge variant="secondary" className="gap-1">
                        الوقت: {timeFilter === "overdue" ? "متأخرة" : timeFilter === "today" ? "اليوم" : timeFilter === "thisWeek" ? "هذا الأسبوع" : "قادمة"}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setTimeFilter("all")} />
                      </Badge>
                    )}
                    {selectedTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="gap-1">
                        {actionTypeLabels[type]}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedTypes((prev) => prev.filter((t) => t !== type))} />
                      </Badge>
                    ))}
                    {selectedPriorities.map((priority) => (
                      <Badge key={priority} variant="secondary" className="gap-1">
                        {priorityLabels[priority]}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPriorities((prev) => prev.filter((p) => p !== priority))} />
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600">
                      مسح الكل
                    </Button>
                  </div>
                )}

                {/* Bulk Actions */}
                {selectedActions.size > 0 && (
                  <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
                    <Checkbox
                      checked={selectedActions.size === filteredActions.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">{selectedActions.size} إجراء محدد</span>
                    <div className="flex-1" />
                    <Button size="sm" onClick={handleBulkComplete} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      تحديد الكل كمكتمل
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSelectedActions(new Set())}>
                      إلغاء التحديد
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all" className="gap-2">
                <LayoutList className="h-4 w-4" />
                الكل ({filteredActions.length})
              </TabsTrigger>
              <TabsTrigger value="byTime" className="gap-2">
                <Calendar className="h-4 w-4" />
                حسب الوقت
              </TabsTrigger>
              <TabsTrigger value="byPriority" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                حسب الأولوية
              </TabsTrigger>
              <TabsTrigger value="byType" className="gap-2">
                <Filter className="h-4 w-4" />
                حسب النوع
              </TabsTrigger>
            </TabsList>

            {/* All Actions Tab */}
            <TabsContent value="all">
              {viewMode === "list" && (
                <div className="space-y-3">
                  {filteredActions.map((action) => (
                    <ActionCardEnhanced
                      key={action.id}
                      action={action}
                      onComplete={handleComplete}
                      isSelected={selectedActions.has(action.id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              )}

              {viewMode === "grid" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredActions.map((action) => (
                    <ActionCardGrid
                      key={action.id}
                      action={action}
                      onComplete={handleComplete}
                      isSelected={selectedActions.has(action.id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              )}

              {viewMode === "kanban" && (
                <div className="grid gap-4 md:grid-cols-4 overflow-x-auto">
                  {(["urgent", "high", "medium", "low"] as ActionPriority[]).map((priority) => (
                    <div key={priority} className="min-w-[280px]">
                      <div className={cn("p-3 rounded-t-lg font-semibold flex items-center justify-between", priorityColors[priority])}>
                        <span>{priorityLabels[priority]}</span>
                        <Badge variant="secondary">{groupedByPriority[priority].length}</Badge>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-900 rounded-b-lg p-2 space-y-2 min-h-[200px]">
                        {groupedByPriority[priority].map((action) => (
                          <ActionCardKanban key={action.id} action={action} onComplete={handleComplete} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* By Time Tab */}
            <TabsContent value="byTime">
              <div className="space-y-6">
                {groupedByTime.overdue.length > 0 && (
                  <TimeSection
                    title="متأخرة"
                    icon={<Timer className="h-5 w-5 text-red-500" />}
                    actions={groupedByTime.overdue}
                    onComplete={handleComplete}
                    variant="danger"
                    selectedActions={selectedActions}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
                {groupedByTime.today.length > 0 && (
                  <TimeSection
                    title="اليوم"
                    icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
                    actions={groupedByTime.today}
                    onComplete={handleComplete}
                    variant="primary"
                    selectedActions={selectedActions}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
                {groupedByTime.thisWeek.length > 0 && (
                  <TimeSection
                    title="هذا الأسبوع"
                    icon={<Calendar className="h-5 w-5 text-green-500" />}
                    actions={groupedByTime.thisWeek}
                    onComplete={handleComplete}
                    variant="success"
                    selectedActions={selectedActions}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
                {groupedByTime.upcoming.length > 0 && (
                  <TimeSection
                    title="قادمة"
                    icon={<CalendarClock className="h-5 w-5 text-purple-500" />}
                    actions={groupedByTime.upcoming}
                    onComplete={handleComplete}
                    variant="default"
                    selectedActions={selectedActions}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
                {groupedByTime.noDueDate.length > 0 && (
                  <TimeSection
                    title="بدون تاريخ"
                    icon={<Clock className="h-5 w-5 text-gray-500" />}
                    actions={groupedByTime.noDueDate}
                    onComplete={handleComplete}
                    variant="muted"
                    selectedActions={selectedActions}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
              </div>
            </TabsContent>

            {/* By Priority Tab */}
            <TabsContent value="byPriority">
              <div className="space-y-6">
                {(["urgent", "high", "medium", "low"] as ActionPriority[]).map((priority) =>
                  groupedByPriority[priority].length > 0 && (
                    <PrioritySection
                      key={priority}
                      priority={priority}
                      actions={groupedByPriority[priority]}
                      onComplete={handleComplete}
                      selectedActions={selectedActions}
                      onToggleSelect={handleToggleSelect}
                    />
                  )
                )}
              </div>
            </TabsContent>

            {/* By Type Tab */}
            <TabsContent value="byType">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(Object.keys(actionTypeLabels) as ActionType[]).map((type) =>
                  groupedByType[type].length > 0 && (
                    <TypeSection
                      key={type}
                      type={type}
                      actions={groupedByType[type]}
                      onComplete={handleComplete}
                    />
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {filteredActions.length === 0 && (
            <Card className="py-16">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
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
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// Enhanced Action Card Component
function ActionCardEnhanced({
  action,
  onComplete,
  isSelected,
  onToggleSelect,
}: {
  action: RecommendedAction;
  onComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const isOverdue = action.dueDate && new Date(action.dueDate) < new Date();

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      isSelected && "ring-2 ring-blue-500",
      isOverdue && "border-red-300 dark:border-red-800"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(action.id)}
            className="mt-1"
          />
          <div className={cn("p-3 rounded-xl", actionTypeColors[action.type])}>
            {actionTypeIcons[action.type]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Link
                href={`/ar/dashboard/customers-hub/${action.customerId}`}
                className="font-semibold text-lg hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                {action.customerName}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Badge variant="outline" className="text-xs">
                {getStageNameAr(action.stage)}
              </Badge>
              <Badge className={cn("text-xs", priorityColors[action.priority])}>
                {priorityLabels[action.priority]}
              </Badge>
              <Badge className={cn("text-xs", actionTypeColors[action.type])}>
                {actionTypeLabels[action.type]}
              </Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs gap-1">
                  <Timer className="h-3 w-3" />
                  متأخر
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{action.action}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {action.dueDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(action.dueDate).toLocaleDateString("ar-SA")}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                جودة: {action.leadScore}/100
              </span>
              {action.estimatedValue && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {(action.estimatedValue / 1000000).toFixed(1)}م ريال
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1">
                  <SkipForward className="h-4 w-4" />
                  تأجيل
                </Button>
              </TooltipTrigger>
              <TooltipContent>تأجيل الإجراء</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="gap-1" onClick={() => onComplete(action.id)}>
                  <CheckCircle2 className="h-4 w-4" />
                  تم
                </Button>
              </TooltipTrigger>
              <TooltipContent>تحديد كمكتمل</TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/ar/dashboard/customers-hub/${action.customerId}`}>
                    عرض العميل
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>إضافة ملاحظة</DropdownMenuItem>
                <DropdownMenuItem>تغيير الأولوية</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">إلغاء الإجراء</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid View Card
function ActionCardGrid({
  action,
  onComplete,
  isSelected,
  onToggleSelect,
}: {
  action: RecommendedAction;
  onComplete: (id: string) => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const isOverdue = action.dueDate && new Date(action.dueDate) < new Date();

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      isSelected && "ring-2 ring-blue-500"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(action.id)}
            />
            <div className={cn("p-2 rounded-lg", actionTypeColors[action.type])}>
              {actionTypeIcons[action.type]}
            </div>
          </div>
          <Badge className={cn("text-xs", priorityColors[action.priority])}>
            {priorityLabels[action.priority]}
          </Badge>
        </div>
        <Link
          href={`/ar/dashboard/customers-hub/${action.customerId}`}
          className="font-semibold hover:text-blue-600 transition-colors"
        >
          {action.customerName}
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{action.action}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          {action.dueDate && (
            <span className={cn("flex items-center gap-1", isOverdue && "text-red-500")}>
              <Calendar className="h-3 w-3" />
              {new Date(action.dueDate).toLocaleDateString("ar-SA")}
            </span>
          )}
          <span>جودة: {action.leadScore}</span>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 gap-1" onClick={() => onComplete(action.id)}>
            <CheckCircle2 className="h-4 w-4" />
            تم
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/ar/dashboard/customers-hub/${action.customerId}`}>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Kanban Card
function ActionCardKanban({
  action,
  onComplete,
}: {
  action: RecommendedAction;
  onComplete: (id: string) => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn("p-1.5 rounded", actionTypeColors[action.type])}>
            {actionTypeIcons[action.type]}
          </div>
          <Link
            href={`/ar/dashboard/customers-hub/${action.customerId}`}
            className="font-medium text-sm hover:text-blue-600 truncate flex-1"
          >
            {action.customerName}
          </Link>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{action.action}</p>
        <div className="flex items-center justify-between">
          {action.dueDate && (
            <span className="text-xs text-gray-500">
              {new Date(action.dueDate).toLocaleDateString("ar-SA")}
            </span>
          )}
          <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => onComplete(action.id)}>
            <CheckCircle2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Time Section Component
function TimeSection({
  title,
  icon,
  actions,
  onComplete,
  variant,
  selectedActions,
  onToggleSelect,
}: {
  title: string;
  icon: React.ReactNode;
  actions: RecommendedAction[];
  onComplete: (id: string) => void;
  variant: "danger" | "primary" | "success" | "default" | "muted";
  selectedActions: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  const variantStyles = {
    danger: "border-red-200 bg-red-50/50 dark:bg-red-950/30",
    primary: "border-blue-200 bg-blue-50/50 dark:bg-blue-950/30",
    success: "border-green-200 bg-green-50/50 dark:bg-green-950/30",
    default: "border-purple-200 bg-purple-50/50 dark:bg-purple-950/30",
    muted: "border-gray-200 bg-gray-50/50 dark:bg-gray-900/30",
  };

  return (
    <Card className={cn(variantStyles[variant])}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {icon}
            {title}
          </span>
          <Badge variant="secondary">{actions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <ActionCardEnhanced
            key={action.id}
            action={action}
            onComplete={onComplete}
            isSelected={selectedActions.has(action.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Priority Section Component
function PrioritySection({
  priority,
  actions,
  onComplete,
  selectedActions,
  onToggleSelect,
}: {
  priority: ActionPriority;
  actions: RecommendedAction[];
  onComplete: (id: string) => void;
  selectedActions: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  const icons = {
    urgent: <AlertTriangle className="h-5 w-5" />,
    high: <Clock className="h-5 w-5" />,
    medium: <Calendar className="h-5 w-5" />,
    low: <CheckCircle2 className="h-5 w-5" />,
  };

  return (
    <Card className={cn("border-2", priorityColors[priority])}>
      <CardHeader className={cn(priorityColors[priority])}>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {icons[priority]}
            {priorityLabels[priority]}
          </span>
          <Badge variant="secondary">{actions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {actions.map((action) => (
          <ActionCardEnhanced
            key={action.id}
            action={action}
            onComplete={onComplete}
            isSelected={selectedActions.has(action.id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </CardContent>
    </Card>
  );
}

// Type Section Component
function TypeSection({
  type,
  actions,
  onComplete,
}: {
  type: ActionType;
  actions: RecommendedAction[];
  onComplete: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className={cn(actionTypeColors[type])}>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {actionTypeIcons[type]}
            {actionTypeLabels[type]}
          </span>
          <Badge variant="secondary">{actions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {actions.slice(0, 5).map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className={cn("w-2 h-2 rounded-full", priorityBgColors[action.priority])} />
              <Link
                href={`/ar/dashboard/customers-hub/${action.customerId}`}
                className="font-medium text-sm hover:text-blue-600 truncate"
              >
                {action.customerName}
              </Link>
            </div>
            <Button size="sm" variant="ghost" onClick={() => onComplete(action.id)}>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {actions.length > 5 && (
          <Button variant="ghost" className="w-full text-sm">
            عرض {actions.length - 5} إجراءات إضافية
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
