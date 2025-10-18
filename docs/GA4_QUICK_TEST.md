# GA4 Quick Test Guide

## Quick Diagnostic Steps

### 1. Open Developer Tools (F12)

Go to Console tab and look for these messages:

```
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
✅ GA4: Configuration complete
```

### 2. Check Network Tab

Look for requests to:

- `googletagmanager.com`
- `google-analytics.com`

### 3. Test in Console

Run this command in Console:

```javascript
console.log("GA4 Status:", {
  dataLayer: window.dataLayer,
  gtag: typeof window.gtag,
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID,
});
```

### 4. Manual Event Test

Run this in Console:

```javascript
window.gtag("event", "manual_test", {
  test_parameter: "test_value",
});
```

## Quick Fixes

### Fix 1: Disable Ad Blocker

- Turn off Ad Blocker
- Refresh page
- Check GA4 Real-time

### Fix 2: Try Incognito Mode

- Open Incognito/Private window
- Visit the website
- Check GA4 Real-time

### Fix 3: Different Browser

- Try Chrome, Firefox, or Safari
- Check if tracking works
- Compare results

## Expected Results

### ✅ Working Correctly

- Console shows GA4 messages
- Network requests visible
- Events appear in GA4 Real-time

### ❌ Not Working

- No console messages
- No network requests
- No data in GA4 Real-time

## Common Issues

1. **Ad Blocker**: Most common cause
2. **Browser Privacy**: Blocks tracking
3. **Network Restrictions**: Corporate firewall
4. **GA4 Configuration**: Wrong settings

## Quick Solutions

1. **Disable Ad Blocker** → Refresh → Check GA4
2. **Use Incognito Mode** → Test → Check GA4
3. **Try Different Browser** → Test → Check GA4
4. **Check Console** → Look for errors
5. **Verify Network** → Check requests

---

**Test this first, then check GA4 Real-time dashboard!**
