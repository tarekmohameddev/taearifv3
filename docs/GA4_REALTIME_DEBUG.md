# GA4 Real-time Debugging Guide

## Problem Description
GA4 Real-time dashboard shows 0 views even though the website is being visited from the browser.

## Common Causes & Solutions

### 1. Ad Blockers & Privacy Extensions
**Problem**: Browser extensions block GA4 tracking
**Solutions**:
- Disable Ad Blocker temporarily
- Add website to Ad Blocker whitelist
- Try different browser (Chrome, Firefox, Safari)
- Test in Incognito/Private mode

### 2. Browser Privacy Settings
**Problem**: Browser blocks third-party tracking
**Solutions**:
- Check browser privacy settings
- Disable "Do Not Track" if enabled
- Allow cookies and tracking
- Check browser's built-in ad blocking

### 3. Network Issues
**Problem**: Network blocks GA4 requests
**Solutions**:
- Check firewall settings
- Try different network (mobile hotspot)
- Check corporate network restrictions
- Verify internet connectivity

### 4. GA4 Configuration Issues
**Problem**: Wrong GA4 setup or ID
**Solutions**:
- Verify GA4 ID in environment variables
- Check GA4 property settings
- Verify custom dimensions setup
- Check GA4 Real-time settings

## Step-by-Step Debugging

### Step 1: Check Console Messages
Open Developer Tools (F12) → Console and look for:

**Expected Messages**:
```
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
✅ GA4: Configuration complete
📊 GA4: Tracking page view
🚀 GA4: Tracking page view
```

**If Missing**: GA4 not initializing properly

### Step 2: Check Network Requests
Open Developer Tools (F12) → Network and look for:

**Expected Requests**:
- `https://www.googletagmanager.com/gtag/js?id=G-WTN83NMVW1`
- `https://www.google-analytics.com/g/collect`

**If Missing**: Script not loading or being blocked

### Step 3: Check GA4 Real-time Settings
In Google Analytics:
1. Go to Real-time → Overview
2. Check if Real-time is enabled
3. Verify correct property is selected
4. Check for any filters applied

### Step 4: Test Different Scenarios
1. **Different Browser**: Try Chrome, Firefox, Safari
2. **Incognito Mode**: Test in private browsing
3. **Different Device**: Try mobile or tablet
4. **Different Network**: Try mobile hotspot

## Advanced Debugging

### 1. Check dataLayer
Open Console and run:
```javascript
console.log(window.dataLayer);
```
Should show array of events.

### 2. Check gtag Function
Open Console and run:
```javascript
console.log(typeof window.gtag);
```
Should return "function".

### 3. Manual Event Test
Open Console and run:
```javascript
window.gtag('event', 'test_event', {
  'custom_parameter': 'test_value'
});
```

### 4. Check GA4 Debug View
1. Enable GA4 Debug mode
2. Add `?debug_mode=true` to URL
3. Check Debug View in GA4

## Environment Variables Check

Verify `.env.local` file contains:
```env
NEXT_PUBLIC_GA4_ID=G-WTN83NMVW1
NEXT_PUBLIC_GA4_LEGACY_ID=G-RVFKM2F9ZN
NEXT_PUBLIC_Backend_URL=http://localhost:3001
```

## GA4 Property Settings

### 1. Data Streams
- Verify correct data stream is configured
- Check measurement ID matches environment variable
- Verify domain is correctly set

### 2. Custom Dimensions
- Ensure `tenant_id` dimension is configured
- Check dimension scope (Event, User, Session)
- Verify dimension is active

### 3. Real-time Settings
- Check Real-time is enabled
- Verify no filters are blocking data
- Check property permissions

## Testing Checklist

- [ ] Console shows GA4 initialization messages
- [ ] Network tab shows GA4 requests
- [ ] No Ad Blockers enabled
- [ ] Browser privacy settings allow tracking
- [ ] GA4 property is correctly configured
- [ ] Environment variables are set
- [ ] Real-time is enabled in GA4
- [ ] No network restrictions

## Common Solutions

### Solution 1: Disable Ad Blockers
1. Turn off Ad Blocker
2. Refresh page
3. Check GA4 Real-time

### Solution 2: Use Different Browser
1. Try Chrome, Firefox, or Safari
2. Test in Incognito mode
3. Check if tracking works

### Solution 3: Check Network
1. Try different network
2. Check corporate firewall
3. Use mobile hotspot

### Solution 4: Verify GA4 Setup
1. Check GA4 ID in environment
2. Verify GA4 property settings
3. Check custom dimensions

## Expected Behavior

### Successful Tracking
- Console shows initialization messages
- Network requests to googletagmanager.com
- Events appear in GA4 Real-time
- Custom dimensions populated

### Failed Tracking
- No console messages
- No network requests
- No data in GA4 Real-time
- Errors in console

## Troubleshooting Commands

### Check GA4 Status
```javascript
// Check if GA4 is loaded
console.log('GA4 Status:', {
  dataLayer: window.dataLayer,
  gtag: typeof window.gtag,
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID
});
```

### Manual Event Test
```javascript
// Send test event
window.gtag('event', 'manual_test', {
  'test_parameter': 'test_value'
});
```

### Check Network Requests
```javascript
// Check if GA4 requests are being made
fetch('https://www.googletagmanager.com/gtag/js?id=G-WTN83NMVW1')
  .then(response => console.log('GA4 Script Status:', response.status))
  .catch(error => console.error('GA4 Script Error:', error));
```

## Contact Support

If issues persist:
1. Check browser console for errors
2. Verify network connectivity
3. Test with different devices/networks
4. Contact development team with debug information

---

**Last Updated**: December 2024  
**Version**: 1.0
