"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePropertiesStore } from "@/store/propertiesStore"

type FilterType = "all" | "available" | "sold" | "rented"

interface FilterButtonsProps {
  className?: string
}

export default function FilterButtons({ className }: FilterButtonsProps) {
  // Store state
  const { 
    transactionType, 
    activeFilter, 
    setActiveFilter 
  } = usePropertiesStore()
  const getFilterButtons = () => {
    if (transactionType === "rent") {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للإيجار" },
        { key: "rented" as FilterType, label: "تم تأجيرها" }
      ]
    } else {
      return [
        { key: "all" as FilterType, label: "الكل" },
        { key: "available" as FilterType, label: "المتاحة للبيع" },
        { key: "sold" as FilterType, label: "تم بيعها" }
      ]
    }
  }

  return (
    <div className={`flex flex-col md:flex-row justify-between ${className || ''} max-w-[1600px] mx-auto`}>
      {/* زر طلب المعاينة */}
      <Link 
        href="/application-form"
        className="w-[80%] mb-[20px] md:w-fit md:mx-0 flex items-center justify-center text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px] bg-emerald-600 text-white mx-auto hover:bg-emerald-700"
      >
        طلب معاينة
      </Link>

      {/* أزرار الفلتر */}
      <div className="filterButtons mb-6 flex items-center justify-center md:justify-start gap-x-[24px]">
        {getFilterButtons().map((button) => (
          <Button
            key={button.key}
            onClick={() => {
              setActiveFilter(button.key)
            }}
            className={`w-fit text-[12px] md:text-[14px] lg:text-[20px] relative transition-all duration-300 ease-in-out text-nowrap rounded-[10px] px-[20px] py-[8px] ${
              activeFilter === button.key
                ? "text-white bg-emerald-600"
                : "text-emerald-600 bg-white hover:bg-emerald-50"
            }`}
          >
            {button.label}
          </Button>
        ))}
      </div>
    </div>
  )
}








































