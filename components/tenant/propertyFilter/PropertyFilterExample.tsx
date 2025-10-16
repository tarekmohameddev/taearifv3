"use client";

import PropertyFilter from "./propertyFilter1";

// مثال على استخدام المكون مع API
export default function PropertyFilterExample() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Property Filter Examples</h2>
      
      {/* مثال 1: استخدام API */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Dynamic API Example</h3>
        <PropertyFilter
          propertyTypesSource="dynamic"
          propertyTypesApiUrl="https://taearif.com/api/v1/tenant-website/{tenantId}/properties/categories/direct"
          tenantId="your-tenant-id-here"
          searchPlaceholder="ابحث عن المدينة"
          propertyTypePlaceholder="اختر نوع العقار"
          pricePlaceholder="أدخل السعر"
          searchButtonText="بحث"
          noResultsText="لا توجد نتائج"
        />
      </div>

      {/* مثال 2: استخدام قائمة ثابتة */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Static List Example</h3>
        <PropertyFilter
          propertyTypesSource="static"
          propertyTypes={[
            "فيلا",
            "شقة",
            "أرض",
            "مزرعة",
            "محل تجاري"
          ]}
          searchPlaceholder="ابحث عن المنطقة"
          propertyTypePlaceholder="نوع العقار"
          pricePlaceholder="السعر"
          searchButtonText="بحث"
          noResultsText="لا توجد نتائج"
        />
      </div>

      {/* مثال 3: استخدام القائمة الافتراضية */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Default List Example</h3>
        <PropertyFilter
          searchPlaceholder="ابحث عن المدينة"
          propertyTypePlaceholder="نوع العقار"
          pricePlaceholder="السعر"
          searchButtonText="بحث"
          noResultsText="لا توجد نتائج"
        />
      </div>
    </div>
  );
}
