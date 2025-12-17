# نظام إدارة الحجوزات - Dashboard Reservations System

## 📋 نظرة عامة

نظام إدارة حجوزات العقارات يسمح للعملاء بإنشاء طلبات حجز للعقارات (إيجار/شراء) من الموقع العام، بينما يمكن للمسؤولين في Dashboard إدارة هذه الحجوزات (عرض، قبول، رفض، تصدير).

---

## 🏗️ البنية المعمارية

### أنواع الـ APIs

#### 1. **Public APIs** (APIs عامة)

- **Base URL**: `/api/v1/tenant-website/{tenantId}`
- **Authentication**: غير مطلوبة (Public)
- **Rate Limiting**: 5 طلبات/دقيقة
- **الغرض**: إنشاء حجوزات فقط

#### 2. **Dashboard APIs** (APIs للإدارة)

- **Base URL**: `/api/v1`
- **Authentication**: مطلوبة (`Bearer Token`)
- **الغرض**: إدارة كاملة للحجوزات (قراءة، تحديث، إحصائيات، تصدير)

---

## 📊 نموذج البيانات

### جدول `reservations`

```sql
reservations:
  - id: bigint (Primary Key)
  - tenant_id: bigint → users.id
  - property_id: bigint → user_properties.id
  - type: enum('rent', 'buy')
  - status: enum('pending', 'accepted', 'rejected')
  - customer_name: string(100)
  - customer_phone: string(40)
  - desired_date: date (nullable)
  - notes: text (nullable)
  - deposit_amount: decimal(12,2) (nullable)
  - metadata: json (nullable)
  - created_at: timestamp
  - updated_at: timestamp
```

### أنواع الحجوزات (Type)

- `rent`: إيجار (يُشتق تلقائياً من `property.purpose = 'rent'` أو `'rented'`)
- `buy`: شراء (يُشتق تلقائياً من `property.purpose = 'sale'` أو `'sold'`)

### حالات الحجوزات (Status)

- `pending`: قيد الانتظار (افتراضي عند الإنشاء)
- `accepted`: مقبولة
- `rejected`: مرفوضة

### Metadata Structure

```json
{
  "ip": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "property_slug": "astdyo-mothth-hy-alaaard-rkm-19-1",
  "timeline": [
    {
      "id": "t-1",
      "action": "تم إنشاء الحجز",
      "timestamp": "2025-01-08T10:00:00Z",
      "actor": "النظام"
    }
  ]
}
```

---

## 🔐 المصادقة والأمان

### Public Endpoints

- **لا تحتاج مصادقة**
- محمية بـ **Rate Limiting**: 5 طلبات/دقيقة لكل عميل (IP)
- **Tenant Isolation**: كل tenant يمكنه الوصول لحجوزاته فقط

### Dashboard Endpoints

- **مطلوبة**: `Authorization: Bearer {access_token}`
- استخدام **Laravel Sanctum** للمصادقة
- **Tenant Isolation**: عبر Policy - كل tenant يرى حجوزاته فقط

---

## 📡 Public APIs (APIs عامة)

### 1. إنشاء حجز جديد

**Endpoint:** `POST /api/v1/tenant-website/{tenantId}/reservations`

#### الوصف

إنشاء طلب حجز جديد لعقار محدد باستخدام `slug` العقار.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "propertySlug": "astdyo-mothth-hy-alaaard-rkm-19-1",
  "customerName": "أحمد محمد",
  "customerPhone": "+966501234567",
  "desiredDate": "2025-02-01",
  "message": "أرغب في المعاينة يوم السبت"
}
```

#### Validation Rules

| الحقل           | مطلوب | النوع  | القيود                            |
| --------------- | ----- | ------ | --------------------------------- |
| `propertySlug`  | ✅    | string | max: 200                          |
| `customerName`  | ✅    | string | max: 100                          |
| `customerPhone` | ✅    | string | max: 40, regex: `/^\+?\d{7,15}$/` |
| `desiredDate`   | ❌    | date   | ISO format, `>= today`            |
| `message`       | ❌    | string | max: 1000                         |

#### Behavior (السلوك)

1. يتم حل `{tenantId}` من الـ URL
2. البحث عن العقار باستخدام `slug` ضمن عقارات المستأجر النشطة فقط (`status = 1`)
3. تحديد نوع الحجز (`type`) تلقائياً من `property.purpose`:
   - `rent` أو `rented` → `rent`
   - `sale` أو `sold` → `buy`
4. إنشاء الحجز بحالة `pending`
5. حفظ `ip` و `user_agent` في `metadata`

#### Response (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "1",
    "status": "pending"
  }
}
```

