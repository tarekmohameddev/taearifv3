# Custom Domain Support - Changelog

**Date**: December 28, 2024  
**Version**: 2.1  
**Feature**: Custom Domain Integration with API Username

---

## 🎯 Problem Statement

**Before**: Custom domains like `liraksa.com` would send the full domain name as `tenant_id` to GA4, resulting in:
- Inconsistent tracking between subdomain (`lira.taearif.com`) and custom domain (`liraksa.com`)
- Full domain names cluttering GA4 reports
- Difficulty in unifying analytics for the same tenant

**Example**:
```
Subdomain: lira.taearif.com → GA4 tenant_id: "lira"
Custom:    liraksa.com       → GA4 tenant_id: "liraksa.com"  ❌
```

---

## ✅ Solution

Fetch tenant data via `getTenant` API and use the `username` field from the response as `tenant_id` for custom domains.

**After**:
```
Subdomain: lira.taearif.com → GA4 tenant_id: "lira"
Custom:    liraksa.com       → API username: "lira" → GA4 tenant_id: "lira" ✅
```

---

## 📝 Changes Made

### 1. **components/GA4Provider.tsx**

**Added**:
- `domainType` prop to interface
- `useTenantStore` subscription
- Logic to use `username` from API for custom domains

```typescript
// NEW: Get username from tenantStore
const tenantData = useTenantStore((s) => s.tenantData);

// NEW: For custom domains, use username from API
if (domainType === 'custom' && tenantData?.username) {
  finalTenantId = tenantData.username;
  console.log('🌐 GA4: Using username from API for custom domain:', finalTenantId);
}
```

**Modified**:
- `shouldTrackDomain()` - Added custom domain detection regex
- Effect dependencies - Added `domainType` and `tenantData?.username`

---

### 2. **app/HomePageWrapper.tsx**

**Changed**:
```typescript
// Before
<GA4Provider tenantId={tenantId}>

// After
<GA4Provider tenantId={tenantId} domainType={domainType}>
```

---

### 3. **app/TenantPageWrapper.tsx**

**Changed**:
```typescript
// Before
<GA4Provider tenantId={tenantId}>

// After
<GA4Provider tenantId={tenantId} domainType={domainType}>
```

---

### 4. **app/property/[id]/page.tsx**

**Added**:
```typescript
const domainType = headersList.get("x-domain-type") as "subdomain" | "custom" | null;
```

**Updated interface**:
```typescript
interface PropertyPageWrapperProps {
  tenantId: string | null;
  domainType?: "subdomain" | "custom" | null;  // NEW
  propertySlug: string;
}
```

---

### 5. **app/property/[id]/PropertyPageWrapper.tsx**

**Added**:
```typescript
// Track property view with username for custom domains
useEffect(() => {
  if (tenantId && propertySlug) {
    const finalTenantId = domainType === 'custom' && tenantData?.username 
      ? tenantData.username 
      : tenantId;
    
    trackPropertyView(finalTenantId, propertySlug);
  }
}, [tenantId, propertySlug, domainType, tenantData?.username]);
```

---

### 6. **app/project/[id]/page.tsx**

**Added**:
```typescript
const domainType = headersList.get("x-domain-type") as "subdomain" | "custom" | null;
```

---

### 7. **app/project/[id]/ProjectPageWrapper.tsx**

**Added**:
```typescript
// Track project view with username for custom domains
useEffect(() => {
  if (tenantId && projectSlug) {
    const finalTenantId = domainType === 'custom' && tenantData?.username 
      ? tenantData.username 
      : tenantId;
    
    trackProjectView(finalTenantId, projectSlug);
  }
}, [tenantId, projectSlug, domainType, tenantData?.username]);
```

---

### 8. **lib/gtm.ts**

**Fixed**: Added validation to prevent sending `"www"` as tenant_id

**Added**:
```typescript
const reservedWords = [
  "www", "api", "admin", "app", "mail", 
  "ftp", "blog", "shop", "store", 
  "dashboard", "live-editor", "auth", 
  "login", "register"
];

// Validate subdomain before returning
if (!subdomain || subdomain.trim() === '' || reservedWords.includes(subdomain.toLowerCase())) {
  console.warn('⚠️ GTM: Invalid subdomain:', subdomain);
  return null;
}
```

