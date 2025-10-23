# تحديث مصدر البيانات في Property Slider

## التحديث المطبق

تم إضافة خيار جديد "أحدث المشاريع" في `componentsStructure/propertySlider.ts` في قسم `dataSource`.

## الخيارات المتاحة الآن

### 1. Latest Rentals (أحدث الإيجارات)

```
/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10
```

### 2. Latest Sales (أحدث المبيعات)

```
/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10
```

### 3. أحدث المشاريع (NEW) ✨

```
/v1/tenant-website/{tenantId}/projects?featured=1&limit=10
```

## التحديثات المطبقة

### 1. في الـ Fields الرئيسية

```typescript
{
  key: "dataSource",
  label: "Data Source",
  type: "object",
  fields: [
    {
      key: "apiUrl",
      label: "API URL",
      type: "select",
      defaultValue: "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
      options: [
        {
          value: "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
          label: "Latest Rentals",
        },
        {
          value: "/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10",
          label: "Latest Sales",
        },
        {
          value: "/v1/tenant-website/{tenantId}/projects?featured=1&limit=10",
          label: "أحدث المشاريع",
        },
      ],
      description: "API endpoint to fetch properties data",
    },
    // ... باقي الحقول
  ],
}
```

### 2. في الـ Simple Fields

```typescript
{
  key: "dataSource.apiUrl",
  label: "API URL",
  type: "select",
  defaultValue: "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
  options: [
    {
      value: "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10",
      label: "Latest Rentals",
    },
    {
      value: "/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10",
      label: "Latest Sales",
    },
    {
      value: "/v1/tenant-website/{tenantId}/projects?featured=1&limit=10",
      label: "أحدث المشاريع",
    },
  ],
  description: "API endpoint to fetch properties data",
}
```

## كيفية الاستخدام

### 1. في الـ Editor

- انتقل إلى Property Slider component
- في قسم "Data Source"
- اختر "أحدث المشاريع" من قائمة API URL
- سيتم استخدام الـ endpoint الجديد: `/v1/tenant-website/{tenantId}/projects?featured=1&limit=10`

### 2. في الكود

```typescript
// سيتم استدعاء الـ API التالي:
const apiUrl = "/v1/tenant-website/{tenantId}/projects?featured=1&limit=10";

// مع المعاملات:
// - tenantId: معرف المستأجر
// - featured=1: المشاريع المميزة فقط
// - limit=10: حد أقصى 10 مشاريع
```

## المعاملات الجديدة

| المعامل    | القيمة | الوصف                      |
| ---------- | ------ | -------------------------- |
| `featured` | `1`    | عرض المشاريع المميزة فقط   |
| `limit`    | `10`   | عدد المشاريع المطلوب عرضها |

## الفوائد

### 1. مرونة أكبر

- إمكانية عرض العقارات (للإيجار/البيع)
- إمكانية عرض المشاريع المميزة

### 2. تحسين تجربة المستخدم

- عرض المحتوى الأكثر صلة
- إبراز المشاريع المميزة

### 3. سهولة الإدارة

- خيار واحد في الـ editor
- لا حاجة لتعديل الكود

## ملاحظات مهمة

### 1. تنسيق البيانات

يجب أن يكون الـ API الجديد يعيد البيانات بنفس تنسيق العقارات:

```json
{
  "data": [
    {
      "id": "project_1",
      "title": "مشروع سكني مميز",
      "description": "وصف المشروع...",
      "image": "project_image.jpg",
      "price": "500000",
      "location": "الرياض",
      "type": "project"
    }
  ]
}
```

### 2. التوافق

- الـ component سيعمل مع نفس البنية
- لا حاجة لتعديلات إضافية في الكود
- نفس الـ UI والـ styling

## الاختبار

### 1. في الـ Editor

1. اختر Property Slider component
2. انتقل إلى Data Source
3. اختر "أحدث المشاريع"
4. احفظ التغييرات
5. تحقق من عرض البيانات

### 2. في الـ Console

```javascript
// تحقق من الـ API call
console.log("API URL:", dataSource.apiUrl);
// يجب أن يظهر: /v1/tenant-website/{tenantId}/projects?featured=1&limit=10
```

## الخلاصة

تم إضافة خيار "أحدث المشاريع" بنجاح في Property Slider، مما يوفر:

- ✅ **خيار جديد** لعرض المشاريع المميزة
- ✅ **API endpoint محدد** للمشاريع
- ✅ **توافق كامل** مع النظام الحالي
- ✅ **سهولة الاستخدام** من الـ editor
- ✅ **مرونة أكبر** في عرض المحتوى

الآن يمكن للمستخدمين اختيار عرض العقارات أو المشاريع حسب احتياجاتهم! 🎉