#### Error Responses

**404 Not Found** - العقار غير موجود

```json
{
  "success": false,
  "message": "العقار غير موجود"
}
```

**422 Validation Error** - خطأ في التحقق

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "customerPhone": [
      "Invalid phone format. Use international format like +9665XXXXXXX"
    ]
  }
}
```

**429 Too Many Requests** - تجاوز معدل الطلبات

```json
{
  "message": "Too Many Attempts."
}
```

#### مثال الاستخدام (curl)

```bash
curl -X POST "https://your-app.test/api/v1/tenant-website/mytenant/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "propertySlug": "astdyo-mothth-hy-alaaard-rkm-19-1",
    "customerName": "أحمد محمد",
    "customerPhone": "+966501234567",
    "desiredDate": "2025-02-01",
    "message": "أرغب في المعاينة يوم السبت"
  }'
```

#### مثال الاستخدام (JavaScript/React)

```typescript
import axiosInstance from "@/lib/axiosInstance"
import { useTenantId } from "@/hooks/useTenantId"

const CreateReservation = () => {
  const { tenantId } = useTenantId()

  const handleCreate = async (formData: {
    propertySlug: string
    customerName: string
    customerPhone: string
    desiredDate?: string
    message?: string
  }) => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/tenant-website/${tenantId}/reservations`,
        formData
      )

      if (response.data.success) {
        console.log("تم إنشاء الحجز:", response.data.data)
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error("العقار غير موجود")
      } else if (error.response?.status === 422) {
        console.error("خطأ في التحقق:", error.response.data.errors)
      } else if (error.response?.status === 429) {
        console.error("تم تجاوز معدل الطلبات، حاول مرة أخرى لاحقاً")
      }
    }
  }

  return (
    // UI Component
  )
}
```

---

## 🎛️ Dashboard APIs (APIs الإدارة)

### 2. قائمة الحجوزات (List Reservations)

**Endpoint:** `GET /api/v1/reservations`

#### الوصف

جلب قائمة جميع الحجوزات مع إمكانية الفلترة، البحث، الترتيب، والتقسيم الصفحي. يُرجع أيضاً ملخص إحصائيات.

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Query Parameters

| المعامل      | النوع   | الوصف            | القيم المتاحة                                              |
| ------------ | ------- | ---------------- | ---------------------------------------------------------- |
| `status`     | string  | فلترة حسب الحالة | `pending`, `accepted`, `rejected`, `all` (default: `all`)  |
| `type`       | string  | فلترة حسب النوع  | `rent`, `buy`, `all` (default: `all`)                      |
| `search`     | string  | البحث            | يبحث في: اسم العميل، عنوان العقار، اسم المشروع، اسم المبنى |
| `sort_by`    | string  | ترتيب حسب        | `date`, `price`, `name` (default: `date`)                  |
| `sort_order` | string  | اتجاه الترتيب    | `asc`, `desc` (default: `desc`)                            |
| `page`       | integer | رقم الصفحة       | default: `1`                                               |
| `per_page`   | integer | عدد العناصر/صفحة | default: `20`, max: `100`                                  |

#### Request Example

```
GET /api/v1/reservations?status=pending&type=rent&search=نرجس&sort_by=date&sort_order=desc&page=1&per_page=10
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Structure (200 OK)

```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "res-001",
        "type": "rent",
        "status": "pending",
        "customer": {
          "id": "cust-001",
          "name": "أحمد محمد",
          "email": "ahmed@example.com",
          "phone": "+966501234567",
          "avatar": "/avatar-male.jpg"
        },
        "property": {
          "id": "prop-001",
          "title": "فيلا فاخرة بحي النرجس",
          "address": "حي النرجس، الرياض",
          "price": 5000,
          "type": "فيلا",
          "bedrooms": 4,
          "bathrooms": 3,
          "image": "/luxury-villa.jpg",
          "projectName": "مشروع النرجس الراقي",
          "buildingName": "مبنى A"
        },
        "requestDate": "2025-01-08T10:30:00Z",
        "desiredDate": "2025-02-01",
        "duration": 12,
        "paymentRequired": true,
        "depositAmount": 15000,
        "notes": "عميل جاد جداً، يرغب في استئجار لمدة سنة"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 45,
      "last_page": 5,
      "from": 1,
      "to": 10
    },
    "stats": {
      "total": 45,
      "pending": 12,
      "accepted": 28,
      "rejected": 5
    }
  }
}
```

#### مثال الاستخدام (React)

```typescript
const fetchReservations = async () => {
  setLoading(true);
  setError(null);

  try {
    const params = new URLSearchParams();
    if (filterType !== "all") params.append("type", filterType);
    if (searchQuery) params.append("search", searchQuery);
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);
    params.append("page", "1");
    params.append("per_page", "100");

    const response = await axiosInstance.get(
      `/api/v1/reservations?${params.toString()}`,
    );

    if (response.data.success && response.data.data) {
      const reservationsData = response.data.data.reservations || [];
      setReservations(reservationsData);

      // Update stats if available
      if (response.data.data.stats) {
        setStats(response.data.data.stats);
      }
    }
  } catch (err: any) {
    console.error("Error fetching reservations:", err);
    setError(err.response?.data?.message || "حدث خطأ أثناء جلب الحجوزات");
  } finally {
    setLoading(false);
  }
};
```

---

### 3. تفاصيل حجز واحد (Show Reservation)

**Endpoint:** `GET /api/v1/reservations/{id}`

#### الوصف

جلب معلومات تفصيلية عن حجز واحد، تتضمن الوثائق والرسائل والسجل الزمني (Timeline).

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Path Parameters

- `{id}`: معرف الحجز (string)

#### Request Example

```
GET /api/v1/reservations/res-001
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Structure (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "res-001",
    "type": "rent",
    "status": "pending",
    "customer": {
      "id": "cust-001",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+966501234567",
      "avatar": "/avatar-male.jpg"
    },
    "property": {
      "id": "prop-001",
      "title": "فيلا فاخرة بحي النرجس",
      "address": "حي النرجس، الرياض",
      "price": 5000,
      "type": "فيلا",
      "bedrooms": 4,
      "bathrooms": 3,
      "image": "/luxury-villa.jpg",
      "projectName": "مشروع النرجس الراقي",
      "buildingName": "مبنى A"
    },
    "requestDate": "2025-01-08T10:30:00Z",
    "desiredDate": "2025-02-01",
    "duration": 12,
    "paymentRequired": true,
    "depositAmount": 15000,
    "notes": "عميل جاد جداً، يرغب في استئجار لمدة سنة",
    "documents": [
      {
        "id": "doc-1",
        "name": "Passport.pdf",
        "type": "pdf",
        "uploadedAt": "2025-01-08T12:00:00Z",
        "url": "/documents/doc-1.pdf"
      }
    ],
    "messages": [
      {
        "id": "msg-1",
        "sender": "أحمد محمد",
        "content": "هل العقار متاح الآن؟",
        "timestamp": "2025-01-08T10:30:00Z"
      }
    ],
    "timeline": [
      {
        "id": "t-1",
        "action": "تم إنشاء الحجز",
        "timestamp": "2025-01-08T10:00:00Z",
        "actor": "النظام"
      }
    ]
  }
}
```

#### Error Responses

**404 Not Found** - الحجز غير موجود

```json
{
  "success": false,
  "message": "الحجز غير موجود"
}
```

**403 Forbidden** - لا تملك صلاحية الوصول

```json
{
  "message": "This action is unauthorized."
}
```

#### مثال الاستخدام (React)

```typescript
const fetchReservationDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/v1/reservations/${id}`);

    if (response.data.success && response.data.data) {
      setSelectedReservation(response.data.data);
      setShowDetailDialog(true);
    }
  } catch (err: any) {
    console.error("Error fetching reservation details:", err);
    setError(err.response?.data?.message || "حدث خطأ أثناء جلب تفاصيل الحجز");
  }
};
```

