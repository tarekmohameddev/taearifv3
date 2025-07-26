"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Customer, PipelineStage, Appointment } from "@/types/crm";
import useCrmStore from "@/context/store/crm";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Target,
  Handshake,
  CheckCircle,
  Calendar,
  Phone,
  Clock,
  Star,
  Award,
  User,
  Shield,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import {
  CrmStatistics,
  CrmFilters,
  PipelineBoard,
  AppointmentsList,
  RemindersList,
  CrmHeader,
  DragDropHandler,
  KeyboardNavigation,
  EnhancedDragDrop,
  DataHandler,
  Utilities,
  CustomerDetailDialog,
  AddNoteDialog,
  AddReminderDialog,
  EditReminderDialog,
  AddAppointmentDialog,
  EditAppointmentDialog,
  AddInteractionDialog,
  AddStageDialog,
  EditStageDialog,
  CrmSettingsDialog,
} from "./index";
import CrmPageSkeleton from "./crm-page-skeleton";

// Helper functions
const getStageIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Target: Target,
    Users: Users,
    Phone: Phone,
    Calendar: Calendar,
    Check: CheckCircle,
    Clock: Clock,
    Star: Star,
    Award: Award,
    User: User,
    Shield: Shield,
    Handshake: Handshake,
    TrendingUp: TrendingUp,
    "fa fa-user": User,
    "fa fa-users": Users,
    "fa fa-phone": Phone,
    "fa fa-calendar": Calendar,
    "fa fa-check": CheckCircle,
    "fa fa-clock": Clock,
    "fa fa-star": Star,
    "fa fa-trophy": Award,
    "fa fa-user-shield": Shield,
    "fa fa-check-circle": CheckCircle,
    "fa fa-handshake": Handshake,
    "fa fa-chart-line": TrendingUp,
  };

  return iconMap[iconName] || Target;
};

const getPriorityLabel = (priority: number) => {
  switch (priority) {
    case 0:
      return "منخفضة";
    case 1:
      return "متوسطة";
    case 2:
      return "عالية";
    default:
      return "متوسطة";
  }
};

