"use client"

import axiosInstance from "@/lib/axiosInstance"
import useAuthStore from "@/context/AuthContext"

export interface Property {
  id: number
  region_id: number | null
  payment_method: string
  user_id: number
  project_id: number | null
  category_id: number
  featured_image: string
  floor_planning_image: string[]
  video_image: string | null
  price: string
  pricePerMeter: string | null
  purpose: string
    type: string
  beds: number
  bath: number
  area: string
  size: string | null
  video_url: string | null
  virtual_tour: string | null
  status: number
  property_status: string
  featured: number
  features: string | string[]
  faqs: Array<{
    question: string
    answer: string
    displayOnPage: boolean
  }>
  latitude: string
  longitude: string
  created_at: string
  updated_at: string
  reorder: number
  reorder_featured: number
  featured_image_url: string
}

export interface Project {
  id: number
  user_id: number
  featured_image: string
  video_url: string | null
  min_price: number
  max_price: number
  latitude: string
  longitude: string
  featured: number
  complete_status: string
  created_at: string
  updated_at: string
  published: number
  developer: string
  completion_date: string
  units: number
  amenities: string
}

export interface Stage {
  id: number
  purchase_request_id: number
  stage_name: string
  status: string
  stage_order: number
  notes: string | null
  started_at: string | null
  completed_at: string | null
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface PurchaseRequest {
  id: number
  user_id: number
  request_number: string
  client_name: string
  client_email: string
  client_phone: string
  client_national_id: string
  property_id: number
  project_id: number | null
  priority: string
  budget_amount: string
  notes: string
  additional_notes: string
  assigned_to: number | null
  overall_status: string
  progress_percentage: number
  request_date: string
  expected_completion_date: string
  created_at: string
  updated_at: string
  property: Property
  project: Project | null
  assigned_user: any | null
  stages: Stage[]
}

export interface Pagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number
  to: number
  has_more_pages: boolean
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface PurchaseRequestsResponse {
  success: boolean
  data: PurchaseRequest[]
  pagination: Pagination
  message: string
}

export interface CreatePurchaseRequestData {
  client_name: string
  client_email: string
  client_phone: string
  client_national_id: string
  property_id: number
  project_id?: number | null
  priority: string
  budget_amount: number
  notes: string
  additional_notes: string
  assigned_to?: number | null
  expected_completion_date: string
}

export interface CreatePurchaseRequestResponse {
  success: boolean
  data: PurchaseRequest
  message: string
}

export interface UpdatePurchaseRequestData {
  client_name?: string
  client_email?: string
  client_phone?: string
  client_national_id?: string
  property_id?: number
  project_id?: number | null
  priority?: string
  budget_amount?: number
  notes?: string
  additional_notes?: string
  assigned_to?: number | null
  overall_status?: string
  expected_completion_date?: string
}

export interface UpdatePurchaseRequestResponse {
  success: boolean
  data: PurchaseRequest
  message: string
}

export interface StageTransitionData {
  current_stage_name: string
  requirements_met: boolean[]
  inspection_date?: string
  payment_amount?: number
  expected_completion_date?: string
  additional_notes?: string
}

export interface StageTransitionResponse {
  success: boolean
  data: {
    purchase_request: PurchaseRequest
    transitioned_from: string
    transitioned_to: string
    requirements_met: boolean[]
    inspection_date?: string
    payment_amount?: number
  }
  message: string
}

export interface DeletePurchaseRequestResponse {
  success: boolean
  message: string
}

export class PurchaseRequestsService {
  static async getPurchaseRequests(
    page: number = 1,
    perPage: number = 15,
    filters?: {
      status?: string
      priority?: string
      search?: string
    }
  ): Promise<PurchaseRequestsResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getPurchaseRequests")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const params: any = {
        page,
        per_page: perPage
      }

      if (filters?.status) {
        params.status = filters.status
      }
      if (filters?.priority) {
        params.priority = filters.priority
      }
      if (filters?.search) {
        params.search = filters.search
      }

      const response = await axiosInstance.get("/v1/pms/purchase-requests", { params })
      return response.data
    } catch (error) {
      console.error("Error fetching purchase requests:", error)
      throw error
    }
  }

  static async getPurchaseRequestStats(): Promise<{
    total: number
    pending: number
    in_progress: number
    completed: number
    by_priority: Record<string, number>
  }> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getPurchaseRequestStats")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.get("/v1/pms/purchase-requests")
      const data = response.data.data
      
      const stats = {
        total: data.length,
        pending: data.filter((req: PurchaseRequest) => req.overall_status === "pending").length,
        in_progress: data.filter((req: PurchaseRequest) => req.overall_status === "in_progress").length,
        completed: data.filter((req: PurchaseRequest) => req.overall_status === "completed").length,
        by_priority: data.reduce((acc: Record<string, number>, req: PurchaseRequest) => {
          acc[req.priority] = (acc[req.priority] || 0) + 1
          return acc
        }, {})
      }
      
      return stats
    } catch (error) {
      console.error("Error fetching purchase request stats:", error)
      throw error
    }
  }

  /**
   * Create a new purchase request
   */
  static async createPurchaseRequest(
    requestData: CreatePurchaseRequestData
  ): Promise<CreatePurchaseRequestResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping createPurchaseRequest")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.post("/v1/pms/purchase-requests", requestData)
      return response.data
    } catch (error) {
      console.error("Error creating purchase request:", error)
      throw error
    }
  }

  /**
   * Update an existing purchase request
   */
  static async updatePurchaseRequest(
    id: string,
    requestData: UpdatePurchaseRequestData
  ): Promise<UpdatePurchaseRequestResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping updatePurchaseRequest")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.patch(`/v1/pms/purchase-requests/${id}`, requestData)
      return response.data
    } catch (error) {
      console.error(`Error updating purchase request with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Transition to the next stage
   */
  static async transitionToNextStage(
    id: string,
    transitionData: StageTransitionData
  ): Promise<StageTransitionResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping transitionToNextStage")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.post(`/v1/pms/purchase-requests/${id}/simple-transition-stage`, transitionData)
      return response.data
    } catch (error) {
      console.error(`Error transitioning stage for purchase request with ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Delete a purchase request
   */
  static async deletePurchaseRequest(id: string): Promise<DeletePurchaseRequestResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping deletePurchaseRequest")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.delete(`/v1/pms/purchase-requests/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting purchase request with ID ${id}:`, error)
      throw error
    }
  }
}

export default PurchaseRequestsService
