# Demo Properties for Map View

## Overview

To make it easy to test and demonstrate the map-based view, **15 demo properties** with valid Riyadh coordinates have been automatically added to the map view.

## Features

### 🗺️ Automatic Demo Properties
- **15 high-quality demo properties** are automatically added when you open the map view
- Each property has **valid Riyadh coordinates** (latitude/longitude)
- Properties are distributed across different neighborhoods in Riyadh
- Include both **للبيع (sale)** and **للإيجار (rent)** properties
- Feature **realistic prices, images, and property details**

### 🎯 Smart Detection
The system intelligently adds demo properties when:
- **No existing properties** have valid coordinates
- **Fewer than 5 properties** exist in the system
- **Only when map view is active** (not in grid/list views)

### 📍 Property Distribution

Demo properties are located in various Riyadh neighborhoods:
1. حي الملقا (Al Malqa)
2. حي النرجس (Al Narjis)
3. حي العليا (Al Olaya)
4. حي الورود (Al Wurud)
5. حي الياسمين (Al Yasmin)
6. حي الربوة (Al Rabwa)
7. حي الندى (Al Nada)
8. حي الريان (Al Rayyan)
9. حي الملز (Al Malaz)
10. حي الصحافة (Al Sahafa)
11. حي الروضة (Al Rawdah)
12. حي السليمانية (Al Sulimaniyah)
13. حي الغدير (Al Ghadeer)
14. حي المروج (Al Murooj)
15. حي الفلاح (Al Falah)

## Property Details

Each demo property includes:
- ✅ **Valid coordinates** (latitude & longitude)
- ✅ **Beautiful stock images** from Unsplash
- ✅ **Realistic prices** (ranging from 28,000 SAR to 4,200,000 SAR)
- ✅ **Property specs**: Bedrooms, bathrooms, size (sqm)
- ✅ **Transaction type**: Sale or rent
- ✅ **Arabic titles and addresses**
- ✅ **Status**: All active/published

## How It Works

### File Structure
```
utils/demoPropertiesHelper.js
├── demoProperties[]        // Array of 15 demo properties
├── addDemoProperties()     // Function to merge demo with real properties
└── getDemoProperties()     // Function to get only demo properties
```

### Integration
```javascript
// In properties-management-page.tsx
const normalizedProperties = useMemo(() => {
  // Add demo properties when in map view
  const propertiesWithDemo = viewMode === "map" 
    ? addDemoProperties(properties, true)
    : properties;

  return propertiesWithDemo.map((property: any) => ({
    ...property,
    status: normalizeStatus(property.status),
  }));
}, [properties, viewMode]);
```

## Usage

### Viewing Demo Properties

1. **Navigate to** `/ar/dashboard/properties`
2. **Click the Map icon** to switch to map view
3. **See demo properties** automatically appear on the map
4. **Interact with markers** to see property details

### Demo Property IDs
All demo properties have IDs prefixed with `"demo-"`:
- `demo-1`, `demo-2`, ..., `demo-15`

This ensures they don't conflict with real property IDs from the database.

## Customization

### Disabling Demo Properties

To disable demo properties in production:

```javascript
// In properties-management-page.tsx
const propertiesWithDemo = viewMode === "map" && process.env.NODE_ENV === 'development'
  ? addDemoProperties(properties, true)
  : properties;
```

### Adding More Demo Properties

Edit `utils/demoPropertiesHelper.js`:

```javascript
export const demoProperties = [
  // ... existing properties
  {
    id: "demo-16",
    title: "Your Property Title",
    address: "Property Address",
    price: 500000,
    thumbnail: "image-url",
    featured_image: "image-url",
    bedrooms: 3,
    bathrooms: 2,
    size: 150,
    listingType: "للبيع",
    transaction_type: "sale",
    status: "منشور",
    location: {
      latitude: 24.7136,  // Your coordinates
      longitude: 46.6753,
    },
    latitude: 24.7136,
    longitude: 46.6753,
  },
];
```

### Changing Demo Images

The demo properties use high-quality images from Unsplash:
- Replace URLs in `demoProperties` array
- Use format: `https://images.unsplash.com/photo-{id}?w=800`

## Benefits

### 🎯 For Testing
- **Instant testing** without database setup
- **Verify map functionality** immediately
- **Test hover interactions** with multiple properties
- **Check marker clustering** and zoom behavior

### 👥 For Demonstrations
- **Show clients** the map view feature
- **Demo to team members** without real data
- **Present in meetings** with realistic examples
- **Training purposes** for new employees

### 🚀 For Development
- **Frontend development** without backend dependency
- **Test UI changes** quickly
- **Verify responsive design** with data
- **Debug map interactions** easily

## Image Attribution

Demo property images are from Unsplash (free to use):
- **Source**: https://unsplash.com
- **License**: Unsplash License (free for commercial use)
- **No attribution required** (but appreciated)

## Price Range

Demo properties cover various price points:
- **Rental**: 28,000 SAR - 45,000 SAR/year
- **Sale**: 580,000 SAR - 4,200,000 SAR

## Property Types

Mix of different property types:
- شقة (Apartments) - 10 properties
- فيلا (Villas) - 4 properties  
- دوبلكس (Duplex) - 1 property

## Technical Details

### Coordinates Format
```javascript
{
  location: {
    latitude: 24.7136,   // Primary storage
    longitude: 46.6753,
  },
  latitude: 24.7136,     // Fallback for compatibility
  longitude: 46.6753,
}
```

### Map View Detection
Demo properties are only added when:
```javascript
viewMode === "map"  // User is viewing map
```

### Smart Merging
The `addDemoProperties()` function:
1. Checks if existing properties have coordinates
2. Counts total properties
3. Adds demos only if needed (< 5 properties or no coordinates)
4. Returns combined array

## Troubleshooting

### Demo properties not showing?
1. **Check view mode**: Must be in "map" view
2. **Verify import**: Check if `demoPropertiesHelper` is imported
3. **Console log**: Check browser console for errors

### Wrong coordinates?
- All coordinates are for **Riyadh, Saudi Arabia**
- Range: Lat 24.6-24.9, Lng 46.5-46.8
- Verify in map they're within Riyadh bounds

### Images not loading?
- Check internet connection (Unsplash CDN)
- Verify URLs are accessible
- Check browser's network tab for 404 errors

## Future Enhancements

Possible improvements:
1. **More demo properties** (50-100 properties)
2. **Different cities** (Jeddah, Dammam, Mecca)
3. **Property categories** (residential, commercial, land)
4. **Seasonal pricing** (different price variations)
5. **Featured properties** flag
6. **User preferences** (remember if user wants demos)

## Production Considerations

For production deployment:
- ✅ Demo properties are **harmless** (just for display)
- ✅ Don't affect **real data** in database
- ✅ Only visible in **map view**
- ✅ Have unique IDs (`demo-*`)
- ⚠️ Consider disabling in production
- ⚠️ Or add "Demo" badge to demo properties

## Conclusion

The demo properties feature makes the map view **immediately usable** for testing, demonstrations, and development purposes without requiring a populated database. It provides a realistic viewing experience with **15 high-quality properties** distributed across Riyadh.

---

**Quick Start**: Just switch to map view - demo properties appear automatically! 🗺️✨
