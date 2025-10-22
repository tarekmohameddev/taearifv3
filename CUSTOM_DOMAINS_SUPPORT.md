# دعم الـ Custom Domains في النظام

## نظرة عامة

تم تحديث النظام لدعم الـ Custom Domains بالإضافة إلى الـ Subdomains. هذا يعني أن التجار يمكنهم الآن استخدام دوميناتهم الخاصة (مثل `hey.com`) بدلاً من الـ subdomains فقط (مثل `tenant1.taearif.com`).

## تقسيم الصفحات حسب نوع الدومين

### الصفحات التي يجب أن تكون على الدومين الأساسي فقط:
- **Dashboard pages:** `/dashboard/*`
- **صفحات تعاريف الرسمية:** `/updates`, `/solutions`, `/landing`, `/about-us`
- **صفحات النظام:** `/live-editor`, `/login`, `/oauth`, `/onboarding`, `/register`

### الصفحات التي تدعم Custom Domains:
- **صفحات المستخدم النهائي:** `TenantPageWrapper`, `HomePageWrapper`, `[slug]`, `project`, `property`, `property-requests`

## الملفات المحدثة

### 1. `middleware.ts`
- إضافة دالة `getTenantIdFromCustomDomain()` للتحقق من الـ Custom Domains
- تحديث دالة `middleware()` الرئيسية لدعم كلا النوعين
- إضافة validation للـ subdomains (يجب أن تكون لـ productionDomain فقط)
- إضافة إعادة توجيه للصفحات النظامية إلى الدومين الأساسي
- إضافة header `x-domain-type` للتمييز بين الـ subdomain والـ custom domain

### 2. `app/TenantPageWrapper.tsx`
- إضافة prop `domainType` للتمييز بين أنواع الـ domains
- تحديث console logs لتوضيح نوع الـ domain

### 3. `app/page.tsx`
- إضافة قراءة `x-domain-type` header
- تمرير `domainType` إلى `HomePageWrapper`

### 4. `app/HomePageWrapper.tsx`
- إضافة prop `domainType`
- تحديث console logs

### 5. صفحات أخرى
- `app/solutions/page.tsx`
- `app/landing/page.tsx`
- `app/about-us/page.tsx`
- `app/[slug]/page.tsx`

جميعها تم تحديثها لتمرير `domainType` إلى `TenantPageWrapper`.

### 6. `context-liveeditor/tenantStore.jsx`
- تحديث `fetchTenantData()` لدعم النظام الجديد
- إضافة تعليقات توضيحية للـ API calls

### 7. `context-liveeditor/EditorProvider.tsx`
- تحديث التعليقات لدعم النظام الجديد
- توضيح أن tenantId يمكن أن يكون subdomain أو custom domain

### 8. `hooks/useTenantId.ts`
- إضافة دعم للـ Custom Domains
- إضافة استيراد `useTenantStore` للحصول على `tenantData.username`
- تحديث `extractTenantFromHostname` لدعم الـ Custom Domains
- إضافة أولوية للـ `tenantData.username` من API response

## كيفية العمل

### 1. Subdomain (النظام القديم)
```
tenant1.taearif.com -> tenantId: "tenant1"
company1.localhost:3000 -> tenantId: "company1"
```

### 2. Custom Domain (النظام الجديد)
```
hey.com -> tenantId: "hey.com" (إرسال الـ domain نفسه كـ tenantId)
example.com -> tenantId: "example.com" (إرسال الـ domain نفسه كـ tenantId)
```

### 3. التحقق من Custom Domain
```
// في app/page.tsx
const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);

// إذا لم يكن هناك tenantId، اعرض TaearifLandingPage
if (!tenantId) {
  return <TaearifLandingPage />;
}

// إذا كان هناك tenantId (subdomain أو custom domain)، اعرض HomePageWrapper
return <HomePageWrapper tenantId={tenantId} domainType={domainType} />;
```

### 3. تقسيم الصفحات حسب نوع الدومين

#### الصفحات النظامية (على الدومين الأساسي فقط):
```
https://taearif.com/dashboard -> ✅ مسموح
https://taearif.com/live-editor -> ✅ مسموح
https://taearif.com/login -> ✅ مسموح
https://hey.com/dashboard -> ❌ إعادة توجيه إلى taearif.com/dashboard
```

