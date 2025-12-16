import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  image: string;
  title: string;
  city: string;
  district: string;
  status: string; // يمكن أن يكون "للبيع" | "للإيجار" أو مدة مثل "3 أشهر" | "سنة" | "سنتين"
  area: {
    min: number;
    max: number;
  };
  rooms: {
    min: number;
    max: number;
  };
  units: number;
  floors: {
    min: number;
    max: number;
  };
  price: {
    min: number;
    max: number;
  };
  bathrooms?: {
    min: number;
    max: number;
  };
  featured?: boolean;
  url?: string;
}

// SVG Icons
const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M17.5 22.5v-3.5h-3.5v-1.5h3.5v-3.5h1.5v3.5h3.5v1.5h-3.5v3.5h-1.5Zm-12.5 -3.5V14h1.5v3.5h3.5v1.5H5Zm0 -9V5h5v1.5h-3.5v3.5h-1.5Zm12.5 0v-3.5h-3.5v-1.5h5v5h-1.5Z"
      strokeWidth="0.5"
    />
  </svg>
);

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M1 19V4.375h1.5v9.85h8.825V6.5h8.05c0.99685 0 1.85025 0.3549 2.56025 1.06475C22.6451 8.27475 23 9.12815 23 10.125V19h-1.5v-3.275H2.5V19H1Zm5.75 -6.225c-0.75 0 -1.37915 -0.25415 -1.8875 -0.7625C4.354165 11.50415 4.1 10.875 4.1 10.125s0.254165 -1.37915 0.7625 -1.8875C5.37085 7.72915 6 7.475 6.75 7.475s1.37915 0.25415 1.8875 0.7625c0.50835 0.50835 0.7625 1.1375 0.7625 1.8875s-0.25415 1.37915 -0.7625 1.8875C8.12915 12.52085 7.5 12.775 6.75 12.775Zm6.075 1.45H21.5v-4.1c0 -0.58435 -0.2081 -1.0846 -0.62425 -1.50075C20.4596 8.2081 19.95935 8 19.375 8h-6.55v6.225Zm-6.075 -2.95c0.31665 0 0.5875 -0.1125 0.8125 -0.3375 0.225 -0.225 0.3375 -0.49585 0.3375 -0.8125s-0.1125 -0.5875 -0.3375 -0.8125c-0.225 -0.225 -0.49585 -0.3375 -0.8125 -0.3375s-0.5875 0.1125 -0.8125 0.3375c-0.225 0.225 -0.3375 0.49585 -0.3375 0.8125s0.1125 0.5875 0.3375 0.8125c0.225 0.225 0.49585 0.3375 0.8125 0.3375Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StairsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M3 21.75v-1.5h3.75v-4.5h4.5v-4.5h4.5v-4.5h4.5V3h1.5v5.25h-4.5v4.5h-4.5v4.5h-4.5v4.5H3Z"
      strokeWidth="0.5"
    />
  </svg>
);

const ShowerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    height="24"
    width="24"
    className="text-[#896042]"
  >
    <path
      fill="currentColor"
      d="M7.45 17.425c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225ZM5 13.675v-1.5c0 -1.78335 0.60415 -3.34165 1.8125 -4.675 1.20835 -1.33335 2.6875 -2.09165 4.4375 -2.275V3h1.5v2.225c1.75 0.18335 3.22915 0.94165 4.4375 2.275C18.39585 8.83335 19 10.39165 19 12.175v1.5H5Zm1.5 -1.5h11c0 -1.51665 -0.53575 -2.8125 -1.60725 -3.8875 -1.0715 -1.075 -2.36735 -1.6125 -3.8875 -1.6125 -1.52015 0 -2.81775 0.53625 -3.89275 1.60875C7.0375 9.35625 6.5 10.65335 6.5 12.175ZM7.45 21c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Zm4.55 0c-0.2 0 -0.375 -0.075 -0.525 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525c0.15 -0.15 0.325 -0.225 0.525 -0.225s0.375 0.075 0.525 0.225c0.15 0.15 0.225 0.325 0.225 0.525s-0.075 0.375 -0.225 0.525c-0.15 0.15 -0.325 0.225 -0.525 0.225Z"
      strokeWidth="0.5"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    aria-hidden="true"
    className="w-4 h-4"
    viewBox="0 0 576 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
  </svg>
);

export default function ProjectCard2({
  image,
  title,
  city,
  district,
  status,
  area,
  rooms,
  floors,
  price,
  bathrooms,
  featured = false,
  url,
}: ProjectCardProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("ar-SA");
  };

  // Generate WhatsApp link
  const whatsappMessage = encodeURIComponent(
    `مرحبًا، أود الاستفسار عن هذا الفرد: ${title}${url ? `, رابط الأفراد: ${url}` : ""}`
  );
  const whatsappUrl = `https://wa.me/966542120011?text=${whatsappMessage}`;

  const CardContent = (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative w-full h-[337px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 387px"
        />
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md">
            <StarIcon />
            <span className="text-black text-sm font-medium">فرد مميز</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title and Status - Same Row */}
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-xl font-bold text-black">{title}</h4>
          <div className="text-green-600 font-semibold text-lg">{status}</div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-black">
          <span>في {city}</span>
          <span>-</span>
          <span>{district}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Property Details Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Area */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
              <AreaIcon />
              <span className="text-[#896042] text-sm font-medium">
                {area.min === area.max
                  ? `${formatNumber(area.min)} م²`
                  : `${formatNumber(area.min)} - ${formatNumber(area.max)} م²`}
              </span>
            </div>
            <span className="text-xs text-gray-600">المساحة</span>
          </div>

          {/* Floors */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
              <StairsIcon />
              <span className="text-[#896042] text-sm font-medium">
                {floors.min === floors.max ? floors.min : `${floors.min} - ${floors.max}`}
              </span>
            </div>
            <span className="text-xs text-gray-600">عدد الطوابق</span>
          </div>

          {/* Bedrooms */}
          <div className="flex flex-col items-center text-right">
            <div className="flex items-center justify-end gap-1 mb-1">
              <BedIcon />
              <span className="text-[#896042] text-sm font-medium">
                {rooms.min === rooms.max ? rooms.min : `${rooms.min} - ${rooms.max}`}
              </span>
            </div>
            <span className="text-xs text-gray-600">غرف النوم</span>
          </div>

          {/* Bathrooms */}
          {bathrooms && (
            <div className="flex flex-col items-center text-right">
              <div className="flex items-center justify-end gap-1 mb-1">
                <ShowerIcon />
                <span className="text-[#896042] text-sm font-medium">
                  {bathrooms.min === bathrooms.max
                    ? bathrooms.min
                    : `${bathrooms.min} - ${bathrooms.max}`}
                </span>
              </div>
              <span className="text-xs text-gray-600">الحمامات</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Price Section - No Background */}
        <div className="text-center">
          <div className="text-[#896042] text-base font-bold">
            {price.min === price.max
              ? `${formatNumber(price.min)} ريال سعودي`
              : `${formatNumber(price.min)} - ${formatNumber(price.max)} ريال سعودي`}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
        >
          <svg
            className="w-5 h-5 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.98 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          <span>اطلب الآن</span>
        </a>
      </div>
    </div>
  );

  if (url) {
    return (
      <a href={url} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
