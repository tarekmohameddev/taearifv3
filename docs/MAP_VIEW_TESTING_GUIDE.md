# Map View Testing Guide

## Quick Start

The map-based view has been successfully implemented for the properties management page. Follow these steps to test it:

## Accessing the Map View

1. **Navigate to Properties Page**
   ```
   http://localhost:3000/ar/dashboard/properties
   ```
   (or port 3001 if 3000 is in use)

2. **Switch to Map View**
   - Look for three toggle buttons in the top right area of the properties management page
   - Click the **Map icon** (third button) to switch to map view
   - The Grid (grid icon) and List (list icon) buttons are also available

## Features to Test

### 1. Basic Map Display
- ✅ Map should load and display OpenStreetMap tiles
- ✅ Property markers should appear as white price tags on the map
- ✅ The map should automatically zoom to fit all markers

### 2. Property Sidebar
- ✅ Left sidebar shows scrollable list of properties
- ✅ Each card shows: image, title, address, price, bedrooms, bathrooms, size
- ✅ Property count badge shows total properties with coordinates
- ✅ "للبيع" or "للإيجار" badge displays correctly

### 3. Interactions

#### Marker Interactions
- ✅ **Hover on marker**: Marker should scale up and turn dark
- ✅ **Click on marker**: Property details popup appears
- ✅ **Popup close button**: X button closes the popup

#### Card Interactions
- ✅ **Hover on card**: 
  - Card gets highlighted with ring
  - Corresponding marker on map highlights
- ✅ **Click on card**: Navigates to property details page
- ✅ **Favorite button**: Heart icon toggles favorite state
- ✅ **Share button**: Opens share dialog
- ✅ **View button**: Navigates to property details

### 4. Search Functionality
- ✅ **Search box**: Located at top-left of map
- ✅ **Enter location**: Type a location in Saudi Arabia
- ✅ **Submit search**: Click search button or press Enter
- ✅ **Map pans**: Map should pan to the searched location

### 5. Mobile Responsiveness

#### Test on Mobile Viewport (< 1024px)
- ✅ **Initial state**: Sidebar should be hidden, map full screen
- ✅ **Toggle button**: Top-right button to show sidebar
- ✅ **Show List button**: Bottom-center button showing property count
- ✅ **Sidebar slide**: Sidebar slides in from right
- ✅ **Close sidebar**: ChevronRight button closes sidebar
- ✅ **Property popup**: Appears at bottom of screen

#### Test on Desktop Viewport (≥ 1024px)
- ✅ **Split view**: Sidebar (450px) and map side-by-side
- ✅ **Sidebar always visible**: No toggle needed
- ✅ **Property popup**: Appears near top of map

### 6. Edge Cases

#### Properties Without Coordinates
- ✅ If no properties have coordinates: Shows empty state message
- ✅ If some properties lack coordinates: Only shows those with valid coordinates
- ✅ Property count reflects only those with coordinates

#### Many Properties (100+)
- ✅ Map should handle many markers
- ✅ Sidebar should scroll smoothly
- ✅ No performance issues

#### Network Issues
- ✅ Map tiles fail to load: Shows gray background
- ✅ Search fails: No error crash, search continues to work
- ✅ Geocoding timeout: Loading indicator stops

## Browser Testing

Test in the following browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Limitations

1. **Geocoding Rate Limit**: OpenStreetMap Nominatim has rate limits (1 req/sec)
2. **Coordinate Requirement**: Properties must have latitude/longitude data
3. **Internet Required**: Map tiles and search require internet connection

## Common Issues and Solutions

### Issue: Map doesn't load
**Solution**: 
- Check browser console for errors
- Ensure Leaflet CSS is loaded
- Clear browser cache and reload

### Issue: Markers don't appear
**Solution**:
- Check if properties have valid coordinates
- Open browser console and check for JavaScript errors
- Verify property data structure matches expected format

### Issue: Search doesn't work
**Solution**:
- Check internet connection
- Try simpler search terms (e.g., "Riyadh" instead of full address)
- Check browser console for API errors

### Issue: Sidebar doesn't toggle on mobile
**Solution**:
- Ensure viewport is < 1024px width
- Check if button is visible
- Try refreshing the page

### Issue: Markers not highlighting on hover
**Solution**:
- Check if property IDs are unique
- Verify hover state is being set
- Check browser console for warnings

## Performance Testing

### Load Time
- Initial map render: < 2 seconds
- Marker rendering (50 properties): < 1 second
- Sidebar rendering: < 1 second

### Interactions
- Marker hover response: Instant
- Card click navigation: < 500ms
- Search geocoding: 1-3 seconds (network dependent)

## Reporting Issues

If you find any issues, please note:
1. Browser and version
2. Viewport size (if responsive issue)
3. Steps to reproduce
4. Expected vs actual behavior
5. Console errors (if any)
6. Screenshots (if visual issue)

## Next Steps

After testing, consider these enhancements:
1. Add marker clustering for better performance
2. Integrate with existing filters
3. Add drawing tools for area selection
4. Implement property comparison on map
5. Add heatmap view option

## Success Criteria

The implementation is successful if:
- ✅ Map loads and displays all properties with coordinates
- ✅ All interactions work smoothly
- ✅ Responsive design works on mobile and desktop
- ✅ No console errors
- ✅ Performance is acceptable
- ✅ User experience matches Airbnb-style expectations

---

**Implementation Complete**: The map-based view is now available on `/ar/dashboard/properties`. Switch to map view using the map icon toggle button.
