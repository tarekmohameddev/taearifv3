# دليل محرر الموقع المباشر (Live Editor)

## نظرة عامة

محرر الموقع المباشر هو نظام متقدم لبناء وتحرير المواقع الإلكترونية بشكل تفاعلي. يتكون من عدة مكونات مترابطة تعمل معاً لتوفير تجربة تحرير سلسة ومتطورة.

## البنية المعمارية

### 1. المكونات الرئيسية

#### أ) المكون الرئيسي - LiveEditor

```typescript
// components/tenant/live-editor/LiveEditor.tsx
export default function LiveEditor() {
  const state = useLiveEditorState();
  const computed = useLiveEditorComputed(state);
  const handlers = useLiveEditorHandlers(state);

  useLiveEditorEffects(state);

  return <LiveEditorUI state={state} computed={computed} handlers={handlers} />;
}
```

**الوظائف:**

- تجميع جميع الـ hooks والـ effects
- إدارة الحالة العامة للمحرر
- تنسيق التفاعل بين المكونات المختلفة

#### ب) واجهة المستخدم الرئيسية - LiveEditorUI

```typescript
// components/tenant/live-editor/LiveEditorUI.tsx
export function LiveEditorUI({ state, computed, handlers }: LiveEditorUIProps);
```

**المكونات الفرعية:**

- **AutoFrame**: إطار iframe متقدم مع نسخ الـ styles
- **ComponentsSidebar**: شريط جانبي للمكونات
- **EditorSidebar**: شريط جانبي للتحرير
- **Device Preview**: معاينة الأجهزة المختلفة

### 2. إدارة الحالة (State Management)

#### أ) EditorStore - المتجر الرئيسي

```typescript
// context-liveeditor/editorStore.ts
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Global Components
  globalHeaderData: ComponentData;
  globalFooterData: ComponentData;
  globalComponentsData: {
    header: ComponentData;
    footer: ComponentData;
  };

  // Component States
  componentStates: Record<string, Record<string, ComponentData>>;

  // Page Components
  pageComponentsByPage: Record<string, ComponentInstanceWithPosition[]>;

  // Functions
  ensureComponentVariant: (componentType, variantId, initial) => void;
  getComponentData: (componentType, variantId) => ComponentData;
  setComponentData: (componentType, variantId, data) => void;
  updateComponentByPath: (componentType, variantId, path, value) => void;
}));
```

**الوظائف الرئيسية:**

- إدارة بيانات المكونات العالمية (Header, Footer)
- تتبع حالة كل مكون بشكل منفصل
- ربط المكونات بالصفحات
- تحديث البيانات عبر المسارات (paths)

#### ب) Hooks المتخصصة

**useLiveEditorState:**

```typescript
export function useLiveEditorState() {
  // إدارة الحالة المحلية
  const [pageComponents, setPageComponents] = useState<ComponentInstance[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );

  return {
    pageComponents,
    setPageComponents,
    sidebarOpen,
    setSidebarOpen,
    selectedComponentId,
    setSelectedComponentId,
    // ... المزيد من الحالات
  };
}
```

**useLiveEditorComputed:**

```typescript
export function useLiveEditorComputed(state) {
  // القيم المحسوبة
  const selectedComponent = useMemo(() => {
    return pageComponents.find((c) => c.id === selectedComponentId);
  }, [selectedComponentId, pageComponents]);

  return { selectedComponent, pageTitle, isPredefinedPage };
}
```

**useLiveEditorEffects:**

```typescript
export function useLiveEditorEffects(state) {
  // Authentication Effect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Database Loading Effect
  useEffect(() => {
    if (!initialized && !authLoading && !tenantLoading && tenantData) {
      // تحميل البيانات من قاعدة البيانات
      editorStore.loadFromDatabase(tenantData);
      setInitialized(true);
    }
  }, [initialized, authLoading, tenantLoading, tenantData]);
}
```

### 3. نظام الـ iframe المتقدم

#### AutoFrame Component