---

## 📚 Documentation Updates

### 1. **docs/important/GA4/README.md**

**Updated**:
- Key Characteristics section
- Multi-Tenant Tracking Strategy
- Tracking Flow diagram
- Contact & Maintenance section (version 2.1)

**Added**:
- Custom Domain Support explanation
- API Integration notes
- Custom Domain Handling section with examples

---

### 2. **docs/important/GA4/ARCHITECTURE.md**

**Updated**:
- GA4Provider Component section
- Key Features list
- Props interface
- Code analysis with NEW markers
- Key Insights section

**Added**:
- Complete Custom Domain Integration section
- Custom Domain flow diagram
- Comparison table
- Console logs for debugging
- Benefits list
- Key Files Modified section

**Version**: Updated to 2.1

---

## 🔄 Data Flow

### Before (Custom Domain)
```
liraksa.com → Middleware: "liraksa.com" → GA4: "liraksa.com" ❌
```

### After (Custom Domain)
```
liraksa.com 
  → Middleware: "liraksa.com" + domainType: "custom"
  → fetchTenantData("liraksa.com")
  → API returns: { username: "lira", ... }
  → tenantStore: tenantData.username = "lira"
  → GA4Provider: domainType === 'custom' → use username
  → GA4: "lira" ✅
```

---

## 🧪 Testing

### How to Verify

1. **Open custom domain**: `https://liraksa.com/ar`

2. **Check Console** for:
   ```
   ✅ Middleware: Custom domain detected: liraksa.com
   ✅ Middleware: Domain type: custom
   🌐 GA4: Using username from API for custom domain: lira
   📊 Page view tracked: { path: "/ar", tenant_id: "lira" }
   ```

3. **Check Network Tab**:
   - Find `/g/collect` request
   - Verify `ep.tenant_id=lira` (not `liraksa.com`)

4. **Check GA4 Real-time**:
   - Should show `tenant_id: "lira"`
   - Not the full domain name

---

## 📊 Comparison Table

| Domain | Type | Middleware | API Call | API Response | GA4 tenant_id | Status |
|--------|------|------------|----------|--------------|---------------|--------|
| `www.taearif.com` | Base | `null` | ❌ | - | - | ❌ No tracking |
| `lira.taearif.com` | Subdomain | `"lira"` | ✅ | `username: "lira"` | `"lira"` | ✅ Works |
| `liraksa.com` | Custom | `"liraksa.com"` | ✅ | `username: "lira"` | **`"lira"`** | ✅ Fixed! |
| `hey.taearif.com` | Subdomain | `"hey"` | ✅ | `username: "hey"` | `"hey"` | ✅ Works |

---

## ✨ Benefits

1. **Consistent Tracking**: Same `tenant_id` regardless of domain type
2. **Clean Analytics**: No full domain names in GA4 reports
3. **Unified Data**: All tenant traffic under single identifier
4. **Scalable**: Works for any number of custom domains
5. **Maintainable**: Clear separation of concerns
6. **Debuggable**: Console logs at every step

---

## 🚀 Future Enhancements

Potential improvements (not implemented):

1. **Domain Normalization**: Remove `www.` prefix from custom domains
   ```typescript
   const normalizedHost = host.startsWith('www.') 
     ? host.replace('www.', '') 
     : host;
   ```

2. **Caching**: Cache API username to reduce requests
3. **Error Handling**: Fallback if API fails to return username
4. **Multiple Custom Domains**: Support multiple domains per tenant

---

## 📞 Support

For issues with custom domain tracking:

1. Check middleware logs for domain detection
2. Verify API response includes `username` field
3. Check GA4Provider console logs
4. Review Network tab for GA4 requests
5. Verify GA4 real-time reports

---

**Author**: Development Team  
**Reviewed**: December 28, 2024  
**Status**: ✅ Implemented and Documented




