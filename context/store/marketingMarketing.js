import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";

module.exports = (set, get) => ({
  // Marketing Channels
  marketingChannels: {
    channels: [],
    loading: true,
    error: null,
    isInitialized: false,
  },

  // Credits System
  creditsSystem: {
    currentCredits: 2450,
    monthlyUsage: 1250,
    monthlyLimit: 5000,
    transactions: [
      {
        id: "1",
        type: "purchase",
        amount: 2500,
        description: "شراء الباقة المتوسطة",
        date: "2024-01-20",
        phoneNumber: null,
        campaignName: null,
        status: "completed",
      },
      {
        id: "2",
        type: "usage",
        amount: -150,
        description: "إرسال رسائل حملة العروض الشتوية",
        date: "2024-01-19",
        phoneNumber: "+966501234567",
        campaignName: "العروض الشتوية",
        status: "completed",
      },
      {
        id: "3",
        type: "usage",
        amount: -75,
        description: "رسائل خدمة العملاء",
        date: "2024-01-18",
        phoneNumber: "+966559876543",
        campaignName: null,
        status: "completed",
      },
      {
        id: "4",
        type: "bonus",
        amount: 100,
        description: "مكافأة العضوية الذهبية",
        date: "2024-01-15",
        phoneNumber: null,
        campaignName: null,
        status: "completed",
      },
    ],
    usageByNumber: [
      {
        phoneNumber: "+966501234567",
        displayName: "الرقم الرئيسي للشركة",
        messagesThisMonth: 850,
        creditsUsed: 850,
        lastUsed: "2024-01-20",
      },
      {
        phoneNumber: "+966559876543",
        displayName: "رقم خدمة العملاء",
        messagesThisMonth: 400,
        creditsUsed: 400,
        lastUsed: "2024-01-19",
      },
    ],
    creditPackages: [
      { id: "1", name: "الباقة الأساسية", credits: 1000, price: 50, currency: "SAR" },
      { id: "2", name: "الباقة المتوسطة", credits: 2500, price: 100, currency: "SAR", discount: 20 },
      { id: "3", name: "الباقة المتقدمة", credits: 5000, price: 180, currency: "SAR", discount: 28, popular: true },
      { id: "4", name: "الباقة الاحترافية", credits: 10000, price: 300, currency: "SAR", discount: 40 },
    ],
  },

  // Marketing Settings
  marketingSettings: {
    messageSettings: {
      autoReply: true,
      autoReplyMessage: "شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.",
      businessHours: {
        enabled: true,
        start: "09:00",
        end: "18:00",
        timezone: "Asia/Riyadh",
      },
      rateLimiting: {
        enabled: true,
        maxMessagesPerHour: 100,
        maxMessagesPerDay: 1000,
      },
      templates: {
        welcomeMessage: "مرحباً بك في {company_name}! نحن سعداء لخدمتك.",
        thankYouMessage: "شكراً لك على اختيارك {company_name}. نقدر ثقتك بنا.",
        orderConfirmation: "تم تأكيد طلبك رقم {order_id}. سيتم التوصيل خلال {delivery_time}.",
        appointmentReminder: "تذكير: لديك موعد غداً في {appointment_time} مع {staff_name}.",
      },
    },
    notificationSettings: {
      newMessage: true,
      campaignComplete: true,
      lowCredits: true,
      systemUpdates: false,
      emailNotifications: true,
      smsNotifications: false,
    },
    systemIntegrations: {
      crm: true,
      ecommerce: false,
      appointments: true,
      analytics: true,
      webhooks: {
        enabled: false,
        url: "",
        events: [],
      },
    },
    isSaving: false,
    saveStatus: "idle", // "idle" | "success" | "error"
  },

  // Marketing Channels Actions
  setMarketingChannels: (newState) =>
    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        ...newState,
      },
    })),

  fetchMarketingChannels: async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      console.log("No token available, skipping fetchMarketingChannels");
      return;
    }

    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await axiosInstance.get("/v1/marketing/channels");

      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          channels: response.data.status === "success" ? response.data.data : [],
          loading: false,
          isInitialized: true,
        },
      }));
    } catch (error) {
      set((state) => ({
        marketingChannels: {
          ...state.marketingChannels,
          error: error.message || "حدث خطأ أثناء جلب قنوات التسويق",
          loading: false,
          isInitialized: true,
        },
      }));
    }
  },

  addMarketingChannel: (channel) => {
    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        channels: [...state.marketingChannels.channels, channel],
      },
    }));
  },

  removeMarketingChannel: (channelId) => {
    set((state) => ({
      marketingChannels: {
        ...state.marketingChannels,
        channels: state.marketingChannels.channels.filter((channel) => channel.id !== channelId),
      },
    }));
  },

  // Credits System Actions
  setCreditsSystem: (newState) =>
    set((state) => ({
      creditsSystem: {
        ...state.creditsSystem,
        ...newState,
      },
    })),

  updateCredits: (amount) => {
    set((state) => ({
      creditsSystem: {
        ...state.creditsSystem,
        currentCredits: state.creditsSystem.currentCredits + amount,
      },
    }));
  },

  addCreditTransaction: (transaction) => {
    set((state) => ({
      creditsSystem: {
        ...state.creditsSystem,
        transactions: [transaction, ...state.creditsSystem.transactions],
      },
    }));
  },

  // Marketing Settings Actions
  setMarketingSettings: (newState) =>
    set((state) => ({
      marketingSettings: {
        ...state.marketingSettings,
        ...newState,
      },
    })),

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

  updateSystemIntegrations: (settings) => {
    set((state) => ({
      marketingSettings: {
        ...state.marketingSettings,
        systemIntegrations: {
          ...state.marketingSettings.systemIntegrations,
          ...settings,
        },
      },
    }));
  },

  saveMarketingSettings: async () => {
    set((state) => ({
      marketingSettings: {
        ...state.marketingSettings,
        isSaving: true,
        saveStatus: "idle",
      },
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          isSaving: false,
          saveStatus: "success",
        },
      }));

      // Reset status after 3 seconds
      setTimeout(() => {
        set((state) => ({
          marketingSettings: {
            ...state.marketingSettings,
            saveStatus: "idle",
          },
        }));
      }, 3000);
    } catch (error) {
      set((state) => ({
        marketingSettings: {
          ...state.marketingSettings,
          isSaving: false,
          saveStatus: "error",
        },
      }));
    }
  },
});
