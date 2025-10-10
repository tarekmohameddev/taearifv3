# نظام الـ Caching الخاص بالمكونات - شرح مفصل ومبالغ فيه

## نظرة عامة على البنية المعمارية

نظام الـ caching في هذا المشروع هو نظام معقد ومتعدد الطبقات يربط بين المكونات (Components) والـ stores والـ default data بطريقة ذكية وفعالة. هذا النظام يضمن أن البيانات تتدفق بسلاسة من المصادر المختلفة إلى المكونات النهائية.

## المكونات المستهدفة في هذا الشرح

1. **`components/tenant/whyChooseUs/whyChooseUs1.tsx`** - مكون "لماذا تختارنا"
2. **`components/tenant/testimonials/testimonials1.tsx`** - مكون الشهادات

## العناصر الأساسية في النظام

### 1. Default Data Functions

**الموقع:** `context-liveeditor/editorStoreFunctions/`

هذه الدوال تحتوي على البيانات الافتراضية لكل مكون:

```typescript
// في whyChooseUsFunctions.ts
export const getDefaultWhyChooseUsData = (): any => ({
  visible: true,
  layout: {
    direction: "rtl",
    maxWidth: "1600px",
    padding: {
      y: "py-14",
      smY: "sm:py-16",
    },
  },
  header: {
    title: "لماذا تختارنا؟",
    description:
      "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
    // ... المزيد من البيانات الافتراضية
  },
  // ... باقي البيانات
});
```

### 2. Component Structures

**الموقع:** `componentsStructure/`

هذه الملفات تحدد هيكل البيانات لكل مكون:

```typescript
// في whyChooseUs.ts
export const whyChooseUsStructure: ComponentStructure = {
  componentType: "whyChooseUs",
  variants: [
    {
      id: "whyChooseUs1",
      name: "Why Choose Us 1 - Features Grid",
      fields: [
        { key: "visible", label: "Visible", type: "boolean" },
        {
          key: "layout",
          label: "Layout Settings",
          type: "object",
          fields: [
            {
              key: "direction",
              label: "Direction",
              type: "select",
              options: [
                { value: "rtl", label: "Right to Left" },
                { value: "ltr", label: "Left to Right" },
              ],
            },
            // ... المزيد من الحقول
          ],
        },
        // ... باقي الحقول
      ],
    },
  ],
};
```

### 3. Editor Store

**الموقع:** `context-liveeditor/editorStore.ts`

هذا هو الـ store الرئيسي الذي يدير جميع المكونات:

```typescript
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Dynamic component states - يتم إنشاؤها تلقائياً من ComponentsList
  componentStates: Record<string, Record<string, ComponentData>>,

  // Generic functions for all components
  ensureComponentVariant: (
    componentType: string,
    variantId: string,
    initial?: ComponentData,
  ) => void,
  getComponentData: (componentType: string, variantId: string) => ComponentData,
  setComponentData: (
    componentType: string,
    variantId: string,
    data: ComponentData,
  ) => void,
  updateComponentByPath: (
    componentType: string,
    variantId: string,
    path: string,
    value: any,
  ) => void,

  // Specific component states
  whyChooseUsStates: Record<string, ComponentData>,
  testimonialsStates: Record<string, ComponentData>,
  // ... باقي المكونات
}));
```

### 4. Tenant Store

**الموقع:** `context-liveeditor/tenantStore.jsx`

هذا الـ store يدير بيانات المستأجر (Tenant):

```javascript
const useTenantStore = create((set) => ({
  tenantData: null,
  loadingTenantData: false,
  error: null,
  tenant: null,
  tenantId: null,
  lastFetchedWebsite: null,

  fetchTenantData: async (websiteName) => {
    // منطق جلب بيانات المستأجر من API
  },

  // دوال حفظ التغييرات
  saveHeaderChanges: async (tenantId, headerData, variant) => {
    // منطق حفظ تغييرات الهيدر
  },
  // ... باقي دوال الحفظ
}));
```

## تدفق البيانات المفصل - من البداية للنهاية

### المرحلة الأولى: تهيئة المكون

عندما يتم تحميل مكون `whyChooseUs1.tsx`، يحدث التالي:

```typescript
export default function WhyChooseUsSection(props: WhyChooseUsProps = {}) {
  // 1. تحديد معرف المكون
  const variantId = props.variant || "whyChooseUs1";
  const uniqueId = props.id || variantId;

  // 2. الاشتراك في editor store
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const whyChooseUsStates = useEditorStore((s) => s.whyChooseUsStates);
```

### المرحلة الثانية: تهيئة البيانات في الـ Store

```typescript
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultWhyChooseUsData(), // البيانات الافتراضية
      ...props, // البيانات المرسلة كـ props
    };
    ensureComponentVariant("whyChooseUs", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant]);
```

**شرح مفصل لما يحدث هنا:**

1. **`getDefaultWhyChooseUsData()`** - يتم استدعاء هذه الدالة من `whyChooseUsFunctions.ts` للحصول على البيانات الافتراضية
2. **`...props`** - يتم دمج البيانات المرسلة كـ props مع البيانات الافتراضية
3. **`ensureComponentVariant()`** - يتم استدعاء هذه الدالة من الـ editor store لضمان وجود المكون في الـ store

### المرحلة الثالثة: منطق `ensureComponentVariant`

```typescript
// في editorStore.ts
ensureComponentVariant: (componentType, variantId, initial) =>
  set((state) => {
    switch (componentType) {
      case "whyChooseUs":
        return whyChooseUsFunctions.ensureVariant(state, variantId, initial);
      // ... باقي المكونات
    }
  }),
```

**شرح مفصل:**

1. يتم التحقق من نوع المكون (`whyChooseUs`)
2. يتم استدعاء `whyChooseUsFunctions.ensureVariant()` من `whyChooseUsFunctions.ts`
3. هذه الدالة تتحقق من وجود المكون في الـ store، وإذا لم يكن موجوداً، تضيفه

### المرحلة الرابعة: منطق `ensureVariant` في whyChooseUsFunctions

```typescript
// في whyChooseUsFunctions.ts
export const whyChooseUsFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: any) => {
    if (state.whyChooseUsStates[variantId]) {
      return state; // المكون موجود بالفعل
    }

    const defaultData = getDefaultWhyChooseUsData();
    const data: any = initial || state.tempData || defaultData;

    return {
      ...state,
      whyChooseUsStates: {
        ...state.whyChooseUsStates,
        [variantId]: data
      },
    };
  },
```

**شرح مفصل:**

1. **التحقق من الوجود:** يتم التحقق من وجود المكون في `state.whyChooseUsStates[variantId]`
2. **البيانات الافتراضية:** إذا لم يكن موجوداً، يتم استدعاء `getDefaultWhyChooseUsData()`
3. **أولوية البيانات:** `initial` (البيانات المرسلة) > `state.tempData` (البيانات المؤقتة) > `defaultData` (البيانات الافتراضية)
4. **إضافة المكون:** يتم إضافة المكون إلى `whyChooseUsStates` في الـ store

### المرحلة الخامسة: جلب بيانات المستأجر

