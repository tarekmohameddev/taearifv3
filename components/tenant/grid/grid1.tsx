"use client";

import { useEffect } from "react";
import { PropertyCard } from "@/components/property-card";
import { usePropertiesStore } from "@/store/propertiesStore";

interface PropertyGridProps {
  emptyMessage?: string;
  className?: string;
}

export default function PropertyGrid({
  emptyMessage = "لم يتم العثور على نتائج.",
  className,
}: PropertyGridProps) {
  // Store state
  const { filteredProperties, loading, error, total, fetchAllProperties } =
    usePropertiesStore();

  // جلب جميع البيانات عند تحميل المكون
  useEffect(() => {
    fetchAllProperties();
  }, [fetchAllProperties]);

  if (loading) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-lg text-gray-600 mt-4">جاري تحميل العقارات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">
              حدث خطأ في تحميل العقارات: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full bg-background py-8 ${className || ""}`}
      style={{
        backgroundColor: "transparent", // يمكن إضافة mergedData.background?.color هنا لاحقاً
      }}
    >
      <div
        className="mx-auto max-w-[1600px] px-4"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)", // يمكن إضافة mergedData.grid?.columns?.desktop هنا لاحقاً
          gap: "24px", // يمكن إضافة mergedData.grid?.gapX || mergedData.grid?.gapY هنا لاحقاً
        }}
      >
        {filteredProperties.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                تم العثور على {total} عقار
              </p>
            </div>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)", // يمكن إضافة mergedData.grid?.columns?.desktop هنا لاحقاً
                gap: "24px", // يمكن إضافة mergedData.grid?.gapX || mergedData.grid?.gapY هنا لاحقاً
              }}
            >
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} p={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">{emptyMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