---

### 4. قبول حجز (Accept Reservation)

**Endpoint:** `POST /api/v1/reservations/{id}/accept`

#### الوصف

قبول حجز مع إمكانية تأكيد استلام الدفعة وإضافة ملاحظات.

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Path Parameters

- `{id}`: معرف الحجز (string)

#### Request Body

```json
{
  "confirmPayment": true,
  "notes": "تم قبول الحجز بعد تأكيد الدفعة"
}
```

#### Request Fields

| الحقل            | مطلوب | النوع   | الوصف               |
| ---------------- | ----- | ------- | ------------------- |
| `confirmPayment` | ❌    | boolean | تأكيد استلام الدفعة |
| `notes`          | ❌    | string  | ملاحظات القبول      |

#### Response Structure (200 OK)

```json
{
  "success": true,
  "message": "تم قبول الحجز بنجاح",
  "data": {
    "id": "res-001",
    "status": "accepted",
    "updatedAt": "2025-01-13T15:30:00Z",
    "timeline": {
      "id": "t-2",
      "action": "تم قبول الحجز",
      "timestamp": "2025-01-13T15:30:00Z",
      "actor": "المسؤول",
      "notes": "تم قبول الحجز بعد تأكيد الدفعة"
    }
  }
}
```

#### مثال الاستخدام (React)

