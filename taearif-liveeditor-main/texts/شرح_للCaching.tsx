# نظام الـ Caching الموحد للمكونات في Live Editor

## 🎯 النظام الموحد (Unified Caching System)

هذا النظام الموحد يجب تطبيقه على جميع المكونات في المشروع لضمان:
- ✅ **استقلالية المكونات**: كل مكون له state منفصل
- ✅ **تكامل مثالي**: مع Editor Store و Tenant Store
- ✅ **أداء عالي**: دمج البيانات بكفاءة
- ✅ **سهولة الصيانة**: كود موحد ومتسق

---

## 📋 قائمة المكونات المطبقة عليها النظام:

### ✅ **مطبقة بالكامل:**
- `components/tenant/halfTextHalfImage/halfTextHalfImage1.tsx` ✅
- `components/tenant/header/header1.tsx` ✅
- `components/tenant/ctaValuation/ctaValuation1.tsx` ✅
- `components/tenant/propertySlider/propertySlider1.tsx` ✅
- `components/tenant/stepsSection/stepsSection1.tsx` ✅
- `components/tenant/testimonials/testimonials1.tsx` ✅
- `components/tenant/whyChooseUs/whyChooseUs1.tsx` ✅
- `components/tenant/hero/hero1.tsx` ✅
- `components/tenant/footer/footer1.tsx` ✅
- `components/tenant/contactMapSection/contactMapSection1.tsx` ✅

### 🔄 **تحتاج تطبيق:**
- لا توجد مكونات متبقية! 🎉

---

## 🔍 تحليل المشكلة الأساسية

### المشكلة التي كانت موجودة:
عندما كان هناك مكونان من نفس النوع (مثل `halfTextHalfImage1`) في الصفحة، كان التعديل على أحدهما يؤثر على الآخر. هذا يحدث لأن المكونات كانت تشارك نفس الـ **variant ID** في الـ **Editor Store**.

### مثال على المشكلة:
```tsx
// في الصفحة يوجد مكونان:
// المكون الأول: halfTextHalfImage1 (ID: abc-123)
// المكون الثاني: halfTextHalfImage1 (ID: def-456)

// عند التعديل على المكون الأول، كان المكون الثاني يتغير أيضاً!
```

---

## 🏗️ فهم بنية الـ Stores

### 1. **Tenant Store** (`context/tenantStore.jsx`)
```tsx
// الـ Tenant Store يحتوي على:
{
  tenantData: {
    componentSettings: {
      "homepage": {
        "abc-123": {
          type: "halfTextHalfImage",
          componentName: "halfTextHalfImage1",
          data: { /* بيانات المكون */ },
          position: 0
        },
        "def-456": {
          type: "halfTextHalfImage", 
          componentName: "halfTextHalfImage1",
          data: { /* بيانات المكون */ },
          position: 1
        }
      }
    }
  }
}
```

**الخصائص:**
- ✅ **بيانات دائمة**: محفوظة في قاعدة البيانات
- ✅ **معرفات فريدة**: كل مكون له `id` فريد
- ✅ **بيانات متعددة الصفحات**: يدعم صفحات مختلفة
- ❌ **لا يدعم التعديل المباشر**: يحتاج حفظ في قاعدة البيانات

### 2. **Editor Store** (`context/editorStore.ts`)
```tsx
// الـ Editor Store يحتوي على:
{
  halfTextHalfImageStates: {
    "halfTextHalfImage1": { /* بيانات مشتركة */ },  // ❌ مشكلة!
    "abc-123": { /* بيانات المكون الأول */ },        // ✅ صحيح
    "def-456": { /* بيانات المكون الثاني */ }        // ✅ صحيح
  }
}
```

**الخصائص:**
- ✅ **تعديل مباشر**: التغييرات تظهر فوراً
- ✅ **بيانات مؤقتة**: تختفي عند إعادة تحميل الصفحة
- ✅ **أداء عالي**: لا يحتاج طلبات قاعدة بيانات
- ❌ **مشكلة المكونات المكررة**: كانت تشارك نفس الـ variant ID

