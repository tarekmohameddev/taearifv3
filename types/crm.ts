export interface Customer {
  id: string
  customer_id: string
  name: string
  nameEn: string
  email: string
  phone: string
  whatsapp: string
  customerType: string
  city: string
  district: string
  assignedAgent: string
  lastContact: string
  urgency: string
  pipelineStage: string
  stage_id: string
  dealValue: number
  probability: number
  avatar: string
  reminders: Reminder[]
  interactions: Interaction[]
  appointments: Appointment[]
  notes: string
  joinDate: string
  nationality: string
  familySize: number
  leadSource: string
  satisfaction: number
  communicationPreference: string
  expectedCloseDate: string
  status?: string
  totalValue?: number
  priority?: number
}

export interface PipelineStage {
  id: string
  name: string
  color: string
  icon: any
  count: number
  value: number
  description?: string
  iconName?: string
}

export interface Reminder {
  id: number | string
  title: string
  datetime: string
  priority: number | string
  priority_label?: string
  status?: 'pending' | 'completed' | 'overdue'
  customer?: {
    id: number
    name: string
  }
}

export interface Interaction {
  id: number
  type: string
  date: string
  duration: string
  notes: string
  agent: string
}

export interface Appointment {
  id: string
  title: string
  type: string
  date: string
  time: string
  duration: number
  status: string
  priority: string
  notes: string
  customer: Customer
  property?: Property
  datetime?: string
  priority_label?: string
  datetime_formatted?: string
}

export interface Property {
  id: string
  title: string
  address: string
  price: number
} 