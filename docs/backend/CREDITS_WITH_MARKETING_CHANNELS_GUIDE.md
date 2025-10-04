# 💳 Credits Integration with Marketing Channels

## 🎯 Overview

**YES!** The credit system is fully integrated with marketing channels. Here's how it works:

### **How Credits Work with Marketing Channels:**
1. **Users purchase credits** using the credit system
2. **Credits are automatically deducted** when sending messages through marketing channels
3. **Different message types cost different amounts** of credits
4. **Monthly limits** prevent overuse
5. **Real-time balance tracking** shows available credits

---

## 🔄 Credit Flow with Marketing Channels

### **1. Credit Purchase Flow**
```
User → Purchase Credits → Payment Gateway → Credits Added → Ready to Use
```

### **2. Message Sending Flow**
```
User → Send Message → Check Credits → Deduct Credits → Send Message → Update Balance
```

---

## 💰 Credit Costs for Marketing Channels

### **Current Pricing Structure:**
```javascript
const messageTypeCosts = {
  'whatsapp': 1,      // 1 credit per WhatsApp message
  'sms': 1,           // 1 credit per SMS
  'facebook': 1,      // 1 credit per Facebook message
  'telegram': 1,      // 1 credit per Telegram message
  'instagram': 1,     // 1 credit per Instagram message
};
```

### **Cost Calculation:**
- **Text Messages**: 1 credit each
- **Media Messages**: 1 credit each (same as text)
- **Template Messages**: 1 credit each
- **Bulk Messages**: 1 credit per recipient

---

## 🚀 API Integration Examples

### **1. Send Message with Credit Deduction**

```javascript
// Frontend: Send message through marketing channel
const sendMessage = async (channelId, messageData) => {
  try {
    const response = await fetch(`/api/marketing-channels/${channelId}/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: '+966501234567',
        message: 'Hello from our marketing channel!',
        message_type: 'text'
      })
    });

    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('Message sent successfully!');
      console.log('Credits used:', result.credits_used);
      console.log('Remaining credits:', result.remaining_credits);
    } else if (result.error === 'Insufficient credits') {
      console.log('Not enough credits!');
      console.log('Available:', result.credits_available);
      console.log('Required:', result.credits_required);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

### **2. Check Credits Before Sending**

```javascript
// Frontend: Check if user has enough credits
const checkCreditsBeforeSending = async (messageType, recipientCount = 1) => {
  try {
    // Get current balance
    const balanceResponse = await fetch('/api/v1/credits/balance', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const balance = await balanceResponse.json();
    const availableCredits = balance.user_credits.available_credits;
    
    // Calculate required credits
    const creditsPerMessage = 1; // Based on message type
    const requiredCredits = creditsPerMessage * recipientCount;
    
    if (availableCredits >= requiredCredits) {
      return {
        canSend: true,
        availableCredits,
        requiredCredits,
        remainingAfterSend: availableCredits - requiredCredits
      };
    } else {
      return {
        canSend: false,
        availableCredits,
        requiredCredits,
        shortfall: requiredCredits - availableCredits
      };
    }
  } catch (error) {
    console.error('Error checking credits:', error);
    return { canSend: false, error: error.message };
  }
};
```

### **3. Bulk Message with Credit Check**

```javascript
// Frontend: Send bulk messages with credit validation
const sendBulkMessages = async (channelId, recipients, message) => {
  // Check credits first
  const creditCheck = await checkCreditsBeforeSending('text', recipients.length);
  
  if (!creditCheck.canSend) {
    alert(`Insufficient credits! You need ${creditCheck.shortfall} more credits.`);
    return;
  }
  
  // Confirm with user
  const confirmed = confirm(
    `Send ${recipients.length} messages?\n` +
    `Credits required: ${creditCheck.requiredCredits}\n` +
    `Remaining after send: ${creditCheck.remainingAfterSend}`
  );
  
  if (!confirmed) return;
  
  // Send messages
  for (const recipient of recipients) {
    try {
      const response = await fetch(`/api/marketing-channels/${channelId}/send-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: recipient,
          message: message,
          message_type: 'text'
        })
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        console.log(`Message sent to ${recipient}`);
      } else {
        console.error(`Failed to send to ${recipient}:`, result.error);
      }
    } catch (error) {
      console.error(`Error sending to ${recipient}:`, error);
    }
  }
};
```

---

## 📊 Backend Integration Details

### **MarketingChannelController Integration:**

```php
// When sending a message, credits are automatically deducted
public function sendMessage(Request $request, $id): JsonResponse
{
    // ... validation and channel checks ...
    
    // Calculate credits needed
    $creditsNeeded = UserCredit::getCostForMessageType($channel->type);
    
    // Check and deduct credits
    $creditResult = CreditController::useCredits(
        Auth::id(),
        $creditsNeeded,
        "Message sent via {$channel->name} ({$channel->type})",
        [
            'channel_id' => $channel->id,
            'channel_type' => $channel->type,
            'recipient' => $request->to,
            'message_type' => $request->get('message_type', 'text'),
        ]
    );
    
    if (!$creditResult['success']) {
        return $this->fail($creditResult['error'], 400, [
            'credits_available' => $creditResult['available_credits'] ?? 0,
            'credits_required' => $creditsNeeded,
        ]);
    }
    
    // Send message through external API
    // ... message sending logic ...
    
    return $this->ok([
        'message_sent' => true,
        'credits_used' => $creditsNeeded,
        'remaining_credits' => $creditResult['remaining_credits'],
    ], 'Message sent successfully');
}
```

---

## 🎨 Frontend UI Components

### **1. Credit Balance Display in Marketing Channel**

```jsx
import { useState, useEffect } from 'react';

