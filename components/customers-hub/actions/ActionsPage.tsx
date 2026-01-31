"use client";

import React, { useState, useMemo } from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IncomingActionsCard } from "./IncomingActionsCard";
import { SourceBadge } from "./SourceBadge";
import type { CustomerAction, CustomerActionType, CustomerSource, Priority } from "@/types/unified-customer";
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
  const { customers, actions, completeAction, dismissAction, snoozeAction } = useUnifiedCustomersStore();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedSources, setSelectedSources] = useState<CustomerSource[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CustomerActionType[]>([]);

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

    return sortActionsByPriority(filtered);
  }, [allActions, searchQuery, selectedSources, selectedPriorities, selectedTypes]);

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
  };

  const handleDismiss = (actionId: string) => {
    dismissAction(actionId);
  };

  const handleSnooze = (actionId: string, until: string) => {
    snoozeAction(actionId, until);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSources([]);
    setSelectedPriorities([]);
    setSelectedTypes([]);
  };

  const hasActiveFilters =
    searchQuery || selectedSources.length > 0 || selectedPriorities.length > 0 || selectedTypes.length > 0;

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
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
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
          <TabsList className="grid w-full grid-cols-4 mb-4">
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
          </TabsList>

          {/* Incoming Tab */}
          <TabsContent value="incoming">
            <div className="space-y-3">
              {incomingActions.length === 0 ? (
                <Card className="py-16">
                  <CardContent className="text-center">
                    <Inbox className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">لا توجد إجراءات واردة</h3>
                    <p className="text-gray-500">جميع العملاء الجدد تمت معالجتهم</p>
                  </CardContent>
                </Card>
              ) : (
                incomingActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Follow-up Tab */}
          <TabsContent value="followup">
            <div className="space-y-3">
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
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* AI Recommended Tab */}
          <TabsContent value="ai">
            <div className="space-y-3">
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
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* All Actions Tab */}
          <TabsContent value="all">
            <div className="space-y-3">
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
              ) : (
                filteredActions.map((action) => (
                  <IncomingActionsCard
                    key={action.id}
                    action={action}
                    onComplete={handleComplete}
                    onDismiss={handleDismiss}
                    onSnooze={handleSnooze}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
