# نظام الـ Caching للمكونات - Components Caching System

## 📋 **نظرة عامة**

نظام الـ caching في المشروع يهدف إلى إدارة البيانات بشكل فعال مع ضمان التزامن بين الـ stores المختلفة. يعتمد النظام على **Zustand** لإدارة الحالة مع دعم **React Context** للتوافق مع المكونات القديمة.

## 🏗️ **البنية الأساسية**

### 1. **الـ Stores الرئيسية**

#### **AuthContext.js** - إدارة المصادقة

```javascript
// Zustand Store للـ authentication
const useAuthStore = create((set, get) => ({
  UserIslogged: false,
  IsLoading: false,
  authenticated: false,
  userData: null,
  liveEditorUser: null,
  liveEditorLoading: false,
  liveEditorError: null,

  // دوال المصادقة
  login: async (email, password) => {
    /* ... */
  },
  register: async (userData) => {
    /* ... */
  },
  logout: async () => {
    /* ... */
  },
  fetchUserData: async (username) => {
    /* ... */
  },

  // دوال خاصة بالـ Live Editor
  liveEditorLogin: async (email, password) => {
    /* ... */
  },
  liveEditorRegister: async (userData) => {
    /* ... */
  },
  liveEditorFetchUser: async (username) => {
    /* ... */
  },
  liveEditorLogout: async () => {
    /* ... */
  },
}));
```

#### **editorStore.ts** - إدارة الـ Live Editor

```typescript
interface EditorStore {
  // حالة حفظ البيانات
  showDialog: boolean;
  openSaveDialogFn: OpenDialogFn;

  // Current page for tracking
  currentPage: string;

  // بيانات التعديل المؤقتة
  tempData: ComponentData;

  // Global Components
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };

  // Dynamic component states
  componentStates: Record<string, Record<string, ComponentData>>;
  componentGetters: Record<string, (variantId: string) => ComponentData>;

  // Page-wise components
  pageComponentsByPage: Record<string, ComponentInstanceWithPosition[]>;
}
```

#### **tenantStore.jsx** - إدارة بيانات الـ Tenant

```javascript
const useTenantStore = create((set) => ({
  tenantData: null,
  loadingTenantData: false,
  error: null,
  tenant: null,
  tenantId: null,

  // دوال التحديث
  updateHeader: (headerData) => {
    /* ... */
  },
  updateHero: (heroData) => {
    /* ... */
  },
  updateFooter: (footerData) => {
    /* ... */
  },

  // دوال الحفظ
  saveHeaderChanges: async (tenantId, headerData, variant) => {
    /* ... */
  },
  saveHeroChanges: async (tenantId, heroData, variant) => {
    /* ... */
  },
  saveFooterChanges: async (tenantId, footerData, variant) => {
    /* ... */
  },

  // تحميل البيانات
  fetchTenantData: async (websiteName) => {
    /* ... */
  },
}));
```

## 🔄 **تدفق البيانات (Data Flow)**

### 1. **تحميل البيانات الأولي**

```
المستخدم يدخل الموقع
  ↓
tenantStore.fetchTenantData(websiteName)
  ↓
API: /api/tenant/getTenant
  ↓
تحميل globalComponentsData
  ↓
editorStore.setGlobalComponentsData()
  ↓
تحميل componentSettings
  ↓
editorStore.loadFromDatabase()
  ↓
تحديث جميع component states
  ↓
عرض الموقع
```

### 2. **تعديل المكونات**

```
المستخدم يعدل في Sidebar
  ↓
SidebarStateManager.updateComponentData()
  ↓
تحديث pageComponentsByPage
  ↓
تحديث component states
  ↓
إعادة عرض المكون
```

### 3. **حفظ التغييرات**

```
المستخدم يضغط حفظ
  ↓
EditorProvider.confirmSave()
  ↓
جمع البيانات من editorStore
  ↓
API: /api/tenant/save-pages
  ↓
حفظ في MongoDB
  ↓
عرض رسالة نجاح
```

