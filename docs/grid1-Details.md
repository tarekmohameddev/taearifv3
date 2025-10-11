# Grid1 Component - Store Integration Details

## نظرة عامة

مكون `grid1` هو مكون عرض شبكة العقارات الذي يدعم حالتين مختلفتين:

1. **حالة الـ Live Editor** - يستخدم `editorStore` و `tenantStore`
2. **حالة الـ Tenant العادية** - يستخدم `tenantStore` فقط

## 1. الـ Imports والـ Dependencies

```typescript
// Store imports
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
```

## 2. الـ Props Interface

```typescript
interface PropertyGridProps {
  emptyMessage?: string;
  className?: string;
  cardSettings?: {
    theme?: string;
    showImage?: boolean;
    showPrice?: boolean;
    showDetails?: boolean;
    showViews?: boolean;
    showStatus?: boolean;
  };
  dataSource?: {
    apiUrl?: string;
    enabled?: boolean;
  };
  useStore?: boolean; // 🔑 المفتاح الرئيسي لتحديد الحالة
  variant?: string; // معرف المكون
  id?: string; // معرف المكون في قاعدة البيانات
}
```

## 3. Store Integration Logic

### 3.1 متغيرات الـ Stores

```typescript
// Editor Store (للـ Live Editor فقط)
const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
const getComponentData = useEditorStore((s) => s.getComponentData);

// Tenant Store (للكلا الحالتين)
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);

// Tenant ID Hook
const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();
```

### 3.2 منطق تحديد الحالة

```typescript
// تحديد معرف المكون
const variantId = props.variant || "grid1";

// التأكد من تسجيل المكون في الـ Editor Store (للـ Live Editor فقط)
useEffect(() => {
  if (props.useStore) {
    ensureComponentVariant("grid", variantId, props);
  }
}, [variantId, props.useStore, ensureComponentVariant]);
```

## 4. Data Loading Strategy

### 4.1 تحميل بيانات الـ Tenant

```typescript
// تحميل بيانات الـ Tenant عند توفر الـ tenantId
useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

### 4.2 منطق استخراج البيانات

```typescript
// الحصول على البيانات من الـ Editor Store (للـ Live Editor)
const storeData = props.useStore
  ? getComponentData("grid", variantId) || {}
  : {};

// الحصول على البيانات من الـ Tenant Store
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) {
    return {};
  }

  // البحث في جميع الصفحات عن هذا المكون
  for (const [pageSlug, pageComponents] of Object.entries(
    tenantData.componentSettings,
  )) {
    if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
      for (const [componentId, component] of Object.entries(
        pageComponents as any,
      )) {
        if (
          (component as any).type === "grid" &&
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
```

### 4.3 دمج البيانات

```typescript
// دمج البيانات مع الأولوية: storeData > tenantComponentData > props
const mergedData = {
  ...props,
  ...tenantComponentData,
  ...storeData,
};
```

## 5. API Data Integration

### 5.1 إعداد الـ API URL

```typescript
// الـ API URL الافتراضي
const defaultUrl = "/v1/tenant-website/{{tenantID}}/properties";

// تحويل تنسيق الـ API URL
const convertApiUrl = (url: string, tenantId: string): string => {
  return url.replace("{{tenantID}}", tenantId);
};
```

### 5.2 تحميل البيانات من الـ API

```typescript
// تحميل العقارات من الـ API
const fetchPropertiesFromApi = async (apiUrl?: string) => {
  try {
    setLoading(true);

    if (!currentTenantId) {
      setLoading(false);
      return;
    }

    const url = convertApiUrl(apiUrl || defaultUrl, currentTenantId);
    const response = await axiosInstance.get(url);

    // معالجة تنسيقات مختلفة من الـ API response
    if (response.data) {
      let dataToSet = [];

      // فحص إذا كان استجابة مشاريع
      if (url.includes("/projects")) {
        // معالجة بيانات المشاريع
        // تحويل المشاريع إلى تنسيق العقارات
      }
      // فحص إذا كان استجابة عقارات
      else if (response.data.properties) {
        dataToSet = response.data.properties;
      }
      // معالجة المصفوفة المباشرة
      else if (Array.isArray(response.data)) {
        dataToSet = response.data;
      }

      setApiProperties(dataToSet);
    }
  } catch (error) {
    console.error("Grid: Error fetching properties:", error);
    setApiProperties([]);
  } finally {
    setLoading(false);
  }
};
```

### 5.3 تحويل بيانات المشاريع

```typescript
// تحويل بيانات المشروع إلى تنسيق العقار
const convertProjectToProperty = (project: any): any => {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    district: project.address || project.location?.address || "غير محدد",
    price: formatPrice(project.minPrice, project.maxPrice),
    views: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: project.units ? `${project.units} وحدة` : "غير محدد",
    type: "مشروع",
    transactionType: "project",
    image: project.image || project.images?.[0] || "",
    status: project.completeStatus === "1" ? "مكتمل" : "قيد الإنشاء",
    // ... المزيد من الخصائص
  };
};
```

## 6. Data Flow في الحالتين

### 6.1 حالة الـ Live Editor (`useStore: true`)

```
1. تحميل tenantData من tenantStore
2. تسجيل المكون في editorStore
3. الحصول على البيانات من editorStore (storeData)
4. الحصول على البيانات من tenantData (tenantComponentData)
5. دمج البيانات: storeData > tenantComponentData > props
6. تحميل البيانات من API إذا كان مفعلاً
7. عرض البيانات المدمجة
```

### 6.2 حالة الـ Tenant العادية (`useStore: false`)

```
1. تحميل tenantData من tenantStore
2. الحصول على البيانات من tenantData (tenantComponentData)
3. دمج البيانات: tenantComponentData > props
4. تحميل البيانات من API إذا كان مفعلاً
5. عرض البيانات المدمجة
```

## 7. Error Handling

### 7.1 حالات التحميل

```typescript
// عرض حالة التحميل
if (tenantLoading) {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-lg text-gray-600 mt-4">جاري تحميل بيانات الموقع...</p>
        </div>
      </div>
    </section>
  );
}
```

### 7.2 حالات الخطأ

```typescript
// عرض خطأ عدم وجود tenant ID
if (!currentTenantId) {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* Warning Icon */}
          </div>
          <p className="text-lg text-yellow-600 font-medium">لم يتم العثور على معرف الموقع</p>
          <p className="text-sm text-gray-500 mt-2">تأكد من أنك تصل إلى الموقع من الرابط الصحيح</p>
        </div>
      </div>
    </section>
  );
}
```

## 8. الـ Rendering Logic

### 8.1 تحديد البيانات للعرض

```typescript
// استخدام بيانات API إذا كانت مفعلة، وإلا استخدام البيانات الثابتة
const useApiData = mergedData.dataSource?.enabled !== false;
const properties = useApiData
  ? apiProperties
  : mergedData.items || mergedData.properties || [];
