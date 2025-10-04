import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axiosInstance";

export const useMarketingDashboardStore = create()(
  persist(
    (set, get) => ({
  // البيانات الأساسية
  dashboardData: null,
  loading: false,
  error: null,
  isInitialized: false,

  // بيانات الإحصائيات
  statistics: {
    total_campaigns: 0,
    active_campaigns: 0,
    total_credits: 0,
    credits_used: 0,
    total_messages_sent: 0,
    success_rate: 0,
  },

  // بيانات الحملات
  campaigns: [],
  activeCampaigns: [],
  completedCampaigns: [],

  // بيانات النظام الائتماني
  creditSystem: {
    available_credits: 0,
    total_purchased: 0,
    total_used: 0,
    packages: [],
    transactions: [],
  },

  // بيانات إدارة أرقام WhatsApp
  whatsappNumbers: [],
  connectedNumbers: [],
  verifiedNumbers: [],

  // بيانات إعدادات التسويق
  marketingSettings: {
    channels: [],
    integrations: {
      crm_enabled: false,
      appointment_system_enabled: false,
    },
    pricing: [],
  },

  // Dialog states
  isCreateCampaignDialogOpen: false,
  isEditCampaignDialogOpen: false,
  isCreditSystemDialogOpen: false,
  isWhatsAppNumbersDialogOpen: false,
  isMarketingSettingsDialogOpen: false,

  // Actions
  setDashboardData: (data) =>
    set({
      dashboardData: data,
      statistics: data.statistics || get().statistics,
      campaigns: data.campaigns || [],
      activeCampaigns: data.active_campaigns || [],
      completedCampaigns: data.completed_campaigns || [],
      creditSystem: data.credit_system || get().creditSystem,
      whatsappNumbers: data.whatsapp_numbers || [],
      marketingSettings: data.marketing_settings || get().marketingSettings,
      isInitialized: true,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  // Campaign Management Actions
  createCampaign: async (campaignData) => {
    set({ loading: true, error: null });
    try {
      const newCampaign = await campaignApi.createCampaign(campaignData);
      set((state) => ({
        campaigns: [...state.campaigns, newCampaign.data],
        loading: false,
      }));
      return newCampaign;
    } catch (error) {
      const errorMessage = handleMarketingApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateCampaign: async (campaignId, campaignData) => {
    set({ loading: true, error: null });
    try {
      const updatedCampaign = await campaignApi.updateCampaign(campaignId, campaignData);
      set((state) => ({
        campaigns: state.campaigns.map(campaign =>
          campaign.id === campaignId ? updatedCampaign.data : campaign
        ),
        loading: false,
      }));
      return updatedCampaign;
    } catch (error) {
      const errorMessage = handleMarketingApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteCampaign: async (campaignId) => {
    set({ loading: true, error: null });
    try {
      await campaignApi.deleteCampaign(campaignId);
      set((state) => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== campaignId),
        loading: false,
      }));
      return true;
    } catch (error) {
      const errorMessage = handleMarketingApiError(error);
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Credit System Actions
  fetchCreditPackages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/v1/marketing/credit-packages');
      set((state) => ({
        creditSystem: {
          ...state.creditSystem,
          packages: response.data.packages || [],
        },
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  purchaseCredits: async (packageId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/v1/marketing/credits/purchase', {
        package_id: packageId,
      });
      set((state) => ({
        creditSystem: {
          ...state.creditSystem,
          available_credits: response.data.available_credits,
          total_purchased: response.data.total_purchased,
        },
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // WhatsApp Numbers Management Actions
  fetchWhatsAppNumbers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/v1/marketing/whatsapp-numbers');
      set((state) => ({
        whatsappNumbers: response.data.numbers || [],
        connectedNumbers: response.data.numbers?.filter(num => num.is_connected) || [],
        verifiedNumbers: response.data.numbers?.filter(num => num.is_verified) || [],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addWhatsAppNumber: async (numberData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/v1/marketing/whatsapp-numbers', numberData);
      set((state) => ({
        whatsappNumbers: [...state.whatsappNumbers, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Marketing Settings Actions
  fetchMarketingSettings: async () => {
    set({ loading: true, error: null });
    try {
      // تحميل البيانات محلياً بدلاً من API call
      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          channels: state.marketingSettings.channels || [],
        },
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateMarketingSettings: async (channelId, settings) => {
    set({ loading: true, error: null });
    try {
      // تحديث محلي للبيانات
      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          channels: state.marketingSettings.channels.map(channel =>
            channel.channel_id === channelId ? { ...channel, ...settings } : channel
          ),
        },
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateSystemIntegrations: async (integrations) => {
    set({ loading: true, error: null });
    try {
      // تحديث محلي للبيانات
      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          systemIntegrations: {
            ...state.marketingSettings.systemIntegrations,
            ...integrations,
          },
        },
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Save all marketing settings
  saveMarketingSettings: async (settings) => {
    set({ 
      loading: true, 
      error: null,
      marketingSettings: {
        ...get().marketingSettings,
        isSaving: true,
      }
    });
    try {
      // فلترة البيانات لتجنب DOM elements
      const filteredSettings = JSON.parse(JSON.stringify(settings, (key, value) => {
        // تجاهل DOM elements و React components
        if (value && typeof value === 'object' && (
          value.constructor === HTMLButtonElement ||
          value.constructor === HTMLInputElement ||
          value.constructor === HTMLTextAreaElement ||
          value.constructor === HTMLSelectElement ||
          value.__reactFiber$ ||
          value.__reactInternalInstance$ ||
          value.nodeType
        )) {
          return undefined;
        }
        return value;
      }));
      
      // تحديث محلي للبيانات
      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          ...filteredSettings,
          isSaving: false,
        },
        loading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.message, 
        loading: false,
        marketingSettings: {
          ...get().marketingSettings,
          isSaving: false,
        }
      });
      throw error;
    }
  },

  // Update message settings
  updateMessageSettings: (settings) => {
    set((state) => ({
      marketingSettings: {
        ...state.marketingSettings,
        messageSettings: {
          ...state.marketingSettings.messageSettings,
          ...settings,
        },
      },
    }));
  },

  // Update notification settings
  updateNotificationSettings: (settings) => {
    set((state) => ({
      marketingSettings: {
        ...state.marketingSettings,
        notificationSettings: {
          ...state.marketingSettings.notificationSettings,
          ...settings,
        },
      },
    }));
  },

  // Dialog actions
  openCreateCampaignDialog: () => set({ isCreateCampaignDialogOpen: true }),
  closeCreateCampaignDialog: () => set({ isCreateCampaignDialogOpen: false }),

  openEditCampaignDialog: () => set({ isEditCampaignDialogOpen: true }),
  closeEditCampaignDialog: () => set({ isEditCampaignDialogOpen: false }),

  openCreditSystemDialog: () => set({ isCreditSystemDialogOpen: true }),
  closeCreditSystemDialog: () => set({ isCreditSystemDialogOpen: false }),

  openWhatsAppNumbersDialog: () => set({ isWhatsAppNumbersDialogOpen: true }),
  closeWhatsAppNumbersDialog: () => set({ isWhatsAppNumbersDialogOpen: false }),

  openMarketingSettingsDialog: () => set({ isMarketingSettingsDialogOpen: true }),
  closeMarketingSettingsDialog: () => set({ isMarketingSettingsDialogOpen: false }),

  // Reset function
  reset: () =>
    set({
      dashboardData: null,
      loading: false,
      error: null,
      isInitialized: false,
      statistics: {
        total_campaigns: 0,
        active_campaigns: 0,
        total_credits: 0,
        credits_used: 0,
        total_messages_sent: 0,
        success_rate: 0,
      },
      campaigns: [],
      activeCampaigns: [],
      completedCampaigns: [],
      creditSystem: {
        available_credits: 0,
        total_purchased: 0,
        total_used: 0,
        packages: [],
        transactions: [],
      },
      whatsappNumbers: [],
      connectedNumbers: [],
      verifiedNumbers: [],
      marketingSettings: {
        channels: [],
        integrations: {
          crm_enabled: false,
          appointment_system_enabled: false,
        },
        systemIntegrations: {
          crm: false,
          appointment_system: false,
          analytics: false,
          email_marketing: false,
          social_media: false,
          ecommerce: false,
          appointments: false,
          webhooks: {
            enabled: false,
            url: "",
            events: [],
          },
        },
        pricing: [],
        isSaving: false,
        messageSettings: {
          autoReply: false,
          autoReplyMessage: "",
          businessHours: {
            enabled: false,
            start: "09:00",
            end: "17:00",
          },
          rateLimiting: {
            enabled: false,
            maxMessagesPerHour: 100,
            maxMessagesPerDay: 1000,
          },
          templates: {
            welcomeMessage: "",
            thankYouMessage: "",
            followUpMessage: "",
            reminderMessage: "",
            orderConfirmation: "",
            appointmentReminder: "",
            paymentConfirmation: "",
          },
        },
        notificationSettings: {
          email: true,
          sms: false,
          push: true,
          events: [],
          newMessage: true,
          campaignUpdate: true,
          creditLow: true,
          systemAlert: true,
        },
      },
      isCreateCampaignDialogOpen: false,
      isEditCampaignDialogOpen: false,
      isCreditSystemDialogOpen: false,
      isWhatsAppNumbersDialogOpen: false,
      isMarketingSettingsDialogOpen: false,
    }),

  // Fetch all marketing data
  fetchAllMarketingData: async () => {
    set({ loading: true, error: null });
    try {
      // تحميل البيانات محلياً بدلاً من API calls
      set({
        campaigns: get().campaigns || [],
        creditSystem: {
          ...get().creditSystem,
          available_credits: get().creditSystem.available_credits || 0,
          total_purchased: get().creditSystem.total_purchased || 0,
          packages: get().creditSystem.packages || [],
          transactions: get().creditSystem.transactions || [],
        },
        whatsappNumbers: get().whatsappNumbers || [],
        connectedNumbers: get().connectedNumbers || [],
        verifiedNumbers: get().verifiedNumbers || [],
        marketingSettings: {
          ...get().marketingSettings,
          channels: get().marketingSettings.channels || [],
          integrations: get().marketingSettings.integrations || {},
        },
        statistics: get().statistics || {
          total_campaigns: 0,
          active_campaigns: 0,
          total_credits: 0,
          credits_used: 0,
          total_messages_sent: 0,
          success_rate: 0,
        },
        loading: false,
        isInitialized: true,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
    }),
    {
      name: "marketing-dashboard-storage",
      partialize: (state) => ({
        campaigns: state.campaigns,
        creditSystem: state.creditSystem,
        whatsappNumbers: state.whatsappNumbers,
        marketingSettings: state.marketingSettings,
        statistics: state.statistics,
      }),
    }
  )
);
