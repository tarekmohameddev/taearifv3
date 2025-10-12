# Inputs2 Component - النسخة المحسنة

## نظرة عامة

`Inputs2` هو النسخة المحسنة من مكون `Inputs1` مع تحسينات إضافية في الأداء والوظائف.

## الملفات المنشأة

### 1. المكونات الرئيسية
- `components/tenant/inputs/inputs2.tsx` - المكون الرئيسي
- `components/tenant/inputs/inputs2-example.tsx` - مثال على الاستخدام
- `components/tenant/inputs/index.ts` - ملف التصدير (محدث)

### 2. ملفات البيانات والوظائف
- `context-liveeditor/editorStoreFunctions/inputs2Functions.ts` - وظائف إدارة البيانات
- `componentsStructure/inputs2.ts` - هيكل المكون

### 3. ملفات التكوين
- `lib-liveeditor/ComponentsList.tsx` - قائمة المكونات (محدث)
- `context-liveeditor/editorStore.ts` - مخزن البيانات (محدث)
- `lib/ComponentsInCenter.js` - قائمة المكونات المتوسطة (محدث)

### 4. ملفات التوثيق
- `docs/inputs2-Details.md` - تفاصيل تقنية مفصلة
- `docs/inputs2-README.md` - هذا الملف

### 5. صفحة الاختبار
- `app/dashboard/inputs2-test/page.tsx` - صفحة اختبار المكون

## المميزات الجديدة

### 1. تحسينات الأداء
- تحسين في استخدام الذاكرة
- تحسين في سرعة التحميل
- تحسين في معالجة البيانات

### 2. تحسينات الوظائف
- نظام تحقق محسن من صحة البيانات
- معالجة أخطاء أفضل
- دعم أفضل للـ API calls

### 3. تحسينات التصميم
- ألوان ديناميكية محسنة
- تخطيط متجاوب أفضل
- تأثيرات بصرية محسنة

## كيفية الاستخدام

### 1. الاستخدام الأساسي

```tsx
import { Inputs2 } from "@/components/tenant/inputs";

<Inputs2
  useStore={false}
  variant="inputs2"
  id="my-form"
  apiEndpoint="/api/submit-form"
/>
```

### 2. الاستخدام مع Store

```tsx
import { Inputs2 } from "@/components/tenant/inputs";

<Inputs2
  useStore={true}
  variant="inputs2"
  id="my-form"
  apiEndpoint="/api/submit-form"
/>
```

### 3. استخدام المثال

```tsx
import { Inputs2Example } from "@/components/tenant/inputs";

<Inputs2Example />
```

## الاختلافات عن Inputs1

### 1. الـ Store Integration
- `inputs2States` بدلاً من `inputsStates`
- `inputs2Functions` بدلاً من `inputsFunctions`
- `inputs2Structure` بدلاً من `inputsStructure`

### 2. الـ Component Type
- `inputs2` بدلاً من `inputs`
- `Inputs2` بدلاً من `Inputs1`

### 3. الـ Default Data
- `getDefaultInputs2Data()` بدلاً من `getDefaultInputsData()`

## الاختبار

يمكنك اختبار المكون من خلال:

1. **صفحة الاختبار**: `/dashboard/inputs2-test`
2. **المثال**: استخدام `Inputs2Example`
3. **الاختبار المباشر**: استخدام `Inputs2` في أي صفحة

## التطوير

### 1. إضافة حقول جديدة
```typescript
// في inputs2Functions.ts
export const getDefaultInputs2Data = (): ComponentData => ({
  // ... البيانات الموجودة
  cards: [
    // ... الكروت الموجودة
    {
      id: "new_card",
      title: "كارت جديد",
      fields: [
        // ... الحقول الجديدة
      ]
    }
  ]
});
```

### 2. إضافة أنواع حقول جديدة
```typescript
// في inputs2.tsx
interface InputField {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "textarea"
    | "currency"
    | "radio"
    | "new_type"; // نوع جديد
}
```

### 3. إضافة ألوان جديدة
```typescript
// في inputs2.tsx
const colorPalettes: Record<string, any> = {
  // ... الألوان الموجودة
  newColor: {
    primary: "#new_color",
    secondary: "#new_color_dark",
    hover: "#new_color_hover",
    shadow: "rgba(new_color, 0.1)",
  },
};
```

## استكشاف الأخطاء

### 1. مشاكل الـ Import
```bash
# تأكد من وجود الملفات
ls -la context-liveeditor/editorStoreFunctions/inputs2Functions.ts
ls -la components/tenant/inputs/inputs2.tsx
```

### 2. مشاكل الـ Store
```typescript
// تأكد من إضافة inputs2States في editorStore.ts
inputs2States: {},
```

### 3. مشاكل الـ Types
```typescript
// تأكد من إضافة inputs2 في ComponentsList.tsx
inputs2: {
  id: "inputs2",
  name: "inputs2",
  // ... باقي الخصائص
}
```

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من console logs
2. تأكد من صحة الـ imports
3. تأكد من إضافة المكون في جميع الملفات المطلوبة
4. راجع ملف `inputs2-Details.md` للتفاصيل التقنية

## التحديثات المستقبلية

- [ ] إضافة أنواع حقول جديدة
- [ ] تحسين نظام التحقق
- [ ] إضافة دعم للـ themes
- [ ] تحسين الأداء
- [ ] إضافة المزيد من الأمثلة

## المساهمة

للمساهمة في تطوير المكون:

1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. إرسال Pull Request

## الترخيص

هذا المكون جزء من مشروع website-builder-dashboard ويخضع لنفس شروط الترخيص.
