# Marketing Settings API Guide

This guide explains how to use the new Marketing Settings API endpoints to manage CRM and Appointment System integrations in your marketing channels.

## Overview

The Marketing Settings API allows you to:

- Enable/disable CRM system integration
- Enable/disable Appointment System (نظام المواعيد) integration
- Manage integration-specific settings
- Retrieve and update marketing channel settings

## Database Changes

### New Fields Added to `marketing_channels` Table

```sql
-- System Integration Settings
crm_integration_enabled BOOLEAN DEFAULT FALSE
appointment_system_integration_enabled BOOLEAN DEFAULT FALSE
integration_settings JSON NULL
```

## API Endpoints

### 1. Get All Marketing Settings

**Endpoint:** `GET /api/marketing/settings`

**Description:** Retrieve all marketing settings for the authenticated user's channels.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "message": "All marketing settings retrieved successfully",
  "data": [
    {
      "channel_id": 1,
      "channel_name": "WhatsApp Business",
      "channel_type": "whatsapp",
      "is_connected": true,
      "is_verified": true,
      "system_integrations": {
        "crm_integration_enabled": true,
        "appointment_system_integration_enabled": false,
        "integration_settings": {
          "crm_api_url": "https://crm.example.com/api",
          "crm_api_key": "crm_key_123"
        }
      },
      "marketing_settings": {},
      "updated_at": "2025-09-29T21:30:00.000000Z"
    }
  ]
}
```

### 2. Get Specific Channel Settings

**Endpoint:** `GET /api/marketing/channels/{id}/settings`

**Description:** Retrieve marketing settings for a specific channel.

**Parameters:**

- `id` (integer, required): Channel ID

**Response:**

```json
{
  "success": true,
  "message": "Marketing settings retrieved successfully",
  "data": {
    "channel_id": 1,
    "channel_name": "WhatsApp Business",
    "channel_type": "whatsapp",
    "system_integrations": {
      "crm_integration_enabled": true,
      "appointment_system_integration_enabled": false,
      "integration_settings": {
        "crm_api_url": "https://crm.example.com/api",
        "crm_api_key": "crm_key_123"
      }
    },
    "marketing_settings": {},
    "updated_at": "2025-09-29T21:30:00.000000Z"
  }
}
```

### 3. Update Marketing Settings

**Endpoint:** `PUT /api/marketing/channels/{id}/settings`

**Description:** Update marketing settings for a specific channel.

**Parameters:**

- `id` (integer, required): Channel ID

**Request Body:**

```json
{
  "crm_integration_enabled": true,
  "appointment_system_integration_enabled": false,
  "integration_settings": {
    "crm_api_url": "https://crm.example.com/api",
    "crm_api_key": "crm_key_123",
    "appointment_api_url": "https://appointments.example.com/api",
    "appointment_api_key": "appointment_key_123"
  },
  "marketing_settings": {
    "auto_reply_enabled": true,
    "business_hours": "9:00-17:00"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Marketing settings updated successfully",
  "data": {
    "channel_id": 1,
    "channel_name": "WhatsApp Business",
    "channel_type": "whatsapp",
    "system_integrations": {
      "crm_integration_enabled": true,
      "appointment_system_integration_enabled": false,
      "integration_settings": {
        "crm_api_url": "https://crm.example.com/api",
        "crm_api_key": "crm_key_123"
      }
    },
    "marketing_settings": {
      "auto_reply_enabled": true,
      "business_hours": "9:00-17:00"
    },
    "updated_at": "2025-09-29T21:35:00.000000Z"
  }
}
```

### 4. Update System Integration Settings

**Endpoint:** `PATCH /api/marketing/channels/{id}/system-integrations`

**Description:** Update only the system integration settings for a specific channel.

**Parameters:**

- `id` (integer, required): Channel ID

**Request Body:**

```json
{
  "crm_integration_enabled": true,
  "appointment_system_integration_enabled": true,
  "integration_settings": {
    "crm_api_url": "https://crm.example.com/api",
    "crm_api_key": "crm_key_123",
    "appointment_api_url": "https://appointments.example.com/api",
    "appointment_api_key": "appointment_key_123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "System integration settings updated successfully",
  "data": {
    "channel_id": 1,
    "channel_name": "WhatsApp Business",
    "channel_type": "whatsapp",
    "system_integrations": {
      "crm_integration_enabled": true,
      "appointment_system_integration_enabled": true,
      "integration_settings": {
        "crm_api_url": "https://crm.example.com/api",
        "crm_api_key": "crm_key_123",
        "appointment_api_url": "https://appointments.example.com/api",
        "appointment_api_key": "appointment_key_123"
      }
    },
    "updated_at": "2025-09-29T21:35:00.000000Z"
  }
}
```

## Model Methods

### MarketingChannel Model

The `MarketingChannel` model now includes several helper methods:

#### `getSystemIntegrationSettings()`

Returns the current system integration settings.

```php
$settings = $channel->getSystemIntegrationSettings();
// Returns: ['crm_integration_enabled' => bool, 'appointment_system_integration_enabled' => bool, 'integration_settings' => array]
```

#### `updateSystemIntegrationSettings($settings)`

Updates the system integration settings.

```php
$channel->updateSystemIntegrationSettings([
    'crm_integration_enabled' => true,
    'appointment_system_integration_enabled' => false,
    'integration_settings' => ['crm_api_url' => 'https://crm.example.com/api']
]);
```

#### `isCrmIntegrationEnabled()`

Checks if CRM integration is enabled.

```php
if ($channel->isCrmIntegrationEnabled()) {
    // CRM integration is enabled
}
```

#### `isAppointmentSystemIntegrationEnabled()`

Checks if Appointment System integration is enabled.

```php
if ($channel->isAppointmentSystemIntegrationEnabled()) {
    // Appointment System integration is enabled
}
```

## Frontend Integration

### Example Frontend Implementation

Based on the image you provided, here's how you can integrate the API with your frontend:

```javascript
// Get all marketing settings
async function getMarketingSettings() {
  const response = await fetch("/api/marketing/settings", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

// Update system integration settings
async function updateSystemIntegrations(channelId, settings) {
  const response = await fetch(
    `/api/marketing/channels/${channelId}/system-integrations`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        crm_integration_enabled: settings.crmEnabled,
        appointment_system_integration_enabled: settings.appointmentEnabled,
        integration_settings: settings.integrationSettings,
      }),
    },
  );
  return await response.json();
}

// Example usage
const settings = await getMarketingSettings();
console.log("Marketing Settings:", settings.data);

// Update CRM integration
await updateSystemIntegrations(1, {
  crmEnabled: true,
  appointmentEnabled: false,
  integrationSettings: {
    crm_api_url: "https://crm.example.com/api",
    crm_api_key: "your_api_key",
  },
});
```

### Toggle Switch Implementation

For the toggle switches shown in your image:

```javascript
// Handle CRM integration toggle
function handleCrmToggle(channelId, enabled) {
  updateSystemIntegrations(channelId, {
    crmEnabled: enabled,
    appointmentEnabled: getCurrentAppointmentStatus(),
    integrationSettings: getCurrentIntegrationSettings(),
  });
}

// Handle Appointment System integration toggle
function handleAppointmentToggle(channelId, enabled) {
  updateSystemIntegrations(channelId, {
    crmEnabled: getCurrentCrmStatus(),
    appointmentEnabled: enabled,
    integrationSettings: getCurrentIntegrationSettings(),
  });
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

Common HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Channel not found
- `422` - Validation error
- `500` - Server error

## Testing

Run the test script to verify the functionality:

```bash
php test-scripts/test_marketing_settings_api.php
```

This script will:

1. Create a test marketing channel
2. Test all the new model methods
3. Simulate API responses
4. Test different integration scenarios
5. Clean up test data

## Migration

To apply the database changes, run:

```bash
php artisan migrate
```

This will add the new fields to the `marketing_channels` table.

## Security Considerations

1. **Authentication**: All endpoints require valid authentication tokens
2. **Authorization**: Users can only access their own marketing channels
3. **Validation**: All input data is validated before processing
4. **API Keys**: Store integration API keys securely in the `integration_settings` JSON field

## Future Enhancements

Potential future enhancements could include:

- Webhook notifications when integration settings change
- Integration health checks
- Automatic sync with external systems
- Bulk operations for multiple channels
- Integration templates and presets
