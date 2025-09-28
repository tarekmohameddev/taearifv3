"use client"

import type { ReactNode } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

type Props = {
  items: ReactNode[]
  space?: number
  autoplay?: boolean
  desktopCount?: number
  showPagination?: boolean
  // يسمح بضبط ارتفاع/نمط السلايد لتوحيد القياسات
  slideClassName?: string
}

/**
 * Swiper Carousel
 * - سحب بالماوس واللمس (grabCursor)
 * - Loop لا نهائي
 * - تقليب كارد-كارد
 * - RTL بإضافة dir="rtl"
 * - Pagination اختياري
 * - slideClassName لتوحيد ارتفاع السلايدات
 */
export default function SwiperCarousel({
  items,
  space = 16,
  autoplay = true,
  desktopCount = 4,
  showPagination = false,
  slideClassName = "h-full",
}: Props) {
  return (
    <div dir="rtl">
      <Swiper
        modules={showPagination ? [Autoplay, Pagination] : [Autoplay]}
        loop
        grabCursor
        spaceBetween={space}
        slidesPerView={1.05}
        slidesPerGroup={1}
        autoplay={autoplay ? { delay: 3500, disableOnInteraction: false } : false}
        pagination={showPagination ? { clickable: true } : undefined}
        breakpoints={{
          480: { slidesPerView: 1.2, centeredSlides: true },
          640: { slidesPerView: 2, centeredSlides: false },
          900: { slidesPerView: 3, centeredSlides: false },
          1280: { slidesPerView: desktopCount, centeredSlides: false },
        }}
        centeredSlides={true}
        autoHeight={false}
        className="!py-0"
      >
        {items.map((el, i) => (
          <SwiperSlide key={i} className={`select-none !py-0 ${slideClassName}`}>
            {/* اجعل المحتوى يملأ كامل الارتفاع الموحّد */}
            <div className="h-full">{el}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
