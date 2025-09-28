"use client"

import { PropertyCard } from "@/components/property-card"
import { Property } from "@/lib/mock-data"

interface PropertyGridProps {
  properties: Property[]
  emptyMessage?: string
}

export default function PropertyGrid({ 
  properties, 
  emptyMessage = "لم يتم العثور على نتائج." 
}: PropertyGridProps) {
  return (
    <section className="w-full bg-background py-8">
      <div className="mx-auto max-w-[1600px] px-4">
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} p={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  )
}
