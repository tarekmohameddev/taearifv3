# Marketing Store Guide

## نظرة عامة

تم إنشاء `useMarketingDashboardStore` لتجميع وإدارة جميع بيانات APIs الخاصة بالتسويق في مكان واحد. هذا الـ store يوفر واجهة موحدة للتفاعل مع جميع خدمات التسويق.

## الملفات المُنشأة

### 1. `context/store/marketingDashboard.js`
الـ store الرئيسي الذي يحتوي على:
- إدارة حالة البيانات
- دوال API calls
- إدارة الحوارات (Dialogs)
- معالجة الأخطاء

### 2. `lib/marketingApi.js`
ملف API functions منفصل يحتوي على:
- دوال API منظمة حسب النوع
- معالجة الأخطاء
- Utility functions
- Error handling

## كيفية الاستخدام

### 1. استيراد الـ Store

```javascript
import { useMarketingDashboardStore } from '@/context/store/marketingDashboard';
```

### 2. استخدام الـ Store في المكونات

```javascript
import { useMarketingDashboardStore } from '@/context/store/marketingDashboard';

function MarketingComponent() {
  const {
    // البيانات
    campaigns,
    creditSystem,
    whatsappNumbers,
    marketingSettings,
    loading,
    error,
    
    // الدوال
    createCampaign,
    fetchCreditPackages,
    fetchWhatsAppNumbers,
    fetchMarketingSettings,
  } = useMarketingDashboardStore();

  // استخدام البيانات والدوال
  return (
    <div>
      {loading && <div>جاري التحميل...</div>}
      {error && <div>خطأ: {error}</div>}
      {/* باقي المكون */}
    </div>
  );
}
```

## البيانات المتاحة

### 1. الإحصائيات
```javascript
const { statistics } = useMarketingDashboardStore();
// statistics.total_campaigns
// statistics.active_campaigns
// statistics.total_credits
// statistics.credits_used
// statistics.total_messages_sent
// statistics.success_rate
```

### 2. الحملات
```javascript
const { campaigns, activeCampaigns, completedCampaigns } = useMarketingDashboardStore();
```

### 3. النظام الائتماني
```javascript
const { creditSystem } = useMarketingDashboardStore();
// creditSystem.available_credits
// creditSystem.total_purchased
// creditSystem.total_used
// creditSystem.packages
// creditSystem.transactions
```

### 4. أرقام WhatsApp
```javascript
const { whatsappNumbers, connectedNumbers, verifiedNumbers } = useMarketingDashboardStore();
```

### 5. إعدادات التسويق
```javascript
const { marketingSettings } = useMarketingDashboardStore();
// marketingSettings.channels
// marketingSettings.integrations
// marketingSettings.pricing
```

## الدوال المتاحة

### 1. إدارة الحملات
```javascript
const {
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = useMarketingDashboardStore();

// إنشاء حملة جديدة
await createCampaign({
  name: 'حملة جديدة',
  description: 'وصف الحملة',
  channel_type: 'whatsapp',
  target_audience: 'جميع العملاء',
  message_content: 'محتوى الرسالة',
});

// تحديث حملة
await updateCampaign(campaignId, updatedData);

// حذف حملة
await deleteCampaign(campaignId);
```

### 2. النظام الائتماني
```javascript
const {
  fetchCreditPackages,
  purchaseCredits,
} = useMarketingDashboardStore();

// جلب باقات الائتمان
await fetchCreditPackages();

// شراء ائتمانات
await purchaseCredits(packageId);
```

### 3. إدارة أرقام WhatsApp
```javascript
const {
  fetchWhatsAppNumbers,
  addWhatsAppNumber,
} = useMarketingDashboardStore();

// جلب أرقام WhatsApp
await fetchWhatsAppNumbers();

// إضافة رقم جديد
await addWhatsAppNumber({
  phone_number: '+966501234567',
  display_name: 'رقم العمل',
  business_name: 'اسم الشركة',
});
```

### 4. إعدادات التسويق
```javascript
const {
  fetchMarketingSettings,
  updateMarketingSettings,
  updateSystemIntegrations,
} = useMarketingDashboardStore();

// جلب إعدادات التسويق
await fetchMarketingSettings();

// تحديث إعدادات القناة
await updateMarketingSettings(channelId, {
  crm_integration_enabled: true,
  appointment_system_integration_enabled: false,
});

// تحديث التكاملات
await updateSystemIntegrations(channelId, {
  crm_integration_enabled: true,
  appointment_system_integration_enabled: true,
  integration_settings: {
    crm_api_url: 'https://crm.example.com/api',
    crm_api_key: 'your_api_key',
  },
});
```

