# SMS Module – Backend Implementation Guide

This document describes the **full backend implementation** for the **SMS module** used on the frontend at `/ar/dashboard/sms-campaigns`: campaigns, templates, contacts, sending, logs, stats, and the **credit system** (charge per SMS, buy credits).

---

## Table of Contents

1. [Module Overview](#1-module-overview)
2. [Credit System (Balance & Purchase)](#2-credit-system-balance--purchase)
3. [Data Models & Storage](#3-data-models--storage)
4. [Campaigns API](#4-campaigns-api)
5. [Templates API](#5-templates-api)
6. [Contacts & Recipients](#6-contacts--recipients)
7. [Sending & Credit Deduction](#7-sending--credit-deduction)
8. [Logs & Delivery Status](#8-logs--delivery-status)
9. [Statistics API](#9-statistics-api)
10. [SMS Gateway Integration](#10-sms-gateway-integration)
11. [Security, Validation & Checklist](#11-security-validation--checklist)

---

## 1. Module Overview

### 1.1 Scope

| Area | Description |
|------|-------------|
| **Campaigns** | Create, list, get, update, delete; draft / scheduled / in-progress / sent; schedule for later or send now. |
| **Templates** | Reusable message templates with variables and categories (promotional, transactional, reminder, notification, follow-up). |
| **Contacts** | Recipients for campaigns (from CRM, segments, or manual list); optional subscription flag. |
| **Sending** | Send single SMS or campaign; check balance, deduct credits (1 per SMS), call SMS gateway. |
| **Logs** | Per-message delivery log (sent, delivered, failed, pending) for auditing and UI “سجل الإرسال”. |
| **Statistics** | Dashboard stats: total campaigns, total sent/delivered/failed, delivery rate, this month sent. |
| **Credits** | Same balance as marketing; 1 credit = 1 SMS; purchase packages via existing purchase API. |

### 1.2 Frontend Alignment

- **Tabs**: Overview, Campaigns, Templates, Logs.
- **Entities**: Campaigns (with status, recipient/sent/delivered/failed counts), Templates (content, variables, category), Logs (per-recipient status, message, timestamps).
- **Credit UI**: Balance card, “Buy credits” (packages + payment), cost per campaign (recipient count = credits), low-balance warning.

All APIs below assume **tenant (or user) scoping** via auth (e.g. Bearer token). Base path can be `/v1/sms/...` or your convention.

---

## 2. Credit System (Balance & Purchase)

The SMS module **reuses** the existing credit system; no separate “SMS balance” is required.

### 2.1 Endpoints Used by SMS Page

| Purpose | Method | Endpoint |
|---------|--------|----------|
| Get balance | GET | `/v1/credits/balance` |
| List packages | GET | `/v1/credits/packages?locale=ar` |
| Purchase credits | POST | `/v1/credits/purchase` |

### 2.2 Credit Model

- **1 credit = 1 SMS** (one message to one recipient).
- Balance is **tenant-scoped** and shared with other products (e.g. marketing channels).
- On **send** (single or campaign): check `available_credits >= required_credits`; if not, return **402** (or 400) and do not send. If OK, deduct and create a usage transaction, then send.

### 2.3 Balance Response (200)

```json
{
  "data": {
    "available_credits": 1250,
    "used_credits": 500,
    "monthly_limit": 0,
    "monthly_usage_percentage": 0,
    "average_cost_per_credit": "0.05"
  }
}
```

### 2.4 Purchase Request/Response

**Request**

```http
POST /v1/credits/purchase
Content-Type: application/json

{ "package_id": 1, "payment_method": "arb" }
```

**Response (200)**

```json
{
  "data": {
    "redirect_url": "https://payment-gateway.example/checkout/...",
    "transaction_id": 12345
  }
}
```

Payment callback on your backend should credit the tenant balance; next `GET /v1/credits/balance` will reflect it.

---

## 3. Data Models & Storage

Suggested persistence (tables/entities). Adjust to your stack (e.g. Laravel, Node, etc.).

### 3.1 Campaigns

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid / bigint | Primary key |
| `tenant_id` | — | Owner |
| `name` | string | Campaign name |
| `description` | string (nullable) | Optional description |
| `message` | text | Body (or template_id + variables) |
| `template_id` | FK (nullable) | Optional link to template |
| `status` | enum | `draft`, `scheduled`, `in_progress`, `sent` |
| `recipient_count` | int | Number of recipients |
| `sent_count` | int | Messages sent |
| `delivered_count` | int | Confirmed delivered |
| `failed_count` | int | Failed |
| `scheduled_at` | datetime (nullable) | When to send (if scheduled) |
| `sent_at` | datetime (nullable) | When send started/completed |
| `created_at`, `updated_at` | — | Timestamps |
| `created_by` | user_id | Creator |
| `tags` | json/array | Optional tags |

### 3.2 Templates

| Field | Type | Description |
|-------|------|-------------|
| `id` | uuid / bigint | Primary key |
| `tenant_id` | — | Owner |
| `name` | string | Template name |
| `content` | text | Body with placeholders e.g. `[name]`, `[price]` |
| `category` | enum | `promotional`, `transactional`, `reminder`, `notification`, `follow-up` |
| `variables` | json/array | e.g. `["name","price"]` |
| `is_active` | boolean | Whether available for use |
| `created_at`, `updated_at` | — | Timestamps |

### 3.3 Campaign Recipients (many-to-many or log)

Either store **campaign ↔ contact** at send time, or derive from a **segment/audience** definition. For logs you need at least:

- `campaign_id`, `contact_id` (or phone), `message` (final text), `status`, `sent_at`, `delivered_at`, `error_message`, etc.

### 3.4 Logs / Messages (per-recipient)

| Field | Type | Description |
|-------|------|-------------|
| `id` | — | Primary key |
| `tenant_id` | — | Owner |
| `campaign_id` | FK | Campaign |
| `contact_id` / `phone` | — | Recipient |
| `contact_name` | string (optional) | Display name |
| `message` | text | Message sent |
| `status` | enum | `pending`, `sent`, `delivered`, `failed` |
| `sent_at` | datetime | When sent to gateway |
| `delivered_at` | datetime (nullable) | When delivery confirmed (if gateway supports) |
| `error_message` | string (nullable) | Failure reason |
| `gateway_message_id` | string (nullable) | Provider reference |

### 3.5 Credit Transactions

Use existing **credit_transactions** (or equivalent). For SMS usage:

- `transaction_type`: e.g. `usage` or `sms_usage`
- `credits_amount`: negative (e.g. -100)
- `description`: e.g. "SMS campaign: {campaign_id}"
- `reference_type` / `reference_id`: e.g. `sms_campaign`, campaign id

---

## 4. Campaigns API

### 4.1 List campaigns

```http
GET /v1/sms/campaigns?status=draft|scheduled|sent|in_progress&per_page=20&page=1
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "data": [
    {
      "id": "uuid-or-id",
      "name": "عرض نهاية الأسبوع",
      "description": "حملة ترويجية",
      "message": "عرض خاص! خصم 20%...",
      "status": "sent",
      "recipient_count": 1250,
      "sent_count": 1250,
      "delivered_count": 1198,
      "failed_count": 52,
      "scheduled_at": null,
      "sent_at": "2025-02-01T10:00:00Z",
      "created_at": "2025-01-30T12:00:00Z",
      "created_by": "أحمد محمد",
      "tags": ["ترويج", "عقارات"]
    }
  ],
  "meta": { "current_page": 1, "per_page": 20, "total": 24 }
}
```

### 4.2 Get one campaign

```http
GET /v1/sms/campaigns/{id}
Authorization: Bearer <token>
```

Return single campaign object (same shape as list item).

### 4.3 Create campaign (draft)

```http
POST /v1/sms/campaigns
Content-Type: application/json

{
  "name": "حملة جديدة",
  "description": "اختياري",
  "message": "نص الرسالة",
  "recipient_ids": ["id1", "id2"],
  "segment_id": null,
  "tags": ["ترويج"],
  "schedule_at": null
}
```

- If `schedule_at` is set, set `status` to `scheduled`; else `draft`.
- `recipient_ids` or `segment_id` (or both) define audience; compute `recipient_count` and validate balance before sending (see [Section 7](#7-sending--credit-deduction)).

**Response (201)**  
Campaign object with `id`, `status`, `recipient_count`, etc.

### 4.4 Update campaign

```http
PATCH /v1/sms/campaigns/{id}
Content-Type: application/json

{
  "name": "اسم محدث",
  "message": "نص محدث",
  "recipient_ids": ["id1", "id2"],
  "schedule_at": "2025-02-10T09:00:00Z"
}
```

Only allow updates when `status` is `draft` or `scheduled` (and optionally cancel schedule).

### 4.5 Delete campaign

```http
DELETE /v1/sms/campaigns/{id}
```

Allow only for `draft` or `scheduled` (or soft-delete).

### 4.6 Send campaign (or schedule)

**Send now**

```http
POST /v1/sms/campaigns/{id}/send
Authorization: Bearer <token>
X-Idempotency-Key: optional-unique-key
```

- Validate campaign in `draft` or `scheduled`.
- Resolve recipients; `required_credits = recipient_count`.
- If `available_credits < required_credits` → **402** with message (e.g. "رصيد غير كافٍ").
- In a transaction: deduct credits, create usage transaction, set campaign `status = in_progress`, create log rows (e.g. `pending`).
- Enqueue jobs (or sync) to send via SMS gateway; update log status and campaign counts as results come back; set campaign `status = sent` when done.

**Schedule** is already covered by `schedule_at` on create/update; a cron job should pick campaigns where `status = scheduled` and `scheduled_at <= now` and perform the same send flow.

---

## 5. Templates API

### 5.1 List templates

```http
GET /v1/sms/templates?category=promotional|transactional|...&is_active=true&per_page=20&page=1
```

**Response (200)**

```json
{
  "data": [
    {
      "id": "uuid-or-id",
      "name": "ترحيب بالعميل الجديد",
      "content": "مرحباً [name]! نشكرك...",
      "category": "transactional",
      "variables": ["name"],
      "is_active": true,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

### 5.2 Get one template

```http
GET /v1/sms/templates/{id}
```

### 5.3 Create template

```http
POST /v1/sms/templates
Content-Type: application/json

{
  "name": "عرض عقار جديد",
  "content": "عقار جديد! [property] متاح بسعر [price] ريال.",
  "category": "promotional",
  "variables": ["property", "price"],
  "is_active": true
}
```

### 5.4 Update template

```http
PATCH /v1/sms/templates/{id}
```

Same body as create (partial OK).

### 5.5 Delete template (or deactivate)

```http
DELETE /v1/sms/templates/{id}
```

Either hard-delete or set `is_active = false`.

---

## 6. Contacts & Recipients

Recipients can come from:

- **CRM / existing contacts**: e.g. `GET /v1/crm/contacts` or internal `contacts` table with `phone`, `name`, optional `is_subscribed`.
- **Segment**: e.g. filter by tags, list id; backend returns list of contact ids or phones for a campaign.
- **Manual list**: campaign payload includes `recipient_ids` or `phones[]` with optional names.

For the SMS module you need at least:

- A way to **resolve recipients** for a campaign (list of `{ id, name, phone }`).
- Optional: **GET** `/v1/sms/contacts` or reuse CRM contacts with a filter (e.g. `?subscribed=1`) for “اختيار المستلمين” in the UI.

Example response shape for a “recipients for campaign” or “contacts” endpoint:

```json
{
  "data": [
    {
      "id": "contact-id",
      "name": "أحمد محمد",
      "phone": "+966501234567",
      "tags": ["مهتم", "رياض"],
      "is_subscribed": true
    }
  ]
}
```

---

## 7. Sending & Credit Deduction

### 7.1 Flow (campaign send)

1. Resolve **tenant** from auth.
2. Load campaign and **recipients**; compute `required_credits = count(recipients)` (or segment count).
3. **Check balance**: `available_credits = get_balance(tenant_id)`. If `available_credits < required_credits` → return **402** (or 400) with clear message.
4. **In one transaction**:
   - Decrement tenant balance by `required_credits`.
   - Insert credit transaction (type `sms_usage`, amount `-required_credits`, reference campaign id).
   - Set campaign `status = in_progress`, set `sent_count = 0`, etc.
   - Insert log rows per recipient with `status = pending` (or `sent` when actually sent).
5. **Send** messages (async jobs or sync): call SMS gateway per recipient; update log row (`sent` / `delivered` / `failed`, `delivered_at`, `error_message`); update campaign `sent_count`, `delivered_count`, `failed_count`.
6. When all processed, set campaign `status = sent`, `sent_at = now`.

**Idempotency**: Use `X-Idempotency-Key` on `POST .../send` and skip duplicate send (return 200 with same result) to avoid double deduction.

### 7.2 Single SMS (optional)

If you support “send one SMS” from the dashboard or API:

```http
POST /v1/sms/send
Content-Type: application/json

{
  "phone": "+966501234567",
  "message": "نص الرسالة"
}
```

Same rules: check balance >= 1, deduct 1 credit, create usage transaction, send, create one log row.

---

## 8. Logs & Delivery Status

### 8.1 List logs (سجل الإرسال)

```http
GET /v1/sms/logs?campaign_id=xxx&status=sent|delivered|failed|pending&per_page=20&page=1
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "data": [
    {
      "id": "log-id",
      "campaign_id": "campaign-uuid",
      "campaign_name": "عرض نهاية الأسبوع",
      "contact_id": "contact-id",
      "contact_name": "أحمد محمد",
      "phone": "+966501234567",
      "message": "عرض خاص! خصم 20%...",
      "status": "delivered",
      "sent_at": "2025-02-01T10:00:00Z",
      "delivered_at": "2025-02-01T10:00:30Z",
      "error_message": null
    }
  ],
  "meta": { "current_page": 1, "per_page": 20, "total": 1250 }
}
```

Optional: **GET** `/v1/sms/campaigns/{id}/logs` to restrict by campaign.

### 8.2 Delivery callbacks (gateway)

If your SMS provider supports delivery reports (DLR), expose a webhook and map provider status to `delivered` / `failed`; update the corresponding log row and campaign `delivered_count` / `failed_count`.

---

## 9. Statistics API

Dashboard overview uses aggregate stats.

```http
GET /v1/sms/stats
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "data": {
    "total_campaigns": 24,
    "total_sent": 15780,
    "total_delivered": 14952,
    "total_failed": 828,
    "delivery_rate": 94.8,
    "this_month_sent": 3420
  }
}
```

- `delivery_rate`: e.g. `(total_delivered / total_sent) * 100` when `total_sent > 0`.
- `this_month_sent`: sum of messages sent in current month (from logs or campaign aggregates).

---

## 10. SMS Gateway Integration

- Integrate with at least one **SMS provider** (e.g. Twilio, Unifonic, MSG, local KSA provider).
- **Send**: per-message API or batch; store `gateway_message_id` in logs for tracking and DLR.
- **Delivery reports**: webhook endpoint to receive status updates and set `delivered_at` / `status = delivered|failed`.
- **Sender ID**: configure allowed sender (e.g. alphanumeric or short code) per tenant or globally; validate in backend before sending.

---

## 11. Security, Validation & Checklist

### 11.1 Security

- All endpoints require **authentication**; scope by **tenant_id** (or user_id).
- Only the tenant that owns a campaign/template/log may access or send it.
- **Rate limiting** on send endpoints to avoid abuse.
- **Idempotency** on send and optionally on purchase to prevent double charges.

### 11.2 Validation

- Phone numbers: normalize and validate (e.g. E.164); reject invalid.
- Message length: enforce provider limit (e.g. 160 chars single segment) or count segments for future credit rules.
- Campaign: allow send only when `status` is `draft` or `scheduled`; prevent duplicate send with idempotency key.

### 11.3 Backend checklist

**Credits**

- [ ] `GET /v1/credits/balance` returns `available_credits` (used by SMS page).
- [ ] `GET /v1/credits/packages` and `POST /v1/credits/purchase` work; purchase callback credits balance.
- [ ] On send: check balance >= required credits; return 402 if insufficient.
- [ ] Deduct credits in a transaction; create usage transaction; then send.
- [ ] Concurrency-safe deduction (transactions/locking).

**Campaigns**

- [ ] CRUD: list, get, create, update, delete (with status rules).
- [ ] `POST /v1/sms/campaigns/{id}/send` (and scheduled send via cron) with full flow above.

**Templates**

- [ ] CRUD for templates; list filtered by category and `is_active`.

**Contacts / Recipients**

- [ ] Resolve recipients for a campaign (from segment, recipient_ids, or CRM).
- [ ] Optional: endpoint to list contacts for picker (or reuse CRM).

**Logs & Stats**

- [ ] `GET /v1/sms/logs` (and per-campaign logs) with status, dates, campaign_id.
- [ ] `GET /v1/sms/stats` with totals and delivery_rate, this_month_sent.

**Gateway**

- [ ] Integrate one SMS provider; send and optionally DLR webhook.

---

## Related Documentation

- **Credit packages (admin)**: `docs/backend/marketing/marketing/CREDIT_PACKAGES_SYSTEM.md`
- **Credits and marketing**: `docs/backend/CREDITS_WITH_MARKETING_CHANNELS_GUIDE.md`
- **Frontend SMS module**: `components/sms-campaigns/` (e.g. `SMSCampaignsPage.tsx`, `SMSCreditBalance.tsx`, `types.ts`)