```typescript
// في whyChooseUs1.tsx
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);

useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

**شرح مفصل:**

1. **جلب بيانات المستأجر:** يتم جلب `tenantData` من الـ tenant store
2. **دالة الجلب:** `fetchTenantData` تقوم بجلب البيانات من API
3. **التحقق من المعرف:** يتم التحقق من وجود `tenantId` قبل جلب البيانات

### المرحلة السادسة: منطق `fetchTenantData`

```javascript
// في tenantStore.jsx
fetchTenantData: async (websiteName) => {
  const state = useTenantStore.getState();

  // منع الطلبات المكررة
  if (
    state.loadingTenantData ||
    (state.tenantData && state.tenantData.username === websiteName)
  ) {
    return;
  }

  set({ loadingTenantData: true, error: null });

  try {
    const response = await axiosInstance.post(
      "/v1/tenant-website/getTenant",
      { websiteName },
    );

    const data = response.data || {};

    // تحميل البيانات في editor store
    const { useEditorStore } = await import("./editorStore");
    const editorStore = useEditorStore.getState();

    if (data.globalComponentsData) {
      editorStore.setGlobalComponentsData(data.globalComponentsData);
    }

    set({
      tenantData: data,
      loadingTenantData: false,
      lastFetchedWebsite: websiteName,
    });
  } catch (error) {
    console.error("[tenantStore] Error fetching tenant data:", error);
    set({ error: error.message, loadingTenantData: false });
  }
},
```

**شرح مفصل:**

1. **منع التكرار:** يتم التحقق من عدم وجود طلب جاري أو بيانات موجودة لنفس الموقع
2. **إرسال الطلب:** يتم إرسال طلب POST إلى `/v1/tenant-website/getTenant`
3. **تحميل البيانات:** يتم تحميل البيانات في الـ editor store
4. **تحديث الحالة:** يتم تحديث حالة الـ loading والـ error

### المرحلة السابعة: دمج البيانات في المكون

```typescript
// في whyChooseUs1.tsx
const getTenantComponentData = () => {
  if (!tenantData) {
    return {};
  }

  // البحث في البيانات الجديدة (components array)
  if (tenantData.components && Array.isArray(tenantData.components)) {
    for (const component of tenantData.components) {
      if (
        component.type === "whyChooseUs" &&
        component.componentName === variantId
      ) {
        const componentData = component.data;
        return {
          visible: componentData.visible,
          header: {
            title: componentData.texts?.title || componentData.header?.title,
            description:
              componentData.texts?.subtitle ||
              componentData.header?.description,
            // ... باقي البيانات
          },
          // ... باقي البيانات
        };
      }
    }
  }

  // البحث في البيانات القديمة (componentSettings)
  if (tenantData?.componentSettings) {
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          if (
            (component as any).type === "whyChooseUs" &&
            (component as any).componentName === variantId
          ) {
            return (component as any).data;
          }
        }
      }
    }
  }

  return {};
};

const tenantComponentData = getTenantComponentData();
```

**شرح مفصل:**

1. **التحقق من وجود البيانات:** يتم التحقق من وجود `tenantData`
2. **البحث في البيانات الجديدة:** يتم البحث في `tenantData.components` (هيكل جديد)
3. **البحث في البيانات القديمة:** يتم البحث في `tenantData.componentSettings` (هيكل قديم)
4. **تحويل البيانات:** يتم تحويل البيانات من هيكل API إلى هيكل المكون

### المرحلة الثامنة: دمج البيانات النهائي

```typescript
// في whyChooseUs1.tsx
const storeData = props.useStore
  ? getComponentData("whyChooseUs", uniqueId) || {}
  : {};
const currentStoreData = props.useStore
  ? whyChooseUsStates[uniqueId] || {}
  : {};

// دمج البيانات مع الأولوية: currentStoreData > storeData > tenantComponentData > props > default
const defaultData = getDefaultWhyChooseUsData();
const mergedData = {
  ...defaultData,
  ...props,
  ...tenantComponentData,
  ...storeData,
  ...currentStoreData,
  // دمج الكائنات المتداخلة
  header: {
    ...defaultData.header,
    ...(props.header || {}),
    ...(tenantComponentData.header || {}),
    ...(storeData.header || {}),
    ...(currentStoreData.header || {}),
    typography: {
      ...defaultData.header?.typography,
      ...(props.header?.typography || {}),
      ...(tenantComponentData.header?.typography || {}),
      ...(storeData.header?.typography || {}),
      ...(currentStoreData.header?.typography || {}),
    },
  },
  features: {
    ...defaultData.features,
    ...(props.features || {}),
    ...(tenantComponentData.features || {}),
    ...(storeData.features || {}),
    ...(currentStoreData.features || {}),
    // ... باقي الكائنات المتداخلة
  },
  // ... باقي البيانات
};
```

**شرح مفصل لأولوية البيانات:**

1. **`defaultData`** - البيانات الافتراضية (الأولوية الأقل)
2. **`props`** - البيانات المرسلة كـ props
3. **`tenantComponentData`** - البيانات من قاعدة البيانات
4. **`storeData`** - البيانات المحفوظة في الـ store
5. **`currentStoreData`** - البيانات الحالية في الـ store (الأولوية الأعلى)

### المرحلة التاسعة: تطبيق البيانات في الـ JSX

```typescript
// في whyChooseUs1.tsx
return (
  <section
    className="w-full bg-background"
    style={{
      backgroundColor:
        mergedData.background?.color ||
        mergedData.styling?.bgColor ||
        mergedData.colors?.background ||
        "#ffffff",
      paddingTop: mergedData.layout?.padding?.y || "py-14",
      paddingBottom: mergedData.layout?.padding?.smY || "sm:py-16",
    }}
  >
    <div
      className="mx-auto"
      style={{ maxWidth: mergedData.layout?.maxWidth || "1600px" }}
      dir={mergedData.layout?.direction || "rtl"}
    >
      <header
        className={`${mergedData.header?.marginBottom || "mb-10"} ${mergedData.header?.textAlign || "text-right"} ${mergedData.header?.paddingX || "px-5"}`}
      >
        <h2
          className={
            mergedData.header?.typography?.title?.className ||
            "section-title text-right"
          }
          style={{
            color:
              mergedData.styling?.textColor ||
              mergedData.colors?.textColor ||
              undefined,
          }}
        >
          {mergedData.header?.title || "لماذا تختارنا؟"}
        </h2>
        {/* ... باقي المحتوى */}
      </header>
      {/* ... باقي المكون */}
    </div>
  </section>
);
```

## مثال مفصل: مكون Testimonials

### تهيئة المكون

```typescript
// في testimonials1.tsx
export default function TestimonialsSection(props: TestimonialsProps = {}) {
  const variantId = props.variant || "testimonials1";

  // الاشتراك في editor store
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
```

### منطق دمج البيانات

```typescript
// في testimonials1.tsx
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) return {};

  // البحث في جميع الصفحات
  for (const [pageSlug, pageComponents] of Object.entries(
    tenantData.componentSettings,
  )) {
    if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
      for (const [componentId, component] of Object.entries(
        pageComponents as any,
      )) {
        if (
          (component as any).type === "testimonials" &&
          (component as any).componentName === variantId &&
          componentId === props.id
        ) {
          return (component as any).data;
        }
      }
    }
  }
  return {};
};

