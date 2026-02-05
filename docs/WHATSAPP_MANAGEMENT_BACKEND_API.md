# WhatsApp Management Module - Backend API Documentation

A comprehensive backend implementation guide with API specifications, database schema, and request/response examples for the WhatsApp Management module.

## Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
  - [WhatsApp Numbers API](#1-whatsapp-numbers-api)
  - [Conversations API](#2-conversations-api)
  - [Messages API](#3-messages-api)
  - [Message Templates API](#4-message-templates-api)
  - [Automation Rules API](#5-automation-rules-api)
  - [AI Responder API](#6-ai-responder-api)
  - [Webhook Endpoints](#7-webhook-endpoints)
- [Error Responses](#error-responses)
- [Reference Tables](#reference-tables)

---

## Overview

### Base URL
```
https://api.yourapp.com/api/v1/whatsapp
```

### Authentication
All endpoints require Bearer token authentication:
```http
Authorization: Bearer <token>
```

### Response Format
All responses follow a consistent format:
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

---

## Database Schema

### SQL Schema (PostgreSQL)

```sql
-- =====================================================
-- WhatsApp Numbers Table
-- =====================================================
CREATE TABLE whatsapp_numbers (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, pending
    employee_id INTEGER REFERENCES employees(id),
    quota_used INTEGER DEFAULT 0,
    quota_limit INTEGER DEFAULT 5000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Conversations Table
-- =====================================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    whatsapp_number_id INTEGER NOT NULL REFERENCES whatsapp_numbers(id),
    last_message TEXT,
    last_message_time TIMESTAMP,
    unread_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, pending, resolved
    is_starred BOOLEAN DEFAULT FALSE,
    assigned_agent_id INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_whatsapp_number ON conversations(whatsapp_number_id);
CREATE INDEX idx_conversations_customer ON conversations(customer_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_last_message_time ON conversations(last_message_time DESC);

-- =====================================================
-- Messages Table
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL, -- customer, agent, system, ai
    sender_name VARCHAR(100),
    sender_id UUID,
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, failed
    whatsapp_message_id VARCHAR(100), -- WhatsApp API message ID
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- =====================================================
-- Message Attachments Table
-- =====================================================
CREATE TABLE message_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- image, video, document, audio
    url TEXT NOT NULL,
    name VARCHAR(255),
    size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_message ON message_attachments(message_id);

-- =====================================================
-- Message Templates Table
-- =====================================================
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_category ON message_templates(category);
CREATE INDEX idx_templates_active ON message_templates(is_active);

-- =====================================================
-- Automation Rules Table
-- =====================================================
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    trigger VARCHAR(50) NOT NULL, -- new_inquiry, no_response_24h, etc.
    delay_minutes INTEGER DEFAULT 0,
    template_id UUID REFERENCES message_templates(id),
    is_active BOOLEAN DEFAULT TRUE,
    whatsapp_number_id INTEGER REFERENCES whatsapp_numbers(id), -- NULL = all numbers
    triggered_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    last_triggered TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_automation_rules_trigger ON automation_rules(trigger);
CREATE INDEX idx_automation_rules_active ON automation_rules(is_active);
CREATE INDEX idx_automation_rules_number ON automation_rules(whatsapp_number_id);

-- =====================================================
-- AI Responder Config Table
-- =====================================================
CREATE TABLE ai_responder_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number_id INTEGER NOT NULL UNIQUE REFERENCES whatsapp_numbers(id),
    enabled BOOLEAN DEFAULT FALSE,
    business_hours_only BOOLEAN DEFAULT FALSE,
    business_hours_start TIME,
    business_hours_end TIME,
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    scenarios JSONB DEFAULT '{
        "initialGreeting": false,
        "faqResponses": false,
        "propertyInquiryResponse": false,
        "appointmentBooking": false,
        "generalQuestions": false
    }',
    tone VARCHAR(20) DEFAULT 'friendly', -- formal, friendly, professional
    language VARCHAR(10) DEFAULT 'ar', -- ar, en, both
    custom_instructions TEXT,
    fallback_to_human BOOLEAN DEFAULT TRUE,
    fallback_delay INTEGER DEFAULT 5, -- minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI Response Logs Table (for analytics)
-- =====================================================
CREATE TABLE ai_response_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number_id INTEGER NOT NULL REFERENCES whatsapp_numbers(id),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    message_id UUID NOT NULL REFERENCES messages(id),
    scenario VARCHAR(50),
    response_time_ms INTEGER,
    handed_off BOOLEAN DEFAULT FALSE,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_logs_number ON ai_response_logs(whatsapp_number_id);
CREATE INDEX idx_ai_logs_created_at ON ai_response_logs(created_at);

-- =====================================================
-- Property Interests Table (conversation context)
-- =====================================================
CREATE TABLE conversation_property_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id),
    status VARCHAR(30) DEFAULT 'interested', -- interested, viewing_scheduled, offer_made, not_interested
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, property_id)
);

CREATE INDEX idx_property_interests_conversation ON conversation_property_interests(conversation_id);
```

---

## API Endpoints

---

## 1. WhatsApp Numbers API

### GET /numbers
Get all WhatsApp numbers for the organization.

**Request:**
```http
GET /api/v1/whatsapp/numbers
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "phoneNumber": "+966501234567",
      "name": "المبيعات الرئيسي",
      "status": "active",
      "employee": {
        "id": 101,
        "name": "أحمد محمد",
        "email": "ahmed@company.com"
      },
      "quotaUsed": 1250,
      "quotaLimit": 5000,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    },
    {
      "id": 2,
      "phoneNumber": "+966507654321",
      "name": "خدمة العملاء",
      "status": "active",
      "employee": null,
      "quotaUsed": 890,
      "quotaLimit": 5000,
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-01-10T08:00:00Z"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

---

### GET /numbers/:id
Get a specific WhatsApp number with detailed information.

**Request:**
```http
GET /api/v1/whatsapp/numbers/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phoneNumber": "+966501234567",
    "name": "المبيعات الرئيسي",
    "status": "active",
    "employee": {
      "id": 101,
      "name": "أحمد محمد",
      "email": "ahmed@company.com",
      "avatar": "https://api.example.com/avatars/101.jpg"
    },
    "quotaUsed": 1250,
    "quotaLimit": 5000,
    "stats": {
      "totalConversations": 156,
      "activeConversations": 23,
      "messagesThisMonth": 1250
    },
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

---

### POST /numbers
Register a new WhatsApp number.

**Request:**
```http
POST /api/v1/whatsapp/numbers
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "+966509876543",
  "name": "فريق المبيعات الثاني",
  "employeeId": 102
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "phoneNumber": "+966509876543",
    "name": "فريق المبيعات الثاني",
    "status": "pending",
    "employee": {
      "id": 102,
      "name": "سارة أحمد",
      "email": "sara@company.com"
    },
    "quotaUsed": 0,
    "quotaLimit": 5000,
    "createdAt": "2024-01-20T18:00:00Z",
    "updatedAt": "2024-01-20T18:00:00Z"
  }
}
```

---

### PUT /numbers/:id
Update a WhatsApp number.

**Request:**
```http
PUT /api/v1/whatsapp/numbers/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "المبيعات - الرياض",
  "employeeId": 103,
  "status": "active"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "phoneNumber": "+966501234567",
    "name": "المبيعات - الرياض",
    "status": "active",
    "employee": {
      "id": 103,
      "name": "خالد العمري",
      "email": "khaled@company.com"
    },
    "updatedAt": "2024-01-20T19:00:00Z"
  }
}
```

---

## 2. Conversations API

### GET /conversations
Get conversations with filtering, search, and pagination.

**Request:**
```http
GET /api/v1/whatsapp/conversations?numberId=1&status=active&search=محمد&page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numberId` | number | No | Filter by WhatsApp number ID |
| `status` | string | No | Filter by status: `all`, `active`, `pending`, `resolved` |
| `starred` | boolean | No | Filter starred conversations only |
| `unread` | boolean | No | Filter unread conversations only |
| `search` | string | No | Search in customer name, phone, or message content |
| `assignedAgentId` | string | No | Filter by assigned agent |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 20, max: 100) |
| `sortBy` | string | No | Sort field: `lastMessageTime`, `unreadCount`, `customerName` |
| `sortOrder` | string | No | Sort order: `asc`, `desc` (default: `desc`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-001",
      "customerId": "cust-001",
      "customerName": "محمد أحمد",
      "customerPhone": "+966512345678",
      "customerAvatar": "https://api.example.com/avatars/cust-001.jpg",
      "whatsappNumberId": 1,
      "lastMessage": "نعم، أود حجز موعد لمعاينة الشقة",
      "lastMessageTime": "2024-01-20T15:30:00Z",
      "unreadCount": 2,
      "status": "active",
      "isStarred": true,
      "assignedAgent": {
        "id": "agent-001",
        "name": "أحمد محمد",
        "avatar": "https://api.example.com/avatars/agent-001.jpg"
      },
      "propertyInterests": [
        {
          "id": "pi-001",
          "propertyName": "شقة فاخرة في الرياض",
          "propertyType": "apartment",
          "location": "حي النرجس، الرياض",
          "price": 1500000,
          "status": "viewing_scheduled"
        }
      ],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T15:30:00Z"
    },
    {
      "id": "conv-002",
      "customerId": "cust-002",
      "customerName": "فاطمة السعيد",
      "customerPhone": "+966523456789",
      "customerAvatar": null,
      "whatsappNumberId": 1,
      "lastMessage": "شكراً لكم، سأفكر في العرض",
      "lastMessageTime": "2024-01-20T14:00:00Z",
      "unreadCount": 0,
      "status": "pending",
      "isStarred": false,
      "assignedAgent": null,
      "propertyInterests": [],
      "createdAt": "2024-01-18T09:00:00Z",
      "updatedAt": "2024-01-20T14:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### GET /conversations/:id
Get a specific conversation with full details.

**Request:**
```http
GET /api/v1/whatsapp/conversations/conv-001
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-001",
    "customerId": "cust-001",
    "customerName": "محمد أحمد",
    "customerPhone": "+966512345678",
    "customerAvatar": "https://api.example.com/avatars/cust-001.jpg",
    "customerEmail": "mohammed@email.com",
    "whatsappNumberId": 1,
    "whatsappNumber": {
      "id": 1,
      "phoneNumber": "+966501234567",
      "name": "المبيعات الرئيسي"
    },
    "lastMessage": "نعم، أود حجز موعد لمعاينة الشقة",
    "lastMessageTime": "2024-01-20T15:30:00Z",
    "unreadCount": 2,
    "status": "active",
    "isStarred": true,
    "assignedAgent": {
      "id": "agent-001",
      "name": "أحمد محمد",
      "email": "ahmed@company.com",
      "avatar": "https://api.example.com/avatars/agent-001.jpg"
    },
    "propertyInterests": [
      {
        "id": "pi-001",
        "propertyId": "prop-001",
        "propertyName": "شقة فاخرة في الرياض",
        "propertyType": "apartment",
        "location": "حي النرجس، الرياض",
        "price": 1500000,
        "status": "viewing_scheduled",
        "propertyImage": "https://api.example.com/properties/prop-001/main.jpg"
      }
    ],
    "tags": ["VIP", "مهتم بالشراء"],
    "notes": "عميل جاد، يبحث عن شقة 3 غرف",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

---

### POST /conversations
Create a new conversation (initiate contact with customer).

**Request:**
```http
POST /api/v1/whatsapp/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "cust-003",
  "whatsappNumberId": 1,
  "initialMessage": "مرحباً، نود إعلامكم بعقار جديد يطابق متطلباتكم"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "conv-003",
    "customerId": "cust-003",
    "customerName": "عبدالله الشهري",
    "customerPhone": "+966534567890",
    "whatsappNumberId": 1,
    "lastMessage": "مرحباً، نود إعلامكم بعقار جديد يطابق متطلباتكم",
    "lastMessageTime": "2024-01-20T19:00:00Z",
    "unreadCount": 0,
    "status": "active",
    "isStarred": false,
    "createdAt": "2024-01-20T19:00:00Z",
    "updatedAt": "2024-01-20T19:00:00Z"
  }
}
```

---

### PATCH /conversations/:id
Update conversation properties (status, star, assignment).

**Request:**
```http
PATCH /api/v1/whatsapp/conversations/conv-001
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "resolved",
  "isStarred": true,
  "assignedAgentId": "agent-002",
  "notes": "تم إتمام الصفقة بنجاح"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-001",
    "status": "resolved",
    "isStarred": true,
    "assignedAgent": {
      "id": "agent-002",
      "name": "فهد السعيد",
      "avatar": "https://api.example.com/avatars/agent-002.jpg"
    },
    "notes": "تم إتمام الصفقة بنجاح",
    "updatedAt": "2024-01-20T20:00:00Z"
  }
}
```

---

### POST /conversations/:id/read
Mark all messages in conversation as read.

**Request:**
```http
POST /api/v1/whatsapp/conversations/conv-001/read
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-001",
    "unreadCount": 0,
    "updatedAt": "2024-01-20T20:05:00Z"
  }
}
```

---

### POST /conversations/:id/star
Toggle conversation star status.

**Request:**
```http
POST /api/v1/whatsapp/conversations/conv-001/star
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "conv-001",
    "isStarred": true,
    "updatedAt": "2024-01-20T20:10:00Z"
  }
}
```

---

## 3. Messages API

### GET /conversations/:id/messages
Get messages for a conversation with pagination.

**Request:**
```http
GET /api/v1/whatsapp/conversations/conv-001/messages?page=1&limit=50
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 50, max: 100) |
| `before` | string | No | Get messages before this timestamp (for infinite scroll) |
| `after` | string | No | Get messages after this timestamp (for real-time updates) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg-001",
      "conversationId": "conv-001",
      "content": "السلام عليكم، أبحث عن شقة في حي النرجس",
      "sender": "customer",
      "senderName": "محمد أحمد",
      "timestamp": "2024-01-20T14:00:00Z",
      "status": "read",
      "attachments": []
    },
    {
      "id": "msg-002",
      "conversationId": "conv-001",
      "content": "وعليكم السلام! أهلاً بك. لدينا عدة خيارات متاحة في حي النرجس. ما هي ميزانيتك المتوقعة؟",
      "sender": "agent",
      "senderName": "أحمد محمد",
      "timestamp": "2024-01-20T14:05:00Z",
      "status": "read",
      "attachments": []
    },
    {
      "id": "msg-003",
      "conversationId": "conv-001",
      "content": "ميزانيتي حوالي 1.5 مليون ريال",
      "sender": "customer",
      "senderName": "محمد أحمد",
      "timestamp": "2024-01-20T14:10:00Z",
      "status": "read",
      "attachments": []
    },
    {
      "id": "msg-004",
      "conversationId": "conv-001",
      "content": "ممتاز! لدينا شقة فاخرة تناسب ميزانيتك. إليك بعض الصور:",
      "sender": "agent",
      "senderName": "أحمد محمد",
      "timestamp": "2024-01-20T14:15:00Z",
      "status": "read",
      "attachments": [
        {
          "id": "att-001",
          "type": "image",
          "url": "https://api.example.com/attachments/property-001-1.jpg",
          "name": "شقة-النرجس-1.jpg",
          "size": 245678,
          "mimeType": "image/jpeg"
        },
        {
          "id": "att-002",
          "type": "image",
          "url": "https://api.example.com/attachments/property-001-2.jpg",
          "name": "شقة-النرجس-2.jpg",
          "size": 198432,
          "mimeType": "image/jpeg"
        }
      ]
    },
    {
      "id": "msg-005",
      "conversationId": "conv-001",
      "content": "الشقة جميلة جداً! ما هي مساحتها؟",
      "sender": "customer",
      "senderName": "محمد أحمد",
      "timestamp": "2024-01-20T14:30:00Z",
      "status": "read",
      "attachments": []
    },
    {
      "id": "msg-006",
      "conversationId": "conv-001",
      "content": "مساحتها 180 متر مربع، 3 غرف نوم، 2 حمام، صالة كبيرة، ومطبخ مجهز. هل تود حجز موعد للمعاينة؟",
      "sender": "ai",
      "senderName": "المساعد الذكي",
      "timestamp": "2024-01-20T14:31:00Z",
      "status": "read",
      "attachments": []
    },
    {
      "id": "msg-007",
      "conversationId": "conv-001",
      "content": "نعم، أود حجز موعد لمعاينة الشقة",
      "sender": "customer",
      "senderName": "محمد أحمد",
      "timestamp": "2024-01-20T15:30:00Z",
      "status": "delivered",
      "attachments": []
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 7,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

### POST /conversations/:id/messages
Send a new message to the conversation.

**Request (Text Message):**
```http
POST /api/v1/whatsapp/conversations/conv-001/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "تم حجز الموعد ليوم الأحد الساعة 4 مساءً. العنوان: حي النرجس، شارع الأمير سلطان، مبنى رقم 45"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "msg-008",
    "conversationId": "conv-001",
    "content": "تم حجز الموعد ليوم الأحد الساعة 4 مساءً. العنوان: حي النرجس، شارع الأمير سلطان، مبنى رقم 45",
    "sender": "agent",
    "senderName": "أحمد محمد",
    "timestamp": "2024-01-20T16:00:00Z",
    "status": "sent",
    "attachments": []
  }
}
```

---

**Request (Message with Attachments):**
```http
POST /api/v1/whatsapp/conversations/conv-001/messages
Authorization: Bearer <token>
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="content"

إليك موقع العقار على الخريطة:
------WebKitFormBoundary
Content-Disposition: form-data; name="attachments"; filename="location-map.pdf"
Content-Type: application/pdf

<binary data>
------WebKitFormBoundary--
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "msg-009",
    "conversationId": "conv-001",
    "content": "إليك موقع العقار على الخريطة:",
    "sender": "agent",
    "senderName": "أحمد محمد",
    "timestamp": "2024-01-20T16:05:00Z",
    "status": "sent",
    "attachments": [
      {
        "id": "att-003",
        "type": "document",
        "url": "https://api.example.com/attachments/location-map.pdf",
        "name": "location-map.pdf",
        "size": 125000,
        "mimeType": "application/pdf"
      }
    ]
  }
}
```

---

### POST /conversations/:id/messages/template
Send a message using a template.

**Request:**
```http
POST /api/v1/whatsapp/conversations/conv-001/messages/template
Authorization: Bearer <token>
Content-Type: application/json

{
  "templateId": "tpl-002",
  "variables": {
    "customer_name": "محمد أحمد",
    "appointment_date": "الأحد 25 يناير",
    "appointment_time": "4:00 مساءً",
    "property_name": "شقة فاخرة في حي النرجس"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "msg-010",
    "conversationId": "conv-001",
    "content": "مرحباً محمد أحمد، نود تذكيرك بموعدك يوم الأحد 25 يناير الساعة 4:00 مساءً لمعاينة شقة فاخرة في حي النرجس. هل يناسبك الموعد؟",
    "sender": "agent",
    "senderName": "أحمد محمد",
    "timestamp": "2024-01-20T16:10:00Z",
    "status": "sent",
    "templateId": "tpl-002",
    "attachments": []
  }
}
```

---

## 4. Message Templates API

### GET /templates
Get all message templates with optional filtering.

**Request:**
```http
GET /api/v1/whatsapp/templates?category=greeting&isActive=true
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by category |
| `isActive` | boolean | No | Filter by active status |
| `search` | string | No | Search in name or content |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "tpl-001",
      "name": "ترحيب العميل الجديد",
      "content": "أهلاً وسهلاً {{customer_name}}! نشكرك على تواصلك معنا. كيف يمكننا مساعدتك اليوم؟",
      "category": "greeting",
      "variables": ["customer_name"],
      "isActive": true,
      "usageCount": 256,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "tpl-002",
      "name": "تأكيد الموعد",
      "content": "مرحباً {{customer_name}}، نود تذكيرك بموعدك يوم {{appointment_date}} الساعة {{appointment_time}} لمعاينة {{property_name}}. هل يناسبك الموعد؟",
      "category": "appointment",
      "variables": ["customer_name", "appointment_date", "appointment_time", "property_name"],
      "isActive": true,
      "usageCount": 128,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-10T08:00:00Z"
    },
    {
      "id": "tpl-003",
      "name": "عقار جديد مطابق",
      "content": "مرحباً {{customer_name}}! لدينا عقار جديد يطابق متطلباتك:\n\n🏠 {{property_name}}\n📍 {{location}}\n💰 {{price}} ريال\n\nهل تود معرفة المزيد من التفاصيل؟",
      "category": "property",
      "variables": ["customer_name", "property_name", "location", "price"],
      "isActive": true,
      "usageCount": 89,
      "createdAt": "2024-01-05T00:00:00Z",
      "updatedAt": "2024-01-05T00:00:00Z"
    },
    {
      "id": "tpl-004",
      "name": "متابعة عدم الرد",
      "content": "مرحباً {{customer_name}}، لاحظنا أنك لم تتمكن من الرد. هل هناك أي شيء يمكننا مساعدتك به؟ نحن هنا لخدمتك.",
      "category": "follow_up",
      "variables": ["customer_name"],
      "isActive": true,
      "usageCount": 67,
      "createdAt": "2024-01-03T00:00:00Z",
      "updatedAt": "2024-01-03T00:00:00Z"
    },
    {
      "id": "tpl-005",
      "name": "شكراً على الزيارة",
      "content": "شكراً {{customer_name}} على زيارتك لمعاينة {{property_name}}. نتمنى أن تكون قد أعجبتك. هل لديك أي استفسارات؟",
      "category": "follow_up",
      "variables": ["customer_name", "property_name"],
      "isActive": true,
      "usageCount": 45,
      "createdAt": "2024-01-07T00:00:00Z",
      "updatedAt": "2024-01-07T00:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "categories": ["greeting", "appointment", "property", "follow_up"]
  }
}
```

---

### GET /templates/:id
Get a specific template.

**Request:**
```http
GET /api/v1/whatsapp/templates/tpl-001
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "tpl-001",
    "name": "ترحيب العميل الجديد",
    "content": "أهلاً وسهلاً {{customer_name}}! نشكرك على تواصلك معنا. كيف يمكننا مساعدتك اليوم؟",
    "category": "greeting",
    "variables": ["customer_name"],
    "isActive": true,
    "usageCount": 256,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### POST /templates
Create a new message template.

**Request:**
```http
POST /api/v1/whatsapp/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "عرض خاص",
  "content": "مرحباً {{customer_name}}! 🎉\n\nلدينا عرض خاص لك:\n{{offer_details}}\n\nالعرض ساري حتى {{expiry_date}}.\n\nتواصل معنا الآن للاستفادة!",
  "category": "promotion",
  "variables": ["customer_name", "offer_details", "expiry_date"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "tpl-006",
    "name": "عرض خاص",
    "content": "مرحباً {{customer_name}}! 🎉\n\nلدينا عرض خاص لك:\n{{offer_details}}\n\nالعرض ساري حتى {{expiry_date}}.\n\nتواصل معنا الآن للاستفادة!",
    "category": "promotion",
    "variables": ["customer_name", "offer_details", "expiry_date"],
    "isActive": true,
    "usageCount": 0,
    "createdAt": "2024-01-20T17:00:00Z",
    "updatedAt": "2024-01-20T17:00:00Z"
  }
}
```

---

### PUT /templates/:id
Update a message template.

**Request:**
```http
PUT /api/v1/whatsapp/templates/tpl-006
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "عرض خاص - محدث",
  "content": "مرحباً {{customer_name}}! 🎁\n\nعرض حصري لك:\n{{offer_details}}\n\n⏰ ينتهي: {{expiry_date}}\n\nاتصل الآن: {{contact_number}}",
  "variables": ["customer_name", "offer_details", "expiry_date", "contact_number"],
  "isActive": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "tpl-006",
    "name": "عرض خاص - محدث",
    "content": "مرحباً {{customer_name}}! 🎁\n\nعرض حصري لك:\n{{offer_details}}\n\n⏰ ينتهي: {{expiry_date}}\n\nاتصل الآن: {{contact_number}}",
    "category": "promotion",
    "variables": ["customer_name", "offer_details", "expiry_date", "contact_number"],
    "isActive": true,
    "usageCount": 0,
    "createdAt": "2024-01-20T17:00:00Z",
    "updatedAt": "2024-01-20T18:00:00Z"
  }
}
```

---

### DELETE /templates/:id
Delete a message template.

**Request:**
```http
DELETE /api/v1/whatsapp/templates/tpl-006
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

