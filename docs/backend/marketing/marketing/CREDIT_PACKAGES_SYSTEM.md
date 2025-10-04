# Credit Packages System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Purpose](#purpose)
3. [System Architecture](#system-architecture)
4. [Data Model](#data-model)
5. [Admin Interface](#admin-interface)
6. [API Endpoints](#api-endpoints)
7. [Postman Collection](#postman-collection)
8. [Usage Examples](#usage-examples)
9. [Integration with Marketing Channels](#integration-with-marketing-channels)
10. [Business Logic](#business-logic)
11. [Pricing Calculations](#pricing-calculations)

## Overview

The Credit Packages System is a comprehensive solution for managing credit bundles that users can purchase for various services. It provides administrators with complete control over package creation, pricing, features, and marketing channel support.

## Purpose

### Primary Objectives
- **Credit Bundle Management**: Create and manage different credit packages for users
- **Flexible Pricing**: Set custom prices, discounts, and promotional offers
- **Marketing Integration**: Enable packages to support marketing channel usage
- **User Experience**: Provide clear package information and value propositions
- **Revenue Optimization**: Create attractive packages to maximize sales

### Business Value
- **Revenue Generation**: Primary source of income through credit sales
- **User Acquisition**: Attractive packages to attract new users
- **Retention**: Popular packages and discounts to retain existing users
- **Upselling**: Different tiers to encourage users to buy larger packages
- **Marketing Support**: Enable users to use credits for marketing activities

## System Architecture

### Components
```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Interface                          │
├─────────────────────────────────────────────────────────────┤
│  • Index View (List all packages with filters)             │
│  • Create Form (Add new credit package)                    │
│  • Edit Form (Modify existing package)                     │
│  • Show View (View package details & estimates)            │
│  • Bulk Operations (Manage multiple packages)              │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                Controller Layer                             │
├─────────────────────────────────────────────────────────────┤
│  • AdminCreditPackageController                            │
│  • CRUD Operations (Create, Read, Update, Delete)          │
│  • Status Management (Activate/Deactivate)                 │
│  • Marketing Support Toggle                                │
│  • Bulk Operations (Bulk marketing support updates)        │
│  • AJAX Endpoints (Get marketing packages)                 │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Model Layer                                │
├─────────────────────────────────────────────────────────────┤
│  • CreditPackage Model                                     │
│  • MarketingChannelPricing Model (Integration)            │
│  • CreditTransaction Model (Related)                       │
│  • Relationships and Scopes                                │
│  • Business Logic Methods                                  │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Database Layer                              │
├─────────────────────────────────────────────────────────────┤
│  • credit_packages table                                   │
│  • marketing_channel_pricing table (Related)              │
│  • credit_transactions table (Related)                     │
│  • Indexes and Constraints                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Model

### CreditPackage Model

#### Database Table: `credit_packages`

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | bigint | Primary key | Auto increment |
| `name` | varchar(255) | Package name | Required |
| `name_ar` | varchar(255) | Arabic package name | Optional |
| `description` | text | Package description | Optional |
| `description_ar` | text | Arabic description | Optional |
| `credits` | integer | Number of credits in package | Required, Min: 1 |
| `price` | decimal(10,2) | Package price | Required, Min: 0 |
| `currency` | varchar(3) | Currency code | Required, Max: 3 chars |
| `discount_percentage` | decimal(5,2) | Discount percentage | Optional, Max: 100 |
| `is_popular` | boolean | Popular package flag | Default: false |
| `is_active` | boolean | Active status | Default: true |
| `sort_order` | integer | Display order | Default: 0 |
| `supports_marketing_channels` | boolean | Marketing support flag | Default: false |
| `marketing_priority` | integer | Marketing priority | Default: 0 |
| `features` | json | General features list | Optional |
| `marketing_features` | json | Marketing-specific features | Optional |
| `created_at` | timestamp | Creation timestamp | Auto |
| `updated_at` | timestamp | Last update timestamp | Auto |

#### Model Methods
- `getPricePerCreditAttribute()`: Calculate cost per credit
- `getDiscountedPriceAttribute()`: Calculate discounted price
- `getSavingsAmountAttribute()`: Calculate savings amount
- `hasDiscount()`: Check if package has discount
- `supportsMarketingChannels()`: Check marketing support
- `getMarketingFeatures()`: Get marketing features
- `scopeForMarketingChannels()`: Query packages with marketing support
- `getEstimatedMessagesPerChannel()`: Calculate message estimates

#### Computed Attributes
```php
// Price per credit calculation
public function getPricePerCreditAttribute()
{
    if ($this->credits <= 0) {
        return 0;
    }
    return round($this->price / $this->credits, 4);
}

// Discounted price calculation
public function getDiscountedPriceAttribute()
{
    if ($this->discount_percentage && $this->discount_percentage > 0) {
        $discount = ($this->price * $this->discount_percentage) / 100;
        return round($this->price - $discount, 2);
    }
    return $this->price;
}
```

## Admin Interface

### Routes (admin.php lines 517-523)
```php
Route::resource('credit-packages', 'Admin\AdminCreditPackageController');
Route::patch('/credit-packages/{id}/toggle-status', 'Admin\AdminCreditPackageController@toggleStatus');
Route::patch('/credit-packages/{id}/toggle-marketing-support', 'Admin\AdminCreditPackageController@toggleMarketingSupport');
Route::get('/credit-packages/marketing/list', 'Admin\AdminCreditPackageController@getMarketingPackages');
Route::post('/credit-packages/bulk-update-marketing-support', 'Admin\AdminCreditPackageController@bulkUpdateMarketingSupport');
```

### Views Structure
```
resources/views/admin/credit_packages/
├── index.blade.php      # List all packages with filters
├── create.blade.php     # Create new package form
├── edit.blade.php       # Edit existing package form
└── show.blade.php       # View package details & estimates
```

### Key Features
1. **Package Management**: Create, edit, delete credit packages
2. **Advanced Filtering**: Filter by status, marketing support, search
3. **Status Control**: Activate/deactivate packages
4. **Marketing Integration**: Enable/disable marketing channel support
5. **Bulk Operations**: Update multiple packages simultaneously
6. **Message Estimates**: Show estimated messages per channel
7. **Pricing Display**: Show total price and cost per credit
8. **Feature Management**: Manage general and marketing features

## API Endpoints

### RESTful Routes
| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| GET | `/admin/credit-packages` | index | List all packages with filters |
| GET | `/admin/credit-packages/create` | create | Show create form |
| POST | `/admin/credit-packages` | store | Create new package |
| GET | `/admin/credit-packages/{id}` | show | View package details |
| GET | `/admin/credit-packages/{id}/edit` | edit | Show edit form |
| PUT/PATCH | `/admin/credit-packages/{id}` | update | Update package |
| DELETE | `/admin/credit-packages/{id}` | destroy | Delete package |

### Additional Endpoints
| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| PATCH | `/admin/credit-packages/{id}/toggle-status` | toggleStatus | Toggle active status |
| PATCH | `/admin/credit-packages/{id}/toggle-marketing-support` | toggleMarketingSupport | Toggle marketing support |
| GET | `/admin/credit-packages/marketing/list` | getMarketingPackages | Get marketing packages (AJAX) |
| POST | `/admin/credit-packages/bulk-update-marketing-support` | bulkUpdateMarketingSupport | Bulk update marketing support |

## Postman Collection

### Collection Structure
```json
{
  "info": {
    "name": "Credit Packages API",
    "description": "Complete API collection for credit package management",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Credit Package Management",
      "item": [
        {
          "name": "List All Credit Packages",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages",
            "header": [
              {
                "key": "Accept",
                "value": "application/json"
              }
            ]
          }
        },
        {
          "name": "Create Credit Package",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/admin/credit-packages",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/x-www-form-urlencoded"
              }
            ],
            "body": {
              "mode": "urlencoded",
              "urlencoded": [
                {"key": "name", "value": "Starter Pack"},
                {"key": "name_ar", "value": "باقة المبتدئين"},
                {"key": "description", "value": "Perfect for getting started"},
                {"key": "description_ar", "value": "مثالية للبدء"},
                {"key": "credits", "value": "500"},
                {"key": "price", "value": "25.00"},
                {"key": "currency", "value": "SAR"},
                {"key": "discount_percentage", "value": "10"},
                {"key": "is_popular", "value": "1"},
                {"key": "is_active", "value": "1"},
                {"key": "sort_order", "value": "1"},
                {"key": "supports_marketing_channels", "value": "1"},
                {"key": "marketing_priority", "value": "1"},
                {"key": "features[]", "value": "Email Support"},
                {"key": "features[]", "value": "Basic Analytics"},
                {"key": "marketing_features[]", "value": "WhatsApp Messaging"},
                {"key": "marketing_features[]", "value": "SMS Campaigns"}
              ]
            }
          }
        },
        {
          "name": "View Credit Package Details",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages/{{package_id}}"
          }
        },
        {
          "name": "Update Credit Package",
          "request": {
            "method": "PUT",
            "url": "{{base_url}}/admin/credit-packages/{{package_id}}",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/x-www-form-urlencoded"
              }
            ],
            "body": {
              "mode": "urlencoded",
              "urlencoded": [
                {"key": "_method", "value": "PUT"},
                {"key": "name", "value": "Premium Starter Pack"},
                {"key": "credits", "value": "750"},
                {"key": "price", "value": "35.00"},
                {"key": "discount_percentage", "value": "15"},
                {"key": "is_popular", "value": "1"},
                {"key": "is_active", "value": "1"},
                {"key": "supports_marketing_channels", "value": "1"}
              ]
            }
          }
        },
        {
          "name": "Delete Credit Package",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/admin/credit-packages/{{package_id}}"
          }
        },
        {
          "name": "Toggle Package Status",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/admin/credit-packages/{{package_id}}/toggle-status"
          }
        },
        {
          "name": "Toggle Marketing Support",
          "request": {
            "method": "PATCH",
            "url": "{{base_url}}/admin/credit-packages/{{package_id}}/toggle-marketing-support"
          }
        },
        {
          "name": "Get Marketing Packages (AJAX)",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages/marketing/list",
            "header": [
              {
                "key": "Accept",
                "value": "application/json"
              }
            ]
          }
        },
        {
          "name": "Bulk Update Marketing Support",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/admin/credit-packages/bulk-update-marketing-support",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"package_ids\": [1, 2, 3],\n  \"supports_marketing_channels\": true\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Package Filtering & Search",
      "item": [
        {
          "name": "Filter by Marketing Support",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages?marketing_support=yes"
          }
        },
        {
          "name": "Filter by Status",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages?status=active"
          }
        },
        {
          "name": "Search Packages",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages?search=starter"
          }
        },
        {
          "name": "Combined Filters",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/admin/credit-packages?marketing_support=yes&status=active&search=premium"
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
      "key": "package_id",
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
  "package_id": "1",
  "currency": "SAR"
}
```

## Usage Examples

### 1. Creating a Starter Package
```php
// Admin creates a starter package
$package = CreditPackage::create([
    'name' => 'Starter Pack',
    'name_ar' => 'باقة المبتدئين',
    'description' => 'Perfect for getting started with marketing',
    'credits' => 500,
    'price' => 25.00,
    'currency' => 'SAR',
    'discount_percentage' => 10,
    'is_popular' => true,
    'is_active' => true,
    'supports_marketing_channels' => true,
    'features' => ['Email Support', 'Basic Analytics'],
    'marketing_features' => ['WhatsApp Messaging', 'SMS Campaigns']
]);

// System automatically calculates:
// price_per_credit = 25.00 / 500 = 0.05 SAR
// discounted_price = 25.00 - (25.00 * 10%) = 22.50 SAR
```

### 2. User Purchase Flow
```php
// User selects a package
$package = CreditPackage::find(1);

// Calculate final price with discount
$finalPrice = $package->discounted_price; // 22.50 SAR

// Create transaction
$transaction = CreditTransaction::create([
    'user_id' => $userId,
    'credit_package_id' => $package->id,
    'transaction_type' => 'purchase',
    'credits_amount' => $package->credits,
    'amount_paid' => $finalPrice,
    'currency' => $package->currency,
    'status' => 'completed'
]);

// Add credits to user account
$user->credits += $package->credits;
$user->save();
```

### 3. Marketing Channel Integration
```php
// Get packages that support marketing channels
$marketingPackages = CreditPackage::forMarketingChannels()
    ->active()
    ->ordered()
    ->get();

// Calculate message estimates for each package
foreach ($marketingPackages as $package) {
    $estimates = $package->getEstimatedMessagesPerChannel();
    
    // Example output:
    // [
    //     'whatsapp' => ['estimated_messages' => 250, 'credits_per_message' => 2],
    //     'sms' => ['estimated_messages' => 500, 'credits_per_message' => 1]
    // ]
}
```

## Integration with Marketing Channels

### Relationship
Credit Packages integrate with Marketing Channel Pricing to provide a complete credit ecosystem:

1. **Credit Packages**: Define what users can buy
2. **Channel Pricing**: Define how credits are consumed
3. **User Experience**: Seamless credit usage across channels

### Integration Methods

#### 1. Message Estimates
```php
// Calculate how many messages each package can send
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

#### 2. Marketing Support Toggle
```php
// Enable/disable marketing channel support
public function toggleMarketingSupport($id)
{
    $package = CreditPackage::findOrFail($id);
    $package->supports_marketing_channels = !$package->supports_marketing_channels;
    $package->save();

    $status = $package->supports_marketing_channels ? 'enabled' : 'disabled';
    return response()->json(['message' => "Marketing support {$status} successfully!"]);
}
```

#### 3. Bulk Marketing Support Updates
```php
// Update multiple packages at once
public function bulkUpdateMarketingSupport(Request $request)
{
    CreditPackage::whereIn('id', $request->package_ids)
        ->update(['supports_marketing_channels' => $request->supports_marketing_channels]);

    $status = $request->supports_marketing_channels ? 'enabled' : 'disabled';
    return response()->json([
        'status' => 'success',
        'message' => "Marketing support {$status} for selected packages!"
    ]);
}
```

## Business Logic

### 1. Pricing Calculations
```php
// Cost per credit calculation
public function getPricePerCreditAttribute()
{
    if ($this->credits <= 0) {
        return 0;
    }
    return round($this->price / $this->credits, 4);
}

// Discounted price calculation
public function getDiscountedPriceAttribute()
{
    if ($this->discount_percentage && $this->discount_percentage > 0) {
        $discount = ($this->price * $this->discount_percentage) / 100;
        return round($this->price - $discount, 2);
    }
    return $this->price;
}

// Savings amount calculation
public function getSavingsAmountAttribute()
{
    if ($this->discount_percentage && $this->discount_percentage > 0) {
        return round($this->price - $this->discounted_price, 2);
    }
    return 0;
}
```

### 2. Package Status Management
```php
// Toggle package availability
public function toggleStatus($id)
{
    $package = CreditPackage::findOrFail($id);
    $package->is_active = !$package->is_active;
    $package->save();

    $status = $package->is_active ? 'activated' : 'deactivated';
    return redirect()->back()->with('success', "Package {$status} successfully!");
}
```

### 3. Advanced Filtering
```php
// Filter packages with multiple criteria
public function index(Request $request)
{
    $query = CreditPackage::query();

    // Filter by marketing channel support
    if ($request->filled('marketing_support')) {
        $query->where('supports_marketing_channels', $request->marketing_support === 'yes');
    }

    // Filter by status
    if ($request->filled('status')) {
        $query->where('is_active', $request->status === 'active');
    }

    // Search by name or description
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('name_ar', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    $packages = $query->ordered()->paginate(20);
    return view('admin.credit_packages.index', compact('packages'));
}
```

## Pricing Calculations

### 1. Basic Pricing
```php
// Example: 1000 credits for 50 SAR
$package = new CreditPackage([
    'credits' => 1000,
    'price' => 50.00,
    'currency' => 'SAR'
]);

$pricePerCredit = $package->price_per_credit; // 0.05 SAR
```

### 2. Discounted Pricing
```php
// Example: 20% discount on 1000 credits package
$package = new CreditPackage([
    'credits' => 1000,
    'price' => 50.00,
    'discount_percentage' => 20,
    'currency' => 'SAR'
]);

$originalPrice = $package->price; // 50.00 SAR
$discountedPrice = $package->discounted_price; // 40.00 SAR
$savings = $package->savings_amount; // 10.00 SAR
$pricePerCredit = $package->price_per_credit; // 0.04 SAR (after discount)
```

### 3. Marketing Channel Value
```php
// Calculate value for marketing channels
$package = CreditPackage::find(1);
$estimates = $package->getEstimatedMessagesPerChannel();

// Example output:
// [
//     'whatsapp' => [
//         'channel_name' => 'WhatsApp',
//         'credits_per_message' => 2,
//         'estimated_messages' => 500,
//         'remaining_credits' => 0
//     ],
//     'sms' => [
//         'channel_name' => 'SMS',
//         'credits_per_message' => 1,
//         'estimated_messages' => 1000,
//         'remaining_credits' => 0
//     ]
// ]
```

## Security & Validation

### Input Validation
```php
$validator = Validator::make($request->all(), [
    'name' => 'required|string|max:255',
    'name_ar' => 'nullable|string|max:255',
    'description' => 'nullable|string|max:1000',
    'description_ar' => 'nullable|string|max:1000',
    'credits' => 'required|integer|min:1',
    'price' => 'required|numeric|min:0',
    'currency' => 'required|string|max:3',
    'discount_percentage' => 'nullable|numeric|min:0|max:100',
    'is_popular' => 'boolean',
    'is_active' => 'boolean',
    'sort_order' => 'integer|min:0',
    'supports_marketing_channels' => 'boolean',
    'marketing_priority' => 'integer|min:0',
    'features' => 'nullable|array',
    'marketing_features' => 'nullable|array',
]);
```

### Access Control
- Admin authentication required
- Permission-based access control
- CSRF protection on all forms
- Input sanitization and validation

## Performance Considerations

### Database Optimization
- Indexed fields: `is_active`, `supports_marketing_channels`, `sort_order`
- Efficient queries with proper scopes
- Pagination for large datasets
- Eager loading for relationships

### Caching Strategy
- Cache active packages
- Cache popular packages
- Cache marketing packages
- Invalidate cache on updates

## Monitoring & Analytics

### Key Metrics
- Package sales statistics
- Popular package analysis
- Revenue per package
- Marketing channel usage
- User conversion rates

### Logging
- Package changes logged
- Transaction tracking
- Error handling and logging
- Performance monitoring

## Future Enhancements

### Planned Features
1. **Dynamic Pricing**: Time-based pricing adjustments
2. **Package Bundles**: Multiple package combinations
3. **Subscription Packages**: Recurring credit packages
4. **Loyalty Programs**: Customer reward systems
5. **A/B Testing**: Package optimization tools
6. **Analytics Dashboard**: Advanced reporting
7. **Multi-Currency**: Support for multiple currencies
8. **Package Recommendations**: AI-powered suggestions

### Integration Opportunities
1. **Payment Gateways**: Direct payment integration
2. **CRM Systems**: Customer relationship management
3. **Analytics Platforms**: Business intelligence
4. **Email Marketing**: Automated campaigns
5. **Mobile Apps**: Native mobile integration

---

## Conclusion

The Credit Packages System provides a comprehensive, flexible solution for managing credit bundles and pricing strategies. With advanced admin controls, marketing channel integration, and robust business logic, it enables businesses to create attractive packages that drive revenue while providing clear value to users.

The system's modular architecture and extensive API support make it easy to integrate with external systems and scale as business needs grow. The combination of flexible pricing, marketing integration, and user-friendly interfaces creates a powerful tool for credit-based service management.
