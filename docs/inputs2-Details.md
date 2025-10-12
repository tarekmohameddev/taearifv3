# Inputs2 Component - Store Integration Details

## نظرة عامة

مكون `inputs2` هو النسخة المحسنة من مكون النماذج الديناميكية الذي يدعم حالتين مختلفتين:

1. **حالة الـ Live Editor** - يستخدم `editorStore` و `tenantStore`
2. **حالة الـ Tenant العادية** - يستخدم `tenantStore` فقط

## 1. الـ Imports والـ Dependencies

```typescript
// Store imports
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { useTenantId } from "@/hooks/useTenantId";
import { getDefaultInputs2Data } from "@/context-liveeditor/editorStoreFunctions/inputs2Functions";
```

## 2. الـ Props Interface

```typescript
interface InputsProps {
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
  // API endpoint for form submission
  apiEndpoint?: string;
  // Additional props for store integration
  className?: string;
  visible?: boolean;
}
```

## 3. Store Integration Logic

### 3.1 Editor Store Integration (Live Editor Mode)

```typescript
// Subscribe to editor store updates for this inputs variant
const ensureComponentVariant = useEditorStore(
  (s) => s.ensureComponentVariant,
);
const getComponentData = useEditorStore((s) => s.getComponentData);
const inputs2States = useEditorStore((s) => s.inputs2States);

useEffect(() => {
  if (props.useStore) {
    ensureComponentVariant("inputs2", variantId, props);
  }
}, [variantId, props.useStore, ensureComponentVariant]);
```

### 3.2 Tenant Store Integration

```typescript
// Get tenant data
const tenantData = useTenantStore((s) => s.tenantData);
const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
const tenantId = useTenantStore((s) => s.tenantId);

useEffect(() => {
  if (tenantId) {
    fetchTenantData(tenantId);
  }
}, [tenantId, fetchTenantData]);
```

### 3.3 Tenant ID Hook

```typescript
// Tenant ID hook
const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();
```

## 4. Data Loading Strategy

### 4.1 Store Data Retrieval

```typescript
// Get data from store or tenantData with fallback logic
const storeData = props.useStore
  ? getComponentData("inputs2", variantId) || {}
  : {};
const currentStoreData =
  props.useStore && inputs2States ? inputs2States[variantId] || {} : {};
```

### 4.2 Tenant Component Data Retrieval

```typescript
const getTenantComponentData = () => {
  if (!tenantData?.componentSettings) {
    return {};
  }
  // Search through all pages for this component variant
  for (const [pageSlug, pageComponents] of Object.entries(
    tenantData.componentSettings,
  )) {
    // Check if pageComponents is an object (not array)
    if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
      // Search through all components in this page
      for (const [componentId, component] of Object.entries(
        pageComponents as any,
      )) {
        // Check if this is the exact component we're looking for by ID
        if (
          (component as any).type === "inputs2" &&
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
```

### 4.3 Data Merging with Priority

```typescript
const tenantComponentData = getTenantComponentData();

// Merge data with priority: storeData > tenantComponentData > props > default
const mergedData = {
  ...props,
  ...tenantComponentData,
  ...storeData,
};
```

## 5. Error Handling and Loading States

### 5.1 Loading State

```typescript
// Show loading state while tenant is loading
if (tenantLoading) {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="text-lg text-gray-600 mt-4">
            جاري تحميل بيانات الموقع...
          </p>
        </div>
      </div>
    </section>
  );
}
```

### 5.2 Error State

```typescript
// Show error if no tenant ID
if (!currentTenantId) {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg text-yellow-600 font-medium">
            لم يتم العثور على معرف الموقع
          </p>
          <p className="text-sm text-gray-500 mt-2">
            تأكد من أنك تصل إلى الموقع من الرابط الصحيح
          </p>
        </div>
      </div>
    </section>
  );
}
```

## 6. Styling and Layout Support

### 6.1 Section Styling

```typescript
return (
  <section
    className={`w-full bg-background py-8 ${mergedData.className || ""}`}
    style={{
      backgroundColor:
        mergedData.background?.color ||
        mergedData.styling?.bgColor ||
        "transparent",
      paddingTop: mergedData.layout?.padding?.top || "2rem",
      paddingBottom: mergedData.layout?.padding?.bottom || "2rem",
    }}
  >
    <div
      className="mx-auto px-4"
      style={{
        maxWidth:
          mergedData.layout?.maxWidth ||
          mergedData.styling?.maxWidth ||
          "1600px",
      }}
    >
```

### 6.2 Responsive Grid Layout

```typescript
// Get cards layout settings
const columns = cardsLayout.columns || "1";
const gap = cardsLayout.gap || "24px";
const responsive = cardsLayout.responsive || {
  mobile: "1",
  tablet: "2",
  desktop: "3",
};

// Get fields layout settings
const fieldsColumns = fieldsLayout.columns || "1";
const fieldsGap = fieldsLayout.gap || "16px";
const fieldsResponsive = fieldsLayout.responsive || {
  mobile: "1",
  tablet: "2",
  desktop: "3",
};
```

## 7. Data Processing and Validation

### 7.1 Cards Processing

```typescript
// Use cards from mergedData, with fallback to default data
const safeCards = useMemo(() => {
  if (cards && Array.isArray(cards) && cards.length > 0) {
    const processedCards = cards
      .filter((card) => card && card.fields && Array.isArray(card.fields))
      .map((card) => ({
        ...card,
        id: card.id || generateRandomId("card"),
        fields: card.fields
          .filter((field: any) => field && typeof field === "object")
          .map((field: any) => ({
            ...field,
            id: field.id || generateRandomId("field"),
          })),
      }));
    return processedCards;
  }
  const defaultCards = getDefaultInputs2Data().cards;
  return defaultCards;
}, [cards?.length, cards?.[0]?.id, cards?.[0]?.fields?.length]);
```

