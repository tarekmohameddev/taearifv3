"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import StaticHeader1 from "@/components/tenant/header/StaticHeader1"
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1"
import PropertyFilter from "@/components/property-filter"
import FilterButtons from "@/components/filter-buttons"
import { PropertyCard } from "@/components/property-card"
import PropertiesSkeleton from "@/components/ui/properties-skeleton"
import PropertiesError from "@/components/ui/properties-error"
import Link from "next/link"

interface Property {
  id: string
  title: string
  district: string
  price: string
  views: number
  bedrooms: number
  bathrooms?: number
  area?: string
  type: string
  transactionType: string
  image: string
  status?: string
  description?: string
  features?: string[]
  location?: {
    lat: number
    lng: number
    address: string
  }
  contact?: {
    name: string
    phone: string
    email: string
  }
  images?: string[]
}

type FilterType = "all" | "available" | "sold" | "rented"

function SearchResults() {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // إنشاء AbortController للتحكم في timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 ثانية
      
      const response = await fetch('/api/properties', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && data.data) {
        setProperties(data.data)
        setError(null)
      } else {
        throw new Error(data.message || 'Failed to fetch properties')
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err)
      
      if (err.name === 'AbortError') {
        setError('انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.')
      } else if (err.message.includes('404')) {
        setError('لا توجد عقارات متاحة حالياً.')
      } else if (err.message.includes('500')) {
        setError('خطأ في الخادم. يرجى المحاولة لاحقاً.')
      } else {
        setError(err.message || 'فشل في تحميل العقارات')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])
  
  const filteredProperties = properties.filter(property => {
    if (activeFilter === "all") return true
    if (activeFilter === "available") return property.status === "available"
    if (activeFilter === "sold") return property.status === "sold"
    if (activeFilter === "rented") return property.status === "rented"
    return true
  })

  if (loading) {
    return (
      <div className="w-full bg-background py-8">
        <PropertiesSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full bg-background py-8">
        <PropertiesError error={error} onRetry={fetchProperties} />
      </div>
    )
  }

  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        <FilterButtons transactionType="all" activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <PropertyCard p={property} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">لم يتم العثور على نتائج.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function TenantPropertiesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StaticHeader1 />
      
      {/* قسم الفلتر */}
      <section className="w-full py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <PropertyFilter transactionType="all" />
        </div>
      </section>

      <SearchResults />
      
      <StaticFooter1 />
    </div>
  )
}
