"use client";

import Image from "next/image";
import { Eye, Bed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTenantId } from "@/hooks/useTenantId";

type Property = {
  id: string;
  slug?: string;
  title: string;
  district: string;
  price: string;
  views: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type?: string;
  transactionType?: string;
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
  images?: string[];
};

export function PropertyCard({ p }: { p: Property }) {
  const router = useRouter();
  const { tenantId } = useTenantId();
  const isUnavailable =
    p.status?.toLowerCase() === "rented" || p.status?.toLowerCase() === "sold";

  const handleClick = () => {
    if (!isUnavailable && tenantId) {
      const propertySlug = p.slug || p.id; // Use slug if available, fallback to id
      console.log(
        `PropertyCard: Navigating to property ${propertySlug} with tenantId: ${tenantId}`,
      );
      router.push(`/property/${propertySlug}`);
    } else if (!tenantId) {
      console.log("PropertyCard: No tenantId available, cannot navigate");
    } else if (isUnavailable) {
      console.log("PropertyCard: Property is unavailable, cannot navigate");
    }
  };

  return (
    <div
      className={`block h-full w-full ${isUnavailable ? "pointer-events-none" : "cursor-pointer"}`}
      aria-disabled={isUnavailable}
      onClick={handleClick}
    >
      <div className="h-full w-full transition-transform hover:scale-[1.02]">
        {/* صورة العقار مع الأيقونات */}
        <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
          <Image
            src={
              p.image || "/placeholder.svg?height=300&width=480&query=property"
            }
            alt={p.title}
            fill
            sizes="(min-width:1280px) 25vw, (min-width:900px) 33vw, (min-width:640px) 50vw, 90vw"
            className="rounded-xl object-cover"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
          />

          {/* المستطيل العلوي الأيمن - غرف النوم والمشاهدات */}
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
            {p.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="size-4 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {p.bedrooms}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-700">
                {p.views}
              </span>
              <Eye className="size-4 text-gray-600" />
            </div>
          </div>

          {/* Overlay للعقارات غير المتاحة */}
          {isUnavailable && (
            <div
              aria-label="غير متاحة"
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30"
              style={{ pointerEvents: "none" }}
            >
              <span
                className="rounded-lg bg-white/90 px-4 py-2 text-sm font-bold text-gray-800"
                style={{ pointerEvents: "none" }}
              >
                غير متاحة
              </span>
            </div>
          )}
        </div>

        {/* محتوى البطاقة - بدون خلفية */}
        <div className="mt-4 space-y-3" dir="rtl">
          <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {p.district}
          </p>

          <div className="flex items-center justify-between">
            {/* السعر على اليسار */}
            <span className="text-lg font-extrabold text-foreground">
              {p.price} ريال
            </span>
            {/* زر التفاصيل على اليمين - بدون Link لتجنب التداخل */}
            <Button
              variant="ghost"
              className="h-auto p-0 text-emerald-700 hover:bg-transparent hover:underline"
            >
              تفاصيل
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
