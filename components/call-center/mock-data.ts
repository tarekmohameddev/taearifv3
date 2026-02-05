/**
 * Call Center Simulation - Mock Data
 */

import type { CallLog, CallScript, Agent, CallStats } from './types';

export const mockCallLogs: CallLog[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'أحمد محمد',
    customerPhone: '+966501234567',
    agentId: 'a1',
    agentName: 'سارة أحمد',
    type: 'inbound',
    status: 'completed',
    duration: 420,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 420 * 1000).toISOString(),
    notes: 'العميل مهتم بشقة في الرياض، 3 غرف نوم',
    outcome: 'interested',
    propertyId: 'p1',
    propertyName: 'شقة فاخرة - الرياض',
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'فاطمة علي',
    customerPhone: '+966507654321',
    agentId: 'a2',
    agentName: 'محمد سعيد',
    type: 'outbound',
    status: 'completed',
    duration: 180,
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000 + 180 * 1000).toISOString(),
    notes: 'متابعة مع العميل بخصوص العرض السابق',
    outcome: 'callback',
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'خالد عبدالله',
    customerPhone: '+966509876543',
    agentId: 'a1',
    agentName: 'سارة أحمد',
    type: 'inbound',
    status: 'missed',
    duration: 0,
    startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    customerId: 'c4',
    customerName: 'نورة سعد',
    customerPhone: '+966503456789',
    agentId: 'a3',
    agentName: 'عمر حسن',
    type: 'inbound',
    status: 'in-progress',
    duration: 0,
    startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    notes: 'جاري المحادثة حول فيلا في جدة',
  },
];

export const mockCallScripts: CallScript[] = [
  {
    id: 's1',
    title: 'سكريبت الاتصال الأول',
    description: 'سكريبت للاتصال الأول مع العملاء المحتملين',
    category: 'sales',
    script: `مرحباً، اسمي [الاسم] من [اسم الشركة].

كيف حالك اليوم؟

أتصل بك بخصوص استفسارك عن [نوع العقار].

هل لديك وقت للحديث لبضع دقائق؟

رائع! دعني أخبرك عن العروض المميزة لدينا...`,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 's2',
    title: 'سكريبت المتابعة',
    description: 'سكريبت للمتابعة مع العملاء المهتمين',
    category: 'follow-up',
    script: `مرحباً [اسم العميل]،

أنا [الاسم] من [اسم الشركة].

أتصل للمتابعة بخصوص اهتمامك بـ[العقار].

هل لديك أي أسئلة إضافية؟

هل ترغب في حجز موعد للمعاينة؟`,
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 's3',
    title: 'معالجة الشكاوى',
    description: 'سكريبت للتعامل مع شكاوى العملاء',
    category: 'complaint',
    script: `أنا آسف لسماع ذلك [اسم العميل].

أتفهم تماماً مخاوفك بخصوص [المشكلة].

دعني أوضح لك الموقف...

سأتأكد من حل هذه المشكلة فوراً.

هل هناك أي شيء آخر يمكنني مساعدتك به؟`,
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockAgents: Agent[] = [
  {
    id: 'a1',
    name: 'سارة أحمد',
    email: 'sara@company.com',
    status: 'on-call',
    totalCalls: 245,
    averageDuration: 385,
    successRate: 78,
  },
  {
    id: 'a2',
    name: 'محمد سعيد',
    email: 'mohammed@company.com',
    status: 'available',
    totalCalls: 312,
    averageDuration: 420,
    successRate: 82,
  },
  {
    id: 'a3',
    name: 'عمر حسن',
    email: 'omar@company.com',
    status: 'busy',
    totalCalls: 198,
    averageDuration: 340,
    successRate: 75,
  },
  {
    id: 'a4',
    name: 'ليلى خالد',
    email: 'layla@company.com',
    status: 'offline',
    totalCalls: 156,
    averageDuration: 295,
    successRate: 71,
  },
];

export const mockCallStats: CallStats = {
  totalCalls: 911,
  inboundCalls: 587,
  outboundCalls: 324,
  missedCalls: 42,
  averageDuration: 365,
  successfulCalls: 712,
  todayCalls: 28,
};
