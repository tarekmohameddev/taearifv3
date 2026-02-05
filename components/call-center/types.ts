/**
 * Call Center Simulation - Type Definitions
 */

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags?: string[];
}

export interface CallLog {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  agentId: string;
  agentName: string;
  type: 'inbound' | 'outbound';
  status: 'completed' | 'missed' | 'voicemail' | 'in-progress';
  duration: number; // in seconds
  startTime: string;
  endTime?: string;
  recording?: string;
  notes?: string;
  outcome?: 'interested' | 'not-interested' | 'callback' | 'information-only' | 'complaint';
  propertyId?: string;
  propertyName?: string;
}

export interface CallScript {
  id: string;
  title: string;
  description: string;
  category: 'sales' | 'support' | 'follow-up' | 'complaint' | 'inquiry';
  script: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'on-call' | 'busy' | 'offline';
  avatar?: string;
  totalCalls: number;
  averageDuration: number;
  successRate: number;
}

export interface CallStats {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  missedCalls: number;
  averageDuration: number;
  successfulCalls: number;
  todayCalls: number;
}
