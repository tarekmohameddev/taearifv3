# دليل ترجمة inputs2 Component

## نظرة عامة

تم تطبيق نظام الترجمة على `componentsStructure/inputs2.ts` بنفس الطريقة المستخدمة في `grid1`. هذا المستند يوضح جميع الخطوات المتبعة والملفات المعدلة.

## الملفات المعدلة

### 1. componentsStructure/translationHelper.ts

تمت إضافة مفاتيح الترجمة التالية في دالة `translateLabel`:

```typescript
// Inputs2 specific labels
"🎛️ Card Visibility Controls": "components_structure.inputs2.card_visibility_controls",
"Card Visibility Controls": "components_structure.inputs2.card_visibility_controls",
"Show Property Information Card": "components_structure.inputs2.show_property_info_card",
"Show Budget & Payment Card": "components_structure.inputs2.show_budget_card",
"Show Additional Details Card": "components_structure.inputs2.show_additional_details_card",
"Show Contact Information Card": "components_structure.inputs2.show_contact_card",
"🎯 Field Visibility Controls": "components_structure.inputs2.field_visibility_controls",
"Field Visibility Controls": "components_structure.inputs2.field_visibility_controls",
"Show Property Type Field": "components_structure.inputs2.show_property_type_field",
"Show Property Category Field": "components_structure.inputs2.show_property_category_field",
"Show City Field": "components_structure.inputs2.show_city_field",
"Show District Field": "components_structure.inputs2.show_district_field",
"Show Area From Field": "components_structure.inputs2.show_area_from_field",
"Show Area To Field": "components_structure.inputs2.show_area_to_field",
"Show Purchase Method Field": "components_structure.inputs2.show_purchase_method_field",
"Show Budget From Field": "components_structure.inputs2.show_budget_from_field",
"Show Budget To Field": "components_structure.inputs2.show_budget_to_field",
"Show Seriousness Field": "components_structure.inputs2.show_seriousness_field",
"Show Purchase Goal Field": "components_structure.inputs2.show_purchase_goal_field",
"Show Similar Offers Field": "components_structure.inputs2.show_similar_offers_field",
"Show Full Name Field": "components_structure.inputs2.show_full_name_field",
"Show Phone Field": "components_structure.inputs2.show_phone_field",
"Show WhatsApp Field": "components_structure.inputs2.show_whatsapp_field",
"Show Notes Field": "components_structure.inputs2.show_notes_field",
```

### 2. lib/i18n/locales/en.json

#### أ. في قسم `components`:
```json
"inputs2": {
  "display_name": "Advanced Input System",
  "description": "Dynamic form system with customizable cards and fields with visibility controls"
}
```

#### ب. في قسم `components_structure`:
```json
"inputs2": {
  "card_visibility_controls": "Card Visibility Controls",
  "show_property_info_card": "Show Property Information Card",
  "show_budget_card": "Show Budget & Payment Card",
  "show_additional_details_card": "Show Additional Details Card",
  "show_contact_card": "Show Contact Information Card",
  "field_visibility_controls": "Field Visibility Controls",
  "show_property_type_field": "Show Property Type Field",
  "show_property_category_field": "Show Property Category Field",
  "show_city_field": "Show City Field",
  "show_district_field": "Show District Field",
  "show_area_from_field": "Show Area From Field",
  "show_area_to_field": "Show Area To Field",
  "show_purchase_method_field": "Show Purchase Method Field",
  "show_budget_from_field": "Show Budget From Field",
  "show_budget_to_field": "Show Budget To Field",
  "show_seriousness_field": "Show Seriousness Field",
  "show_purchase_goal_field": "Show Purchase Goal Field",
  "show_similar_offers_field": "Show Similar Offers Field",
  "show_full_name_field": "Show Full Name Field",
  "show_phone_field": "Show Phone Field",
  "show_whatsapp_field": "Show WhatsApp Field",
  "show_notes_field": "Show Notes Field"
}
```

### 3. lib/i18n/locales/ar.json

#### أ. في قسم `components`:
```json
"inputs2": {
  "display_name": "نظام الإدخال المتقدم 2",
  "description": "نظام نماذج ديناميكي مع عناصر تحكم في رؤية البطاقات والحقول"
}
```