---

## 🔧 الإصلاحات المطبقة

### الإصلاح الأول: إصلاح صفحة [slug]

**الملف:** `app/tenant/[tenantId]/[slug]/page.tsx`

```tsx
// قبل الإصلاح ❌
<Cmp
  {...(comp.data as any)}
  useStore
  variant={comp.componentName}  // "halfTextHalfImage1" - مشترك!
/>

// بعد الإصلاح ✅
<Cmp
  {...(comp.data as any)}
  useStore
  variant={comp.id}  // "abc-123" - فريد لكل مكون!
/>
```

**السبب:** كان يتم تمرير `componentName` بدلاً من `id`، مما يجعل المكونات المتشابهة تشارك نفس الـ variant.

### الإصلاح الثاني: إصلاح CachedComponent

**الملف:** `services/live-editor/uiService.tsx`

```tsx
// قبل الإصلاح ❌
<LoadedComponent 
  {...(data as any)} 
  useStore 
  variant={componentName}  // "halfTextHalfImage1" - مشترك!
/>

// بعد الإصلاح ✅
<LoadedComponent 
  {...(data as any)} 
  useStore 
  variant={data.variant}  // component.id - فريد!
/>
```

**السبب:** كان `CachedComponent` يتجاهل الـ `variant` الممرر في `data` ويستخدم `componentName` بدلاً منه.

---

## 📊 تدفق البيانات قبل وبعد الإصلاح

### قبل الإصلاح ❌:

```mermaid
graph TD
    A[LiveEditorUI.tsx] -->|variant: component.id| B[CachedComponent]
    B -->|variant: componentName| C[Component]
    C -->|variantId: halfTextHalfImage1| D[Editor Store]
    D -->|مشترك| E[المكونات المتكررة]
    
    F[slug/page.tsx] -->|variant: componentName| G[Component]
    G -->|variantId: halfTextHalfImage1| H[Editor Store]
    H -->|مشترك| I[المكونات المتكررة]
```

**النتيجة:** جميع المكونات من نفس النوع تشارك نفس الـ store state.

### بعد الإصلاح ✅:

```mermaid
graph TD
    A[LiveEditorUI.tsx] -->|variant: component.id| B[CachedComponent]
    B -->|variant: data.variant| C[Component]
    C -->|variantId: abc-123| D[Editor Store]
    D -->|فريد| E[المكون الأول]
    
    F[LiveEditorUI.tsx] -->|variant: component.id| G[CachedComponent]
    G -->|variant: data.variant| H[Component]
    H -->|variantId: def-456| I[Editor Store]
    I -->|فريد| J[المكون الثاني]
    
    K[slug/page.tsx] -->|variant: comp.id| L[Component]
    L -->|variantId: abc-123| M[Editor Store]
    M -->|فريد| N[المكون الأول]
```

**النتيجة:** كل مكون له store state منفصل ومستقل.

---

## 🎯 كيف يعمل النظام الآن

### 1. **في Live Editor:**
```tsx
// LiveEditorUI.tsx
<CachedComponent
  componentName="halfTextHalfImage1"
  data={{
    ...component.data,
    useStore: true,
    variant: component.id,  // "abc-123" - فريد!
    deviceType: selectedDevice,
  }}
/>

// CachedComponent
<LoadedComponent 
  {...data} 
  useStore 
  variant={data.variant}  // "abc-123" - فريد!
/>

// Component
const variantId = props.variant || "halfTextHalfImage1"  // "abc-123"
const storeData = getComponentData('halfTextHalfImage', variantId)  // بيانات فريدة
```

### 2. **في الصفحة العادية:**
```tsx
// [slug]/page.tsx
<Cmp
  {...comp.data}
  useStore
  variant={comp.id}  // "abc-123" - فريد!
/>

// Component
const variantId = props.variant || "halfTextHalfImage1"  // "abc-123"
const storeData = getComponentData('halfTextHalfImage', variantId)  // بيانات فريدة
```

### 3. **في الصفحة الرئيسية:**
```tsx
// [tenantId]/page.tsx
<Component 
  id={component.id} 
  useStore={false}  // لا يستخدم Editor Store
/>
```

