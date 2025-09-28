# نظام تغيير اللغات (i18n System)

## نظرة عامة

تم إنشاء نظام تغيير اللغات الكامل للمشروع يدعم:
- العربية (ar) - اللغة الافتراضية
- الإنجليزية (en)

## الملفات المُنشأة

### 1. ملفات التكوين
- `lib/i18n/config.ts` - إعدادات النظام الأساسية
- `lib/i18n/locales/ar.json` - الترجمات العربية
- `lib/i18n/locales/en.json` - الترجمات الإنجليزية

### 2. Stores
- `context/editorI18nStore.ts` - Store للغات في الـ Live Editor
- `context/clientI18nStore.ts` - Store للغات للعميل النهائي

### 3. مكونات الترجمة
- `components/tenant/live-editor/LanguageSwitcher.tsx` - مغير اللغة للـ Editor
- `components/tenant/LanguageSwitcher.tsx` - مغير اللغة للعميل النهائي
- `components/tenant/live-editor/EditorSidebar/TranslationFields.tsx` - حقول الترجمة
- `components/providers/I18nProvider.tsx` - Provider للغات

### 4. Middleware
- `middleware.ts` - معالجة تغيير اللغات في الـ URLs

## كيفية الاستخدام

### في الـ Live Editor

```tsx
import { useEditorT, useEditorLocale } from "@/context/editorI18nStore";

function MyComponent() {
  const t = useEditorT();
  const { locale, setLocale } = useEditorLocale();
  
  return (
    <div>
      <h1>{t("editor.title")}</h1>
      <button onClick={() => setLocale("en")}>
        {t("common.change_language")}
      </button>
    </div>
  );
}
```

### في العميل النهائي

```tsx
import { useClientT, useClientLocale } from "@/context/clientI18nStore";

function MyComponent() {
  const t = useClientT();
  const { locale, setLocale } = useClientLocale();
  
  return (
    <div>
      <h1>{t("navigation.home")}</h1>
      <button onClick={() => setLocale("ar")}>
        {t("common.change_language")}
      </button>
    </div>
  );
}
```

### استخدام حقول الترجمة

```tsx
import { TranslationFields } from "@/components/tenant/live-editor/EditorSidebar/TranslationFields";

function MyForm() {
  const [title, setTitle] = useState<Record<string, string>>({
    ar: "عنوان بالعربية",
    en: "Title in English"
  });
  
  return (
    <TranslationFields
      fieldKey="title"
      value={title}
      onChange={setTitle}
      label="العنوان"
      type="input"
    />
  );
}
```

## إضافة ترجمات جديدة

1. أضف المفتاح الجديد في `lib/i18n/locales/ar.json`
2. أضف الترجمة الإنجليزية في `lib/i18n/locales/en.json`
3. استخدم `t("key.subkey")` في المكونات

## إضافة لغة جديدة

1. أضف اللغة في `lib/i18n/config.ts`
2. أنشئ ملف الترجمة الجديد في `lib/i18n/locales/`
3. حدث الـ stores لاستيراد الترجمة الجديدة

## الميزات

- ✅ دعم متعدد اللغات
- ✅ تغيير اللغة في الـ URLs
- ✅ حفظ تفضيل اللغة
- ✅ حقول ترجمة في الـ Editor
- ✅ مكونات تغيير اللغة
- ✅ Middleware للـ routing
- ✅ TypeScript support
- ✅ Zustand stores
- ✅ Responsive design
