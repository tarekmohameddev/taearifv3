# نظام تخزين البيانات للمكونات (Components Caching System)

## نظرة عامة

تم تطوير نظام متقدم لتخزين وإدارة بيانات المكونات في Live Editor، يضمن استمرارية البيانات وتزامنها بين مختلف أجزاء النظام.

## المكونات الرئيسية

### 1. Editor Store (المخزن الرئيسي)
- **الموقع**: `context-liveeditor/editorStore.ts`
- **الوظيفة**: إدارة البيانات العامة للمكونات
- **المفاتيح الرئيسية**:
  - `contactCardsStates`: تخزين بيانات مكونات Contact Cards
  - `pageComponentsByPage`: تجميع المكونات حسب الصفحة
  - `globalComponentsData`: بيانات المكونات العامة

### 2. Component Functions (وظائف المكونات)
- **الموقع**: `context-liveeditor/editorStoreFunctions/contactCardsFunctions.ts`
- **الوظيفة**: إدارة البيانات الخاصة بمكون Contact Cards
- **الوظائف الرئيسية**:
  - `getDefaultContactCardsData()`: البيانات الافتراضية
  - `ensureVariant()`: ضمان وجود المكون
  - `getData()`: استرجاع البيانات
  - `setData()`: حفظ البيانات
  - `updateByPath()`: تحديث البيانات حسب المسار

### 3. Component Implementation (تنفيذ المكون)
- **الموقع**: `components/tenant/contactCards/contactCards1.tsx`
- **الوظيفة**: عرض المكون مع ربطه بالـ Store
- **المميزات**:
  - ربط مباشر مع Editor Store
  - استماع للتحديثات في الوقت الفعلي
  - دمج البيانات من مصادر متعددة
  - حماية من الأخطاء (Error Handling)

## تدفق البيانات (Data Flow)

### 1. تحميل البيانات الأولي
```
Editor Store → Component Functions → Component Implementation
```

### 2. تحديث البيانات
```
User Input → Editor Sidebar → Editor Store → Component Functions → Component Implementation
```

### 3. حفظ البيانات
```
Component Changes → Store Update → Page Components Update → Persistence
```

## مصادر البيانات (Data Sources)

### 1. Store Data (بيانات المخزن)
- **الأولوية**: الأولى
- **المصدر**: `contactCardsStates[uniqueId]`
- **الاستخدام**: التعديلات المحلية

### 2. API Data (بيانات الـ API)
- **الأولوية**: الثانية
- **المصدر**: `tenantData.componentSettings`
- **الاستخدام**: البيانات من الخادم

### 3. Props Data (بيانات الخصائص)
- **الأولوية**: الثالثة
- **المصدر**: `props`
- **الاستخدام**: البيانات الممررة من الخارج

### 4. Default Data (البيانات الافتراضية)
- **الأولوية**: الأخيرة
- **المصدر**: `getDefaultContactCardsData()`
- **الاستخدام**: البيانات الافتراضية

## نظام دمج البيانات (Data Merging System)

### 1. أولوية البيانات
```typescript
const mergedData = {
  ...defaultData,           // البيانات الافتراضية
  ...props,                 // خصائص المكون
  ...tenantComponentData,   // بيانات الـ API
  ...storeData,             // بيانات المخزن
  ...currentStoreData,      // البيانات الحالية
};
```

### 2. دمج الكائنات المتداخلة
```typescript
layout: {
  ...defaultData.layout,
  ...(props.layout || {}),
  ...(tenantComponentData?.layout || {}),
  ...(storeData?.layout || {}),
  ...(currentStoreData?.layout || {}),
}
```

## نظام التحديثات في الوقت الفعلي (Real-time Updates)

### 1. Store Subscription
```typescript
useEffect(() => {
  const unsubscribe = useEditorStore.subscribe((state) => {
    const newContactCardsStates = state.contactCardsStates;
    if (newContactCardsStates[uniqueId]) {
      setForceUpdate(prev => prev + 1);
    }
  });
  return unsubscribe;
}, [props.useStore, uniqueId]);
```

### 2. Force Re-render
- استخدام `useState` لفرض إعادة الرسم
- تحديث المكون عند تغيير البيانات
- ضمان التزامن بين المخزن والمكون

## نظام الحماية من الأخطاء (Error Handling)

