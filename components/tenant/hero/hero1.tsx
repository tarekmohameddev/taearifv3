"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  CircleDollarSign,
  Home,
  MapPin,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useStore from "@/context/Store";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

// Default hero data
const getDefaultHeroData = () => ({
  visible: true,
  height: {
    desktop: "90vh",
    tablet: "90vh",
    mobile: "90vh",
  },
  minHeight: {
    desktop: "520px",
    tablet: "520px",
    mobile: "520px",
  },
  background: {
    image: "https://dalel-lovat.vercel.app/images/hero.webp",
    alt: "صورة خلفية لغرفة معيشة حديثة",
    overlay: {
      enabled: true,
      opacity: "0.45",
      color: "#000000",
    },
  },
  content: {
    title: "اكتشف عقارك المثالي في أفضل المواقع",
    subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
    font: {
      title: {
        family: "Tajawal",
        size: { desktop: "5xl", tablet: "4xl", mobile: "2xl" },
        weight: "extrabold",
        color: "#ffffff",
        lineHeight: "1.25",
      },
      subtitle: {
        family: "Tajawal",
        size: { desktop: "2xl", tablet: "2xl", mobile: "2xl" },
        weight: "normal",
        color: "rgba(255, 255, 255, 0.85)",
      },
    },
    alignment: "center",
    maxWidth: "5xl",
    paddingTop: "200px",
  },
  searchForm: {
    enabled: true,
    position: "bottom",
    offset: "32",
    background: {
      color: "#ffffff",
      opacity: "1",
      shadow: "2xl",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      borderRadius: "lg",
    },
    fields: {
      purpose: {
        enabled: true,
        options: [
          { value: "rent", label: "إيجار" },
          { value: "sell", label: "بيع" },
        ],
        default: "rent",
      },
      city: {
        enabled: true,
        placeholder: "أدخل المدينة أو المنطقة",
        icon: "MapPin",
      },
      type: {
        enabled: true,
        placeholder: "نوع العقار",
        icon: "Home",
        options: ["شقة", "فيلا", "دوبلكس", "أرض", "شاليه", "مكتب"],
      },
      price: {
        enabled: true,
        placeholder: "السعر",
        icon: "CircleDollarSign",
        options: [
          { id: "any", label: "أي سعر" },
          { id: "0-200k", label: "0 - 200 ألف" },
          { id: "200k-500k", label: "200 - 500 ألف" },
          { id: "500k-1m", label: "500 ألف - 1 مليون" },
          { id: "1m+", label: "أكثر من 1 مليون" },
        ],
      },
      keywords: {
        enabled: true,
        placeholder: "كلمات مفتاحية...",
      },
    },
    responsive: {
      desktop: "all-in-row",
      tablet: "two-rows",
      mobile: "stacked",
    },
  },
  animations: {
    title: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    subtitle: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 400,
    },
    searchForm: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 600,
    },
  },
});

