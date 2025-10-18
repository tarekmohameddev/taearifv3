# GA4 Wildcard Domain Setup for Multi-Tenant Websites

## Overview

This guide explains how to configure Google Analytics 4 (GA4) for a multi-tenant website builder with wildcard subdomains.

## Domain Structure

### Main Domain (Not Tracked)
- `www.mandhoor.com` ❌
- `mandhoor.com` ❌

### Tenant Subdomains (Tracked)
- `vcvkkokk.mandhoor.com` ✅
- `anotherTenant.mandhoor.com` ✅
- `hey.mandhoor.com` ✅
- `samy.mandhoor.com` ✅

## GA4 Configuration

### 1. Create Data Stream

1. Go to Google Analytics → Admin
2. Select your property
3. Go to **Data Streams** → **Web**
4. Click **Add stream**

### 2. Configure Data Stream

**Website URL**: `https://*.mandhoor.com`
**Stream name**: `Multi-Tenant Websites`
**Enhanced measurement**: Enable all options

### 3. Configure Custom Dimensions

1. Go to **Custom Definitions** → **Custom Dimensions**
2. Create dimension:
   - **Dimension name**: `Tenant ID`
   - **Scope**: Event
   - **Event parameter**: `tenant_id`

### 4. Configure Data Filters

1. Go to **Data Settings** → **Data Filters**
2. Create filter:
   - **Filter name**: `Exclude Main Domain`
   - **Filter type**: Internal traffic
   - **Filter conditions**: 
     - Hostname equals `www.mandhoor.com`
     - Hostname equals `mandhoor.com`

## Code Implementation

### 1. Domain Checking Logic

```typescript
const shouldTrackDomain = (domain: string): boolean => {
  // Don't track main domain
  if (domain === 'www.mandhoor.com' || domain === 'mandhoor.com') {
    return false;
  }
  
  // Track tenant subdomains
  if (domain.endsWith('.mandhoor.com')) {
    return true;
  }
  
  // Track localhost for development
  if (domain === 'localhost' || domain.includes('localhost')) {
    return true;
  }
  
  return false;
};
```

### 2. GA4 Configuration

```typescript
window.gtag('config', ga4Id, {
  custom_map: {
    'dimension1': 'tenant_id'
  },
  // Set cookie domain for wildcard
  cookie_domain: '.mandhoor.com',
  // Set transport type
  transport_type: 'beacon'
});
```

### 3. Event Tracking

```typescript
// Track page view with tenant context
window.gtag('event', 'page_view', {
  tenant_id: tenantId,
  page_path: pagePath,
  page_title: document.title
});
```

## Testing

### 1. Test Tenant Subdomains

Visit these URLs and check GA4 Real-time:
- `https://vcvkkokk.mandhoor.com/ar/`
- `https://anotherTenant.mandhoor.com/ar/`
- `https://hey.mandhoor.com/ar/`

**Expected**: Events appear in GA4 Real-time

### 2. Test Main Domain

Visit these URLs and check GA4 Real-time:
- `https://www.mandhoor.com/`
- `https://mandhoor.com/`

**Expected**: No events in GA4 Real-time

### 3. Console Verification

Open Developer Tools → Console and look for:

**Tenant Subdomains**:
```
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
📊 GA4: Tracking page view
```

**Main Domain**:
```
🚫 GA4: Skipping tracking for domain: www.mandhoor.com
```

## GA4 Dashboard Configuration

### 1. Create Custom Report

1. Go to **Explore** → **Free form**
2. Add dimensions:
   - **Page path**
   - **Custom dimension 1** (Tenant ID)
3. Add metrics:
   - **Event count**
   - **Users**

### 2. Create Audience

1. Go to **Configure** → **Audiences**
2. Create audience:
   - **Name**: `Tenant Users`
   - **Condition**: Custom dimension 1 is not null

### 3. Create Conversion

1. Go to **Configure** → **Conversions**
2. Create conversion:
   - **Name**: `Property View`
   - **Event name**: `property_view`

## Advanced Configuration

### 1. Cross-Domain Tracking

```typescript
window.gtag('config', ga4Id, {
  custom_map: {
    'dimension1': 'tenant_id'
  },
  cookie_domain: '.mandhoor.com',
  transport_type: 'beacon',
  // Enable cross-domain tracking
  linker: {
    domains: ['*.mandhoor.com']
  }
});
```

### 2. Enhanced E-commerce

```typescript
// Track property views as e-commerce events
window.gtag('event', 'view_item', {
  currency: 'USD',
  value: propertyPrice,
  items: [{
    item_id: propertyId,
    item_name: propertyName,
    category: 'Real Estate',
    quantity: 1,
    price: propertyPrice
  }]
});
```

### 3. User Journey Tracking

```typescript
// Track user journey across tenants
window.gtag('event', 'tenant_switch', {
  tenant_id: newTenantId,
  previous_tenant: previousTenantId,
  page_path: window.location.pathname
});
```

## Monitoring

### 1. Real-time Monitoring

- Check GA4 Real-time → Overview
- Verify tenant subdomains are tracked
- Verify main domain is excluded

### 2. Custom Reports

- Create reports by tenant
- Monitor tenant performance
- Track user behavior across tenants

### 3. Alerts

- Set up alerts for tracking issues
- Monitor data quality
- Track conversion rates

## Troubleshooting

### Common Issues

1. **Main domain being tracked**
   - Check domain filtering logic
   - Verify GA4 configuration
   - Check console messages

2. **Tenant subdomains not tracked**
   - Check wildcard configuration
   - Verify cookie domain settings
   - Check network requests

3. **Data not appearing**
   - Wait 24-48 hours
   - Check GA4 property settings
   - Verify custom dimensions

### Debug Commands

```javascript
// Check domain tracking
console.log('Domain tracking:', shouldTrackDomain(window.location.hostname));

// Check GA4 status
console.log('GA4 Status:', {
  dataLayer: window.dataLayer,
  gtag: typeof window.gtag,
  domain: window.location.hostname
});

// Manual event test
window.gtag('event', 'test_event', {
  tenant_id: 'test-tenant',
  test_parameter: 'test_value'
});
```

## Security Considerations

### 1. Data Privacy

- No personal data collection
- Tenant ID only for business analytics
- GDPR compliant implementation

### 2. Access Control

- Restrict GA4 access to authorized users
- Use proper authentication
- Monitor access logs

### 3. Data Retention

- Set appropriate data retention periods
- Comply with privacy regulations
- Regular data cleanup

## Performance Optimization

### 1. Script Loading

- Async script loading
- No blocking of page rendering
- Efficient event processing

### 2. Event Batching

- Batch events for efficiency
- Reduce network requests
- Optimize data transmission

### 3. Caching

- Cache GA4 configuration
- Optimize script loading
- Reduce initialization time

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Development Team