### 5. جلب جميع البيانات
```javascript
const { fetchAllMarketingData } = useMarketingDashboardStore();

// جلب جميع بيانات التسويق مرة واحدة
await fetchAllMarketingData();
```

## إدارة الحوارات (Dialogs)

```javascript
const {
  isCreateCampaignDialogOpen,
  openCreateCampaignDialog,
  closeCreateCampaignDialog,
} = useMarketingDashboardStore();

// فتح حوار إنشاء حملة
const handleCreateCampaign = () => {
  openCreateCampaignDialog();
};

// إغلاق الحوار
const handleCloseDialog = () => {
  closeCreateCampaignDialog();
};
```

## معالجة الأخطاء

الـ store يتعامل مع الأخطاء تلقائياً ويعرض رسائل خطأ باللغة العربية:

```javascript
const { error, loading } = useMarketingDashboardStore();

if (error) {
  console.error('خطأ:', error);
  // عرض رسالة الخطأ للمستخدم
}
```

## أمثلة عملية

### 1. صفحة إدارة الحملات
```javascript
import { useMarketingDashboardStore } from '@/context/store/marketingDashboard';

function CampaignsManagement() {
  const {
    campaigns,
    loading,
    error,
    createCampaign,
    deleteCampaign,
    openCreateCampaignDialog,
    isCreateCampaignDialogOpen,
  } = useMarketingDashboardStore();

  const handleCreateCampaign = async (campaignData) => {
    try {
      await createCampaign(campaignData);
      // تم إنشاء الحملة بنجاح
    } catch (error) {
      // معالجة الخطأ
    }
  };

  return (
    <div>
      <button onClick={openCreateCampaignDialog}>
        إنشاء حملة جديدة
      </button>
      
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          {campaign.name}
          <button onClick={() => deleteCampaign(campaign.id)}>
            حذف
          </button>
        </div>
      ))}
    </div>
  );
}
```

### 2. صفحة النظام الائتماني
```javascript
import { useMarketingDashboardStore } from '@/context/store/marketingDashboard';

function CreditSystem() {
  const {
    creditSystem,
    fetchCreditPackages,
    purchaseCredits,
    loading,
  } = useMarketingDashboardStore();

  useEffect(() => {
    fetchCreditPackages();
  }, []);

  const handlePurchaseCredits = async (packageId) => {
    try {
      await purchaseCredits(packageId);
      // تم شراء الائتمانات بنجاح
    } catch (error) {
      // معالجة الخطأ
    }
  };

  return (
    <div>
      <h2>الائتمانات المتاحة: {creditSystem.available_credits}</h2>
      
      {creditSystem.packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>الائتمانات: {pkg.credits}</p>
          <p>السعر: {pkg.price} {pkg.currency}</p>
          <button onClick={() => handlePurchaseCredits(pkg.id)}>
            شراء
          </button>
        </div>
      ))}
    </div>
  );
}
```

## ملاحظات مهمة

1. **التوافق**: الـ store متوافق مع جميع مكونات التسويق الموجودة
2. **الأداء**: يستخدم Zustand للأداء الأمثل
3. **معالجة الأخطاء**: معالجة شاملة للأخطاء مع رسائل باللغة العربية
4. **التحديث التلقائي**: تحديث البيانات تلقائياً عند إجراء العمليات
5. **الذاكرة**: إدارة ذكية للذاكرة مع reset function

## استكشاف الأخطاء

### مشاكل شائعة:
1. **خطأ 401**: تأكد من وجود token صحيح
2. **خطأ 403**: تأكد من الصلاحيات
3. **خطأ 404**: تأكد من صحة API endpoints
4. **خطأ 422**: تأكد من صحة البيانات المرسلة

### حل المشاكل:
```javascript
// فحص حالة الـ store
const { loading, error, isInitialized } = useMarketingDashboardStore();

if (!isInitialized) {
  // جلب البيانات
  fetchAllMarketingData();
}

if (error) {
  console.error('خطأ في الـ store:', error);
}
```