interface HeroProps {
  visible?: boolean;
  height?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  minHeight?: {
    desktop?: string;
    tablet?: string;
    mobile?: string;
  };
  background?: {
    image?: string;
    alt?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: string;
      color?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
    font?: {
      title?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
      };
      subtitle?: {
        family?: string;
        size?: { desktop?: string; tablet?: string; mobile?: string };
        weight?: string;
        color?: string;
      };
    };
    alignment?: string;
    maxWidth?: string;
  };
  searchForm?: {
    enabled?: boolean;
    position?: string;
    offset?: string;
    background?: {
      color?: string;
      opacity?: string;
      shadow?: string;
      border?: string;
      borderRadius?: string;
    };
    fields?: {
      purpose?: {
        enabled?: boolean;
        options?: Array<{ value: string; label: string }>;
        default?: string;
      };
      city?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
      };
      type?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: string[];
      };
      price?: {
        enabled?: boolean;
        placeholder?: string;
        icon?: string;
        options?: Array<{ id: string; label: string }>;
      };
      keywords?: {
        enabled?: boolean;
        placeholder?: string;
      };
    };
    responsive?: {
      desktop?: string;
      tablet?: string;
      mobile?: string;
    };
  };
  animations?: {
    title?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    subtitle?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
    searchForm?: {
      enabled?: boolean;
      type?: string;
      duration?: number;
      delay?: number;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// Search Form Component
function SearchForm({ config }: { config: any }) {
  const [purpose, setPurpose] = useState(
    config?.fields?.purpose?.default || "rent",
  );
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Navigate to results page or trigger search
  };

  if (!config?.enabled) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-lg bg-white p-2 sm:p-3 lg:p-4 shadow-2xl ring-1 ring-black/5"
      aria-label="نموذج البحث عن العقارات"
    >
      {/* Large Desktop: all in one row */}
      <div className="hidden items-stretch gap-2 xl:flex">
        {/* Purpose toggle */}
        {config.fields?.purpose?.enabled && (
          <>
            <div className="flex items-center">
              <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
                {config.fields.purpose.options?.map((option: any) => (
                  <Button
                    key={option.value}
                    type="button"
                    onClick={() => setPurpose(option.value)}
                    className={
                      purpose === option.value
                        ? "rounded-lg bg-emerald-600 px-4 xl:px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        : "rounded-lg bg-transparent px-4 xl:px-5 py-2 text-sm font-semibold text-foreground hover:bg-white"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Divider />
          </>
        )}

        {/* City */}
        {config.fields?.city?.enabled && (
          <>
            <div className="flex min-w-[200px] xl:min-w-[220px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={config.fields.city.placeholder}
                className="h-9 border-0 bg-transparent pe-0 ps-0 focus-visible:ring-0"
              />
            </div>
            <Divider />
          </>
        )}

        {/* Property Type */}
        {config.fields?.type?.enabled && (
          <>
            <div className="flex min-w-[150px] xl:min-w-[170px] items-center gap-2 rounded-xl px-3 py-2">
              <Home
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 w-[140px] xl:w-[160px] border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={config.fields.type.placeholder} />
                </SelectTrigger>
                <SelectContent align="end">
                  {config.fields.type.options?.map((option: any) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Divider />
          </>
        )}

        {/* Price */}
        {config.fields?.price?.enabled && (
          <>
            <div className="flex min-w-[150px] xl:min-w-[170px] items-center gap-2 rounded-xl px-3 py-2">
              <CircleDollarSign
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="h-9 w-[140px] xl:w-[160px] border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder={config.fields.price.placeholder} />
                </SelectTrigger>
                <SelectContent align="end">
                  {config.fields.price.options?.map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Divider />
          </>
        )}

        {/* Keywords + Search */}
        {config.fields?.keywords?.enabled && (
          <div className="flex min-w-[240px] xl:min-w-[260px] flex-1 items-center gap-3 rounded-xl px-3 py-2">
            <button
              type="submit"
              className="grid size-10 place-items-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10 border-0 bg-transparent pe-0 ps-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        )}
      </div>

      {/* Medium Desktop/Tablet: two rows layout */}
      <div className="hidden lg:grid xl:hidden gap-3">
        <div className="flex items-stretch gap-2">
          {/* Purpose toggle */}
          {config.fields?.purpose?.enabled && (
            <>
              <div className="flex items-center">
                <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
                  {config.fields.purpose.options?.map((option: any) => (
                    <Button
                      key={option.value}
                      type="button"
                      onClick={() => setPurpose(option.value)}
                      className={
                        purpose === option.value
                          ? "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white"
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Divider />
            </>
          )}

          {/* City */}
          {config.fields?.city?.enabled && (
            <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
              <MapPin
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={config.fields.city.placeholder}
                className="h-9 border-0 bg-transparent pe-0 ps-0 focus-visible:ring-0"
              />
            </div>
          )}
        </div>

        <div className="flex items-stretch gap-2">
          {/* Property Type */}
          {config.fields?.type?.enabled && (
            <>
              <div className="flex min-w-[150px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <Home
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="h-9 border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder={config.fields.type.placeholder} />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {config.fields.type.options?.map((option: any) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Divider />
            </>
          )}

          {/* Price */}
          {config.fields?.price?.enabled && (
            <>
              <div className="flex min-w-[150px] flex-1 items-center gap-2 rounded-xl px-3 py-2">
                <CircleDollarSign
                  className="size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Select value={price} onValueChange={setPrice}>
                  <SelectTrigger className="h-9 border-0 bg-transparent ps-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue
                      placeholder={config.fields.price.placeholder}
                    />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {config.fields.price.options?.map((option: any) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Divider />
            </>
          )}

          {/* Keywords + Search */}
          {config.fields?.keywords?.enabled && (
            <div className="flex min-w-[200px] flex-1 items-center gap-3 rounded-xl px-3 py-2">
              <button
                type="submit"
                className="grid size-10 place-items-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
                aria-label="بحث"
              >
                <Search className="size-5" />
              </button>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={config.fields.keywords.placeholder}
                className="h-10 border-0 bg-transparent pe-0 ps-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Small tablet layout */}
      <div className="hidden md:grid lg:hidden gap-3">
        {config.fields?.purpose?.enabled && (
          <div className="flex items-center justify-center">
            <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1">
              {config.fields.purpose.options?.map((option: any) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => setPurpose(option.value)}
                  className={
                    purpose === option.value
                      ? "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {config.fields?.keywords?.enabled && (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="grid size-10 place-items-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10"
            />
          </div>
        )}

        {config.fields?.city?.enabled && (
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={config.fields.city.placeholder}
            className="h-10"
          />
        )}

        <div className="grid grid-cols-2 gap-3">
          {config.fields?.type?.enabled && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <Home className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.type.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.type.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {config.fields?.price?.enabled && (
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="h-10">
                <CircleDollarSign className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.price.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.price.options?.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="grid gap-3 md:hidden">
        {config.fields?.purpose?.enabled && (
          <div className="flex justify-center">
            <div className="inline-flex overflow-hidden rounded-xl border bg-muted/40 p-1 w-full max-w-xs">
              {config.fields.purpose.options?.map((option: any) => (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => setPurpose(option.value)}
                  className={
                    purpose === option.value
                      ? "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 flex-1"
                      : "rounded-lg bg-transparent px-4 py-2 text-sm font-semibold text-foreground hover:bg-white flex-1"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {config.fields?.keywords?.enabled && (
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
              aria-label="بحث"
            >
              <Search className="size-5" />
            </button>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={config.fields.keywords.placeholder}
              className="h-10 flex-1"
            />
          </div>
        )}

        {config.fields?.city?.enabled && (
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={config.fields.city.placeholder}
            className="h-10"
          />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {config.fields?.type?.enabled && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-10">
                <Home className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.type.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.type.options?.map((option: any) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {config.fields?.price?.enabled && (
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="h-10">
                <CircleDollarSign className="ms-1 size-4 opacity-60" />
                <SelectValue placeholder={config.fields.price.placeholder} />
                <ChevronDown className="me-1 size-4 opacity-60" />
              </SelectTrigger>
              <SelectContent align="end">
                {config.fields.price.options?.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </form>
  );
}

function Divider() {
  return <span aria-hidden="true" className="my-2 w-px bg-border" />;
}

const Hero1 = (props: HeroProps = {}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = props.variant || "hero1";
  // Subscribe to editor store updates for this hero variant - use generic approach
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);

  useEffect(() => {
    if (props.useStore) {
      // Use component.id as unique identifier instead of variantId
      const uniqueId = props.id || variantId;
      ensureComponentVariant("hero", uniqueId, props);
    }
  }, [variantId, props.useStore, props.id, ensureComponentVariant]);

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get data from store or tenantData with fallback logic
  const uniqueId = props.id || variantId;
  const storeData = props.useStore
    ? getComponentData("hero", uniqueId) || {}
    : {};

  // Subscribe to store updates to re-render when data changes
  const heroStates = useEditorStore((s) => s.heroStates);
  const currentStoreData = props.useStore ? heroStates[uniqueId] || {} : {};

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData?.componentSettings) {
      return {};
    }
    // Search through all pages for this component variant
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      // Check if pageComponents is an object (not array)
      if (
        typeof pageComponents === "object" &&
        !Array.isArray(pageComponents)
      ) {
        // Search through all components in this page
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          // Check if this is the exact component we're looking for by ID
          if (
            (component as any).type === "hero" &&
            (component as any).componentName === variantId &&
            componentId === props.id
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Merge data with priority: currentStoreData > tenantComponentData > props > default
  const mergedData = {
    ...getDefaultHeroData(),
    ...props,
    ...tenantComponentData,
    ...currentStoreData,
  };

  const { user, loading } = useAuth();
  const router = useRouter();
  const loadingTenantData = useTenantStore((s) => s.loadingTenantData);
  const error = useTenantStore((s) => s.error);

  // Generate dynamic styles
  const sectionStyles = {
    height: mergedData.height?.desktop || "90vh",
    minHeight: mergedData.minHeight?.desktop || "520px",
  };

  const titleStyles = {
    fontFamily: mergedData.content?.font?.title?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.title?.weight || "extrabold",
    color: mergedData.content?.font?.title?.color || "#ffffff",
    lineHeight: mergedData.content?.font?.title?.lineHeight || "1.25",
  };

  const subtitleStyles = {
    fontFamily: mergedData.content?.font?.subtitle?.family || "Tajawal",
    fontWeight: mergedData.content?.font?.subtitle?.weight || "normal",
    color:
      mergedData.content?.font?.subtitle?.color || "rgba(255, 255, 255, 0.85)",
  };

  const overlayStyles = {
    backgroundColor: mergedData.background?.overlay?.color || "#000000",
    opacity: mergedData.background?.overlay?.opacity || "0.45",
  };

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  return (
    <section
      className="relative w-full overflow-hidden max-h-[95dvh]"
      style={sectionStyles as any}
      data-debug="hero-component"
    >
      {/* Background Image */}
      <Image
        src={
          mergedData.background?.image ||
          "https://dalel-lovat.vercel.app/images/hero.webp"
        }
        alt={mergedData.background?.alt || "صورة خلفية لغرفة معيشة حديثة"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay */}
      {mergedData.background?.overlay?.enabled && (
        <div className="absolute inset-0" style={overlayStyles} />
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col items-center px-4 text-center text-white">
        {/* Desktop/Tablet Layout */}
        <div
          className="hidden md:block"
          style={{ paddingTop: mergedData.content?.paddingTop || "200px" }}
        >
          <h1
            className={cn(
              "mx-auto text-balance",
              `text-${mergedData.content?.font?.title?.size?.tablet || "4xl"} md:text-${mergedData.content?.font?.title?.size?.desktop || "5xl"}`,
              `max-w-${mergedData.content?.maxWidth || "5xl"}`,
            )}
            style={titleStyles}
          >
            {mergedData.content?.title || "اكتشف عقارك المثالي في أفضل المواقع"}
          </h1>
          <p
            className={cn(
              "mt-4",
              `text-${mergedData.content?.font?.subtitle?.size?.tablet || "2xl"} md:text-${mergedData.content?.font?.subtitle?.size?.desktop || "2xl"}`,
            )}
            style={subtitleStyles}
          >
            {mergedData.content?.subtitle ||
              "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية"}
          </p>
        </div>

        {/* Mobile Layout - Content and Form in proper order */}
        <div className="md:hidden flex flex-col items-center justify-center h-full w-full">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1
              className={cn(
                "mx-auto text-balance mb-4",
                `text-${mergedData.content?.font?.title?.size?.mobile || "2xl"}`,
                `max-w-${mergedData.content?.maxWidth || "5xl"}`,
              )}
              style={titleStyles}
            >
              {mergedData.content?.title ||
                "اكتشف عقارك المثالي في أفضل المواقع"}
            </h1>
            <p
              className={cn(
                "mb-8",
                `text-${mergedData.content?.font?.subtitle?.size?.mobile || "2xl"}`,
              )}
              style={subtitleStyles}
            >
              {mergedData.content?.subtitle ||
                "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية"}
            </p>
          </div>

          {/* Search Form for Mobile */}
          {mergedData.searchForm?.enabled && (
            <div className="w-full max-w-md px-4 pb-8">
              <SearchForm config={mergedData.searchForm} />
            </div>
          )}
        </div>
      </div>

      {/* Search Form for Desktop/Tablet */}
      {mergedData.searchForm?.enabled && (
        <div
          className={cn(
            "pointer-events-auto absolute inset-x-0 z-10 mx-auto px-4 sm:px-6 lg:px-8 bottom-32 max-w-[1600px] hidden md:block",
          )}
        >
          <SearchForm config={mergedData.searchForm} />
        </div>
      )}
    </section>
  );
};

export default Hero1;
