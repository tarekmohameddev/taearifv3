"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePropertiesStore } from "@/store/propertiesStore";
import { useTenantId } from "@/hooks/useTenantId";

// القائمة الافتراضية لأنواع العقارات (تُستخدم كـ fallback)
const defaultPropertyTypes = [
  "مزرعة",
  "دور",
  "ارض سكن",
  "بيت",
  "شقة ارضيه",
  "شقة علويه",
  "أرض زراعية",
  "أرض استراحة",
  "استراحة",
  "فلة غير مكتملة",
  "أرض تجارية",
];

interface PropertyType {
  id: number;
  name: string;
}

interface PropertyFilterProps {
  className?: string;
  propertyTypesSource?: "static" | "dynamic";
  propertyTypes?: string[];
  propertyTypesApiUrl?: string;
  tenantId?: string;
  searchPlaceholder?: string;
  propertyTypePlaceholder?: string;
  pricePlaceholder?: string;
  searchButtonText?: string;
  noResultsText?: string;
}

export default function PropertyFilter({
  className,
  propertyTypesSource = "static",
  propertyTypes: staticPropertyTypes = defaultPropertyTypes,
  propertyTypesApiUrl,
  tenantId,
  searchPlaceholder = "أدخل المدينة أو المنطقة",
  propertyTypePlaceholder = "نوع العقار",
  pricePlaceholder = "السعر",
  searchButtonText = "بحث",
  noResultsText = "لم يتم العثور على نتائج.",
  content, // البيانات من backend
  ...props
}: PropertyFilterProps & { content?: any }) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Store state
  const { search, propertyType, price, setSearch, setPropertyType, setPrice } =
    usePropertiesStore();

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // استخراج البيانات من content إذا كانت متاحة
  const actualPropertyTypesSource =
    content?.propertyTypesSource || propertyTypesSource;
  const actualPropertyTypesApiUrl =
    content?.propertyTypesApiUrl || propertyTypesApiUrl;
  const actualTenantId = content?.tenantId || tenantId || currentTenantId;
  const actualStaticPropertyTypes =
    content?.propertyTypes || staticPropertyTypes;

  // دالة لجلب أنواع العقارات من API أو استخدام القائمة الثابتة
  const fetchPropertyTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      if (
        actualPropertyTypesSource === "dynamic" &&
        actualPropertyTypesApiUrl &&
        actualTenantId
      ) {
        // جلب البيانات من API
        const apiUrl = actualPropertyTypesApiUrl.replace(
          /\{[^}]*\}/g,
          actualTenantId,
        );

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          const types = data.data.map((item: PropertyType) => item.name);
          setPropertyTypes(types);
          setFilteredTypes(types);
        } else {
          throw new Error("Invalid response format");
        }
      } else if (
        actualPropertyTypesSource === "static" &&
        actualStaticPropertyTypes?.length > 0
      ) {
        // استخدام القائمة الثابتة
        setPropertyTypes(actualStaticPropertyTypes);
        setFilteredTypes(actualStaticPropertyTypes);
      } else {
        // استخدام القائمة الافتراضية كـ fallback
        setPropertyTypes(defaultPropertyTypes);
        setFilteredTypes(defaultPropertyTypes);
      }
    } catch (err) {
      console.error("Error fetching property types:", err);
      setError(
        err instanceof Error ? err.message : "حدث خطأ في جلب أنواع العقارات",
      );
      // في حالة الخطأ، استخدم القائمة الافتراضية
      setPropertyTypes(defaultPropertyTypes);
      setFilteredTypes(defaultPropertyTypes);
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    // لا نجلب البيانات إذا كان tenantId لا يزال يتم تحميله
    if (actualPropertyTypesSource === "dynamic" && tenantLoading) {
      return;
    }
    fetchPropertyTypes();
  }, [
    actualPropertyTypesSource,
    actualPropertyTypesApiUrl,
    actualTenantId,
    tenantLoading,
  ]);

  // تحديث البيانات عند تغيير currentTenantId
  useEffect(() => {
    if (currentTenantId && actualPropertyTypesSource === "dynamic") {
      fetchPropertyTypes();
    }
  }, [currentTenantId]);

  // تحديث البيانات عند تغيير content
  useEffect(() => {
    if (content) {
      fetchPropertyTypes();
    }
  }, [content]);

  // تحديث البيانات عند تغيير staticPropertyTypes
  useEffect(() => {
    if (
      actualPropertyTypesSource === "static" &&
      actualStaticPropertyTypes?.length > 0
    ) {
      setPropertyTypes(actualStaticPropertyTypes);
      setFilteredTypes(actualStaticPropertyTypes);
    }
  }, [actualStaticPropertyTypes, actualPropertyTypesSource]);

  // تحديث الفلتر عند تغيير البحث
  useEffect(() => {
    if (propertyType) {
      setFilteredTypes(
        propertyTypes.filter((type) =>
          type.toLowerCase().includes(propertyType.toLowerCase()),
        ),
      );
    } else {
      setFilteredTypes(propertyTypes);
    }
  }, [propertyType, propertyTypes]);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // جلب البيانات من API عند الضغط على submit
    const { fetchProperties } = usePropertiesStore.getState();
    fetchProperties(1);
  };

  const handleTypeSelect = (type: string) => {
    setPropertyType(type);
    setIsDropdownOpen(false);
    // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
  };

  return (
    <div className={`mb-6 md:mb-18 ${className || ""} max-w-[1600px] mx-auto`}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xs:grid-cols-2 md:flex flex-col md:flex-row mt-4 bg-white rounded-[10px] gap-x-5 md:gap-x-5 gap-y-4 p-4 "
      >
        {/* البحث عن المدينة */}
        <div className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
            }}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            name="search"
          />
        </div>

        {/* نوع العقار */}
        <div className="h-full relative w-full md:w-[23.86%]" ref={dropdownRef}>
          <div className="w-full h-full relative">
            <div className="relative">
              <Input
                placeholder={propertyTypePlaceholder}
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full h-12 md:h-14 outline-none pr-10 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border border-gray-200 rounded-[10px] focus-visible:ring-0"
                name="propertyType"
              />
              <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
                {loading ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    جاري التحميل...
                  </div>
                ) : error ? (
                  <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">
                    {error}
                  </div>
                ) : propertyTypes.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">
                    لا توجد أنواع عقارات متاحة
                  </div>
                ) : filteredTypes.length > 0 ? (
                  filteredTypes.map((type, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                      onClick={() => handleTypeSelect(type)}
                    >
                      {type}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm md:text-base">
                    {noResultsText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* السعر */}
        <div className="w-full md:w-[23.86%] h-12 relative flex items-center justify-center py-2 border border-gray-200 md:h-14 rounded-[10px]">
          <Input
            placeholder={pricePlaceholder}
            value={price}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setPrice(v);
                return;
              }
              const n = Number(v);
              if (Number.isNaN(n)) return;
              const finalPrice = String(n >= 0 ? n : 0);
              setPrice(finalPrice);
              // لا يتم جلب البيانات تلقائياً - فقط عند الضغط على submit
            }}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            type="number"
            min={0}
            inputMode="numeric"
            name="price"
          />
        </div>

        {/* زر البحث */}
        <div className="w-full md:w-[15.18%] h-full relative">
          <Button
            type="submit"
            className="text-xs xs:text-base md:text-lg flex items-center justify-center w-full h-12 md:h-14 text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px]"
          >
            {searchButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
