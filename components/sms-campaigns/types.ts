/**
 * SMS Campaigns - Type Definitions
 */

export interface SMSCampaign {
  id: string;
  name: string;
  description?: string;
  message: string;
  status: 'draft' | 'scheduled' | 'sent' | 'in-progress';
  recipientCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  tags?: string[];
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  category: 'promotional' | 'transactional' | 'reminder' | 'notification' | 'follow-up';
  variables: string[]; // e.g., ['name', 'property', 'price']
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SMSContact {
  id: string;
  name: string;
  phone: string;
  tags?: string[];
  isSubscribed: boolean;
}

export interface SMSStats {
  totalCampaigns: number;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  deliveryRate: number;
  thisMonthSent: number;
}

export interface SMSLog {
  id: string;
  campaignId: string;
  campaignName: string;
  contactId: string;
  contactName: string;
  phone: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
}
