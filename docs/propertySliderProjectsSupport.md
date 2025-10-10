# دعم المشاريع في PropertySlider - التحديثات المطبقة

## نظرة عامة

تم تحديث `components/tenant/propertySlider/propertySlider1.tsx` لدعم عرض المشاريع بالإضافة إلى العقارات.

## التحديثات المطبقة

### 1. دعم API المشاريع في `convertLegacyApiUrl`

```typescript
const convertLegacyApiUrl = (url: string, tenantId: string): string => {
  if (url === "/api/properties/latestSales") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=sale&latest=1&limit=10`;
    return newUrl;
  } else if (url === "/api/properties/latestRentals") {
    const newUrl = `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`;
    return newUrl;
  } else if (url === "/api/projects/latestProjects") {
    const newUrl = `/v1/tenant-website/${tenantId}/projects?featured=1&limit=10`;
    return newUrl;
  }
  // If it's already the new format with placeholder, replace tenantId
  return url.replace("{tenantId}", tenantId);
};
```

### 2. تحسين دالة `fetchProperties` للتعامل مع المشاريع

```typescript
// Fetch properties/projects from API
const fetchProperties = async (apiUrl?: string) => {
  try {
    setLoading(true);

    if (!currentTenantId) {
      setLoading(false);
      return;
    }

    // Convert legacy API URLs to new format and replace tenantId
    const defaultUrl =
      "/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10";
    const url = convertLegacyApiUrl(apiUrl || defaultUrl, currentTenantId);

    console.log("PropertySlider: Fetching data from:", url);

    const response = await axiosInstance.get(url);

    // Handle different API response formats
    if (response.data) {
      let dataToSet = [];

      // Check if it's projects API response
      if (url.includes("/projects")) {
        console.log("PropertySlider: Processing projects data");
        if (response.data.projects) {
          dataToSet = response.data.projects;
        } else if (Array.isArray(response.data)) {
          dataToSet = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          dataToSet = response.data.data;
        }
      }
      // Check if it's properties API response
      else if (response.data.properties) {
        console.log("PropertySlider: Processing properties data");
        dataToSet = response.data.properties;
      }
      // Handle direct array response
      else if (Array.isArray(response.data)) {
        console.log("PropertySlider: Processing direct array data");
        dataToSet = response.data;
      }
      // Handle pagination wrapper
      else if (response.data.data && Array.isArray(response.data.data)) {
        console.log("PropertySlider: Processing paginated data");
        dataToSet = response.data.data;
      }

      console.log("PropertySlider: Setting data:", dataToSet.length, "items");
      setApiProperties(dataToSet);

      if (response.data.pagination) {
        // Handle pagination if needed
        console.log(
          "PropertySlider: Pagination info:",
          response.data.pagination,
        );
      }
    } else {
      console.log("PropertySlider: No data received");
      setApiProperties([]);
    }
  } catch (error) {
    console.error("PropertySlider: Error fetching properties:", error);
    console.error("PropertySlider: URL that failed:", apiUrl);
    // Set empty array on error
    setApiProperties([]);
  } finally {
    setLoading(false);
  }
};
```

### 3. إضافة تعليقات توضيحية

```typescript
/**
 * PropertySlider Component
 *
 * Supports both Properties and Projects data sources:
 * - Properties: /v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10
 * - Properties: /v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10
 * - Projects: /v1/tenant-website/{tenantId}/projects?featured=1&limit=10
 *
 * The component automatically detects the data source type and handles different response formats.
 */
