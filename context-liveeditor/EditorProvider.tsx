// context/EditorProvider.tsx
"use client";

import { ReactNode } from "react";
import toast from "react-hot-toast";
import SaveConfirmationDialog from "@/components/SaveConfirmationDialog";
import { useEditorStore } from "./editorStore";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export function EditorProvider({ children }: { children: ReactNode }) {
  const { showDialog, closeDialog, openSaveDialogFn } = useEditorStore();
  const { userData } = useAuthStore();
  // tenantId يمكن أن يكون subdomain (tenant1) أو custom domain (hey.com)
  const tenantId = userData?.username;

  const confirmSave = async () => {
    // Execute any page-provided save logic first (if set)
    openSaveDialogFn();

    // Collect all component states from the editor store
    const state = useEditorStore.getState();

    // Log detailed component info for each page
    Object.entries(state.pageComponentsByPage).forEach(([page, components]) => {
      // Log detailed data for each component
      components.forEach((component) => {});
    });

    const payload = {
      tenantId: tenantId || "",
      pages: state.pageComponentsByPage,
      globalComponentsData: state.globalComponentsData,
      WebsiteLayout: state.WebsiteLayout || {
        metaTags: {
          pages: [],
        },
      },
    };

    // DEVELOPMENT ONLY: Static data for about-us and contact-us pages
    if (process.env.NODE_ENV === "development") {
      // Static data for about-us page
      const staticAboutUsData = [
        {
          id: "9d3c9ceb-628d-4819-a4bf-61215980cf52",
          type: "hero",
          name: "Hero",
          componentName: "hero2",
          data: {
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
              description: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
              alignment: "center",
              maxWidth: "5xl",
              font: {
                title: {
                  family: "Tajawal",
                  size: {
                    desktop: "36px",
                    tablet: "36px",
                    mobile: "36px",
                  },
                  weight: "bold",
                  color: "#ffffff",
                  lineHeight: "1.25",
                },
                subtitle: {
                  family: "Tajawal",
                  size: {
                    desktop: "15px",
                    tablet: "15px",
                    mobile: "15px",
                  },
                  weight: "normal",
                  color: "#ffffff",
                },
              },
            },
            animations: {
              title: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 200,
              },
              description: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 400,
              },
            },
          },
          position: 0,
          layout: {
            row: 0,
            col: 0,
            span: 2,
          },
        },
        {
          id: "b39a0518-91bc-4a92-9292-9c40ce06a9c2",
          type: "halfTextHalfImage",
          name: "HalfTextHalfImage",
          componentName: "halfTextHalfImage1",
          data: {
            visible: true,
            layout: {
              direction: "rtl",
              textWidth: 52.8,
              imageWidth: 47.2,
              gap: "16",
              minHeight: "369px",
            },
            spacing: {
              padding: {
                top: 50,
                bottom: 6,
                left: 4,
                right: 4,
              },
              margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            },
            content: {
              eyebrow: "شريك موثوق",
              title: "نحن شريكك الموثوق في عالم العقارات",
              description: "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
              button: {
                text: "تعرف علينا",
                enabled: true,
                url: "/about-us",
                style: {
                  backgroundColor: "#059669",
                  textColor: "#ffffff",
                  hoverBackgroundColor: "#047857",
                  hoverTextColor: "#ffffff",
                  width: "119px",
                  height: "46px",
                  borderRadius: "10px",
                },
              },
            },
            typography: {
              eyebrow: {
                size: "text-xs md:text-base xl:text-lg",
                weight: "font-normal",
                color: "text-muted-foreground",
                lineHeight: "leading-[22.5px]",
              },
              title: {
                size: "section-title-large",
                weight: "font-normal",
                color: "text-foreground",
                lineHeight: "lg:leading-[64px]",
              },
              description: {
                size: "text-sm md:text-sm xl:text-xl",
                weight: "font-normal",
                color: "text-muted-foreground",
                lineHeight: "leading-[35px]",
              },
            },
            image: {
              src: "https://dalel-lovat.vercel.app/images/trusted-partner-section/house.webp",
              alt: "صورة شريك موثوق",
              style: {
                aspectRatio: "800/500",
                objectFit: "contain",
                borderRadius: "0",
              },
              background: {
                enabled: true,
                color: "#059669",
                width: 54,
                borderRadius: "5px",
              },
            },
            responsive: {
              mobile: {
                textOrder: 2,
                imageOrder: 1,
                textWidth: "w-full",
                imageWidth: "w-full",
                marginBottom: "mb-10",
              },
              tablet: {
                textOrder: 2,
                imageOrder: 1,
                textWidth: "w-full",
                imageWidth: "w-full",
                marginBottom: "mb-10",
              },
              desktop: {
                textOrder: 1,
                imageOrder: 2,
                textWidth: "md:w-[52.8%]",
                imageWidth: "md:w-[47.2%]",
                marginBottom: "md:mb-0",
              },
            },
            animations: {
              text: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 200,
              },
              image: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 400,
              },
            },
          },
          position: 1,
          layout: {
            row: 1,
            col: 0,
            span: 2,
          },
        },
        {
          id: "069bd72b-159e-42ea-afda-8af29823f2ab",
          type: "halfTextHalfImage",
          name: "HalfTextHalfImage",
          componentName: "halfTextHalfImage3",
          data: {
            visible: true,
            layout: {
              direction: "ltr",
              maxWidth: "1600px",
              gap: {
                x: "md:gap-x-[30px] lg:gap-x-[74px]",
                y: "gap-[12px]",
              },
              minHeight: "369px",
            },
            spacing: {
              padding: {
                x: "px-4",
                y: "py-[24px]",
                lgY: "lg:py-[52px]",
              },
            },
            content: {
              title: "رسالتنا",
              description: "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
              imagePosition: "left",
              eyebrow: "",
            },
            image: {
              src: "https://dalel-lovat.vercel.app/images/aboutUs-page/message.webp",
              alt: "Choose Us",
            },
          },
          position: 2,
          layout: {
            row: 2,
            col: 0,
            span: 2,
          },
        },
        {
          id: "3f862e56-6dd5-4dc8-ba18-b088c8767766",
          type: "halfTextHalfImage",
          name: "HalfTextHalfImage",
          componentName: "halfTextHalfImage3",
          data: {
            visible: true,
            layout: {
              direction: "rtl",
              maxWidth: "1600px",
              gap: {
                x: "md:gap-x-[30px] lg:gap-x-[74px]",
                y: "gap-[12px]",
              },
              minHeight: "369px",
            },
            spacing: {
              padding: {
                x: "px-4",
                y: "py-[24px]",
                lgY: "lg:py-[52px]",
              },
            },
            content: {
              title: "رؤيتنا",
              description: "نحن في الشركة العقارية العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
              imagePosition: "left",
              eyebrow: "",
            },
            image: {
              src: "https://dalel-lovat.vercel.app/images/aboutUs-page/vision.webp",
              alt: "Choose Us",
            },
          },
          position: 3,
          layout: {
            row: 3,
            col: 0,
            span: 2,
          },
        },
        {
          id: "3afda972-628b-4002-bfc1-8e62872161ed",
          type: "stepsSection",
          name: "StepsSection",
          componentName: "stepsSection1",
          data: {
            visible: true,
            background: {
              color: "#f2fbf9",
              padding: {
                desktop: "72px",
                tablet: "48px",
                mobile: "20px",
              },
            },
            header: {
              marginBottom: "40px",
              title: {
                text: "خطواتنا في تسويق العقارات",
                className: "section-title",
              },
              description: {
                text: "نتبع خطوات احترافية لضمان تسويق عقارك بأعلى مستوى من الكفاءة والنجاح",
                className: "section-subtitle-xl text-gray-600",
              },
            },
            grid: {
              gapX: "40px",
              gapY: "40px",
              gapYMobile: "48px",
              columns: {
                mobile: 1,
                tablet: 2,
                desktop: 3,
              },
            },
            steps: [
              {
                title: "المعاينة الأولية للعقار",
                desc: "زيارة العقار وتقييم حالته ومعرفة ميزاته ومراجعة التفاصيل التي تحتاج إلى توضيح.",
                image: "/images/MarketingStepsSection/1.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
              {
                title: "كتابة تفصيل العقار",
                desc: "وصف دقيق للممتلكات بما في ذلك الموقع، المساحة، المرافق، والحالة العامة.",
                image: "/images/MarketingStepsSection/2.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
              {
                title: "التصوير الاحترافي للعقار",
                desc: "الاستعانة بمصور محترف لالتقاط صور عالية الجودة مع الاهتمام بالإضاءة والزوايا.",
                image: "/images/MarketingStepsSection/3.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
              {
                title: "تسعير العقار",
                desc: "تحليل السوق وتحديد السعر المناسب بناءً على موقع العقار وحالته والمرافق المتاحة.",
                image: "/images/MarketingStepsSection/4.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
              {
                title: "التسويق والترويج",
                desc: "استخدام قنوات متعددة للترويج للعقار عبر الإنترنت والوسائل التقليدية للوصول لأكبر عدد من العملاء.",
                image: "/images/MarketingStepsSection/5.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
              {
                title: "المتابعة والتفاوض",
                desc: "متابعة الاستفسارات والرد على الأسئلة وإجراء المفاوضات مع العملاء المحتملين حتى إتمام الصفقة.",
                image: "/images/MarketingStepsSection/6.svg",
                titleStyle: {
                  size: {
                    mobile: "18px",
                    desktop: "24px",
                  },
                  weight: "600",
                },
                descriptionStyle: {
                  color: "#4B5563",
                  size: {
                    mobile: "14px",
                    desktop: "16px",
                  },
                  lineHeight: "1.75",
                },
              },
            ],
          },
          position: 4,
          layout: {
            row: 4,
            col: 0,
            span: 2,
          },
        },
        {
          id: "a5431299-bff9-44d0-b8df-c9315a8ccbe0",
          type: "whyChooseUs",
          name: "WhyChooseUs",
          componentName: "whyChooseUs1",
          data: {
            visible: true,
            layout: {
              direction: "rtl",
              maxWidth: "1600px",
              padding: {
                y: "py-14",
                smY: "sm:py-16",
              },
            },
            header: {
              title: "لماذا تختارنا؟",
              description: "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
              marginBottom: "mb-10",
              textAlign: "text-right",
              paddingX: "px-5",
              typography: {
                title: {
                  className: "section-title text-right",
                },
                description: {
                  className: "section-subtitle-xl",
                },
              },
            },
            features: {
              list: [
                {
                  title: "خدمة شخصية",
                  desc: "نحن نركز على تقديم تجربة تركز على العملاء لجعل بحثك عن العقارات سلسًا وناجحًا.",
                  icon: {
                    type: "icon1",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
                {
                  title: "مجموعة واسعة من العقارات",
                  desc: "من الشقق إلى الفلل والمكاتب والمساحات التجارية، لدينا خيارات تناسب جميع الاحتياجات.",
                  icon: {
                    type: "icon2",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
                {
                  title: "خبرة واسعة",
                  desc: "فريقنا من الخبراء لديه سنوات من الخبرة في السوق العقاري المحلي والدولي.",
                  icon: {
                    type: "icon3",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
                {
                  title: "تحليل السوق",
                  desc: "نوفر تحليلات دقيقة للسوق العقاري لمساعدتك في اتخاذ قرارات مستنيرة.",
                  icon: {
                    type: "icon4",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
                {
                  title: "استشارات استثمارية",
                  desc: "نقدم استشارات متخصصة لمساعدتك في اختيار أفضل الفرص الاستثمارية.",
                  icon: {
                    type: "icon5",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
                {
                  title: "إدارة الممتلكات",
                  desc: "خدمات إدارة شاملة للممتلكات لضمان صيانتها وإدارتها بشكل احترافي.",
                  icon: {
                    type: "icon6",
                    size: "80",
                    className: "w-20 h-20",
                  },
                },
              ],
              grid: {
                gap: "gap-8",
                columns: {
                  sm: "sm:grid-cols-2",
                  lg: "lg:grid-cols-3",
                },
              },
            },
          },
          position: 5,
          layout: {
            row: 5,
            col: 0,
            span: 2,
          },
        },
        {
          id: "37ebc81c-3c10-4243-9684-b35139f30637",
          type: "testimonials",
          name: "Testimonials",
          componentName: "testimonials1",
          data: {
            visible: true,
            title: "آراء عملائنا",
            description: "نحن نفخر بشركائنا وعملائنا ونسعى دائمًا لتقديم أفضل الحلول التي تدعم نموهم ونجاحهم.",
            background: {
              color: "#ffffff",
              image: "",
              alt: "",
              overlay: {
                enabled: false,
                opacity: "0.1",
                color: "#000000",
              },
            },
            spacing: {
              paddingY: "py-14 sm:py-16",
              marginBottom: "mb-8",
            },
            header: {
              alignment: "text-center md:text-right",
              maxWidth: "mx-auto px-5 sm:px-26",
              title: {
                className: "section-title",
                color: "#1f2937",
                size: "text-3xl sm:text-4xl",
                weight: "font-bold",
              },
              description: {
                className: "section-subtitle-large",
                color: "#6b7280",
                size: "text-lg",
                weight: "font-normal",
              },
            },
            carousel: {
              autoplay: true,
              intervalMs: 5000,
              slidesPerView: 1,
              showNavigation: true,
              showPagination: true,
              loop: true,
            },
            testimonials: [
              {
                id: "1",
                quote: "خدمة ممتازة وسريعة، ساعدوني في العثور على العقار المثالي في وقت قياسي.",
                name: "أحمد محمد",
                location: "الرياض",
                rating: 5,
                avatar: "",
                company: "",
                date: "2024",
              },
              {
                id: "2",
                quote: "فريق محترف ومتفهم لاحتياجات العملاء، أنصح بالتعامل معهم.",
                name: "فاطمة علي",
                location: "جدة",
                rating: 5,
                avatar: "",
                company: "",
                date: "2024",
              },
              {
                id: "3",
                quote: "تجربة رائعة من البداية للنهاية، شكراً لكم على الخدمة المتميزة.",
                name: "محمد السعد",
                location: "الدمام",
                rating: 5,
                avatar: "",
                company: "",
                date: "2024",
              },
            ],
          },
          position: 6,
          layout: {
            row: 6,
            col: 0,
            span: 2,
          },
        },
      ];

      // Static data for contact-us page
      const staticContactUsData = [
        {
          id: "014a4615-0510-4d6a-bd8a-295ebfe58f3f",
          type: "hero",
          name: "Hero",
          componentName: "hero2",
          data: {
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
              description: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
              alignment: "center",
              maxWidth: "5xl",
              font: {
                title: {
                  family: "Tajawal",
                  size: {
                    desktop: "36px",
                    tablet: "36px",
                    mobile: "36px",
                  },
                  weight: "bold",
                  color: "#ffffff",
                  lineHeight: "1.25",
                },
                subtitle: {
                  family: "Tajawal",
                  size: {
                    desktop: "15px",
                    tablet: "15px",
                    mobile: "15px",
                  },
                  weight: "normal",
                  color: "#ffffff",
                },
              },
            },
            animations: {
              title: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 200,
              },
              description: {
                enabled: true,
                type: "fade-up",
                duration: 600,
                delay: 400,
              },
            },
          },
          position: 0,
          layout: {
            row: 0,
            col: 0,
            span: 2,
          },
        },
        {
          id: "89f01f82-2f92-4097-a280-3524a99a299b",
          type: "contactCards",
          name: "ContactCards",
          componentName: "contactCards1",
          data: {
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
                  src: "https://dalel-lovat.vercel.app/images/contact-us/phone.svg",
                  alt: "phone Icon",
                  size: {
                    mobile: "w-[40px] h-[40px]",
                    desktop: "md:w-[60px] md:h-[60px]",
                  },
                },
                title: {
                  text: "الهاتف",
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
                  text: "0000",
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
                  src: "https://dalel-lovat.vercel.app/images/contact-us/email.svg",
                  alt: "email Icon",
                  size: {
                    mobile: "w-[40px] h-[40px]",
                    desktop: "md:w-[60px] md:h-[60px]",
                  },
                },
                title: {
                  text: "البريد الإلكتروني",
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
                  text: "info@example.com",
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
          },
          position: 1,
          layout: {
            row: 1,
            col: 0,
            span: 2,
          },
        },
        {
          id: "07aaf881-bc28-4765-bbc3-7e1be4d5eee2",
          type: "ctaValuation",
          name: "CtaValuation",
          componentName: "ctaValuation1",
          data: {
            visible: true,
            content: {
              description1: "احصل على تقييم عقارك",
              description2: "تقييم عقاري احترافي خلال 24 ساعة",
              buttonText: "احصل على تقييم مجاني",
              buttonUrl: "/valuation",
            },
            image: {
              src: "https://www.dalel-elgwaa.online/BookingOrPreview/BookingImage.webp",
              alt: "تقييم عقاري",
              width: 320,
              height: 160,
            },
            styling: {
              bgColor: "bg-emerald-600/95",
              textColor: "text-white",
              buttonBgColor: "bg-white",
              buttonTextColor: "text-emerald-700",
            },
            layout: {
              maxWidth: "9xl",
              innerMaxWidth: "7xl",
              padding: {
                section: {
                  top: "56px",
                  bottom: "56px",
                },
                inner: {
                  horizontal: "24px",
                  vertical: "40px",
                },
              },
            },
            spacing: {
              gap: "32px",
              buttonTop: "24px",
              descriptionGap: "8px",
            },
            responsive: {
              grid: {
                mobile: "grid-cols-1",
                tablet: "md:grid-cols-12",
                desktop: "md:grid-cols-12",
              },
              imageOrder: {
                mobile: "order-1",
                tablet: "md:order-1",
                desktop: "md:order-1",
              },
              contentOrder: {
                mobile: "order-2",
                tablet: "md:order-2",
                desktop: "md:order-2",
              },
              textAlignment: {
                mobile: "text-center",
                tablet: "md:text-center",
                desktop: "md:text-center",
              },
            },
            animations: {
              enabled: true,
              fadeIn: {
                enabled: true,
                duration: 600,
                delay: 200,
              },
              slideUp: {
                enabled: true,
                duration: 800,
                delay: 400,
              },
              scale: {
                enabled: true,
                duration: 500,
                delay: 600,
              },
            },
          },
          position: 2,
          layout: {
            row: 2,
            col: 0,
            span: 2,
          },
        },
        {
          id: "61a83c3e-f599-4540-8404-a64a5941655b",
          type: "mapSection",
          name: "MapSection",
          componentName: "mapSection1",
          data: {
            visible: true,
            height: {
              desktop: "500px",
              tablet: "400px",
              mobile: "300px",
            },
            map: {
              enabled: true,
              apiKey: "",
              center: {
                lat: 26.331491700000003,
                lng: 43.91428236250001,
              },
              zoom: 13,
              mapType: "roadmap",
              style: "default",
              gestureHandling: "auto",
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              scaleControl: true,
              streetViewControl: true,
              rotateControl: true,
              fullscreenControl: true,
              embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118991.6033066348!2d43.91428236250001!3d26.331491700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e97523f269a8385%3A0xc66519139265f49e!2sAl%20Qassim%20Province%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1709605799797!5m2!1sen!2sus",
            },
            markers: {
              enabled: true,
              list: [
                {
                  id: "marker-1",
                  title: "المكتب الرئيسي",
                  description: "موقع مكتبنا الرئيسي في القصيم",
                  position: {
                    lat: 26.331491700000003,
                    lng: 43.91428236250001,
                  },
                  icon: "",
                  iconSize: "32x32",
                  animation: "bounce",
                  clickable: true,
                  draggable: false,
                  visible: true,
                },
              ],
            },
            infoWindow: {
              enabled: true,
              maxWidth: "300px",
              pixelOffset: "0,0",
              disableAutoPan: false,
              zIndex: 1000,
              style: {
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              },
            },
            overlay: {
              enabled: false,
              opacity: "0.3",
              color: "#000000",
              zIndex: 1,
            },
            content: {
              enabled: true,
              title: "تواصل معنا",
              description: "نحن متواجدون في قلب المدينة، يمكن الوصول إلينا بسهولة عبر وسائل النقل العام مع توفر مواقف سيارات واسعة.",
              position: "top-left",
              style: {
                backgroundColor: "#ffffff",
                textColor: "#1f2937",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              },
            },
          },
          position: 3,
          layout: {
            row: 3,
            col: 0,
            span: 2,
          },
        },
        {
          id: "bdc47d17-4a2e-435f-8b97-03cb58218be3",
          type: "contactFormSection",
          name: "ContactFormSection",
          componentName: "contactFormSection1",
          data: {
            visible: true,
            layout: {
              container: {
                padding: {
                  vertical: "py-8",
                  horizontal: "px-4",
                },
                maxWidth: "1600px",
              },
              grid: {
                columns: {
                  mobile: "flex-col",
                  desktop: "md:flex-row",
                },
                gap: "gap-[16px]",
              },
            },
            content: {
              title: "زوروا صفحتنا على",
              socialLinks: [
                {
                  href: "https://facebook.com",
                  alt: "facebook",
                  text: "الشركة العقارية التلقائي",
                  icon: {
                    size: "24",
                    color: "#1f2937",
                  },
                  textStyle: {
                    size: "text-[14px] md:text-[16px]",
                    color: "#1f2937",
                    weight: "font-normal",
                  },
                },
                {
                  href: "https://x.com",
                  alt: "x",
                  text: "الشركة العقارية التلقائي",
                  icon: {
                    size: "24",
                    color: "#1f2937",
                  },
                  textStyle: {
                    size: "text-[14px] md:text-[16px]",
                    color: "#1f2937",
                    weight: "font-normal",
                  },
                },
                {
                  href: "https://www.instagram.com/guide__aljiwa?igsh=MWY1amdsaGlhZm1xOA==",
                  alt: "instagram",
                  text: "الشركة العقارية التلقائي",
                  icon: {
                    size: "24",
                    color: "#1f2937",
                  },
                  textStyle: {
                    size: "text-[14px] md:text-[16px]",
                    color: "#1f2937",
                    weight: "font-normal",
                  },
                },
                {
                  href: "https://linkedin.com",
                  alt: "linkedin",
                  text: "الشركة العقارية التلقائي",
                  icon: {
                    size: "24",
                    color: "#1f2937",
                  },
                  textStyle: {
                    size: "text-[14px] md:text-[16px]",
                    color: "#1f2937",
                    weight: "font-normal",
                  },
                },
              ],
              form: {
                title: "تواصل معنا",
                fields: [
                  {
                    id: "name",
                    type: "text",
                    label: "الاسم",
                    placeholder: "أدخل اسمك",
                    required: true,
                  },
                  {
                    id: "email",
                    type: "email",
                    label: "البريد الإلكتروني",
                    placeholder: "أدخل بريدك الإلكتروني",
                    required: true,
                  },
                  {
                    id: "phone",
                    type: "tel",
                    label: "رقم الهاتف",
                    placeholder: "أدخل رقم هاتفك",
                    required: false,
                  },
                  {
                    id: "message",
                    type: "textarea",
                    label: "الرسالة",
                    placeholder: "أدخل رسالتك",
                    required: true,
                  },
                ],
                submitButton: {
                  text: "إرسال",
                  style: {
                    backgroundColor: "#059669",
                    textColor: "#ffffff",
                    hoverBackgroundColor: "#047857",
                  },
                },
              },
            },
          },
          position: 4,
          layout: {
            row: 4,
            col: 0,
            span: 2,
          },
        },
      ];

      // Ask user if they want to save static pages
      const shouldSaveStaticPages = window.confirm(
        "هل تريد حفظ صفحات about-us و contact-us الثابتة؟\n\n" +
        "نعم: سيتم حفظ الصفحات الثابتة\n" +
        "لا: سيتم الحفظ بدون الصفحات الثابتة"
      );

      if (shouldSaveStaticPages) {
        // Merge static data with payload
        payload.pages = {
          ...payload.pages,
          "about-us": staticAboutUsData,
          "contact-us": staticContactUsData,
        };

        console.log("[DEV MODE] Using static data for about-us and contact-us pages");
      } else {
        console.log("[DEV MODE] Skipping static data for about-us and contact-us pages");
      }
    }

    // Send to backend to persist
    await axiosInstance
      .post("/v1/tenant-website/save-pages", payload)
      .then(() => {
        closeDialog();
        toast.success("Changes saved successfully!");
      })
      .catch((e) => {
        console.error("[Save All] Error saving pages:", e);
        closeDialog();
        toast.error(
          e.response?.data?.message || e.message || "Failed to save changes",
        );
      });
  };

  return (
    <>
      {children}
      <SaveConfirmationDialog
        open={showDialog}
        isThemeConfirmation={false}
        onClose={closeDialog}
        onConfirm={confirmSave}
      />
    </>
  );
}
