# i18n and Translation System

## Table of Contents

1. [Overview](#overview)
2. [editorI18nStore](#editori18nstore)
3. [Translation Files](#translation-files)
4. [Translation Functions](#translation-functions)
5. [Component Translation](#component-translation)
6. [Language Switching](#language-switching)
7. [Multi-Language Content Editing](#multi-language-content-editing)

---

## Overview

The Live Editor includes a comprehensive **internationalization (i18n)** system supporting:

- **Multiple languages**: Arabic (ar) and English (en)
- **Editor UI translations**: All interface text translatable
- **Component translations**: Component names and descriptions
- **Content translations**: User content in multiple languages
- **Persistent locale**: User's language preference saved
- **Fallback mechanism**: Missing translations fall back to default locale

### Supported Languages

```typescript
export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const localeNames = {
  ar: "العربية",
  en: "English",
};

export const localeFlags = {
  ar: "🇸🇦",
  en: "🇬🇧",
};
```

---

## editorI18nStore

**Location**: `context-liveeditor/editorI18nStore.ts`

**Purpose**: Manage locale and provide translation functions

### Store Structure

```typescript
interface EditorI18nState {
  locale: Locale; // Current locale ("ar" or "en")
  translations: TranslationsObject; // All translations
  setLocale: (locale: Locale) => void; // Change language
  t: (key: string, params?) => string; // Translate key
  getCurrentTranslations: () => Translations; // Get current locale translations
}
```

### Implementation

```typescript
export const useEditorI18nStore = create<EditorI18nState>()(
  persist(
    (set, get) => ({
      locale: defaultLocale, // "ar"
      translations: {
        ar: arTranslations,
        en: enTranslations,
      },

      // ═══════════════════════════════════════════════════════════
      // SET LOCALE
      // ═══════════════════════════════════════════════════════════
      setLocale: (locale) => {
        if (!isValidLocale(locale)) {
          console.warn("Invalid locale:", locale);
          return;
        }

        set({ locale });

        // Optionally trigger re-render of components
        // (Most components use t() hook which auto-updates)
      },

      // ═══════════════════════════════════════════════════════════
      // TRANSLATION FUNCTION
      // ═══════════════════════════════════════════════════════════
      t: (key, params?) => {
        const { locale, translations } = get();
        const currentTranslations = translations[locale];

        // Navigate nested object using dot notation
        const keys = key.split(".");
        let value = currentTranslations;

        for (const k of keys) {
          if (value && typeof value === "object" && k in value) {
            value = value[k];
          } else {
            // Fallback to default locale
            value = translations[defaultLocale];

            for (const fallbackKey of keys) {
              if (value && typeof value === "object" && fallbackKey in value) {
                value = value[fallbackKey];
              } else {
                return key; // Return key if not found
              }
            }
            break;
          }
        }

        if (typeof value !== "string") {
          return key; // Return key if final value not string
        }

        // Replace parameters
        if (params) {
          return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
            return params[paramKey]?.toString() || match;
          });
        }

        return value;
      },

      // ═══════════════════════════════════════════════════════════
      // GET CURRENT TRANSLATIONS
      // ═══════════════════════════════════════════════════════════
      getCurrentTranslations: () => {
        const { locale, translations } = get();
        return translations[locale];
      },
    }),
    {
      name: "editor-i18n-storage", // LocalStorage key
      partialize: (state) => ({ locale: state.locale }), // Only persist locale
    },
  ),
);
```

### Persistence

**Storage**: Browser localStorage

**Key**: `"editor-i18n-storage"`

**Persisted**: Only `locale` property

**Why Persist?**

- Remember user's language preference
- Restore on page reload
- Consistent experience across sessions

---

## Translation Files

### File Structure

```
lib/i18n/locales/
├── ar.json    # Arabic translations
└── en.json    # English translations
```

### Translation File Format

```json
// lib/i18n/locales/ar.json
{
  "live_editor": {
    "title": "محرر الموقع المباشر",
    "save": "حفظ",
    "cancel": "إلغاء",
    "add_section": "إضافة قسم",
    "edit_component": "تعديل المكون",

    "responsive": {
      "mobile": "موبايل",
      "tablet": "تابلت",
      "desktop": "سطح المكتب"
    },

    "dialogs": {
      "unsaved_changes": {
        "title": "تغييرات غير محفوظة",
        "message": "لديك تغييرات غير محفوظة. هل تريد المتابعة؟",
        "confirm": "نعم، متابعة",
        "cancel": "لا، البقاء هنا"
      }
    }
  },

  "components": {
    "hero": {
      "display_name": "بانر رئيسي",
      "description": "قسم رئيسي مع عنوان جذاب ودعوة للإجراء"
    },
    "header": {
      "display_name": "رأس الصفحة",
      "description": "شريط التنقل مع الشعار والقائمة والإجراءات"
    },
    "halfTextHalfImage": {
      "display_name": "نص وصورة",
      "description": "قسم يحتوي على نص وصورة جنبًا إلى جنب"
    }
    // ... more components
  },

  "sections": {
    "homepage": {
      "display_name": "الصفحة الرئيسية",
      "description": "مكونات الصفحة الرئيسية للموقع"
    }
  },

  "fields": {
    "visible": "مرئي",
    "title": "العنوان",
    "subtitle": "العنوان الفرعي",
    "description": "الوصف",
    "image": "الصورة",
    "background": "الخلفية",
    "color": "اللون",
    "layout": "التخطيط"
    // ... more field labels
  }
}
```

```json
// lib/i18n/locales/en.json
{
  "live_editor": {
    "title": "Live Editor",
    "save": "Save",
    "cancel": "Cancel",
    "add_section": "Add Section",
    "edit_component": "Edit Component",

    "responsive": {
      "mobile": "Mobile",
      "tablet": "Tablet",
      "desktop": "Desktop"
    }
  },

  "components": {
    "hero": {
      "display_name": "Hero",
      "description": "Main banner section with compelling headline"
    },
    "header": {
      "display_name": "Header",
      "description": "Navigation bar with logo, menu, and actions"
    }
  }
}
```

---

## Translation Functions

### useEditorT Hook

**Purpose**: Get translation function

**Usage**:

```typescript
import { useEditorT } from "@/context-liveeditor/editorI18nStore";

function MyComponent() {
  const t = useEditorT();

  return (
    <div>
      <h1>{t("live_editor.title")}</h1>
      <button>{t("live_editor.save")}</button>
    </div>
  );
}
```

**Translation Lookup**:

```
Key: "live_editor.title"
  ↓
Split: ["live_editor", "title"]
  ↓
Navigate: translations[locale]["live_editor"]["title"]
  ↓
Return: "محرر الموقع المباشر" (if locale = "ar")
        "Live Editor" (if locale = "en")
```

### Translation with Parameters

```typescript
// Translation file
{
  "messages": {
    "component_added": "تم إضافة {{componentName}} بنجاح"
  }
}

// Usage
const message = t("messages.component_added", {
  componentName: "Hero"
});

// Result: "تم إضافة Hero بنجاح"
```

**Parameter Replacement**:

```typescript
value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
  return params[paramKey]?.toString() || match;
});

// {{componentName}} → replaced with params.componentName
// {{count}} → replaced with params.count
```

### Fallback Mechanism

```typescript
t: (key, params?) => {
  const { locale, translations } = get();
  let value = translations[locale];

  // Try current locale first
  for (const k of keys) {
    if (value && k in value) {
      value = value[k];
    } else {
      // Fallback to default locale (Arabic)
      value = translations[defaultLocale];

      for (const fallbackKey of keys) {
        if (value && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key itself if not found
        }
      }
      break;
    }
  }

  return value;
};
```

**Fallback Order**:

```
1. Try current locale (e.g., "en")
2. If not found, try default locale ("ar")
3. If still not found, return the key itself
```

---

## Component Translation

### Translating ComponentsList

```typescript
// In ComponentsList.tsx

// Function to get translated components
export const getComponents = (
  t: (key: string) => string,
): Record<string, ComponentType> => ({
  hero: {
    id: "hero",
    name: "hero",
    displayName: t("components.hero.display_name"), // Translated!
    description: t("components.hero.description"), // Translated!
    category: "banner",
    section: "homepage",
    subPath: "hero",
    icon: "🌟",
    ...heroStructure,
  },

  header: {
    id: "header",
    name: "header",
    displayName: t("components.header.display_name"),
    description: t("components.header.description"),
    // ...
  },
  // ... more components
});

// Helper to get translated component by ID
export const getComponentByIdTranslated = (
  id: string,
  t: (key: string) => string,
): ComponentType | undefined => {
  const components = getComponents(t);
  return components[id];
};
```

### Usage in UI

```typescript
// In ComponentsSidebar
function ComponentsSidebar() {
  const t = useEditorT();

  // Get translated components
  const components = getAllComponentsTranslated(t);

  return (
    <div>
      {components.map(component => (
        <div key={component.id}>
          <h3>{component.displayName}</h3>  {/* Translated! */}
          <p>{component.description}</p>    {/* Translated! */}
        </div>
      ))}
    </div>
  );
}
```

### Translating Structure Fields

```typescript
// In EditorSidebar/utils.ts

export const translateComponentStructure = (
  structure: ComponentStructure,
  t: (key: string) => string,
): ComponentStructure => {
  return {
    ...structure,
    variants: structure.variants.map((variant) => ({
      ...variant,
      name:
        t(
          `components.${structure.componentType}.variants.${variant.id}.name`,
        ) || variant.name,
      description:
        t(
          `components.${structure.componentType}.variants.${variant.id}.description`,
        ) || variant.description,

      fields: variant.fields.map((field) =>
        translateField(field, structure.componentType, t),
      ),
      simpleFields: variant.simpleFields?.map((field) =>
        translateField(field, structure.componentType, t),
      ),
    })),
  };
};

const translateField = (
  field: FieldDefinition,
  componentType: string,
  t: (key: string) => string,
): FieldDefinition => {
  const translationKey = `components.${componentType}.fields.${field.key}`;

  const translated = {
    ...field,
    label: t(`${translationKey}.label`) || field.label,
    placeholder: t(`${translationKey}.placeholder`) || field.placeholder,
    description: t(`${translationKey}.description`) || field.description,
  };

  // Translate nested fields for object/array types
  if (field.type === "object" && field.fields) {
    translated.fields = field.fields.map((f) =>
      translateField(f, componentType, t),
    );
  }

  if (field.type === "array" && field.of) {
    translated.of = field.of.map((f) => translateField(f, componentType, t));
  }

  return translated;
};
```

**Usage in AdvancedSimpleSwitcher**:

```typescript
const loadStructure = async (componentType) => {
  const structureModule = await import(
    `@/componentsStructure/${componentType}`
  );
  const loadedStructure = structureModule[`${componentType}Structure`];

  // Translate structure
  const translatedStructure = translateComponentStructure(loadedStructure, t);

  setStructure(translatedStructure);
};
```

---

## Language Switching

### Language Switcher Component

**Location**: `components/tenant/live-editor/LanguageSwitcher.tsx`

```typescript
export function LanguageSwitcher() {
  const { locale, setLocale } = useEditorLocale();
  const t = useEditorT();

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇬🇧" }
  ];

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger>
        <SelectValue>
          {localeFlags[locale]} {localeNames[locale]}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            <span>{lang.flag} {lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Language Switch Flow

```
USER CHANGES LANGUAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: User Selects Language
────────────────────────────────────────────────
<Select onValueChange={setLocale}>
  ↓
setLocale("en")


STEP 2: Update Store
────────────────────────────────────────────────
useEditorI18nStore.setLocale("en")
  ↓
set({ locale: "en" })
  ↓
Zustand persist middleware saves to localStorage:
  localStorage.setItem("editor-i18n-storage", JSON.stringify({
    state: { locale: "en" },
    version: 0
  }))


STEP 3: Re-Render Components
────────────────────────────────────────────────
All components using t() hook automatically re-render
  ↓
const t = useEditorT();
  ↓
t() now returns English translations
  ↓
UI updates with English text ✓


RESULT: Language changed throughout editor ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Multi-Language Content Editing

### TranslationFields Component

**Location**: `components/tenant/live-editor/EditorSidebar/TranslationFields.tsx`

**Purpose**: Edit content in multiple languages simultaneously

```typescript
export function TranslationFields({
  fieldKey,        // "hero.title"
  value,           // { ar: "عنوان", en: "Title" }
  onChange,        // Callback when value changes
  label,           // "Title"
  type = "input",  // "input" or "textarea"
  placeholder,
  locales = ["ar", "en"]
}) {
  const [activeLocale, setActiveLocale] = useState("ar");

  const handleValueChange = (locale, newValue) => {
    onChange({
      ...value,
      [locale]: newValue
    });
  };

  return (
    <Card className="translation-field">
      <CardHeader>
        <CardTitle>
          {label || fieldKey}
        </CardTitle>
        <CardDescription>
          Edit content in different languages
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeLocale} onValueChange={setActiveLocale}>
          {/* Language tabs */}
          <TabsList className="w-full">
            {locales.map(locale => (
              <TabsTrigger key={locale} value={locale} className="flex-1">
                <span className="mr-2">{localeFlags[locale]}</span>
                {localeNames[locale]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Language content */}
          {locales.map(locale => (
            <TabsContent key={locale} value={locale}>
              <div className="space-y-2">
                <Label htmlFor={`${fieldKey}-${locale}`}>
                  {localeNames[locale]} {label}
                </Label>

                {type === "textarea" ? (
                  <Textarea
                    id={`${fieldKey}-${locale}`}
                    value={value?.[locale] || ""}
                    onChange={(e) => handleValueChange(locale, e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  />
                ) : (
                  <Input
                    id={`${fieldKey}-${locale}`}
                    value={value?.[locale] || ""}
                    onChange={(e) => handleValueChange(locale, e.target.value)}
                    placeholder={placeholder}
                    dir={locale === "ar" ? "rtl" : "ltr"}
                  />
                )}

                {/* Character count */}
                <div className="text-xs text-gray-500">
                  {(value?.[locale] || "").length} characters
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

### Usage Example

```typescript
// Instead of single text field
<Input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

// Use translation field for multi-language
<TranslationFields
  fieldKey="hero.title"
  value={{ ar: "اكتشف عقارك المثالي", en: "Discover Your Perfect Property" }}
  onChange={(newValue) => updateByPath("content.title", newValue)}
  label="Title"
  type="input"
/>
```

### Component Data Structure (Multi-Language)

```typescript
// Component data with translations
{
  title: {
    ar: "عنوان بالعربي",
    en: "Title in English"
  },
  description: {
    ar: "وصف بالعربي",
    en: "Description in English"
  },
  buttons: [
    {
      text: {
        ar: "اقرأ المزيد",
        en: "Read More"
      },
      url: "/about"
    }
  ]
}
```

**Rendering**:

```typescript
// In component
const { locale } = useEditorLocale();

return (
  <section>
    <h1>{data.title?.[locale] || data.title}</h1>
    <p>{data.description?.[locale] || data.description}</p>

    {data.buttons?.map(btn => (
      <a href={btn.url}>
        {btn.text?.[locale] || btn.text}
      </a>
    ))}
  </section>
);
```

---

## Translation Keys Organization

### Key Naming Convention

```
{category}.{subcategory}.{item}.{property}

Examples:
  live_editor.title                          # Editor title
  live_editor.buttons.save                   # Save button
  live_editor.dialogs.unsaved_changes.title  # Dialog title

  components.hero.display_name               # Component name
  components.hero.description                # Component description
  components.hero.fields.title.label         # Field label

  sections.homepage.display_name             # Section name
```

### Nested Translations

```json
{
  "live_editor": {
    "sidebar": {
      "main": {
        "title": "Settings",
        "add_section": "Add New Section",
        "theme_settings": "Theme Settings"
      },
      "edit": {
        "title": "Edit Component",
        "save": "Save Changes",
        "cancel": "Cancel",
        "reset": "Reset to Default"
      }
    }
  }
}
```

**Access**:

```typescript
t("live_editor.sidebar.main.title"); // "Settings"
t("live_editor.sidebar.edit.save"); // "Save Changes"
```

---

## Locale-Specific Behavior

### RTL Support

```typescript
// In component
const { locale } = useEditorLocale();
const direction = locale === "ar" ? "rtl" : "ltr";

return (
  <div dir={direction} className={locale === "ar" ? "font-arabic" : "font-english"}>
    {/* Content */}
  </div>
);
```

### Date Formatting

```typescript
const formatDate = (date, locale) => {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Usage
formatDate(new Date(), locale);
// Arabic: "٢٦ أكتوبر ٢٠٢٥"
// English: "October 26, 2025"
```

### Number Formatting

```typescript
const formatNumber = (number, locale) => {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(
    number,
  );
};

// Usage
formatNumber(123456, locale);
// Arabic: "١٢٣٬٤٥٦"
// English: "123,456"
```

---

## Best Practices

### Practice 1: Use Translation Keys, Not Hardcoded Text

```typescript
// ❌ BAD
<button>Save</button>

// ✅ GOOD
<button>{t("live_editor.save")}</button>
```

### Practice 2: Provide Fallback Values

```typescript
// ✅ GOOD
displayName: t("components.hero.display_name") || "Hero";
```

### Practice 3: Group Related Translations

```json
{
  "components": {
    "hero": {
      "display_name": "...",
      "description": "...",
      "fields": {
        "title": {
          "label": "...",
          "placeholder": "..."
        }
      }
    }
  }
}
```

### Practice 4: Use Meaningful Keys

```typescript
// ❌ BAD
t("btn1");
t("text_123");

// ✅ GOOD
t("live_editor.buttons.save");
t("components.hero.fields.title.label");
```

---

## Translation Workflow

### Adding New Translations

```
STEP 1: Identify Translation Needs
────────────────────────────────────────────────
New feature: Add "Duplicate" button

Needs:
  - Button label
  - Confirmation dialog title
  - Confirmation dialog message


STEP 2: Choose Translation Keys
────────────────────────────────────────────────
  live_editor.buttons.duplicate
  live_editor.dialogs.duplicate_component.title
  live_editor.dialogs.duplicate_component.message


STEP 3: Add to Arabic Translation (ar.json)
────────────────────────────────────────────────
{
  "live_editor": {
    "buttons": {
      "duplicate": "تكرار"
    },
    "dialogs": {
      "duplicate_component": {
        "title": "تكرار المكون",
        "message": "هل تريد تكرار هذا المكون؟"
      }
    }
  }
}


STEP 4: Add to English Translation (en.json)
────────────────────────────────────────────────
{
  "live_editor": {
    "buttons": {
      "duplicate": "Duplicate"
    },
    "dialogs": {
      "duplicate_component": {
        "title": "Duplicate Component",
        "message": "Do you want to duplicate this component?"
      }
    }
  }
}


STEP 5: Use in Component
────────────────────────────────────────────────
import { useEditorT } from "@/context-liveeditor/editorI18nStore";

function DuplicateButton() {
  const t = useEditorT();

  return (
    <button onClick={handleDuplicate}>
      {t("live_editor.buttons.duplicate")}
    </button>
  );
}


RESULT: Feature supports both languages ✓
```

---

## Important Notes for AI

### When Adding i18n Support

1. **Always use t() for user-facing text**:

   ```typescript
   // Not just for labels and buttons
   // Also for: errors, placeholders, descriptions, tooltips
   ```

2. **Provide both ar and en translations**:

   ```typescript
   // Never add to just one language file
   ```

3. **Use consistent key structure**:

   ```typescript
   // Follow existing patterns
   {category}.{subcategory}.{item}
   ```

4. **Handle missing translations gracefully**:
   ```typescript
   t("some.key") || "Fallback text";
   ```

### When Translating Components

1. **Update getComponents() function**: Add translations
2. **Update ComponentsList COMPONENTS**: Keep legacy version for compatibility
3. **Use translated helpers**: `getComponentByIdTranslated(id, t)`
4. **Translate structure fields**: Use `translateComponentStructure()`

### Common Patterns

**Pattern 1**: Component with translation

```typescript
const t = useEditorT();
const component = getComponentByIdTranslated("hero", t);

<h3>{component.displayName}</h3>  // Translated based on locale
```

**Pattern 2**: Multi-language content

```typescript
const { locale } = useEditorLocale();

<h1>{data.title?.[locale] || data.title}</h1>
```

**Pattern 3**: Parameterized translation

```typescript
t("messages.items_count", { count: items.length });
// Arabic: "عدد العناصر: {{count}}"
// Result: "عدد العناصر: 5"
```

---

## Summary

The i18n system provides:

1. **Multi-language UI**: Editor interface in Arabic and English
2. **Component translations**: Names and descriptions translated
3. **Field translations**: Labels, placeholders, descriptions
4. **Content editing**: Support for multi-language user content
5. **Persistent preference**: User's language choice saved
6. **Fallback mechanism**: Missing translations fall back gracefully

**Key Components**:

- editorI18nStore: State management for locale
- Translation files: ar.json, en.json
- useEditorT hook: Translation function
- LanguageSwitcher: UI for changing language
- TranslationFields: Multi-language content editing

**Integration**:

- Used throughout Live Editor
- ComponentsList has translated versions
- Structure fields can be translated
- All UI text should use t() function

Understanding i18n is important for:

- Adding new features with proper translations
- Supporting additional languages
- Debugging translation issues
- Maintaining consistency across locales