```typescript
const handleAcceptReservation = async (
  reservationId: string,
  confirmPayment: boolean,
  notes?: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/reservations/${reservationId}/accept`,
      {
        confirmPayment,
        notes: notes || undefined,
      },
    );

    if (response.data.success) {
      // Refresh reservations list
      await fetchReservations();
      await fetchReservationsStats();

      // Show success message
      console.log("تم قبول الحجز بنجاح");
    }
  } catch (err: any) {
    console.error("Error accepting reservation:", err);
    setError(err.response?.data?.message || "حدث خطأ أثناء قبول الحجز");
  }
};
```

---

### 5. رفض حجز (Reject Reservation)

**Endpoint:** `POST /api/v1/reservations/{id}/reject`

#### الوصف

رفض حجز مع إمكانية إضافة سبب الرفض.

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Path Parameters

- `{id}`: معرف الحجز (string)

#### Request Body

```json
{
  "reason": "السعر أعلى من ميزانية العميل"
}
```

#### Request Fields

| الحقل    | مطلوب | النوع  | الوصف     |
| -------- | ----- | ------ | --------- |
| `reason` | ❌    | string | سبب الرفض |

#### Response Structure (200 OK)

```json
{
  "success": true,
  "message": "تم رفض الحجز",
  "data": {
    "id": "res-001",
    "status": "rejected",
    "updatedAt": "2025-01-13T15:35:00Z",
    "timeline": {
      "id": "t-2",
      "action": "تم رفض الحجز",
      "timestamp": "2025-01-13T15:35:00Z",
      "actor": "المسؤول",
      "notes": "السعر أعلى من ميزانية العميل"
    }
  }
}
```

#### مثال الاستخدام (React)

```typescript
const handleRejectReservation = async (
  reservationId: string,
  reason?: string,
) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/reservations/${reservationId}/reject`,
      {
        reason: reason || undefined,
      },
    );

    if (response.data.success) {
      // Refresh reservations list
      await fetchReservations();
      await fetchReservationsStats();

      // Show success message
      console.log("تم رفض الحجز");
    }
  } catch (err: any) {
    console.error("Error rejecting reservation:", err);
    setError(err.response?.data?.message || "حدث خطأ أثناء رفض الحجز");
  }
};
```

---

### 6. إجراءات جماعية (Bulk Actions)

**Endpoint:** `POST /api/v1/reservations/bulk-action`

#### الوصف

تنفيذ إجراءات جماعية (قبول/رفض) على عدة حجوزات في نفس الوقت.

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Request Body

```json
{
  "action": "accept",
  "reservationIds": ["res-001", "res-002", "res-003"],
  "notes": "دفعة قبول جماعي"
}
```

#### Request Fields

| الحقل            | مطلوب | النوع  | الوصف                 | القيم              |
| ---------------- | ----- | ------ | --------------------- | ------------------ |
| `action`         | ✅    | string | نوع الإجراء           | `accept`, `reject` |
| `reservationIds` | ✅    | array  | قائمة معرفات الحجوزات | array of strings   |
| `notes`          | ❌    | string | ملاحظات               |