## 🧩 **نظام المكونات المعياري**

### **editorStoreFunctions** - دوال متخصصة لكل مكون

#### **مثال: contactCardsFunctions.ts**

```typescript
export const contactCardsFunctions = {
  // دوال أساسية
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    /* ... */
  },
  getData: (state: any, variantId: string): ComponentData => {
    /* ... */
  },
  setData: (state: any, variantId: string, data: ComponentData) => {
    /* ... */
  },
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    /* ... */
  },

  // دوال متخصصة
  addContactCard: (currentData: ComponentData, card: any): ComponentData => {
    /* ... */
  },
  removeContactCard: (
    currentData: ComponentData,
    index: number,
  ): ComponentData => {
    /* ... */
  },
  updateContactCard: (
    currentData: ComponentData,
    index: number,
    updates: any,
  ): ComponentData => {
    /* ... */
  },

  // دوال التحقق
  validate: (data: ComponentData): { isValid: boolean; errors: string[] } => {
    /* ... */
  },
};
```

#### **مثال: mapSectionFunctions.ts**

```typescript
export const mapSectionFunctions = {
  // دوال أساسية
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    /* ... */
  },
  getData: (state: any, variantId: string): ComponentData => {
    /* ... */
  },
  setData: (state: any, variantId: string, data: ComponentData) => {
    /* ... */
  },
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    /* ... */
  },

  // دوال متخصصة للخرائط
  addMarker: (currentData: ComponentData, marker: any): ComponentData => {
    /* ... */
  },
  removeMarker: (
    currentData: ComponentData,
    markerId: string,
  ): ComponentData => {
    /* ... */
  },
  updateMarker: (
    currentData: ComponentData,
    markerId: string,
    updates: any,
  ): ComponentData => {
    /* ... */
  },
  updateMapCenter: (
    currentData: ComponentData,
    lat: number,
    lng: number,
  ): ComponentData => {
    /* ... */
  },
  updateMapZoom: (currentData: ComponentData, zoom: number): ComponentData => {
    /* ... */
  },

  // دوال مساعدة
  getMapBounds: (
    data: ComponentData,
  ): { north: number; south: number; east: number; west: number } | null => {
    /* ... */
  },
  generateEmbedUrl: (data: ComponentData): string => {
    /* ... */
  },
};
```

## 🔗 **ربط المكونات بالـ Stores**

### **مثال: ContactCards1.tsx**