```typescript
const AutoFrame = ({ children, frameRef, onReady, onNotReady }) => {
  const [loaded, setLoaded] = useState(false);
  const [mountTarget, setMountTarget] = useState<HTMLElement | null>(null);
  const [stylesLoaded, setStylesLoaded] = useState(false);

  // نسخ الـ styles من الـ parent window إلى الـ iframe
  const copyStylesToIframe = useCallback((iframeDoc: Document) => {
    const styleElements = document.querySelectorAll(
      'style, link[rel="stylesheet"]',
    );
    const iframeHead = iframeDoc.head;

    styleElements.forEach((styleEl) => {
      if (styleEl.tagName === "STYLE") {
        const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
        iframeHead.appendChild(clonedStyle);
      }
    });

    // نسخ CSS variables
    const parentComputedStyle = getComputedStyle(document.documentElement);
    for (let i = 0; i < parentComputedStyle.length; i++) {
      const property = parentComputedStyle[i];
      if (property.startsWith("--")) {
        const value = parentComputedStyle.getPropertyValue(property);
        iframeDoc.documentElement.style.setProperty(property, value);
      }
    }
  }, []);
};
```

**المميزات:**

- نسخ تلقائي للـ styles من النافذة الرئيسية
- مراقبة التغييرات في الـ styles
- تحديث CSS variables بشكل دوري
- دعم الـ responsive design

### 4. شريط التحرير الجانبي (EditorSidebar)

#### البنية الأساسية

```typescript
// components/tenant/live-editor/EditorSidebar/index.tsx
export function EditorSidebar({
  isOpen,
  onClose,
  view,
  setView,
  selectedComponent,
  onComponentUpdate,
  width,
  setWidth,
}: EditorSidebarProps) {
  const {
    tempData,
    setTempData,
    updateByPath,
    globalHeaderData,
    globalFooterData,
    updateGlobalComponentByPath,
  } = useEditorStore();

  // إدارة البيانات المؤقتة
  const handleInputChange = (field, key, value) => {
    updateTempField(field, key, value);
  };

  const handleSave = () => {
    // حفظ التغييرات
    setHasChangesMade(true);
    // تحديث البيانات في المتجر
    store.setComponentData(
      selectedComponent.type,
      selectedComponent.id,
      mergedData,
    );
    onComponentUpdate(selectedComponent.id, mergedData);
  };
}
```

#### المكونات الفرعية

**1. AdvancedSimpleSwitcher:**

```typescript
// components/tenant/live-editor/EditorSidebar/components/AdvancedSimpleSwitcher.tsx
export function AdvancedSimpleSwitcher({
  type,
  componentName,
  componentId,
  onUpdateByPath,
  currentData,
}) {
  // عرض الحقول الديناميكية حسب نوع المكون
  // دعم التحديث عبر المسارات
  // واجهة مستخدم متقدمة
}
```

**2. FieldRenderers:**

```typescript
// components/tenant/live-editor/EditorSidebar/components/FieldRenderers/
export function ArrayFieldRenderer({ field, value, onChange }) {
  // عرض الحقول من نوع Array
  // إضافة/حذف العناصر
  // ترتيب العناصر
}

export function ObjectFieldRenderer({ field, value, onChange }) {
  // عرض الحقول من نوع Object
  // تحديث الحقول الفرعية
}
```

### 5. نظام السحب والإفلات (Drag & Drop)

#### EnhancedLiveEditorDragDropContext

```typescript
// services-liveeditor/live-editor/dragDrop/EnhancedLiveEditorDragDropContext.tsx
export function EnhancedLiveEditorDragDropContext({
  onComponentAdd,
  onComponentMove,
  components,
  onPositionDebug,
  disableAutoScroll,
  iframeRef,
}) {
  // إدارة السياق المتقدم للسحب والإفلات
  // تتبع المواضع
  // التحقق من صحة العمليات
}
```

#### Position Tracker

```typescript
// services-liveeditor/live-editor/dragDrop/enhanced-position-tracker.ts
export const positionTracker = {
  recordState: (components, operation) => void,
  trackComponentMove: (components, sourceIndex, sourceZone, finalIndex, destinationZone) => {
    return {
      success: boolean,
      updatedComponents: ComponentInstance[],
      debugInfo: PositionDebugInfo
    };
  },
  validatePositions: (components) => ValidationResult
};
```

### 6. الخدمات المتخصصة

#### ComponentService

```typescript
// services-liveeditor/live-editor/componentService.ts
export const ComponentService = {
  getDisplayName: (type: string) => string,
  createInitial: (slug: string) => ComponentInstance[],
  load: (componentName: string, data: ComponentData) => React.Component,
  getDefaultTheme: (type: string) => string,

  // الخدمات المتقدمة
  cache: ComponentCacheService,
  paths: ComponentPathService,
  fallbacks: ComponentFallbackService,
  parser: ComponentParserService,
  themes: ComponentThemeService
};
```

