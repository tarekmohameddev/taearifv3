"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import StaticHeader1 from "@/components/tenant/header/StaticHeader1"
import StaticFooter1 from "@/components/tenant/footer/StaticFooter1"
import PropertyDetail from "@/components/property-detail"
import PropertySkeleton from "@/components/ui/property-skeleton"
import PropertyNotFound from "@/components/ui/property-not-found"

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

export default function TenantForRentPropertyPage() {
  const params = useParams()
  const propertyId = params.id as string
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProperty = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // إنشاء AbortController للتحكم في timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 ثواني
      
      const response = await fetch(`/api/properties/${propertyId}`, {
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
        setProperty(data.data)
        setError(null)
      } else {
        throw new Error(data.message || 'Property not found')
      }
    } catch (err: any) {
      console.error('Error fetching property:', err)
      
      if (err.name === 'AbortError') {
        setError('انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.')
      } else if (err.message.includes('404')) {
        setError('Property not found')
      } else if (err.message.includes('500')) {
        setError('خطأ في الخادم. يرجى المحاولة لاحقاً.')
      } else {
        setError(err.message || 'فشل في تحميل العقار')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  // Loading State - Skeleton Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <StaticHeader1 />
        <main className="flex-1">
          <PropertySkeleton />
        </main>
        <StaticFooter1 />
      </div>
    )
  }

  // Error State - Beautiful 404 Page
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col" dir="rtl">
        <StaticHeader1 />
        <main className="flex-1">
          <PropertyNotFound propertyId={propertyId} />
        </main>
        <StaticFooter1 />
      </div>
    )
  }

  // Success State - Property Detail
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <StaticHeader1 />
      <main className="flex-1">
        <PropertyDetail property={property} />
      </main>
      <StaticFooter1 />
    </div>
  )
}
