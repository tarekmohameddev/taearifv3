# Marketing Systems Postman Collection Guide

## Table of Contents

1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Environment Variables](#environment-variables)
4. [Credit Packages API Collection](#credit-packages-api-collection)
5. [Marketing Channel Pricing API Collection](#marketing-channel-pricing-api-collection)
6. [Authentication](#authentication)
7. [Testing Scenarios](#testing-scenarios)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## Overview

This guide provides comprehensive Postman collections for testing both the Credit Packages and Marketing Channel Pricing systems. The collections include all CRUD operations, advanced features, and integration endpoints.

## Setup Instructions

### 1. Import Collections

1. Open Postman
2. Click "Import" button
3. Import the following collections:
   - `Credit_Packages_API_Collection.json`
   - `Marketing_Channel_Pricing_API_Collection.json`

### 2. Set Up Environment

1. Create a new environment called "Taearif Marketing API"
2. Add the environment variables listed below
3. Select the environment in your workspace

### 3. Authentication Setup

1. Ensure you have admin credentials
2. Set up authentication headers or tokens
3. Test authentication with a simple request

## Environment Variables

### Base Configuration

```json
{
  "base_url": "http://localhost:8000",
  "admin_email": "admin@taearif.com",
  "admin_password": "your_admin_password",
  "api_token": "your_api_token_if_available"
}
```

### Dynamic Variables

```json
{
  "package_id": "1",
  "pricing_id": "1",
  "channel_type": "whatsapp",
  "currency": "SAR",
  "timestamp": "{{$timestamp}}"
}
```

### Test Data Variables

```json
{
  "test_package_name": "Test Package {{$timestamp}}",
  "test_pricing_name": "Test Pricing {{$timestamp}}",
  "test_credits": "1000",
  "test_price": "50.00",
  "test_credits_per_message": "2"
}
```

## Credit Packages API Collection

### Collection Structure

```
Credit Packages API
├── Package Management
│   ├── List All Packages
│   ├── Create Package
│   ├── View Package Details
│   ├── Update Package
│   ├── Delete Package
│   └── Toggle Package Status
├── Marketing Integration
│   ├── Toggle Marketing Support
│   ├── Get Marketing Packages (AJAX)
│   └── Bulk Update Marketing Support
├── Filtering & Search
│   ├── Filter by Marketing Support
│   ├── Filter by Status
│   ├── Search Packages
│   └── Combined Filters
└── Package Analytics
    ├── Get Package Statistics
    ├── Calculate Message Estimates
    └── Pricing Analysis
```

### Key Requests

#### 1. Create Credit Package

```http
POST {{base_url}}/admin/credit-packages
Content-Type: application/x-www-form-urlencoded

name=Starter Pack&name_ar=باقة المبتدئين&description=Perfect for getting started&credits=500&price=25.00&currency=SAR&discount_percentage=10&is_popular=1&is_active=1&supports_marketing_channels=1&features[]=Email Support&features[]=Basic Analytics&marketing_features[]=WhatsApp Messaging&marketing_features[]=SMS Campaigns
```

#### 2. Update Package with Marketing Support

```http
PUT {{base_url}}/admin/credit-packages/{{package_id}}
Content-Type: application/x-www-form-urlencoded

_method=PUT&name=Premium Starter Pack&credits=750&price=35.00&discount_percentage=15&is_popular=1&is_active=1&supports_marketing_channels=1&marketing_priority=1
```

#### 3. Bulk Update Marketing Support

```http
POST {{base_url}}/admin/credit-packages/bulk-update-marketing-support
Content-Type: application/json

{
  "package_ids": [1, 2, 3],
  "supports_marketing_channels": true
}
```

#### 4. Get Marketing Packages (AJAX)

```http
GET {{base_url}}/admin/credit-packages/marketing/list
Accept: application/json
```

### Test Scripts for Credit Packages

#### Pre-request Script (Create Package)

```javascript
// Generate unique package name
pm.environment.set("test_package_name", "Test Package " + Date.now());
pm.environment.set("test_credits", Math.floor(Math.random() * 1000) + 100);
pm.environment.set("test_price", (Math.random() * 100 + 10).toFixed(2));
```

#### Test Script (Create Package)

```javascript
pm.test("Status code is 200 or 302", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 302]);
});

pm.test("Response contains success message", function () {
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include(
      "/admin/credit-packages",
    );
  }
});

// Extract package ID if available
if (pm.response.json && pm.response.json.id) {
  pm.environment.set("package_id", pm.response.json.id);
}
```

## Marketing Channel Pricing API Collection

### Collection Structure

```
Marketing Channel Pricing API
├── Pricing Management
│   ├── List All Channel Pricing
│   ├── Create Channel Pricing
│   ├── View Pricing Details
│   ├── Update Pricing
│   ├── Delete Pricing
│   └── Toggle Pricing Status
├── Bulk Operations
│   ├── Bulk Update Credits
│   ├── Update from Credit Packages
│   └── Bulk Status Updates
├── Analytics & Comparison
│   ├── Get Pricing Comparison
│   ├── Channel Usage Statistics
│   └── Cost Analysis
└── Integration
    ├── Sync with Credit Packages
    ├── Channel Configuration
    └── Settings Management
```

### Key Requests

#### 1. Create WhatsApp Channel Pricing

```http
POST {{base_url}}/admin/marketing-channel-pricing
Content-Type: application/x-www-form-urlencoded

channel_type=whatsapp&credits_per_message=2&price_per_credit=0.05&currency=SAR&description=WhatsApp messaging pricing&is_active=1&channel_specific_settings={"max_message_length":160,"delivery_reports":true}
```

#### 2. Update Channel Pricing

```http
PUT {{base_url}}/admin/marketing-channel-pricing/{{pricing_id}}
Content-Type: application/x-www-form-urlencoded

_method=PUT&channel_type=whatsapp&credits_per_message=3&price_per_credit=0.04&currency=SAR&description=Updated WhatsApp pricing&is_active=1
```

#### 3. Bulk Update Credits

```http
POST {{base_url}}/admin/marketing-channel-pricing/bulk-update
Content-Type: application/json

{
  "updates": [
    {
      "id": 1,
      "credits_per_message": 2
    },
    {
      "id": 2,
      "credits_per_message": 1
    }
  ]
}
```

#### 4. Get Pricing Comparison

```http
GET {{base_url}}/admin/marketing-channel-pricing/comparison
Accept: application/json
```

### Test Scripts for Channel Pricing

#### Pre-request Script (Create Pricing)

```javascript
// Generate unique pricing data
pm.environment.set(
  "test_credits_per_message",
  Math.floor(Math.random() * 5) + 1,
);
pm.environment.set(
  "test_price_per_credit",
  (Math.random() * 0.1 + 0.01).toFixed(4),
);
```

#### Test Script (Create Pricing)

```javascript
pm.test("Status code is 200 or 302", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 302]);
});

pm.test("Response contains success message", function () {
  if (pm.response.code === 302) {
    pm.expect(pm.response.headers.get("Location")).to.include(
      "/admin/marketing-channel-pricing",
    );
  }
});

// Extract pricing ID if available
if (pm.response.json && pm.response.json.id) {
  pm.environment.set("pricing_id", pm.response.json.id);
}
```

## Authentication

### Method 1: Session-based Authentication

```javascript
// Pre-request Script for all requests
pm.sendRequest(
  {
    url: pm.environment.get("base_url") + "/admin/login",
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRF-TOKEN": "{{csrf_token}}",
    },
    body: {
      mode: "urlencoded",
      urlencoded: [
        { key: "email", value: pm.environment.get("admin_email") },
        { key: "password", value: pm.environment.get("admin_password") },
      ],
    },
  },
  function (err, response) {
    if (response.code === 302) {
      // Extract session cookie
      const cookies = response.headers.get("Set-Cookie");
      pm.environment.set("session_cookie", cookies);
    }
  },
);
```

### Method 2: API Token Authentication

```javascript
// Add to request headers
pm.request.headers.add({
  key: "Authorization",
  value: "Bearer " + pm.environment.get("api_token"),
});
```

### Method 3: CSRF Token Handling

```javascript
// Pre-request Script to get CSRF token
pm.sendRequest(
  {
    url: pm.environment.get("base_url") + "/admin/credit-packages/create",
    method: "GET",
  },
  function (err, response) {
    if (response.code === 200) {
      const body = response.text();
      const csrfMatch = body.match(/name="_token" value="([^"]+)"/);
      if (csrfMatch) {
        pm.environment.set("csrf_token", csrfMatch[1]);
      }
    }
  },
);
```

## Testing Scenarios

### Scenario 1: Complete Package Lifecycle

1. **Create Package** → Verify creation
2. **View Package** → Verify details
3. **Update Package** → Verify changes
4. **Toggle Marketing Support** → Verify toggle
5. **Delete Package** → Verify deletion

### Scenario 2: Marketing Integration Flow

1. **Create Credit Package** with marketing support
2. **Create Channel Pricing** for WhatsApp
3. **Get Message Estimates** → Verify calculations
4. **Update Pricing** → Verify estimate changes
5. **Bulk Update** → Verify multiple updates

### Scenario 3: Pricing Comparison Analysis

1. **Create Multiple Channel Pricing** (WhatsApp, SMS, Facebook)
2. **Get Pricing Comparison** → Verify comparison data
3. **Update Individual Pricing** → Verify comparison updates
4. **Sync with Credit Packages** → Verify synchronization

### Scenario 4: Error Handling Tests

1. **Invalid Data** → Test validation errors
2. **Missing Required Fields** → Test required field validation
3. **Duplicate Channel Types** → Test uniqueness constraints
4. **Invalid Numeric Values** → Test numeric validation

## Error Handling

### Common Error Responses

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "name": ["The name field is required."],
    "credits": ["The credits must be at least 1."],
    "price": ["The price must be at least 0."]
  }
}
```

### Error Handling Test Scripts

```javascript
pm.test("Error response has correct structure", function () {
  if (pm.response.code >= 400) {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("message");
    pm.expect(jsonData).to.have.property("errors");
  }
});

pm.test("Validation errors are present", function () {
  if (pm.response.code === 422) {
    const jsonData = pm.response.json();
    pm.expect(jsonData.errors).to.be.an("object");
  }
});
```

## Best Practices

### 1. Environment Management

- Use separate environments for different stages (dev, staging, production)
- Keep sensitive data in environment variables
- Use dynamic values for test data

### 2. Request Organization

- Group related requests in folders
- Use descriptive names for requests
- Add documentation to each request

### 3. Test Automation

- Write comprehensive test scripts
- Use assertions to validate responses
- Test both success and error scenarios

### 4. Data Management

- Clean up test data after tests
- Use unique identifiers for test data
- Avoid hardcoded values

### 5. Performance Testing

- Monitor response times
- Test with large datasets
- Validate pagination

### 6. Security Testing

- Test authentication mechanisms
- Validate input sanitization
- Test authorization controls

## Collection Runner

### Running Complete Collections

1. Select the collection
2. Choose environment
3. Set iterations and delay
4. Run collection
5. Review test results

### Custom Test Scenarios

```javascript
// Collection-level pre-request script
pm.environment.set("test_run_id", Date.now());

// Collection-level test script
pm.test("Collection completed successfully", function () {
  pm.expect(pm.info.iteration).to.equal(pm.info.iterations);
});
```

## Monitoring and Reporting

### Test Results Analysis

- Monitor pass/fail rates
- Track response times
- Identify performance bottlenecks
- Generate test reports

### Integration with CI/CD

- Export collections as JSON
- Use Newman for command-line testing
- Integrate with build pipelines
- Automated testing workflows

---

## Conclusion

This Postman collection guide provides comprehensive testing capabilities for both the Credit Packages and Marketing Channel Pricing systems. By following the setup instructions, using the provided test scripts, and implementing best practices, you can ensure thorough testing of all system functionality.

The collections support both manual testing and automated testing scenarios, making them suitable for development, QA, and production monitoring. Regular use of these collections will help maintain system quality and catch issues early in the development process.
