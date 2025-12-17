## Tenant Website Reservations API (Full Reference)

This document is the comprehensive reference for the Reservations feature across:

- Public Tenant Website endpoint (create reservation by property slug)
- Authenticated Dashboard APIs (list, show, accept/reject, bulk, stats, export)

It follows the style used by `Tenant Website Properties API`, under `/api/v1/tenant-website` for public endpoints and `/api/v1` for dashboard endpoints.

### Overview

- Public Base: `/api/v1/tenant-website/{tenantId}`
- Dashboard Base: `/api/v1`
- Public Middleware: `api`, `tenant.resolve`, `tenant.id.response`, `throttle:5,1`
- Dashboard Middleware: `auth:sanctum` (+ tenant context middlewares as configured)
- Scope:
  - Public: create reservation only
  - Dashboard: manage reservations (read, decisions, stats, export)
- Data sources:
  - `reservations` table
  - `user_properties` + `user_property_contents` (to resolve `slug` and display info)
- Visibility:
  - Only active properties (`status = 1`) of the tenant can be reserved
- Types/Statuses:
  - `type`: `rent` | `buy` (normalized from property purpose: `rent|rented` → `rent`, `sale|sold` → `buy`)
  - `status`: `pending` | `accepted` | `rejected`

### Data Model (simplified)

- `reservations`:
  - `id`: bigint
  - `tenant_id`: bigint → `users.id`
  - `property_id`: bigint → `user_properties.id`
  - `type`: `rent|buy`
  - `status`: `pending|accepted|rejected`
  - `customer_name`: string(100)
  - `customer_phone`: string(40) — recommended international format `+966...`
  - `desired_date`: date (nullable)
  - `notes`: text (nullable) — public field name: `message`
  - `deposit_amount`: decimal(12,2) (nullable)
  - `metadata`: json (nullable) — may include `ip`, `user_agent`, `property_slug`, `timeline` entries
  - `timestamps`

### Public Tenant Website Endpoint

1. POST `/api/v1/tenant-website/{tenantId}/reservations`

- Purpose: Create a reservation for a property identified by its slug
- Request body (JSON):

```json
{
  "propertySlug": "astdyo-mothth-hy-alaaard-rkm-19-1",
  "customerName": "أحمد محمد",
  "customerPhone": "+966501234567",
  "desiredDate": "2025-02-01",
  "message": "أرغب في المعاينة يوم السبت"
}
```

- Validation:
  - `propertySlug`: required, string, max 200
  - `customerName`: required, string, max 100
  - `customerPhone`: required, string, max 40, matches `/^\+?\d{7,15}$/`
  - `desiredDate`: optional, ISO date, `>= today`
  - `message`: optional, string, max 1000
- Behavior:
  - Resolves tenant by `{tenantId}`
  - Finds property by `slug` within tenant's active properties
  - Derives reservation `type` from property purpose
  - Creates `Reservation` with `status=pending`
  - Captures `ip` and `user_agent` in `metadata`
- Response (201):

```json
{
  "success": true,
  "data": { "id": "1", "status": "pending" }
}
```

- Errors:
  - 404 when property not found for slug/tenant
  - 422 for validation errors
  - 429 if rate-limited (`throttle:5,1`)

Example (curl):

```bash
curl -X POST "https://your-app.test/api/v1/tenant-website/{tenantId}/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "propertySlug": "astdyo-mothth-hy-alaaard-rkm-19-1",
    "customerName": "أحمد محمد",
    "customerPhone": "+966501234567",
    "desiredDate": "2025-02-01",
    "message": "أرغب في المعاينة يوم السبت"
  }'
```

### Dashboard Reservations API (Authenticated)

All endpoints require `Authorization: Bearer {access_token}` and enforce tenant isolation.

2. GET `/api/v1/reservations`

- Purpose: Retrieve all reservations with filtering, search, sorting, pagination; returns stats summary
- Query Parameters:
  - `status`: `pending|accepted|rejected|all` (default `all`)
  - `type`: `rent|buy|all` (default `all`)
  - `search`: matches customer name, property title/address, project name, building name
  - `sort_by`: `date|price|name` (default `date`)
  - `sort_order`: `asc|desc` (default `desc`)
  - `page`: default `1`
  - `per_page`: default `20`, max `100`
