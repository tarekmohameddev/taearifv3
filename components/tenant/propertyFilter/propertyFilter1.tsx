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

interface CityOption {
  id: string | number;
  name: string;
}

interface DistrictOption {
  id: string | number;
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
  const { search, cityId, district, propertyType, categoryId, price, setSearch, setCityId, setDistrict, setPropertyType, setCategoryId, setPrice } =
    usePropertiesStore();

  // Tenant ID hook
  const { tenantId: currentTenantId, isLoading: tenantLoading } = useTenantId();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]); // تغيير إلى PropertyType[]
  const [filteredTypes, setFilteredTypes] = useState<PropertyType[]>([]); // تغيير إلى PropertyType[]
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

  // Cities state fetched from external API
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [cityLoading, setCityLoading] = useState<boolean>(false);
  const [cityError, setCityError] = useState<string | null>(null);

  // Districts state fetched from external API
  const [districtOptions, setDistrictOptions] = useState<DistrictOption[]>([]);
  const [districtLoading, setDistrictLoading] = useState<boolean>(false);
  const [districtError, setDistrictError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        setCityLoading(true);
        setCityError(null);
        const res = await fetch("https://nzl-backend.com/api/cities?country_id=1");
        if (!res.ok) throw new Error(`Failed to load cities: ${res.status}`);
        const data = await res.json();
        const list: CityOption[] = Array.isArray(data?.data)
          ? data.data.map((c: any) => ({ id: c.id, name: c.name_ar || c.name_en || String(c.id) }))
          : [];
        if (isMounted) setCityOptions(list);
      } catch (e: any) {
        if (isMounted) setCityError(e?.message || "تعذر تحميل المدن");
      } finally {
        if (isMounted) setCityLoading(false);
      }
    };
    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // جلب الأحياء عند اختيار مدينة
  useEffect(() => {
    let isMounted = true;
    const fetchDistricts = async () => {
      if (!search) {
        setDistrictOptions([]);
        setDistrict("");
        return;
      }

      try {
        setDistrictLoading(true);
        setDistrictError(null);
        
        // البحث عن city_id للمدينة المختارة
        const selectedCity = cityOptions.find(city => city.name === search);
        if (!selectedCity) {
          setDistrictOptions([]);
          setDistrict("");
          setCityId("");
          return;
        }

        const res = await fetch(`https://nzl-backend.com/api/districts?city_id=${selectedCity.id}`);
        if (!res.ok) throw new Error(`Failed to load districts: ${res.status}`);
        const data = await res.json();
        const list: DistrictOption[] = Array.isArray(data?.data)
          ? data.data.map((d: any) => ({ id: d.id, name: d.name_ar || d.name_en || String(d.id) }))
          : [];
        if (isMounted) {
          setDistrictOptions(list);
          setDistrict(""); // مسح الحي المختار عند تغيير المدينة
          setCityId(selectedCity.id.toString()); // حفظ city_id
        }
      } catch (e: any) {
        if (isMounted) setDistrictError(e?.message || "تعذر تحميل الأحياء");
      } finally {
        if (isMounted) setDistrictLoading(false);
      }
    };
    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [search, cityOptions]);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const districtDropdownRef = useRef<HTMLDivElement>(null);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

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
          // استخدام البيانات كاملة مع الـ IDs
          setPropertyTypes(data.data);
          setFilteredTypes(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } else if (
        actualPropertyTypesSource === "static" &&
        actualStaticPropertyTypes?.length > 0
      ) {
        // استخدام القائمة الثابتة - تحويل إلى PropertyType format
        const staticTypes = actualStaticPropertyTypes.map((name: string, index: number) => ({
          id: index + 1,
          name: name
        }));
        setPropertyTypes(staticTypes);
        setFilteredTypes(staticTypes);
      } else {
        // استخدام القائمة الافتراضية كـ fallback - تحويل إلى PropertyType format
        const defaultTypes = defaultPropertyTypes.map((name: string, index: number) => ({
          id: index + 1,
          name: name
        }));
        setPropertyTypes(defaultTypes);
        setFilteredTypes(defaultTypes);
      }
    } catch (err) {
      console.error("Error fetching property types:", err);
      setError(
        err instanceof Error ? err.message : "حدث خطأ في جلب أنواع العقارات",
      );
      // في حالة الخطأ، استخدم القائمة الافتراضية - تحويل إلى PropertyType format
      const defaultTypes = defaultPropertyTypes.map((name: string, index: number) => ({
        id: index + 1,
        name: name
      }));
      setPropertyTypes(defaultTypes);
      setFilteredTypes(defaultTypes);
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
      // تحويل إلى PropertyType format
      const staticTypes = actualStaticPropertyTypes.map((name: string, index: number) => ({
        id: index + 1,
        name: name
      }));
      setPropertyTypes(staticTypes);
      setFilteredTypes(staticTypes);
    }
  }, [actualStaticPropertyTypes, actualPropertyTypesSource]);

  // تحديث الفلتر عند تغيير propertyTypes
  useEffect(() => {
    setFilteredTypes(propertyTypes);
  }, [propertyTypes]);

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCityOpen(false);
      }
      if (
        districtDropdownRef.current &&
        !districtDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDistrictOpen(false);
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

  const handleTypeSelect = (type: PropertyType) => {
    setPropertyType(type.name); // حفظ الاسم للعرض
    setCategoryId(type.id.toString()); // حفظ الـ ID للـ API
    console.log("Property type selected:", { name: type.name, id: type.id }); // Debug
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
        <div className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]" ref={cityDropdownRef}>
          <div
            className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
            onClick={() => setIsCityOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isCityOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {search || searchPlaceholder}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          {isCityOpen && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
              {cityLoading ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">جاري تحميل المدن...</div>
              ) : cityError ? (
                <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">{cityError}</div>
              ) : cityOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">لا توجد مدن متاحة</div>
              ) : (
                cityOptions.map((c) => (
                  <div
                    key={String(c.id)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                    role="option"
                    onClick={() => {
                      setSearch(c.name);
                      setIsCityOpen(false);
                    }}
                  >
                    {c.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* الحي السكني */}
        <div className="py-2 w-full md:w-[23.86%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]" ref={districtDropdownRef}>
          <div
            className={`w-full h-full flex items-center justify-between px-2 cursor-pointer select-none ${!search ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => search && setIsDistrictOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isDistrictOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {district ? districtOptions.find(d => d.id.toString() === district)?.name || district : "اختر الحي السكني"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          {isDistrictOpen && search && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-[10px] mt-1 max-h-60 overflow-y-auto shadow-lg">
              {districtLoading ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">جاري تحميل الأحياء...</div>
              ) : districtError ? (
                <div className="px-4 py-3 text-red-500 text-sm md:text-base text-center">{districtError}</div>
              ) : districtOptions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm md:text-base text-center">لا توجد أحياء متاحة</div>
              ) : (
                districtOptions.map((d) => (
                  <div
                    key={String(d.id)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                    role="option"
                    onClick={() => {
                      setDistrict(d.id.toString()); // حفظ state_id بدلاً من الاسم
                      setIsDistrictOpen(false);
                    }}
                  >
                    {d.name}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* نوع العقار */}
        <div className="py-2 w-full md:w-[23.86%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]" ref={dropdownRef}>
          <div
            className="w-full h-full flex items-center justify-between px-2 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen((p) => !p)}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span className="text-gray-900 text-xs xs:text-base md:text-lg">
              {propertyType || propertyTypePlaceholder}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
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
                filteredTypes.map((type) => (
                  <div
                    key={type.id}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm md:text-base"
                    role="option"
                    onClick={() => handleTypeSelect(type)}
                  >
                    {type.name}
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
