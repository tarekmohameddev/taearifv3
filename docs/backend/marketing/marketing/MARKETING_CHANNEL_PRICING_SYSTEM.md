# Marketing Channel Pricing System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Purpose](#purpose)
3. [System Architecture](#system-architecture)
4. [Data Model](#data-model)
5. [Admin Interface](#admin-interface)
6. [API Endpoints](#api-endpoints)
7. [Postman Collection](#postman-collection)
8. [Usage Examples](#usage-examples)
9. [Integration with Credit Packages](#integration-with-credit-packages)
10. [Business Logic](#business-logic)

## Overview

The Marketing Channel Pricing System is a comprehensive solution for managing credit consumption rates across different marketing channels. It allows administrators to set pricing rules for various communication platforms including WhatsApp, Facebook, Telegram, Instagram, and SMS.

## Purpose

### Primary Objectives
- **Credit Consumption Management**: Define how many credits each message type costs per channel
- **Multi-Channel Support**: Manage pricing for different marketing platforms
- **Cost Control**: Provide granular control over message pricing
- **Business Intelligence**: Enable pricing comparisons and analysis
- **Automated Calculations**: Calculate effective message costs automatically

### Business Value
- **Revenue Optimization**: Set competitive pricing for different channels
- **Cost Management**: Control operational costs per message type
- **User Experience**: Provide transparent pricing to users
- **Scalability**: Support multiple channels with different pricing models

## System Architecture

### Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Interface                          │
├─────────────────────────────────────────────────────────────┤
│  • Index View (List all channel pricing)                   │
│  • Create Form (Add new channel pricing)                   │
│  • Edit Form (Modify existing pricing)                     │
│  • Show View (View pricing details)                        │
│  • Comparison View (Compare channel costs)                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                Controller Layer                             │
├─────────────────────────────────────────────────────────────┤
│  • AdminMarketingChannelPricingController                  │
│  • CRUD Operations (Create, Read, Update, Delete)          │
│  • Status Management (Activate/Deactivate)                 │
│  • Bulk Operations (Bulk updates)                          │
│  • Integration Methods (Sync with credit packages)         │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Model Layer                                │
├─────────────────────────────────────────────────────────────┤
│  • MarketingChannelPricing Model                           │
│  • CreditPackage Model (Integration)                       │
│  • Relationships and Scopes                                │
│  • Business Logic Methods                                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer                              │
├─────────────────────────────────────────────────────────────┤
│  • marketing_channel_pricing table                         │
│  • credit_packages table (Related)                         │
│  • Indexes and Constraints                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

### MarketingChannelPricing Model

#### Database Table: `marketing_channel_pricing`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | bigint | Primary key | Auto increment |
| `channel_type` | varchar | Channel identifier | Required, Unique |
| `credits_per_message` | integer | Credits consumed per message | Required, Min: 1 |
| `price_per_credit` | decimal(8,4) | Cost per credit | Required, Min: 0 |
| `effective_price_per_message` | decimal(8,4) | Calculated total cost | Auto-calculated |
| `currency` | varchar(3) | Currency code | Required, Max: 3 chars |
| `is_active` | boolean | Active status | Default: true |
| `description` | text | Channel description | Optional |
| `description_ar` | text | Arabic description | Optional |
| `channel_specific_settings` | json | Channel-specific config | Optional |
| `created_at` | timestamp | Creation timestamp | Auto |
| `updated_at` | timestamp | Last update timestamp | Auto |

#### Supported Channel Types
```php
const CHANNEL_WHATSAPP = 'whatsapp';
const CHANNEL_FACEBOOK = 'facebook';
const CHANNEL_TELEGRAM = 'telegram';
const CHANNEL_INSTAGRAM = 'instagram';
const CHANNEL_SMS = 'sms';
```

#### Model Methods
- `calculateEffectivePrice()`: Calculate total cost per message
- `updateEffectivePrice()`: Update and save effective price
- `getChannelTypes()`: Get available channel types
- `getPricingComparison()`: Compare pricing across channels
- `updatePriceFromCreditPackages()`: Sync with credit package pricing

## Admin Interface

### Routes (admin.php lines 511-516)
```php
Route::resource('marketing-channel-pricing', 'Admin\AdminMarketingChannelPricingController');
Route::patch('/marketing-channel-pricing/{id}/toggle-status', 'Admin\AdminMarketingChannelPricingController@toggleStatus');
Route::post('/marketing-channel-pricing/update-from-credit-packages', 'Admin\AdminMarketingChannelPricingController@updatePricingFromCreditPackages');
Route::get('/marketing-channel-pricing/comparison', 'Admin\AdminMarketingChannelPricingController@pricingComparison');
Route::post('/marketing-channel-pricing/bulk-update', 'Admin\AdminMarketingChannelPricingController@bulkUpdateCredits');
```

### Views Structure
```
resources/views/admin/marketing_channel_pricing/
├── index.blade.php      # List all channel pricing
├── create.blade.php     # Create new channel pricing
├── edit.blade.php       # Edit existing pricing
├── show.blade.php       # View pricing details
└── comparison.blade.php # Compare channel costs
```

### Key Features
1. **Channel Management**: Create, edit, delete channel pricing
2. **Status Control**: Activate/deactivate channels
3. **Bulk Operations**: Update multiple channels simultaneously
4. **Pricing Comparison**: Visual comparison of channel costs
5. **Integration**: Sync with credit package pricing
6. **Validation**: Comprehensive input validation

## API Endpoints

### RESTful Routes
| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| GET | `/admin/marketing-channel-pricing` | index | List all channel pricing |
| GET | `/admin/marketing-channel-pricing/create` | create | Show create form |
| POST | `/admin/marketing-channel-pricing` | store | Create new pricing |
| GET | `/admin/marketing-channel-pricing/{id}` | show | View pricing details |
| GET | `/admin/marketing-channel-pricing/{id}/edit` | edit | Show edit form |
| PUT/PATCH | `/admin/marketing-channel-pricing/{id}` | update | Update pricing |
| DELETE | `/admin/marketing-channel-pricing/{id}` | destroy | Delete pricing |

### Additional Endpoints
| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| PATCH | `/admin/marketing-channel-pricing/{id}/toggle-status` | toggleStatus | Toggle active status |
| POST | `/admin/marketing-channel-pricing/update-from-credit-packages` | updatePricingFromCreditPackages | Sync with credit packages |
| GET | `/admin/marketing-channel-pricing/comparison` | pricingComparison | View pricing comparison |
| POST | `/admin/marketing-channel-pricing/bulk-update` | bulkUpdateCredits | Bulk update credits |

## Postman Collection

### Collection Structure
```json
{
  "info": {
    "name": "Marketing Channel Pricing API",
    "description": "Complete API collection for marketing channel pricing management",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Channel Pricing Management",
      "item": [
        {
          "name": "List All Channel Pricing",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/marketing-channel-pricing"
          }
        },
        {
          "name": "Create Channel Pricing",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/admin/marketing-channel-pricing",
            "body": {
              "mode": "formdata",
              "formdata": [
                {"key": "channel_type", "value": "whatsapp"},
                {"key": "credits_per_message", "value": "2"},
                {"key": "price_per_credit", "value": "0.05"},
                {"key": "currency", "value": "SAR"},
                {"key": "description", "value": "WhatsApp messaging pricing"},
                {"key": "is_active", "value": "1"}
              ]
            }
          }
        },
        {
          "name": "View Channel Pricing Details",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/marketing-channel-pricing/{{pricing_id}}"
          }
        },
        {
          "name": "Update Channel Pricing",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/admin/marketing-channel-pricing/{{pricing_id}}",
            "body": {
              "mode": "formdata",
              "formdata": [
                {"key": "_method", "value": "PUT"},
                {"key": "channel_type", "value": "whatsapp"},
                {"key": "credits_per_message", "value": "3"},
                {"key": "price_per_credit", "value": "0.04"},
                {"key": "currency", "value": "SAR"},
                {"key": "description", "value": "Updated WhatsApp pricing"},
                {"key": "is_active", "value": "1"}
              ]
            }
          }
        },
        {
          "name": "Delete Channel Pricing",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/admin/marketing-channel-pricing/{{pricing_id}}"
          }
        },
        {
          "name": "Toggle Channel Status",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/admin/marketing-channel-pricing/{{pricing_id}}/toggle-status"
          }
        },
        {
          "name": "Bulk Update Credits",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/admin/marketing-channel-pricing/bulk-update",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"updates\": [\n    {\n      \"id\": 1,\n      \"credits_per_message\": 2\n    },\n    {\n      \"id\": 2,\n      \"credits_per_message\": 1\n    }\n  ]\n}"
            }
          }
        },
        {
          "name": "Get Pricing Comparison",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/marketing-channel-pricing/comparison"
          }
        },
        {
          "name": "Update from Credit Packages",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/admin/marketing-channel-pricing/update-from-credit-packages"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "pricing_id",
      "value": "1"
    }
  ]
}
```

### Environment Variables
```json
{
  "base_url": "http://localhost:8000",
  "admin_token": "your_admin_auth_token",
  "pricing_id": "1",
  "channel_type": "whatsapp"
}
```

## Usage Examples

### 1. Creating WhatsApp Channel Pricing
```php
// Admin creates WhatsApp pricing
$pricing = MarketingChannelPricing::create([
    'channel_type' => 'whatsapp',
    'credits_per_message' => 2,
    'price_per_credit' => 0.05,
    'currency' => 'SAR',
    'description' => 'WhatsApp messaging service',
    'is_active' => true
]);

// System automatically calculates:
// effective_price_per_message = 2 * 0.05 = 0.10 SAR
```

### 2. User Sending Messages
```php
// User has 1000 credits
$userCredits = 1000;

// User sends WhatsApp message (costs 2 credits)
$whatsappPricing = MarketingChannelPricing::where('channel_type', 'whatsapp')->first();
$creditsUsed = $whatsappPricing->credits_per_message; // 2 credits

// Remaining credits
$remainingCredits = $userCredits - $creditsUsed; // 998 credits
```

### 3. Pricing Comparison
```php
// Get pricing comparison across all channels
$comparison = MarketingChannelPricing::getPricingComparison();

// Result:
// [
//     ['channel_type' => 'sms', 'price_per_message' => 0.05],
//     ['channel_type' => 'whatsapp', 'price_per_message' => 0.10],
//     ['channel_type' => 'facebook', 'price_per_message' => 0.15]
// ]
```

## Integration with Credit Packages

### Relationship
The Marketing Channel Pricing system integrates with Credit Packages to provide a complete credit management solution:

1. **Credit Packages**: Define what users can buy (e.g., "1000 credits for 50 SAR")
2. **Channel Pricing**: Define how credits are consumed (e.g., "1 WhatsApp message = 2 credits")

### Integration Methods

#### 1. Price Synchronization
```php
// Update channel pricing from credit package average
public function updatePricingFromCreditPackages()
{
    $avgPricePerCredit = CreditPackage::forMarketingChannels()
        ->active()
        ->avg('price_per_credit');

    MarketingChannelPricing::active()->get()->each(function ($pricing) use ($avgPricePerCredit) {
        $pricing->price_per_credit = round($avgPricePerCredit, 4);
        $pricing->updateEffectivePrice();
    });
}
```

#### 2. Message Estimates
```php
// Calculate how many messages a package can send
public function getEstimatedMessagesPerChannel()
{
    $channelPricing = MarketingChannelPricing::active()->get();
    $estimates = [];

    foreach ($channelPricing as $pricing) {
        $messages = floor($this->credits / $pricing->credits_per_message);
        $estimates[$pricing->channel_type] = [
            'channel_name' => $pricing->channel_type_name,
            'credits_per_message' => $pricing->credits_per_message,
            'estimated_messages' => $messages,
            'remaining_credits' => $this->credits % $pricing->credits_per_message,
        ];
    }

    return $estimates;
}
```

## Business Logic

### 1. Effective Price Calculation
```php
// Automatic calculation when pricing is created/updated
$effectivePrice = $creditsPerMessage * $pricePerCredit;
```

### 2. Credit Consumption
```php
// When user sends message
$creditsToDeduct = $channelPricing->credits_per_message;
$userCredits -= $creditsToDeduct;
```

### 3. Channel Status Management
```php
// Toggle channel availability
public function toggleStatus($id)
{
    $pricing = MarketingChannelPricing::findOrFail($id);
    $pricing->is_active = !$pricing->is_active;
    $pricing->save();
}
```

### 4. Bulk Operations
```php
// Update multiple channels at once
public function bulkUpdateCredits(Request $request)
{
    foreach ($request->updates as $update) {
        $pricing = MarketingChannelPricing::find($update['id']);
        if ($pricing) {
            $pricing->credits_per_message = $update['credits_per_message'];
            $pricing->updateEffectivePrice();
        }
    }
}
```

## Security & Validation

### Input Validation
```php
$validator = Validator::make($request->all(), [
    'channel_type' => 'required|in:whatsapp,facebook,telegram,instagram,sms|unique:marketing_channel_pricing,channel_type',
    'credits_per_message' => 'required|integer|min:1',
    'price_per_credit' => 'required|numeric|min:0',
    'currency' => 'required|string|max:3',
    'description' => 'nullable|string|max:1000',
    'is_active' => 'boolean',
    'channel_specific_settings' => 'nullable|array',
]);
```

### Access Control
- Admin authentication required
- Permission-based access control
- CSRF protection on all forms
- Input sanitization and validation

## Performance Considerations

### Database Optimization
- Indexed fields: `channel_type`, `is_active`
- Efficient queries with proper scopes
- Pagination for large datasets

### Caching Strategy
- Cache active channel pricing
- Cache pricing comparisons
- Invalidate cache on updates

## Monitoring & Analytics

### Key Metrics
- Channel usage statistics
- Credit consumption patterns
- Pricing effectiveness
- Revenue per channel

### Logging
- Pricing changes logged
- Error handling and logging
- Performance monitoring

## Future Enhancements

### Planned Features
1. **Dynamic Pricing**: Time-based pricing adjustments
2. **Volume Discounts**: Bulk message pricing tiers
3. **Regional Pricing**: Location-based pricing
4. **A/B Testing**: Pricing optimization tools
5. **Analytics Dashboard**: Advanced reporting
6. **API Rate Limiting**: Channel-specific limits

### Integration Opportunities
1. **Payment Gateways**: Direct billing integration
2. **CRM Systems**: Customer relationship management
3. **Analytics Platforms**: Business intelligence
4. **Third-party APIs**: External service integration

---

## Conclusion

The Marketing Channel Pricing System provides a robust, scalable solution for managing credit consumption across multiple marketing channels. With comprehensive admin controls, API integration, and seamless credit package integration, it enables businesses to optimize their messaging costs while providing transparent pricing to users.

The system's modular architecture allows for easy expansion to new channels and pricing models, making it a future-proof solution for marketing communication management.
