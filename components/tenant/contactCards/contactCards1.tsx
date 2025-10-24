"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";

interface ContactCardProps {
  icon: {
    src: string;
    alt: string;
    size: {
      mobile: string;
      desktop: string;
    };
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
        src: "https://dalel-lovat.vercel.app/images/contact-us/address.svg",
        alt: "address Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
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
        src: "https://dalel-lovat.vercel.app/images/contact-us/envelope.svg",
        alt: "email Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
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
        src: "https://dalel-lovat.vercel.app/images/contact-us/phone.svg",
        alt: "phone Icon",
        size: {
          mobile: "w-[40px] h-[40px]",
          desktop: "md:w-[60px] md:h-[60px]",
        },
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

  // Use merged data for cards with proper fallbacks
  const cards: ContactCardProps[] = (mergedData.cards || defaultData.cards).map(
    (card: ContactCardProps) => ({
      ...card,
      icon: {
        ...card.icon,
        src:
          card.icon.src ||
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCA0NUw0NSA0MEw0MCAzNUwzMCA0MFYyMEw0MCAyNVY0MEwzMCA0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+",
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
            {card.icon.src && card.icon.src.trim() !== "" && (
              <Image
                className={`${card.icon.size?.mobile || "w-[40px] h-[40px]"} ${card.icon.size?.desktop || "md:w-[60px] md:h-[60px]"}`}
                src={card.icon.src}
                alt={card.icon.alt || "Contact card icon"}
                width={60}
                height={60}
              />
            )}
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
