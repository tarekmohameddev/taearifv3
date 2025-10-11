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
  slug?: string;
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
  createdAt?: string;
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
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
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
  propertySlug: string;
}

export default function PropertyDetail({ propertySlug }: PropertyDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Tenant ID hook
  const { tenantId, isLoading: tenantLoading } = useTenantId();

  // Property data state
  const [property, setProperty] = useState<Property | null>(null);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  // الحصول على عقارات مشابهة من API
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // جلب بيانات العقار
  const fetchProperty = async () => {
    try {
      setLoadingProperty(true);
      setPropertyError(null);

      if (!tenantId) {
        setLoadingProperty(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/properties/${propertySlug}`,
      );

      // Handle new API response format
      if (response.data && response.data.property) {
        setProperty(response.data.property);
      } else if (response.data) {
        // If the property is returned directly
        setProperty(response.data);
      } else {
        setPropertyError("العقار غير موجود");
      }
    } catch (error) {
      console.error("PropertyDetail: Error fetching property:", error);
      setPropertyError("حدث خطأ في تحميل بيانات العقار");
    } finally {
      setLoadingProperty(false);
    }
  };

  // جلب العقارات المشابهة
  const fetchSimilarProperties = async () => {
    try {
      setLoadingSimilar(true);

      if (!tenantId) {
        setLoadingSimilar(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${tenantId}/properties?purpose=rent&latest=1&limit=10`,
      );

      // Handle new API response format
      if (response.data && response.data.properties) {
        setSimilarProperties(response.data.properties);
        console.log(
          `PropertyDetail: ✅ Similar properties loaded: ${response.data.properties.length} items`,
        );
      } else if (response.data && Array.isArray(response.data)) {
        // If properties are returned directly as array
        setSimilarProperties(response.data);
        console.log(
          `PropertyDetail: ✅ Similar properties loaded: ${response.data.length} items`,
        );
      } else {
        console.log(
          "PropertyDetail: ⚠️ No similar properties found in response",
        );
        setSimilarProperties([]);
      }
    } catch (error) {
      console.error("Error fetching similar properties:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle booking submission
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = (imageSrc: string, index?: number) => {
    if (imageSrc && imageSrc.trim() !== "") {
      setSelectedImage(imageSrc);
      setSelectedImageIndex(index || 0);
      setIsDialogOpen(true);
    }
  };

  const handleThumbnailClick = (imageSrc: string, index: number) => {
    // افتح الصورة في dialog عند الضغط عليها
    handleImageClick(imageSrc, index);
  };

  const handlePreviousImage = () => {
    if (propertyImages.length === 0) return;

    const prevIndex =
      selectedImageIndex > 0
        ? selectedImageIndex - 1
        : propertyImages.length - 1;

    const prevImage = propertyImages[prevIndex];
    if (prevImage && prevImage.trim() !== "") {
      setSelectedImageIndex(prevIndex);
      setSelectedImage(prevImage);
    }
  };

  const handleNextImage = () => {
    if (propertyImages.length === 0) return;

    const nextIndex =
      selectedImageIndex < propertyImages.length - 1
        ? selectedImageIndex + 1
        : 0;

    const nextImage = propertyImages[nextIndex];
    if (nextImage && nextImage.trim() !== "") {
      setSelectedImageIndex(nextIndex);
      setSelectedImage(nextImage);
    }
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

  // جلب بيانات العقار والعقارات المشابهة عند تحميل المكون
  useEffect(() => {
    if (tenantId) {
      fetchProperty();
      fetchSimilarProperties();
    }
  }, [tenantId, propertySlug]);

  // تحديث الصورة الرئيسية عند تحميل العقار
  useEffect(() => {
    if (property?.image) {
      setMainImage(property.image);
    }
  }, [property]);

  // صور العقار - computed value
  const propertyImages =
    property && property.image
      ? [
          property.image,
          ...(property.images || []), // Add additional images if available
        ].filter((img) => img && img.trim() !== "")
      : []; // Filter out empty images

  // Show skeleton loading while tenant or property is loading
  if (tenantLoading || loadingProperty) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 md:mb-20 flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* المحتوى الرئيسي - Skeleton */}
            <div className="md:w-1/2 order-2 md:order-1 mb-12 md:mb-0">
              <div className="flex flex-col gap-y-8 lg:gap-y-10">
                {/* العنوان ونوع العرض - Skeleton */}
                <div className="flex flex-row items-center justify-between">
                  <div className="h-8 w-20 bg-emerald-200 rounded-md animate-pulse md:w-28 md:h-11"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* تفاصيل العقار - Skeleton */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 md:h-6"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2 md:h-10"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>

                {/* تفاصيل العقار في شبكة - Skeleton */}
                <div className="grid grid-cols-2 gap-y-6 lg:gap-y-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="flex flex-row gap-x-2 md:gap-x-6 items-center"
                    >
                      <div className="flex flex-row gap-x-2 items-center">
                        <div className="w-4 h-4 bg-emerald-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* معرض الصور - Skeleton */}
            <div className="md:w-1/2 order-1 md:order-2">
              <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
                {/* الصورة الأساسية - Skeleton */}
                <div className="relative h-80 md:h-80 xl:h-96 mb-6 bg-gray-200 rounded-lg animate-pulse">
                  <div className="absolute bottom-2 right-2 opacity-50">
                    <div className="w-12 h-12 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Carousel للصور المصغرة - Skeleton */}
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="relative h-24 w-24 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                    >
                      <div className="absolute bottom-1 right-1 opacity-50">
                        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* القسم السفلي - Skeleton */}
          <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
            {/* وصف العقار ونموذج الحجز - Skeleton */}
            <div className="flex-1">
              <div className="mb-8 md:mb-18">
                <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-32 lg:h-7"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/5"></div>
                  </div>
                </div>
              </div>

              {/* نموذج الحجز - Skeleton */}
              <div className="flex flex-col gap-y-6">
                <div className="h-10 bg-emerald-200 rounded-md animate-pulse w-full"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>

                <div className="flex flex-col gap-y-6 md:gap-y-8">
                  <div className="flex flex-row gap-x-4">
                    <div className="flex flex-col gap-y-6 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                    <div className="flex flex-col gap-y-6 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                  </div>

                  <div className="flex flex-row gap-x-4">
                    <div className="flex-1 flex flex-col gap-y-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                    <div className="flex-1 flex flex-col gap-y-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-full"></div>
                    </div>
                  </div>

                  <div className="h-12 bg-emerald-200 rounded-md animate-pulse w-[200px] mx-auto"></div>
                </div>
              </div>
            </div>

            {/* العقارات المشابهة - Skeleton */}
            <div className="flex-1">
              <div className="h-10 bg-emerald-200 rounded-md animate-pulse w-full mb-8 md:h-13"></div>

              {/* عرض العقارات المشابهة للديسكتوب - Skeleton */}
              <div className="hidden md:block space-y-8">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex mb-8 gap-x-6 h-48 w-full rounded-xl px-4 border border-gray-200 shadow-lg"
                  >
                    <div className="flex-[48.6%] py-8 flex flex-col gap-y-4 justify-center">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                      <div className="flex flex-row items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                    <div className="flex-[42.4%] py-4 rounded-lg overflow-hidden w-full h-full">
                      <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* عرض العقارات المشابهة للموبايل - Skeleton */}
              <div className="block md:hidden">
                <div className="flex gap-4 overflow-x-auto">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative h-88 md:h-91 flex flex-col justify-center min-w-[280px]"
                    >
                      <div className="relative w-full h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mt-4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2 mt-2"></div>
                      <div className="flex flex-row items-center justify-between pt-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error if no tenant ID
  if (!tenantId) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-lg text-yellow-600 font-medium">
              لم يتم العثور على معرف الموقع
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من أنك تصل إلى الموقع من الرابط الصحيح
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show error if property failed to load
  if (propertyError || !property) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">
              {propertyError || "العقار غير موجود"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              تأكد من صحة رابط العقار
            </p>
            <button
              onClick={() => fetchProperty()}
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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* المحتوى الرئيسي */}
          <div className="order-2 lg:order-1">
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
                  {property.description || "لا يوجد وصف متاح لهذا العقار"}
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
                    {property.area ? `${property.area} م²` : "غير محدد"}
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

                {property.features && property.features.length > 0 && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                      <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                        المميزات:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {property.features.join(", ")}
                    </p>
                  </div>
                )}

                {property.status && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                      <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                        الحالة:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {property.status === "available"
                        ? "متاح"
                        : property.status}
                    </p>
                  </div>
                )}

                {property.createdAt && (
                  <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                    <div className="flex flex-row gap-x-2">
                      <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                      <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                        تاريخ الإضافة:
                      </p>
                    </div>
                    <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {new Date(property.createdAt).toLocaleDateString("ar-US")}
                    </p>
                  </div>
                )}

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded"></div>
                    <p className="text-emerald-600 font-normal text-xs xs:text-sm md:text-base leading-4">
                      عدد الغرف:
                    </p>
                  </div>
                  <p className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                    {property.bedrooms > 0 ? property.bedrooms : "غير محدد"}
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
                    {property.bathrooms && property.bathrooms > 0
                      ? property.bathrooms
                      : "غير محدد"}
                  </p>
                </div>

                <div className="items-center flex flex-row gap-x-2 md:gap-x-6">
                  <div className="flex flex-row gap-x-2">
                    <MapPinIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                  {property.location &&
                  property.location.lat &&
                  property.location.lng ? (
                    <a
                      href={`https://maps.google.com/?q=${property.location.lat},${property.location.lng}&entry=gps`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold leading-4 text-xs xs:text-sm md:text-base text-emerald-600 underline"
                    >
                      عرض العنوان
                    </a>
                  ) : (
                    <span className="font-bold leading-4 text-xs xs:text-sm md:text-base text-gray-600">
                      {property.location?.address || "العنوان غير متاح"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* معرض الصور */}
          <div className="md:w-1/2 order-1 md:order-2">
            <div className="gallery w-full mx-auto px-4 md:px-6 order-1 md:order-2 relative">
              {/* الصورة الأساسية */}
              <div className="relative h-80 md:h-80 xl:h-96 mb-6">
                {mainImage && property ? (
                  <Image
                    src={mainImage}
                    alt={property.title || "صورة العقار"}
                    fill
                    className="w-full h-full object-cover cursor-pointer rounded-lg"
                    onClick={() => handleImageClick(mainImage, 0)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">لا توجد صورة متاحة</p>
                    </div>
                  </div>
                )}
<div className="absolute bottom-2 right-2 opacity-50">
  <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold whitespace-nowrap">
      تعاريف
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
              {propertyImages.length > 0 && property && (
                <SwiperCarousel
                  items={propertyImages
                    .filter((imageSrc) => imageSrc && imageSrc.trim() !== "") // Filter out empty images
                    .map((imageSrc, index) => (
                      <div key={index} className="relative h-[10rem] md:h-24">
                        <Image
                          src={imageSrc}
                          alt={`${property.title || "العقار"} - صورة ${index + 1}`}
                          fill
                          className={`w-full h-full object-cover cursor-pointer rounded-lg transition-all duration-300 border-2 ${
                            mainImage === imageSrc
                              ? "border-emerald-500"
                              : "border-transparent"
                          }`}
                          onClick={() => handleThumbnailClick(imageSrc, index)}
                        />
                        <div className="absolute bottom-2 right-2 opacity-50">
  <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold whitespace-nowrap">
      تعاريف
    </span>
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

          {/* Sidebar */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {/* نموذج الحجز */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="pr-4 text-white font-bold rounded-md leading-6 bg-emerald-600 w-full h-10 flex items-center justify-start mb-6">
                  احجز الآن
                </h2>
                <p className="text-sm text-gray-600 font-normal mb-6">
                  احجز الآن وقم باختيار الوقت والتاريخ المناسب لك، وسيتم التواصل
                  معك لتأكيد الحجز وتقديم التفاصيل اللازمة.
                </p>

                <form
                  onSubmit={handleBookingSubmit}
                  className="flex flex-col gap-y-6"
                >
                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
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
                    <div className="flex flex-col gap-y-2">
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

                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2 relative">
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
                              <span className="text-gray-500">
                                اختر التاريخ
                              </span>
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

                    <div className="flex flex-col gap-y-2 relative">
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
                    className="w-full h-12 rounded-md bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                  >
                    تأكيد الحجز
                  </button>
                </form>
              </div>

              {/* معلومات الاتصال */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  معلومات الاتصال
                </h3>
                <div className="space-y-4">
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-green-700">
                    <span className="mr-2">📞</span>
                    اتصل الآن
                  </button>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700">
                    <span className="mr-2">💬</span>
                    واتساب
                  </button>
                </div>
              </div>

              {/* إحصائيات العقار */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  إحصائيات العقار
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المشاهدات:</span>
                    <span className="font-medium">{property.views}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">تاريخ النشر:</span>
                    <span className="font-medium">
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString(
                            "ar-SA",
                          )
                        : "غير محدد"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className="font-medium text-green-600">
                      {property.status === "available"
                        ? "متاح"
                        : property.status || "متاح"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القسم السفلي */}
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-8">
          {/* وصف العقار */}
          <div className="flex-1">
            <div className="mb-8 md:mb-18">
              <div className="flex flex-col justify-center items-start gap-y-6 md:gap-y-8">
                <h3 className="text-gray-600 font-bold text-xl leading-6 lg:text-2xl lg:leading-7">
                  وصف العقار
                </h3>
                <p className="text-gray-600 font-normal text-sm leading-6 md:text-base md:leading-7">
                  {property.description || "لا يوجد وصف مفصل متاح لهذا العقار"}
                </p>
              </div>
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
                            href={`/property/${similarProperty.slug || similarProperty.id}`}
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
                              {similarProperty.bedrooms > 0
                                ? similarProperty.bedrooms
                                : 0}
                            </p>
                          </div>
                        </div>
                        <Image
                          src={similarProperty.image}
                          alt="RealEstate Image"
                          fill
                          className="w-full h-full object-cover rounded-lg overflow-hidden relative -z-10"
                        />
                        <div className="absolute bottom-2 right-2 opacity-50">
  <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold whitespace-nowrap">
      تعاريف
    </span>
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
                          href={`/property/${similarProperty.slug || similarProperty.id}`}
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
                                  {similarProperty.bedrooms > 0
                                    ? similarProperty.bedrooms
                                    : 0}
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
  <div className="w-12 h-12 bg-white/20 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold whitespace-nowrap">
      تعاريف
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
          {selectedImage && selectedImage.trim() !== "" && property && (
            <div
              className="relative w-full h-[80vh] group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={selectedImage}
                alt={property.title || "صورة العقار"}
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