```

## مصادر البيانات المدعومة

### 1. العقارات للإيجار

```
/v1/tenant-website/{tenantId}/properties?purpose=rent&latest=1&limit=10
```

### 2. العقارات للبيع

```
/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10
```

### 3. المشاريع المميزة (NEW) ✨

```
/v1/tenant-website/{tenantId}/projects?featured=1&limit=10
```

## تنسيقات الاستجابة المدعومة

### 1. استجابة المشاريع

```json
{
  "projects": [
    {
      "id": "project_1",
      "title": "مشروع سكني مميز",
      "description": "وصف المشروع...",
      "image": "project_image.jpg",
      "price": "500000",
      "location": "الرياض",
      "type": "project"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

### 2. استجابة العقارات

```json
{
  "properties": [
    {
      "id": "property_1",
      "title": "شقة للإيجار",
      "description": "وصف العقار...",
      "image": "property_image.jpg",
      "price": "2000",
      "location": "الرياض",
      "type": "apartment"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10
  }
}
```

### 3. استجابة مباشرة (Array)

```json
[
  {
    "id": "item_1",
    "title": "عنوان العنصر",
    "description": "وصف العنصر...",
    "image": "item_image.jpg",
    "price": "1000",
    "location": "الموقع",
    "type": "item"
  }
]
```

## المميزات الجديدة

### 1. كشف تلقائي لمصدر البيانات

- يتحقق من URL لمعرفة نوع البيانات
- يتعامل مع استجابات مختلفة تلقائياً

### 2. معالجة مرنة للبيانات

- دعم استجابة المشاريع (`response.data.projects`)
- دعم استجابة العقارات (`response.data.properties`)
- دعم المصفوفة المباشرة (`Array.isArray(response.data)`)
- دعم البيانات المعبأة (`response.data.data`)

### 3. تسجيل مفصل للتطوير

- تسجيل URL المستخدم
- تسجيل نوع البيانات المعالجة
- تسجيل عدد العناصر المستلمة
- تسجيل معلومات الصفحات

### 4. معالجة الأخطاء المحسنة

- تسجيل مفصل للأخطاء
- تسجيل URL الذي فشل
- تعيين مصفوفة فارغة عند الخطأ

## كيفية الاستخدام

### 1. في الـ Editor

1. اختر PropertySlider component
2. انتقل إلى Data Source
3. اختر "Latest Projects" من قائمة API URL
4. احفظ التغييرات

### 2. في الكود

```typescript
// سيتم استدعاء الـ API التالي:
const apiUrl = "/v1/tenant-website/{tenantId}/projects?featured=1&limit=10";

// مع المعاملات:
// - tenantId: معرف المستأجر
// - featured=1: المشاريع المميزة فقط
// - limit=10: حد أقصى 10 مشاريع
```

## الاختبار

### 1. في الـ Console

```javascript
// تحقق من الـ API call
console.log("PropertySlider: Fetching data from:", url);
// يجب أن يظهر: /v1/tenant-website/{tenantId}/projects?featured=1&limit=10

// تحقق من نوع البيانات
console.log("PropertySlider: Processing projects data");
// يجب أن يظهر عند استخدام API المشاريع

// تحقق من عدد العناصر
console.log("PropertySlider: Setting data:", dataToSet.length, "items");
// يجب أن يظهر عدد المشاريع المستلمة
```

### 2. في الـ Network Tab

- تحقق من الطلب المرسل
- تحقق من الاستجابة المستلمة
- تحقق من تنسيق البيانات

## التوافق

### 1. مع العقارات

- ✅ يعمل مع العقارات للإيجار
- ✅ يعمل مع العقارات للبيع
- ✅ لا يؤثر على الوظائف الموجودة

### 2. مع المشاريع

- ✅ يعمل مع المشاريع المميزة
- ✅ يتعامل مع تنسيقات مختلفة
- ✅ يحافظ على نفس الـ UI

### 3. مع الـ Editor

- ✅ خيار جديد في الـ interface
- ✅ لا حاجة لتعديلات إضافية
- ✅ يعمل مع النظام الحالي

## الخلاصة

تم تحديث PropertySlider بنجاح لدعم المشاريع مع:

- ✅ **دعم كامل للمشاريع** مع API مخصص
- ✅ **كشف تلقائي** لنوع البيانات
- ✅ **معالجة مرنة** لتنسيقات مختلفة
- ✅ **تسجيل مفصل** للتطوير والتصحيح
- ✅ **توافق كامل** مع النظام الحالي
- ✅ **سهولة الاستخدام** من الـ editor

الآن يمكن للمستخدمين عرض العقارات أو المشاريع حسب احتياجاتهم! 🎉