---

## 5. Automation Rules API

### GET /automation/rules
Get all automation rules with optional filtering.

**Request:**
```http
GET /api/v1/whatsapp/automation/rules?numberId=1&isActive=true
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numberId` | number | No | Filter by WhatsApp number ID (null = global rules) |
| `isActive` | boolean | No | Filter by active status |
| `trigger` | string | No | Filter by trigger type |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "rule-001",
      "name": "رد تلقائي للاستفسارات الجديدة",
      "description": "إرسال رسالة ترحيب تلقائية عند استلام استفسار جديد",
      "trigger": "new_inquiry",
      "delayMinutes": 1,
      "templateId": "tpl-001",
      "template": {
        "id": "tpl-001",
        "name": "ترحيب العميل الجديد",
        "content": "أهلاً وسهلاً {{customer_name}}! نشكرك على تواصلك معنا. كيف يمكننا مساعدتك اليوم؟"
      },
      "isActive": true,
      "whatsappNumberId": null,
      "triggeredCount": 156,
      "successCount": 154,
      "lastTriggered": "2024-01-20T15:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-20T15:00:00Z"
    },
    {
      "id": "rule-002",
      "name": "متابعة عدم الرد - 24 ساعة",
      "description": "إرسال رسالة متابعة في حال عدم الرد خلال 24 ساعة",
      "trigger": "no_response_24h",
      "delayMinutes": 1440,
      "templateId": "tpl-004",
      "template": {
        "id": "tpl-004",
        "name": "متابعة عدم الرد",
        "content": "مرحباً {{customer_name}}، لاحظنا أنك لم تتمكن من الرد. هل هناك أي شيء يمكننا مساعدتك به؟"
      },
      "isActive": true,
      "whatsappNumberId": 1,
      "triggeredCount": 45,
      "successCount": 44,
      "lastTriggered": "2024-01-20T10:00:00Z",
      "createdAt": "2024-01-05T00:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    },
    {
      "id": "rule-003",
      "name": "تذكير الموعد",
      "description": "إرسال تذكير قبل الموعد بـ 24 ساعة",
      "trigger": "appointment_reminder",
      "delayMinutes": -1440,
      "templateId": "tpl-002",
      "template": {
        "id": "tpl-002",
        "name": "تأكيد الموعد",
        "content": "مرحباً {{customer_name}}، نود تذكيرك بموعدك يوم {{appointment_date}} الساعة {{appointment_time}}"
      },
      "isActive": true,
      "whatsappNumberId": null,
      "triggeredCount": 89,
      "successCount": 89,
      "lastTriggered": "2024-01-20T08:00:00Z",
      "createdAt": "2024-01-03T00:00:00Z",
      "updatedAt": "2024-01-20T08:00:00Z"
    },
    {
      "id": "rule-004",
      "name": "متابعة بعد المعاينة",
      "description": "إرسال رسالة متابعة بعد 24 ساعة من المعاينة",
      "trigger": "follow_up",
      "delayMinutes": 1440,
      "templateId": "tpl-005",
      "template": {
        "id": "tpl-005",
        "name": "شكراً على الزيارة",
        "content": "شكراً {{customer_name}} على زيارتك لمعاينة {{property_name}}..."
      },
      "isActive": true,
      "whatsappNumberId": null,
      "triggeredCount": 34,
      "successCount": 34,
      "lastTriggered": "2024-01-19T14:00:00Z",
      "createdAt": "2024-01-07T00:00:00Z",
      "updatedAt": "2024-01-19T14:00:00Z"
    },
    {
      "id": "rule-005",
      "name": "إشعار عقار مطابق",
      "description": "إرسال إشعار عند إضافة عقار جديد يطابق تفضيلات العميل",
      "trigger": "property_match",
      "delayMinutes": 5,
      "templateId": "tpl-003",
      "template": {
        "id": "tpl-003",
        "name": "عقار جديد مطابق",
        "content": "مرحباً {{customer_name}}! لدينا عقار جديد يطابق متطلباتك..."
      },
      "isActive": false,
      "whatsappNumberId": null,
      "triggeredCount": 12,
      "successCount": 12,
      "lastTriggered": "2024-01-15T11:00:00Z",
      "createdAt": "2024-01-10T00:00:00Z",
      "updatedAt": "2024-01-15T11:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "activeCount": 4,
    "inactiveCount": 1
  }
}
```

---

### GET /automation/rules/:id
Get a specific automation rule.

**Request:**
```http
GET /api/v1/whatsapp/automation/rules/rule-001
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "rule-001",
    "name": "رد تلقائي للاستفسارات الجديدة",
    "description": "إرسال رسالة ترحيب تلقائية عند استلام استفسار جديد",
    "trigger": "new_inquiry",
    "delayMinutes": 1,
    "templateId": "tpl-001",
    "template": {
      "id": "tpl-001",
      "name": "ترحيب العميل الجديد",
      "content": "أهلاً وسهلاً {{customer_name}}! نشكرك على تواصلك معنا. كيف يمكننا مساعدتك اليوم؟",
      "variables": ["customer_name"]
    },
    "isActive": true,
    "whatsappNumberId": null,
    "triggeredCount": 156,
    "successCount": 154,
    "lastTriggered": "2024-01-20T15:00:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-20T15:00:00Z"
  }
}
```

---

### POST /automation/rules
Create a new automation rule.

**Request:**
```http
POST /api/v1/whatsapp/automation/rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "إشعار تغيير السعر",
  "description": "إرسال إشعار للعملاء المهتمين عند تغيير سعر العقار",
  "trigger": "price_change",
  "delayMinutes": 5,
  "templateId": "tpl-003",
  "isActive": true,
  "whatsappNumberId": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "rule-006",
    "name": "إشعار تغيير السعر",
    "description": "إرسال إشعار للعملاء المهتمين عند تغيير سعر العقار",
    "trigger": "price_change",
    "delayMinutes": 5,
    "templateId": "tpl-003",
    "template": {
      "id": "tpl-003",
      "name": "عقار جديد مطابق",
      "content": "مرحباً {{customer_name}}! لدينا عقار جديد يطابق متطلباتك..."
    },
    "isActive": true,
    "whatsappNumberId": 1,
    "triggeredCount": 0,
    "successCount": 0,
    "lastTriggered": null,
    "createdAt": "2024-01-20T19:00:00Z",
    "updatedAt": "2024-01-20T19:00:00Z"
  }
}
```

---

### PUT /automation/rules/:id
Update an automation rule.

**Request:**
```http
PUT /api/v1/whatsapp/automation/rules/rule-006
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "إشعار تغيير السعر - محدث",
  "delayMinutes": 10,
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "rule-006",
    "name": "إشعار تغيير السعر - محدث",
    "description": "إرسال إشعار للعملاء المهتمين عند تغيير سعر العقار",
    "trigger": "price_change",
    "delayMinutes": 10,
    "templateId": "tpl-003",
    "isActive": false,
    "whatsappNumberId": 1,
    "triggeredCount": 0,
    "successCount": 0,
    "lastTriggered": null,
    "createdAt": "2024-01-20T19:00:00Z",
    "updatedAt": "2024-01-20T19:30:00Z"
  }
}
```

---

### PATCH /automation/rules/:id/toggle
Toggle automation rule active status.

**Request:**
```http
PATCH /api/v1/whatsapp/automation/rules/rule-006/toggle
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "rule-006",
    "isActive": true,
    "updatedAt": "2024-01-20T19:45:00Z"
  }
}
```

---

### DELETE /automation/rules/:id
Delete an automation rule.

**Request:**
```http
DELETE /api/v1/whatsapp/automation/rules/rule-006
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Automation rule deleted successfully"
}
```

---

### GET /automation/stats
Get automation statistics and analytics.

**Request:**
```http
GET /api/v1/whatsapp/automation/stats?numberId=1&period=30d
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numberId` | number | No | Filter by WhatsApp number ID |
| `period` | string | No | Time period: `24h`, `7d`, `30d` (default: `24h`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRules": 5,
    "activeRules": 4,
    "inactiveRules": 1,
    "messagesSent": {
      "last24h": 128,
      "last7d": 892,
      "last30d": 3456
    },
    "successRate": 98.5,
    "failureRate": 1.5,
    "topTriggers": [
      { "trigger": "new_inquiry", "count": 156, "label": "استفسار جديد" },
      { "trigger": "appointment_reminder", "count": 89, "label": "تذكير موعد" },
      { "trigger": "no_response_24h", "count": 45, "label": "عدم رد 24 ساعة" },
      { "trigger": "follow_up", "count": 34, "label": "متابعة" },
      { "trigger": "property_match", "count": 12, "label": "عقار مطابق" }
    ],
    "dailyStats": [
      { "date": "2024-01-14", "sent": 98, "success": 97, "failed": 1 },
      { "date": "2024-01-15", "sent": 112, "success": 110, "failed": 2 },
      { "date": "2024-01-16", "sent": 89, "success": 88, "failed": 1 },
      { "date": "2024-01-17", "sent": 134, "success": 132, "failed": 2 },
      { "date": "2024-01-18", "sent": 145, "success": 143, "failed": 2 },
      { "date": "2024-01-19", "sent": 156, "success": 154, "failed": 2 },
      { "date": "2024-01-20", "sent": 128, "success": 126, "failed": 2 }
    ]
  }
}
```

