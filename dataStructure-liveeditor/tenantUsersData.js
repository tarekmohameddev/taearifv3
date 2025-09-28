const customerStructure = {
  // ====== Core Identifiers ======
  tenantId: "", // معرف التاجر (multi-tenant isolation)
  customerId: "",
  createdAt: "",
  updatedAt: "",
  status: "active", // active / inactive / banned / pendingVerification

  // ====== Personal Info ======
  personalInfo: {
    firstName: "",
    lastName: "",
    fullName: "",
    gender: "", // male / female / other
    dateOfBirth: "",
    profilePictureUrl: "",
    nationalId: "",
    taxId: "",
    occupation: "",
    companyName: "",
    preferredPronouns: "",
  },

  // ====== Contact Info ======
  contactInfo: {
    email: "",
    phone: "",
    alternatePhones: [],
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      whatsapp: "",
      telegram: "",
      tiktok: "",
      youtube: "",
      snapchat: "",
    },
    website: "",
  },

  // ====== Addresses ======
  addresses: [
    {
      addressId: "",
      type: "shipping", // shipping / billing / other
      country: "",
      city: "",
      state: "",
      postalCode: "",
      streetAddress: "",
      buildingNumber: "",
      floor: "",
      apartment: "",
      landmark: "",
      coordinates: {
        lat: null,
        lng: null,
      },
      timeZone: "",
      isDefault: false,
    },
  ],

  // ====== Account Settings ======
  accountSettings: {
    preferredLanguage: "",
    preferredCurrency: "",
    marketingOptIn: false,
    notificationPreferences: {
      email: true,
      sms: false,
      push: false,
      inApp: true,
    },
    loyaltyPoints: 0,
    loyaltyTier: "", // bronze / silver / gold / platinum / custom
    discountCodes: [],
    darkModeEnabled: false,
    accessibilityOptions: {
      highContrastMode: false,
      largeText: false,
    },
  },

  // ====== Purchase History ======
  purchaseHistory: {
    totalOrders: 0,
    totalSpent: 0,
    lastOrderDate: "",
    averageOrderValue: 0,
    firstOrderDate: "",
    favoriteProducts: [],
    favoriteCategories: [],
    returnedOrders: 0,
    cancelledOrders: 0,
    refundedAmount: 0,
  },

  // ====== Wishlist ======
  wishlist: [
    {
      productId: "",
      variantId: "",
      addedAt: "",
    },
  ],

  // ====== Cart ======
  cart: {
    items: [
      {
        productId: "",
        variantId: "",
        quantity: 0,
        priceAtTime: 0,
        currency: "",
        addedAt: "",
      },
    ],
    lastUpdated: "",
    abandoned: false,
    abandonedReason: "",
  },

  // ====== Tags & Notes ======
  tags: [], // (VIP, frequent-buyer, high-return-risk, etc.)
  notes: [], // ملاحظات التاجر عن العميل

  // ====== Activity Logs ======
  activityLogs: [
    {
      activityId: "",
      type: "", // login / purchase / return / review / etc.
      description: "",
      timestamp: "",
      ipAddress: "",
      userAgent: "",
      location: {
        country: "",
        city: "",
      },
    },
  ],

  // ====== Loyalty & Rewards ======
  loyalty: {
    pointsBalance: 0,
    tier: "",
    earnedHistory: [],
    redeemedHistory: [],
  },

  // ====== Referrals ======
  referrals: {
    referredBy: "",
    referralCode: "",
    referredCustomers: [],
  },

  // ====== Support & Issues ======
  supportTickets: [
    {
      ticketId: "",
      subject: "",
      status: "", // open / closed / pending
      createdAt: "",
      resolvedAt: "",
      priority: "", // low / medium / high
      assignedAgentId: "",
    },
  ],

  // ====== Payment Methods ======
  paymentMethods: [
    {
      type: "", // credit_card / paypal / bank_transfer / cash
      provider: "",
      last4: "",
      expiryDate: "",
      billingAddressId: "",
      isDefault: false,
    },
  ],

  // ====== Device & App Data ======
  devices: [
    {
      deviceId: "",
      type: "", // mobile / desktop / tablet
      os: "",
      browser: "",
      lastUsedAt: "",
    },
  ],

  // ====== Integrations ======
  integrations: {
    externalCustomerId: "",
    crmSystem: "",
    loyaltyProgramId: "",
    marketingPlatformId: "",
    posId: "",
  },

  // ====== Fraud Prevention ======
  fraudChecks: {
    flagged: false,
    reason: "",
    riskScore: 0,
  },

  // ====== Custom Fields ======
  customFields: {}, // مفتوح لأي بيانات إضافية
};

export default customerStructure;