### 7.2 Form Data Management

```typescript
const [formData, setFormData] = useState<Record<string, any>>({});
const [errors, setErrors] = useState<Record<string, string>>({});
const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
const [showPasswords, setShowPasswords] = useState<Set<string>>(new Set());
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<{
  type: "success" | "error" | null;
  message: string;
}>({ type: null, message: "" });
```

## 8. API Integration

### 8.1 Form Submission

```typescript
// Handle form submission
const handleSubmit = async () => {
  setIsSubmitting(true);

  // Validate all fields
  const newErrors: Record<string, string> = {};
  let hasErrors = false;

  // ... validation logic ...

  if (!hasErrors) {
    try {
      // Create organized data and summary
      const organizedData = organizeFormDataByCards();
      const formSummary = createFormSummary();

      // Send data to API endpoint
      if (apiEndpoint && apiEndpoint.trim() !== "") {
        const response = await fetch(apiEndpoint, {
          method: submitButton.apiMethod || "POST",
          headers: {
            "Content-Type": "application/json",
            ...customHeaders,
          },
          body: JSON.stringify({
            formData: organizedData,
            summary: formSummary,
            timestamp: new Date().toISOString(),
            formId: props.id || "inputs2",
          }),
        });

        if (response.ok) {
          setSubmitStatus({
            type: "success",
            message: "تم إرسال البيانات بنجاح!",
          });
          setFormData({});
        } else {
          setSubmitStatus({
            type: "error",
            message: `فشل في إرسال البيانات: ${response.statusText}`,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  setIsSubmitting(false);
};
```

## 9. Performance Considerations

### 9.1 Memoization

```typescript
// Use cards from mergedData, with fallback to default data
const safeCards = useMemo(() => {
  // ... processing logic ...
}, [cards?.length, cards?.[0]?.id, cards?.[0]?.fields?.length]);
```

### 9.2 Callback Optimization

```typescript
// Handle input changes
const handleInputChange = useCallback(
  (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: "",
      }));
    }
  },
  [errors],
);
```

## 10. Debugging and Logging

### 10.1 Store Data Debug

```typescript
// Debug logging for store data
console.log("🔍 Store data debug:", {
  useStore: props.useStore,
  variantId,
  hasStoreData: !!storeData && Object.keys(storeData).length > 0,
  hasInputs2States: !!inputs2States,
  inputs2StatesKeys: inputs2States ? Object.keys(inputs2States) : [],
  hasCurrentStoreData:
    !!currentStoreData && Object.keys(currentStoreData).length > 0,
});
```

### 10.2 Data Flow Debug

```typescript
// Debug logging for extracted data
console.log("🔍 Extracted data from mergedData:", {
  cards: cards,
  cardsLength: cards?.length,
  isArray: Array.isArray(cards),
  theme: theme,
  submitButton: submitButton,
});
```

## 11. Usage Examples

### 11.1 Live Editor Mode

```typescript
<Inputs2
  useStore={true}
  variant="inputs2"
  id="component"
  apiEndpoint="/api/submit-form"
/>
```

### 11.2 Regular Tenant Mode

```typescript
<Inputs2
  useStore={false}
  variant="inputs2"
  id="component"
  apiEndpoint="/api/submit-form"
/>
```

## 12. Key Differences from Inputs1

1. **Enhanced Form Management**: `inputs2` يدير النماذج والبيانات المدخلة مع تحسينات إضافية
2. **Improved Validation**: يتضمن نظام تحقق محسن من صحة البيانات
3. **Better API Submission**: يدعم إرسال البيانات إلى API endpoints مع معالجة أخطاء محسنة
4. **Advanced Dynamic Fields**: يدعم حقول ديناميكية متعددة الأنواع مع تحسينات
5. **Enhanced State Management**: إدارة حالة النموذج والتحقق من الأخطاء محسنة
6. **Better Performance**: تحسينات في الأداء والذاكرة

## 13. Best Practices

1. **Always use `useStore` prop** لتحديد وضع التكامل
2. **Handle loading states** بشكل صحيح
3. **Validate data** قبل الإرسال
4. **Use proper error handling** للـ API calls
5. **Implement responsive design** للـ layout
6. **Optimize performance** باستخدام `useMemo` و `useCallback`

## 14. Troubleshooting

### 14.1 Common Issues

- **Data not loading**: تحقق من `tenantId` و `tenantData`
- **Store not updating**: تأكد من `useStore` prop
- **Form not submitting**: تحقق من `apiEndpoint` و validation
- **Styling issues**: تحقق من `mergedData` styling properties

### 14.2 Debug Steps

1. تحقق من console logs للـ data flow
2. تأكد من صحة الـ API response
3. تحقق من store state updates
4. تأكد من proper error handling

## 15. Migration from Inputs1

للمهاجرة من `inputs1` إلى `inputs2`:

1. استبدل `Inputs1` بـ `Inputs2`
2. استبدل `inputs1` بـ `inputs2` في الـ variant
3. استبدل `inputsStates` بـ `inputs2States`
4. استبدل `inputsFunctions` بـ `inputs2Functions`
5. استبدل `inputsStructure` بـ `inputs2Structure`