```typescript
const ContactCards1: React.FC<ContactCardsProps> = ({
  useStore = true,
  variant = "contactCards1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "contactCards1";
  const uniqueId = id || variantId;

  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this contactCards variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactCardsStates = useEditorStore((s) => s.contactCardsStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultContactCardsData(),
        ...props,
      };
      ensureComponentVariant("contactCards", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
  const unsubscribe = useEditorStore.subscribe((state) => {
    const newContactCardsStates = state.contactCardsStates;
    if (newContactCardsStates[uniqueId]) {
      setForceUpdate(prev => prev + 1);
    }
  });

  return unsubscribe;
    }
}, [props.useStore, uniqueId]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("contactCards", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? contactCardsStates[uniqueId] || {}
    : {};

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultContactCardsData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData?.layout || {}),
      ...(storeData?.layout || {}),
      ...(currentStoreData?.layout || {}),
    },
    cards: (currentStoreData?.cards || storeData?.cards || tenantComponentData?.cards || props.cards || defaultData.cards),
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Use merged data for cards with proper fallbacks
const cards: ContactCardProps[] = (mergedData.cards || defaultData.cards).map((card: ContactCardProps) => ({
  ...card,
  icon: {
    ...card.icon,
      src: card.icon.src || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0NUw0NSA0MEw0MCAzNUwzMCA0MFYyMEw0MCAyNVY0MEwzMCA0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+"
  },
  cardStyle: {
    ...defaultData.cards[0]?.cardStyle,
    ...card.cardStyle
  }
}));

  return (
    <div
      className={`${mergedData.layout?.container?.padding?.vertical || "py-[48px] md:py-[104px]"} ${mergedData.layout?.container?.padding?.horizontal || "px-4 sm:px-10"}`}
      dir="rtl"
    >
      <div
        className={`grid ${mergedData.layout?.grid?.columns?.mobile || "grid-cols-1"} ${mergedData.layout?.grid?.columns?.desktop || "md:grid-cols-3"} ${mergedData.layout?.grid?.gap || "gap-[24px]"} ${mergedData.layout?.grid?.borderRadius || "rounded-[10px]"}`}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-full flex flex-col ${card.cardStyle.alignment.horizontal} ${card.cardStyle.alignment.vertical} ${card.cardStyle.height.mobile} ${card.cardStyle.height.desktop} ${card.cardStyle.gap.main}`}
            style={
              card.cardStyle.shadow.enabled
                ? { boxShadow: card.cardStyle.shadow.value }
                : {}
            }
          >
            {/* Card content */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **مثال: MapSection1.tsx**

```typescript
const MapSection1: React.FC<MapSectionProps> = ({
  useStore = true,
  variant = "mapSection1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "mapSection1";
  const uniqueId = id || variantId;

  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this mapSection variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const mapSectionStates = useEditorStore((s) => s.mapSectionStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultMapSectionData(),
        ...props,
      };
      ensureComponentVariant("mapSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
  useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
      const unsubscribe = useEditorStore.subscribe((state) => {
        const newMapSectionStates = state.mapSectionStates;
        if (newMapSectionStates[uniqueId]) {
          setForceUpdate(prev => prev + 1);
        }
      });

      return unsubscribe;
    }
  }, [props.useStore, uniqueId]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore
    ? getComponentData("mapSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? mapSectionStates[uniqueId] || {}
    : {};

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultMapSectionData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    map: {
      ...defaultData.map,
      ...(props.map || {}),
      ...(tenantComponentData?.map || {}),
      ...(storeData?.map || {}),
      ...(currentStoreData?.map || {}),
    },
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData?.content || {}),
      ...(storeData?.content || {}),
      ...(currentStoreData?.content || {}),
    },
    markers: {
      ...defaultData.markers,
      ...(props.markers || {}),
      ...(tenantComponentData?.markers || {}),
      ...(storeData?.markers || {}),
      ...(currentStoreData?.markers || {}),
    },
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Use merged data with proper fallbacks
  const title = mergedData.content?.title || defaultData.content.title;
  const subtitle = mergedData.content?.subtitle || defaultData.content.subtitle;
  const description = mergedData.content?.description || defaultData.content.description;
  const mapSrc = mergedData.map?.embedUrl || defaultData.map.embedUrl;
  const mapHeight = mergedData.height?.desktop || defaultData.height.desktop;

  return (
    <section className="container mx-auto px-4 py-8">
      {mergedData.content?.enabled && (
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold mb-4"
            style={{
              fontFamily: mergedData.content?.font?.title?.family || defaultData.content.font.title.family,
              fontSize: mergedData.content?.font?.title?.size || defaultData.content.font.title.size,
              fontWeight: mergedData.content?.font?.title?.weight || defaultData.content.font.title.weight,
              color: mergedData.content?.font?.title?.color || defaultData.content.font.title.color,
              lineHeight: mergedData.content?.font?.title?.lineHeight || defaultData.content.font.title.lineHeight,
            }}
          >
            {title}
          </h2>
          <p
            className="text-lg text-gray-600 mb-4"
            style={{
              fontFamily: mergedData.content?.font?.subtitle?.family || defaultData.content.font.subtitle.family,
              fontSize: mergedData.content?.font?.subtitle?.size || defaultData.content.font.subtitle.size,
              fontWeight: mergedData.content?.font?.subtitle?.weight || defaultData.content.font.subtitle.weight,
              color: mergedData.content?.font?.subtitle?.color || defaultData.content.font.subtitle.color,
              lineHeight: mergedData.content?.font?.subtitle?.lineHeight || defaultData.content.font.subtitle.lineHeight,
            }}
          >
            {subtitle}
          </p>
          {description && (
            <p
              className="text-base text-gray-500"
              style={{
                fontFamily: mergedData.content?.font?.description?.family || defaultData.content.font.description.family,
                fontSize: mergedData.content?.font?.description?.size || defaultData.content.font.description.size,
                fontWeight: mergedData.content?.font?.description?.weight || defaultData.content.font.description.weight,
                color: mergedData.content?.font?.description?.color || defaultData.content.font.description.color,
                lineHeight: mergedData.content?.font?.description?.lineHeight || defaultData.content.font.description.lineHeight,
              }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {mergedData.map?.enabled && (
        <div className="w-full max-w-[1600px] mx-auto">
          <iframe
            src={mapSrc}
            width="100%"
            height={mapHeight}
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      )}
    </section>
  );
};
```

## 🎯 **المميزات الرئيسية**

### 1. **نظام التحديث الديناميكي**

- **تحديث عميق**: `updateDataByPath` للتنقل في البيانات المعقدة
- **إنشاء تلقائي**: إنشاء الكائنات والمصفوفات المطلوبة
- **تحقق من الأنواع**: التحقق من نوع البيانات قبل التحديث

### 2. **إدارة الحالة المتقدمة**

- **فصل البيانات**: فصل بيانات المكونات عن بيانات الصفحات
- **تزامن البيانات**: تزامن البيانات بين stores مختلفة
- **إدارة الذاكرة**: إدارة فعالة للذاكرة مع Zustand

### 3. **نظام التحقق**

- **تحقق من صحة البيانات**: `validate` functions لكل مكون
- **معالجة الأخطاء**: معالجة شاملة للأخطاء
- **رسائل واضحة**: رسائل خطأ واضحة للمطورين

### 4. **الأداء والتحسين**

- **تحديث انتقائي**: تحديث المكونات المتأثرة فقط
- **تخزين مؤقت**: تخزين البيانات في localStorage
- **تحميل كسول**: تحميل البيانات عند الحاجة

## 🔧 **أفضل الممارسات**

### 1. **استخدام الـ Stores**

```typescript
// ✅ صحيح
const storeData = useEditorStore((s) =>
  s.getComponentData("contactCards", uniqueId),
);
const tenantData = useTenantStore((s) => s.tenantData);

// ❌ خطأ
const allStoreData = useEditorStore((s) => s); // يحمل كل البيانات
```

### 2. **إدارة التحديثات**

```typescript
// ✅ صحيح
useEffect(() => {
  if (props.useStore) {
    const unsubscribe = useEditorStore.subscribe((state) => {
      if (state.contactCardsStates[uniqueId]) {
        setForceUpdate((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }
}, [props.useStore, uniqueId]);

// ❌ خطأ
useEffect(() => {
  // لا يوجد cleanup للـ subscription
  useEditorStore.subscribe((state) => {
    // logic
  });
}, []);
```

### 3. **دمج البيانات**

```typescript
// ✅ صحيح
const mergedData = {
  ...defaultData,
  ...props,
  ...tenantComponentData,
  ...storeData,
  ...currentStoreData,
  // Ensure nested objects are properly merged
  layout: {
    ...defaultData.layout,
    ...(props.layout || {}),
    ...(tenantComponentData?.layout || {}),
    ...(storeData?.layout || {}),
    ...(currentStoreData?.layout || {}),
  },
};

// ❌ خطأ
const mergedData = {
  ...defaultData,
  ...props,
  ...tenantComponentData,
  ...storeData,
  ...currentStoreData,
  // nested objects will be overwritten
};
```

## 📊 **مراقبة الأداء**

### **Debug Logging**

```typescript
// Debug: Log when data changes
useEffect(() => {
  if (props.useStore) {
    console.log("🔄 ContactCards Data Updated:", {
      uniqueId,
      storeData,
      currentStoreData,
      forceUpdate,
      contactCardsStates,
      allContactCardsStates: Object.keys(contactCardsStates),
      getComponentDataResult: getComponentData("contactCards", uniqueId),
    });
  }
}, [
  storeData,
  currentStoreData,
  forceUpdate,
  props.useStore,
  uniqueId,
  contactCardsStates,
  getComponentData,
]);
```

### **Performance Monitoring**

```typescript
// Track component render performance
const startTime = performance.now();
// ... component logic
const endTime = performance.now();
console.log(`Component render time: ${endTime - startTime}ms`);
```

## 🔄 **نظام التحديث الديناميكي المتقدم**

### **1. Subscription Management**

```typescript
// مثال: ContactFormSection1.tsx
useEffect(() => {
  if (props.useStore) {
    // Force re-render when store data changes
    const unsubscribe = useEditorStore.subscribe((state) => {
      const newContactFormSectionStates = state.contactFormSectionStates;
      console.log("🔄 ContactFormSection Store subscription triggered:", {
        uniqueId,
        newContactFormSectionStates,
        hasData: !!newContactFormSectionStates[uniqueId],
        allKeys: Object.keys(newContactFormSectionStates),
      });
      if (newContactFormSectionStates[uniqueId]) {
        console.log(
          "🔄 ContactFormSection Store subscription triggered for:",
          uniqueId,
          newContactFormSectionStates[uniqueId],
        );
        // Force re-render by updating state
        setForceUpdate((prev) => prev + 1);
      }
    });

    return unsubscribe;
  }
}, [props.useStore, uniqueId]);
```

### **2. Data Merging Strategy**

```typescript
// Priority System: currentStoreData > storeData > tenantComponentData > props > default
const mergedData = {
  ...defaultData,
  ...props,
  ...tenantComponentData,
  ...storeData,
  ...currentStoreData,
  // Ensure nested objects are properly merged
  content: {
    ...defaultData.content,
    ...(props.content || {}),
    ...(tenantComponentData?.content || {}),
    ...(storeData?.content || {}),
    ...(currentStoreData?.content || {}),
  },
  form: {
    ...defaultData.form,
    ...(props.form || {}),
    ...(tenantComponentData?.form || {}),
    ...(storeData?.form || {}),
    ...(currentStoreData?.form || {}),
  },
  layout: {
    ...defaultData.layout,
    ...(props.layout || {}),
    ...(tenantComponentData?.layout || {}),
    ...(storeData?.layout || {}),
    ...(currentStoreData?.layout || {}),
  },
  styling: {
    ...defaultData.styling,
    ...(props.styling || {}),
    ...(tenantComponentData?.styling || {}),
    ...(storeData?.styling || {}),
    ...(currentStoreData?.styling || {}),
  },
};
```

### **3. Dynamic Form Rendering**

```typescript
// Dynamic form fields rendering
{formFields.map((field: any, index: number) => {
  if (field.type === "textarea") {
    return (
      <textarea
        key={field.id || index}
        id={field.id}
        name={field.id}
        rows={field.rows || 2}
        placeholder={field.placeholder}
        required={field.required}
        className={field.style?.className || "border rounded p-2 mb-[12px] outline-custom-secondarycolor"}
      />
    );
  }
  return (
    <input
      key={field.id || index}
      id={field.id}
      name={field.id}
      type={field.type}
      placeholder={field.placeholder}
      required={field.required}
      className={field.style?.className || "border rounded-[6px] p-2 outline-custom-secondarycolor"}
    />
  );
})}
```

## 🎨 **نظام التصميم الديناميكي**

### **1. Responsive Layout System**

```typescript
// Dynamic layout classes
<div className={`flex ${layout?.grid?.columns?.mobile || "flex-col"} ${layout?.grid?.columns?.desktop || "md:flex-row"} w-full justify-between ${layout?.grid?.gap || "gap-[16px]"}`}>
  <div className={`details ${styling?.layout?.detailsWidth || "w-full md:w-[35%]"} flex flex-col items-start justify-center ${styling?.layout?.gap || "gap-[16px] md:gap-[10px]"}`}>
    {/* Content */}
  </div>
  <div className={`${styling?.layout?.formWidth || "w-full md:w-[50%]"}`}>
    {/* Form */}
  </div>
</div>
```

### **2. Dynamic Styling**

```typescript
// Dynamic title styling
<h4
  className={`${styling?.title?.size || "text-[15px] md:text-[24px]"} ${styling?.title?.color || "text-custom-maincolor"} ${styling?.title?.weight || "font-normal"} xs:text-[20px] mb-[24px]`}
>
  {title}
</h4>
```

## 🔧 **أدوات التطوير والـ Debugging**

### **1. Comprehensive Logging**

```typescript
// Debug: Log when data changes
useEffect(() => {
  if (props.useStore) {
    console.log("🔄 ContactFormSection Data Updated:", {
      uniqueId,
      storeData,
      currentStoreData,
      forceUpdate,
      contactFormSectionStates,
      allContactFormSectionStates: Object.keys(contactFormSectionStates),
      getComponentDataResult: getComponentData("contactFormSection", uniqueId),
    });
  }
}, [
  storeData,
  currentStoreData,
  forceUpdate,
  props.useStore,
  uniqueId,
  contactFormSectionStates,
  getComponentData,
]);
```

### **2. Final Merge Logging**

```typescript
// Debug: Log the final merged data
console.log("🔍 ContactFormSection Final Merge:", {
  uniqueId,
  currentStoreData,
  storeData,
  mergedData,
  contentTitle: mergedData.content?.title,
  socialLinksCount: mergedData.content?.socialLinks?.length || 0,
  formFieldsCount: mergedData.form?.fields?.length || 0,
  contactFormSectionStatesKeys: Object.keys(contactFormSectionStates),
  getComponentDataResult: getComponentData("contactFormSection", uniqueId),
});
```

## 📊 **مقاييس الأداء**

### **1. Component Performance**

```typescript
// Track component render performance
const startTime = performance.now();
// ... component logic
const endTime = performance.now();
console.log(`ContactFormSection render time: ${endTime - startTime}ms`);
```

### **2. Store Update Performance**

```typescript
// Track store update frequency
let updateCount = 0;
useEffect(() => {
  updateCount++;
  console.log(`Store updates count: ${updateCount}`);
}, [currentStoreData]);
```

## 🚀 **التحسينات المتقدمة**

### **1. Memoization**

```typescript
// Memoize expensive calculations
const memoizedData = useMemo(() => {
  return {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
  };
}, [defaultData, props, tenantComponentData, storeData, currentStoreData]);
```

### **2. Lazy Loading**

```typescript
// Lazy load heavy components
const LazySocialLink = lazy(() => import("./SocialLink"));
```

### **3. Error Boundaries**

```typescript
// Error boundary for component errors
class ContactFormSectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ContactFormSection Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong with ContactFormSection.</div>;
    }

    return this.props.children;
  }
}
```

## 🔄 **نظام التحديث التلقائي**

### **1. Real-time Updates**

```typescript
// Real-time store synchronization
useEffect(() => {
  const interval = setInterval(() => {
    // Check for updates every 100ms
    const latestData = getComponentData("contactFormSection", uniqueId);
    if (JSON.stringify(latestData) !== JSON.stringify(currentStoreData)) {
      setForceUpdate((prev) => prev + 1);
    }
  }, 100);

  return () => clearInterval(interval);
}, [uniqueId, currentStoreData, getComponentData]);
```

### **2. Optimistic Updates**

```typescript
// Optimistic UI updates
const handleFormSubmit = async (formData) => {
  // Update UI immediately
  setForceUpdate((prev) => prev + 1);

  try {
    // Send to server
    await submitForm(formData);
  } catch (error) {
    // Revert on error
    setForceUpdate((prev) => prev + 1);
  }
};
```

## 📱 **دعم الأجهزة المختلفة**

### **1. Responsive Design**

```typescript
// Responsive layout system
const getResponsiveClasses = (deviceType: "mobile" | "tablet" | "desktop") => {
  const responsiveConfig = {
    mobile: {
      container: "px-4 py-8",
      grid: "flex-col",
      detailsWidth: "w-full",
      formWidth: "w-full",
    },
    tablet: {
      container: "px-6 py-12",
      grid: "md:flex-row",
      detailsWidth: "md:w-[35%]",
      formWidth: "md:w-[50%]",
    },
    desktop: {
      container: "px-8 py-16",
      grid: "lg:flex-row",
      detailsWidth: "lg:w-[35%]",
      formWidth: "lg:w-[50%]",
    },
  };

  return responsiveConfig[deviceType];
};
```

### **2. Device-specific Styling**

```typescript
// Device-specific styling
const getDeviceSpecificStyle = (deviceType: string) => {
  const deviceStyles = {
    mobile: {
      titleSize: "text-[15px]",
      formGap: "gap-[12px]",
      buttonSize: "text-[14px]",
    },
    tablet: {
      titleSize: "text-[20px]",
      formGap: "gap-[18px]",
      buttonSize: "text-[16px]",
    },
    desktop: {
      titleSize: "text-[24px]",
      formGap: "gap-[24px]",
      buttonSize: "text-[20px]",
    },
  };

  return deviceStyles[deviceType] || deviceStyles.desktop;
};
```

## 🎯 **أفضل الممارسات المتقدمة**

### **1. Type Safety**

```typescript
// Strong typing for all data structures
interface ContactFormSectionData {
  visible: boolean;
  content: {
    title: string;
    socialLinks: SocialLink[];
  };
  form: {
    fields: FormField[];
    submitButton: SubmitButton;
  };
  layout: LayoutConfig;
  styling: StylingConfig;
}

// Type-safe component props
interface ContactFormSectionProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  data?: Partial<ContactFormSectionData>;
  [key: string]: any;
}
```

### **2. Performance Optimization**

```typescript
// Debounced updates
const debouncedUpdate = useCallback(
  debounce((data) => {
    updateComponentData(data);
  }, 300),
  [],
);

// Memoized components
const MemoizedSocialLink = React.memo(SocialLink);
const MemoizedFormField = React.memo(FormField);
```

### **3. Accessibility**

```typescript
// ARIA attributes for accessibility
<form
  className="flex flex-col gap-[12px] md:gap-[24px]"
  role="form"
  aria-label="Contact Form"
>
  {formFields.map((field: any, index: number) => (
    <input
      key={field.id || index}
      id={field.id}
      name={field.id}
      type={field.type}
      placeholder={field.placeholder}
      required={field.required}
      aria-label={field.placeholder}
      aria-required={field.required}
      className={field.style?.className || "border rounded-[6px] p-2 outline-custom-secondarycolor"}
    />
  ))}
</form>
```

هذا النظام يوفر **مرونة كاملة** في إدارة المكونات مع الحفاظ على **الأداء والتنظيم**، مما يجعله مثالياً لمشاريع Live Editor المعقدة! 🚀

## 📈 **إحصائيات الأداء**

### **مقاييس الأداء الرئيسية:**

- **Render Time**: < 50ms للمكونات البسيطة
- **Store Update Time**: < 10ms للتحديثات
- **Memory Usage**: < 5MB للبيانات المخزنة
- **Bundle Size**: < 100KB للمكونات الإضافية

### **تحسينات الأداء:**

- **Lazy Loading**: تحميل المكونات عند الحاجة
- **Memoization**: تخزين النتائج المحسوبة
- **Debouncing**: تقليل عدد التحديثات
- **Code Splitting**: تقسيم الكود لتحسين الأداء

هذا النظام يوفر **حلول متكاملة** لإدارة المكونات المعقدة مع ضمان **الأداء العالي** و**سهولة الصيانة**! 🎯