---

## 6. AI Responder API

### GET /ai/config/:numberId
Get AI responder configuration for a WhatsApp number.

**Request:**
```http
GET /api/v1/whatsapp/ai/config/1
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ai-config-001",
    "whatsappNumberId": 1,
    "enabled": true,
    "businessHoursOnly": true,
    "businessHours": {
      "start": "09:00",
      "end": "18:00",
      "timezone": "Asia/Riyadh"
    },
    "scenarios": {
      "initialGreeting": true,
      "faqResponses": true,
      "propertyInquiryResponse": true,
      "appointmentBooking": true,
      "generalQuestions": false
    },
    "tone": "friendly",
    "language": "ar",
    "customInstructions": "أنت مساعد ذكي لشركة تعريف العقارية. قم بالرد على استفسارات العملاء بشكل ودي ومهني. لا تقدم أسعار أو معلومات حساسة بدون تأكيد من الفريق.",
    "fallbackToHuman": true,
    "fallbackDelay": 5,
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
}
```

---

### PUT /ai/config/:numberId
Update or create AI responder configuration.

**Request:**
```http
PUT /api/v1/whatsapp/ai/config/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": true,
  "businessHoursOnly": true,
  "businessHours": {
    "start": "08:00",
    "end": "20:00",
    "timezone": "Asia/Riyadh"
  },
  "scenarios": {
    "initialGreeting": true,
    "faqResponses": true,
    "propertyInquiryResponse": true,
    "appointmentBooking": true,
    "generalQuestions": true
  },
  "tone": "professional",
  "language": "both",
  "customInstructions": "أنت مساعد ذكي لشركة تعريف العقارية. قم بالرد على استفسارات العملاء بشكل احترافي. يمكنك الرد بالعربية أو الإنجليزية حسب لغة العميل. لا تذكر أسعار محددة بدون التحقق من قاعدة البيانات.",
  "fallbackToHuman": true,
  "fallbackDelay": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ai-config-001",
    "whatsappNumberId": 1,
    "enabled": true,
    "businessHoursOnly": true,
    "businessHours": {
      "start": "08:00",
      "end": "20:00",
      "timezone": "Asia/Riyadh"
    },
    "scenarios": {
      "initialGreeting": true,
      "faqResponses": true,
      "propertyInquiryResponse": true,
      "appointmentBooking": true,
      "generalQuestions": true
    },
    "tone": "professional",
    "language": "both",
    "customInstructions": "أنت مساعد ذكي لشركة تعريف العقارية. قم بالرد على استفسارات العملاء بشكل احترافي. يمكنك الرد بالعربية أو الإنجليزية حسب لغة العميل. لا تذكر أسعار محددة بدون التحقق من قاعدة البيانات.",
    "fallbackToHuman": true,
    "fallbackDelay": 3,
    "createdAt": "2024-01-10T00:00:00Z",
    "updatedAt": "2024-01-20T20:00:00Z"
  }
}
```