const MarketingChannelCard = ({ channel, token }) => {
  const [balance, setBalance] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/v1/credits/balance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBalance(data.user_credits);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const sendMessage = async (recipient, message) => {
    setSending(true);
    try {
      const response = await fetch(`/api/marketing-channels/${channel.id}/send-message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: recipient,
          message: message,
          message_type: 'text'
        })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert('Message sent successfully!');
        fetchBalance(); // Refresh balance
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="marketing-channel-card">
      <div className="channel-header">
        <h3>{channel.name}</h3>
        <span className="channel-type">{channel.type}</span>
      </div>
      
      <div className="credit-info">
        <div className="balance">
          <span className="credits">{balance?.available_credits || 0}</span>
          <span className="label">Credits Available</span>
        </div>
        <div className="cost-info">
          <span className="cost">1 credit per message</span>
        </div>
      </div>

      <div className="message-form">
        <input 
          type="text" 
          placeholder="Recipient number"
          className="recipient-input"
        />
        <textarea 
          placeholder="Type your message..."
          className="message-input"
        />
        <button 
          onClick={() => sendMessage('+966501234567', 'Test message')}
          disabled={sending || (balance?.available_credits || 0) < 1}
          className="send-btn"
        >
          {sending ? 'Sending...' : 'Send Message (1 Credit)'}
        </button>
      </div>

      {(balance?.available_credits || 0) < 1 && (
        <div className="insufficient-credits">
          <p>⚠️ Insufficient credits to send messages</p>
          <button className="purchase-credits-btn">
            Purchase Credits
          </button>
        </div>
      )}
    </div>
  );
};
```

### **2. Credit Usage Indicator**

```jsx
const CreditUsageIndicator = ({ balance }) => {
  const usagePercentage = balance ? 
    (balance.used_credits / balance.monthly_limit) * 100 : 0;

  return (
    <div className="credit-usage-indicator">
      <div className="usage-header">
        <span>Monthly Usage</span>
        <span>{balance?.used_credits || 0} / {balance?.monthly_limit || 0}</span>
      </div>
      
      <div className="usage-bar">
        <div 
          className="usage-fill"
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
      
      <div className="usage-warning">
        {usagePercentage > 80 && (
          <span className="warning">⚠️ Approaching monthly limit</span>
        )}
      </div>
    </div>
  );
};
```

---

## 🔧 Configuration & Customization

### **1. Customize Credit Costs**

To change credit costs for different message types, update the `UserCredit` model:

```php
// In app/Models/Api/markting/UserCredit.php
public static function getMessageTypeCosts()
{
    return [
        'whatsapp' => 1,      // 1 credit per WhatsApp message
        'sms' => 2,           // 2 credits per SMS (more expensive)
        'facebook' => 1,      // 1 credit per Facebook message
        'telegram' => 1,      // 1 credit per Telegram message
        'instagram' => 1,     // 1 credit per Instagram message
        'bulk_whatsapp' => 0.5, // 0.5 credits for bulk WhatsApp (discount)
    ];
}
```

### **2. Monthly Limits**

```php
// Set monthly limits per user
$userCredit = UserCredit::getOrCreateForUser($userId);
$userCredit->update(['monthly_limit' => 10000]); // 10,000 credits per month
```

### **3. Credit Packages for Marketing**

```php
// Create marketing-specific credit packages
CreditPackage::create([
    'name' => 'Marketing Starter',
    'credits' => 1000,
    'price' => 50.00,
    'currency' => 'SAR',
    'description' => 'Perfect for small marketing campaigns',
    'is_active' => true,
]);

CreditPackage::create([
    'name' => 'Marketing Pro',
    'credits' => 5000,
    'price' => 200.00,
    'currency' => 'SAR',
    'description' => 'For medium-sized marketing campaigns',
    'is_active' => true,
]);
```

---

## 📈 Analytics & Reporting

### **1. Credit Usage Analytics**

```javascript
// Get credit usage analytics for marketing channels
const getCreditAnalytics = async (startDate, endDate) => {
  try {
    const response = await fetch(`/api/v1/credits/analytics?start_date=${startDate}&end_date=${endDate}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const analytics = await response.json();
    
    return {
      totalCreditsUsed: analytics.total_credits_used,
      creditsByChannel: analytics.credits_by_channel,
      creditsByMessageType: analytics.credits_by_message_type,
      monthlyUsage: analytics.monthly_usage,
      costBreakdown: analytics.cost_breakdown
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};
```

### **2. Channel Performance with Credits**

```javascript
// Get channel performance including credit costs
const getChannelPerformance = async (channelId) => {
  try {
    const response = await fetch(`/api/marketing-channels/${channelId}/performance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const performance = await response.json();
    
    return {
      messagesSent: performance.messages_sent,
      creditsUsed: performance.credits_used,
      costPerMessage: performance.cost_per_message,
      successRate: performance.success_rate,
      totalCost: performance.total_cost
    };
  } catch (error) {
    console.error('Error fetching performance:', error);
  }
};
```

---

## 🚨 Error Handling

### **Common Credit-Related Errors:**

```javascript
// Handle insufficient credits error
const handleInsufficientCredits = (error) => {
  if (error.error === 'Insufficient credits') {
    return {
      showPurchaseModal: true,
      message: `You need ${error.required_credits} credits but only have ${error.available_credits}`,
      shortfall: error.required_credits - error.available_credits
    };
  }
  
  if (error.error === 'Monthly credit limit exceeded') {
    return {
      showLimitModal: true,
      message: `You've reached your monthly limit of ${error.monthly_limit} credits`,
      usedCredits: error.used_credits
    };
  }
  
  return { showError: true, message: error.error };
};
```

---

## 🎯 Best Practices

### **1. Always Check Credits Before Sending**
```javascript
// Good practice: Check credits first
const sendMessageSafely = async (channelId, messageData) => {
  const creditCheck = await checkCreditsBeforeSending('text', 1);
  
  if (!creditCheck.canSend) {
    // Show purchase modal or redirect to credit purchase
    showCreditPurchaseModal(creditCheck.shortfall);
    return;
  }
  
  // Proceed with sending
  await sendMessage(channelId, messageData);
};
```

### **2. Show Real-time Balance Updates**
```javascript
// Update balance after each message
const sendMessageWithBalanceUpdate = async (channelId, messageData) => {
  const result = await sendMessage(channelId, messageData);
  
  if (result.status === 'success') {
    // Update UI with new balance
    updateBalanceDisplay(result.remaining_credits);
  }
};
```

### **3. Provide Clear Cost Information**
```javascript
// Always show cost before sending
const MessageComposer = ({ channel }) => {
  const [recipientCount, setRecipientCount] = useState(1);
  const [messageType, setMessageType] = useState('text');
  
  const costPerMessage = 1; // Based on message type
  const totalCost = costPerMessage * recipientCount;
  
  return (
    <div className="message-composer">
      <div className="cost-display">
        <span>Cost: {totalCost} credits for {recipientCount} message(s)</span>
      </div>
      {/* Message form */}
    </div>
  );
};
```

---

## 🎉 Summary

**The credit system is fully integrated with marketing channels!** Here's what you get:

✅ **Automatic Credit Deduction** - Credits are deducted when sending messages  
✅ **Real-time Balance Tracking** - Always know how many credits you have  
✅ **Monthly Limits** - Prevent overuse with monthly credit limits  
✅ **Cost Transparency** - Clear pricing for different message types  
✅ **Error Handling** - Graceful handling of insufficient credits  
✅ **Analytics** - Track credit usage across all channels  
✅ **Flexible Pricing** - Easy to customize costs per message type  

The system is production-ready and provides a seamless experience for users managing their marketing campaigns! 🚀