#### صفحات المستخدم النهائي (تدعم Custom Domains):
```
https://tenant1.taearif.com/ -> ✅ مسموح (subdomain)
https://hey.com/ -> ✅ مسموح (custom domain)
https://hey.com/about-us -> ✅ مسموح (custom domain)
```

## آلية التحقق

1. **التحقق من الصفحات النظامية**: يتحقق من أن الصفحات النظامية على الدومين الأساسي
2. **التحقق من Subdomain أولاً**: يحاول النظام أولاً استخراج `tenantId` من الـ subdomain
3. **التحقق من Custom Domain**: إذا لم يجد subdomain، يتحقق من الـ Custom Domain محلياً (بدون API call)
4. **التحقق من tenantId في app/page.tsx**: إذا كان هناك tenantId (subdomain أو custom domain)، يعرض HomePageWrapper
5. **استخدام tenantData.username في useTenantId**: يأخذ `tenantId` من `response.data.username` من API response
6. **إضافة Headers**: يضيف النظام headers إضافية:
   - `x-tenant-id`: معرف الـ tenant (subdomain أو custom domain)
   - `x-domain-type`: نوع الـ domain ("subdomain" أو "custom")

## إعداد قاعدة البيانات

لتفعيل النظام مع قاعدة البيانات الحقيقية، يجب:

1. **إنشاء جدول Custom Domains**:
```sql
CREATE TABLE custom_domains (
  id SERIAL PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

2. **تحديث Backend API** في `getTenant` endpoint:
```typescript
// في Backend API، تحديث getTenant endpoint لدعم Custom Domains
// إذا كان websiteName يحتوي على ".com" أو ".org" إلخ، فهو Custom Domain
// إذا لم يكن، فهو Subdomain
```

3. **تحديث middleware.ts** (محلياً للسرعة):
```typescript
// getTenantIdFromCustomDomain() يعمل محلياً بدون API call للسرعة
function getTenantIdFromCustomDomain(host: string): string | null {
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);
  if (!isCustomDomain) return null;
  return host; // إرجاع الـ host نفسه كـ tenantId
}
```

## أمثلة على الاستخدام

### Subdomain
```
https://company1.taearif.com/
-> tenantId: "company1"
-> domainType: "subdomain"
-> API Request: { websiteName: "company1" }
```

### Custom Domain
```
https://hey.com/
-> tenantId: "hey.com"
-> domainType: "custom"
-> API Request: { websiteName: "hey.com" }
-> app/page.tsx: tenantId = "hey.com" -> HomePageWrapper
```

### الصفحات النظامية (إعادة توجيه)
```
https://hey.com/dashboard
-> ❌ إعادة توجيه إلى: https://taearif.com/dashboard

https://company1.taearif.com/live-editor
-> ❌ إعادة توجيه إلى: https://taearif.com/live-editor
```

## الفوائد

1. **مرونة أكبر**: التجار يمكنهم استخدام دوميناتهم الخاصة
2. **احترافية**: دومينات مخصصة تبدو أكثر احترافية
3. **SEO أفضل**: دومينات مخصصة أفضل لمحركات البحث
4. **توافق مع النظام القديم**: لا يؤثر على الـ subdomains الموجودة
5. **أمان أفضل**: فصل الصفحات النظامية عن صفحات المستخدمين
6. **سهولة الإدارة**: إدارة أفضل للصفحات حسب نوعها

## ملاحظات مهمة

1. **الأمان**: يجب التأكد من التحقق من صحة الـ Custom Domains
2. **الأداء**: قد يكون التحقق من الـ Custom Domains أبطأ قليلاً
3. **التخزين المؤقت**: يُنصح بإضافة cache للـ Custom Domains
4. **المراقبة**: يجب مراقبة استدعاءات API للـ Custom Domains
5. **إعادة التوجيه**: الصفحات النظامية ستُعاد توجيهها تلقائياً للدومين الأساسي
6. **التحقق من Subdomain**: يجب أن يكون subdomain لـ productionDomain فقط

## التطوير المستقبلي

1. **Cache Layer**: إضافة Redis أو Memcached للـ Custom Domains
2. **SSL Certificates**: دعم SSL certificates للـ Custom Domains
3. **Domain Validation**: التحقق من صحة الـ Custom Domains
4. **Analytics**: تتبع استخدام الـ Custom Domains
