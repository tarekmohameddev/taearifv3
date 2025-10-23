# معالجة بيانات المشاريع في PropertySlider

## نظرة عامة

تم تحديث `propertySlider1.tsx` للتعامل مع بنية بيانات المشاريع المختلفة عن العقارات وتحويلها إلى تنسيق متوافق مع `PropertyCard`.

## بنية بيانات المشاريع

### البيانات الواردة من API

```json
{
  "projects": [
    {
      "id": "217",
      "slug": "samy",
      "title": "samy",
      "description": "",
      "address": "Turkey",
      "developer": "Unknown Developer",
      "units": 0,
      "completionDate": "2026-10-07",
      "completeStatus": "0",
      "minPrice": "10000000",
      "maxPrice": "10000000",
      "image": "https://taearif.com/projects/1e140bf4-7529-419c-b752-4146150cec3d.png",
      "images": [
        "https://taearif.com/projects/1e140bf4-7529-419c-b752-4146150cec3d.png"
      ],
      "videoUrl": null,
      "amenities": [],
      "location": {
        "lat": 24.766316905851,
        "lng": 46.735796928406,
        "address": "Turkey"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "per_page": 10,
    "current_page": 1,
    "last_page": 1,
    "from": 1,
    "to": 2
  }
}
```

## دالة التحويل `convertProjectToProperty`

### الوظيفة

تحويل بيانات المشروع إلى تنسيق العقار المتوافق مع `PropertyCard`.

### الكود

```typescript
const convertProjectToProperty = (project: any): Property => {
  // Format price display
  const formatPrice = (minPrice: string, maxPrice: string) => {
    if (!minPrice && !maxPrice) return "غير محدد";
    if (minPrice === maxPrice) return minPrice;
    if (minPrice && maxPrice) return `${minPrice} - ${maxPrice}`;
    return minPrice || maxPrice;
  };

  // Format completion date
  const formatCompletionDate = (date: string) => {
    if (!date) return new Date().toISOString();
    try {
      return new Date(date).toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    district: project.address || project.location?.address || "غير محدد",
    price: formatPrice(project.minPrice, project.maxPrice),
    views: 0, // Projects don't have views
    bedrooms: 0, // Projects don't have bedrooms
    bathrooms: 0, // Projects don't have bathrooms
    area: project.units ? `${project.units} وحدة` : "غير محدد",
    type: "مشروع", // Project type
    transactionType: "project", // Project transaction type
    image: project.image || project.images?.[0] || "",
    status: project.completeStatus === "1" ? "مكتمل" : "قيد الإنشاء",
    createdAt: formatCompletionDate(project.completionDate),
    description: project.description || "",
    features: project.amenities || [],
    location: {
      lat: project.location?.lat || 0,
      lng: project.location?.lng || 0,
      address: project.location?.address || project.address || "غير محدد",
    },
    images: project.images || [project.image].filter(Boolean),
  };
};
```

## خريطة التحويل

| حقل المشروع         | حقل العقار        | التحويل                  |
| ------------------- | ----------------- | ------------------------ |
| `id`                | `id`              | مباشر                    |
| `slug`              | `slug`            | مباشر                    |
| `title`             | `title`           | مباشر                    |
| `address`           | `district`        | مباشر                    |
| `minPrice/maxPrice` | `price`           | تنسيق السعر              |
| `units`             | `area`            | `${units} وحدة`          |
| `completeStatus`    | `status`          | "مكتمل" أو "قيد الإنشاء" |
| `completionDate`    | `createdAt`       | تنسيق التاريخ            |
| `image/images`      | `image/images`    | الصورة الأولى            |
| `amenities`         | `features`        | مباشر                    |
| `location`          | `location`        | مباشر                    |
| -                   | `views`           | 0 (ثابت)                 |
| -                   | `bedrooms`        | 0 (ثابت)                 |
| -                   | `bathrooms`       | 0 (ثابت)                 |
| -                   | `type`            | "مشروع" (ثابت)           |
| -                   | `transactionType` | "project" (ثابت)         |

## معالجة البيانات في `fetchProperties`

### كشف نوع البيانات

```typescript
// Check if it's projects API response
if (url.includes("/projects")) {
  console.log("PropertySlider: Processing projects data");
  let projectsData = [];

  if (response.data.projects) {
    projectsData = response.data.projects;
    console.log(
      "PropertySlider: Found projects in response.data.projects:",
      projectsData.length,
    );
  } else if (Array.isArray(response.data)) {
    projectsData = response.data;
    console.log(
      "PropertySlider: Found projects in direct array:",
      projectsData.length,
    );
  } else if (response.data.data && Array.isArray(response.data.data)) {
    projectsData = response.data.data;
    console.log(
      "PropertySlider: Found projects in response.data.data:",
      projectsData.length,
    );
  }

  // Convert projects to property format
  if (projectsData.length > 0) {
    dataToSet = projectsData.map((project: any) => {
      console.log("PropertySlider: Converting project:", project.title);
      return convertProjectToProperty(project);
    });
    console.log(
      "PropertySlider: Converted",
      projectsData.length,
      "projects to property format",
    );
  } else {
    console.log("PropertySlider: No projects data found");
    dataToSet = [];
  }
}
```

