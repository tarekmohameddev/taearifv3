# Vercel Domain Integration

## نظرة عامة
تم دمج نظام إدارة النطاقات المخصصة مع Vercel API لتمكين إضافة النطاقات تلقائياً إلى مشروع Vercel.

## الملفات المضافة/المعدلة

### 1. API Route الجديد
- **الملف:** `app/api/vercel/add-domain/route.js` (Next.js 15 App Router)
- **الوظيفة:** يتعامل مع إضافة النطاقات إلى Vercel API
- **الأمان:** جميع بيانات Vercel محمية على السيرفر فقط
- **التحديث:** يستخدم axios العادي بدلاً من axiosInstance لتجنب PHP backend

### 2. إعدادات Vercel
- **الملف:** `app/api/vercel/add-domain/route.js` (مدمج في API route)
- **الوظيفة:** يحتوي على إعدادات Vercel API مدمجة
- **المتغيرات:**
  - `VERCEL_TOKEN`: رمز المصادقة (من متغيرات البيئة أو افتراضي)
  - `VERCEL_PROJECT_ID`: معرف المشروع (من متغيرات البيئة أو افتراضي)

### 3. تحديث Frontend
- **الملف:** `components/settings-page.tsx`
- **التحديث:** دالة `handleAddDomain2` تستخدم axios العادي مع API الجديد
- **السبب:** تجنب إرسال الطلبات إلى PHP backend

## كيفية الاستخدام

### 1. إعداد متغيرات البيئة
```bash
# إنشاء ملف .env.local
VERCEL_TOKEN=s9Ltgz5461j51k6531v6M3OSOuDUDrvN
VERCEL_PROJECT_ID=prj_38KFpi23Xf79S6111W1515165665Cc5IkeTo40cc3NDrK
```

### 2. اختبار API
```bash
# اختبار API محلياً
curl -X POST http://localhost:3000/api/vercel/add-domain \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

### 3. استخدام الواجهة
1. اذهب إلى صفحة الإعدادات
2. اضغط على "إضافة نطاق2"
3. أدخل اسم النطاق
4. اضغط "إضافة نطاق2"

## استجابة API

### نجاح العملية
```json
{
  "success": true,
  "message": "Domain example.com has been successfully added to Vercel project",
  "data": {
    "domain": "example.com",
    "apexName": "example.com",
    "verified": false,
    "dnsRecords": [
      {
        "type": "TXT",
        "name": "_vercel.example.com",
        "value": "vc-domain-verify=example.com,90ae75d9edd47ddaf465",
        "purpose": "pending_domain_verification",
        "ttl": 3600
      }
    ],
    "instructions": {
      "title": "DNS Configuration Required",
      "description": "To complete the domain setup, add the following DNS records to your domain provider:",
      "steps": [
        "1. Log in to your domain provider (GoDaddy, Namecheap, etc.)",
        "2. Go to DNS management section",
        "3. Add the DNS records shown below",
        "4. Wait for DNS propagation (usually 5-15 minutes)",
        "5. The domain will be automatically verified by Vercel"
      ]
    },
    "vercelResponse": {...},
    "addedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### فشل العملية
```json
{
  "success": false,
  "message": "Domain already exists in this project",
  "data": {
    "domain": "example.com",
    "vercelError": {...},
    "attemptedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## معالجة الأخطاء

### أنواع الأخطاء المدعومة
1. **domain_already_exists**: النطاق موجود بالفعل
2. **invalid_domain**: تنسيق النطاق غير صالح
3. **domain_not_verified**: النطاق يحتاج للتحقق

### رسائل الخطأ
- جميع رسائل الخطأ باللغة العربية
- تسجيل مفصل في console
- إشعارات للمستخدم عبر toast

## الأمان

### حماية البيانات
- ✅ Vercel credentials محمية على السيرفر
- ✅ لا يتم إرسال البيانات الحساسة للعميل
- ✅ التحقق من صحة النطاق قبل الإرسال

### CORS
- ✅ دعم CORS للطلبات المتقاطعة
- ✅ رؤوس HTTP آمنة

## التطوير المستقبلي

### PHP Backend Integration
هذا النظام يعمل كنموذج أولي للفريق PHP المستقبلي:
1. **API Structure**: نفس هيكل الاستجابة
2. **Error Handling**: نفس معالجة الأخطاء
3. **Security**: نفس مستوى الأمان

### تحسينات مقترحة
1. **Domain Verification**: إضافة التحقق من ملكية النطاق
2. **SSL Management**: إدارة شهادات SSL
3. **DNS Configuration**: إعداد DNS تلقائي

## استكشاف الأخطاء

### مشاكل شائعة
1. **Token غير صالح**: تحقق من VERCEL_TOKEN
2. **Project ID خاطئ**: تحقق من VERCEL_PROJECT_ID
3. **Network Error**: تحقق من الاتصال بالإنترنت

### سجلات التطوير
```bash
# مراقبة السجلات
npm run dev
# ابحث عن [VERCEL-API] في console
```

## الدعم الفني

للحصول على المساعدة:
1. تحقق من سجلات console
2. راجع ملف `vercel-config.js`
3. تأكد من صحة متغيرات البيئة