---

## 🔄 دمج البيانات (Data Merging)

### ترتيب الأولوية:
```tsx
const mergedData = { 
  ...getDefaultData(),           // 4. البيانات الافتراضية
  ...props,                      // 3. البيانات الممررة كـ props
  ...tenantComponentData,        // 2. البيانات من Tenant Store
  ...storeData                   // 1. البيانات من Editor Store (الأولوية الأعلى)
}
```

### مثال عملي:
```tsx
// البيانات الافتراضية
const defaultData = {
  content: { title: "عنوان افتراضي" },
  colors: { background: "#ffffff" }
}

// بيانات Tenant Store
const tenantData = {
  content: { title: "عنوان من قاعدة البيانات" },
  colors: { background: "#f0f0f0" }
}

// بيانات Editor Store (تعديلات المستخدم)
const storeData = {
  content: { title: "عنوان معدل من المحرر" }
}

// النتيجة النهائية
const mergedData = {
  content: { title: "عنوان معدل من المحرر" },  // من Editor Store
  colors: { background: "#f0f0f0" }            // من Tenant Store
}
```

---

## 🛠️ دليل التطبيق (Implementation Guide)

### 📝 **خطوات تطبيق النظام على أي مكون:**

#### **الخطوة 1: إضافة الـ Props Interface**
```tsx
interface ComponentNameProps {
  // ... باقي الخصائص الموجودة
  
  // Editor props - إضافة هذه الخصائص
  variant?: string;
  useStore?: boolean;
  id?: string;
}
```

#### **الخطوة 2: إضافة الـ Hooks الأساسية**
```tsx
const ComponentName = (props: ComponentNameProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "componentName1"
  
  // Subscribe to editor store updates for this component variant
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant)
  const getComponentData = useEditorStore((s) => s.getComponentData)

  useEffect(() => {
    if (props.useStore) {
      ensureComponentVariant('componentType', variantId, props)
    }
  }, [variantId, props.useStore, ensureComponentVariant])

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData)
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData)
  const params = useParams<{ tenantId: string }>()
  const tenantId = params?.tenantId
  const router = useRouter()

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId)
    }
  }, [tenantId, fetchTenantData])
```

#### **الخطوة 3: إضافة Store Data Logic**
```tsx
  // Get data from store or tenantData with fallback logic
  const storeData = props.useStore ? (getComponentData('componentType', variantId) || {}) : {}
```

#### **الخطوة 4: إضافة Tenant Data Logic**
```tsx
  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {}
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(tenantData.componentSettings)) {
      
      // Check if pageComponents is an object (not array)
      if (typeof pageComponents === 'object' && !Array.isArray(pageComponents)) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(pageComponents as any)) {
          
          // Check if this is the exact component we're looking for by ID
          if ((component as any).type === 'componentType' && 
              (component as any).componentName === variantId &&
              componentId === props.id) {
            return (component as any).data
          }
        }
      }
    }
    return {}
  }
  
  const tenantComponentData = getTenantComponentData()
```

#### **الخطوة 5: إضافة Data Merging**
```tsx
  // Merge data with priority: storeData > tenantComponentData > props > default
  const mergedData = { 
    ...getDefaultComponentData(), 
    ...props, 
    ...tenantComponentData,
    ...storeData 
  }
```

#### **الخطوة 6: استخدام mergedData في الـ Render**
```tsx
  // استخدام mergedData بدلاً من props مباشرة
  return (
    <div>
      <h1>{mergedData.title || "Default Title"}</h1>
      <p>{mergedData.description || "Default Description"}</p>
    </div>
  )
```

---

## 🔧 **متطلبات الـ Editor Store Functions**

### **تأكد من وجود Functions في `context/editorStoreFunctions/`:**

