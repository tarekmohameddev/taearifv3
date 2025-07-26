# نظام إدارة علاقات العملاء (CRM)

## نظرة عامة

تم تحديث نظام CRM لاستخدام Zustand store مع axiosInstance للتواصل مع API.

## الملفات المحدثة

### 1. `context/store/crm.js`

- يحتوي على Zustand store لإدارة بيانات CRM
- يستخدم axiosInstance للتواصل مع API
- يتضمن دوال للعمليات الأساسية:
  - `fetchCrmData()` - جلب بيانات CRM
  - `updateCustomer()` - تحديث بيانات العميل
  - `addCustomer()` - إضافة عميل جديد
  - `deleteCustomer()` - حذف عميل
  - `moveCustomerToStage()` - نقل العميل بين المراحل
  - `addNote()` - إضافة ملاحظة
  - `addReminder()` - إضافة تذكير
  - `addInteraction()` - إضافة تفاعل

### 2. `components/crm/crm-page.tsx`

- تم تحديثه لاستخدام الـ store الجديد
- يستدعي البيانات من API عند تحميل الصفحة
- يعرض loading و error states
- يستخدم البيانات الحقيقية من API بدلاً من البيانات الثابتة

## كيفية الاستخدام

### استدعاء البيانات في المكونات

```javascript
import useCrmStore from "@/context/store/crm";

function MyComponent() {
  const {
    crmData: { data, loading, error },
    fetchCrmData,
  } = useCrmStore();

  useEffect(() => {
    fetchCrmData();
  }, [fetchCrmData]);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {error}</div>;

  return <div>{/* عرض البيانات */}</div>;
}
```

### شكل البيانات من API

```json
{
  "status": "success",
  "total_customers": 7,
  "stages_summary": [
    {
      "stage_id": 3,
      "stage_name": "Completed Successfully",
      "color": "#28A745",
      "icon": "fa fa-check-circle",
      "customer_count": 0
    }
  ],
  "stages_with_customers": [
    {
      "stage_id": 1,
      "stage_name": "Qualified & Verified",
      "customers": [
        {
          "customer_id": 13,
          "name": "customer5",
          "city": {
            "id": 3,
            "name_ar": "الرياض",
            "name_en": "Riyadh"
          },
          "priority": 1,
          "customer_type": "Seller",
          "reminders_count": 0,
          "appointments_count": 0
        }
      ]
    }
  ]
}
```

### العمليات المتاحة

#### نقل العميل بين المراحل

```javascript
const { moveCustomerToStage } = useCrmStore.getState();
await moveCustomerToStage(customerId, targetStageId);
```

#### إضافة ملاحظة

```javascript
const { addNote } = useCrmStore.getState();
await addNote(customerId, "ملاحظة جديدة");
```

#### إضافة تذكير

```javascript
const { addReminder } = useCrmStore.getState();
await addReminder(customerId, {
  title: "تذكير مهم",
  date: "2024-01-15",
  priority: "عالية",
});
```

#### إضافة تفاعل

```javascript
const { addInteraction } = useCrmStore.getState();
await addInteraction(customerId, {
  type: "اتصال هاتفي",
  notes: "تم الاتصال بالعميل",
  duration: "5 دقائق",
});
```

## الميزات الجديدة

1. **إدارة الحالة المركزية**: استخدام Zustand store لإدارة حالة التطبيق
2. **التواصل مع API**: استخدام axiosInstance للتواصل الآمن مع الخادم
3. **إدارة الأخطاء**: معالجة شاملة للأخطاء مع رسائل واضحة
4. **حالات التحميل**: عرض مؤشرات التحميل أثناء جلب البيانات
5. **التحديث التلقائي**: إعادة جلب البيانات بعد كل عملية تحديث

## ملاحظات مهمة

- جميع العمليات تستخدم axiosInstance مع إدارة التوثيق التلقائية
- يتم إعادة جلب البيانات تلقائياً بعد كل عملية تحديث
- يتم عرض حالات التحميل والأخطاء للمستخدم
- البيانات تأتي من API حقيقي وليس بيانات ثابتة