## أمثلة التحويل

### مثال 1: مشروع بأسعار مختلفة

```json
// Input (Project)
{
  "id": "217",
  "title": "مشروع سكني",
  "minPrice": "1000000",
  "maxPrice": "2000000",
  "units": 50,
  "completeStatus": "0"
}

// Output (Property)
{
  "id": "217",
  "title": "مشروع سكني",
  "price": "1000000 - 2000000",
  "area": "50 وحدة",
  "status": "قيد الإنشاء",
  "type": "مشروع",
  "transactionType": "project"
}
```

### مثال 2: مشروع مكتمل

```json
// Input (Project)
{
  "id": "204",
  "title": "سكاي لاين ريزيدنس",
  "minPrice": "500000",
  "maxPrice": "500000",
  "units": 120,
  "completeStatus": "1"
}

// Output (Property)
{
  "id": "204",
  "title": "سكاي لاين ريزيدنس",
  "price": "500000",
  "area": "120 وحدة",
  "status": "مكتمل",
  "type": "مشروع",
  "transactionType": "project"
}
```

## معالجة الأخطاء

### 1. بيانات مفقودة

```typescript
// Default values for missing data
district: project.address || project.location?.address || "غير محدد",
price: formatPrice(project.minPrice, project.maxPrice),
area: project.units ? `${project.units} وحدة` : "غير محدد",
```

### 2. تنسيق التاريخ

```typescript
const formatCompletionDate = (date: string) => {
  if (!date) return new Date().toISOString();
  try {
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
};
```

### 3. تنسيق السعر

```typescript
const formatPrice = (minPrice: string, maxPrice: string) => {
  if (!minPrice && !maxPrice) return "غير محدد";
  if (minPrice === maxPrice) return minPrice;
  if (minPrice && maxPrice) return `${minPrice} - ${maxPrice}`;
  return minPrice || maxPrice;
};
```

## التسجيل والتصحيح

### رسائل Console

```javascript
// عند معالجة المشاريع
console.log("PropertySlider: Processing projects data");
console.log(
  "PropertySlider: Found projects in response.data.projects:",
  projectsData.length,
);
console.log("PropertySlider: Converting project:", project.title);
console.log(
  "PropertySlider: Converted",
  projectsData.length,
  "projects to property format",
);
```

### تتبع التحويل

- تسجيل عدد المشاريع المستلمة
- تسجيل عنوان كل مشروع يتم تحويله
- تسجيل عدد المشاريع المحولة
- تسجيل الأخطاء في التحويل

## الاختبار

### 1. في الـ Console

```javascript
// تحقق من معالجة المشاريع
console.log("PropertySlider: Processing projects data");
// يجب أن يظهر عند استخدام API المشاريع

// تحقق من التحويل
console.log("PropertySlider: Converting project:", project.title);
// يجب أن يظهر عنوان كل مشروع

// تحقق من النتيجة
console.log(
  "PropertySlider: Converted",
  projectsData.length,
  "projects to property format",
);
// يجب أن يظهر عدد المشاريع المحولة
```

### 2. في الـ Network Tab

- تحقق من الطلب المرسل
- تحقق من الاستجابة المستلمة
- تحقق من تنسيق البيانات

### 3. في الـ UI

- تحقق من عرض المشاريع
- تحقق من صحة البيانات المعروضة
- تحقق من الصور والروابط

## المميزات

### 1. تحويل تلقائي

- تحويل بيانات المشاريع إلى تنسيق العقارات
- معالجة الحقول المختلفة
- تنسيق البيانات بشكل صحيح

### 2. معالجة الأخطاء

- قيم افتراضية للحقول المفقودة
- معالجة التواريخ غير الصحيحة
- تنسيق الأسعار المختلفة

### 3. تسجيل مفصل

- تتبع عملية التحويل
- تسجيل الأخطاء
- تسجيل الإحصائيات

### 4. توافق كامل

- يعمل مع `PropertyCard` بدون تعديلات
- يحافظ على نفس الـ UI
- يدعم جميع الميزات

## الخلاصة

تم تطبيق نظام شامل لمعالجة بيانات المشاريع:

- ✅ **تحويل تلقائي** لبيانات المشاريع
- ✅ **معالجة الأخطاء** للحقول المفقودة
- ✅ **تنسيق البيانات** بشكل صحيح
- ✅ **تسجيل مفصل** للتطوير والتصحيح
- ✅ **توافق كامل** مع النظام الحالي
- ✅ **دعم جميع الميزات** الموجودة

الآن PropertySlider يعرض المشاريع بنفس جودة عرض العقارات! 🎉
