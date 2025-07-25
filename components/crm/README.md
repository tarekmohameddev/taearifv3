# CRM Components Architecture

تم تقسيم مكونات CRM إلى مكونات أصغر ومنظمة لسهولة الصيانة والتطوير.

## البنية الجديدة

### المكونات الأساسية

#### 1. `crm-statistics.tsx`
- **الوظيفة**: عرض إحصائيات CRM
- **المحتوى**: بطاقات الإحصائيات، التحليلات، توزيع العملاء
- **الخصائص**:
  - `totalCustomers`: إجمالي العملاء
  - `customersData`: بيانات العملاء
  - `pipelineStages`: مراحل الأنابيب
  - `pipelineStats`: إحصائيات الأنابيب
  - `scheduledAppointments`: المواعيد المجدولة
  - `totalAppointments`: إجمالي المواعيد

#### 2. `crm-filters.tsx`
- **الوظيفة**: فلاتر البحث والتصفية
- **المحتوى**: أزرار العرض، البحث، الفلاتر
- **الخصائص**:
  - `activeView`: العرض النشط
  - `searchTerm`: مصطلح البحث
  - `filterStage`: فلتر المرحلة
  - `filterUrgency`: فلتر الأولوية

#### 3. `customer-card.tsx`
- **الوظيفة**: بطاقة العميل الفردية
- **المحتوى**: معلومات العميل، الإجراءات، الحالة
- **الخصائص**:
  - `customer`: بيانات العميل
  - `stage`: مرحلة العميل
  - `isDragging`: حالة السحب
  - `isFocused`: حالة التركيز
  - `viewType`: نوع العرض (mobile/tablet/desktop)

#### 4. `pipeline-stage.tsx`
- **الوظيفة**: مرحلة واحدة في الأنابيب
- **المحتوى**: رأس المرحلة، قائمة العملاء
- **الخصائص**:
  - `stage`: بيانات المرحلة
  - `customers`: العملاء في المرحلة
  - `filteredCustomers`: العملاء المفلترون

#### 5. `pipeline-board.tsx`
- **الوظيفة**: لوحة الأنابيب الكاملة
- **المحتوى**: جميع المراحل، التنقل بلوحة المفاتيح
- **الخصائص**:
  - `pipelineStages`: جميع المراحل
  - `customersData`: بيانات العملاء
  - `filteredCustomers`: العملاء المفلترون

#### 6. `appointments-list.tsx`
- **الوظيفة**: قائمة المواعيد
- **المحتوى**: قائمة المواعيد، الإجراءات
- **الخصائص**:
  - `appointmentsData`: بيانات المواعيد
  - `onViewAppointment`: عرض الموعد
  - `onEditAppointment`: تعديل الموعد
  - `onAddAppointment`: إضافة موعد

#### 7. `crm-header.tsx`
- **الوظيفة**: رأس صفحة CRM
- **المحتوى**: العنوان، الأزرار
- **الخصائص**:
  - `onRefresh`: تحديث البيانات
  - `onSettings`: فتح الإعدادات

### معالجات الوظائف

#### 8. `drag-drop-handler.tsx`
- **الوظيفة**: معالج السحب والإفلات
- **المحتوى**: معاينة السحب، إدارة الأحداث

#### 9. `keyboard-navigation.tsx`
- **الوظيفة**: التنقل بلوحة المفاتيح
- **المحتوى**: معالجة الأحداث، التنقل بين المراحل

#### 10. `enhanced-drag-drop.tsx`
- **الوظيفة**: السحب والإفلات المحسن
- **المحتوى**: معالجة متقدمة للسحب والإفلات

#### 11. `data-handler.tsx`
- **الوظيفة**: معالج البيانات
- **المحتوى**: جلب البيانات، تحويل البيانات، تحديث البيانات

#### 12. `utilities.tsx`
- **الوظيفة**: المرافق المساعدة
- **المحتوى**: دوال مساعدة، تنسيق التواريخ، الألوان

### الحوارات (Dialogs)

جميع الحوارات موجودة في مجلد `dialogs/`:
- `customer-detail.tsx`: تفاصيل العميل
- `add-note.tsx`: إضافة ملاحظة
- `add-reminder.tsx`: إضافة تذكير
- `add-interaction.tsx`: إضافة تفاعل
- `add-stage.tsx`: إضافة مرحلة
- `crm-settings.tsx`: إعدادات CRM

## استخدام المكونات

### في الملف الرئيسي

```tsx
import {
  CrmStatistics,
  CrmFilters,
  PipelineBoard,
  AppointmentsList,
  CrmHeader,
  // ... باقي المكونات
} from "./index"

export default function CrmPage() {
  // استخدام المكونات
  return (
    <div>
      <CrmHeader onRefresh={handleRefresh} onSettings={handleSettings} />
      <CrmStatistics {...statisticsProps} />
      <CrmFilters {...filtersProps} />
      <PipelineBoard {...pipelineProps} />
    </div>
  )
}
```

### إدارة الحالة

جميع المكونات تستخدم `useCrmStore` من `context/store/crm.ts` لإدارة الحالة:

```tsx
const {
  customers,
  pipelineStages,
  selectedCustomer,
  // ... باقي الحالة
} = useCrmStore()
```

## المزايا

1. **قابلية الصيانة**: كل مكون له مسؤولية محددة
2. **إعادة الاستخدام**: يمكن استخدام المكونات في أماكن أخرى
3. **اختبار أسهل**: كل مكون يمكن اختباره بشكل منفصل
4. **أداء أفضل**: تحميل مكونات أصغر
5. **تنظيم أفضل**: بنية واضحة ومنظمة

## التطوير المستقبلي

- إضافة اختبارات لكل مكون
- تحسين الأداء
- إضافة مكونات جديدة حسب الحاجة
- تحسين إمكانية الوصول 