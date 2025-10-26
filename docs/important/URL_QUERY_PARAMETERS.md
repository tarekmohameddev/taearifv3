# URL Query Parameters for Property Listing Pages

## Overview

The property listing pages (`/for-rent` and `/for-sale`) now support URL query parameters for filtering and searching. This allows users to:

- Share specific searches via URL
- Bookmark filtered results
- Navigate directly to pre-filtered property listings
- Auto-fill search forms from URL parameters

## Supported Query Parameters

### 1. `purpose` (string)
Transaction type: "rent" or "sale". Auto-added when using the search form.

**Example:**
```
/for-rent?purpose=rent
/for-sale?purpose=sale
```

### 2. `city_id` (string)
Filter properties by city ID.

**Example:**
```
/for-rent?city_id=5
```

### 3. `state_id` (string)
Filter properties by state/district ID.

**Example:**
```
/for-sale?state_id=10200005003
```

### 4. `max_price` (string)
Filter properties by maximum price.

**Example:**
```
/for-rent?max_price=5000
```

### 5. `category_id` (string)
Filter properties by category ID.

**Example:**
```
/for-sale?category_id=3
```

### 6. `type_id` (string)
Filter properties by property type.

**Example:**
```
/for-rent?type_id=شقة
```

### 7. `search` (string)
Search properties by city name or general search keyword.

**Example:**
```
/for-sale?search=الرياض
```

**Note:** The search parameter is used for general text search across property locations and descriptions.

## Combined Parameters

Multiple parameters can be combined in a single URL:

```
/for-rent?purpose=rent&city_id=5&state_id=10200005003&max_price=5000&category_id=3
```

## How It Works

### Architecture

1. **Custom Hook (`useUrlFilters`)**
   - Location: `hooks-liveeditor/use-url-filters.ts`
   - Reads URL query parameters
   - Syncs parameters with Zustand properties store
   - Provides navigation utilities
   - Uses `useEffect` to automatically react to URL changes

2. **Hero Component (`hero1.tsx`)**
   - Reads URL parameters on mount
   - Auto-fills search form fields
   - Submits form with URL parameters
   - Navigates to listing page with filters

3. **Grid Component (`grid1.tsx`)**
   - Applies URL parameters on mount
   - Triggers automatic property fetch
   - Updates when URL changes

4. **Properties Store (`store/propertiesStore.ts`)**
   - Manages filter state
   - Handles API requests with filters
   - Returns filtered results
   - Sends `search` and `type_id` parameters to API

5. **Middleware (`middleware.ts`)**
   - **CRITICAL:** Preserves query parameters during locale redirect
   - Redirects `/for-rent?params` to `/ar/for-rent?params` (keeps params!)
   - Without this fix, parameters are lost during locale redirect
   - See also: `docs/important/LOCALE_ROUTING_SYSTEM.md` for locale system details

### Data Flow

```
URL Parameters
    ↓
useUrlFilters Hook
    ↓
Properties Store (Zustand)
    ↓
API Request with Filters
    ↓
Backend Endpoint
    ↓
Filtered Results
    ↓
Grid Component Display
```

## Implementation Details

### 1. URL to Store Sync

When a user visits a URL with parameters:

```typescript
// Example: /for-rent?city_id=5&max_price=5000

// useUrlFilters reads params and updates store
setCityId("5");
setPrice("5000");
setTransactionType("rent");

// Then triggers search
fetchProperties(1);
```

### 2. Form to URL Navigation

When a user submits the search form:

```typescript
// Form values are collected
const filters = {
  city_id: "5",
  max_price: "5000",
};

// Navigation with parameters
navigateWithFilters("rent", filters);
// Result: /for-rent?city_id=5&max_price=5000
```

### 3. Auto-fill from URL

Search form fields are populated from URL parameters:

```typescript
// URL: /for-rent?search=الرياض&max_price=5000

// Form state initialization
const [city, setCity] = useState(searchParams.get("search") || "");
const [price, setPrice] = useState(searchParams.get("max_price") || "");

// Result: Form shows "الرياض" and "5000"
```

## Testing Instructions

### Test 1: Direct URL Access with Single Parameter

1. Navigate to: `http://your-domain.com/for-rent?city_id=5`
2. **Expected Results:**
   - Hero search form auto-fills with city ID
   - Properties are automatically filtered by city_id=5
   - Results display immediately without manual search
   - URL remains unchanged

### Test 2: Direct URL Access with Multiple Parameters

1. Navigate to: `http://your-domain.com/for-sale?city_id=5&state_id=10200005003&max_price=5000&category_id=3`
2. **Expected Results:**
   - All form fields auto-fill correctly
   - Properties filtered by all parameters
   - Results match all criteria
   - Pagination reflects filtered results

### Test 3: Search Form Submission

1. Go to homepage or listing page
2. Fill in search form (city, type, price)
3. Submit form
4. **Expected Results:**
   - URL updates with query parameters
   - Browser history includes the new URL
   - Properties display based on filters
   - Shareable URL created

### Test 4: Shareable URLs

1. Copy URL with parameters: `/for-rent?city_id=5&max_price=5000`
2. Share with another user or open in new tab
3. **Expected Results:**
   - Same filtered results appear
   - Form auto-fills with parameters
   - Consistent experience across sessions

### Test 5: URL Parameter Modification

1. Start with: `/for-rent?max_price=5000`
2. Manually edit URL to: `/for-rent?max_price=3000`
3. Press Enter
4. **Expected Results:**
   - Results update to new price filter
   - Form updates to show 3000
   - New API request triggered

### Test 6: Pagination with Filters

1. Navigate to: `/for-rent?city_id=5&max_price=5000`
2. Click to page 2
3. **Expected Results:**
   - URL includes both filters and page parameter
   - Results on page 2 still respect filters
   - Pagination state maintained

