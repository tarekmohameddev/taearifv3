"use client";

import { useEffect, useState } from "react";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as ReactIconsFa from "react-icons/fa";
import * as ReactIconsMd from "react-icons/md";
import type { IconType } from "react-icons";

// Function to get icon component based on type or name
const getContactCardIcon = (
  typeOrName: string,
): LucideIcon | IconType | React.ComponentType<any> => {
  // Try lucide-react icons
  const lucideIcon = (LucideIcons as any)[typeOrName];
  if (lucideIcon) {
    return lucideIcon;
  }

  // Try react-icons Font Awesome
  const faIcon = (ReactIconsFa as any)[typeOrName];
  if (faIcon) {
    return faIcon;
  }

  // Try react-icons Material Design
  const mdIcon = (ReactIconsMd as any)[typeOrName];
  if (mdIcon) {
    return mdIcon;
  }

  // Fallback to default icon
  return LucideIcons.MapPin;
};

interface ContactCardProps {
  icon: {
    type?: string;
    name?: string;
    size?: string | number;
    className?: string;
  };
  title: {
    text: string;
    style: {
      size: {
        mobile: string;
        desktop: string;
      };
      weight: string;
      color: string;
      lineHeight: string;
    };
  };
  content: {
    type: "text" | "links";
    text?: string;
    links?: {
      text: string;
      href: string;
    }[];
    style: {
      size: {
        mobile: string;
        desktop: string;
      };
      weight: string;
      color: string;
      lineHeight: string;
    };
  };
  cardStyle: {
    height: {
      mobile: string;
      desktop: string;
    };
    gap: {
      main: string;
      content: {
        mobile: string;
        desktop: string;
      };
      links: string;
    };
    shadow: {
      enabled: boolean;
      value: string;
    };
    alignment: {
      horizontal: string;
      vertical: string;
    };
  };
}

