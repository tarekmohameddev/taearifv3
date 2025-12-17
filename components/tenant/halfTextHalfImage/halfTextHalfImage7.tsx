"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultHalfTextHalfImage7Data } from "@/context-liveeditor/editorStoreFunctions/halfTextHalfImageFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface HalfTextHalfImage7Props {
  visible?: boolean;
  ThemeTwo?: string;
  layout?: {
    ThemeTwo?: string;
    direction?: string;
    maxWidth?: string;
  };
  spacing?: {
    ThemeTwo?: string;
    padding?: {
      ThemeTwo?: string;
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    };
  };
  content?: {
    ThemeTwo?: string;
    title?: string;
    features?: Array<{
      ThemeTwo?: string;
      id?: string;
      title?: string;
      description?: string;
      icon?: string;
    }>;
  };
  styling?: {
    ThemeTwo?: string;
    backgroundColor?: string;
    titleColor?: string;
    dividerColor?: string;
    featureTitleColor?: string;
    featureDescriptionColor?: string;
    iconBackgroundColor?: string;
    iconColor?: string;
  };
  image?: {
    ThemeTwo?: string;
    src?: string;
    alt?: string;
    visible?: boolean;
  };
  responsive?: {
    ThemeTwo?: string;
    mobile?: {
      ThemeTwo?: string;
      imageOrder?: number;
      textOrder?: number;
      imageHeight?: string;
    };
    desktop?: {
      ThemeTwo?: string;
      imageOrder?: number;
      textOrder?: number;
      imageHeight?: string;
    };
  };
  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function HalfTextHalfImage7(props: HalfTextHalfImage7Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "halfTextHalfImage7";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const halfTextHalfImageStates = useEditorStore(
    (s) => s.halfTextHalfImageStates,
  );

  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Get tenant data for this specific component variant
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "halfTextHalfImage" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "halfTextHalfImage" &&
              (component as any).componentName === variantId &&
              componentId === props.id
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  useEffect(() => {
    if (props.useStore) {
      // Get tenant component data inside useEffect to avoid infinite loops
      const tenantComponentData = getTenantComponentData();

      // ✅ Use database data if available
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultHalfTextHalfImage7Data(),
              ...tenantComponentData, // Database data takes priority
              ...props,
            }
          : {
              ...getDefaultHalfTextHalfImage7Data(),
              ...props,
            };

      // Initialize in store
      ensureComponentVariant("halfTextHalfImage", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    variantId,
    props.id,
    tenantData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = halfTextHalfImageStates[uniqueId];
  const currentStoreData = getComponentData("halfTextHalfImage", uniqueId);
  const tenantComponentData = getTenantComponentData();

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultHalfTextHalfImage7Data(), // 1. Defaults (lowest priority)
    ...tenantComponentData, // 2. Tenant data from database
    ...storeData, // 3. Store state
    ...currentStoreData, // 4. Current store data
    ...props, // 5. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  // Helper function to get icon SVG based on icon type
  const getIconSVG = (iconType?: string) => {
    switch (iconType) {
      case "transparency":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="17"
            viewBox="0 0 12 17"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11 6.5H7.18697L9.45997 1.197C9.49259 1.12091 9.5058 1.03792 9.49843 0.955466C9.49106 0.873012 9.46333 0.793679 9.41773 0.724587C9.37213 0.655495 9.31009 0.598806 9.23717 0.559607C9.16426 0.520408 9.08276 0.499927 8.99997 0.5H3.99997C3.90205 0.499913 3.80626 0.528581 3.72449 0.582445C3.64271 0.63631 3.57855 0.713 3.53997 0.803L0.539972 7.803C0.507356 7.87909 0.494142 7.96208 0.501515 8.04453C0.508888 8.12699 0.536618 8.20632 0.582217 8.27541C0.627816 8.3445 0.689856 8.40119 0.76277 8.44039C0.835684 8.47959 0.91719 8.50007 0.999972 8.5H3.47397L0.535972 15.814C0.335972 16.311 0.952972 16.732 1.34297 16.364L6.36697 11.621L11.325 7.38C11.4027 7.31357 11.4581 7.22493 11.4839 7.12601C11.5096 7.02709 11.5045 6.92266 11.469 6.82678C11.4336 6.73089 11.3697 6.64816 11.2858 6.58974C11.2019 6.53131 11.1022 6.49999 11 6.5ZM6.42897 7.5H9.64597L5.69797 10.878L2.31297 14.073L4.67797 8.186C4.70838 8.11014 4.71972 8.02798 4.71101 7.94672C4.7023 7.86546 4.6738 7.78757 4.62801 7.71987C4.58223 7.65217 4.52054 7.59673 4.44836 7.5584C4.37618 7.52007 4.2957 7.50002 4.21397 7.5H1.75797L4.32997 1.5H8.24197L5.96897 6.803C5.93636 6.87909 5.92314 6.96208 5.93051 7.04453C5.93789 7.12699 5.96562 7.20632 6.01122 7.27541C6.05682 7.3445 6.11886 7.40119 6.19177 7.44039C6.26468 7.47959 6.34619 7.50007 6.42897 7.5Z"
              fill={mergedData.styling?.iconColor || "#896042"}
            ></path>
          </svg>
        );
      case "commitment":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M8.15323 4.408C9.42023 2.136 10.0532 1 11.0002 1C11.9472 1 12.5802 2.136 13.8472 4.408L14.1752 4.996C14.5352 5.642 14.7152 5.965 14.9952 6.178C15.2752 6.391 15.6252 6.47 16.3252 6.628L16.9612 6.772C19.4212 7.329 20.6502 7.607 20.9432 8.548C21.2352 9.488 20.3972 10.469 18.7202 12.43L18.2862 12.937C17.8102 13.494 17.5712 13.773 17.4642 14.117C17.3572 14.462 17.3932 14.834 17.4652 15.577L17.5312 16.254C17.7842 18.871 17.9112 20.179 17.1452 20.76C16.3792 21.341 15.2272 20.811 12.9252 19.751L12.3282 19.477C11.6742 19.175 11.3472 19.025 11.0002 19.025C10.6532 19.025 10.3262 19.175 9.67223 19.477L9.07623 19.751C6.77323 20.811 5.62124 21.341 4.85624 20.761C4.08924 20.179 4.21623 18.871 4.46923 16.254L4.53523 15.578C4.60723 14.834 4.64323 14.462 4.53523 14.118C4.42923 13.773 4.19024 13.494 3.71424 12.938L3.28024 12.43C1.60324 10.47 0.765235 9.489 1.05723 8.548C1.34923 7.607 2.58024 7.328 5.04024 6.772L5.67624 6.628C6.37524 6.47 6.72424 6.391 7.00524 6.178C7.28624 5.965 7.46523 5.642 7.82523 4.996L8.15323 4.408Z"
              stroke={mergedData.styling?.iconColor || "#896042"}
              strokeWidth="1.5"
            ></path>
          </svg>
        );
      case "innovation":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="22"
            viewBox="0 0 18 22"
            fill="none"
          >
            <path
              d="M2.14302 13C1.39267 11.7712 0.997071 10.3588 1.00002 8.919C1.00002 4.545 4.58202 1 9.00002 1C13.418 1 17 4.545 17 8.919C17.003 10.3588 16.6074 11.7712 15.857 13M12 18L11.87 18.647C11.73 19.354 11.659 19.707 11.5 19.987C11.255 20.4186 10.8583 20.7436 10.387 20.899C10.082 21 9.72002 21 9.00002 21C8.28002 21 7.91802 21 7.61302 20.9C7.14155 20.7444 6.74483 20.4189 6.50002 19.987C6.34102 19.707 6.27002 19.354 6.13002 18.647L6.00002 18M4.38302 16.098C4.29102 15.822 4.24502 15.683 4.25002 15.571C4.25567 15.4552 4.29476 15.3435 4.36256 15.2494C4.43035 15.1554 4.52394 15.083 4.63202 15.041C4.73602 15 4.88202 15 5.17202 15H12.828C13.119 15 13.264 15 13.368 15.04C13.4762 15.0821 13.5699 15.1546 13.6377 15.2489C13.7055 15.3431 13.7445 15.455 13.75 15.571C13.755 15.683 13.709 15.821 13.617 16.098C13.447 16.609 13.362 16.865 13.231 17.072C12.957 17.5046 12.5275 17.8156 12.031 17.941C11.793 18 11.525 18 10.988 18H7.01202C6.47502 18 6.20602 18 5.96902 17.94C5.47268 17.8149 5.0432 17.5042 4.76902 17.072C4.63802 16.865 4.55302 16.609 4.38302 16.098Z"
              stroke={mergedData.styling?.iconColor || "#896042"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M5.25 8.75L7.5 11V15M12.75 8.75L10.5 11V15M5.25 9.5C5.44891 9.5 5.63968 9.42098 5.78033 9.28033C5.92098 9.13968 6 8.94891 6 8.75C6 8.55109 5.92098 8.36032 5.78033 8.21967C5.63968 8.07902 5.44891 8 5.25 8C5.05109 8 4.86032 8.07902 4.71967 8.21967C4.57902 8.36032 4.5 8.55109 4.5 8.75C4.5 8.94891 4.57902 9.13968 4.71967 9.28033C4.86032 9.42098 5.05109 9.5 5.25 9.5ZM12.75 9.5C12.5511 9.5 12.3603 9.42098 12.2197 9.28033C12.079 9.13968 12 8.94891 12 8.75C12 8.55109 12.079 8.36032 12.2197 8.21967C12.3603 8.07902 12.5511 8 12.75 8C12.9489 8 13.1397 8.07902 13.2803 8.21967C13.421 8.36032 13.5 8.55109 13.5 8.75C13.5 8.94891 13.421 9.13968 13.2803 9.28033C13.1397 9.42098 12.9489 9.5 12.75 9.5Z"
              stroke={mergedData.styling?.iconColor || "#896042"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section
      className="w-full flex items-center justify-center py-12 md:py-16"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor || "#f5f0e8",
        paddingTop: mergedData.spacing?.padding?.top || "3rem",
        paddingBottom: mergedData.spacing?.padding?.bottom || "4rem",
        paddingLeft: mergedData.spacing?.padding?.left || "1rem",
        paddingRight: mergedData.spacing?.padding?.right || "1rem",
      }}
      dir={mergedData.layout?.direction || "rtl"}
    >
      <div
        className="w-full mx-auto px-4 md:px-6 lg:px-8"
        style={{
          maxWidth: mergedData.layout?.maxWidth || "1350px",
        }}
      >
        <div className="rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image */}
            {(mergedData.image?.visible ?? true) && (
              <div
                className={`w-full md:w-[50%] relative rounded-xl overflow-hidden ${
                  mergedData.responsive?.mobile?.imageHeight || "h-[300px]"
                } ${mergedData.responsive?.desktop?.imageHeight || "md:min-h-[500px]"} order-${
                  mergedData.responsive?.mobile?.imageOrder || 1
                } md:order-${mergedData.responsive?.desktop?.imageOrder || 2}`}
              >
                <Image
                  src={
                    mergedData.image?.src ||
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000"
                  }
                  alt={mergedData.image?.alt || "صورة"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            )}

            {/* Right Side - Text Content */}
            <div
              className={`w-full md:w-[50%] bg-[#f5f0e8] flex flex-col justify-center px-6 md:px-8 lg:px-10 py-8 md:py-12 text-right order-${
                mergedData.responsive?.mobile?.textOrder || 2
              } md:order-${mergedData.responsive?.desktop?.textOrder || 1}`}
            >
              {/* Heading */}
              <div className="mb-6 md:mb-8">
                <h3
                  className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight"
                  style={{
                    color: mergedData.styling?.titleColor || "#000000",
                  }}
                >
                  {mergedData.content?.title || "خدمات موثوقة تستحق ثقتك"}
                </h3>
                {/* Divider */}
                <div
                  className="w-24 h-[2px] mb-4 ml-auto"
                  style={{
                    backgroundColor:
                      mergedData.styling?.dividerColor || "#8b5f46",
                  }}
                ></div>
              </div>

              {/* Icon Boxes */}
              <div className="space-y-6 md:space-y-8">
                {(mergedData.content?.features || []).map((feature, index) => (
                  <div
                    key={feature.id || index}
                    className="flex items-start gap-4"
                  >
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor:
                          mergedData.styling?.iconBackgroundColor || "#d4a574",
                      }}
                    >
                      {getIconSVG(feature.icon)}
                    </div>
                    <div className="flex-1">
                      <h4
                        className="text-lg md:text-xl font-bold mb-2"
                        style={{
                          color:
                            mergedData.styling?.featureTitleColor || "#8b5f46",
                        }}
                      >
                        {feature.title || ""}
                      </h4>
                      <p
                        className="text-sm md:text-base leading-relaxed"
                        style={{
                          color:
                            mergedData.styling?.featureDescriptionColor ||
                            "#8b5f46",
                        }}
                      >
                        {feature.description || ""}
                      </p>
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
