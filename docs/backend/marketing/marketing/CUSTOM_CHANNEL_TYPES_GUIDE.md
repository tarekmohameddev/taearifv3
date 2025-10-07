# Custom Channel Types - Complete Guide

## 📋 Overview

You can now create **custom channel types** in addition to the default ones (WhatsApp, Facebook, Telegram, Instagram, SMS). This allows you to add new marketing channels like Twitter, Email, LinkedIn, TikTok, etc.

**Status**: ✅ **FULLY IMPLEMENTED**  
**Date**: 2025-10-01

---

## 🎯 What Changed?

### Before

- Channel types were hardcoded as ENUM: `whatsapp`, `facebook`, `telegram`, `instagram`, `sms`
- Could only select from these 5 predefined types
- No way to add new channel types without database migration

### After

- Channel types are now VARCHAR(50) - fully flexible
- Can enter **any custom channel type** (e.g., `twitter`, `email`, `linkedin`, `tiktok`, `viber`)
- Still shows suggestions from existing types
- Auto-sanitizes input (lowercase, underscores for spaces)

---

## 🚀 How to Create Custom Channel Types

### Step 1: Run the Migration

**IMPORTANT**: Run this migration to change the database structure:

```bash
php artisan migrate
```

This migration does the following:

- Changes `marketing_channels.type` from ENUM to VARCHAR(50)
- Changes `marketing_channel_pricing.channel_type` from ENUM to VARCHAR(50)
- Preserves all existing data
- Maintains the unique constraint on `channel_type`

### Step 2: Access the Admin Dashboard

Navigate to:

```
/admin/credit-management
```

### Step 3: Create a Custom Channel Type

1. Click **"Add Channel"** button (top right of Channel Pricing panel)
2. In the modal form:
   - **Channel Type**: Type your custom channel name (e.g., `twitter`, `email`, `linkedin`)
   - **Credits per Message**: Enter the credit cost (e.g., `2`)
   - **Price per Credit**: Enter the price (e.g., `0.05`)
   - **Currency**: Select `SAR`
3. Click **"Create Pricing"**

**Input Examples:**

- `twitter` ✅
- `email` ✅
- `linkedin` ✅
- `tiktok` ✅
- `WeChat` ✅ (will be converted to `wechat`)
- `Google Ads` ✅ (will be converted to `google_ads`)

---

## 📝 Input Rules & Auto-Formatting

### Validation Rules

- **Max Length**: 50 characters
- **Allowed Characters**: Letters, numbers, hyphens, underscores
- **Required**: Yes
- **Unique**: Each channel type can only exist once

### Auto-Sanitization

The system automatically:

1. **Converts to lowercase**: `Twitter` → `twitter`
2. **Trims whitespace**: `  email  ` → `email`
3. **Replaces spaces with underscores**: `Google Ads` → `google_ads`

### Examples

| You Type          | System Saves      |
| ----------------- | ----------------- |
| `Twitter`         | `twitter`         |
| `Email Marketing` | `email_marketing` |
| `Google Ads`      | `google_ads`      |
| `LinkedIn`        | `linkedin`        |
| `TikTok`          | `tiktok`          |
| `We Chat`         | `we_chat`         |

---

## 🎨 Channel Icons & Colors

### Default Icons

Custom channels will use default styling:

- **Icon**: Generic comment icon (📱)
- **Color**: Light gray (#95a5a6)

### Add Custom Icons (Optional)

To add custom icons for your new channel types, edit:

```php
resources/views/admin/credit_management/dashboard.blade.php
```

Find this section (around line 267):

```php
$channelConfig = [
    'whatsapp' => ['icon' => 'fab fa-whatsapp', 'color' => '#25D366'],
    'facebook' => ['icon' => 'fab fa-facebook', 'color' => '#1877f2'],
    'telegram' => ['icon' => 'fab fa-telegram', 'color' => '#0088cc'],
    'instagram' => ['icon' => 'fab fa-instagram', 'color' => '#E4405F'],
    'sms' => ['icon' => 'fas fa-sms', 'color' => '#FF6B6B'],
    'email' => ['icon' => 'fas fa-envelope', 'color' => '#EA4335'],
];
```

Add your custom channel:

```php
'twitter' => ['icon' => 'fab fa-twitter', 'color' => '#1DA1F2'],
'linkedin' => ['icon' => 'fab fa-linkedin', 'color' => '#0077B5'],
'tiktok' => ['icon' => 'fab fa-tiktok', 'color' => '#000000'],
'email' => ['icon' => 'fas fa-envelope', 'color' => '#EA4335'],
```

---

## 📊 Example Use Cases

### Use Case 1: Email Marketing

```json
{
  "channel_type": "email",
  "credits_per_message": 1,
  "price_per_credit": 0.02,
  "currency": "SAR"
}
```

### Use Case 2: Twitter Marketing

```json
{
  "channel_type": "twitter",
  "credits_per_message": 2,
  "price_per_credit": 0.05,
  "currency": "SAR"
}
```

### Use Case 3: LinkedIn Ads

```json
{
  "channel_type": "linkedin",
  "credits_per_message": 5,
  "price_per_credit": 0.08,
  "currency": "SAR"
}
```

### Use Case 4: TikTok Marketing

```json
{
  "channel_type": "tiktok",
  "credits_per_message": 3,
  "price_per_credit": 0.06,
  "currency": "SAR"
}
```

---

## 🔧 Technical Details

### Files Modified

| File                                                                                       | Changes                                                                      |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `database/migrations/2025_10_01_035118_change_channel_type_to_varchar_for_flexibility.php` | New migration to change ENUM to VARCHAR                                      |
| `app/Http/Controllers/Api/markting/MarketingChannelController.php`                         | Updated validation from `in:whatsapp,facebook,...` to `max:50\|alpha_dash`   |
| `app/Http/Controllers/Admin/CreditManagementController.php`                                | Updated validation for channel_type to accept custom values                  |
| `resources/views/admin/credit_management/dashboard.blade.php`                              | Changed dropdown to text input with datalist suggestions + auto-sanitization |

### Database Changes

**Before:**

```sql
type ENUM('whatsapp', 'facebook', 'telegram', 'instagram', 'sms')
```

**After:**

```sql
type VARCHAR(50)
```

### API Changes

**API Endpoint**: `POST /api/marketing/channels`

**Before:**

```json
{
  "type": "whatsapp" // Must be one of: whatsapp, facebook, telegram, instagram, sms
}
```

**After:**

```json
{
  "type": "twitter" // Can be any string (max 50 chars, letters/numbers/hyphens/underscores)
}
```

---

## ✅ Testing Checklist

### Before Migration

- [ ] Backup your database
- [ ] Note existing channel types and their data
- [ ] Verify all existing channels work

### After Migration

- [ ] Run `php artisan migrate`
- [ ] Verify existing channels still work
- [ ] Test creating a new custom channel (e.g., `twitter`)
- [ ] Test creating a channel with spaces (e.g., `Google Ads`)
- [ ] Verify auto-sanitization works
- [ ] Test filtering and searching with new channel types
- [ ] Test toggling status of new channel types
- [ ] Test editing new channel types
- [ ] Test deleting new channel types

### API Testing

- [ ] Test API endpoint with custom channel type
- [ ] Verify validation accepts custom types
- [ ] Test creating marketing channel with custom type
- [ ] Verify user can send messages through custom channel

---

## 🚨 Important Notes

### 1. Migration Safety

- The migration preserves all existing data
- It only changes the column type, not the values
- The down() method can revert if needed (before adding custom types)

### 2. Backwards Compatibility

- All existing channels (whatsapp, facebook, etc.) continue to work
- No changes needed to existing code using these channels
- The datalist still shows original 5 types as suggestions

### 3. Validation

- `alpha_dash` rule allows: letters, numbers, hyphens, underscores
- No special characters or emojis allowed
- Prevents SQL injection and XSS attacks

### 4. Best Practices

- Use lowercase for consistency
- Use underscores instead of spaces
- Keep names short and descriptive
- Follow existing naming conventions

---

## 📖 Examples

### Creating Twitter Channel Pricing (Admin)

**Steps:**

1. Go to `/admin/credit-management`
2. Click "Add Channel"
3. Type: `twitter`
4. Credits per Message: `2`
5. Price per Credit: `0.05`
6. Currency: `SAR`
7. Click "Create Pricing"

**Result:**

```
✅ Channel pricing created successfully!
- Channel Type: twitter
- Cost per Message: 0.10 SAR (2 credits × 0.05 SAR)
```

### Creating Email Marketing Channel (User via API)

**Request:**

```bash
POST /api/marketing/channels
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Email Campaign",
  "description": "Main email marketing channel",
  "type": "email",
  "number": "noreply@company.com",
  "business_id": "EMAIL001",
  "phone_id": null,
  "access_token": "smtp_token_here"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Marketing channel created successfully",
  "data": {
    "id": 15,
    "user_id": 1,
    "name": "My Email Campaign",
    "type": "email",
    "number": "noreply@company.com",
    "is_verified": false,
    "is_connected": false
  }
}
```

---

## 🔄 Rollback Instructions

If you need to revert to the old ENUM system:

```bash
php artisan migrate:rollback --step=1
```

**WARNING**: This will only work if you haven't created any custom channel types yet. If you have custom types, they will be lost during rollback.

---

## 📞 Support

For questions or issues:

1. Check this guide first
2. Review the test results in the dashboard
3. Check browser console for JavaScript errors
4. Check Laravel logs: `storage/logs/laravel.log`

---

## 🎓 Related Documentation

| Document                          | Purpose                               |
| --------------------------------- | ------------------------------------- |
| `QUICK_REFERENCE.md`              | Quick reference for credit management |
| `SYNC_PRICING_EXPLAINED.md`       | How pricing sync works                |
| `CREDIT_MANAGEMENT_API_GUIDE.md`  | API documentation                     |
| `MARKETING_SETTINGS_API_GUIDE.md` | Marketing settings API                |

---

**Last Updated**: 2025-10-01  
**Version**: 2.0.0  
**Author**: AI Assistant  
**Status**: ✅ Production Ready