- Request Example:

```json
GET /api/v1/reservations?status=pending&type=rent&search=نرجس&sort_by=date&sort_order=desc&page=1&per_page=10
```

- Response Example (200 OK):

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

3. GET `/api/v1/reservations/{id}`

- Purpose: Get detailed information for a single reservation
- Request Example:

```json
GET /api/v1/reservations/res-001
```

- Response Example (200 OK):

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

4. POST `/api/v1/reservations/{id}/accept`

- Purpose: Accept a reservation
- Request Body:

```json
{
  "confirmPayment": true,
  "notes": "تم قبول الحجز بعد تأكيد الدفعة"
}
```

- Response Example (200 OK):

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

5. POST `/api/v1/reservations/{id}/reject`

- Purpose: Reject a reservation
- Request Body:

```json
{
  "reason": "السعر أعلى من ميزانية العميل"
}
```

- Response Example (200 OK):

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

6. POST `/api/v1/reservations/bulk-action`

- Purpose: Perform bulk actions on multiple reservations
- Request Body:

```json
{
  "action": "accept",
  "reservationIds": ["res-001", "res-002", "res-003"],
  "notes": "دفعة قبول جماعي"
}
```

- Response Example (200 OK):

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

7. GET `/api/v1/reservations/stats`

- Purpose: Get reservation statistics
- Response Example (200 OK):

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

8. GET `/api/v1/reservations/export/csv`

- Purpose: Export reservations as CSV (applies same filters as list)
- Query Parameters: same as GET `/api/v1/reservations`
- Response:
  - Content-Type: `text/csv`
  - Headers: `Content-Disposition: attachment; filename="reservations-YYYY-MM-DD_HHMMSS.csv"`
  - Body: CSV file
- Example:

```json
GET /api/v1/reservations/export/csv?status=pending&type=all
```

- CSV example (first line + one row):

```text
ID,Status,Type,Customer,Phone,Property,Address,Price,Requested At
1,pending,rent,أحمد محمد,+966501234567,فيلا فاخرة بحي النرجس,حي النرجس، الرياض,5000,2025-01-08 10:30:00
```

### Authentication and Security

- Public endpoint: no auth, protected with `throttle:5,1` rate limiting (5 req/min).
- Dashboard endpoints: require `Authorization: Bearer {access_token}` (Sanctum).
- Tenant isolation: enforced via policy; only the owning tenant can access their reservations.
- Property availability is NOT mutated by reservation decisions.
- No CAPTCHA enabled by default on the public endpoint (can be added later).

### Error Responses (common)

- 400 Bad Request:

```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": { "reservationIds": ["حقل الحجوزات مطلوب"] }
}
```

- 401 Unauthorized:

```json
{ "message": "Unauthenticated." }
```

- 403 Forbidden:

```json
{ "message": "This action is unauthorized." }
```

- 404 Not Found:

```json
{
  "success": false,
  "message": "الحجز غير موجود"
}
```

- 422 Validation Error:

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

- 429 Too Many Requests:

```json
{ "message": "Too Many Attempts." }
```

- 500 Internal Server Error:

```json
{
  "success": false,
  "message": "حدث خطأ في الخادم"
}
```

### Internal (Implementation Pointers)

- Public Controller: `app/Http/Controllers/Api/V1/TenantWebsite/ReservationController.php`
- Public Request: `app/Http/Requests/TenantWebsite/Reservation/StoreRequest.php`
- Dashboard Controller: `app/Http/Controllers/Api/V1/ReservationsController.php`
- Dashboard Requests:
  - `app/Http/Requests/Reservations/IndexRequest.php`
  - `app/Http/Requests/Reservations/DecisionRequest.php`
  - `app/Http/Requests/Reservations/BulkActionRequest.php`
- Model: `app/Models/Reservation.php`
- Policy: `app/Policies/ReservationPolicy.php`
- Migration: `database/migrations/2025_11_13_000001_create_reservations_table.php`
- Routes:
  - Public: `routes/api.php` under `v1/tenant-website`
  - Dashboard: `routes/api.php` under `v1` + `auth:sanctum`