// مكون الإحصائيات المدمج
const CrmStatisticsInline = ({
  totalCustomers,
  customersData,
  pipelineStages,
  pipelineStats,
  scheduledAppointments,
  totalAppointments,
}: {
  totalCustomers: number;
  customersData: Customer[];
  pipelineStages: PipelineStage[];
  pipelineStats: any[];
  scheduledAppointments: number;
  totalAppointments: number;
}) => {
  return (
    <div className="grid gap-4 mb-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Users className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">إجمالي العملاء</span>
            <span className="sm:hidden">العملاء</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{totalCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <TrendingUp className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">العملاء النشطون</span>
            <span className="sm:hidden">النشطون</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {
              customersData.filter(
                (c: Customer) => c.pipelineStage !== "closed-lost",
              ).length
            }
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Target className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">عملاء محتملون</span>
            <span className="sm:hidden">محتملون</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStages.find((s) => s.id === "2")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStages.find((s) => s.id === "2")?.value || 0) / 1000
            ).toFixed(0)}
            ك ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Handshake className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">في التفاوض</span>
            <span className="sm:hidden">تفاوض</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStats.find((s) => s.id === "negotiation")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStats.find((s) => s.id === "negotiation")?.value || 0) /
              1000
            ).toFixed(0)}
            ك ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <CheckCircle className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">صفقات مكتملة</span>
            <span className="sm:hidden">مكتملة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {pipelineStats.find((s) => s.id === "closed-won")?.count || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            {(
              (pipelineStats.find((s) => s.id === "closed-won")?.value || 0) /
              1000000
            ).toFixed(1)}
            م ريال
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium flex items-center">
            <Calendar className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">المواعيد اليوم</span>
            <span className="sm:hidden">المواعيد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">
            {scheduledAppointments}
          </div>
          <div className="text-xs text-muted-foreground">
            {totalAppointments} إجمالي
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function CrmPage() {
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CRM data states
  const [crmData, setCrmData] = useState<any>(null);
  const [appointmentsData, setAppointmentsData] = useState<Appointment[]>([]);
  const [remindersData, setRemindersData] = useState<
    {
      id: number;
      title: string;
      priority: number;
      priority_label: string;
      datetime: string;
      customer: {
        id: number;
        name: string;
      };
    }[]
  >([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Get data from store
  const {
    customers: rawCustomersData,
    pipelineStages: rawPipelineStages,
    selectedStage,
    selectedCustomer,
    selectedAppointment,
    selectedReminder,
    newStage,
    showCrmSettingsDialog,
    showAddStageDialog,
    showEditStageDialog,
    showAddNoteDialog,
    showAddReminderDialog,
    showEditReminderDialog,
    showAddInteractionDialog,
    showCustomerDialog,
    showAddAppointmentDialog,
    showEditAppointmentDialog,
    showAppointmentDetailDialog,
    setSelectedCustomer,
    setSelectedStage,
    setSelectedAppointment,
    setSelectedReminder,
    setShowCustomerDialog,
    setShowAddNoteDialog,
    setShowAddReminderDialog,
    setShowEditReminderDialog,
    setShowAddInteractionDialog,
    setShowCrmSettingsDialog,
    setShowAddStageDialog,
    setShowEditStageDialog,
    setShowAddAppointmentDialog,
    setShowEditAppointmentDialog,
    setShowAppointmentDetailDialog,
    setNewStage,
    updateCustomerStage,
    updateCustomer,
    setPipelineStages,
    setCustomers,
  } = useCrmStore();

  // Ensure pipelineStages is always an array
  const pipelineStages = Array.isArray(rawPipelineStages)
    ? rawPipelineStages
    : [];
  const customersData = Array.isArray(rawCustomersData) ? rawCustomersData : [];

  const [activeTab, setActiveTab] = useState("crm");
  const [activeView, setActiveView] = useState("pipeline"); // pipeline, appointments, analytics
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");

  // Enhanced drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [dragPreview, setDragPreview] = useState<Customer | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Keyboard navigation states
  const [focusedCustomer, setFocusedCustomer] = useState<Customer | null>(null);
  const [focusedStage, setFocusedStage] = useState<PipelineStage | null>(null);

  // Initialize handlers
  const dataHandler = {
    fetchCrmData: async () => {
      setLoading(true);
      try {
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

          // Transform customers data
          const allCustomers = crmData.stages_with_customers.flatMap(
            (stage: any) =>
              (stage.customers || []).map((customer: any) => ({
                id: customer.customer_id,
                customer_id: customer.customer_id,
                name: customer.name || "",
                nameEn: customer.name || "",
                email: customer.email || "",
                phone: customer.phone || "",
                whatsapp: customer.whatsapp || "",
                customerType: customer.customer_type || "",
                city: customer.city?.name_ar || customer.city || "",
                district: customer.district || "",
                assignedAgent: customer.assigned_agent || "",
                lastContact: customer.last_contact || "",
                urgency: customer.priority
                  ? getPriorityLabel(customer.priority)
                  : "",
                pipelineStage: String(stage.stage_id),
                stage_id: String(stage.stage_id),
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

          // Update store
          setPipelineStages(transformedStages);
          setCustomers(allCustomers);
          setCrmData(crmData);
          setTotalCustomers(crmData.total_customers || 0);
        }
      } catch (err) {
        console.error("Error fetching CRM data:", err);
        setError("فشل في تحميل بيانات الـ CRM");
      } finally {
        setLoading(false);
      }
    },
    fetchAppointmentsData: async () => {
      try {
        const response = await axiosInstance.get("/crm/customer-appointments");
        const appointmentsResponse = response.data;

        if (appointmentsResponse.status === "success") {
          setAppointmentsData(appointmentsResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching appointments data:", err);
      }
    },
    fetchRemindersData: async () => {
      try {
        const response = await axiosInstance.get("/crm/customer-reminders");
        const remindersResponse = response.data;

        if (remindersResponse.status === "success") {
          // Transform API data to match component interface
          const transformedReminders = (remindersResponse.data || []).map(
            (reminder: any) => ({
              id: reminder.id,
              title: reminder.title,
              priority: reminder.priority,
              priority_label: reminder.priority_label,
              datetime: reminder.datetime,
              customer: reminder.customer,
            }),
          );
          setRemindersData(transformedReminders);
        }
      } catch (err) {
        console.error("Error fetching reminders data:", err);
      }
    },
    updateCustomerStage: async (customerId: string, stageId: string) => {
      try {
        // Use a faster timeout for better UX
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await axiosInstance.post(
          `/crm/customers/${customerId}/change-stage`,
          {
            stage_id: parseInt(stageId),
          },
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.data.status === "success") {
          return true;
        }
        return false;
      } catch (err) {
        console.error("Error updating customer stage:", err);
        return false;
      }
    },
    updateCustomer: async (customerId: string, updates: any) => {
      try {
        await axiosInstance.put(`/crm/customers/${customerId}`, updates);
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
  };

  const utilities = Utilities({
    onAnnounceToScreenReader: (message) => {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.setAttribute("aria-atomic", "true");
      announcement.className = "sr-only";
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    },
    onShowSuccessAnimation: (stageId) => {
      const stageElement = document.querySelector(
        `[data-stage-id="${stageId}"]`,
      );
      if (stageElement) {
        // Add immediate visual feedback
        stageElement.classList.add(
          "animate-pulse",
          "ring-2",
          "ring-green-500",
          "scale-105",
        );
        setTimeout(() => {
          stageElement.classList.remove(
            "animate-pulse",
            "ring-2",
            "ring-green-500",
            "scale-105",
          );
        }, 300); // Shorter animation for faster feedback
      }
    },
  });

  const enhancedDragDrop = EnhancedDragDrop({
    isDragging,
    draggedCustomer: dragPreview,
    dragOverStage,
    dragPreview,
    dragOffset,
    onDragStart: (e, customer) => {
      setIsDragging(true);
      setDragPreview(customer);
      setDragOffset({
        x: e.clientX - e.currentTarget.getBoundingClientRect().left,
        y: e.clientY - e.currentTarget.getBoundingClientRect().top,
      });
    },
    onDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onDragOver: (e, stageId) => setDragOverStage(stageId),
    onDragLeave: (e, stageId) => setDragOverStage(null),
    onDrop: async (e, stageId) => {
      if (dragPreview && dragPreview.pipelineStage !== stageId) {
        const originalStage = dragPreview.pipelineStage;
        const customerName = dragPreview.name;

        updateCustomerStage(dragPreview.id, stageId);

        utilities.showSuccessAnimation(stageId);
        utilities.announceToScreenReader(`تم نقل العميل ${customerName} بنجاح`);

        dataHandler
          .updateCustomerStage(dragPreview.id, stageId)
          .then((success) => {
            if (!success) {
              // Revert if API fails
              updateCustomerStage(dragPreview.id, originalStage);
              utilities.announceToScreenReader(
                `فشل في نقل العميل ${customerName}`,
              );
            }
          })
          .catch((error) => {
            // Revert if API fails
            updateCustomerStage(dragPreview.id, originalStage);
            utilities.announceToScreenReader(
              `فشل في نقل العميل ${customerName}`,
            );
          });
      }
    },
    onMouseMove: (e) => {
      if (isDragging && dragPreview) {
        // Update drag preview position
      }
    },
    onGlobalDragEnd: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onGlobalDragCancel: () => {
      setIsDragging(false);
      setDragPreview(null);
      setDragOverStage(null);
    },
    onAnnounceToScreenReader: utilities.announceToScreenReader,
    onShowSuccessAnimation: utilities.showSuccessAnimation,
  });

  const keyboardNavigation = KeyboardNavigation({
    focusedCustomer,
    focusedStage,
    pipelineStages,
    onKeyDown: (e, customer, stageId) => {
    },
    onMoveCustomerToStage: async (customer, targetStageId) => {
      const success = await dataHandler.updateCustomerStage(
        customer.id,
        targetStageId,
      );
      if (success) {
        updateCustomerStage(customer.id, targetStageId);
      }
    },
    onSetFocusedCustomer: setFocusedCustomer,
    onSetFocusedStage: setFocusedStage,
    onAnnounceToScreenReader: utilities.announceToScreenReader,
  });

  const updateRemindersList = (newReminder: any) => {
    setRemindersData((prev) => [newReminder, ...prev]);
  };

  const updateAppointmentsList = (newAppointment: any) => {
    setAppointmentsData((prev) => [newAppointment, ...prev]);
  };

  const updateReminderInList = (updatedReminder: any) => {
    setRemindersData((prev) =>
      prev.map((reminder) =>
        reminder.id === updatedReminder.id ? updatedReminder : reminder,
      ),
    );
  };

  const updateAppointmentInList = (updatedAppointment: any) => {
    setAppointmentsData((prev) =>
      prev.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? updatedAppointment
          : appointment,
      ),
    );
  };

  const updateStagesList = (newStage: any) => {
    setPipelineStages([...pipelineStages, newStage]);
  };

  const updateStageInList = (updatedStage: any) => {
    setPipelineStages(
      pipelineStages.map((stage: PipelineStage) =>
        stage.id === updatedStage.id ? updatedStage : stage,
      ),
    );
  };

  const removeStageFromList = (stageId: string) => {
    setPipelineStages(
      pipelineStages.filter((stage: PipelineStage) => stage.id !== stageId),
    );
  };

  useEffect(() => {
    dataHandler.fetchCrmData();
    dataHandler.fetchAppointmentsData();
    dataHandler.fetchRemindersData();
  }, []);

  const filteredCustomers = customersData.filter((customer: Customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage =
      filterStage === "all" || customer.pipelineStage === filterStage;
    const matchesType =
      filterType === "all" || customer.customerType === filterType;
    const matchesCity = filterCity === "all" || customer.city === filterCity;
    const matchesUrgency =
      filterUrgency === "all" ||
      (filterUrgency !== "all" && customer.urgency === filterUrgency);

    return (
      matchesSearch &&
      matchesStage &&
      matchesType &&
      matchesCity &&
      matchesUrgency
    );
  });

  const pipelineStats = pipelineStages.map((stage: PipelineStage) => ({
    ...stage,
    count: customersData.filter((c: Customer) => c.pipelineStage === stage.id)
      .length,
    value: customersData
      .filter((c: Customer) => c.pipelineStage === stage.id)
      .reduce((sum: number, c: Customer) => sum + (c.dealValue || 0), 0),
  }));

  // Appointment statistics
  const allAppointments = customersData.flatMap(
    (customer: Customer) =>
      customer.appointments?.map((appointment: Appointment) => ({
        ...appointment,
        customer,
      })) || [],
  );
  const totalAppointments = allAppointments.length;
  const scheduledAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مجدول",
  ).length;
  const completedAppointments = allAppointments.filter(
    (app: Appointment) => app.status === "مكتمل",
  ).length;

  // Event handlers
  const handleRefresh = () => {
    dataHandler.fetchCrmData();
    dataHandler.fetchAppointmentsData();
    dataHandler.fetchRemindersData();
  };

  const handleSettings = () => {
    setShowCrmSettingsDialog(true);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleAddNote = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddNoteDialog(true);
  };

  const handleAddReminder = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddReminderDialog(true);
  };

  const handleAddGeneralReminder = () => {
    setShowAddReminderDialog(true);
  };

  const handleAddInteraction = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowAddInteractionDialog(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetailDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditAppointmentDialog(true);
  };

  const handleAddAppointment = () => {
    setShowAddAppointmentDialog(true);
  };

  const handleViewReminder = (reminder: any) => {
    setSelectedReminder(reminder);
  };

  const handleEditReminder = (reminder: any) => {
    setSelectedReminder(reminder);
    setShowEditReminderDialog(true);
  };

  const handleCompleteReminder = async (reminder: any) => {
    try {
      const response = await axiosInstance.put(
        `/crm/customer-reminders/${reminder.id}`,
        {
          status: "completed",
        },
      );
      if (response.data.status === "success") {
        const updatedReminder = {
          ...reminder,
          status: "completed",
        };
        updateReminderInList(updatedReminder);
      }
    } catch (err) {
      console.error("Error completing reminder:", err);
    }
  };

  // عرض loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <CrmPageSkeleton />
      </div>
      </div>
    );
  }

  // عرض error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">خطأ في تحميل البيانات</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <CrmHeader onRefresh={handleRefresh} onSettings={handleSettings} />

            {/* Statistics */}
            <CrmStatisticsInline
              totalCustomers={totalCustomers}
              customersData={customersData}
              pipelineStages={pipelineStages}
              pipelineStats={pipelineStats}
              scheduledAppointments={scheduledAppointments}
              totalAppointments={totalAppointments}
            />

            {/* Filters */}
            <CrmFilters
              activeView={activeView}
              setActiveView={setActiveView}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStage={filterStage}
              setFilterStage={setFilterStage}
              filterUrgency={filterUrgency}
              setFilterUrgency={setFilterUrgency}
              pipelineStages={pipelineStages}
            />

            {/* Main Content */}
            {/* مراحل العملاء */}
            {activeView === "pipeline" && (
              <PipelineBoard
                pipelineStages={pipelineStages}
                customersData={customersData}
                filteredCustomers={filteredCustomers}
                isDragging={isDragging}
                draggedCustomer={dragPreview}
                dragOverStage={dragOverStage}
                focusedCustomer={focusedCustomer}
                onDragStart={enhancedDragDrop.handleDragStart}
                onDragEnd={enhancedDragDrop.handleDragEnd}
                onDragOver={enhancedDragDrop.handleDragOver}
                onDragLeave={enhancedDragDrop.handleDragLeave}
                onDrop={enhancedDragDrop.handleDrop}
                onKeyDown={keyboardNavigation.handleKeyDown}
                onViewDetails={handleViewDetails}
                onAddNote={handleAddNote}
                onAddReminder={handleAddReminder}
                onAddInteraction={handleAddInteraction}
              />
            )}

            {/* المواعيد */}
            {activeView === "appointments" && (
              <AppointmentsList
                appointmentsData={appointmentsData}
                onViewAppointment={handleViewAppointment}
                onEditAppointment={handleEditAppointment}
                onAddAppointment={handleAddAppointment}
              />
            )}

            {/* التذكيرات */}
            {activeView === "reminders" && (
              <RemindersList
                remindersData={remindersData}
                onViewReminder={handleViewReminder}
                onEditReminder={handleEditReminder}
                onAddReminder={handleAddGeneralReminder}
                onCompleteReminder={handleCompleteReminder}
              />
            )}

            {/* التحليلات */}
            {activeView === "analytics" && (
              <CrmStatistics
                totalCustomers={totalCustomers}
                customersData={customersData}
                pipelineStages={pipelineStages}
                pipelineStats={pipelineStats}
                scheduledAppointments={scheduledAppointments}
                totalAppointments={totalAppointments}
              />
            )}

            {/* Drag Preview */}
            <DragDropHandler
              isDragging={isDragging}
              draggedCustomer={dragPreview}
              dragPreview={dragPreview}
              dragOffset={dragOffset}
              onMouseMove={enhancedDragDrop.handleMouseMove}
              onGlobalDragEnd={enhancedDragDrop.handleGlobalDragEnd}
              onGlobalDragCancel={enhancedDragDrop.handleGlobalDragCancel}
            />

            {/* Dialogs */}
            <CustomerDetailDialog />
            <AddNoteDialog />
            <AddReminderDialog onReminderAdded={updateRemindersList} />
            <EditReminderDialog onReminderUpdated={updateReminderInList} />
            <AddAppointmentDialog onAppointmentAdded={updateAppointmentsList} />
            <EditAppointmentDialog
              onAppointmentUpdated={updateAppointmentInList}
            />
            <AddInteractionDialog />
            <AddStageDialog onStageAdded={updateStagesList} />
            <EditStageDialog onStageUpdated={updateStageInList} />
            <CrmSettingsDialog onStageDeleted={removeStageFromList} />
          </div>
        </main>
      </div>
    </div>
  );
}
