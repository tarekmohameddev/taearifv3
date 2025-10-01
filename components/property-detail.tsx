"use client";

import { useState, useRef, useEffect } from "react";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms: number;
  bathrooms?: number;
  area?: string;
  type: string;
  transactionType: string;
  image: string;
  status?: string;
  description?: string;
  features?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  images?: string[];
}
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import SwiperCarousel from "@/components/ui/swiper-carousel2";

interface PropertyDetailProps {
  property: Property;
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState(property.image);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // صور العقار الوهمية
  const propertyImages = [
    property.image,
    property.image,
    property.image,
    property.image,
    property.image,
  ];

  // الحصول على عقارات مشابهة من API
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // جلب العقارات المشابهة
  const fetchSimilarProperties = async () => {
    try {
      setLoadingSimilar(true);
      const response = await fetch("/api/properties/latestRentals?limit=3", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSimilarProperties(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching similar properties:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking submitted:", {
      ...bookingForm,
      date: selectedDate,
      time: selectedTime,
    });
    // TODO: Handle booking submission
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = (imageSrc: string, index?: number) => {
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index || 0);
    setIsDialogOpen(true);
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    // افتح الصورة في dialog عند الضغط عليها
    handleImageClick(imageSrc, index);
  };

  const handlePreviousImage = () => {
    const prevIndex =
      selectedImageIndex > 0
        ? selectedImageIndex - 1
        : propertyImages.length - 1;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(propertyImages[prevIndex]);
  };

  const handleNextImage = () => {
    const nextIndex =
      selectedImageIndex < propertyImages.length - 1
        ? selectedImageIndex + 1
        : 0;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(propertyImages[nextIndex]);
  };

  // وظائف السحب باليد
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePreviousImage();
    }
  };

  // جلب العقارات المشابهة عند تحميل المكون
  useEffect(() => {
    fetchSimilarProperties();
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* المحتوى الرئيسي */}
          <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
            <div className="flex flex-col gap-y-8 lg:gap-y-10">
              {/* العنوان ونوع العرض */}
              <div className="flex flex-row items-center justify-between">
                <h1 className="font-bold text-xs xs:text-sm leading-4 rounded-md text-white bg-emerald-600 w-20 h-8 flex items-center justify-center md:text-xl lg:text-2xl md:w-28 md:h-11">
                  {property.transactionType === "rent" ? "للإيجار" : "للبيع"}
                </h1>
                <div className="sharesocials flex flex-row gap-x-6" dir="ltr">
                  <button className="cursor-pointer">
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* تفاصيل العقار */}
              <div className="space-y-4">
                <p className="font-bold text-gray-600 text-xs xs:text-sm leading-4 md:text-2xl md:leading-7">
                  {property.district}
                </p>
                <p className="font-bold text-gray-600 text-xl leading-6 md:leading-7">
                  {property.title}
                </p>
                <p className="text-emerald-600 text-2xl leading-7 font-bold md:text-3xl lg:leading-9">
                  {property.price} ريال سعودي
                </p>
                <p className="text-gray-600 text-sm leading-6 font-normal md:text-base lg:text-xl lg:leading-7">
                  مدخل مستقل، غرفتين نوم بينهم دورة مياه، صالة، مطبخ، وغرفة
                  طعام، مجلس مع دورة مياه، مكيفات شباك، تيار كهربائي مستقل
                </p>
              </div>

              {/* تفاصيل العقار في شبكة */}
              <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      نوع العرض:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.transactionType === "rent" ? "للإيجار" : "للبيع"}
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      المساحة:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    130 م²
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      نوع العقار:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.type}
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      التأثيث:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    مكيفات شباك
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      الدور:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    اثنين
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      التشطيب:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    جيدة من منخفضة
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      عدد الغرف:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.bedrooms || 4}
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      الحمامات:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    2
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <MapPinIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <a
                    href="https://maps.google.com/?q=26.5054641,43.6368531&entry=gps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold leading-4 text-xs xs:text-sm md:text-base text-emerald-600 underline"
                  >
                    عرض العنوان
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6">
                <Image
                  src={mainImage}
                  alt={property.title}
                  fill
                  className="w-full h-full object-cover cursor-pointer rounded-lg"
                  onClick={() => handleImageClick(mainImage, 0)}
                />
                <div className="absolute bottom-2 right-2 opacity-50">
                  <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      دليل الجواء
                    </span>
                  </div>
                </div>
              </div>

              {/* نص توضيحي - يظهر فقط عند وجود صور إضافية */}
              {propertyImages.length > 1 && (
                <p className="text-xs text-gray-500 mb-2 text-center">
                  اضغط على أي صورة لفتحها في نافذة منبثقة
                </p>
              )}

              {/* Carousel للصور المصغرة - يظهر فقط عند وجود صور إضافية */}
              {propertyImages.length > 0 && (
                <SwiperCarousel
                  items={propertyImages.map((imageSrc, index) => (
                    <div key={index} className="relative h-[10rem] md:h-24">
                      <Image
                        src={imageSrc}
                        alt={`${property.title} - صورة ${index + 1}`}
                        fill
                        className={`w-full h-full object-cover cursor-pointer rounded-lg transition-all duration-300 border-2 ${
                          mainImage === imageSrc ? "" : ""
                        }`}
                        onClick={() => handleThumbnailClick(imageSrc, index)}
                      />
                      <div className="absolute bottom-1 right-1 opacity-50">
                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                          <span className="text-white text-xs">دليل</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  space={16}
                  autoplay={false}
                  desktopCount={4}
                  slideClassName="!h-[10rem] md:!h-[96px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* وصف العقار ونموذج الحجز */}
          <div className="flex-1">
            <div className="mb-8 md:mb-18">
              <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                <h3 className="text-gray-600 font-bold text-xl leading-6 lg:text-2xl lg:leading-7">
                  وصف العقار
                </h3>
                <p className="text-gray-600 font-normal text-sm leading-6 md:text-base md:leading-7">
                  مدخل مستقل، غرفتين نوم بينهم دورة مياه، صالة، مطبخ، وغرفة
                  طعام، مجلس مع دورة مياه، مكيفات شباك
                </p>
              </div>
            </div>

            {/* نموذج الحجز */}
            <div className="flex flex-col gap-y-6">
              <h2 className="pr-4 text-white font-bold rounded-md leading-6 bg-emerald-600 w-full h-10 flex items-center justify-start">
                احجز الآن
              </h2>
              <p className="text-sm text-gray-600 font-normal">
                احجز الآن وقم باختيار الوقت والتاريخ المناسب لك، وسيتم التواصل
                معك لتأكيد الحجز وتقديم التفاصيل اللازمة.
              </p>

              <form
                onSubmit={handleBookingSubmit}
                className="flex flex-col gap-y-6 md:gap-y-8"
              >
                <div className="flex flex-row gap-x-4">
                  <div className="flex flex-col gap-y-6 flex-1">
                    <label
                      htmlFor="name"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      الاسم
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="ادخل الاسم"
                      value={bookingForm.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full h-12 outline-none border border-gray-300 rounded-lg placeholder:text-sm px-2"
                      name="name"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-y-6 flex-1">
                    <label
                      htmlFor="phone"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      رقم الهاتف
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="ادخل رقم الهاتف"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full h-12 outline-none border border-gray-300 rounded-lg placeholder:text-sm px-2 text-end"
                      name="phone"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-x-4">
                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <label
                      htmlFor="date"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      التاريخ
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-right font-normal cursor-pointer text-base font-medium text-gray-600 rounded-lg border border-gray-300 p-2 outline-none focus:border-emerald-600 h-12"
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: ar })
                          ) : (
                            <span className="text-gray-500">اختر التاريخ</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          locale={ar}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex-1 flex flex-col gap-y-6 relative">
                    <label
                      htmlFor="time"
                      className="text-gray-600 text-base font-bold leading-4"
                    >
                      الوقت
                    </label>
                    <div className="w-full relative">
                      <input
                        id="time"
                        required
                        className="order-1 w-full font-medium text-gray-600 rounded-lg border border-gray-300 p-2 outline-none pr-10 focus:border-emerald-600 h-12"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={!selectedDate}
                      />
                      <div className="absolute pointer-events-none top-0 bottom-0 right-3 flex items-center order-2">
                        <ClockIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      {!selectedDate && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white/70 z-10 cursor-not-allowed rounded-lg" />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-[200px] mx-auto h-12 rounded-md bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                >
                  تأكيد الحجز
                </button>
              </form>
            </div>
          </div>

          {/* العقارات المشابهة */}
          <div className="flex-1">
            <div>
              <h3 className="pr-4 md:pr-0 mb-8 rounded-md flex items-center md:justify-center h-10 md:h-13 text-white font-bold leading-6 text-xl bg-emerald-600">
                عقارات مشابهة
              </h3>

              {/* عرض العقارات المشابهة للديسكتوب */}
              <div className="hidden md:block space-y-8">
                {loadingSimilar ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg animate-pulse"
                      >
                        <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                          <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  similarProperties.map((similarProperty) => (
                    <div
                      key={similarProperty.id}
                      className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg"
                    >
                      <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                        <h4 className="text-ellipsis overflow-hidden font-bold text-xl text-gray-600">
                          {similarProperty.title}
                        </h4>
                        <p className="text-ellipsis font-bold text-base text-gray-600 leading-5">
                          {similarProperty.district}
                        </p>
                        <div className="flex flex-row items-center justify-between">
                          <p className="flex items-center justify-center leading-6 font-bold text-xl">
                            {similarProperty.price} ريال
                          </p>
                          <Link
                            href={`/${similarProperty.transactionType === "rent" ? "for-rent" : "for-sale"}/${similarProperty.id}`}
                            className="font-bold text-lg text-emerald-600 hover:text-emerald-700"
                          >
                            تفاصيل
                          </Link>
                        </div>
                      </div>
                      <figure className="relative flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                        <div className="bg-white mt-3 absolute w-36 h-7 md:w-29 lg:w-40 xl:w-46 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                          <div className="flex flex-row items-center justify-center gap-x-1">
                            <div className="w-4 h-4 bg-gray-400 rounded"></div>
                            <p className="text-sm md:text-base font-bold text-gray-600">
                              {similarProperty.views}
                            </p>
                          </div>
                          <div className="flex flex-row items-center justify-center gap-x-1">
                            <div className="w-4 h-4 bg-gray-400 rounded"></div>
                            <p className="text-sm md:text-base font-bold text-gray-600">
                              {similarProperty.bedrooms || 0}
                            </p>
                          </div>
                        </div>
                        <Image
                          src={similarProperty.image}
                          alt="RealEstate Image"
                          fill
                          className="w-full h-full object-cover rounded-lg overflow-hidden relative -z-10"
                        />
                        <div className="absolute bottom-5 right-2 opacity-50">
                          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                            <span className="text-white text-xs">دليل</span>
                          </div>
                        </div>
                      </figure>
                    </div>
                  ))
                )}
              </div>

              {/* عرض العقارات المشابهة للموبايل */}
              <div className="block md:hidden">
                <div className="flex gap-4 overflow-x-auto">
                  {loadingSimilar
                    ? [1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px] animate-pulse"
                        >
                          <div className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden bg-gray-200"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
                        </div>
                      ))
                    : similarProperties.map((similarProperty) => (
                        <Link
                          key={similarProperty.id}
                          href={`/${similarProperty.transactionType === "rent" ? "for-rent" : "for-sale"}/${similarProperty.id}`}
                        >
                          <div className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px]">
                            <div className="bg-white z-40 absolute w-36 mt-3 h-7 md:w-46 md:h-9 flex items-center justify-between px-3 top-4 md:top-5 lg:top-4 right-2 rounded-md">
                              <div className="flex flex-row items-center justify-center gap-x-1">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <p className="text-sm md:text-base font-bold text-gray-600">
                                  {similarProperty.views}
                                </p>
                              </div>
                              <div className="flex flex-row items-center justify-center gap-x-1">
                                <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                <p className="text-sm md:text-base font-bold text-gray-600">
                                  {similarProperty.bedrooms || 0}
                                </p>
                              </div>
                            </div>
                            <figure className="relative w-full h-64 flex items-center justify-center rounded-2xl overflow-hidden">
                              <Image
                                src={similarProperty.image}
                                alt="RealEstateImage"
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2 opacity-50">
                                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                  <span className="text-white text-xs">
                                    دليل
                                  </span>
                                </div>
                              </div>
                            </figure>
                            <p className="text-gray-800 pt-4 text-base md:text-lg xl:text-xl font-normal leading-5 xl:leading-6 text-ellipsis overflow-hidden">
                              {similarProperty.title}
                            </p>
                            <p className="text-gray-500 pt-2 font-normal text-sm xl:text-base text-ellipsis overflow-hidden leading-4 xl:leading-5">
                              {similarProperty.district}
                            </p>
                            <div className="flex flex-row items-center justify-between pt-4">
                              <p className="text-ellipsis overflow-hidden text-gray-800 font-bold text-base leading-5 md:text-lg xl:text-xl xl:leading-6">
                                {similarProperty.price} ريال
                              </p>
                              <p className="text-emerald-600 font-bold text-base leading-5 xl:leading-6 xl:text-lg">
                                تفاصيل
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog لعرض الصورة المكبرة */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <DialogTitle className="sr-only">عرض صورة العقار</DialogTitle>
          {selectedImage && (
            <div
              className="relative w-full h-[80vh] group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedImage}
                alt={property.title}
                fill
                className="object-contain rounded-lg"
              />

              {/* أسهم التنقل */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="الصورة السابقة"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                aria-label="الصورة التالية"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* عداد الصور */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