### Test 7: Empty Parameters

1. Navigate to: `/for-rent`
2. **Expected Results:**
   - Show all properties for rent
   - No auto-filtering applied
   - Form fields empty/default

### Test 8: Invalid Parameters

1. Navigate to: `/for-rent?invalid_param=test`
2. **Expected Results:**
   - Invalid parameters ignored
   - Normal listing page loads
   - No errors displayed

### Test 9: Browser Back/Forward

1. Navigate to: `/for-rent?city_id=5`
2. Change to: `/for-rent?city_id=10`
3. Press browser back button
4. **Expected Results:**
   - Returns to city_id=5
   - Results update accordingly
   - Form updates to match

### Test 10: Both Pages

Test same functionality on both:
- `/for-rent` (rent properties)
- `/for-sale` (sale properties)

**Expected Results:**
- Both pages work identically
- TransactionType determined by route
- Filters work consistently

## Backend Integration

### API Endpoint

The backend endpoint should accept these parameters:

```
GET /v1/tenant-website/{tenantId}/properties
```

**Query Parameters:**
- `page`: Page number (pagination)
- `purpose`: Transaction type ("rent" or "sale")
- `city_id`: City filter
- `state_id`: District/state filter
- `max_price`: Maximum price filter
- `category_id`: Category filter
- `status`: Property status filter
- `search`: Search term (optional)

**Example Request:**
```
GET /v1/tenant-website/123/properties?purpose=rent&city_id=5&state_id=10200005003&max_price=5000&category_id=3&page=1
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "total": 50,
      "per_page": 20,
      "current_page": 1,
      "last_page": 3,
      "from": 1,
      "to": 20
    }
  }
}
```

### Backend Requirements Checklist

- [ ] Accept all query parameters
- [ ] Apply filters to database query
- [ ] Return paginated results
- [ ] Handle empty/missing parameters gracefully
- [ ] Validate parameter values
- [ ] Return proper error messages
- [ ] Support combined filters
- [ ] Maintain good performance with filters

## Troubleshooting

### Issue: Parameters not applying

**Solution:**
- Check console for errors
- Verify `useUrlFilters` hook is called in grid1
- Ensure properties store has correct filter fields
- Check API endpoint receives parameters

### Issue: Parameters lost after page load / URL opens without params

**Problem:** Middleware redirects to add locale (`/for-rent` → `/ar/for-rent`) but loses query parameters.

**Root Cause:** `middleware.ts` was not preserving `request.nextUrl.search` during locale redirect.

**Solution Applied (Line 329-331 in middleware.ts):**
```typescript
// FIXED: Preserve query parameters during locale redirect
const searchParams = request.nextUrl.search; // Get ?key=value
const newUrl = new URL(`/${locale}${pathname}${searchParams}`, request.url);
return NextResponse.redirect(newUrl);
```

**Before Fix:**
```
User navigates: /for-rent?purpose=rent&search=الرياض
Middleware redirects to: /ar/for-rent  ❌ (params lost!)
```

**After Fix:**
```
User navigates: /for-rent?purpose=rent&search=الرياض
Middleware redirects to: /ar/for-rent?purpose=rent&search=الرياض  ✅ (params preserved!)
```

**Test:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Fill search form and click search
4. Check URL bar - should contain all parameters

### Issue: Form not auto-filling

**Solution:**
- Verify hero1 component uses `useSearchParams`
- Check URL parameters are valid
- Ensure form state syncs with URL

### Issue: Pagination breaks filters

**Solution:**
- Verify pagination component preserves URL params
- Check store maintains filters during page changes
- Ensure API includes filters in paginated requests

### Issue: Shared URLs don't work

**Solution:**
- Test URL in incognito/private mode
- Verify backend accepts parameters
- Check tenant ID is valid
- Ensure properties exist for filters

## Code References

### Key Files

1. **Hook:** `hooks-liveeditor/use-url-filters.ts`
   - URL parameter management
   - Store synchronization
   - Navigation utilities

2. **Hero Component:** `components/tenant/hero/hero1.tsx`
   - Search form implementation
   - Parameter reading
   - Form submission

3. **Grid Component:** `components/tenant/grid/grid1.tsx`
   - Property display
   - Parameter application
   - Auto-fetch on URL change

4. **Properties Store:** `store/propertiesStore.ts`
   - Filter state management
   - API integration
   - Data fetching logic

5. **Property Filter:** `components/property-filter.tsx`
   - Alternative filter component
   - URL parameter support
   - Store integration

## Future Enhancements

### Potential Additions

1. **More Filter Parameters:**
   - `min_price`: Minimum price
   - `bedrooms`: Number of bedrooms
   - `bathrooms`: Number of bathrooms
   - `area_min`, `area_max`: Property area range

2. **Advanced Features:**
   - Filter presets/saved searches
   - URL shortening for sharing
   - Social media preview metadata
   - Analytics for popular filters

3. **UI Improvements:**
   - Active filter chips
   - Clear all filters button
   - Filter count badge
   - Filter suggestions

## Best Practices

1. **Always validate parameters** before applying
2. **Use consistent parameter names** across frontend and backend
3. **Handle errors gracefully** when invalid parameters provided
4. **Preserve filters** during pagination and navigation
5. **Test thoroughly** with different parameter combinations
6. **Document** any new parameters added
7. **Consider SEO** implications of parameter URLs
8. **Maintain backwards compatibility** when updating parameters

## Support

For issues or questions:
- Check this documentation first
- Review code references above
- Test with provided test cases
- Check console logs for errors
- Verify backend API responses

---

**Last Updated:** October 26, 2025
**Version:** 1.0.0