```

### 8.2 عرض العقارات

```typescript
// عرض العقارات مع إعدادات البطاقة
{properties.map((property: any) => {
  const cardSettings = mergedData.cardSettings || {};
  const theme = cardSettings.theme || "card1";
  let CardComponent = PropertyCard;

  if (theme === "card2") {
    CardComponent = PropertyCard2;
  } else if (theme === "card3") {
    CardComponent = PropertyCard3;
  }

  return (
    <CardComponent
      key={property.id}
      property={property}
      showImage={cardSettings.showImage !== false}
      showPrice={cardSettings.showPrice !== false}
      showDetails={cardSettings.showDetails !== false}
      showViews={cardSettings.showViews !== false}
      showStatus={cardSettings.showStatus !== false}
    />
  );
})}
```

## 9. الـ Key Features

### 9.1 دعم مصادر البيانات المتعددة

- **API Data**: تحميل البيانات من API endpoints مختلفة
- **Static Data**: استخدام البيانات الثابتة من الـ stores
- **Project Data**: تحويل بيانات المشاريع إلى تنسيق العقارات

### 9.2 دعم تنسيقات API مختلفة

- **Properties API**: `/v1/tenant-website/{{tenantID}}/properties`
- **Projects API**: `/v1/tenant-website/{{tenantID}}/projects`
- **Custom API**: أي API مخصص

### 9.3 دعم إعدادات البطاقات

- **Theme Selection**: card1, card2, card3
- **Display Options**: showImage, showPrice, showDetails, showViews, showStatus
- **Custom Styling**: ألوان، خطوط، تخطيط

## 10. الـ Performance Considerations

### 10.1 تحسين التحميل

- استخدام `useEffect` مع dependencies محددة
- تحميل البيانات فقط عند الحاجة
- إدارة حالة التحميل بشكل صحيح

### 10.2 إدارة الذاكرة

- تنظيف البيانات عند إلغاء تحميل المكون
- تجنب إعادة التحميل غير الضرورية
- استخدام `useMemo` للعمليات الثقيلة

## 11. الـ Testing Strategy

### 11.1 اختبار الـ Store Integration

- اختبار تحميل البيانات من `tenantStore`
- اختبار تحميل البيانات من `editorStore`
- اختبار دمج البيانات بشكل صحيح

### 11.2 اختبار الـ API Integration

- اختبار تحميل البيانات من API مختلف
- اختبار معالجة تنسيقات البيانات المختلفة
- اختبار معالجة الأخطاء

### 11.3 اختبار الـ Rendering

- اختبار عرض البيانات بشكل صحيح
- اختبار حالات التحميل والأخطاء
- اختبار إعدادات البطاقات المختلفة
