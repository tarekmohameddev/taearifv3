# Map View Implementation for Properties Management

## Overview

This document describes the implementation of an Airbnb-style map-based view for browsing properties on the `/ar/dashboard/properties` page.

## Features Implemented

### 1. **Map View Toggle**
- Added a third view mode option: **Map** (alongside Grid and List views)
- Users can switch between Grid, List, and Map views using icon buttons
- The selected view mode is persisted in the application state

### 2. **Interactive Map Display**
- **Map Library**: Uses Leaflet.js with OpenStreetMap tiles
- **Custom Markers**: Properties are displayed as price markers on the map
- **Marker Styling**: 
  - White background with price in SAR
  - Hover effect: Dark background with scale animation
  - Selected state: Highlighted with ring
- **Map Controls**: Zoom controls and search functionality

### 3. **Split View Layout (Airbnb-style)**
- **Left Sidebar** (450px wide on desktop):
  - Scrollable list of property cards
  - Shows properties with valid coordinates
  - Property count badge
  - Compact card design with image, title, price, and features
- **Right Side**: Full map view with markers

### 4. **Property Cards in Sidebar**
- **Card Information**:
  - Property thumbnail image
  - Title and address
  - Price in SAR format
  - Bedrooms, bathrooms, and size
  - Transaction type badge (للبيع/للإيجار)
- **Interactive Features**:
  - Click to view property details
  - Hover to highlight marker on map
  - Favorite toggle button
  - Share button
  - View details button

### 5. **Map Interactions**
- **Click on Marker**: Shows property details popup
- **Hover on Card**: Highlights corresponding marker
- **Hover on Marker**: Highlights corresponding card
- **Property Popup**: 
  - Shows at bottom on mobile
  - Shows at top on desktop
  - Contains property image, title, address, price
  - "View Details" button

### 6. **Search Functionality**
- Search box overlaid on the map
- Uses OpenStreetMap Nominatim API for geocoding
- Searches within Saudi Arabia (countrycodes=sa)
- Pans map to searched location

### 7. **Mobile Responsiveness**
- **Toggleable Sidebar**: 
  - Slides in/out on mobile devices
  - Always visible on desktop
  - Toggle button on map
- **"Show List" Button**: 
  - Appears at bottom of map on mobile
  - Shows property count
  - Opens sidebar when clicked
- **Property Popup**: 
  - Positioned at bottom on mobile
  - Positioned at top on desktop
  - Slide-in animation

### 8. **Property Filtering**
- Only shows properties with valid coordinates (latitude/longitude)
- Displays count of properties with coordinates
- Empty state when no properties have coordinates

## Technical Implementation

### Files Created/Modified

1. **Created: `components/property/properties-map-view.tsx`**
   - Main map view component
   - Handles map initialization, markers, and interactions
   - Responsive layout with sidebar and map

2. **Modified: `components/property/properties-management-page.tsx`**
   - Added Map icon import
   - Added map view button
   - Updated setViewMode to accept "map" type
   - Conditional rendering for map view
   - Imported PropertiesMapView component

3. **Modified: `context/store/propertiesManagement.js`**
   - Updated viewMode comment to include "map" option

### Dependencies Used

- **leaflet**: Map rendering library
- **react-leaflet**: React wrapper for Leaflet (already installed)
- **lucide-react**: Icons
- **OpenStreetMap**: Tile provider
- **Nominatim API**: Geocoding service

### Key Components

#### PropertiesMapView Component

```typescript
interface PropertiesMapViewProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onToggleFavorite?: (propertyId: string | number) => void;
  onShare?: (property: Property) => void;
  favorites?: (string | number)[];
}
```

**State Management**:
- `selectedProperty`: Currently selected property for popup
- `hoveredProperty`: Property being hovered for marker highlighting
- `mapInitialized`: Map loading state
- `searchQuery`: Search input value
- `isSearching`: Search loading state
- `showSidebar`: Sidebar visibility (mobile)

**Key Functions**:
- `handleSearch`: Geocodes location and pans map
- `handleCardClick`: Navigates to property details
- `formatPrice`: Formats price in SAR currency

### Map Marker Implementation

- **Custom Markers**: Created using Leaflet's `divIcon`
- **Price Display**: Shows formatted price in SAR
- **Hover Effect**: Scale transform and background color change
- **Click Handler**: Opens property details popup
- **Bounds Fitting**: Automatically fits all markers in view

### Responsive Design

#### Desktop (lg+)
- Split view: Sidebar (450px) + Map (flex-1)
- Sidebar always visible
- Property popup at top of map

#### Mobile
- Full-width map
- Sidebar slides in from right
- Toggle button to show/hide sidebar
- "Show List" button at bottom center
- Property popup at bottom of map

## Usage

1. Navigate to `/ar/dashboard/properties`
2. Click the **Map icon** button in the view mode toggles
3. Browse properties on the map:
   - **Click markers** to see property details
   - **Hover on cards** to highlight markers
   - **Use search** to find locations
   - **Click "Show List"** (mobile) to view property cards
4. Click **"View Details"** to navigate to property page

## Data Requirements

Properties must have the following coordinate data:
- `property.location.latitude` or `property.latitude`
- `property.location.longitude` or `property.longitude`

Properties without valid coordinates are filtered out and not displayed on the map.

## Future Enhancements

Potential improvements for future iterations:

1. **Clustering**: Add marker clustering for better performance with many properties
2. **Filter Integration**: Apply existing filters to map view
3. **Draw Tools**: Allow users to draw boundaries to filter properties
4. **Heatmap**: Show property density heatmap
5. **Street View**: Integration with Google Street View
6. **Custom Map Styles**: Dark mode map tiles
7. **Save Map State**: Remember zoom level and center position
8. **Property Tooltips**: Show quick info on marker hover
9. **Batch Selection**: Select multiple properties on map
10. **Print Map**: Export map view as PDF/image

## Performance Considerations

- **Lazy Loading**: Map component is dynamically imported with SSR disabled
- **Marker Updates**: Only updates markers when properties or hover state changes
- **Efficient Rendering**: Uses React hooks for optimal re-rendering
- **Debounced Search**: Could be added for search input
- **Virtual Scrolling**: Consider for large property lists

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Requires internet connection for map tiles and geocoding

## API Usage

### OpenStreetMap Nominatim
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Usage Policy**: Fair use policy applies
- **Rate Limiting**: Max 1 request per second
- **Attribution**: Required by OpenStreetMap license

## Styling

### Custom CSS Classes
- `.property-marker`: Custom marker styling
- `.property-marker.hovered`: Hovered marker state
- `.custom-marker-icon`: Leaflet icon wrapper

### Animations
- Marker hover: Scale and shadow
- Popup: Slide-in from bottom
- Sidebar: Slide transform

## Accessibility

- Keyboard navigation support
- Screen reader labels (sr-only)
- ARIA labels on buttons
- Focus management
- Color contrast compliance

## Testing Checklist

- [ ] Map loads correctly
- [ ] Markers appear for all properties with coordinates
- [ ] Clicking marker shows popup
- [ ] Clicking card navigates to property
- [ ] Hover interactions work
- [ ] Search functionality works
- [ ] Mobile sidebar toggles correctly
- [ ] Responsive layout on all screen sizes
- [ ] No console errors
- [ ] Performance is acceptable with 100+ properties

## Conclusion

The map view implementation provides a modern, Airbnb-style interface for browsing properties visually. The split-view layout, interactive markers, and responsive design create an intuitive user experience for employees managing properties.