#### DataService

```typescript
// services-liveeditor/live-editor/dataService.ts
export const DataService = {
  loadFromDatabase: (tenantData: any) => void,
  createNew: (componentData: ComponentData) => ComponentInstance,
  updateData: (componentId: string, data: ComponentData) => void,
  updateTheme: (componentId: string, theme: string) => void,
  reset: (componentId: string) => void,
  delete: (componentId: string) => void
};
```

### 7. نظام المكونات الديناميكي

#### ComponentsList

```typescript
// lib-liveeditor/ComponentsList.ts
export const COMPONENTS = {
  hero: {
    hero1: Hero1Component,
    hero2: Hero2Component,
    hero3: Hero3Component,
  },
  header: {
    header1: Header1Component,
    header2: Header2Component,
  },
  // ... المزيد من المكونات
};
```

#### Component Functions

```typescript
// context-liveeditor/editorStoreFunctions/
export const heroFunctions = {
  ensureVariant: (state, variantId, initial) => NewState,
  getData: (state, variantId) => ComponentData,
  setData: (state, variantId, data) => NewState,
  updateByPath: (state, variantId, path, value) => NewState,
};
```

### 8. نظام التخزين المؤقت (Caching)

#### CachedComponent

```typescript
// services-liveeditor/live-editor/uiService.tsx
export function CachedComponent({
  componentName, section, data
}) {
  const cacheKey = `${componentName}-${JSON.stringify(data)}`;

  return useMemo(() => {
    const Component = COMPONENTS[section]?.[componentName];
    if (!Component) return <div>Component not found</div>;

    return <Component {...data} />;
  }, [componentName, data, cacheKey]);
}
```

### 9. نظام التحقق من الصحة (Validation)

#### ValidationService

```typescript
// services-liveeditor/live-editor/validationService.ts
export const ValidationService = {
  validateComponent: (component: ComponentInstance) => ValidationResult,
  validateLayout: (layout: GridLayout) => ValidationResult,
  validateData: (data: ComponentData) => ValidationResult,
  validateWithRules: (data: any, rules: ValidationRule[]) => ValidationResult,
  isValidColor: (color: string) => boolean,
  isValidEmail: (email: string) => boolean,
};
```

### 10. نظام الأحداث (Events)

#### EventService

```typescript
// services-liveeditor/live-editor/eventService.ts
export const EventService = {
  createComponentAdded: (component: ComponentInstance) => Event,
  createComponentDeleted: (componentId: string) => Event,
  createComponentMoved: (fromIndex: number, toIndex: number) => Event,
  createThemeChanged: (componentId: string, newTheme: string) => Event,
  createError: (error: Error) => Event,
};
```

## تدفق البيانات (Data Flow)

### 1. تحميل البيانات الأولية

```
Database → EditorStore → PageComponents → UI
```

### 2. تحديث المكونات

```
User Input → TempData → EditorStore → ComponentData → UI Update
```

### 3. حفظ التغييرات

```
TempData → EditorStore → Database → Confirmation
```

## الميزات المتقدمة

### 1. Responsive Design

- معاينة الأجهزة المختلفة (Mobile, Tablet, Desktop)
- تحديث تلقائي للمكونات عند تغيير الجهاز
- دعم CSS variables الديناميكية

### 2. Real-time Preview

- تحديث فوري للـ iframe
- نسخ الـ styles تلقائياً
- مراقبة التغييرات

### 3. Advanced Drag & Drop

- تتبع المواضع المتقدم
- التحقق من صحة العمليات
- دعم المناطق المتداخلة

### 4. Component Management

- إدارة المكونات العالمية
- تتبع التغييرات
- نظام النسخ الاحتياطي

### 5. Debug & Development

- لوحة التحكم للتطوير
- تتبع العمليات
- التحقق من صحة البيانات

## الاستخدام

### 1. تهيئة المحرر

```typescript
<EditorProvider>
  <LiveEditor />
</EditorProvider>
```

### 2. إضافة مكون جديد

```typescript
const handleAddComponent = (componentData) => {
  const newComponent = {
    id: uuidv4(),
    type: componentData.type,
    componentName: getComponentNameWithOne(componentData.type),
    data: createDefaultData(componentData.type),
  };

  setPageComponents((prev) => [...prev, newComponent]);
};
```

### 3. تحديث مكون موجود

