"use client"

import axiosInstance from "@/lib/axiosInstance"

export interface Property {
  id: number
  visits: number
  title: string
  address: string
  slug: string
  price: string
  type: string
  beds: number
  bath: number
  area: string
  transaction_type: string
  features: string | string[]
  status: number
  featured_image: string
  featured: boolean
  created_at: string
  updated_at: string
  payment_method: string | null
}

export interface PropertiesResponse {
  status: string
  data: {
    properties: Property[]
    purposes_filter: string[]
    specifics_filters: any
    total_reorder_featured: number
    pagination: {
      total: number
      per_page: number
      current_page: number
      last_page: number
      from: number
      to: number
    }
  }
}

export class PropertiesService {
  /**
   * Get all properties
   */
  static async getProperties(): Promise<PropertiesResponse> {
    try {
      const response = await axiosInstance.get("/properties")
      return response.data
    } catch (error) {
      console.error("Error fetching properties:", error)
      throw error
    }
  }

  /**
   * Get a single property by ID
   */
  static async getProperty(id: number): Promise<{ success: boolean; data: Property; message: string }> {
    try {
      const response = await axiosInstance.get(`/properties/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error)
      throw error
    }
  }
}

export default PropertiesService
