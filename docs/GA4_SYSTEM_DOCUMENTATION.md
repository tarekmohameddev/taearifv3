# GA4 Analytics System Documentation

## Overview

This document provides comprehensive documentation for the Google Analytics 4 (GA4) implementation in the website builder dashboard project. The system is designed to track user interactions across tenant websites with custom dimensions and event tracking.

## Architecture

### Core Components

1. **GA4Provider** - React component wrapper for GA4 initialization
2. **ga4-tracking.ts** - Core tracking functions and utilities
3. **GTMProvider** - Google Tag Manager integration
4. **Environment Configuration** - Dynamic GA4 ID management

### System Flow

```
User visits page → GA4Provider initializes → GA4 script loads → Events tracked → Data sent to GA4
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA4_ID=G-WTN83NMVW1
NEXT_PUBLIC_GA4_LEGACY_ID=G-RVFKM2F9ZN

# Backend URL
NEXT_PUBLIC_Backend_URL=http://localhost:3001
```

### GA4 Setup in Google Analytics

1. Create a new GA4 property
2. Configure custom dimensions:
   - **Dimension 1**: `tenant_id` (Custom dimension for tenant identification)
3. Note the Measurement ID (format: G-XXXXXXXXXX)

## Implementation Details

### 1. GA4Provider Component

**Location**: `components/GA4Provider.tsx`

**Purpose**: Wraps application components and initializes GA4 tracking

**Key Features**:
- One-time GA4 initialization
- Automatic page view tracking
- Tenant context management
- State management for initialization status

**Usage**:
```tsx
<GA4Provider tenantId={tenantId}>
  <YourComponent />
</GA4Provider>
```

**Props**:
- `tenantId: string | null` - Unique identifier for the tenant
- `children: React.ReactNode` - Child components to wrap

### 2. Core Tracking Functions

**Location**: `lib/ga4-tracking.ts`

#### initializeGA4()
Initializes the GA4 tracking system with proper script loading and configuration.

**Features**:
- Dynamic GA4 ID from environment variables
- Script loading with error handling
- DataLayer initialization
- Custom dimension mapping

#### trackPageView(tenantId: string, pagePath: string)
Tracks page views with tenant context.

**Parameters**:
- `tenantId`: Unique tenant identifier
- `pagePath`: Current page path

**Events Sent**:
```javascript
{
  event: 'page_view',
  tenant_id: tenantId,
  page_path: pagePath,
  page_title: document.title
}
```

#### trackPropertyView(tenantId: string, propertySlug: string)
Tracks property page views for real estate listings.

**Parameters**:
- `tenantId`: Unique tenant identifier
- `propertySlug`: Property identifier

#### trackProjectView(tenantId: string, projectSlug: string)
Tracks project page views for real estate projects.

**Parameters**:
- `tenantId`: Unique tenant identifier
- `projectSlug`: Project identifier

#### trackContactForm(tenantId: string)
Tracks contact form submissions.

#### trackSearch(tenantId: string, searchTerm: string)
Tracks search queries within tenant websites.

### 3. GTMProvider Component

**Location**: `components/GTMProvider.tsx`

**Purpose**: Provides Google Tag Manager integration with GA4

**Features**:
- GA4 script injection
- Tenant-specific configuration
- Property and project view tracking
- Automatic event tracking

## Integration Points

### 1. HomePageWrapper
```tsx
<GA4Provider tenantId={tenantId}>
  <I18nProvider>
    {/* Homepage content */}
  </I18nProvider>
</GA4Provider>
```

### 2. TenantPageWrapper
```tsx
<GA4Provider tenantId={tenantId}>
  <I18nProvider>
    {/* Tenant-specific content */}
  </I18nProvider>
</GA4Provider>
```

### 3. PropertyPageWrapper
```tsx
<GA4Provider tenantId={tenantId}>
  <I18nProvider>
    {/* Property detail content */}
  </I18nProvider>
</GA4Provider>
```

### 4. ProjectPageWrapper
```tsx
<GA4Provider tenantId={tenantId}>
  <I18nProvider>
    {/* Project detail content */}
  </I18nProvider>
</GA4Provider>
```

## Event Tracking

