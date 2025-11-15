import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Customer, PipelineStage, Appointment } from "@/types/crm";

interface Reminder {
  id: string | number;
  customer_id?: string;
  title: string;
  description?: string;
  datetime: string;
  status?: "pending" | "completed" | "overdue";
  priority: number | string;
  priority_label?: string;
  type?: "call" | "meeting" | "follow_up" | "other";
  customer?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface CrmProcedure {
  id: number;
  user_id: number;
  procedure_name: string;
  color: string;
  icon: string;
  order: number;
  description?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmPriority {
  id: number;
  user_id: number;
  name: string;
  value: number;
  color: string;
  icon: string;
  order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmType {
  id: number;
  user_id: number;
  name: string;
  value: string;
  color: string;
  icon: string;
  order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface CrmStore {
  // CRM Data
  customers: Customer[];
  pipelineStages: PipelineStage[];
  appointments: Appointment[];
  reminders: Reminder[];
  procedures: CrmProcedure[];
  priorities: CrmPriority[];
  types: CrmType[];

  // Cache
  customersCache: Map<string, Customer>;
  stagesCache: Map<string, PipelineStage>;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Dialog states
  showCustomerDialog: boolean;
  showAddAppointmentDialog: boolean;
  showEditAppointmentDialog: boolean;
  showAppointmentDetailDialog: boolean;
  showAddNoteDialog: boolean;
  showAddReminderDialog: boolean;
  showEditReminderDialog: boolean;
  showAddInteractionDialog: boolean;
  showCrmSettingsDialog: boolean;
  showAddStageDialog: boolean;
  showEditStageDialog: boolean;
  showAddDealDialog: boolean;

  // Selected data
  selectedCustomer: Customer | null;
  selectedAppointment: Appointment | null;
  selectedStage: PipelineStage | null;
  selectedReminder: Reminder | null;

  // New stage data
  newStage: {
    name: string;
    description: string;
    color: string;
    iconName: string;
  };

  // New deal data (from popup)
  newDealData: {
    customer_name?: string;
    customer_phone?: string;
    stage_id?: string;
  } | null;

  // Actions
  setCustomers: (customers: Customer[]) => void;
  setPipelineStages: (stages: PipelineStage[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setReminders: (reminders: Reminder[]) => void;
  setProcedures: (procedures: CrmProcedure[]) => void;
  setPriorities: (priorities: CrmPriority[]) => void;
  setTypes: (types: CrmType[]) => void;
  updateCustomerStage: (customerId: string, newStageId: string) => Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  removeCustomer: (customerId: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (reminderId: string, updates: Partial<Reminder>) => void;
  removeReminder: (reminderId: string) => void;
  getCustomersByStage: (stageId: string) => Customer[];
  getCustomerById: (customerId: string) => Customer | undefined;
  getStageById: (stageId: string) => PipelineStage | undefined;
  getRemindersByCustomer: (customerId: string) => Reminder[];
  clearCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Dialog actions
  setShowCustomerDialog: (show: boolean) => void;
  setShowAddAppointmentDialog: (show: boolean) => void;
  setShowEditAppointmentDialog: (show: boolean) => void;
  setShowAppointmentDetailDialog: (show: boolean) => void;
  setShowAddNoteDialog: (show: boolean) => void;
  setShowAddReminderDialog: (show: boolean) => void;
  setShowEditReminderDialog: (show: boolean) => void;
  setShowAddInteractionDialog: (show: boolean) => void;
  setShowCrmSettingsDialog: (show: boolean) => void;
  setShowAddStageDialog: (show: boolean) => void;
  setShowEditStageDialog: (show: boolean) => void;
  setShowAddDealDialog: (show: boolean) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setSelectedStage: (stage: PipelineStage | null) => void;
  setSelectedReminder: (reminder: Reminder | null) => void;
  setNewStage: (stage: {
    name: string;
    description: string;
    color: string;
    iconName: string;
  }) => void;
  updateNewStage: (
    updates: Partial<{
      name: string;
      description: string;
      color: string;
      iconName: string;
    }>,
  ) => void;
  setNewDealData: (data: {
    customer_name?: string;
    customer_phone?: string;
    stage_id?: string;
  } | null) => void;
  clearNewDealData: () => void;
}

const useCrmStore = create<CrmStore>()(
  persist(
    (set, get) => ({
      // CRM Data
      customers: [],
      pipelineStages: [],
      appointments: [],
      reminders: [],
      procedures: [],
      priorities: [],
      types: [],

      // Cache
      customersCache: new Map(),
      stagesCache: new Map(),

      // Loading states
      isLoading: false,
      error: null,

      // Dialog states
      showCustomerDialog: false,
      showAddAppointmentDialog: false,
      showEditAppointmentDialog: false,
      showAppointmentDetailDialog: false,
      showAddNoteDialog: false,
      showAddReminderDialog: false,
      showEditReminderDialog: false,
      showAddInteractionDialog: false,
      showCrmSettingsDialog: false,
      showAddStageDialog: false,
      showEditStageDialog: false,
      showAddDealDialog: false,

      // Selected data
      selectedCustomer: null,
      selectedAppointment: null,
      selectedStage: null,
      selectedReminder: null,

      // New stage data
      newStage: {
        name: "",
        description: "",
        color: "bg-blue-500",
        iconName: "Target",
      },

      // New deal data
      newDealData: null,

      // Actions
      setCustomers: (customers) => {
        // Update customers and cache in one operation for better performance
        const cache = new Map();
        customers.forEach((customer) => {
          cache.set(customer.id.toString(), customer);
        });
        set({
          customers,
          customersCache: cache,
        });
      },

      setPipelineStages: (stages) => {
        // Update stages and cache in one operation for better performance
        const cache = new Map();
        stages.forEach((stage) => {
          cache.set(stage.id, stage);
        });
        set({
          pipelineStages: stages,
          stagesCache: cache,
        });
      },

      setAppointments: (appointments) => {
        set({ appointments });
      },

      setReminders: (reminders) => {
        set({ reminders });
      },

      setProcedures: (procedures) => {
        set({ procedures });
      },

      setPriorities: (priorities) => {
        set({ priorities });
      },

      setTypes: (types) => {
        set({ types });
      },

      updateCustomerStage: (customerId, newStageId) => {
        const { customers, customersCache } = get();

        // Update in memory immediately
        const updatedCustomers = customers.map((customer) =>
          customer.id.toString() === customerId
            ? { ...customer, pipelineStage: newStageId }
            : customer,
        );

        // Update cache immediately
        const updatedCache = new Map(customersCache);
        const customer = updatedCache.get(customerId);
        if (customer) {
          updatedCache.set(customerId, {
            ...customer,
            pipelineStage: newStageId,
          });
        }

        // Update state immediately
        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });

        return updatedCustomers;
      },

      addCustomer: (customer) => {
        const { customers, customersCache } = get();
        const updatedCustomers = [...customers, customer];
        const updatedCache = new Map(customersCache);
        updatedCache.set(customer.id.toString(), customer);

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      updateCustomer: (customerId, updates) => {
        const { customers, customersCache } = get();

        const updatedCustomers = customers.map((customer) =>
          customer.id.toString() === customerId
            ? { ...customer, ...updates }
            : customer,
        );

        const updatedCache = new Map(customersCache);
        const customer = updatedCache.get(customerId);
        if (customer) {
          updatedCache.set(customerId, { ...customer, ...updates });
        }

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      removeCustomer: (customerId) => {
        const { customers, customersCache } = get();
        const updatedCustomers = customers.filter(
          (customer) => customer.id.toString() !== customerId,
        );
        const updatedCache = new Map(customersCache);
        updatedCache.delete(customerId);

        set({
          customers: updatedCustomers,
          customersCache: updatedCache,
        });
      },

      addReminder: (reminder) => {
        const { reminders } = get();
        const updatedReminders = [...reminders, reminder];
        set({ reminders: updatedReminders });
      },

      updateReminder: (reminderId, updates) => {
        const { reminders } = get();
        const updatedReminders = reminders.map((reminder) =>
          reminder.id === reminderId ? { ...reminder, ...updates } : reminder,
        );
        set({ reminders: updatedReminders });
      },

      removeReminder: (reminderId) => {
        const { reminders } = get();
        const updatedReminders = reminders.filter(
          (reminder) => reminder.id !== reminderId,
        );
        set({ reminders: updatedReminders });
      },

      // Get customers by stage
      getCustomersByStage: (stageId) => {
        const { customers } = get();
        return customers.filter(
          (customer) => customer.pipelineStage === stageId,
        );
      },

      // Get customer by ID
      getCustomerById: (customerId) => {
        const { customersCache } = get();
        return customersCache.get(customerId);
      },

      // Get stage by ID
      getStageById: (stageId) => {
        const { stagesCache } = get();
        return stagesCache.get(stageId);
      },

      // Get reminders by customer
      getRemindersByCustomer: (customerId) => {
        const { reminders } = get();
        return reminders.filter(
          (reminder) => reminder.customer_id === customerId,
        );
      },

      // Clear cache
      clearCache: () => {
        set({
          customersCache: new Map(),
          stagesCache: new Map(),
        });
      },

      // Set loading state
      setLoading: (loading) => set({ isLoading: loading }),

      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Dialog actions
      setShowCustomerDialog: (show) => set({ showCustomerDialog: show }),
      setShowAddAppointmentDialog: (show) =>
        set({ showAddAppointmentDialog: show }),
      setShowEditAppointmentDialog: (show) =>
        set({ showEditAppointmentDialog: show }),
      setShowAppointmentDetailDialog: (show) =>
        set({ showAppointmentDetailDialog: show }),
      setShowAddNoteDialog: (show) => set({ showAddNoteDialog: show }),
      setShowAddReminderDialog: (show) => set({ showAddReminderDialog: show }),
      setShowEditReminderDialog: (show) =>
        set({ showEditReminderDialog: show }),
      setShowAddInteractionDialog: (show) =>
        set({ showAddInteractionDialog: show }),
      setShowCrmSettingsDialog: (show) => set({ showCrmSettingsDialog: show }),
      setShowAddStageDialog: (show) => set({ showAddStageDialog: show }),
      setShowEditStageDialog: (show) => set({ showEditStageDialog: show }),
      setShowAddDealDialog: (show) => set({ showAddDealDialog: show }),
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      setSelectedAppointment: (appointment) =>
        set({ selectedAppointment: appointment }),
      setSelectedStage: (stage) => set({ selectedStage: stage }),
      setSelectedReminder: (reminder) => set({ selectedReminder: reminder }),
      setNewStage: (stage) => set({ newStage: stage }),
      updateNewStage: (updates) => {
        const { newStage } = get();
        set({ newStage: { ...newStage, ...updates } });
      },
      setNewDealData: (data) => set({ newDealData: data }),
      clearNewDealData: () => set({ newDealData: null }),
    }),
    {
      name: "crm-store",
      partialize: (state) => ({
        customers: state.customers,
        pipelineStages: state.pipelineStages,
        appointments: state.appointments,
        reminders: state.reminders,
        procedures: state.procedures,
        priorities: state.priorities,
        types: state.types,
        newDealData: state.newDealData, // Include newDealData for persistence
      }),
    },
  ),
);

export default useCrmStore;
