# إعداد Google Analytics 4 (GA4)

## متغيرات البيئة المطلوبة

أضف المتغيرات التالية إلى ملف `.env.local` في جذر المشروع:

```env
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA4_ID=G-WTN83NMVW1
NEXT_PUBLIC_GA4_LEGACY_ID=G-RVFKM2F9ZN

# Backend URL
NEXT_PUBLIC_Backend_URL=http://localhost:3001
```

## التحديثات المطبقة

### 1. ملف `lib/ga4-tracking.ts`

- ✅ تم تحديث `initializeGA4()` لاستخدام `process.env.NEXT_PUBLIC_GA4_ID`
- ✅ القيمة الافتراضية: `G-WTN83NMVW1`

### 2. ملف `components/GTMProvider.tsx`

- ✅ تم تحديث GA4 script URL لاستخدام متغير البيئة
- ✅ تم تحديث gtag config لاستخدام متغير البيئة

### 3. الملفات التي تستخدم GA4Provider

- ✅ `app/HomePageWrapper.tsx`
- ✅ `app/TenantPageWrapper.tsx`
- ✅ `app/property/[id]/PropertyPageWrapper.tsx`
- ✅ `app/project/[id]/ProjectPageWrapper.tsx`

## كيفية العمل

1. **تلقائي**: إذا كان `NEXT_PUBLIC_GA4_ID` موجود في متغيرات البيئة، سيتم استخدامه
2. **افتراضي**: إذا لم يكن موجود، سيتم استخدام `G-WTN83NMVW1`
3. **مرونة**: يمكن تغيير GA4 ID بسهولة عبر متغيرات البيئة

## التحقق من العمل

بعد إضافة متغيرات البيئة:

1. أعد تشغيل الخادم: `npm run dev`
2. افتح Developer Tools → Network
3. ابحث عن طلبات `googletagmanager.com`
4. تأكد من أن الـ ID الجديد `G-WTN83NMVW1` يظهر في الطلبات

## ملاحظات مهمة

- ⚠️ تأكد من إضافة `.env.local` إلى `.gitignore`
- 🔄 أعد تشغيل الخادم بعد إضافة متغيرات البيئة
- 📊 يمكن استخدام GA4 ID مختلف لكل بيئة (development, staging, production)