const tenantComponentData = getTenantComponentData();

// دمج البيانات مع الأولوية: storeData > tenantComponentData > props > default
const mergedData = {
  ...getDefaultTestimonialsData(),
  ...props,
  ...tenantComponentData,
  ...storeData,
};
```

## آلية الـ Caching المتقدمة

### 1. Cache Invalidation

```typescript
// في editorStore.ts
updateComponentByPath: (componentType, variantId, path, value) =>
  set((state) => {
    // استخدام دوال المكونات المحددة
    let newState: any = {};

    switch (componentType) {
      case "whyChooseUs":
        newState = whyChooseUsFunctions.updateByPath(state, variantId, path, value);
        break;
      case "testimonials":
        newState = testimonialsFunctions.updateByPath(state, variantId, path, value);
        break;
      // ... باقي المكونات
    }

    // تحديث pageComponents
    const updatedState = { ...state, ...newState };
    const updatedPageComponents = updatedState.pageComponentsByPage[updatedState.currentPage] || [];

    const updatedComponents = updatedPageComponents.map((comp: any) => {
      if (comp.type === componentType && comp.id === variantId) {
        const updatedData = updatedState[`${componentType}States`]?.[variantId] || comp.data;
        return {
          ...comp,
          data: updatedData,
        };
      }
      return comp;
    });

    return {
      ...newState,
      pageComponentsByPage: {
        ...updatedState.pageComponentsByPage,
        [updatedState.currentPage]: updatedComponents,
      },
    };
  }),
```

### 2. Deep Merge Algorithm

```typescript
// في editorStore.ts
const deepMerge = (target: any, source: any): any => {
  if (!source || typeof source !== "object") return target || source;
  if (!target || typeof target !== "object") return source;

  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};