### 1. حماية من البيانات الفارغة
```typescript
const cards: ContactCardProps[] = (mergedData.cards || defaultData.cards).map((card: ContactCardProps) => ({
  ...card,
  icon: {
    ...card.icon,
    src: card.icon.src || "fallback-image"
  },
  cardStyle: {
    ...defaultData.cards[0]?.cardStyle,
    ...card.cardStyle
  }
}));
```

### 2. حماية من الخصائص غير المحددة
```typescript
className={`${card.icon.size?.mobile || "w-[40px] h-[40px]"} ${card.icon.size?.desktop || "md:w-[60px] md:h-[60px]"}`}
```

### 3. حماية من الصور الفارغة
```typescript
{card.icon.src && card.icon.src.trim() !== "" && (
  <Image
    src={card.icon.src}
    alt={card.icon.alt || "Contact card icon"}
  />
)}
```

## نظام البيانات الافتراضية (Default Data System)

### 1. البيانات الافتراضية للمكون
```typescript
const getDefaultContactCardsData = () => ({
  visible: true,
  layout: { /* layout configuration */ },
  cards: [
    {
      icon: { /* icon configuration */ },
      title: { /* title configuration */ },
      content: { /* content configuration */ },
      cardStyle: { /* style configuration */ }
    }
  ]
});
```

### 2. البيانات الافتراضية للـ Editor Sidebar
```typescript
case "contactCards":
  return {
    visible: true,
    layout: { /* layout configuration */ },
    cards: [ /* default cards */ ]
  };
```

## نظام التخزين المستمر (Persistence System)

### 1. حفظ البيانات في المخزن
```typescript
store.setComponentData(
  selectedComponent.type,
  uniqueVariantId,
  mergedData
);
```

### 2. تحديث صفحة المكونات
```typescript
store.forceUpdatePageComponents(currentPage, updatedPageComponents);
```

### 3. تحديث البيانات حسب المسار
```typescript
updateByPath: (state: any, variantId: string, path: string, value: any) => {
  // تحديث البيانات
  // تحديث pageComponentsByPage
  return {
    contactCardsStates: { /* updated states */ },
    pageComponentsByPage: { /* updated page components */ }
  };
}
```

## المميزات الرئيسية

### 1. استمرارية البيانات
- البيانات تبقى محفوظة بعد إغلاق الـ sidebar
- التعديلات تُحفظ تلقائياً
- استرجاع البيانات عند إعادة فتح المكون

### 2. التزامن في الوقت الفعلي
- التحديثات تظهر فوراً
- التزامن بين المخزن والمكون
- استماع للتغييرات

### 3. المرونة في البيانات
- دعم مصادر بيانات متعددة
- أولوية واضحة للبيانات
- دمج ذكي للبيانات

### 4. الحماية من الأخطاء
- حماية من البيانات الفارغة
- fallbacks مناسبة
- معالجة الأخطاء

### 5. سهولة الاستخدام
- بيانات افتراضية جميلة
- واجهة مستخدم سهلة
- تجربة مستخدم ممتازة

## الاستخدام

### 1. إضافة مكون جديد
```typescript
const ContactCards1 = ({ useStore = true, variant = "contactCards1", id, ...props }) => {
  // المكون سيتصل تلقائياً بالـ store
  // سيستخدم البيانات الافتراضية إذا لم توجد بيانات
}
```

### 2. تحديث البيانات
```typescript
// التحديث يتم تلقائياً من خلال الـ Editor Sidebar
// البيانات تُحفظ في الـ store
// المكون يتحدث تلقائياً
```

### 3. استرجاع البيانات
```typescript
// البيانات تُسترجَع من الـ store
// إذا لم توجد، تُستخدم البيانات الافتراضية
// المكون يعرض البيانات المناسبة
```

## الخلاصة

هذا النظام يوفر:
- **إدارة متقدمة للبيانات** مع دعم مصادر متعددة
- **تزامن في الوقت الفعلي** بين جميع أجزاء النظام
- **حماية شاملة من الأخطاء** مع fallbacks مناسبة
- **بيانات افتراضية جميلة** لتحسين تجربة المستخدم
- **سهولة في الاستخدام** مع واجهة بديهية

النظام مصمم ليكون **قابلاً للتوسع** و**سهل الصيانة** و**موثوق الأداء**.
