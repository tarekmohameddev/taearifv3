# دليل نظام الفلترة المتقدم

## نظرة عامة

تم تطوير نظام فلترة متقدم وجميل للعقارات مع تصميم حديث وأنيق يستخدم الألوان الأبيض والأسود فقط.

## المكونات الرئيسية

### 1. `AdvancedFilterDialog`

مكون الفلترة الرئيسي مع تصميم حديث:

**المميزات:**

- تصميم أنيق بالأبيض والأسود
- فلاتر متعددة: الهدف، النوع، السعر، المساحة، الغرف، الحمامات، المميزات
- Price Range Slider مع قيم ديناميكية من الـ backend
- Area Range Slider
- Checkboxes للاختيارات المتعددة
- عداد الفلاتر النشطة
- أزرار إعادة التعيين والتطبيق

**الاستخدام:**

```tsx
<AdvancedFilterDialog
  isOpen={filterDialogOpen}
  onClose={() => setFilterDialogOpen(false)}
  filterData={propertiesAllData}
  onApplyFilters={handleApplyFilters}
/>
```

### 2. `ActiveFiltersDisplay`

مكون عرض الفلاتر النشطة:

**المميزات:**

- عرض الفلاتر المطبقة كـ badges
- إمكانية إزالة الفلاتر الفردية
- زر "مسح الكل"
- تصميم أنيق مع الألوان الأبيض والأسود

### 3. زر الفلترة

زر أنيق بجانب زر "إضافة عقار":

**المميزات:**

- أيقونة Filter
- عداد الفلاتر النشطة
- تصميم متسق مع باقي الواجهة

## أنواع الفلاتر المدعومة

### 1. الهدف من العقار (Purposes)

- `rent` - للإيجار
- `sale` - للبيع

### 2. نوع العقار (Type)

- `residential` - سكني
- `commercial` - تجاري
- `rent` - للإيجار
- `sale` - للبيع

### 3. نطاق السعر (Price Range)

- Slider مع قيم ديناميكية من الـ backend
- `price_from` - الحد الأدنى للسعر
- `price_to` - الحد الأقصى للسعر

### 4. نطاق المساحة (Area Range)

- Slider للمساحة بالمتر المربع
- `area_from` - الحد الأدنى للمساحة
- `area_to` - الحد الأقصى للمساحة

### 5. عدد الغرف (Beds)

- Checkboxes للاختيار من 1+ إلى 8+
- `beds` - مصفوفة بأرقام الغرف المختارة

### 6. عدد الحمامات (Baths)

- Checkboxes للاختيار من 1+ إلى 6+
- `baths` - مصفوفة بأرقام الحمامات المختارة

### 7. المميزات (Features)

- Checkboxes للمميزات المتاحة
- `features` - مصفوفة بالمميزات المختارة

## URL Parameters

النظام يبني URL parameters تلقائياً:

```
/properties?purposes_filter=rent,sale&type=residential&price_from=100000&price_to=500000&area_from=60&area_to=200&beds=2,3&baths=2&features=مكيفات,مطبخ راكب
```

### معاملات URL المدعومة:

- `purposes_filter` - الهدف من العقار
- `type` - نوع العقار
- `price_from` - الحد الأدنى للسعر
- `price_to` - الحد الأقصى للسعر
- `area_from` - الحد الأدنى للمساحة
- `area_to` - الحد الأقصى للمساحة
- `beds` - عدد الغرف
- `baths` - عدد الحمامات
- `features` - المميزات

## التكامل مع Backend

### استجابة API المطلوبة:

```json
{
  "status": "success",
  "data": {
    "properties": [...],
    "purposes_filter": ["rent", "sale"],
    "specifics_filters": {
      "price_range": {
        "min": "0.00",
        "max": "2800000.00"
      },
      "area_range": {
        "min": "60.00"
      },
      "purpose": ["rent", "sale"],
      "type": ["rent", "residential", "sale", "commercial"],
      "beds": [],
      "bath": [],
      "features": ["مكيفات", "مطبخ راكب", ...]
    },
    "pagination": {...}
  }
}
```

### إرسال الفلاتر للـ Backend:

```javascript
// في propertiesManagement.js
const params = new URLSearchParams();
params.set("page", page.toString());

Object.entries(filters).forEach(([key, value]) => {
  if (value && value.length > 0) {
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else {
      params.set(key, value.toString());
    }
  }
});

const response = await axiosInstance.get(
  `${process.env.NEXT_PUBLIC_Backend_URL}/properties?${params.toString()}`,
);
```

## الاستخدام في المكونات

### في صفحة إدارة العقارات:

```tsx
// State للفلاتر
const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
const [filterDialogOpen, setFilterDialogOpen] = useState(false);

// تطبيق الفلاتر
const handleApplyFilters = (filters: any) => {
  setAppliedFilters(filters);
  setCurrentPage(1);
  fetchProperties(1, filters);
};

// إزالة فلتر واحد
const handleRemoveFilter = (filterKey: string, filterValue?: any) => {
  const newFilters: Record<string, any> = { ...appliedFilters };
  // منطق الإزالة...
  setAppliedFilters(newFilters);
  fetchProperties(1, newFilters);
};

// مسح جميع الفلاتر
const handleClearAllFilters = () => {
  setAppliedFilters({});
  setCurrentPage(1);
  fetchProperties(1);
};
```

## التصميم والألوان

### نظام الألوان:

- **الخلفية**: أبيض (`bg-white`)
- **الحدود**: أسود (`border-black`)
- **النصوص**: أسود (`text-black`)
- **الأزرار النشطة**: أسود (`bg-black text-white`)
- **الأزرار غير النشطة**: أبيض مع حدود سوداء (`border-black text-black`)
- **الـ Badges**: أسود (`bg-black text-white`)

### العناصر المميزة:

- **Price/Area Sliders**: تصميم أنيق مع قيم ديناميكية
- **Checkboxes**: مخصصة بالأبيض والأسود
- **Active Filters Display**: badges أنيقة مع أزرار إزالة
- **Filter Button**: مع عداد الفلاتر النشطة

## أفضل الممارسات

1. **استخدم البيانات الديناميكية**: جميع الفلاتر تستخدم بيانات من الـ backend
2. **حافظ على URL sync**: الفلاتر متزامنة مع URL parameters
3. **وفر إعادة التعيين**: أزرار لإعادة تعيين الفلاتر الفردية والجماعية
4. **اعرض الفلاتر النشطة**: مكون منفصل لعرض الفلاتر المطبقة
5. **استخدم TypeScript**: للتحقق من أنواع البيانات
6. **اختبر جميع السيناريوهات**: فلاتر متعددة، إزالة، إعادة تعيين

## التحديثات المستقبلية

- إضافة فلاتر متقدمة (الموقع، التاريخ، إلخ)
- حفظ الفلاتر المفضلة
- مشاركة روابط الفلاتر
- إحصائيات استخدام الفلاتر
- تحسين الأداء للفلاتر المعقدة