#### ب. في قسم `components_structure`:
```json
"inputs2": {
  "card_visibility_controls": "عناصر التحكم في رؤية البطاقات",
  "show_property_info_card": "إظهار بطاقة معلومات العقار",
  "show_budget_card": "إظهار بطاقة الميزانية والدفع",
  "show_additional_details_card": "إظهار بطاقة التفاصيل الإضافية",
  "show_contact_card": "إظهار بطاقة معلومات الاتصال",
  "field_visibility_controls": "عناصر التحكم في رؤية الحقول",
  "show_property_type_field": "إظهار حقل نوع العقار",
  "show_property_category_field": "إظهار حقل فئة العقار",
  "show_city_field": "إظهار حقل المدينة",
  "show_district_field": "إظهار حقل الحي",
  "show_area_from_field": "إظهار حقل المساحة من",
  "show_area_to_field": "إظهار حقل المساحة إلى",
  "show_purchase_method_field": "إظهار حقل طريقة الشراء",
  "show_budget_from_field": "إظهار حقل الميزانية من",
  "show_budget_to_field": "إظهار حقل الميزانية إلى",
  "show_seriousness_field": "إظهار حقل الجدية",
  "show_purchase_goal_field": "إظهار حقل هدف الشراء",
  "show_similar_offers_field": "إظهار حقل العروض المماثلة",
  "show_full_name_field": "إظهار حقل الاسم الكامل",
  "show_phone_field": "إظهار حقل الهاتف",
  "show_whatsapp_field": "إظهار حقل واتساب",
  "show_notes_field": "إظهار حقل الملاحظات"
}
```

## كيفية عمل الترجمة

### 1. تدفق الترجمة

```
inputs2.ts (labels بالإنجليزية)
    ↓
translateComponentStructure() في AdvancedSimpleSwitcher
    ↓
translateFieldDefinition() لكل حقل
    ↓
translateLabel() للبحث عن الترجمة
    ↓
labelMappings في translationHelper.ts
    ↓
en.json أو ar.json حسب الـ locale
    ↓
عرض النص المترجم في الواجهة
```

### 2. مثال عملي

```typescript
// في inputs2.ts
{
  key: "cardVisibility",
  label: "🎛️ Card Visibility Controls",
  type: "object",
  fields: [...]
}

// بعد الترجمة للعربية
{
  key: "cardVisibility",
  label: "عناصر التحكم في رؤية البطاقات",
  type: "object",
  fields: [...]
}

// بعد الترجمة للإنجليزية
{
  key: "cardVisibility",
  label: "Card Visibility Controls",
  type: "object",
  fields: [...]
}
```

## الحقول المترجمة

### بطاقات التحكم (Card Visibility Controls)

1. **Property Information Card** - بطاقة معلومات العقار
2. **Budget & Payment Card** - بطاقة الميزانية والدفع
3. **Additional Details Card** - بطاقة التفاصيل الإضافية
4. **Contact Information Card** - بطاقة معلومات الاتصال

### حقول التحكم (Field Visibility Controls)

#### حقول معلومات العقار:
1. **Property Type** - نوع العقار
2. **Property Category** - فئة العقار
3. **City** - المدينة
4. **District** - الحي
5. **Area From** - المساحة من
6. **Area To** - المساحة إلى

#### حقول الميزانية والدفع:
7. **Purchase Method** - طريقة الشراء
8. **Budget From** - الميزانية من
9. **Budget To** - الميزانية إلى

#### حقول التفاصيل الإضافية:
10. **Seriousness** - الجدية
11. **Purchase Goal** - هدف الشراء
12. **Similar Offers** - العروض المماثلة

#### حقول معلومات الاتصال:
13. **Full Name** - الاسم الكامل
14. **Phone** - الهاتف
15. **WhatsApp** - واتساب
16. **Notes** - الملاحظات

## الاستخدام

عند استخدام `inputs2` في Editor Sidebar، ستظهر جميع الـ labels تلقائياً باللغة المحددة (عربي أو إنجليزي) بناءً على إعدادات الـ locale.

### مثال في الكود:

```typescript
import { useEditorT } from "@/context-liveeditor/editorI18nStore";
import { translateComponentStructure } from "@/componentsStructure";

const t = useEditorT();
const translatedStructure = translateComponentStructure(inputs2Structure, t);
```

## ملاحظات مهمة

1. **الرموز التعبيرية (Emojis)**: تم الاحتفاظ بالرموز التعبيرية مثل 🎛️ و 🎯 في الترجمة الإنجليزية فقط
2. **التناسق**: جميع الترجمات تتبع نفس النمط المستخدم في بقية المشروع
3. **القابلية للتوسع**: يمكن إضافة حقول جديدة بسهولة باتباع نفس النمط

## الاختبار

لاختبار الترجمات:

1. افتح Editor Sidebar
2. اختر مكون `inputs2`
3. غير اللغة من الإنجليزية إلى العربية والعكس
4. تأكد من ظهور جميع الـ labels بشكل صحيح

## الخلاصة

تم تطبيق نظام الترجمة بنجاح على `inputs2` Component. النظام يعمل بنفس طريقة `grid1` ويدعم:

✅ ترجمة جميع الـ labels
✅ دعم اللغة العربية والإنجليزية
✅ تحديث ديناميكي عند تغيير اللغة
✅ توافق مع نظام الترجمة الموجود في المشروع