```typescript
const handleComponentUpdate = (componentId, data) => {
  store.setComponentData(componentType, componentId, data);
  store.forceUpdatePageComponents(currentPage, updatedComponents);
};
```

## تحليل عميق: ما يحدث عند تعديل مكون في Editor Sidebar

### 1. بداية العملية - تهيئة المكون

عندما ينقر المستخدم على مكون في الـ iframe، تبدأ سلسلة معقدة من العمليات:

#### أ) تحديد المكون المحدد

```typescript
// في LiveEditorUI.tsx
const handleEditClick = (componentId: string) => {
  // تحديد المكون المحدد
  state.setSelectedComponentId(componentId);

  // فتح الـ sidebar
  state.setSidebarView("edit-component");
  state.setSidebarOpen(true);
};
```

#### ب) تحميل بيانات المكون

```typescript
// في EditorSidebar/index.tsx
useEffect(() => {
  if (view === "edit-component" && selectedComponent) {
    // التحقق من نوع المكون (عالمي أم عادي)
    if (selectedComponent.id === "global-header") {
      const defaultData = getDefaultHeaderData();
      const dataToUse =
        globalComponentsData?.header || globalHeaderData || defaultData;
      setCurrentPage("global-header");
      setTempData(dataToUse);
    }

    // للمكونات العادية
    else {
      const store = useEditorStore.getState();
      const defaultData = createDefaultData(selectedComponent.type);

      // استخدام component.id كمعرف فريد
      const uniqueVariantId = selectedComponent.id;

      // تهيئة المكون في المتجر
      store.ensureComponentVariant(
        selectedComponent.type,
        uniqueVariantId,
        dataToUse,
      );

      // تحميل البيانات الحالية
      const currentComponentData = store.getComponentData(
        selectedComponent.type,
        uniqueVariantId,
      );
      setTempData(currentComponentData || {});
    }
  }
}, [selectedComponent, view]);
```

### 2. تحميل Structure المكون

#### أ) تحميل ديناميكي للـ Structure

```typescript
// في AdvancedSimpleSwitcher.tsx
const loadStructure = async (componentType: string) => {
  try {
    setLoading(true);

    // التحقق من وجود المكون في ComponentsList
    const component = COMPONENTS[componentType];
    if (!component) {
      throw new Error(`Component type "${componentType}" not found`);
    }

    // تحميل structure ديناميكياً
    const structureModule = await import(
      `@/componentsStructure/${componentType}`
    );
    const structureName = `${componentType}Structure`;
    const loadedStructure = structureModule[structureName];

    // ترجمة الـ structure
    const translatedStructure = translateComponentStructure(loadedStructure, t);

    // البحث عن الـ variant المناسب
    const targetVariant =
      translatedStructure.variants.find((v) => v.id === componentName) ||
      translatedStructure.variants[0];

    setStructure({
      ...translatedStructure,
      currentVariant: targetVariant,
    });
  } catch (err) {
    console.error(`Error loading structure:`, err);
    setError(err.message);
  }
};
```

#### ب) عرض الحقول الديناميكية

```typescript
// في DynamicFieldsRenderer.tsx
const renderField = (def: FieldDefinition, basePath?: string) => {
  const path = basePath ? `${basePath}.${def.key}` : def.key;
  const normalizedPath = normalizePath(path);
  const value = getValueByPath(normalizedPath);

  // عرض الحقل حسب نوعه
  switch (def.type) {
    case "text":
      return <TextInput value={value} onChange={...} />;
    case "color":
      return <ColorPicker value={value} onChange={...} />;
    case "array":
      return <ArrayFieldRenderer def={def} value={value} />;
    // ... المزيد من الأنواع
  }
};
```

### 3. عملية التحديث - عندما يكتب المستخدم

#### أ) استقبال التغيير

```typescript
// في DynamicFieldsRenderer.tsx
const updateValue = useCallback(
  (path: string, value: any) => {
    // معالجة خاصة لبعض الحقول
    if (
      path === "content.imagePosition" &&
      componentType === "halfTextHalfImage"
    ) {
      // تحديث كلا المسارين للاتساق
      onUpdateByPath("content.imagePosition", value);
      onUpdateByPath("imagePosition", value);
      return;
    }

    // للمكونات العادية - استخدام tempData للتحديث الفوري
    if (
      componentType &&
      variantId &&
      variantId !== "global-header" &&
      variantId !== "global-footer"
    ) {
      updateByPath(path, value); // تحديث tempData فوراً
    } else {
      onUpdateByPath(path, value); // للمكونات العالمية
    }
  },
  [onUpdateByPath, updateByPath, componentType, variantId],
);
```

