"use client";

import { useEffect } from "react";
import { PropertyCard } from "@/components/property-card";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";
import Pagination from "@/components/ui/pagination";

interface PropertyGridProps {
  emptyMessage?: string;
  className?: string;
}

export default function PropertyGrid({
  emptyMessage = "لم يتم العثور على نتائج.",
  className,
}: PropertyGridProps) {
  // Tenant ID hook
  const { tenantId, isLoading: tenantLoading } = useTenantId();
  
  // Store state
  const { 
    filteredProperties, 
    loading, 
    error, 
    total, 
    pagination,
    fetchProperties,
    setCurrentPage,
    goToNextPage,
    goToPreviousPage,
    setTenantId
  } = usePropertiesStore();

  // تعيين tenantId في الـ store عند تحميله
  useEffect(() => {
    if (tenantId) {
      setTenantId(tenantId);
    }
  }, [tenantId, setTenantId]);

  // إذا كان tenantId لا يزال يتم تحميله
  if (tenantLoading) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="text-lg text-gray-600 mt-4">جاري تحميل بيانات الموقع...</p>
          </div>
        </div>
      </section>
    );
  }

  // إذا لم نجد tenantId
  if (!tenantId) {
    return (
      <section className="w-full bg-background py-8">
        <div className="mx-auto max-w-[1600px] px-4">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">تأكد من أنك تصل إلى الموقع من الرابط الصحيح</p>
          </div>
        </div>
      </section>
    );
  }

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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">
              حدث خطأ في تحميل العقارات
            </p>
            <p className="text-sm text-gray-500 mt-2">{error}</p>
            <button 
              onClick={() => fetchProperties(1)} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إعادة المحاولة
            </button>
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
                تم العثور على {total} عقار{total !== 1 ? "ات" : ""}
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

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  onPageChange={setCurrentPage}
                  onNextPage={goToNextPage}
                  onPreviousPage={goToPreviousPage}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.per_page}
                  showingFrom={pagination.from}
                  showingTo={pagination.to}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-lg text-gray-600 font-medium">{emptyMessage}</p>
            <p className="text-sm text-gray-500 mt-2">جرب تغيير الفلاتر أو البحث بكلمات أخرى</p>
          </div>
        )}
      </div>
    </section>
  );
}
