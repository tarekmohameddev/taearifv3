"use client";

import Image from "next/image";

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
  // Default data - always use these values
  const cards: ContactCardProps[] = [
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
        text: "المملكة العربية السعودية - القصيم",
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
            text: "0537180774",
            href: "tel:0537180774",
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
  ];

  return (
    <div className="py-[48px] md:py-[104px] px-4 sm:px-10" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] rounded-[10px]">
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
            <Image
              className={`${card.icon.size.mobile} ${card.icon.size.desktop}`}
              src={card.icon.src}
              alt={card.icon.alt}
              width={60}
              height={60}
            />
            <div
              className={`flex flex-col ${card.cardStyle.alignment.horizontal} ${card.cardStyle.alignment.vertical} ${card.cardStyle.gap.content.mobile} ${card.cardStyle.gap.content.desktop}`}
            >
              <h2
                className={`${card.title.style.color} ${card.title.style.weight} ${card.title.style.size.mobile} ${card.title.style.size.desktop} ${card.title.style.lineHeight}`}
              >
                {card.title.text}
              </h2>
              {card.content.type === "links" ? (
                <div
                  className={`flex flex-row items-between justify-between w-full ${card.cardStyle.gap.links}`}
                >
                  {card.content.links?.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className={`${card.content.style.color} ${card.content.style.weight} ${card.content.style.size.mobile} ${card.content.style.size.desktop} ${card.content.style.lineHeight}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </div>
              ) : (
                <p
                  className={`${card.content.style.color} ${card.content.style.weight} ${card.content.style.size.mobile} ${card.content.style.size.desktop} ${card.content.style.lineHeight}`}
                >
                  {card.content.text}
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
