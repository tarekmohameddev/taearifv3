"use client"

import React from "react"
import axiosInstance from "@/lib/axiosInstance"
import type { Customer, PipelineStage, Appointment } from "@/types/crm"
import {
  CheckCircle,
  Users,
  Handshake,
  Target,
  Activity,
  BarChart3,
} from "lucide-react"

interface DataHandlerProps {
  onSetLoading: (loading: boolean) => void
  onSetError: (error: string | null) => void
  onSetCrmData: (data: any) => void
  onSetAppointmentsData: (data: Appointment[]) => void
  onSetTotalCustomers: (total: number) => void
  onSetPipelineStages: (stages: PipelineStage[]) => void
  onSetCustomers: (customers: Customer[]) => void
}

export default function DataHandler({
  onSetLoading,
  onSetError,
  onSetCrmData,
  onSetAppointmentsData,
  onSetTotalCustomers,
  onSetPipelineStages,
  onSetCustomers,
}: DataHandlerProps) {
  const getStageIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      "fa fa-check-circle": CheckCircle,
      "fa fa-user-shield": Users,
      "fa fa-hourglass-start": Activity,
      "fa fa-user": Users,
      "fa fa-handshake": Handshake,
      "fa fa-target": Target,
      "fa fa-activity": Activity,
      "fa fa-bar-chart": BarChart3
    }
    return iconMap[iconName] || Target
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 0: return "منخفض"
      case 1: return "متوسط"
      case 2: return "عالية"
      default: return "متوسط"
    }
  }

  const fetchCrmData = async () => {
    try {
      onSetLoading(true)
      onSetError(null)
      
      // Fetch CRM pipeline data
      const crmResponse = await axiosInstance.get("/crm")
      const crmData = crmResponse.data
      
      if (crmData.status === "success") {
        // Transform stages data
        const transformedStages = crmData.stages_summary.map((stage: any) => ({
          id: String(stage.stage_id),
          name: stage.stage_name,
          color: stage.color || "#6366f1",
          icon: stage.icon || "Target",
          count: stage.customer_count,
          value: 0
        }))

        // Transform customers data
        const allCustomers = crmData.stages_with_customers.flatMap((stage: any) =>
          (stage.customers || []).map((customer: any) => ({
            id: customer.customer_id,
            customer_id: customer.customer_id,
            name: customer.name || '',
            nameEn: customer.name || '',
            email: customer.email || '',
            phone: customer.phone || '',
            whatsapp: customer.whatsapp || '',
            customerType: customer.customer_type || '',
            city: customer.city?.name_ar || customer.city || '',
            district: customer.district || '',
            assignedAgent: customer.assigned_agent || '',
            lastContact: customer.last_contact || '',
            urgency: customer.priority ? getPriorityLabel(customer.priority) : '',
            pipelineStage: String(stage.stage_id),
            stage_id: String(stage.stage_id),
            dealValue: customer.deal_value || 0,
            probability: customer.probability || 0,
            avatar: customer.avatar || '',
            reminders: customer.reminders || [],
            interactions: customer.interactions || [],
            appointments: customer.appointments || [],
            notes: customer.notes || '',
            joinDate: customer.created_at || '',
            nationality: customer.nationality || '',
            familySize: customer.family_size || 0,
            leadSource: customer.lead_source || '',
            satisfaction: customer.satisfaction || 0,
            communicationPreference: customer.communication_preference || '',
            expectedCloseDate: customer.expected_close_date || ''
          }))
        )
        
        // Update store
        onSetPipelineStages(transformedStages)
        onSetCustomers(allCustomers)
        onSetCrmData(crmData)
        onSetTotalCustomers(crmData.total_customers || 0)
      }
    } catch (err) {
      console.error("Error fetching CRM data:", err)
      onSetError("فشل في تحميل بيانات الـ CRM")
    } finally {
      onSetLoading(false)
    }
  }

  const fetchAppointmentsData = async () => {
    try {
      const appointmentsResponse = await axiosInstance.get("/crm/customer-reminders")
      const appointmentsData = appointmentsResponse.data
      
      if (appointmentsData.status === "success") {
        onSetAppointmentsData(appointmentsData.data || [])
      }
    } catch (err) {
      console.error("Error fetching appointments data:", err)
    }
  }

  const updateCustomerStage = async (customerId: string, targetStage: string) => {
    try {
      // API call to change customer stage
      const response = await axiosInstance.post(`/crm/customers/${customerId}/change-stage`, {
        stage_id: parseInt(targetStage)
      })
      
      const responseData = response.data

      if (responseData.status === "success") {
        return true
      } else {
        console.error('Failed to update customer stage:', responseData.message)
        return false
      }
    } catch (error) {
      console.error('Error updating customer stage:', error)
      return false
    }
  }

  return {
    fetchCrmData,
    fetchAppointmentsData,
    updateCustomerStage,
    getStageIcon,
    getPriorityLabel,
  }
} 