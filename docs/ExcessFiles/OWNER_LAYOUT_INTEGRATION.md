# Owner Layout Integration - تم ✅

## التحديث المُنجز

### ✅ إنشاء Owner Layout

تم إنشاء ملف `app/owner/layout.tsx` الذي يتحقق من وجود tenant ID قبل السماح بالوصول لصفحات owner:

```javascript
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const domainType = headersList.get("x-domain-type") as "subdomain" | "custom" | null;
  const host = headersList.get("host") || "";

  // التحقق من أن الـ host هو custom domain (يحتوي على .com, .net, .org, إلخ)
  const isCustomDomain = /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(host);

  // إذا لم يكن هناك tenantId، اعرض صفحة تعاريف الرسمية
  if (!tenantId) {
    redirect("/");
  }

  // إذا كان هناك tenantId (subdomain أو custom domain)، اعرض صفحات owner
  // isCustomDomain يمكن استخدامه للتحقق من نوع الـ domain إذا لزم الأمر
  return <>{children}</>;
}
```

## كيفية العمل

### 1. استخراج البيانات من Headers

```javascript
const headersList = await headers();
const tenantId = headersList.get("x-tenant-id");
const domainType = headersList.get("x-domain-type");
const host = headersList.get("host") || "";
```

### 2. التحقق من Custom Domain

```javascript
const isCustomDomain =
  /\.(com|net|org|io|co|me|info|biz|name|pro|aero|asia|cat|coop|edu|gov|int|jobs|mil|museum|tel|travel|xxx)$/i.test(
    host,
  );
```

### 3. التحقق من Tenant ID

```javascript
if (!tenantId) {
  redirect("/"); // إعادة توجيه للصفحة الرئيسية
}
```

### 4. عرض الصفحات

```javascript
return <>{children}</>; // عرض صفحات owner
```

## الميزات

### ✅ Tenant Validation

- يتحقق من وجود tenant ID قبل السماح بالوصول
- يعيد التوجيه للصفحة الرئيسية إذا لم يكن هناك tenant

### ✅ Domain Type Detection

- يكتشف نوع الدومين (subdomain أو custom)
- يمكن استخدامه للتحكم في السلوك

### ✅ Automatic Protection

- يحمي جميع صفحات `/owner/*` تلقائياً
- لا يحتاج لإضافة التحقق في كل صفحة

### ✅ Consistent with Homepage

- يستخدم نفس منطق الصفحة الرئيسية
- متسق مع باقي النظام

## أمثلة على السلوك

### ✅ مع Tenant ID:

```
URL: lira.localhost:3000/owner/dashboard
Result: ✅ يتم عرض الصفحة
```

### ✅ مع Custom Domain:

```
URL: custom-domain.com/owner/dashboard
Result: ✅ يتم عرض الصفحة
```

### ❌ بدون Tenant ID:

```
URL: localhost:3000/owner/dashboard
Result: ❌ إعادة توجيه إلى "/"
```

### ❌ على Base Domain:

```
URL: taearif.com/owner/dashboard
Result: ❌ إعادة توجيه إلى "/"
```

## الصفحات المحمية

جميع الصفحات التالية محمية الآن:

- `/owner/login`
- `/owner/register`
- `/owner/dashboard`
- أي صفحة أخرى في `/owner/*`

## الملفات المُنشأة

1. ✅ `app/owner/layout.tsx` - Owner Layout

## اختبار النظام

الآن يمكنك اختبار النظام:

1. **مع Tenant**: `lira.localhost:3000/owner/dashboard` ✅
2. **بدون Tenant**: `localhost:3000/owner/dashboard` ❌ (redirect to "/")

النظام يحمي صفحات owner تلقائياً! 🎉
