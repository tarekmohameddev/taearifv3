# مرجع API - Live Editor

## نظرة عامة

هذا الدليل يوضح جميع API endpoints المتاحة للـ Live Editor المدمج في الداشبورد.

## Base URL

```
/api/tenant
```

## Authentication

جميع الطلبات تتطلب مصادقة صحيحة عبر NextAuth.js.

## Endpoints

### 1. إدارة المكونات

#### `PUT /api/tenant/components`

تحديث مكون معين للمستخدم.

**Request Body:**

```json
{
  "componentType": "string",
  "data": "object",
  "id": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "username": "string",
    "components": {
      "componentType": "object"
    }
  }
}
```

**Error Responses:**

- `404`: User not found
- `405`: Method not allowed

---

### 2. الحصول على بيانات المستأجر

#### `POST /api/tenant/getTenant`

الحصول على بيانات مستأجر معين.

**Request Body:**

```json
{
  "websiteName": "string"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "username": "string",
    "email": "string",
    "websiteName": "string",
    "components": "object",
    "settings": "object"
  }
}
```

**Error Responses:**

- `400`: websiteName is required
- `404`: Tenant not found
- `405`: Method not allowed

---

### 3. حفظ الصفحات

#### `POST /api/tenant/save-pages`

حفظ جميع صفحات المستأجر مع المكونات.

**Request Body:**

```json
{
  "tenantId": "string",
  "pages": {
    "pageName": [
      {
        "id": "string",
        "type": "string",
        "name": "string",
        "componentName": "string",
        "data": "object",
        "position": "number"
      }
    ]
  },
  "globalComponentsData": "object"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Pages saved successfully",
  "data": {
    "pages": "object",
    "globalComponents": "object"
  }
}
```

**Error Responses:**

- `400`: tenantId is required
- `500`: Internal server error
- `405`: Method not allowed

---

### 4. متغيرات المكونات

#### `POST /api/tenant/component-variants`

إنشاء أو تحديث متغير مكون معين.

**Request Body:**

```json
{
  "componentType": "string",
  "data": "object"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "componentType": "string",
    "data": "object",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**

- `405`: Method not allowed
- `500`: Internal server error

---

## Data Models

### Component Structure

```typescript
interface Component {
  id: string;
  type: string;
  name: string;
  componentName: string;
  data: {
    // Component-specific data
    title?: string;
    content?: string;
    image?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    // ... other properties
  };
  position: number;
}
```

### Page Structure

```typescript
interface Page {
  [pageName: string]: Component[];
}
```

### Tenant Structure

```typescript
interface Tenant {
  username: string;
  email: string;
  websiteName: string;
  components: {
    [componentType: string]: any;
  };
  settings: {
    colors: {
      primary: string;
      secondary: string;
    };
    fonts: {
      primary: string;
      secondary: string;
    };
    // ... other settings
  };
}
```

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": "string",
  "message": "string",
  "code": "number"
}
```

### Error Codes

- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error

## Rate Limiting

جميع endpoints محمية بمعدل طلبات:

- **Limit:** 100 requests per minute
- **Window:** 60 seconds
- **Headers:**
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Examples

### إنشاء صفحة جديدة

```javascript
const response = await fetch("/api/tenant/save-pages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token",
  },
  body: JSON.stringify({
    tenantId: "user123",
    pages: {
      homepage: [
        {
          id: "hero-1",
          type: "hero",
          name: "Hero Section",
          componentName: "hero1",
          data: {
            title: "Welcome to Our Website",
            subtitle: "Your trusted partner",
            buttonText: "Get Started",
            buttonLink: "/contact",
          },
          position: 0,
        },
      ],
    },
  }),
});
```

### تحديث مكون

```javascript
const response = await fetch("/api/tenant/components", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token",
  },
  body: JSON.stringify({
    componentType: "hero",
    data: {
      title: "New Title",
      subtitle: "New Subtitle",
    },
    id: "user123",
  }),
});
```

### الحصول على بيانات المستأجر

```javascript
const response = await fetch("/api/tenant/getTenant", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token",
  },
  body: JSON.stringify({
    websiteName: "my-website",
  }),
});
```

## Testing

### Test Endpoints

```bash
# Test components endpoint
curl -X PUT http://localhost:3000/api/tenant/components \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"componentType":"hero","data":{},"id":"user123"}'

# Test getTenant endpoint
curl -X POST http://localhost:3000/api/tenant/getTenant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"websiteName":"my-website"}'
```

## Security

### Authentication

- جميع endpoints محمية بـ NextAuth.js
- JWT tokens للجلسات
- حماية CSRF

### Data Validation

- تحقق من صحة البيانات المدخلة
- تنظيف البيانات قبل المعالجة
- حماية من SQL injection

### CORS

- إعدادات CORS محددة
- السماح للمصادر الموثوقة فقط
- حماية من XSS attacks

---

**تاريخ التحديث:** ${new Date().toLocaleDateString('ar-US')}
**الإصدار:** 1.0.0
