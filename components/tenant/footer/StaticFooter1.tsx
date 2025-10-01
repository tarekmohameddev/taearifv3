"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useMemo, useCallback } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

// Define footer data type
type FooterData = {
  visible: boolean;
  background: {
    type: string;
    image: string;
    alt: string;
    color: string;
    gradient: {
      enabled: boolean;
      direction: string;
      startColor: string;
      endColor: string;
      middleColor: string;
    };
    overlay: {
      enabled: boolean;
      opacity: string;
      color: string;
      blendMode: string;
    };
  };
  layout: {
    columns: string;
    spacing: string;
    padding: string;
    maxWidth: string;
  };
  content: {
    companyInfo: {
      enabled: boolean;
      name: string;
      description: string;
      tagline: string;
      logo: string;
    };
    quickLinks: {
      enabled: boolean;
      title: string;
      links: Array<{ text: string; url: string }>;
    };
    contactInfo: {
      enabled: boolean;
      title: string;
      address: string;
      phone1: string;
      phone2: string;
      email: string;
    };
    socialMedia: {
      enabled: boolean;
      title: string;
      platforms: Array<{
        name: string;
        icon: string;
        url: string;
        color: string;
      }>;
    };
  };
  footerBottom: {
    enabled: boolean;
    copyright: string;
    legalLinks: Array<{ text: string; url: string }>;
  };
  styling: {
    colors: {
      textPrimary: string;
      textSecondary: string;
      textMuted: string;
      accent: string;
      border: string;
    };
    typography: {
      titleSize: string;
      titleWeight: string;
      bodySize: string;
      bodyWeight: string;
    };
    spacing: {
      sectionPadding: string;
      columnGap: string;
      itemGap: string;
    };
    effects: {
      hoverTransition: string;
      shadow: string;
      borderRadius: string;
    };
  };
};

// Default footer data
const getDefaultFooterData = (): FooterData => ({
  visible: true,
  background: {
    type: "image",
    image: "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
    alt: "خلفية الفوتر",
    color: "#1f2937",
    gradient: {
      enabled: false,
      direction: "to-r",
      startColor: "#1f2937",
      endColor: "#374151",
      middleColor: "#4b5563",
    },
    overlay: {
      enabled: true,
      opacity: "0.7",
      color: "#000000",
      blendMode: "multiply",
    },
  },
  layout: {
    columns: "3",
    spacing: "8",
    padding: "16",
    maxWidth: "7xl",
  },
  content: {
    companyInfo: {
      enabled: true,
      name: "مكتب دليل الجواء",
      description:
        "دليل الجواء العقاري يقدم لك أفضل الحلول العقارية بخبرة واحترافية لتلبية كافة احتياجاتك في البيع والإيجار مع ضمان تجربة مريحة وموثوقة",
      tagline: "للخدمات العقارية",
      logo: "",
    },
    quickLinks: {
      enabled: true,
      title: "روابط مهمة",
      links: [
        { text: "الرئيسية", url: "/" },
        { text: "البيع", url: "/for-sale" },
        { text: "الإيجار", url: "/for-rent" },
        { text: "من نحن", url: "/about-us" },
        { text: "تواصل معنا", url: "/contact-us" },
      ],
    },
    contactInfo: {
      enabled: true,
      title: "معلومات التواصل",
      address: "المملكة العربية السعودية - القصيم",
      phone1: "0533150222",
      phone2: "0537180774",
      email: "guidealjwa22@gmail.com",
    },
    socialMedia: {
      enabled: true,
      title: "وسائل التواصل الاجتماعي",
      platforms: [
        { name: "واتساب", icon: "FaWhatsapp", url: "#", color: "#25D366" },
        { name: "لينكد إن", icon: "Linkedin", url: "#", color: "#0077B5" },
        { name: "إنستغرام", icon: "Instagram", url: "#", color: "#E4405F" },
        { name: "تويتر", icon: "Twitter", url: "#", color: "#1DA1F2" },
        { name: "فيسبوك", icon: "Facebook", url: "#", color: "#1877F2" },
      ],
    },
  },
  footerBottom: {
    enabled: true,
    copyright: "© 2024 مكتب دليل الجواء للخدمات العقارية. جميع الحقوق محفوظة.",
    legalLinks: [
      { text: "سياسة الخصوصية", url: "/privacy" },
      { text: "الشروط والأحكام", url: "/terms" },
    ],
  },
  styling: {
    colors: {
      textPrimary: "#ffffff",
      textSecondary: "#ffffff",
      textMuted: "rgba(255, 255, 255, 0.7)",
      accent: "#10b981",
      border: "rgba(255, 255, 255, 0.2)",
    },
    typography: {
      titleSize: "xl",
      titleWeight: "bold",
      bodySize: "sm",
      bodyWeight: "normal",
    },
    spacing: {
      sectionPadding: "16",
      columnGap: "8",
      itemGap: "3",
    },
    effects: {
      hoverTransition: "0.3s",
      shadow: "none",
      borderRadius: "none",
    },
  },
});