#### **1. إنشاء componentFunctions.ts:**
```tsx
// context/editorStoreFunctions/componentNameFunctions.ts
import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// Default component data structure
export const getDefaultComponentNameData = (): ComponentData => ({
  visible: true,
  // ... باقي البيانات الافتراضية
});

export const componentNameFunctions = {
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    if (state.componentNameStates[variantId]) {
      return state;
    }
    
    const defaultData = getDefaultComponentNameData();
    const data: ComponentData = initial || state.tempData || defaultData;
    
    return {
      ...state,
      componentNameStates: { ...state.componentNameStates, [variantId]: data },
    };
  },

  getData: (state: any, variantId: string) => {
    return state.componentNameStates[variantId] || getDefaultComponentNameData();
  },

  setData: (state: any, variantId: string, data: ComponentData) => ({
    ...state,
    componentNameStates: { ...state.componentNameStates, [variantId]: data },
  }),

  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.componentNameStates[variantId] || {};
    const newData = updateDataByPath(source, path, value);
    
    return {
      ...state,
      componentNameStates: { ...state.componentNameStates, [variantId]: newData },
    };
  },
};
```

#### **2. إضافة Export في `context/editorStoreFunctions/index.ts`:**
```tsx
export * from "./componentNameFunctions";
```

#### **3. إضافة في `context/editorStore.ts`:**
```tsx
// في الـ interface
componentNameStates: Record<string, ComponentData>;

// في الـ initial state
componentNameStates: {},

// في الـ ensureComponentVariant
case "componentType":
  return componentNameFunctions.ensureVariant(state, variantId, initial);

// في الـ getComponentData
case "componentType":
  return componentNameFunctions.getData(state, variantId);

// في الـ setComponentData
case "componentType":
  return componentNameFunctions.setData(state, variantId, data);

// في الـ updateComponentByPath
case "componentType":
  return componentNameFunctions.updateByPath(state, variantId, path, value);

// في الـ loadFromDatabase
case "componentType":
  newState.componentNameStates = componentNameFunctions.setData(newState, comp.componentName, comp.data).componentNameStates;
  break;

// في الـ createPage
case "componentType":
  newState.componentNameStates = componentNameFunctions.setData(newState, comp.componentName, comp.data).componentNameStates;
  break;
```

---

## 🧪 **اختبار النظام**

### **1. اختبار Editor Store:**
```tsx
// في Live Editor
// 1. أضف المكون
// 2. عدل على البيانات من الـ sidebar
// 3. يجب أن تتغير فوراً
```

### **2. اختبار Tenant Store:**
```tsx
// في الصفحة العادية
// 1. يجب أن تظهر البيانات من قاعدة البيانات
// 2. يجب أن تعمل بشكل صحيح
```

### **3. اختبار المكونات المكررة:**
```tsx
// في Live Editor
// 1. أضف مكونين من نفس النوع
// 2. عدل على الأول فقط
// 3. يجب أن يتغير الأول فقط وليس الثاني
```

---

## 🎉 **النتائج المتوقعة**

### ✅ **بعد تطبيق النظام:**
1. **استقلالية كاملة**: كل مكون له state منفصل
2. **تكامل مثالي**: مع Editor Store و Tenant Store
3. **أداء عالي**: دمج البيانات بكفاءة
4. **سهولة الصيانة**: كود موحد ومتسق
5. **دعم المكونات المكررة**: بدون تداخل

### 🚀 **الفوائد:**
- **تجربة مستخدم محسنة**: التعديلات دقيقة ومستهدفة
- **مرونة أكبر**: دعم عدد غير محدود من المكونات المتكررة
- **استقرار النظام**: لا توجد تداخلات بين المكونات
- **قابلية التوسع**: سهولة إضافة مكونات جديدة

---

## 📚 **خلاصة تقنية**

النظام الموحد يضمن أن كل مكون يستخدم **معرف فريد** (`component.id`) بدلاً من **اسم المكون المشترك** (`componentName`). هذا يضمن أن كل مكون له **Editor Store state منفصل**، مما يحل مشكلة التداخل بين المكونات المتكررة في الـ Live Editor.

**المبدأ الأساسي**: `variantId = props.variant || "componentName1"` حيث `props.variant` يأتي من `component.id` (فريد) في الـ Live Editor.