### Automatic Events

1. **Page Views**: Tracked automatically on route changes
2. **Property Views**: Tracked when viewing property details
3. **Project Views**: Tracked when viewing project details

### Custom Events

1. **Contact Form Submissions**: Track form interactions
2. **Search Queries**: Track user search behavior
3. **User Interactions**: Track specific user actions

### Event Structure

All events include:
- `tenant_id`: Unique tenant identifier
- `page_path`: Current page path
- `page_title`: Current page title
- Custom event-specific parameters

## Data Flow

### 1. Initialization
```
Component Mount → GA4Provider → initializeGA4() → Script Load → Configuration
```

### 2. Event Tracking
```
User Action → trackXXX() → isGA4Ready() → gtag() → GA4
```

### 3. Error Handling
```
Script Load Error → Console Error → Retry Logic
GA4 Not Ready → Retry After 100ms → Success
```

## Debugging

### Console Messages

The system provides detailed console logging:

```
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
✅ GA4: Configuration complete
📊 GA4: Tracking page view
🚀 GA4: Tracking page view
```

### Network Tab Verification

1. Open Developer Tools → Network
2. Look for requests to `googletagmanager.com`
3. Verify correct GA4 ID in requests
4. Check for successful responses

### GA4 Real-time Verification

1. Open Google Analytics
2. Navigate to Real-time → Overview
3. Verify page views are appearing
4. Check custom dimensions are populated

## Troubleshooting

### Common Issues

#### 1. GA4 Not Initializing
**Symptoms**: No console messages, no network requests
**Solutions**:
- Check environment variables
- Restart development server
- Clear browser cache

#### 2. Events Not Sending
**Symptoms**: Console shows initialization but no tracking messages
**Solutions**:
- Verify GA4 ID is correct
- Check network connectivity
- Verify tenantId is provided

#### 3. Data Not Appearing in GA4
**Symptoms**: Events sent but no data in GA4
**Solutions**:
- Wait 24-48 hours for data processing
- Check GA4 property configuration
- Verify custom dimensions setup

### Debug Steps

1. **Check Environment Variables**
   ```bash
   echo $NEXT_PUBLIC_GA4_ID
   ```

2. **Verify Console Messages**
   - Look for initialization messages
   - Check for error messages
   - Verify tracking messages

3. **Network Tab Analysis**
   - Check for GA4 script requests
   - Verify successful responses
   - Look for event tracking requests

4. **GA4 Real-time Testing**
   - Open GA4 Real-time reports
   - Navigate through the application
   - Verify events appear in real-time

## Performance Considerations

### Script Loading
- GA4 script loads asynchronously
- No blocking of page rendering
- Error handling prevents crashes

### Event Batching
- Events are queued in dataLayer
- Automatic retry for failed events
- Efficient event processing

### Memory Management
- Single GA4 instance per page
- Proper cleanup on component unmount
- Efficient state management

## Security

### Data Privacy
- No personal data collection
- Tenant ID only for business analytics
- GDPR compliant implementation

### Environment Security
- GA4 ID stored in environment variables
- No hardcoded sensitive data
- Secure script loading

## Future Enhancements

### Planned Features
1. **Enhanced E-commerce Tracking**: Product views, cart events
2. **User Journey Analytics**: Complete user flow tracking
3. **A/B Testing Integration**: Experiment tracking
4. **Advanced Custom Events**: More granular tracking

### Scalability
- Multi-tenant architecture ready
- Horizontal scaling support
- Performance optimization

## Maintenance

### Regular Tasks
1. **Monitor GA4 Data**: Check for data consistency
2. **Update Dependencies**: Keep tracking libraries current
3. **Performance Monitoring**: Track script loading times
4. **Error Logging**: Monitor for tracking failures

### Updates
1. **GA4 ID Changes**: Update environment variables
2. **New Events**: Add tracking for new features
3. **Custom Dimensions**: Add new dimensions as needed
4. **Performance Optimization**: Improve loading times

## Support

### Documentation
- This documentation file
- Inline code comments
- Console logging for debugging

### Resources
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Integration](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Analytics Best Practices](https://reactjs.org/docs/optimizing-performance.html)

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Development Team
