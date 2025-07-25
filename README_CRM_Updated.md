# نظام إدارة علاقات العملاء (CRM) - محدث

## التحديثات الجديدة

### ✅ تم إنجازه:

1. **استخدام البيانات من API بدلاً من البيانات الثابتة**
   - ✅ `pipelineStages` يأتي من `crmData?.pipelineStages`
   - ✅ `customersData` يأتي من `crmData?.customersData`
   - ✅ حذف جميع البيانات الثابتة

2. **تحويل البيانات من API في الـ Store**
   - ✅ تحويل `stages_summary` إلى `pipelineStages`
   - ✅ تحويل `stages_with_customers` إلى `customersData`
   - ✅ إضافة البيانات المفقودة (email, phone, etc.)

3. **شكل البيانات من API**
   ```json
   {
     "status": "success",
     "total_customers": 7,
     "stages_summary": [
       {
         "stage_id": 3,
         "stage_name": "Completed Successfully",
         "color": "#28A745",
         "icon": "fa fa-check-circle",
         "customer_count": 0
       }
     ],
     "stages_with_customers": [
       {
         "stage_id": 1,
         "stage_name": "Qualified & Verified",
         "customers": [
           {
             "customer_id": 13,
             "name": "customer5",
             "city": {
               "id": 3,
               "name_ar": "الرياض",
               "name_en": "Riyadh"
             },
             "priority": 1,
             "customer_type": "Seller",
             "reminders_count": 0,
             "appointments_count": 0
           }
         ]
       }
     ]
   }
   ```

4. **تحويل البيانات في الـ Store**
   ```javascript
   // في context/store/crm.js
   const transformedData = {
     ...data,
     // تحويل stages_summary إلى pipelineStages
     pipelineStages: data.stages_summary?.map((stage, index) => ({
       id: stage.stage_id,
       name: stage.stage_name,
       color: stage.color,
       icon: stage.icon,
       description: `مرحلة ${stage.stage_name}`,
       order: index + 1,
       customer_count: stage.customer_count
     })) || [],
     // تحويل stages_with_customers إلى customersData
     customersData: data.stages_with_customers?.flatMap(stage => 
       stage.customers.map(customer => ({
         id: customer.customer_id,
         customer_id: customer.customer_id,
         name: customer.name,
         // ... باقي البيانات المحولة
       }))
     ) || []
   };
   ```

5. **استخدام البيانات في المكون**
   ```javascript
   // في components/crm/crm-page.tsx
   const { crmData: { data: crmData, loading, error }, fetchCrmData } = useCrmStore();
   
   // استخدام البيانات من API
   const pipelineStages = crmData?.pipelineStages || []
   const customersData = crmData?.customersData || []
   ```

## الميزات الجديدة

### 🔄 البيانات الديناميكية
- جميع البيانات تأتي من API
- لا توجد بيانات ثابتة
- تحديث تلقائي عند تغيير البيانات

### 📊 الإحصائيات المحدثة
- `totalCustomers` من API
- `activeCustomers` محسوبة من البيانات الفعلية
- `pipelineStats` من `stages_summary`

### 🎯 العمليات المحدثة
- نقل العملاء بين المراحل
- إضافة ملاحظات وتذكيرات وتفاعلات
- جميع العمليات تستخدم الـ store

## كيفية الاستخدام

### 1. جلب البيانات
```javascript
const { crmData: { data, loading, error }, fetchCrmData } = useCrmStore();

useEffect(() => {
  fetchCrmData();
}, [fetchCrmData]);
```

### 2. عرض البيانات
```javascript
// عرض المراحل
{pipelineStages.map(stage => (
  <div key={stage.id}>{stage.name}</div>
))}

// عرض العملاء
{customersData.map(customer => (
  <div key={customer.id}>{customer.name}</div>
))}
```

### 3. العمليات
```javascript
// نقل العميل
await useCrmStore.getState().moveCustomerToStage(customerId, targetStageId);

// إضافة ملاحظة
await useCrmStore.getState().addNote(customerId, note);

// إضافة تذكير
await useCrmStore.getState().addReminder(customerId, reminder);
```

## ملاحظات مهمة

1. **البيانات تأتي من API**: لا توجد بيانات ثابتة في الكود
2. **التحديث التلقائي**: إعادة جلب البيانات بعد كل عملية
3. **إدارة الأخطاء**: معالجة شاملة للأخطاء
4. **حالات التحميل**: عرض مؤشرات التحميل
5. **التحويل التلقائي**: تحويل البيانات من API إلى الشكل المطلوب

## الخطوات التالية

- [ ] إضافة المزيد من العمليات (تحديث، حذف)
- [ ] تحسين واجهة المستخدم
- [ ] إضافة فلترة وبحث متقدم
- [ ] إضافة تقارير وإحصائيات 