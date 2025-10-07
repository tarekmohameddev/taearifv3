# Credit Management Dashboard - Quick Reference Card

## 🚀 Quick Access

**URL**: `/admin/credit-management`  
**Permission**: `Credit Management`  
**Status**: ✅ **FULLY WORKING**

---

## 📦 Credit Packages Actions

| Action               | Button           | Location    | Result                        |
| -------------------- | ---------------- | ----------- | ----------------------------- |
| **Create**           | 🟦 Add Package   | Top right   | Opens modal form              |
| **View**             | 👁️ Eye icon      | Package row | Shows details                 |
| **Edit**             | ✏️ Edit icon     | Package row | Opens edit page               |
| **Toggle Status**    | ⏸️/▶️ Pause/Play | Package row | Activates/Deactivates         |
| **Delete**           | 🗑️ Trash icon    | Package row | Removes package               |
| **Filter Status**    | Dropdown         | Top filters | Shows active/inactive         |
| **Filter Marketing** | Dropdown         | Top filters | Shows marketing/non-marketing |
| **Search**           | Search box       | Top filters | Finds by name                 |

---

## 📡 Channel Pricing Actions

| Action            | Button           | Location    | Result                |
| ----------------- | ---------------- | ----------- | --------------------- |
| **Create**        | 🟩 Add Channel   | Top right   | Opens modal form      |
| **View**          | 👁️ Eye icon      | Channel row | Shows details         |
| **Edit**          | ✏️ Edit icon     | Channel row | Opens edit page       |
| **Toggle Status** | ⏸️/▶️ Pause/Play | Channel row | Activates/Deactivates |
| **Delete**        | 🗑️ Trash icon    | Channel row | Removes pricing       |
| **Filter Status** | Dropdown         | Top filters | Shows active/inactive |
| **Search**        | Search box       | Top filters | Finds by channel      |
| **Sync Pricing**  | 🔄 Sync button   | Top right   | Updates from packages |

---

## 💰 Price Calculations

### Cost Per Credit

```
Price Per Credit = Total Price ÷ Total Credits
Example: 50 SAR ÷ 1000 credits = 0.05 SAR/credit
```

### Effective Message Price

```
Message Price = Credits Per Message × Price Per Credit
Example: 2 credits × 0.05 SAR = 0.10 SAR/message
```

### Message Estimates

```
Messages = Total Credits ÷ Credits Per Message
Example: 1000 credits ÷ 2 credits/msg = 500 messages
```

---

## 🎯 Current Test Data

### Packages (6)

| Name         | Credits | Price   | Cost/Credit |
| ------------ | ------- | ------- | ----------- |
| Starter      | 100     | 25 SAR  | 0.2500      |
| Business     | 500     | 100 SAR | 0.2000      |
| Basic        | 1,000   | 50 SAR  | 0.0500      |
| Medium       | 2,500   | 100 SAR | 0.0400      |
| Advanced     | 5,000   | 180 SAR | 0.0360      |
| Professional | 10,000  | 300 SAR | 0.0300      |

### Channels (5)

| Channel   | Credits/Msg | Price/Msg |
| --------- | ----------- | --------- |
| WhatsApp  | 1           | 0.05 SAR  |
| Facebook  | 2           | 0.10 SAR  |
| Telegram  | 1           | 0.05 SAR  |
| Instagram | 3           | 0.15 SAR  |
| SMS       | 2           | 0.10 SAR  |

---

## 🔧 Troubleshooting

| Issue             | Solution                                     |
| ----------------- | -------------------------------------------- |
| Page not loading  | Check admin login & permissions              |
| AJAX not working  | Verify CSRF token in layout                  |
| No data showing   | Run migrations & check database              |
| JavaScript errors | Check browser console                        |
| 404 errors        | Clear route cache: `php artisan route:clear` |

---

## 📞 Key Files

| Type              | File Path                                                     |
| ----------------- | ------------------------------------------------------------- |
| **Dashboard**     | `resources/views/admin/credit_management/dashboard.blade.php` |
| **Controller**    | `app/Http/Controllers/Admin/CreditManagementController.php`   |
| **Package Model** | `app/Models/Api/markting/CreditPackage.php`                   |
| **Pricing Model** | `app/Models/Api/markting/MarketingChannelPricing.php`         |
| **Routes**        | `routes/admin.php` (lines 510-522)                            |
| **Tests**         | `test-scripts/test_credit_dashboard.php`                      |

---

## ✅ Verification Checklist

- [ ] Can access dashboard at `/admin/credit-management`
- [ ] See 6 packages and 5 channels
- [ ] Can create new package
- [ ] Can toggle package status
- [ ] Can edit package
- [ ] Can delete package
- [ ] Can create new channel pricing
- [ ] Can toggle channel status
- [ ] Can edit channel pricing
- [ ] Can delete channel pricing
- [ ] Filters work correctly
- [ ] Search works correctly
- [ ] Sync pricing works
- [ ] Message estimates show correctly

---

## 🎨 Badge Colors

| Badge        | Color  | Meaning            |
| ------------ | ------ | ------------------ |
| ✅ Active    | Green  | Item is active     |
| ⚪ Inactive  | Gray   | Item is inactive   |
| 🔵 Marketing | Cyan   | Supports marketing |
| ⭐ Popular   | Yellow | Popular package    |

---

## 📊 Statistics Cards

| Card            | Shows                    | Color  |
| --------------- | ------------------------ | ------ |
| Total Packages  | Count of all packages    | Purple |
| Active Packages | Count of active packages | Green  |
| Channel Types   | Count of all channels    | Purple |
| Active Channels | Count of active channels | Pink   |

---

## ⌨️ Keyboard Shortcuts (Planned)

| Key   | Action       |
| ----- | ------------ |
| `N`   | New Package  |
| `C`   | New Channel  |
| `F`   | Focus Search |
| `S`   | Sync Pricing |
| `Esc` | Close Modal  |

---

## 🔄 Common Workflows

### Create Complete Package

1. Click "Add Package"
2. Enter name, credits, price
3. Select currency (SAR)
4. Check "Support Marketing Channels"
5. Click "Create Package"
6. ✅ Package appears in list

### Update Channel Pricing

1. Find channel in right panel
2. Click edit (blue button)
3. Modify credits per message
4. Save changes
5. ✅ Pricing updates

### Sync All Pricing

1. Click "Sync Pricing" (top right)
2. Read warning message
3. Click "Sync Pricing" in modal
4. ✅ All channels update to average

---

## 📈 Performance Tips

- Use filters to reduce data load
- Paginate large lists (automatic)
- Clear browser cache if slow
- Check database indexes
- Monitor query performance

---

## 🎓 Learn More

| Topic                     | Document                              |
| ------------------------- | ------------------------------------- |
| **Complete System Guide** | `CREDIT_PACKAGES_SYSTEM.md`           |
| **Pricing Guide**         | `MARKETING_CHANNEL_PRICING_SYSTEM.md` |
| **API Testing**           | `MARKETING_SYSTEMS_POSTMAN_GUIDE.md`  |
| **User Testing**          | `DASHBOARD_USER_TESTING_GUIDE.md`     |
| **Implementation**        | `IMPLEMENTATION_COMPLETE.md`          |

---

**Last Updated**: 2025-09-30  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
