# تنظيم بيانات النماذج - حل مشكلة البيانات المسطحة

## المشكلة الأصلية

كانت البيانات تأتي بشكل مسطح (flat) مع مفاتيح عشوائية:

```json
{
  "11": "رؤلاى",
  "111تال": "ىرؤلاى",
  "ئئئ": "فصثثس",
  "d": "ؤرلاىؤلار",
  "field_mgjp0zat_gjkgv": "رؤلاىرؤ",
  "field_mgjp0zat_nwods": "لارؤى",
  "field_mgjp0zat_uo0g6": "2025-10-16"
}
```

## الحل المطبق

تم إضافة ثلاث دوال رئيسية لتنظيم البيانات:

### 1. `organizeFormDataByCards()`

تنظم البيانات حسب الـ cards وتجمع الحقول معاً:

```typescript
const organizeFormDataByCards = () => {
  const organizedData: Record<string, any> = {};

  safeCards.forEach((card) => {
    if (card && card.id && card.fields && Array.isArray(card.fields)) {
      const cardData: Record<string, any> = {
        cardId: card.id,
        cardTitle: card.title,
        cardDescription: card.description,
        fields: {},
      };

      card.fields.forEach((field: InputField) => {
        if (field && field.id && formData[field.id] !== undefined) {
          cardData.fields[field.id] = {
            label: field.label,
            type: field.type,
            value: formData[field.id],
            required: field.required || false,
          };
        }
      });

      // Only add card if it has data
      if (Object.keys(cardData.fields).length > 0) {
        organizedData[card.id] = cardData;
      }
    }
  });

  return organizedData;
};
```

### 2. `createFormSummary()`

تنشئ تقريراً نظيفاً ومرتباً:

```typescript
const createFormSummary = () => {
  const organizedData = organizeFormDataByCards();

  const summary = {
    totalCards: Object.keys(organizedData).length,
    totalFields: Object.values(organizedData).reduce(
      (total: number, card: any) => total + Object.keys(card.fields).length,
      0,
    ),
    cards: Object.values(organizedData).map((cardData: any) => ({
      title: cardData.cardTitle,
      description: cardData.cardDescription,
      fieldCount: Object.keys(cardData.fields).length,
      fields: Object.values(cardData.fields).map((field: any) => ({
        label: field.label,
        value: field.value,
        type: field.type,
        required: field.required,
      })),
    })),
    timestamp: new Date().toISOString(),
    formId: props.id || "inputs1",
  };

  return summary;
};
```

### 3. `exportFormData(format)`

تصدر البيانات بصيغ مختلفة:

```typescript
const exportFormData = (format: "json" | "csv" | "table" = "json") => {
  const organizedData = organizeFormDataByCards();

  switch (format) {
    case "json":
      return JSON.stringify(organizedData, null, 2);

    case "csv":
      const csvRows = [];
      csvRows.push([
        "Card Title",
        "Field Label",
        "Field Type",
        "Value",
        "Required",
      ]);

      Object.values(organizedData).forEach((cardData: any) => {
        Object.values(cardData.fields).forEach((field: any) => {
          csvRows.push([
            cardData.cardTitle,
            field.label,
            field.type,
            field.value,
            field.required ? "Yes" : "No",
          ]);
        });
      });

      return csvRows.map((row) => row.join(",")).join("\n");

    case "table":
      return Object.values(organizedData).map((cardData: any) => ({
        card: cardData.cardTitle,
        fields: Object.values(cardData.fields)
          .map((field: any) => `${field.label}: ${field.value}`)
          .join(" | "),
      }));

    default:
      return organizedData;
  }
};
```

## النتيجة النهائية

### البيانات المنظمة (JSON Format)

```json
{
  "expenses": {
    "cardId": "expenses",
    "cardTitle": "إدارة المصاريف",
    "cardDescription": "تتبع وإدارة جميع المصاريف الشهرية",
    "fields": {
      "field_mgjp0zat_gjkgv": {
        "label": "نوع المصروف",
        "type": "select",
        "value": "رؤلاىرؤ",
        "required": true
      },
      "field_mgjp0zat_nwods": {
        "label": "المبلغ",
        "type": "currency",
        "value": "لارؤى",
        "required": true
      },
      "field_mgjp0zat_uo0g6": {
        "label": "تاريخ المصروف",
        "type": "date",
        "value": "2025-10-16",
        "required": true
      }
    }
  }
}
```

### التقرير النظيف (Summary)

```json
{
  "totalCards": 1,
  "totalFields": 3,
  "cards": [
    {
      "title": "إدارة المصاريف",
      "description": "تتبع وإدارة جميع المصاريف الشهرية",
      "fieldCount": 3,
      "fields": [
        {
          "label": "نوع المصروف",
          "value": "رؤلاىرؤ",
          "type": "select",
          "required": true
        },
        {
          "label": "المبلغ",
          "value": "لارؤى",
          "type": "currency",
          "required": true
        },
        {
          "label": "تاريخ المصروف",
          "value": "2025-10-16",
          "type": "date",
          "required": true
        }
      ]
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "formId": "inputs1"
}
```

### صيغة CSV

```csv
Card Title,Field Label,Field Type,Value,Required
إدارة المصاريف,نوع المصروف,select,رؤلاىرؤ,Yes
إدارة المصاريف,المبلغ,currency,لارؤى,Yes
إدارة المصاريف,تاريخ المصروف,date,2025-10-16,Yes
```

### صيغة الجدول

```json
[
  {
    "card": "إدارة المصاريف",
    "fields": "نوع المصروف: رؤلاىرؤ | المبلغ: لارؤى | تاريخ المصروف: 2025-10-16"
  }
]
```

## المميزات الجديدة

### 1. تنظيم البيانات

- تجميع البيانات حسب الـ cards
- إضافة معلومات إضافية (العنوان، الوصف، النوع)
- تتبع الحقول المطلوبة

### 2. تقارير مفصلة

- عدد الـ cards والحقول
- timestamp للتتبع
- معرف النموذج

### 3. صيغ تصدير متعددة

- JSON للبرمجة
- CSV للجداول
- Table للعرض

### 4. Console Logging محسن

- عرض البيانات الخام
- عرض البيانات المنظمة
- عرض التقرير النظيف
- جدول منسق للعرض

## كيفية الاستخدام

### في دالة handleSubmit

```typescript
const handleSubmit = async () => {
  // ... validation code ...

  if (!hasErrors) {
    try {
      // Create organized data and summary
      const organizedData = organizeFormDataByCards();
      const formSummary = createFormSummary();

      // Display in console
      console.log("📊 Raw form data:", formData);
      console.log("🗂️ Organized by cards:", organizedData);
      console.log("📋 Clean summary:", formSummary);

      // Export options
      console.log("📄 JSON:", exportFormData("json"));
      console.log("📊 CSV:", exportFormData("csv"));
      console.log("📋 Table:", exportFormData("table"));

      // Send to API
      await submitToAPI(organizedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
};
```

### إرسال البيانات للـ API

```typescript
// Option 1: Send organized data
await fetch("/api/submit-form", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(organizedData),
});

// Option 2: Send summary
await fetch("/api/submit-form", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formSummary),
});
```

## الخلاصة

هذا الحل يحول البيانات المسطحة العشوائية إلى بيانات منظمة ومفيدة يمكن:

- فهمها بسهولة
- معالجتها برمجياً
- تصديرها بصيغ مختلفة
- تتبعها وإدارتها

النظام الجديد يوفر مرونة كاملة في التعامل مع بيانات النماذج ويحل مشكلة المفاتيح العشوائية بطريقة أنيقة وفعالة.