#### Response Structure (200 OK)

```json
{
  "success": true,
  "message": "تم تنفيذ الإجراء على 3 حجوزات",
  "data": {
    "successful": ["res-001", "res-002", "res-003"],
    "failed": [],
    "action": "accept",
    "updatedAt": "2025-01-13T15:40:00Z"
  }
}
```

#### Error Response (400 Bad Request)

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": {
    "reservationIds": ["حقل الحجوزات مطلوب"],
    "action": ["حقل الإجراء مطلوب"]
  }
}
```

#### مثال الاستخدام (React)

```typescript
const handleBulkAction = async (
  actionType: "accept" | "reject",
  reservationIds: string[],
  notes?: string,
) => {
  try {
    const response = await axiosInstance.post(
      "/api/v1/reservations/bulk-action",
      {
        action: actionType,
        reservationIds,
        notes: notes || undefined,
      },
    );

    if (response.data.success) {
      const { successful, failed } = response.data.data;

      if (failed.length > 0) {
        console.warn(`فشل في ${failed.length} حجز:`, failed);
      }

      // Refresh reservations list
      await fetchReservations();
      await fetchReservationsStats();

      // Clear selection
      setSelectedReservations(new Set());

      // Show success message
      console.log(`تم تنفيذ الإجراء على ${successful.length} حجز بنجاح`);
    }
  } catch (err: any) {
    console.error("Error performing bulk action:", err);
    setError(err.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء");
  }
};
```

---

### 7. إحصائيات الحجوزات (Reservations Statistics)

**Endpoint:** `GET /api/v1/reservations/stats`

#### الوصف

جلب إحصائيات شاملة عن الحجوزات (إجمالي، حسب الحالة، حسب النوع، حسب الشهر).

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Request Example

```
GET /api/v1/reservations/stats
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

#### Response Structure (200 OK)

```json
{
  "success": true,
  "data": {
    "total": 45,
    "pending": 12,
    "accepted": 28,
    "rejected": 5,
    "acceptanceRate": 85,
    "totalRevenue": 420000,
    "byType": {
      "rent": 28,
      "buy": 17
    },
    "byMonth": [
      { "month": "2025-01", "reservations": 4 },
      { "month": "2024-12", "reservations": 2 },
      { "month": "2024-11", "reservations": 1 }
    ]
  }
}
```

#### Response Fields

| الحقل            | النوع   | الوصف                         |
| ---------------- | ------- | ----------------------------- |
| `total`          | integer | إجمالي الحجوزات               |
| `pending`        | integer | الحجوزات قيد الانتظار         |
| `accepted`       | integer | الحجوزات المقبولة             |
| `rejected`       | integer | الحجوزات المرفوضة             |
| `acceptanceRate` | integer | نسبة القبول (%)               |
| `totalRevenue`   | number  | إجمالي الإيرادات (من الدفعات) |
| `byType.rent`    | integer | عدد حجوزات الإيجار            |
| `byType.buy`     | integer | عدد حجوزات الشراء             |
| `byMonth`        | array   | عدد الحجوزات حسب الشهر        |

#### مثال الاستخدام (React)

```typescript
const fetchReservationsStats = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/reservations/stats");

    if (response.data.success && response.data.data) {
      setStats({
        total: response.data.data.total || 0,
        pending: response.data.data.pending || 0,
        accepted: response.data.data.accepted || 0,
        rejected: response.data.data.rejected || 0,
        acceptanceRate: response.data.data.acceptanceRate || 0,
        totalRevenue: response.data.data.totalRevenue || 0,
        byType: response.data.data.byType || { rent: 0, buy: 0 },
        byMonth: response.data.data.byMonth || [],
      });
    }
  } catch (err: any) {
    console.error("Error fetching stats:", err);
  }
};

// استخدام الإحصائيات في الواجهة
const stats = {
  total: 45,
  pending: 12,
  accepted: 28,
  rejected: 5,
  acceptanceRate: 85,
  totalRevenue: 420000,
};

// حساب نسبة القبول
const acceptanceRate =
  stats.accepted > 0
    ? Math.round((stats.accepted / (stats.accepted + stats.rejected)) * 100) ||
      0
    : 0;
```

---

### 8. تصدير CSV (Export CSV)

**Endpoint:** `GET /api/v1/reservations/export/csv`

#### الوصف

تصدير الحجوزات كملف CSV مع تطبيق نفس فلاتر البحث والترتيب المستخدمة في قائمة الحجوزات.

#### Authentication

```
Authorization: Bearer {access_token}
```

#### Query Parameters

نفس معاملات `GET /api/v1/reservations`:

- `status`: `pending`, `accepted`, `rejected`, `all`
- `type`: `rent`, `buy`, `all`
- `search`: نص البحث
- `sort_by`: `date`, `price`, `name`
- `sort_order`: `asc`, `desc`

#### Request Example

```
GET /api/v1/reservations/export/csv?status=pending&type=all
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Accept: text/csv
```

#### Response Headers

```
Content-Type: text/csv
Content-Disposition: attachment; filename="reservations-2025-01-13_153045.csv"
```

#### Response Body (CSV Format)

```csv
ID,Status,Type,Customer,Phone,Property,Address,Price,Requested At
1,pending,rent,أحمد محمد,+966501234567,فيلا فاخرة بحي النرجس,حي النرجس، الرياض,5000,2025-01-08 10:30:00
2,accepted,buy,فاطمة علي,+966502345678,شقة حديثة في الخليج,حي الخليج، جدة,850000,2025-01-07 14:15:00
```

#### مثال الاستخدام (React)

```typescript
const handleExport = async (format: "csv" | "pdf") => {
  if (format === "csv") {
    try {
      setLoading(true);
      setError(null);

      // بناء معاملات البحث والفلترة
      const params = new URLSearchParams();
      if (filterType !== "all") params.append("type", filterType);
      if (searchQuery) params.append("search", searchQuery);
      if (sortBy) params.append("sort_by", sortBy);
      if (sortOrder) params.append("sort_order", sortOrder);

      // جلب ملف CSV
      const response = await axiosInstance.get(
        `/api/v1/reservations/export/csv?${params.toString()}`,
        {
          responseType: "blob",
          headers: {
            Accept: "text/csv",
          },
        },
      );

      // التحقق من أن الاستجابة هي blob
      if (response.data instanceof Blob) {
        // الحصول على اسم الملف من headers أو استخدام اسم افتراضي
        const contentDisposition = response.headers["content-disposition"];
        let filename = `reservations-${new Date().toISOString().split("T")[0]}.csv`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
          );
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        // إنشاء رابط للتحميل
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // تنظيف
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error("استجابة غير صحيحة من الخادم");
      }
    } catch (err: any) {
      console.error("Error exporting reservations:", err);

      // معالجة الأخطاء
      if (err.response) {
        if (err.response.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = async () => {
            try {
              const text = reader.result as string;
              const errorData = JSON.parse(text);
              setError(errorData.message || "حدث خطأ أثناء تصدير الحجوزات");
            } catch {
              setError("حدث خطأ أثناء تصدير الحجوزات");
            }
          };
          reader.readAsText(err.response.data);
        } else {
          setError(
            err.response?.data?.message || "حدث خطأ أثناء تصدير الحجوزات",
          );
        }
      } else if (err.request) {
        setError("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت");
      } else {
        setError(err.message || "حدث خطأ أثناء تصدير الحجوزات");
      }
    } finally {
      setLoading(false);
    }
  }
};
```

---

## 🎨 Frontend Integration (التكامل مع الواجهة الأمامية)

### ملف المكون الرئيسي

`components/property-reservations-page.tsx`

### المكونات الرئيسية

#### 1. State Management

```typescript
const [reservations, setReservations] = useState<Reservation[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [stats, setStats] = useState({
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  acceptanceRate: 0,
  totalRevenue: 0,
  byType: { rent: 0, buy: 0 },
  byMonth: [] as Array<{ month: string; reservations: number }>,
});
```

#### 2. Filters & Search

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [filterType, setFilterType] = useState<"all" | "rent" | "buy">("all");
const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
```

#### 3. Create Reservation Form

```typescript
const [showCreatePopup, setShowCreatePopup] = useState(false);
const [createFormData, setCreateFormData] = useState({
  propertySlug: "",
  customerName: "",
  customerPhone: "",
  desiredDate: "",
  message: "",
});
```

### استخدام Tenant ID

```typescript
import { useTenantId } from "@/hooks/useTenantId";

const { tenantId } = useTenantId();

// استخدام tenantId في API calls
const response = await axiosInstance.post(
  `/api/v1/tenant-website/${tenantId}/reservations`,
  formData,
);
```

### استخدام axiosInstance

```typescript
import axiosInstance from "@/lib/axiosInstance";

// axiosInstance يضيف تلقائياً:
// - Authorization header (Bearer token)
// - Base URL
// - Error handling
```

---

## ⚠️ معالجة الأخطاء

### أنواع الأخطاء الشائعة

#### 1. 400 Bad Request

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": {
    "reservationIds": ["حقل الحجوزات مطلوب"]
  }
}
```

#### 2. 401 Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

**الحل**: إعادة تسجيل الدخول

#### 3. 403 Forbidden

```json
{
  "message": "This action is unauthorized."
}
```

**الحل**: التحقق من الصلاحيات

#### 4. 404 Not Found

```json
{
  "success": false,
  "message": "الحجز غير موجود"
}
```

**الحل**: التحقق من معرف الحجز

#### 5. 422 Validation Error

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "customerPhone": [
      "Invalid phone format. Use international format like +9665XXXXXXX"
    ]
  }
}
```

**الحل**: التحقق من البيانات المدخلة

#### 6. 429 Too Many Requests

```json
{
  "message": "Too Many Attempts."
}
```

**الحل**: الانتظار قبل إعادة المحاولة (Rate Limit: 5 req/min للـ Public API)

#### 7. 500 Internal Server Error

```json
{
  "success": false,
  "message": "حدث خطأ في الخادم"
}
```

**الحل**: التواصل مع الدعم الفني

---

## 🔄 Data Flow (تدفق البيانات)

### 1. إنشاء حجز (Create Reservation)

```
Client (Public)
  → POST /api/v1/tenant-website/{tenantId}/reservations
  → Backend validates & creates reservation
  → Response: { success: true, data: { id, status } }
