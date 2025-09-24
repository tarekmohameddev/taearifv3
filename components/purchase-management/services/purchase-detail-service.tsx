"use client"

import axiosInstance from "@/lib/axiosInstance"

// Types for single purchase request response
export interface Client {
  name: string
  email: string
  phone: string
  national_id: string
  rating: number
}

export interface PropertyDetail {
  id: number
  title: string
  type: string
  area: string
  beds: number
  bath: number
  price: string
  developer: string
  location: string
  total_purchases: number
}

export interface ProjectDetail {
  id: number
  title: string
  min_price: number
  max_price: number
  developer: string
  completion_date: string
}

export interface UpdatedBy {
  id: number
  name: string
  email: string
}

export interface Stage {
  id: number
  name: string
  order: number
  status: string
  notes: string | null
  started_at: string | null
  completed_at: string | null
  updated_by: UpdatedBy | null
  documents: any[]
}

export interface PurchaseRequestDetail {
  id: number
  request_number: string
  request_date: string
  overall_status: string
  progress_percentage: number
  priority: string
  expected_completion_date: string
  client: Client
  property: PropertyDetail
  project: ProjectDetail | null
  stages: Stage[]
  budget_amount: string
  notes: string
  additional_notes: string
  assigned_user: any | null
  created_at: string
  updated_at: string
}

export interface PurchaseDetailResponse {
  success: boolean
  data: PurchaseRequestDetail
  message: string
}

// Service functions
export class PurchaseDetailService {
  /**
   * Get single purchase request details by ID
   */
  static async getPurchaseRequestDetail(requestId: string | number): Promise<PurchaseDetailResponse> {
    try {
      const response = await axiosInstance.get(`/v1/pms/purchase-requests/${requestId}`)
      return response.data
    } catch (error) {
      console.error("Error fetching purchase request detail:", error)
      throw error
    }
  }

  /**
   * Update purchase request status
   */
  static async updateRequestStatus(
    requestId: string | number, 
    status: string, 
    notes?: string
  ): Promise<any> {
    try {
      const response = await axiosInstance.put(`/v1/pms/purchase-requests/${requestId}/status`, {
        status,
        notes
      })
      return response.data
    } catch (error) {
      console.error("Error updating request status:", error)
      throw error
    }
  }

  /**
   * Update stage progress
   */
  static async updateStageProgress(
    requestId: string | number,
    stageId: number,
    progressData: {
      status?: string
      notes?: string
      documents?: any[]
      started_at?: string
      completed_at?: string
    }
  ): Promise<any> {
    try {
      const response = await axiosInstance.put(
        `/v1/pms/purchase-requests/${requestId}/stages/${stageId}`,
        progressData
      )
      return response.data
    } catch (error) {
      console.error("Error updating stage progress:", error)
      throw error
    }
  }

  /**
   * Assign user to purchase request
   */
  static async assignUser(
    requestId: string | number,
    userId: number
  ): Promise<any> {
    try {
      const response = await axiosInstance.put(`/v1/pms/purchase-requests/${requestId}/assign`, {
        assigned_to: userId
      })
      return response.data
    } catch (error) {
      console.error("Error assigning user:", error)
      throw error
    }
  }

  /**
   * Update purchase request notes
   */
  static async updateNotes(
    requestId: string | number,
    notes: string,
    additionalNotes?: string
  ): Promise<any> {
    try {
      const response = await axiosInstance.put(`/v1/pms/purchase-requests/${requestId}/notes`, {
        notes,
        additional_notes: additionalNotes
      })
      return response.data
    } catch (error) {
      console.error("Error updating notes:", error)
      throw error
    }
  }

  /**
   * Update expected completion date
   */
  static async updateCompletionDate(
    requestId: string | number,
    expectedCompletionDate: string
  ): Promise<any> {
    try {
      const response = await axiosInstance.put(`/v1/pms/purchase-requests/${requestId}/completion-date`, {
        expected_completion_date: expectedCompletionDate
      })
      return response.data
    } catch (error) {
      console.error("Error updating completion date:", error)
      throw error
    }
  }
}

export default PurchaseDetailService
