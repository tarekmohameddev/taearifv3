"use client"

import axiosInstance from "@/lib/axiosInstance"
import useAuthStore from "@/context/AuthContext"

// Types for API responses
export interface PurchaseDashboardStatistics {
  total_requests: number
  pending_requests: number
  in_progress_requests: number
  completed_requests: number
  average_progress: number
}

export interface PriorityBreakdown {
  [key: string]: number
}

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
  pricePerMeter: string
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

export interface RecentRequest {
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

export interface RecentRequestsData {
  data: RecentRequest[]
  pagination: Pagination
}

export interface PurchaseDashboardData {
  statistics: PurchaseDashboardStatistics
  priority_breakdown: PriorityBreakdown
  recent_requests: RecentRequestsData
}

export interface PurchaseDashboardResponse {
  success: boolean
  data: PurchaseDashboardData
  message: string
}

// Service functions
export class PurchaseDashboardService {
  /**
   * Get purchase management dashboard data
   */
  static async getDashboardData(): Promise<PurchaseDashboardResponse> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getDashboardData")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.get("/v1/pms/dashboard")
      return response.data
    } catch (error) {
      console.error("Error fetching purchase dashboard data:", error)
      throw error
    }
  }

  /**
   * Get recent purchase requests with pagination
   */
  static async getRecentRequests(page: number = 1, perPage: number = 10): Promise<RecentRequestsData> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getRecentRequests")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.get("/v1/pms/dashboard", {
        params: {
          recent_page: page,
          recent_per_page: perPage
        }
      })
      return response.data.data.recent_requests
    } catch (error) {
      console.error("Error fetching recent requests:", error)
      throw error
    }
  }

  /**
   * Get purchase statistics
   */
  static async getStatistics(): Promise<PurchaseDashboardStatistics> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getStatistics")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.get("/v1/pms/dashboard")
      return response.data.data.statistics
    } catch (error) {
      console.error("Error fetching purchase statistics:", error)
      throw error
    }
  }

  /**
   * Get priority breakdown
   */
  static async getPriorityBreakdown(): Promise<PriorityBreakdown> {
    const token = useAuthStore.getState().userData?.token
    if (!token) {
      console.log("No token available, skipping getPriorityBreakdown")
      throw new Error("Authentication required. Please login.")
    }

    try {
      const response = await axiosInstance.get("/v1/pms/dashboard")
      return response.data.data.priority_breakdown
    } catch (error) {
      console.error("Error fetching priority breakdown:", error)
      throw error
    }
  }
}

export default PurchaseDashboardService
