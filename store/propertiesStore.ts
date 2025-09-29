"use client"

import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface Property {
  id: string
  title: string
  district: string
  price: string
  views: number
  bedrooms?: number
  image: string
  status: 'available' | 'rented' | 'sold'
  type: string
  transactionType: 'rent' | 'sale'
}

export interface PropertiesResponse {
  success: boolean
  data: Property[]
  total: number
  filters: {
    transactionType?: string
    status?: string
    type?: string
    search?: string
    price?: string
  }
}

type FilterType = "all" | "available" | "sold" | "rented"

interface PropertiesStore {
  // State
  allProperties: Property[] // جميع العقارات المحفوظة
  filteredProperties: Property[] // العقارات المفلترة
  loading: boolean
  error: string | null
  total: number
  
  // Filter State
  transactionType: 'rent' | 'sale'
  activeFilter: FilterType
  search: string
  propertyType: string
  price: string
  
  // Actions
  setTransactionType: (type: 'rent' | 'sale') => void
  setActiveFilter: (filter: FilterType) => void
  setSearch: (search: string) => void
  setPropertyType: (type: string) => void
  setPrice: (price: string) => void
  
  // API Actions
  fetchAllProperties: () => Promise<void> // جلب جميع العقارات مرة واحدة
  clearFilters: () => void
  
  // Local Filtering
  applyFilters: () => void // تطبيق الفلاتر محلياً
  
  // Computed
  getStatusFromFilter: (filter: FilterType) => "all" | "available" | "rented" | "sold"
}

export const usePropertiesStore = create<PropertiesStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      allProperties: [], // جميع العقارات
      filteredProperties: [], // العقارات المفلترة
      loading: false,
      error: null,
      total: 0,
      
      // Filter State
      transactionType: 'rent',
      activeFilter: 'all',
      search: '',
      propertyType: '',
      price: '',
      
      // Actions
      setTransactionType: (type) => {
        console.log('Store: setTransactionType to', type)
        set({ transactionType: type })
        get().applyFilters() // تطبيق الفلاتر محلياً بدلاً من جلب البيانات
      },
      
      setActiveFilter: (filter) => {
        console.log('Store: setActiveFilter to', filter)
        set({ activeFilter: filter })
        get().applyFilters() // تطبيق الفلاتر محلياً
      },
      
      setSearch: (search) => {
        console.log('Store: setSearch to', search)
        set({ search })
        get().applyFilters() // تطبيق الفلاتر محلياً
      },
      
      setPropertyType: (type) => {
        console.log('Store: setPropertyType to', type)
        set({ propertyType: type })
        get().applyFilters() // تطبيق الفلاتر محلياً
      },
      
      setPrice: (price) => {
        console.log('Store: setPrice to', price)
        set({ price })
        get().applyFilters() // تطبيق الفلاتر محلياً
      },
      
      // API Actions
      fetchAllProperties: async () => {
        const state = get()
        console.log('Store: fetchAllProperties called')
        
        // منع الـ duplicate calls
        if (state.loading) {
          console.log('Store: Already loading, skipping fetchAllProperties')
          return;
        }
        
        set({ loading: true, error: null })
        
        try {
          // جلب جميع العقارات بدون فلاتر
          const url = '/api/properties'
          
          console.log('Store: Fetching all properties from URL:', url)
          
          const response = await fetch(url)
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const result: PropertiesResponse = await response.json()
          
          console.log('Store: API Response:', result)
          
          if (result.success) {
            set({ 
              allProperties: result.data, // حفظ جميع العقارات
              loading: false 
            })
            console.log('Store: All properties saved:', result.data.length, 'items')
            
            // تطبيق الفلاتر الحالية على البيانات الجديدة
            get().applyFilters()
          } else {
            throw new Error('Failed to fetch properties')
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
          console.error('Store: Error fetching properties:', err)
          set({ 
            error: errorMessage, 
            loading: false 
          })
        }
      },
      
      clearFilters: () => {
        console.log('Store: clearFilters called')
        set({
          activeFilter: 'all',
          search: '',
          propertyType: '',
          price: ''
        })
        get().applyFilters() // تطبيق الفلاتر محلياً
      },
      
      // Local Filtering
      applyFilters: () => {
        const state = get()
        console.log('Store: applyFilters called with state:', {
          transactionType: state.transactionType,
          activeFilter: state.activeFilter,
          search: state.search,
          propertyType: state.propertyType,
          price: state.price,
          allPropertiesCount: state.allProperties.length
        })
        
        let filtered = [...state.allProperties]
        
        // فلترة حسب نوع المعاملة
        if (state.transactionType) {
          filtered = filtered.filter(property => 
            property.transactionType === state.transactionType
          )
        }
        
        // فلترة حسب الحالة
        const status = state.getStatusFromFilter(state.activeFilter)
        if (status && status !== 'all') {
          filtered = filtered.filter(property => property.status === status)
        }
        
        // فلترة حسب نوع العقار
        if (state.propertyType) {
          filtered = filtered.filter(property => 
            property.type.toLowerCase().includes(state.propertyType.toLowerCase())
          )
        }
        
        // فلترة حسب البحث (العنوان أو المنطقة)
        if (state.search) {
          filtered = filtered.filter(property => 
            property.title.toLowerCase().includes(state.search.toLowerCase()) ||
            property.district.toLowerCase().includes(state.search.toLowerCase())
          )
        }
        
        // فلترة حسب السعر
        if (state.price) {
          const priceValue = parseFloat(state.price)
          if (!isNaN(priceValue)) {
            filtered = filtered.filter(property => {
              const propertyPrice = parseFloat(property.price.replace(/[^\d.]/g, ''))
              return propertyPrice <= priceValue
            })
          }
        }
        
        console.log('Store: Filtered properties:', filtered.length, 'out of', state.allProperties.length)
        
        set({
          filteredProperties: filtered,
          total: filtered.length
        })
      },
      
      // Computed
      getStatusFromFilter: (filter: FilterType): "all" | "available" | "rented" | "sold" => {
        switch (filter) {
          case "available":
            return "available"
          case "rented":
            return "rented"
          case "sold":
            return "sold"
          default:
            return "all"
        }
      }
    }),
    {
      name: 'properties-store',
    }
  )
)
