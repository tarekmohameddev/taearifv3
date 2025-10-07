# Role and Permission API - Postman Testing Guide

This guide provides comprehensive documentation for testing the Role and Permission API endpoints using Postman. The API is designed for a multi-tenant real estate management system with role-based access control.

## Table of Contents

1. [Authentication Setup](#authentication-setup)
2. [Base Configuration](#base-configuration)
3. [Role Management Endpoints](#role-management-endpoints)
4. [Permission Management Endpoints](#permission-management-endpoints)
5. [Employee Role Assignment Endpoints](#employee-role-assignment-endpoints)
6. [Testing Scenarios](#testing-scenarios)
7. [Error Handling](#error-handling)
8. [Sample Data](#sample-data)

## Authentication Setup

### 1. Login to Get Bearer Token

**Endpoint:** `POST /api/login`

**Headers:**

```
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "token": "1|abc123def456ghi789..."
  }
}
```

### 2. Set Authorization Header

Copy the token from the login response and set it in your Postman environment:

**Variable Name:** `bearer_token`
**Value:** `1|abc123def456ghi789...`

**Headers for all authenticated requests:**

```
Authorization: Bearer {{bearer_token}}
Content-Type: application/json
Accept: application/json
```

## Base Configuration

### Environment Variables

Set up these variables in your Postman environment:

| Variable       | Description          | Example Value               |
| -------------- | -------------------- | --------------------------- | ---------------------- |
| `base_url`     | API base URL         | `http://localhost:8000/api` |
| `bearer_token` | Authentication token | `1                          | abc123def456ghi789...` |
| `tenant_id`    | Current tenant ID    | `1`                         |

### Base URL

```
{{base_url}}
```

## Role Management Endpoints

### 1. Get All Roles

**Endpoint:** `GET /api/v1/roles`

**Headers:**

```
Authorization: Bearer {{bearer_token}}
Accept: application/json
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "manager",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z",
      "permissions_list": [
        "properties.view",
        "properties.create",
        "customers.view"
      ]
    }
  ]
}
```

### 2. Get Single Role

**Endpoint:** `GET /api/v1/roles/{id}`

**Example:** `GET /api/v1/roles/1`

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "manager",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z",
    "permissions_list": [
      "properties.view",
      "properties.create",
      "customers.view"
    ]
  }
}
```

### 3. Create New Role

**Endpoint:** `POST /api/v1/roles`

**Headers:**

```
Authorization: Bearer {{bearer_token}}
Content-Type: application/json
Accept: application/json
```

**Body (JSON):**

```json
{
  "name": "sales_agent",
  "permissions": [
    "properties.view",
    "customers.view",
    "customers.create",
    "customers.update"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Role created successfully",
  "data": {
    "id": 2,
    "name": "sales_agent",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:00:00.000000Z",
    "permissions_list": [
      "properties.view",
      "customers.view",
      "customers.create",
      "customers.update"
    ]
  }
}
```

### 4. Update Role

**Endpoint:** `PUT /api/v1/roles/{id}`

**Example:** `PUT /api/v1/roles/2`

**Body (JSON):**

```json
{
  "name": "senior_sales_agent",
  "permissions": [
    "properties.view",
    "properties.create",
    "customers.view",
    "customers.create",
    "customers.update",
    "customers.delete"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Role updated successfully",
  "data": {
    "id": 2,
    "name": "senior_sales_agent",
    "created_at": "2024-01-01T12:00:00.000000Z",
    "updated_at": "2024-01-01T12:30:00.000000Z",
    "permissions_list": [
      "properties.view",
      "properties.create",
      "customers.view",
      "customers.create",
      "customers.update",
      "customers.delete"
    ]
  }
}
```

### 5. Delete Role

**Endpoint:** `DELETE /api/v1/roles/{id}`

**Example:** `DELETE /api/v1/roles/2`

**Response:**

```json
{
  "status": "success",
  "message": "Role deleted successfully"
}
```

**Error Response (Protected Role):**

```json
{
  "status": "error",
  "message": "Cannot delete protected role: owner",
  "protected_roles": ["owner", "manager", "agent"]
}
```

**Error Response (Role in Use):**

```json
{
  "status": "error",
  "message": "Cannot delete role that is assigned to 3 user(s)",
  "assigned_users": 3
}
```

## Permission Management Endpoints

### 1. Get All Permissions

**Endpoint:** `GET /api/v1/permissions`

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "properties.view",
      "description": "View property listings",
      "team_id": 1
    },
    {
      "id": 2,
      "name": "properties.create",
      "description": "Add new properties",
      "team_id": 1
    }
  ],
  "grouped": {
    "properties": [
      {
        "id": 1,
        "name": "properties.view",
        "description": "View property listings",
        "team_id": 1
      }
    ],
    "customers": [
      {
        "id": 3,
        "name": "customers.view",
        "description": "View customer information",
        "team_id": 1
      }
    ]
  },
  "templates": {
    "properties": {
      "view": "View property listings",
      "create": "Add new properties",
      "update": "Edit property details",
      "delete": "Remove properties",
      "approve": "Approve property listings",
      "feature": "Feature/unfeature properties",
      "export": "Export property data",
      "manage": "Full property management"
    }
  }
}
```

### 2. Create New Permission

**Endpoint:** `POST /api/v1/permissions`

**Body (JSON):**

```json
{
  "name": "reports.export",
  "description": "Export business reports to Excel/PDF"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Permission created successfully",
  "data": {
    "id": 10,
    "name": "reports.export",
    "description": "Export business reports to Excel/PDF",
    "team_id": 1,
    "guard_name": "sanctum"
  }
}
```

**Error Response (Invalid Format):**

```json
{
  "status": "error",
  "message": "Invalid permission format",
  "errors": ["Invalid resource: 'invalid'", "Invalid action: 'invalid'"],
  "suggestions": [
    "Valid resources: properties, projects, customers, crm, content, settings, reports, analytics, users, employees, bookings, sales, leads, deals, contracts, payments",
    "Valid actions: view, create, update, delete, approve, reject, assign, export, import, manage, feature, archive, restore, followup, schedule, complete, cancel"
  ]
}
```

### 3. Update Permission

**Endpoint:** `PUT /api/v1/permissions/{id}`

**Example:** `PUT /api/v1/permissions/10`

**Body (JSON):**

```json
{
  "name": "reports.export_advanced"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Permission updated successfully",
  "data": {
    "id": 10,
    "name": "reports.export_advanced",
    "description": "Export business reports to Excel/PDF",
    "team_id": 1,
    "guard_name": "sanctum"
  }
}
```

### 4. Delete Permission

**Endpoint:** `DELETE /api/v1/permissions/{id}`

**Example:** `DELETE /api/v1/permissions/10`

**Response:**

```json
{
  "status": "success",
  "message": "Permission deleted successfully"
}
```

**Error Response (Permission in Use):**

```json
{
  "status": "error",
  "message": "Cannot delete permission that is assigned to 2 role(s)",
  "assigned_roles": 2
}
```

## Employee Role Assignment Endpoints

### 1. Get Employee Roles

**Endpoint:** `GET /api/v1/rbac/employees-show-roles/{employee}/roles`

**Example:** `GET /api/v1/rbac/employees-show-roles/5/roles`

**Response:**

```json
{
  "status": "success",
  "data": {
    "employee_id": 5,
    "roles": [
      {
        "id": 1,
        "name": "sales_agent",
        "permissions": ["properties.view", "customers.view", "customers.create"]
      }
    ]
  }
}
```

### 2. Sync Employee Roles

**Endpoint:** `POST /api/v1/rbac/employees-sync-roles/{employee}/roles`

**Example:** `POST /api/v1/rbac/employees-sync-roles/5/roles`

**Body (JSON):**

```json
{
  "roles": ["manager", "sales_agent"]
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Employee roles synchronized successfully",
  "data": {
    "employee_id": 5,
    "assigned_roles": ["manager", "sales_agent"]
  }
}
```

### 3. Sync Employee Permissions

**Endpoint:** `POST /api/v1/rbac/employees-sync-perms/{employee}/perms`

**Example:** `POST /api/v1/rbac/employees-sync-perms/5/perms`

**Body (JSON):**

```json
{
  "permissions": [
    "properties.view",
    "properties.create",
    "customers.view",
    "customers.create",
    "customers.update"
  ]
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Employee permissions synchronized successfully",
  "data": {
    "employee_id": 5,
    "assigned_permissions": [
      "properties.view",
      "properties.create",
      "customers.view",
      "customers.create",
      "customers.update"
    ]
  }
}
```

## Testing Scenarios

### Scenario 1: Complete Role Management Workflow

1. **Login** → Get bearer token
2. **Get all permissions** → Understand available permissions
3. **Create a new role** → "property_manager" with specific permissions
4. **Get the created role** → Verify it was created correctly
5. **Update the role** → Add more permissions
6. **Assign role to employee** → Test role assignment
7. **Delete the role** → Clean up (if not protected)

### Scenario 2: Permission Management Workflow

1. **Get all permissions** → See current permission structure
2. **Create custom permission** → "analytics.dashboard_view"
3. **Update permission name** → Rename to "analytics.view_dashboard"
4. **Assign to role** → Add to existing role
5. **Test role with new permission** → Verify functionality
6. **Delete permission** → Clean up (if not in use)

### Scenario 3: Employee Role Assignment

1. **Get employee current roles** → Check existing assignments
2. **Sync new roles** → Assign multiple roles
3. **Get employee permissions** → Verify direct permissions
4. **Sync custom permissions** → Add specific permissions
5. **Verify final access** → Test employee capabilities

## Error Handling

### Common HTTP Status Codes

| Status Code | Description           | Common Causes                  |
| ----------- | --------------------- | ------------------------------ |
| 200         | Success               | Request completed successfully |
| 201         | Created               | Resource created successfully  |
| 400         | Bad Request           | Invalid request data           |
| 401         | Unauthorized          | Missing or invalid token       |
| 403         | Forbidden             | Insufficient permissions       |
| 404         | Not Found             | Resource doesn't exist         |
| 422         | Unprocessable Entity  | Validation errors              |
| 500         | Internal Server Error | Server-side error              |

### Validation Error Examples

**Role Name Already Exists:**

```json
{
  "message": "The name has already been taken.",
  "errors": {
    "name": ["The name has already been taken."]
  }
}
```

**Invalid Permission Format:**

```json
{
  "status": "error",
  "message": "Invalid permission format",
  "errors": [
    "Permission must follow format: resource.action (e.g., properties.view)"
  ],
  "suggestions": ["Use lowercase letters and dots only"]
}
```

## Sample Data

### Valid Permission Names

**Properties:**

- `properties.view`
- `properties.create`
- `properties.update`
- `properties.delete`
- `properties.approve`
- `properties.feature`
- `properties.export`
- `properties.manage`

**Customers:**

- `customers.view`
- `customers.create`
- `customers.update`
- `customers.delete`
- `customers.assign`
- `customers.followup`
- `customers.export`
- `customers.manage`

**CRM:**

- `crm.view`
- `crm.create`
- `crm.update`
- `crm.assign`
- `crm.schedule`
- `crm.manage`

**Reports:**

- `reports.view`
- `reports.create`
- `reports.export`
- `reports.manage`

**Settings:**

- `settings.view`
- `settings.update`
- `settings.manage`

### Sample Role Configurations

**Manager Role:**

```json
{
  "name": "manager",
  "permissions": [
    "properties.view",
    "properties.create",
    "properties.update",
    "properties.delete",
    "customers.view",
    "customers.create",
    "customers.update",
    "customers.delete",
    "reports.view",
    "reports.export",
    "settings.view"
  ]
}
```

**Sales Agent Role:**

```json
{
  "name": "sales_agent",
  "permissions": [
    "properties.view",
    "customers.view",
    "customers.create",
    "customers.update",
    "crm.view",
    "crm.create",
    "crm.schedule"
  ]
}
```

**Viewer Role:**

```json
{
  "name": "viewer",
  "permissions": ["properties.view", "customers.view", "reports.view"]
}
```

## Postman Collection Structure

### Recommended Folder Structure

```
Role & Permission API
├── Authentication
│   ├── Login
│   └── Logout
├── Roles
│   ├── Get All Roles
│   ├── Get Single Role
│   ├── Create Role
│   ├── Update Role
│   └── Delete Role
├── Permissions
│   ├── Get All Permissions
│   ├── Create Permission
│   ├── Update Permission
│   └── Delete Permission
├── Employee Management
│   ├── Get Employee Roles
│   ├── Sync Employee Roles
│   └── Sync Employee Permissions
└── Test Scenarios
    ├── Complete Workflow
    ├── Error Handling
    └── Edge Cases
```

### Environment Variables Setup

Create a Postman environment with these variables:

```json
{
  "base_url": "http://localhost:8000/api",
  "bearer_token": "",
  "tenant_id": "1",
  "test_role_id": "",
  "test_permission_id": "",
  "test_employee_id": "5"
}
```

## Testing Tips

1. **Always authenticate first** - Get a fresh token before testing
2. **Test error scenarios** - Try invalid data, missing fields, etc.
3. **Clean up after tests** - Delete created resources when possible
4. **Use environment variables** - Store IDs and tokens for reuse
5. **Test edge cases** - Protected roles, permissions in use, etc.
6. **Verify responses** - Check that created/updated data matches input
7. **Test permissions** - Ensure role assignments work correctly

## Security Notes

- All endpoints require authentication (`auth:sanctum`)
- Role management requires `settings.update` permission
- Protected roles (`owner`, `manager`, `agent`) cannot be deleted
- Roles assigned to users cannot be deleted
- Permissions assigned to roles cannot be deleted
- All actions are logged for audit purposes

This guide provides a comprehensive foundation for testing the Role and Permission API. Adjust the base URL and authentication details according to your specific environment setup.