---

### PATCH /ai/config/:numberId/toggle
Toggle AI responder on/off.

**Request:**
```http
PATCH /api/v1/whatsapp/ai/config/1/toggle
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "whatsappNumberId": 1,
    "enabled": false,
    "updatedAt": "2024-01-20T20:30:00Z"
  }
}
```

---

### GET /ai/stats
Get AI responder statistics and analytics.

**Request:**
```http
GET /api/v1/whatsapp/ai/stats?numberId=1&period=7d
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `numberId` | number | No | Filter by WhatsApp number ID |
| `period` | string | No | Time period: `24h`, `7d`, `30d` (default: `24h`) |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalResponses": 342,
    "avgResponseTimeMs": 2500,
    "avgResponseTimeFormatted": "2.5 ثانية",
    "satisfactionRate": 94.2,
    "handoffRate": 8.5,
    "handoffCount": 29,
    "scenarioBreakdown": [
      { "scenario": "initialGreeting", "count": 120, "label": "ترحيب أولي", "percentage": 35.1 },
      { "scenario": "faqResponses", "count": 89, "label": "أسئلة شائعة", "percentage": 26.0 },
      { "scenario": "propertyInquiryResponse", "count": 78, "label": "استفسار عقاري", "percentage": 22.8 },
      { "scenario": "appointmentBooking", "count": 35, "label": "حجز موعد", "percentage": 10.2 },
      { "scenario": "generalQuestions", "count": 20, "label": "أسئلة عامة", "percentage": 5.8 }
    ],
    "languageBreakdown": [
      { "language": "ar", "count": 280, "label": "العربية", "percentage": 81.9 },
      { "language": "en", "count": 62, "label": "English", "percentage": 18.1 }
    ],
    "hourlyDistribution": [
      { "hour": 8, "count": 12 },
      { "hour": 9, "count": 25 },
      { "hour": 10, "count": 42 },
      { "hour": 11, "count": 38 },
      { "hour": 12, "count": 15 },
      { "hour": 13, "count": 28 },
      { "hour": 14, "count": 45 },
      { "hour": 15, "count": 52 },
      { "hour": 16, "count": 48 },
      { "hour": 17, "count": 35 },
      { "hour": 18, "count": 14 },
      { "hour": 19, "count": 8 }
    ],
    "dailyStats": [
      { "date": "2024-01-14", "responses": 42, "handoffs": 3, "avgResponseTime": 2400 },
      { "date": "2024-01-15", "responses": 48, "handoffs": 4, "avgResponseTime": 2600 },
      { "date": "2024-01-16", "responses": 51, "handoffs": 5, "avgResponseTime": 2300 },
      { "date": "2024-01-17", "responses": 45, "handoffs": 4, "avgResponseTime": 2500 },
      { "date": "2024-01-18", "responses": 52, "handoffs": 4, "avgResponseTime": 2700 },
      { "date": "2024-01-19", "responses": 56, "handoffs": 5, "avgResponseTime": 2400 },
      { "date": "2024-01-20", "responses": 48, "handoffs": 4, "avgResponseTime": 2500 }
    ]
  }
}
```

