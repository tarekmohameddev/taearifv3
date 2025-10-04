# Marketing Store Usage Guide

## نظرة عامة

تم تحديث `context/store/marketingDashboard.js` ليعمل بنفس نظام `context/store/crm.ts`:
- ✅ استخدام `axiosInstance` مباشرة بدلاً من ملف API منفصل
- ✅ استخدام `persist` middleware من Zustand
- ✅ تخزين البيانات في localStorage تلقائياً
- ✅ معالجة شاملة للأخطاء

## التغييرات الرئيسية

### 1. حذف `lib/marketingApi.js`
تم حذف الملف المنفصل واستخدام `axiosInstance` مباشرة في الـ store

### 2. إضافة Persist Middleware
```javascript
export const useMarketingDashboardStore = create()(
  persist(
    (set, get) => ({
      // ... state and actions
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
```

### 3. استخدام axiosInstance مباشرة
```javascript
// قبل (باستخدام ملف API منفصل):
const data = await campaignApi.getAllCampaigns();

// بعد (باستخدام axiosInstance مباشرة):
const response = await axiosInstance.get('/api/marketing/campaigns');
const data = response.data;
```

## كيفية الاستخدام

### 1. استيراد الـ Store
```javascript
import { useMarketingDashboardStore } from '@/context/store/marketingDashboard';
```

### 2. استخدام الـ Store في المكونات
```javascript
function MarketingComponent() {
  const {
    campaigns,
    creditSystem,
    whatsappNumbers,
    loading,
    error,
    fetchAllMarketingData,
    createCampaign,
    purchaseCredits,
  } = useMarketingDashboardStore();

  useEffect(() => {
    fetchAllMarketingData();
  }, [fetchAllMarketingData]);

  return (
    <div>
      {loading && <div>جاري التحميل...</div>}
      {error && <div>خطأ: {error}</div>}
      {/* باقي المكون */}
    </div>
  );
}
```

## الدوال المتاحة

### Campaign Management
```javascript
const { 
  campaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign 
} = useMarketingDashboardStore();

// إنشاء حملة
await createCampaign({
  name: 'حملة جديدة',
  description: 'وصف الحملة',
  channel_type: 'whatsapp',
  target_audience: 'جميع العملاء',
  message_content: 'محتوى الرسالة',
});
```

### Credit System
```javascript
const {
  creditSystem,
  fetchCreditPackages,
  purchaseCredits
} = useMarketingDashboardStore();

// جلب باقات الائتمان
await fetchCreditPackages();

// شراء ائتمانات
await purchaseCredits(packageId);
```

### WhatsApp Numbers Management
```javascript
const {
  whatsappNumbers,
  connectedNumbers,
  verifiedNumbers,
  fetchWhatsAppNumbers,
  addWhatsAppNumber
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

### Marketing Settings
```javascript
const {
  marketingSettings,
  fetchMarketingSettings,
  updateMarketingSettings,
  updateSystemIntegrations
} = useMarketingDashboardStore();

// جلب الإعدادات
await fetchMarketingSettings();

// تحديث إعدادات القناة
await updateMarketingSettings(channelId, {
  crm_integration_enabled: true,
});

// تحديث التكاملات
await updateSystemIntegrations(channelId, {
  crm_integration_enabled: true,
  appointment_system_integration_enabled: true,
});
```

## مميزات Persist

### تخزين تلقائي
- يتم حفظ البيانات تلقائياً في localStorage
- يتم استرجاع البيانات عند إعادة تحميل الصفحة
- يحتفظ بالبيانات المهمة فقط (partialize)

### البيانات المحفوظة
```javascript
{
  campaigns: [],         // الحملات
  creditSystem: {},      // النظام الائتماني
  whatsappNumbers: [],   // أرقام WhatsApp
  marketingSettings: {}, // الإعدادات
  statistics: {},        // الإحصائيات
}
```

## API Endpoints

جميع الـ API calls تستخدم `axiosInstance` من `lib/axios`:

### Campaigns
- `GET /api/marketing/campaigns` - جلب جميع الحملات
- `POST /api/marketing/campaigns` - إنشاء حملة جديدة
- `PUT /api/marketing/campaigns/:id` - تحديث حملة
- `DELETE /api/marketing/campaigns/:id` - حذف حملة

### Credits
- `GET /api/marketing/credit-packages` - جلب باقات الائتمان
- `GET /api/marketing/credits` - جلب بيانات الائتمان
- `POST /api/marketing/credits/purchase` - شراء ائتمانات

### WhatsApp
- `GET /api/marketing/whatsapp-numbers` - جلب أرقام WhatsApp
- `POST /api/marketing/whatsapp-numbers` - إضافة رقم جديد
- `DELETE /api/marketing/whatsapp-numbers/:id` - حذف رقم

### Settings
- `GET /api/marketing/settings` - جلب الإعدادات
- `PUT /api/marketing/channels/:id/settings` - تحديث إعدادات القناة
- `PATCH /api/marketing/channels/:id/system-integrations` - تحديث التكاملات

### Statistics
- `GET /api/marketing/dashboard-stats` - جلب إحصائيات Dashboard

## معالجة الأخطاء

```javascript
try {
  await createCampaign(campaignData);
  // نجح
} catch (error) {
  // معالجة الخطأ
  console.error(error.message);
}
```

الـ store يحدث حالة `error` تلقائياً عند حدوث خطأ:
```javascript
const { error } = useMarketingDashboardStore();

if (error) {
  // عرض رسالة الخطأ
}
```

## مقارنة مع النظام القديم

| الميزة | النظام القديم | النظام الجديد |
|--------|---------------|----------------|
| API Calls | ملف منفصل `lib/marketingApi.js` | `axiosInstance` مباشرة في الـ store |
| التخزين | لا يوجد | `persist` middleware تلقائي |
| المرونة | منخفضة | عالية |
| البساطة | معقد (ملفات متعددة) | بسيط (ملف واحد) |
| التوافق | مع `crm.ts` | ✅ متوافق تماماً |

## ملاحظات مهمة

1. **التوافق**: الـ store الآن متوافق تماماً مع نظام `crm.ts`
2. **axiosInstance**: جميع الـ API calls تستخدم `axiosInstance` من `lib/axios`
3. **Persist**: البيانات تُحفظ تلقائياً في localStorage
4. **الأداء**: أداء أفضل مع تقليل الملفات
5. **الصيانة**: أسهل في الصيانة والتطوير

