# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Environment Configuration
NODE_ENV=development

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCTION_DOMAIN=mandhoor.com

# Google Analytics 4 Configuration
NEXT_PUBLIC_GA4_ID=G-WTN83NMVW1
NEXT_PUBLIC_GA4_LEGACY_ID=G-RVFKM2F9ZN

# Backend Configuration
NEXT_PUBLIC_Backend_URL=http://localhost:3001
```

## Variable Descriptions

### Core Configuration

- **NODE_ENV**: Environment mode (`development` or `production`)
- **NEXT_PUBLIC_API_URL**: Local development API URL
- **NEXT_PUBLIC_PRODUCTION_DOMAIN**: Production domain for tenant subdomains

### GA4 Configuration

- **NEXT_PUBLIC_GA4_ID**: Primary GA4 measurement ID
- **NEXT_PUBLIC_GA4_LEGACY_ID**: Legacy GA4 measurement ID (backup)

### Backend Configuration

- **NEXT_PUBLIC_Backend_URL**: Backend API URL for data fetching

## How It Works

### Development Mode

- Uses `NEXT_PUBLIC_API_URL` for local development
- Extracts domain from API URL for subdomain detection
- Tracks localhost domains

### Production Mode

- Uses `NEXT_PUBLIC_PRODUCTION_DOMAIN` for tenant subdomains
- Tracks `*.mandhoor.com` domains
- Excludes main domain (`www.mandhoor.com`)

## Domain Detection Logic

### Development

```
tenant1.localhost:3000 → tenant1
tenant2.localhost:3000 → tenant2
```

### Production

```
tenant1.mandhoor.com → tenant1
tenant2.mandhoor.com → tenant2
www.mandhoor.com → excluded
mandhoor.com → excluded
```

## GA4 Tracking Logic

### Tracked Domains

- ✅ `tenant1.mandhoor.com`
- ✅ `tenant2.mandhoor.com`
- ✅ `localhost` (development)

### Excluded Domains

- ❌ `www.mandhoor.com`
- ❌ `mandhoor.com`

## Setup Instructions

1. **Create `.env.local` file:**

   ```bash
   touch .env.local
   ```

2. **Add environment variables:**

   ```env
   NODE_ENV=development
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXT_PUBLIC_PRODUCTION_DOMAIN=mandhoor.com
   NEXT_PUBLIC_GA4_ID=G-WTN83NMVW1
   NEXT_PUBLIC_GA4_LEGACY_ID=G-RVFKM2F9ZN
   NEXT_PUBLIC_Backend_URL=http://localhost:3001
   ```

3. **Restart development server:**
   ```bash
   npm run dev
   ```

## Testing

### Development Testing

```bash
# Test local subdomains
http://tenant1.localhost:3000/ar/
http://tenant2.localhost:3000/ar/
```

### Production Testing

```bash
# Test production subdomains
https://tenant1.mandhoor.com/ar/
https://tenant2.mandhoor.com/ar/
```

## Console Messages

### Successful Tracking

```
🔍 Middleware: Checking host: tenant1.mandhoor.com
✅ Middleware: Valid tenant ID (production): tenant1
🚀 GA4: Starting initialization with ID: G-WTN83NMVW1
✅ GA4: Script loaded successfully
📊 GA4: Tracking page view
```

### Excluded Domains

```
🔍 Middleware: Checking host: www.mandhoor.com
❌ Middleware: Reserved word (production): www
🚫 GA4: Skipping tracking for domain: www.mandhoor.com
```

## Troubleshooting

### Common Issues

1. **Environment variables not loaded:**
   - Check `.env.local` file exists
   - Restart development server
   - Verify variable names

2. **Subdomain not detected:**
   - Check `NEXT_PUBLIC_PRODUCTION_DOMAIN`
   - Verify subdomain format
   - Check console messages

3. **GA4 not tracking:**
   - Check `NEXT_PUBLIC_GA4_ID`
   - Verify domain filtering
   - Check console messages

### Debug Commands

```javascript
// Check environment variables
console.log("Environment:", {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  PRODUCTION_DOMAIN: process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN,
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
});

// Check domain detection
console.log("Domain detection:", {
  hostname: window.location.hostname,
  shouldTrack: shouldTrackDomain(window.location.hostname),
  tenantId: getTenantIdFromDomain(window.location.hostname),
});
```

## Security Notes

- Never commit `.env.local` to version control
- Use different GA4 IDs for different environments
- Validate all environment variables
- Use secure domains in production

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Development Team