#### ب) تحديث tempData في المتجر

```typescript
// في editorStore.ts
updateByPath: (path, value) =>
  set((state) => {
    const segments = path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .filter(Boolean);

    // تهيئة البيانات الجديدة
    let newData: any = { ...(state.tempData || {}) };

    // معالجة خاصة للمكونات العالمية
    if (state.currentPage === "global-header" || path.includes("menu")) {
      newData = deepMerge(state.globalHeaderData, state.tempData);
    }

    // التنقل عبر المسار وتحديث القيمة
    let cursor: any = newData;
    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));

      // إنشاء البنية المطلوبة
      if (cursor[key] == null) {
        cursor[key] = nextIsIndex ? [] : {};
      }
      cursor = cursor[key];
    }

    const lastKey = segments[segments.length - 1];
    cursor[lastKey] = value;

    return { tempData: newData };
  });
```

### 4. التحديث الفوري في الواجهة

#### أ) إعادة تصيير المكون

```typescript
// في LiveEditorUI.tsx - AutoFrame
const iframeContent = useMemo(() => (
  <div>
    {pageComponents.map((component, index) => (
      <CachedComponent
        key={`${component.id}-${component.forceUpdate || 0}-${selectedDevice}`}
        componentName={component.componentName}
        data={{
          ...component.data,
          useStore: true,
          variant: component.id,
          deviceType: selectedDevice,
          forceUpdate: component.forceUpdate,
        }}
      />
    ))}
  </div>
), [pageComponents, selectedDevice, tempData]);
```

#### ب) نسخ الـ styles إلى الـ iframe

```typescript
// في AutoFrame component
const copyStylesToIframe = useCallback((iframeDoc: Document) => {
  const styleElements = document.querySelectorAll(
    'style, link[rel="stylesheet"]',
  );
  const iframeHead = iframeDoc.head;

  // نسخ جميع الـ styles
  styleElements.forEach((styleEl) => {
    if (styleEl.tagName === "STYLE") {
      const clonedStyle = styleEl.cloneNode(true) as HTMLStyleElement;
      iframeHead.appendChild(clonedStyle);
    }
  });

  // نسخ CSS variables
  const parentComputedStyle = getComputedStyle(document.documentElement);
  for (let i = 0; i < parentComputedStyle.length; i++) {
    const property = parentComputedStyle[i];
    if (property.startsWith("--")) {
      const value = parentComputedStyle.getPropertyValue(property);
      iframeDoc.documentElement.style.setProperty(property, value);
    }
  }
}, []);
```

### 5. عملية الحفظ - عند الضغط على Save Changes

#### أ) تجميع البيانات

```typescript
// في EditorSidebar/index.tsx
const handleSave = () => {
  // تعيين علامة التغيير
  setHasChangesMade(true);

  const store = useEditorStore.getState();
  const currentPage = store.currentPage || "homepage";

  // الحصول على أحدث tempData
  const latestTempData =
    selectedComponent.id === "global-header" ||
    selectedComponent.id === "global-footer"
      ? store.tempData
      : tempData;

  // للمكونات العالمية
  if (selectedComponent.id === "global-header") {
    setGlobalHeaderData(latestTempData);
    setGlobalComponentsData({
      ...globalComponentsData,
      header: latestTempData,
    });
    onComponentUpdate(selectedComponent.id, latestTempData);
  }

  // للمكونات العادية
  else {
    const uniqueVariantId = selectedComponent.id;
    const storeData = store.getComponentData(
      selectedComponent.type,
      uniqueVariantId,
    );

    // دمج البيانات
    const mergedData = existingComponent?.data
      ? deepMerge(deepMerge(existingComponent.data, storeData), latestTempData)
      : deepMerge(storeData, latestTempData);

    // تحديث المتجر
    store.setComponentData(selectedComponent.type, uniqueVariantId, mergedData);

    // تحديث pageComponentsByPage
    const updatedPageComponents = currentPageComponents.map((comp) => {
      if (comp.id === selectedComponent.id) {
        return { ...comp, data: mergedData };
      }
      return comp;
    });

    store.forceUpdatePageComponents(currentPage, updatedPageComponents);
    onComponentUpdate(selectedComponent.id, mergedData);
  }
};
```

