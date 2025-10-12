"use client";

import type { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Props = {
  items: ReactNode[];
  space?: number;
  autoplay?: boolean;
  desktopCount?: number;
  showPagination?: boolean;
  // يسمح بضبط ارتفاع/نمط السلايد لتوحيد القياسات
  slideClassName?: string;
  // إظهار الأسهم على الهاتف فقط
  showMobileArrows?: boolean;
};

/**
 * Swiper Carousel
 * - سحب بالماوس واللمس (grabCursor)
 * - Loop لا نهائي
 * - تقليب كارد-كارد
 * - RTL بإضافة dir="rtl"
 * - Pagination اختياري
 * - slideClassName لتوحيد ارتفاع السلايدات
 * - أسهم التنقل على الهاتف فقط
 */
export default function SwiperCarousel({
  items,
  space = 16,
  autoplay = true,
  desktopCount = 4,
  showPagination = false,
  slideClassName = "h-full",
  showMobileArrows = true,
}: Props) {
  return (
    <div dir="rtl" className="relative">
      <Swiper
        modules={
          showPagination 
            ? [Autoplay, Pagination, Navigation] 
            : showMobileArrows 
            ? [Autoplay, Navigation] 
            : [Autoplay]
        }
        loop
        grabCursor 
        spaceBetween={space}
        slidesPerView={1.05}
        slidesPerGroup={1}
        autoplay={
          autoplay ? { delay: 3500, disableOnInteraction: false } : false
        }
        pagination={showPagination ? { clickable: true } : undefined}
        navigation={showMobileArrows ? true : false}
        breakpoints={{
          480: { 
            slidesPerView: 1.2, 
            centeredSlides: true,
            navigation: false // إخفاء الأسهم على الشاشات الأكبر
          },
          640: { 
            slidesPerView: 2, 
            centeredSlides: false,
            navigation: false
          },
          900: { 
            slidesPerView: 3, 
            centeredSlides: false,
            navigation: false
          },
          1280: { 
            slidesPerView: desktopCount, 
            centeredSlides: false,
            navigation: false
          },
        }}
        centeredSlides={true}
        autoHeight={false}
        className="!py-0 [&_.swiper-button-next]:!text-white [&_.swiper-button-prev]:!text-white [&_.swiper-button-next]:!bg-black/20 [&_.swiper-button-prev]:!bg-black/20 [&_.swiper-button-next]:!rounded-full [&_.swiper-button-prev]:!rounded-full [&_.swiper-button-next]:!w-10 [&_.swiper-button-prev]:!w-10 [&_.swiper-button-next]:!h-10 [&_.swiper-button-prev]:!h-10 [&_.swiper-button-next]:!text-sm [&_.swiper-button-prev]:!text-sm sm:[&_.swiper-button-next]:!hidden sm:[&_.swiper-button-prev]:!hidden"
      >
        {items.map((el, i) => (
          <SwiperSlide
            key={i}
            className={`select-none !py-0 ${slideClassName}`}
          >
            {/* اجعل المحتوى يملأ كامل الارتفاع الموحّد */}
            <div className="h-full">{el}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
