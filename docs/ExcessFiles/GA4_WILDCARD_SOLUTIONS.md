# GA4 Wildcard Domain Solutions

## Problem

GA4 doesn't support wildcard domains (`*.mandhoor.com`) directly in Data Stream configuration.

## Solutions

### Solution 1: Use Main Domain (Recommended)

**GA4 Data Stream Configuration:**

```
Website URL: https://mandhoor.com
Stream name: Multi-Tenant Websites
```

**How it works:**

- GA4 tracks all subdomains automatically
- Code filters out main domain tracking
- Tenant ID extracted from subdomain

**Advantages:**

- ✅ Simple setup
- ✅ Automatic subdomain tracking
- ✅ No domain limitations
- ✅ Easy maintenance

### Solution 2: Multiple Data Streams

**Create separate streams for each tenant:**

```
Stream 1: https://vcvkkokk.mandhoor.com
Stream 2: https://anotherTenant.mandhoor.com
Stream 3: https://hey.mandhoor.com
Stream 4: https://samy.mandhoor.com
```

**Advantages:**

- ✅ Separate tracking per tenant
- ✅ Individual reporting
- ✅ Tenant-specific configurations

**Disadvantages:**

- ❌ Complex setup
- ❌ Manual tenant addition
- ❌ Multiple GA4 properties needed

### Solution 3: Single Property with Filters

**GA4 Configuration:**

```
Website URL: https://mandhoor.com
Data Filters: Exclude main domain
Custom Dimensions: Tenant ID
```

**Code Implementation:**

```typescript
// Track only tenant subdomains
const shouldTrackDomain = (domain: string): boolean => {
  // Don't track main domain
  if (domain === "www.mandhoor.com" || domain === "mandhoor.com") {
    return false;
  }

  // Track tenant subdomains
  if (domain.endsWith(".mandhoor.com")) {
    return true;
  }

  return false;
};
```

## Recommended Implementation

### Step 1: GA4 Data Stream Setup

1. **Create Data Stream:**
   - Website URL: `https://mandhoor.com`
   - Stream name: `Multi-Tenant Websites`
   - Enhanced measurement: Enable all

2. **Configure Custom Dimensions:**
   - Dimension name: `Tenant ID`
   - Scope: Event
   - Event parameter: `tenant_id`

3. **Set up Data Filters:**
   - Filter name: `Exclude Main Domain`
   - Filter type: Internal traffic
   - Condition: Hostname equals `www.mandhoor.com`

### Step 2: Code Implementation

**Domain Detection:**

```typescript
const getTenantIdFromDomain = (domain: string): string | null => {
  if (domain.endsWith(".mandhoor.com")) {
    const subdomain = domain.replace(".mandhoor.com", "");
    return subdomain;
  }
  return null;
};
```

**GA4 Configuration:**

```typescript
window.gtag("config", ga4Id, {
  custom_map: {
    dimension1: "tenant_id",
  },
  cookie_domain: ".mandhoor.com",
  transport_type: "beacon",
});
```

**Event Tracking:**

```typescript
window.gtag("event", "page_view", {
  tenant_id: tenantId,
  page_path: pagePath,
  page_title: document.title,
});
```

### Step 3: Testing

**Test URLs:**

- ✅ `https://vcvkkokk.mandhoor.com/ar/` - Should track
- ✅ `https://anotherTenant.mandhoor.com/ar/` - Should track
- ❌ `https://www.mandhoor.com/` - Should not track
- ❌ `https://mandhoor.com/` - Should not track

**Console Messages:**

```
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
📊 GA4: Tracking page view
```

## Advanced Configuration

### Cross-Domain Tracking

```typescript
window.gtag("config", ga4Id, {
  custom_map: {
    dimension1: "tenant_id",
  },
  cookie_domain: ".mandhoor.com",
  transport_type: "beacon",
  linker: {
    domains: ["*.mandhoor.com"],
  },
});
```

### Enhanced E-commerce

```typescript
// Track property views as e-commerce
window.gtag("event", "view_item", {
  currency: "USD",
  value: propertyPrice,
  items: [
    {
      item_id: propertyId,
      item_name: propertyName,
      category: "Real Estate",
      quantity: 1,
      price: propertyPrice,
    },
  ],
});
```

### User Journey Tracking

```typescript
// Track user journey across tenants
window.gtag("event", "tenant_switch", {
  tenant_id: newTenantId,
  previous_tenant: previousTenantId,
  page_path: window.location.pathname,
});
```

## Monitoring & Debugging

### Real-time Verification

1. **Check GA4 Real-time:**
   - Go to Real-time → Overview
   - Verify tenant subdomains are tracked
   - Verify main domain is excluded

2. **Console Verification:**

   ```javascript
   // Check domain tracking
   console.log("Domain tracking:", shouldTrackDomain(window.location.hostname));

   // Check tenant ID
   console.log("Tenant ID:", getTenantIdFromDomain(window.location.hostname));
   ```

3. **Network Verification:**
   - Check Network tab for GA4 requests
   - Verify correct GA4 ID
   - Check for successful responses

### Custom Reports

**Create tenant-specific reports:**

1. Go to Explore → Free form
2. Add dimensions: Page path, Custom dimension 1 (Tenant ID)
3. Add metrics: Event count, Users
4. Filter by tenant ID

### Alerts

**Set up monitoring:**

1. Go to Configure → Alerts
2. Create alert for tracking issues
3. Monitor data quality
4. Track conversion rates

## Troubleshooting

### Common Issues

1. **Main domain being tracked:**
   - Check domain filtering logic
   - Verify GA4 configuration
   - Check console messages

2. **Tenant subdomains not tracked:**
   - Check wildcard configuration
   - Verify cookie domain settings
   - Check network requests

3. **Data not appearing:**
   - Wait 24-48 hours
   - Check GA4 property settings
   - Verify custom dimensions

### Debug Commands

```javascript
// Check domain tracking
console.log("Domain tracking:", shouldTrackDomain(window.location.hostname));

// Check GA4 status
console.log("GA4 Status:", {
  dataLayer: window.dataLayer,
  gtag: typeof window.gtag,
  domain: window.location.hostname,
});

// Manual event test
window.gtag("event", "test_event", {
  tenant_id: "test-tenant",
  test_parameter: "test_value",
});
```

## Performance Optimization

### Script Loading

- Async script loading
- No blocking of page rendering
- Efficient event processing

### Event Batching

- Batch events for efficiency
- Reduce network requests
- Optimize data transmission

### Caching

- Cache GA4 configuration
- Optimize script loading
- Reduce initialization time

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Development Team