export default function StaticFooter({
  overrideData,
}: { overrideData?: any } = {}) {
  // Subscribe to global components data
  const globalComponentsData = useEditorStore((s) => s.globalComponentsData);
  const globalFooterData = globalComponentsData?.footer;

  // Get tenant data
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);

  // Get global components data from tenantData
  const tenantGlobalComponentsData = tenantData?.globalComponentsData;
  const tenantGlobalFooterData = tenantGlobalComponentsData?.footer;
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get default data once
  const defaultData = useMemo(() => getDefaultFooterData(), []);

  // Merge data with priority: overrideData > tenantGlobalFooterData > globalFooterData > default
  const mergedData = useMemo(() => {
    const result = {
      ...defaultData,
      ...globalFooterData, // globalFooterData from editorStore overrides default
      ...tenantGlobalFooterData, // tenantGlobalFooterData overrides editorStore
      ...(overrideData || {}), // overrideData overrides everything (for iframe)
    };

    console.log("🔍 [StaticFooter1] Merged footer data:", {
      defaultData: Object.keys(defaultData),
      globalFooterData: Object.keys(globalFooterData || {}),
      tenantGlobalFooterData: Object.keys(tenantGlobalFooterData || {}),
      overrideData: Object.keys(overrideData || {}),
      mergedData: Object.keys(result),
      hasGlobalData:
        !!globalFooterData && Object.keys(globalFooterData).length > 0,
      hasTenantGlobalData:
        !!tenantGlobalFooterData &&
        Object.keys(tenantGlobalFooterData).length > 0,
      hasOverrideData: !!overrideData && Object.keys(overrideData).length > 0,
    });

    return result;
  }, [defaultData, globalComponentsData, tenantGlobalFooterData, overrideData]);

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  const getBackgroundStyle = () => {
    const { background } = mergedData;

    if (background.type === "image" && background.image) {
      return {};
    } else if (background.type === "color" && background.color) {
      return { backgroundColor: background.color };
    } else if (background.type === "gradient" && background.gradient.enabled) {
      const { direction, startColor, endColor, middleColor } =
        background.gradient;
      if (middleColor) {
        return {
          background: `linear-gradient(${direction}, ${startColor}, ${middleColor}, ${endColor})`,
        };
      }
      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
      };
    }
    return {};
  };

  const getOverlayStyle = () => {
    const { overlay } = mergedData.background;
    if (!overlay.enabled) return {};

    return {
      backgroundColor: overlay.color,
      opacity: overlay.opacity,
      mixBlendMode: overlay.blendMode as any,
    };
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      FaWhatsapp: FaWhatsapp,
      Linkedin: Linkedin,
      Instagram: Instagram,
      Twitter: Twitter,
      Facebook: Facebook,
    };
    return iconMap[iconName] || MapPin;
  };

  return (
    <footer
      key={`static-footer-${JSON.stringify(mergedData.background?.colors)}-${JSON.stringify(mergedData.content)}`}
      className="relative w-full"
      style={{
        ...getBackgroundStyle(),
        backgroundColor:
          mergedData.background?.color ||
          mergedData.styling?.bgColor ||
          undefined,
      }}
    >
      {/* صورة الخلفية */}
      {mergedData.background.type === "image" &&
        mergedData.background.image && (
          <div className="absolute inset-0">
            <Image
              src={mergedData.background.image}
              alt={mergedData.background.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
            <div className="absolute inset-0" style={getOverlayStyle()} />
          </div>
        )}

      {/* المحتوى */}
      <div
        className={`relative z-10 px-4 py-16 text-white`}
        dir="rtl"
        style={{
          padding: `${mergedData.layout.padding}px`,
          gridTemplateColumns: mergedData.grid?.columns?.desktop
            ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
            : undefined,
          gap:
            mergedData.grid?.gapX || mergedData.grid?.gapY
              ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
              : undefined,
        }}
      >
        <div
          className={`mx-auto grid max-w-${mergedData.layout.maxWidth} grid-cols-1 gap-${mergedData.layout.spacing} md:grid-cols-${mergedData.layout.columns}`}
          style={{
            gridTemplateColumns: mergedData.grid?.columns?.desktop
              ? `repeat(${mergedData.grid.columns.desktop}, 1fr)`
              : undefined,
            gap:
              mergedData.grid?.gapX || mergedData.grid?.gapY
                ? `${mergedData.grid.gapY || "40px"} ${mergedData.grid.gapX || "40px"}`
                : undefined,
          }}
        >
          {/* العمود الأيمن: عن المكتب */}
          {mergedData.content.companyInfo.enabled && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full border border-emerald-500">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-${mergedData.styling.typography.titleWeight} text-white`}
                    style={{
                      fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                    }}
                  >
                    {mergedData.content.companyInfo.name}
                  </h3>
                  <p className="text-sm text-white/80">
                    {mergedData.content.companyInfo.tagline}
                  </p>
                </div>
              </div>
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                عن المكتب
              </h4>
              <p
                className={`text-${mergedData.styling.typography.bodySize} font-${mergedData.styling.typography.bodyWeight} leading-7 text-white/90`}
              >
                {mergedData.content.companyInfo.description}
              </p>
            </div>
          )}

          {/* العمود الأوسط: روابط مهمة */}
          {mergedData.content.quickLinks.enabled && (
            <div className="space-y-4">
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                {mergedData.content.quickLinks.title}
              </h4>
              <nav className="space-y-3">
                {mergedData.content.quickLinks.links.map(
                  (link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="block text-white/90 transition-colors hover:text-emerald-400"
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {link.text}
                    </Link>
                  ),
                )}
              </nav>
            </div>
          )}

          {/* العمود الأيسر: معلومات التواصل */}
          {mergedData.content.contactInfo.enabled && (
            <div className="space-y-4">
              <h4
                className={`text-xl font-${mergedData.styling.typography.titleWeight}`}
                style={{
                  fontSize: `var(--${mergedData.styling.typography.titleSize})`,
                }}
              >
                {mergedData.content.contactInfo.title}
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-5" />
                  <span
                    className={`text-${mergedData.styling.typography.bodySize} text-white/90`}
                  >
                    {mergedData.content.contactInfo.address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5" />
                  <div className="space-y-1">
                    <a
                      href={`tel:${mergedData.content.contactInfo.phone1}`}
                      className={`block text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {mergedData.content.contactInfo.phone1}
                    </a>
                    <a
                      href={`tel:${mergedData.content.contactInfo.phone2}`}
                      className={`block text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {mergedData.content.contactInfo.phone2}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5" />
                  <a
                    href={`mailto:${mergedData.content.contactInfo.email}`}
                    className={`text-${mergedData.styling.typography.bodySize} text-white/90 hover:text-emerald-400`}
                    style={{
                      transition: mergedData.styling.effects.hoverTransition,
                    }}
                  >
                    {mergedData.content.contactInfo.email}
                  </a>
                </div>
              </div>

              {/* أيقونات وسائل التواصل الاجتماعي */}
              {mergedData.content.socialMedia.enabled && (
                <div className="flex items-center gap-3 pt-4">
                  {mergedData.content.socialMedia.platforms.map(
                    (platform: any, index: number) => {
                      const IconComponent = getIconComponent(platform.icon);
                      return (
                        <a
                          key={index}
                          href={platform.url}
                          className="grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-emerald-600"
                          aria-label={platform.name}
                          style={
                            {
                              transition:
                                mergedData.styling.effects.hoverTransition,
                              "--hover-color": platform.color,
                            } as React.CSSProperties
                          }
                        >
                          <IconComponent className="size-5" />
                        </a>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* خط الفصل وحقوق الطبع */}
        {mergedData.footerBottom.enabled && (
          <div
            className={`mx-auto mt-12 max-w-${mergedData.layout.maxWidth} border-t border-white/20 pt-8`}
            style={{ borderColor: mergedData.styling.colors.border }}
          >
            <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-white/70 md:flex-row md:text-right">
              <p className={`text-${mergedData.styling.typography.bodySize}`}>
                {mergedData.footerBottom.copyright}
              </p>
              <div className="flex gap-6">
                {mergedData.footerBottom.legalLinks.map(
                  (link: any, index: number) => (
                    <Link
                      key={index}
                      href={link.url}
                      className="hover:text-emerald-400"
                      style={{
                        transition: mergedData.styling.effects.hoverTransition,
                      }}
                    >
                      {link.text}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