#### ب) تحديث قاعدة البيانات

```typescript
// في EditorProvider.tsx
const confirmSave = async () => {
  const state = useEditorStore.getState();

  const payload = {
    tenantId: tenantId || "",
    pages: state.pageComponentsByPage,
    globalComponentsData: state.globalComponentsData,
  };

  // إرسال إلى الخادم
  await axiosInstance
    .post("/v1/tenant-website/save-pages", payload)
    .then(() => {
      closeDialog();
      toast.success("Changes saved successfully!");
    })
    .catch((e) => {
      console.error("Error saving pages:", e);
      toast.error("Failed to save changes");
    });
};
```

### 6. نظام التخزين المؤقت المتقدم

#### أ) CachedComponent

```typescript
// في uiService.tsx
export function CachedComponent({ componentName, section, data }) {
  const cacheKey = `${componentName}-${JSON.stringify(data)}`;

  return useMemo(() => {
    const Component = COMPONENTS[section]?.[componentName];
    if (!Component) return <div>Component not found</div>;

    return <Component {...data} />;
  }, [componentName, data, cacheKey]);
}
```

#### ب) إدارة الذاكرة

```typescript
// في componentCacheService.ts
class ComponentCache {
  private cache = new Map<string, any>();
  private maxSize = 100;

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### 7. نظام التصحيح والتتبع

#### أ) Debug Logger

```typescript
// في debugLogger.ts
export const logChange = (
  componentId: string,
  componentName: string,
  componentType: string,
  data: any,
  changeType: string,
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `🔄 [${changeType}] Component: ${componentName} (${componentType})`,
      {
        componentId,
        data,
        timestamp: new Date().toISOString(),
      },
    );
  }
};
```

#### ب) تتبع التغييرات

```typescript
// في EditorSidebar
const handleSave = () => {
  // تسجيل التغيير
  logChange(
    selectedComponent.id,
    selectedComponent.componentName,
    selectedComponent.type,
    mergedData,
    "COMPONENT_UPDATE",
  );

  // تحديث المتجر
  store.setComponentData(
    selectedComponent.type,
    selectedComponent.id,
    mergedData,
  );
};
```

### 8. معالجة الأخطاء والاستثناءات

#### أ) معالجة أخطاء تحميل Structure

```typescript
// في AdvancedSimpleSwitcher.tsx
if (error || !structure) {
  return (
    <div className="error-state">
      <h4>Structure Loading Error</h4>
      <p>{error || "Failed to load structure"}</p>
      <button onClick={() => loadStructure(type)}>
        Retry Loading Structure
      </button>
    </div>
  );
}
```

#### ب) معالجة أخطاء التحديث

```typescript
// في DynamicFieldsRenderer.tsx
const updateValue = useCallback(
  (path: string, value: any) => {
    try {
      if (onUpdateByPath) {
        onUpdateByPath(path, value);
      } else {
        updateByPath(path, value);
      }
    } catch (error) {
      console.error("Error updating value:", error);
      // إظهار رسالة خطأ للمستخدم
    }
  },
  [onUpdateByPath, updateByPath],
);
```

### 9. تحسينات الأداء

#### أ) Debouncing للتحديثات

```typescript
// في DynamicFieldsRenderer.tsx
const debouncedUpdate = useMemo(
  () =>
    debounce((path: string, value: any) => {
      updateValue(path, value);
    }, 300),
  [updateValue],
);
```

#### ب) Memoization للمكونات

```typescript
// في CachedComponent
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
```

### 10. تدفق البيانات الكامل

```
User Input → Field Renderer → updateValue → updateByPath → tempData →
Component Re-render → iframe Update → Style Copy → Visual Feedback →
Save Button → handleSave → Store Update → Database → Confirmation
```

## الخلاصة

محرر الموقع المباشر هو نظام معقد ومتطور يجمع بين:

- **إدارة الحالة المتقدمة** مع Zustand
- **نظام iframe متطور** مع نسخ الـ styles
- **نظام السحب والإفلات المتقدم** مع تتبع المواضع
- **إدارة المكونات الديناميكية** مع التخزين المؤقت
- **نظام التحقق من الصحة** الشامل
- **واجهة مستخدم متطورة** مع دعم الـ responsive design

هذا النظام يوفر تجربة تحرير سلسة ومتطورة للمطورين والمستخدمين النهائيين على حد سواء.
