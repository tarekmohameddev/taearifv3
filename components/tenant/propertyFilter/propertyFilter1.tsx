"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePropertiesStore } from "@/store/propertiesStore"

const propertyTypes = [
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
  "أرض تجارية"
]

interface PropertyFilterProps {
  className?: string
}

export default function PropertyFilter({ className }: PropertyFilterProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Store state
  const { 
    search, 
    propertyType, 
    price, 
    setSearch, 
    setPropertyType, 
    setPrice 
  } = usePropertiesStore()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredTypes, setFilteredTypes] = useState(propertyTypes)

  // تحديث الفلتر عند تغيير البحث
  useEffect(() => {
    if (propertyType) {
      setFilteredTypes(propertyTypes.filter(type => 
        type.toLowerCase().includes(propertyType.toLowerCase())
      ))
    } else {
      setFilteredTypes(propertyTypes)
    }
  }, [propertyType])

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // لا حاجة لـ router.push لأن store سيتولى تحديث البيانات
  }

  const handleTypeSelect = (type: string) => {
    setPropertyType(type)
    setIsDropdownOpen(false)
  }

  return (
    <div className={`mb-6 md:mb-18 ${className || ''} max-w-[1600px] mx-auto`}>
      <form 
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xs:grid-cols-2 md:flex flex-col md:flex-row mt-4 bg-white rounded-[10px] gap-x-5 md:gap-x-5 gap-y-4 p-4 "
      >
        {/* البحث عن المدينة */}
        <div className="py-2 w-full md:w-[32.32%] relative flex items-center justify-center border border-gray-200 h-12 md:h-14 rounded-[10px]">
          <Input
            placeholder="أدخل المدينة أو المنطقة"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-full outline-none pr-2 placeholder:text-gray-500 placeholder:text-xs xs:placeholder:text-base md:placeholder:text-lg placeholder:font-normal border-0 focus-visible:ring-0"
            name="search"
          />
        </div>

        {/* نوع العقار */}
        <div className="h-full relative w-full md:w-[23.86%]" ref={dropdownRef}>
          <div className="w-full h-full relative">
            <div className="relative">
              <Input
                placeholder="نوع العقار"
                value={propertyType}
                onChange={(e) => {
                  setPropertyType(e.target.value)
                  setIsDropdownOpen(true)
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
                {filteredTypes.length > 0 ? (
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
                    لم يتم العثور على نتائج.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* السعر */}
        <div className="w-full md:w-[23.86%] h-12 relative flex items-center justify-center py-2 border border-gray-200 md:h-14 rounded-[10px]">
          <Input
            placeholder="السعر"
            value={price}
            onChange={(e) => {
              const v = e.target.value
              if (v === "") {
                setPrice(v)
                return
              }
              const n = Number(v)
              if (Number.isNaN(n)) return
              setPrice(String(n >= 0 ? n : 0))
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
            بحث
          </Button>
        </div>
      </form>
    </div>
  )
}