```

### 2. عرض قائمة الحجوزات (List Reservations)

```
Dashboard Client
  → GET /api/v1/reservations?status=pending&type=rent
  → Backend fetches & filters reservations
  → Response: { success: true, data: { reservations, pagination, stats } }
```

### 3. قبول/رفض حجز (Accept/Reject)

```
Dashboard Client
  → POST /api/v1/reservations/{id}/accept
  → Backend updates reservation status
  → Backend creates timeline entry
  → Response: { success: true, data: { id, status, timeline } }
```

---

## 📁 ملفات الـ Frontend

### الملف الرئيسي

- `components/property-reservations-page.tsx` - الصفحة الرئيسية لإدارة الحجوزات

### الـ Hooks

- `hooks/useTenantId.ts` - للحصول على معرف المستأجر

### الـ API Instance

- `lib/axiosInstance.js` - axios instance مع المصادقة التلقائية

---

## 📝 ملاحظات مهمة

1. **Tenant Isolation**: كل tenant يرى فقط حجوزاته الخاصة (منفذ في Backend)
2. **Property Status**: فقط العقارات النشطة (`status = 1`) يمكن حجزها
3. **Type Derivation**: نوع الحجز (`rent`/`buy`) يُشتق تلقائياً من `property.purpose`
4. **Rate Limiting**: Public API محمي بـ 5 طلبات/دقيقة
5. **Timeline**: كل تغيير في حالة الحجز يُسجل في `timeline` في `metadata`
6. **Payment**: الدفعات (`deposit_amount`) اختيارية ويمكن تأكيدها عند القبول

---

## 🔗 روابط مفيدة

- **API Documentation**: `docs/ExcessFiles/FilesFromMyManager/Tenant-Website-Reservations-API.md`
- **HTTP Files**: `docs/ExcessFiles/FilesFromMyManager/frontend-reservations-apis/`
- **Component**: `components/property-reservations-page.tsx`

---

## 📅 آخر تحديث

2025-01-13