// Default data for the component
const getDefaultContactCardsData = () => ({
  visible: true,
  layout: {
    container: {
      padding: {
        vertical: "py-[48px] md:py-[104px]",
        horizontal: "px-4 sm:px-10",
      },
    },
    grid: {
      columns: {
        mobile: "grid-cols-1",
        desktop: "md:grid-cols-3",
      },
      gap: "gap-[24px]",
      borderRadius: "rounded-[10px]",
    },
  },
  cards: [
    {
      icon: {
        type: "MapPin",
        size: 40,
        className: "w-[40px] h-[40px] md:w-[60px] md:h-[60px]",
      },
      title: {
        text: "العنوان",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "text",
        text: "المملكة العربية السعودية",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
    {
      icon: {
        type: "Mail",
        size: 40,
        className: "w-[40px] h-[40px] md:w-[60px] md:h-[60px]",
      },
      title: {
        text: "الايميل",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "links",
        links: [
          {
            text: "guidealjiwa22@gmail.com",
            href: "mailto:guidealjiwa22@gmail.com",
          },
        ],
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
    {
      icon: {
        type: "Phone",
        size: 40,
        className: "w-[40px] h-[40px] md:w-[60px] md:h-[60px]",
      },
      title: {
        text: "الجوال",
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[24px]",
          },
          weight: "font-bold",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      content: {
        type: "links",
        links: [
          {
            text: "0535150222",
            href: "tel:0535150222",
          },
          {
            text: "0000",
            href: "tel:0000",
          },
        ],
        style: {
          size: {
            mobile: "text-[16px]",
            desktop: "md:text-[20px]",
          },
          weight: "font-normal",
          color: "#525252",
          lineHeight: "leading-[35px]",
        },
      },
      cardStyle: {
        height: {
          mobile: "h-[182px]",
          desktop: "md:h-[210px]",
        },
        gap: {
          main: "gap-y-[16px]",
          content: {
            mobile: "gap-y-[8px]",
            desktop: "md:gap-y-[16px]",
          },
          links: "gap-x-[50px]",
        },
        shadow: {
          enabled: true,
          value: "rgba(9, 46, 114, 0.32) 0px 2px 16px 0px",
        },
        alignment: {
          horizontal: "items-center",
          vertical: "justify-center",
        },
      },
    },
  ],
});

interface ContactCardsProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const ContactCards1: React.FC<ContactCardsProps> = ({
  useStore = true,
  variant = "contactCards1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "contactCards1";
  const uniqueId = id || variantId;

  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this contactCards variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactCardsStates = useEditorStore((s) => s.contactCardsStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultContactCardsData(),
        ...props,
      };
      ensureComponentVariant("contactCards", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
  useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
      const unsubscribe = useEditorStore.subscribe((state) => {
        const newContactCardsStates = state.contactCardsStates;
        console.log("🔄 Store subscription triggered:", {
          uniqueId,
          newContactCardsStates,
          hasData: !!newContactCardsStates[uniqueId],
          allKeys: Object.keys(newContactCardsStates),
        });
        if (newContactCardsStates[uniqueId]) {
          console.log(
            "🔄 Store subscription triggered for:",
            uniqueId,
            newContactCardsStates[uniqueId],
          );
          // Force re-render by updating state
          setForceUpdate((prev) => prev + 1);
        }
      });

      return unsubscribe;
    }
  }, [props.useStore, uniqueId]);

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
  const storeData = props.useStore
    ? getComponentData("contactCards", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? contactCardsStates[uniqueId] || {}
    : {};

  // Debug: Log when data changes
  useEffect(() => {
    if (props.useStore) {
      console.log("🔄 ContactCards Data Updated:", {
        uniqueId,
        storeData,
        currentStoreData,
        forceUpdate,
        contactCardsStates,
        allContactCardsStates: Object.keys(contactCardsStates),
        getComponentDataResult: getComponentData("contactCards", uniqueId),
      });
    }
  }, [
    storeData,
    currentStoreData,
    forceUpdate,
    props.useStore,
    uniqueId,
    contactCardsStates,
    getComponentData,
  ]);

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
          // Check if this is the exact component we're looking for by type and componentName
          if (
            (component as any).type === "contactCards" &&
            (component as any).componentName === variantId
          ) {
            return (component as any).data;
          }
        }
      }
    }
    return {};
  };

  const tenantComponentData = getTenantComponentData();

  // Get branding colors from WebsiteLayout (fallback to emerald-600)
  // emerald-600 in Tailwind = #059669
  const brandingColors = {
    primary:
      tenantData?.WebsiteLayout?.branding?.colors?.primary &&
      tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.primary
        : "#059669", // emerald-600 default (fallback)
    secondary:
      tenantData?.WebsiteLayout?.branding?.colors?.secondary &&
      tenantData.WebsiteLayout.branding.colors.secondary.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.secondary
        : "#059669", // fallback to primary
    accent:
      tenantData?.WebsiteLayout?.branding?.colors?.accent &&
      tenantData.WebsiteLayout.branding.colors.accent.trim() !== ""
        ? tenantData.WebsiteLayout.branding.colors.accent
        : "#059669", // fallback to primary
  };

  // Helper function to get color based on useDefaultColor and globalColorType
  const getColor = (
    fieldPath: string,
    defaultColor: string = "#059669",
  ): string => {
    // Get styling data from mergedData
    const styling = mergedData?.styling || {};

    // Navigate to the field using the path (e.g., "icon.color")
    const pathParts = fieldPath.split(".");
    let fieldData = styling;

    for (const part of pathParts) {
      if (
        fieldData &&
        typeof fieldData === "object" &&
        !Array.isArray(fieldData)
      ) {
        fieldData = fieldData[part];
      } else {
        fieldData = undefined;
        break;
      }
    }

    // Check if fieldData is a custom color (string starting with #)
    // If it is, return it directly (useDefaultColor is false)
    if (typeof fieldData === "string" && fieldData.startsWith("#")) {
      return fieldData;
    }

    // If fieldData is an object, check for value property
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData)
    ) {
      // If object has useDefaultColor property set to false, use the value
      if (
        fieldData.useDefaultColor === false &&
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        return fieldData.value;
      }
      // If object has value but useDefaultColor is true or undefined, still check value first
      if (
        fieldData.value &&
        typeof fieldData.value === "string" &&
        fieldData.value.startsWith("#")
      ) {
        // Check if useDefaultColor is explicitly false
        if (fieldData.useDefaultColor === false) {
          return fieldData.value;
        }
      }
    }

    // If no custom color found, use branding color (useDefaultColor is true by default)
    // Determine globalColorType based on field path
    let defaultGlobalColorType = "primary";
    if (
      fieldPath.includes("title") ||
      fieldPath.includes("content") ||
      fieldPath.includes("textColor") ||
      fieldPath.includes("Text")
    ) {
      defaultGlobalColorType = "secondary";
    } else if (fieldPath.includes("icon") || fieldPath.includes("Icon")) {
      defaultGlobalColorType = "primary";
    }

    // If fieldData is an object with globalColorType, use it
    if (
      fieldData &&
      typeof fieldData === "object" &&
      !Array.isArray(fieldData) &&
      fieldData.globalColorType
    ) {
      defaultGlobalColorType = fieldData.globalColorType;
    }

    const brandingColor =
      brandingColors[defaultGlobalColorType as keyof typeof brandingColors] ||
      defaultColor;
    return brandingColor;
  };

  // Check if we have any data from API/stores first
  const hasApiData =
    tenantComponentData && Object.keys(tenantComponentData).length > 0;
  const hasStoreData =
    (storeData && Object.keys(storeData).length > 0) ||
    (currentStoreData && Object.keys(currentStoreData).length > 0);
  const hasPropsData = props.cards && props.cards.length > 0;

  // Use default data instead of empty cards
  const createEmptyCards = () => getDefaultContactCardsData().cards;

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultContactCardsData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData?.layout || {}),
      ...(storeData?.layout || {}),
      ...(currentStoreData?.layout || {}),
    },
    cards:
      currentStoreData?.cards ||
      storeData?.cards ||
      tenantComponentData?.cards ||
      props.cards ||
      (hasApiData || hasStoreData || hasPropsData
        ? defaultData.cards
        : createEmptyCards()),
  };

  // Debug: Log the final merged data
  console.log("🔍 ContactCards Final Merge:", {
    uniqueId,
    currentStoreData,
    storeData,
    mergedData,
    cards: mergedData.cards?.length || 0,
    contactCardsStatesKeys: Object.keys(contactCardsStates),
    getComponentDataResult: getComponentData("contactCards", uniqueId),
  });

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Get colors using getColor function
  const iconColor = getColor("icon.color", brandingColors.primary);

  // Use merged data for cards with proper fallbacks
  const cards: ContactCardProps[] = (mergedData.cards || defaultData.cards).map(
    (card: ContactCardProps) => ({
      ...card,
      icon: {
        type: card.icon?.type || "MapPin",
        name: card.icon?.name,
        size: card.icon?.size || 40,
        className:
          card.icon?.className || "w-[40px] h-[40px] md:w-[60px] md:h-[60px]",
      },
      cardStyle: {
        ...defaultData.cards[0]?.cardStyle,
        ...card.cardStyle,
      },
    }),
  );

  return (
    <div
      className={`${mergedData.layout?.container?.padding?.vertical || "py-[48px] md:py-[104px]"} ${mergedData.layout?.container?.padding?.horizontal || "px-4 sm:px-10"}`}
      dir="rtl"
    >
      <div
        className={`grid ${mergedData.layout?.grid?.columns?.mobile || "grid-cols-1"} ${mergedData.layout?.grid?.columns?.desktop || "md:grid-cols-3"} ${mergedData.layout?.grid?.gap || "gap-[24px]"} ${mergedData.layout?.grid?.borderRadius || "rounded-[10px]"}`}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-full flex flex-col ${card.cardStyle.alignment.horizontal} ${card.cardStyle.alignment.vertical} ${card.cardStyle.height.mobile} ${card.cardStyle.height.desktop} ${card.cardStyle.gap.main}`}
            style={
              card.cardStyle.shadow.enabled
                ? { boxShadow: card.cardStyle.shadow.value }
                : {}
            }
          >
            {(() => {
              // Priority: name > type > default
              const iconNameOrType =
                card.icon?.name || card.icon?.type || "MapPin";
              const IconComponent = getContactCardIcon(iconNameOrType);

              // Get icon size
              const iconSize =
                typeof card.icon?.size === "number"
                  ? card.icon.size
                  : parseInt(card.icon?.size || "40");

              // Get icon className
              const iconClassName =
                card.icon?.className ||
                "w-[40px] h-[40px] md:w-[60px] md:h-[60px]";

              // Check if it's a React Icon (from react-icons) by checking the icon name pattern
              const isReactIcon =
                iconNameOrType.startsWith("Fa") ||
                iconNameOrType.startsWith("Md") ||
                iconNameOrType.startsWith("Io") ||
                iconNameOrType.startsWith("Bi") ||
                iconNameOrType.startsWith("Bs") ||
                iconNameOrType.startsWith("Hi") ||
                iconNameOrType.startsWith("Ai") ||
                iconNameOrType.startsWith("Ti") ||
                iconNameOrType.startsWith("Gi") ||
                iconNameOrType.startsWith("Si") ||
                iconNameOrType.startsWith("Ri") ||
                iconNameOrType.startsWith("Tb") ||
                iconNameOrType.startsWith("Vsc") ||
                iconNameOrType.startsWith("Wi") ||
                iconNameOrType.startsWith("Di") ||
                iconNameOrType.startsWith("Im");

              // For React Icons, use style with fontSize
              if (isReactIcon) {
                return (
                  <IconComponent
                    className={iconClassName}
                    style={{
                      color: iconColor,
                      fontSize: `${iconSize}px`,
                      width: `${iconSize}px`,
                      height: `${iconSize}px`,
                    }}
                  />
                );
              }

              // For Lucide icons, use size prop
              return (
                <IconComponent
                  size={iconSize}
                  className={iconClassName}
                  style={{
                    color: iconColor,
                  }}
                />
              );
            })()}
            <div
              className={`flex flex-col ${card.cardStyle?.alignment?.horizontal || "items-center"} ${card.cardStyle?.alignment?.vertical || "justify-center"} ${card.cardStyle?.gap?.content?.mobile || "gap-y-[8px]"} ${card.cardStyle?.gap?.content?.desktop || "md:gap-y-[16px]"}`}
            >
              <h2
                className={`${card.title?.style?.color || "#525252"} ${card.title?.style?.weight || "font-bold"} ${card.title?.style?.size?.mobile || "text-[16px]"} ${card.title?.style?.size?.desktop || "md:text-[24px]"} ${card.title?.style?.lineHeight || "leading-[35px]"}`}
              >
                {card.title?.text || ""}
              </h2>
              {card.content?.type === "links" ? (
                <div
                  className={`flex flex-row items-between justify-between w-full ${card.cardStyle?.gap?.links || "gap-x-[50px]"}`}
                >
                  {card.content?.links?.map((item: any, i: number) => (
                    <a
                      key={i}
                      href={item.href}
                      className={`${card.content?.style?.color || "#525252"} ${card.content?.style?.weight || "font-normal"} ${card.content?.style?.size?.mobile || "text-[16px]"} ${card.content?.style?.size?.desktop || "md:text-[20px]"} ${card.content?.style?.lineHeight || "leading-[35px]"}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              ) : (
                <p
                  className={`${card.content?.style?.color || "#525252"} ${card.content?.style?.weight || "font-normal"} ${card.content?.style?.size?.mobile || "text-[16px]"} ${card.content?.style?.size?.desktop || "md:text-[20px]"} ${card.content?.style?.lineHeight || "leading-[35px]"}`}
                >
                  {card.content?.text || ""}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCards1;