```

### 3. Path-based Updates

```typescript
// في editorStoreFunctions/types.ts
export const updateDataByPath = (data: any, path: string, value: any): any => {
  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);
  const newData = { ...data };
  let cursor: any = newData;

  for (let i = 0; i < segments.length - 1; i++) {
    const key = segments[i]!;
    const nextIsIndex = !Number.isNaN(Number(segments[i + 1]));
    const existing = cursor[key];

    if (
      existing == null ||
      typeof existing === "string" ||
      typeof existing === "number" ||
      typeof existing === "boolean"
    ) {
      cursor[key] = nextIsIndex ? [] : {};
    } else if (Array.isArray(existing) && !nextIsIndex) {
      cursor[key] = {};
    } else if (
      typeof existing === "object" &&
      !Array.isArray(existing) &&
      nextIsIndex
    ) {
      cursor[key] = [];
    }
    cursor = cursor[key];
  }

  const lastKey = segments[segments.length - 1]!;
  cursor[lastKey] = value;

  return newData;
};
```

## استدعاءات الكود المفصلة

### 1. استدعاء `useEditorStore`

```typescript
// في whyChooseUs1.tsx
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
```

**ما يحدث هنا:**

1. يتم استدعاء `useEditorStore` من Zustand
2. يتم استخراج `ensureComponentVariant` من الـ store
3. هذه الدالة مسؤولة عن ضمان وجود المكون في الـ store

### 2. استدعاء `useTenantStore`

```typescript
// في whyChooseUs1.tsx
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);
```

**ما يحدث هنا:**

1. يتم استخراج `tenantData` من الـ tenant store
2. يتم استخراج `fetchTenantData` للجلب من API
3. يتم استخراج `tenantId` للتحقق من وجود المستأجر

### 3. استدعاء `getDefaultWhyChooseUsData`

```typescript
// في whyChooseUs1.tsx
const defaultData = getDefaultWhyChooseUsData();
```

**ما يحدث هنا:**

1. يتم استدعاء الدالة من `whyChooseUsFunctions.ts`
2. يتم إرجاع البيانات الافتراضية للمكون
3. هذه البيانات تستخدم كـ fallback عند عدم وجود بيانات أخرى

### 4. استدعاء `getComponentData`

```typescript
// في whyChooseUs1.tsx
const storeData = props.useStore
  ? getComponentData("whyChooseUs", uniqueId) || {}
  : {};
```

**ما يحدث هنا:**

1. يتم التحقق من `props.useStore` لمعرفة إذا كان المكون يستخدم الـ store
2. إذا كان يستخدم، يتم استدعاء `getComponentData` من الـ editor store
3. يتم البحث عن البيانات باستخدام `componentType` و `variantId`

### 5. استدعاء `getTenantComponentData`

```typescript
// في whyChooseUs1.tsx
const tenantComponentData = getTenantComponentData();
```

**ما يحدث هنا:**

1. يتم البحث في `tenantData.components` (الهيكل الجديد)
2. يتم البحث في `tenantData.componentSettings` (الهيكل القديم)
3. يتم إرجاع البيانات المطابقة للمكون المطلوب

## مثال عملي: تدفق البيانات الكامل

### السيناريو: تحميل مكون WhyChooseUs1

1. **البداية:** المستخدم يفتح الصفحة
2. **تحميل المكون:** يتم تحميل `WhyChooseUsSection` مع `props.useStore = true`
3. **تهيئة الـ Store:** يتم استدعاء `ensureComponentVariant("whyChooseUs", "whyChooseUs1", initialData)`
4. **البيانات الافتراضية:** يتم استدعاء `getDefaultWhyChooseUsData()` للحصول على البيانات الافتراضية
5. **جلب بيانات المستأجر:** يتم استدعاء `fetchTenantData(tenantId)` لجلب البيانات من API
6. **دمج البيانات:** يتم دمج البيانات من جميع المصادر مع الأولوية المحددة
7. **عرض المكون:** يتم عرض المكون بالبيانات المدمجة

### السيناريو: تحديث مكون Testimonials

1. **التحديث:** المستخدم يغير عنوان الشهادات
2. **استدعاء التحديث:** يتم استدعاء `updateComponentByPath("testimonials", "testimonials1", "title", "عنوان جديد")`
3. **تحديث الـ Store:** يتم تحديث `testimonialsStates["testimonials1"]` في الـ editor store
4. **تحديث الصفحة:** يتم تحديث `pageComponentsByPage` للصفحة الحالية
5. **إعادة العرض:** يتم إعادة عرض المكون بالبيانات الجديدة

## الخلاصة

نظام الـ caching في هذا المشروع هو نظام معقد ومتطور يتضمن:

1. **طبقات متعددة:** Default Data → Store → Component
2. **دمج ذكي:** دمج البيانات من مصادر متعددة مع الأولوية
3. **تحديث فوري:** تحديث فوري للواجهة عند تغيير البيانات
4. **إدارة الحالة:** إدارة شاملة لحالة المكونات والبيانات
5. **تحسين الأداء:** تجنب الطلبات المكررة والتحميل غير الضروري

هذا النظام يضمن أن المكونات تعمل بكفاءة عالية مع إمكانية التخصيص الكامل للبيانات والعرض.