---

## 7. Webhook Endpoints

These endpoints receive events from the WhatsApp Business API.

### POST /webhook/verify
Webhook verification endpoint (required by WhatsApp Business API).

**Request:**
```http
GET /api/v1/whatsapp/webhook/verify?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=CHALLENGE_STRING
```

**Response (200 OK):**
```
CHALLENGE_STRING
```

---

### POST /webhook/incoming
Receive incoming messages from WhatsApp Business API.

**Request (from WhatsApp):**
```http
POST /api/v1/whatsapp/webhook/incoming
X-Hub-Signature-256: sha256=<signature>
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "966501234567",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "contacts": [
              {
                "profile": {
                  "name": "محمد أحمد"
                },
                "wa_id": "966512345678"
              }
            ],
            "messages": [
              {
                "from": "966512345678",
                "id": "wamid.HBgLOTY2NTEyMzQ1Njc4FQIAEhgUM0VCMDdFOTJBRjUwOTMyQzY0RTUA",
                "timestamp": "1705766400",
                "type": "text",
                "text": {
                  "body": "السلام عليكم، أبحث عن شقة في الرياض"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

### POST /webhook/status
Receive message status updates from WhatsApp Business API.

**Request (from WhatsApp):**
```http
POST /api/v1/whatsapp/webhook/status
X-Hub-Signature-256: sha256=<signature>
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "966501234567",
              "phone_number_id": "PHONE_NUMBER_ID"
            },
            "statuses": [
              {
                "id": "wamid.HBgLOTY2NTEyMzQ1Njc4FQIAEhgUM0VCMDdFOTJBRjUwOTMyQzY0RTUA",
                "status": "delivered",
                "timestamp": "1705766500",
                "recipient_id": "966512345678"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request - Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "content",
        "message": "Message content is required"
      },
      {
        "field": "conversationId",
        "message": "Invalid conversation ID format"
      }
    ]
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "details": "Invalid or expired token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource",
    "details": "User does not have access to this WhatsApp number"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": "Conversation with ID 'conv-999' not found"
  }
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Resource already exists",
    "details": "A conversation with this customer already exists"
  }
}
```

### 422 Unprocessable Entity
```json
{
  "success": false,
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Unable to process request",
    "details": "WhatsApp number is not active"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": "Rate limit exceeded. Please try again in 60 seconds",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "requestId": "req-12345-abcde"
  }
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "WhatsApp Business API is temporarily unavailable",
    "retryAfter": 30
  }
}
```

---

## Reference Tables

### Trigger Types

| Trigger | Description | Arabic Label |
|---------|-------------|--------------|
| `new_inquiry` | New customer message received | استفسار جديد |
| `no_response_24h` | Customer hasn't responded in 24 hours | عدم رد 24 ساعة |
| `no_response_48h` | Customer hasn't responded in 48 hours | عدم رد 48 ساعة |
| `no_response_72h` | Customer hasn't responded in 72 hours | عدم رد 72 ساعة |
| `follow_up` | Manual follow-up trigger | متابعة |
| `appointment_reminder` | Scheduled appointment reminder | تذكير موعد |
| `property_match` | New property matches customer criteria | عقار مطابق |
| `price_change` | Property price has changed | تغيير السعر |

### Conversation Statuses

| Status | Description | Arabic Label |
|--------|-------------|--------------|
| `active` | Active conversation requiring attention | نشط |
| `pending` | Waiting for customer response | قيد الانتظار |
| `resolved` | Conversation completed | مكتمل |

### Message Sender Types

| Sender | Description | Arabic Label |
|--------|-------------|--------------|
| `customer` | Message from customer | العميل |
| `agent` | Message from human agent | الموظف |
| `ai` | Message from AI responder | المساعد الذكي |
| `system` | System-generated message | النظام |

### Message Statuses

| Status | Description | Arabic Label |
|--------|-------------|--------------|
| `sent` | Message sent to WhatsApp | تم الإرسال |
| `delivered` | Message delivered to recipient | تم التوصيل |
| `read` | Message read by recipient | تمت القراءة |
| `failed` | Message delivery failed | فشل الإرسال |

### AI Tone Options

| Tone | Description | Arabic Label |
|------|-------------|--------------|
| `formal` | Formal and professional | رسمي |
| `friendly` | Warm and approachable | ودي |
| `professional` | Business professional | احترافي |

### Language Options

| Language | Description | Arabic Label |
|----------|-------------|--------------|
| `ar` | Arabic only | العربية |
| `en` | English only | الإنجليزية |
| `both` | Bilingual (based on customer language) | كلاهما |

### AI Scenarios

| Scenario | Description | Arabic Label |
|----------|-------------|--------------|
| `initialGreeting` | Respond to initial customer greeting | ترحيب أولي |
| `faqResponses` | Answer frequently asked questions | أسئلة شائعة |
| `propertyInquiryResponse` | Handle property-related inquiries | استفسار عقاري |
| `appointmentBooking` | Assist with scheduling appointments | حجز موعد |
| `generalQuestions` | Answer general questions | أسئلة عامة |

### Property Interest Statuses

| Status | Description | Arabic Label |
|--------|-------------|--------------|
| `interested` | Customer expressed interest | مهتم |
| `viewing_scheduled` | Property viewing scheduled | موعد معاينة |
| `offer_made` | Customer made an offer | تم تقديم عرض |
| `not_interested` | Customer no longer interested | غير مهتم |

### Attachment Types

| Type | Supported MIME Types | Max Size |
|------|---------------------|----------|
| `image` | image/jpeg, image/png, image/webp | 5 MB |
| `video` | video/mp4, video/3gpp | 16 MB |
| `audio` | audio/aac, audio/mp3, audio/ogg | 16 MB |
| `document` | application/pdf, application/msword, etc. | 100 MB |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET endpoints | 100 requests | per minute |
| POST/PUT/PATCH endpoints | 30 requests | per minute |
| Message sending | 1000 messages | per day per number |
| Webhook endpoints | No limit | - |

---

## WebSocket Events (Real-time Updates)

For real-time updates, connect to:
```
wss://api.yourapp.com/ws/whatsapp?token=<bearer_token>
```

### Event Types

**New Message:**
```json
{
  "event": "message.new",
  "data": {
    "conversationId": "conv-001",
    "message": { ... }
  }
}
```

**Message Status Update:**
```json
{
  "event": "message.status",
  "data": {
    "messageId": "msg-001",
    "status": "delivered"
  }
}
```

**Conversation Update:**
```json
{
  "event": "conversation.update",
  "data": {
    "conversationId": "conv-001",
    "changes": {
      "unreadCount": 3,
      "lastMessage": "..."
    }
  }
}
```

---

## Frontend Integration

To integrate with the existing frontend service (`services/whatsapp-management-api.ts`), replace mock implementations with actual API calls:

```typescript
// Example: Replace mock getConversations
export async function getConversations(
  numberId?: number,
  filters?: ConversationFilters
): Promise<Conversation[]> {
  const params = new URLSearchParams();
  if (numberId) params.append('numberId', numberId.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.starred) params.append('starred', 'true');
  if (filters?.unread) params.append('unread', 'true');
  if (filters?.search) params.append('search', filters.search);
  
  const response = await axiosInstance.get(`/whatsapp/conversations?${params}`);
  return response.data.data;
}
```

---

## Support

For API issues or questions, contact the backend development team or refer to the main project documentation.
