// تعريف الصفحات المتاحة وأقسامها
export const PAGE_DEFINITIONS = {
  homepage: {
    "hero-rcio28wns": {
      type: "hero",
      name: "Hero",
      componentName: "hero1",
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
          title: "ابحث عن عقارك المفضل مع مكتب دليل الجواء العقاري",
          subtitle: "نحن هنا لتوفير أفضل الحلول العقارية لك",
          font: {
            title: {
              family: "Tajawal",
              size: {
                desktop: "5xl",
                tablet: "4xl",
                mobile: "2xl",
              },
              weight: "extrabold",
              color: "#ffffff",
              lineHeight: "1.25",
            },
            subtitle: {
              family: "Tajawal",
              size: {
                desktop: "2xl",
                tablet: "2xl",
                mobile: "2xl",
              },
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
                {
                  value: "rent",
                  label: "إيجار",
                },
                {
                  value: "sell",
                  label: "بيع",
                },
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
                {
                  id: "any",
                  label: "أي سعر",
                },
                {
                  id: "0-200k",
                  label: "0 - 200 ألف",
                },
                {
                  id: "200k-500k",
                  label: "200 - 500 ألف",
                },
                {
                  id: "500k-1m",
                  label: "500 ألف - 1 مليون",
                },
                {
                  id: "1m+",
                  label: "أكثر من 1 مليون",
                },
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
        useStore: true,
        variant: "hero-rcio28wns",
        deviceType: "laptop",
      },
      position: 0,
    },
    "halfTextHalfImage-o0kell22a": {
      type: "halfTextHalfImage",
      name: "Half Text Half Image",
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
            bottom: "6",
            left: "4",
            right: "4",
          },
          margin: {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
          },
        },
        content: {
          eyebrow: "حلول عقارية متكاملة",
          title: "شريكك الموثوق في سوق العقارات",
          description:
            "في دليل الجواء العقاري، نسعى لتقديم أفضل الحلول العقارية التي تناسب احتياجاتك. فريقنا المتخصص يعمل بجد لضمان الجودة والمصداقية في كل خطوة، لتجربة عقارية موثوقة ومريحة",
          button: {
            text: "اعرف المزيد",
            enabled: true,
            url: "/about",
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
        useStore: true,
        variant: "halfTextHalfImage-o0kell22a",
        deviceType: "laptop",
      },
      position: 1,
    },
    "propertySlider-m0gpyid96": {
      type: "propertySlider",
      name: "Property Slider",
      componentName: "propertySlider1",
      data: {
        visible: true,
        title: {
          text: "العقارات المميزة",
          subtitle: "استكشف قوائم العقارات الحصرية",
          alignment: "center",
        },
        slider: {
          autoplay: true,
          intervalMs: 5000,
          slidesPerView: 3,
          showNavigation: true,
          showPagination: true,
          loop: true,
        },
        properties: [
          {
            id: "1",
            title: "فيلا فاخرة في الرياض",
            price: "2,500,000",
            location: "الرياض، المملكة العربية السعودية",
            image: "/images/placeholders/placeholderSuitTest.jpg",
            features: ["5 غرف نوم", "3 حمامات", "مسبح خاص"],
          },
          {
            id: "2",
            title: "شقة حديثة في جدة",
            price: "800,000",
            location: "جدة، المملكة العربية السعودية",
            image: "/images/placeholders/placeholderSuitTest2.jpg",
            features: ["3 غرف نوم", "2 حمامات", "مطبخ مفتوح"],
          },
        ],
        styling: {
          background: "transparent",
          titleColor: "#1F2937",
          priceColor: "#059669",
          cardBackground: "#FFFFFF",
        },
        useStore: true,
        variant: "propertySlider-m0gpyid96",
        deviceType: "laptop",
        content: {
          description:
            "اكتشف أفضل العروض للإيجار الآن في مواقع مميزة وبأسعار تنافسية",
          title: "احدث العقارات للايجار",
        },
      },
      position: 2,
    },
    "8da1d026-f0b7-4625-99c0-0a8fa69caeb5": {
      type: "propertySlider",
      name: "Property Slider",
      componentName: "propertySlider1",
      data: {
        visible: true,
        layout: {
          maxWidth: "1600px",
          padding: {
            top: "56px",
            bottom: "56px",
          },
        },
        spacing: {
          titleBottom: "24px",
          slideGap: "16px",
        },
        content: {
          title: "احدث العقارات للبيع",
          description:
            "اكتشف أفضل العروض للإيجار الآن في مواقع مميزة وبأسعار تنافسية",
          viewAllText: "عرض الكل",
          viewAllUrl: "#",
        },
        dataSource: {
          apiUrl:
            "/v1/tenant-website/{tenantId}/properties?purpose=sale&latest=1&limit=10",
          enabled: true,
        },
        typography: {
          title: {
            fontFamily: "Tajawal",
            fontSize: {
              desktop: "2xl",
              tablet: "xl",
              mobile: "lg",
            },
            fontWeight: "extrabold",
            color: "#1f2937",
          },
          subtitle: {
            fontFamily: "Tajawal",
            fontSize: {
              desktop: "lg",
              tablet: "base",
              mobile: "sm",
            },
            fontWeight: "normal",
            color: "#6b7280",
          },
          link: {
            fontSize: "sm",
            color: "#059669",
            hoverColor: "#047857",
          },
        },
        carousel: {
          desktopCount: 4,
          autoplay: true,
        },
        background: {
          color: "transparent",
        },
        useStore: true,
        variant: "8da1d026-f0b7-4625-99c0-0a8fa69caeb5",
        deviceType: "laptop",
      },
      position: 3,
    },
    "ctaValuation-5m8q8jotq": {
      type: "ctaValuation",
      name: "CTA Valuation",
      componentName: "ctaValuation1",
      data: {
        visible: true,
        content: {
          title: "احصل على تقييم عقارك",
          subtitle: "تقييم عقاري احترافي خلال 24 ساعة",
          description:
            "فريقنا الخبير يوفر تقييمات عقارية دقيقة لمساعدتك في اتخاذ قرارات مستنيرة.",
          button: {
            text: "احصل على تقييم مجاني",
            url: "/valuation",
            style: "primary",
          },
          description1:
            " لو لديك عقار ترغب في عرضه، اطلب معاينته الآن ليتم تقييمه بشكل دقيق وتحضيره لعرضه بأفضل طريقة",
          description2: " ",
          buttonText: "",
        },
        image: {
          src: "https://dalel-lovat.vercel.app/images/cta-valuation%20section/house.webp",
          alt: "تقييم عقاري",
          position: "right",
        },
        styling: {
          background: "#F9FAFB",
          textColor: "#fffff1",
          buttonColor: "#10B981",
          layout: "split",
        },
        useStore: true,
        variant: "ctaValuation-5m8q8jotq",
        deviceType: "laptop",
      },
      position: 4,
    },
    "stepsSection-qv3s1qkmg": {
      type: "stepsSection",
      name: "Steps Section",
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
            desktop: 4,
          },
        },
        steps: [
          {
            title: "المعاينة الأولية للعقار",
            desc: "زيارة العقار وتقييم حالته ومعرفة ميزاته ومراجعة التفاصيل التي تحتاج إلى توضيح.",
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/1.svg",
            titleStyle: {
              color: "#047857",
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
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/2.svg",
            titleStyle: {
              color: "#047857",
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
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/3.svg",
            titleStyle: {
              color: "#047857",
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
            title: "توقيع اتفاقية الوساطة والتسويق",
            desc: "توقيع عقد رسمي بينك وبين المالك لتنظيم عملية تسويق العقار وحقوق الطرفين.",
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/4.svg",
            titleStyle: {
              color: "#047857",
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
            title: "تصميم بوستر للعقار وإضافته لموقعنا",
            desc: "إعداد بوستر يحتوي على الصور والتفاصيل الرئيسية ونشره على موقعنا الإلكتروني.",
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/5.svg",
            titleStyle: {
              color: "#047857",
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
            description: "",
          },
          {
            title: "جذب العملاء المحتملين",
            desc: "استخدام وسائل الاتصال المختلفة لجذب المشترين المهتمين مثل الإعلانات.",
            image:
              "https://dalel-lovat.vercel.app/images/MarketingStepsSection/6.svg",
            titleStyle: {
              color: "#047857",
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
            description: "",
          },
          {
            title: " التفاوض مع العميل وإتمام الصفقة",
            description:
              "العمل على التفاوض على السعر وشروط البيع مع العميل حتى إتمام الصفقة وتوقيع العقود.",
            image: "https://api.dalel-elgwaa.online/storage/20/7.svg",
            titleStyle: "",
            descriptionStyle: "",
            desc: "العمل على التفاوض على السعر وشروط البيع مع العميل حتى إتمام الصفقة وتوقيع العقود.",
          },
          {
            title: " متابعة ما بعد البيع أو الإيجار",
            description:
              "بعد إتمام الصفقة، يتم متابعة العميل للتأكد من رضاه عن العقار وتقديم الدعم اللازم",
            image: "https://api.dalel-elgwaa.online/storage/21/8.svg",
            titleStyle: "",
            descriptionStyle: "",
            desc: "بعد إتمام الصفقة، يتم متابعة العميل للتأكد من رضاه عن العقار وتقديم الدعم اللازم",
          },
        ],
        iconStyle: {
          size: {
            mobile: "40px",
            desktop: "60px",
          },
          marginTop: "4px",
          shrink: true,
        },
        layout: {
          direction: "rtl",
          alignment: "left",
          maxWidth: "1200px",
        },
        animations: {
          header: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            delay: 200,
          },
          steps: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            stagger: 100,
          },
        },
        responsive: {
          mobileBreakpoint: "640px",
          tabletBreakpoint: "1024px",
          desktopBreakpoint: "1280px",
        },
        texts: {
          title: "Steps Section Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
        useStore: true,
        variant: "stepsSection-qv3s1qkmg",
        deviceType: "laptop",
      },
      position: 5,
    },
    "ea9e6b40-4f4e-43a1-b244-57ce9a3861ee": {
      type: "halfTextHalfImage",
      name: "HalfTextHalfImage",
      componentName: "halfTextHalfImage2",
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
            top: "12",
            bottom: "6",
            left: "4",
            right: "4",
          },
          margin: {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
          },
        },
        content: {
          eyebrow: "تجربتك العقارية تبدأ هنا",
          title: "أيجاد عقار مناسب هو هدفنا",
          description:
            "دليل الجواء العقاري يقدم لك أفضل الحلول العقارية بخبرة واحترافية لتلبية كافة احتياجاتك في البيع والإيجار، مع ضمان تجربة مريحة وموثوقة",
          button: {
            text: "تعرف علينا",
            enabled: true,
            url: "/about",
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
          stats: {
            stat1: {
              value: "100 +",
              label: "عميل سعيد",
            },
            stat2: {
              value: "50 +",
              label: "عقار تم بيعه",
            },
            stat3: {
              value: "250 +",
              label: "عقار تم تاجيره",
            },
            stat4: {
              label: "تقييمات العملاء",
              value: "40",
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
          src: "https://www.dalel-elgwaa.online/CounterSection/CouterSectionImage.webp",
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
        useStore: true,
        variant: "ea9e6b40-4f4e-43a1-b244-57ce9a3861ee",
        deviceType: "laptop",
      },
      position: 6,
    },
    "whyChooseUs-tyej50i9u": {
      type: "whyChooseUs",
      name: "Why Choose Us",
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
          description:
            "مكتبنا يجمع بين الخبرة والالتزام لتقديم خدمات مميزة في مجال العقارات",
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
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/1.svg",
            },
            {
              title: "مجموعة واسعة من العقارات",
              desc: "من الشقق إلى الفلل والمكاتب والمساحات التجارية، لدينا خيارات تناسب جميع الاحتياجات.",
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/2.svg",
            },
            {
              title: "إرشادات الخبراء",
              desc: "بفضل سنوات الخبرة، يقدم فريقنا رؤى ونصائح مخصصة لضمان قرار مناسب لتفضيلاتك.",
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/3.svg",
            },
            {
              title: "تحليل السوق",
              desc: "تحليل متعمق للسوق يوفر رؤية قيمة حول اتجاهات العقارات والأسعار وفرص الاستثمار.",
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/4.svg",
            },
            {
              title: "الاستشارات الاستثمارية",
              desc: "إرشادات من الخبراء لتحقيق أقصى عائد على استثماراتك العقارية واتخاذ قرارات ذكية.",
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/5.svg",
            },
            {
              title: "إدارة الممتلكات",
              desc: "خدمات إدارة شاملة للحفاظ على قيمة ممتلكاتك وتعزيز عوائدها التأجيرية.",
              icon: "https://dalel-lovat.vercel.app/images/why-choose-us/6.svg",
            },
          ],
          grid: {
            gap: "gap-6",
            columns: {
              sm: "sm:grid-cols-2",
              xl: "xl:grid-cols-3",
            },
            paddingX: "px-4",
          },
          card: {
            className:
              "rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-emerald-50",
            borderRadius: "rounded-2xl",
            border: "border",
            backgroundColor: "bg-white",
            padding: "p-6",
            shadow: "shadow-sm",
            ring: "ring-1 ring-emerald-50",
          },
          icon: {
            container: {
              className: "mx-auto flex size-20 items-center justify-center",
              size: "size-20",
              flex: "flex",
              items: "items-center",
              justify: "justify-center",
            },
            image: {
              className: "h-[7rem] w-[7rem]",
              height: "h-[7rem]",
              width: "w-[7rem]",
            },
          },
          typography: {
            title: {
              className: "mt-6 text-center text-lg font-bold text-emerald-700",
              marginTop: "mt-6",
              textAlign: "text-center",
              fontSize: "text-lg",
              fontWeight: "font-bold",
              color: "text-emerald-700",
            },
            description: {
              className: "mt-3 text-center text-lg leading-7 text-gray-600",
              marginTop: "mt-3",
              textAlign: "text-center",
              fontSize: "text-lg",
              lineHeight: "leading-7",
              color: "text-gray-600",
            },
          },
        },
        responsive: {
          mobile: {
            padding: "py-14",
            gridCols: "grid-cols-1",
          },
          tablet: {
            padding: "sm:py-16",
            gridCols: "sm:grid-cols-2",
          },
          desktop: {
            gridCols: "xl:grid-cols-3",
          },
        },
        animations: {
          header: {
            enabled: true,
            type: "fade-up",
            duration: 600,
            delay: 200,
          },
          features: {
            enabled: true,
            type: "fade-up",
            duration: 500,
            delay: 300,
            stagger: 100,
          },
          icons: {
            enabled: true,
            type: "fade-up",
            duration: 500,
            delay: 400,
            stagger: 50,
          },
        },
        colors: {
          background: "#ffffff",
          cardBackground: "#ffffff",
          titleColor: "#059669",
          descriptionColor: "#4b5563",
          borderColor: "#e5e7eb",
          ringColor: "#ecfdf5",
        },
      },
      position: 7,
    },
    "testimonials-ffem1lb6l": {
      type: "testimonials",
      name: "Testimonials",
      componentName: "testimonials1",
      data: {
        visible: true,
        texts: {
          title: "Testimonials Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 8,
    },
    "contactMapSection-4y0bblaij": {
      type: "contactMapSection",
      name: "Contact Map Section",
      componentName: "contactMapSection1",
      data: {
        visible: true,
        texts: {
          title: "Contact Map Section Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 9,
    },
  },
  "for-rent": {
    "4ae1553b-b67d-4446-a7e0-6157299c24dc": {
      type: "header",
      name: "Header",
      componentName: "header1",
      data: {
        visible: true,
        position: {
          type: "sticky",
          top: 0,
          zIndex: 50,
        },
        height: {
          desktop: 96,
          tablet: 80,
          mobile: 64,
        },
        background: {
          type: "solid",
          opacity: "0.8",
          blur: true,
          colors: {
            from: "#ffffff",
            to: "#ffffff",
          },
        },
        colors: {
          text: "#1f2937",
          link: "#374151",
          linkHover: "#1f2937",
          linkActive: "#059669",
          icon: "#374151",
          iconHover: "#1f2937",
          border: "#e5e7eb",
          accent: "#059669",
        },
        logo: {
          type: "image+text",
          image: "https://dalel-lovat.vercel.app/images/logo.svg",
          text: "مكتب دليل الجواء",
          font: {
            family: "Tajawal",
            size: 24,
            weight: "600",
          },
          url: "/",
          clickAction: "navigate",
        },
        menu: [
          {
            id: "home",
            type: "link",
            text: "الرئيسية",
            url: "/",
          },
          {
            id: "about",
            type: "link",
            text: "حول",
            url: "/about",
          },
          {
            id: "services",
            type: "link",
            text: "الخدمات",
            url: "/services",
          },
          {
            id: "contact",
            type: "link",
            text: "اتصل بنا",
            url: "/contact",
          },
        ],
        actions: {
          search: {
            enabled: false,
            placeholder: "بحث...",
          },
          user: {
            showProfile: true,
            showCart: false,
            showWishlist: false,
            showNotifications: false,
          },
          mobile: {
            showLogo: true,
            showLanguageToggle: false,
            showSearch: false,
          },
        },
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
          },
          mobileMenu: {
            side: "right",
            width: 320,
            overlay: true,
          },
        },
        animations: {
          menuItems: {
            enabled: true,
            duration: 200,
            delay: 50,
          },
          mobileMenu: {
            enabled: true,
            duration: 300,
            easing: "ease-in-out",
          },
        },
      },
      position: 0,
    },
    "85b51aac-3d5c-4d5c-8f80-ee7108b0ac1c": {
      type: "propertyFilter",
      name: "PropertyFilter",
      componentName: "propertyFilter1",
      data: {
        visible: true,
        texts: {
          title: "Property Filter Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 1,
    },
    "7a1f1ff0-d475-44cc-93bf-cafaae97375e": {
      type: "filterButtons",
      name: "FilterButtons",
      componentName: "filterButtons1",
      data: {
        visible: true,
        texts: {
          title: "Filter Buttons Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 2,
    },
    "b1e63d20-226f-45de-be0d-78be1c4aed6e": {
      type: "grid",
      name: "Grid",
      componentName: "grid1",
      data: {
        visible: true,
        texts: {
          title: "Property Grid Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 3,
    },
    "ecb8fbd6-42ee-4ee0-9e0a-8b66fb9ffd76": {
      type: "footer",
      name: "Footer",
      componentName: "footer1",
      data: {
        visible: true,
        background: {
          type: "image",
          image:
            "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
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
              {
                text: "الرئيسية",
                url: "/",
              },
              {
                text: "البيع",
                url: "/sell",
              },
              {
                text: "الإيجار",
                url: "/rent",
              },
              {
                text: "من نحن",
                url: "/about",
              },
              {
                text: "تواصل معنا",
                url: "/contact",
              },
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
              {
                name: "واتساب",
                icon: "FaWhatsapp",
                url: "#",
                color: "#25D366",
              },
              {
                name: "لينكد إن",
                icon: "Linkedin",
                url: "#",
                color: "#0077B5",
              },
              {
                name: "إنستغرام",
                icon: "Instagram",
                url: "#",
                color: "#E4405F",
              },
              {
                name: "تويتر",
                icon: "Twitter",
                url: "#",
                color: "#1DA1F2",
              },
              {
                name: "فيسبوك",
                icon: "Facebook",
                url: "#",
                color: "#1877F2",
              },
            ],
          },
        },
        footerBottom: {
          enabled: true,
          copyright:
            "© 2024 مكتب دليل الجواء للخدمات العقارية. جميع الحقوق محفوظة.",
          legalLinks: [
            {
              text: "سياسة الخصوصية",
              url: "/privacy",
            },
            {
              text: "الشروط والأحكام",
              url: "/terms",
            },
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
      },
      position: 4,
    },
  },
  "for-sale": {
    "cc094a2a-8265-44b2-88ad-69d5bd1d242e": {
      type: "header",
      name: "Header",
      componentName: "header1",
      data: {
        visible: true,
        position: {
          type: "sticky",
          top: 0,
          zIndex: 50,
        },
        height: {
          desktop: 96,
          tablet: 80,
          mobile: 64,
        },
        background: {
          type: "solid",
          opacity: "0.8",
          blur: true,
          colors: {
            from: "#ffffff",
            to: "#ffffff",
          },
        },
        colors: {
          text: "#1f2937",
          link: "#374151",
          linkHover: "#1f2937",
          linkActive: "#059669",
          icon: "#374151",
          iconHover: "#1f2937",
          border: "#e5e7eb",
          accent: "#059669",
        },
        logo: {
          type: "image+text",
          image: "https://dalel-lovat.vercel.app/images/logo.svg",
          text: "مكتب دليل الجواء",
          font: {
            family: "Tajawal",
            size: 24,
            weight: "600",
          },
          url: "/",
          clickAction: "navigate",
        },
        menu: [
          {
            id: "home",
            type: "link",
            text: "الرئيسية",
            url: "/",
          },
          {
            id: "about",
            type: "link",
            text: "حول",
            url: "/about",
          },
          {
            id: "services",
            type: "link",
            text: "الخدمات",
            url: "/services",
          },
          {
            id: "contact",
            type: "link",
            text: "اتصل بنا",
            url: "/contact",
          },
        ],
        actions: {
          search: {
            enabled: false,
            placeholder: "بحث...",
          },
          user: {
            showProfile: true,
            showCart: false,
            showWishlist: false,
            showNotifications: false,
          },
          mobile: {
            showLogo: true,
            showLanguageToggle: false,
            showSearch: false,
          },
        },
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
          },
          mobileMenu: {
            side: "right",
            width: 320,
            overlay: true,
          },
        },
        animations: {
          menuItems: {
            enabled: true,
            duration: 200,
            delay: 50,
          },
          mobileMenu: {
            enabled: true,
            duration: 300,
            easing: "ease-in-out",
          },
        },
      },
      position: 0,
    },
    "387f5313-ab58-43e4-a081-c2c66b765340": {
      type: "propertyFilter",
      name: "PropertyFilter",
      componentName: "propertyFilter1",
      data: {
        visible: true,
        texts: {
          title: "Property Filter Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 1,
    },
    "e319cca0-6ecb-46e7-9d77-39faa624f567": {
      type: "filterButtons",
      name: "FilterButtons",
      componentName: "filterButtons1",
      data: {
        visible: true,
        texts: {
          title: "Filter Buttons Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 2,
    },
    "c8c3eccd-e1e9-4bdd-b913-5408da3e757f": {
      type: "grid",
      name: "Grid",
      componentName: "grid1",
      data: {
        visible: true,
        texts: {
          title: "Property Grid Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 3,
    },
    "dc48f5ac-3701-4dbd-b5d6-eab5da1d6954": {
      type: "footer",
      name: "Footer",
      componentName: "footer1",
      data: {
        visible: true,
        background: {
          type: "image",
          image:
            "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
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
              {
                text: "الرئيسية",
                url: "/",
              },
              {
                text: "البيع",
                url: "/sell",
              },
              {
                text: "الإيجار",
                url: "/rent",
              },
              {
                text: "من نحن",
                url: "/about",
              },
              {
                text: "تواصل معنا",
                url: "/contact",
              },
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
              {
                name: "واتساب",
                icon: "FaWhatsapp",
                url: "#",
                color: "#25D366",
              },
              {
                name: "لينكد إن",
                icon: "Linkedin",
                url: "#",
                color: "#0077B5",
              },
              {
                name: "إنستغرام",
                icon: "Instagram",
                url: "#",
                color: "#E4405F",
              },
              {
                name: "تويتر",
                icon: "Twitter",
                url: "#",
                color: "#1DA1F2",
              },
              {
                name: "فيسبوك",
                icon: "Facebook",
                url: "#",
                color: "#1877F2",
              },
            ],
          },
        },
        footerBottom: {
          enabled: true,
          copyright:
            "© 2024 مكتب دليل الجواء للخدمات العقارية. جميع الحقوق محفوظة.",
          legalLinks: [
            {
              text: "سياسة الخصوصية",
              url: "/privacy",
            },
            {
              text: "الشروط والأحكام",
              url: "/terms",
            },
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
      },
      position: 4,
    },
  },
  "about-us": {
    "9d3c9ceb-628d-4819-a4bf-61215980cf52": {
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
          subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
          font: {
            title: {
              family: "Tajawal",
              size: {
                desktop: "5xl",
                tablet: "4xl",
                mobile: "2xl",
              },
              weight: "extrabold",
              color: "#ffffff",
              lineHeight: "1.25",
            },
            subtitle: {
              family: "Tajawal",
              size: {
                desktop: "2xl",
                tablet: "2xl",
                mobile: "2xl",
              },
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
                {
                  value: "rent",
                  label: "إيجار",
                },
                {
                  value: "sell",
                  label: "بيع",
                },
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
                {
                  id: "any",
                  label: "أي سعر",
                },
                {
                  id: "0-200k",
                  label: "0 - 200 ألف",
                },
                {
                  id: "200k-500k",
                  label: "200 - 500 ألف",
                },
                {
                  id: "500k-1m",
                  label: "500 ألف - 1 مليون",
                },
                {
                  id: "1m+",
                  label: "أكثر من 1 مليون",
                },
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
        useStore: true,
        variant: "9d3c9ceb-628d-4819-a4bf-61215980cf52",
        deviceType: "laptop",
      },
      position: 0,
    },
    "b39a0518-91bc-4a92-9292-9c40ce06a9c2": {
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
            bottom: "6",
            left: "4",
            right: "4",
          },
          margin: {
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
          },
        },
        content: {
          eyebrow: "شريك موثوق",
          title: "نحن شريكك الموثوق في عالم العقارات",
          description:
            "نقدم لك أفضل الخدمات العقارية مع ضمان الجودة والموثوقية. فريقنا من الخبراء يساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك.",
          button: {
            text: "تعرف علينا",
            enabled: true,
            url: "/about",
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
    },
    "069bd72b-159e-42ea-afda-8af29823f2ab": {
      type: "halfTextHalfImage",
      name: "HalfTextHalfImage",
      componentName: "halfTextHalfImage3",
      data: {
        visible: true,
        title: "رسالتنا",
        description:
          "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
        imageSrc:
          "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
        imageAlt: "Choose Us",
        imagePosition: "left",
        content: {
          title: "رسالتنا",
          description:
            "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
          imagePosition: "left",
        },
        image: {
          src: "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
          alt: "Choose Us",
        },
      },
      position: 2,
    },
    "3f862e56-6dd5-4dc8-ba18-b088c8767766": {
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
        title: "رسالتنا",
        description:
          "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
        imageSrc:
          "https://dalel-lovat.vercel.app//images/aboutUs-page/message.webp",
        imageAlt: "Choose Us",
        imagePosition: "left",
        content: {
          title: "رؤيتنا",
          description:
            "نحن في مكتب دليل الجواء العقاري نطمح لأن نكون الرائدين في قطاع العقارات في منطقة القصيم، وأن نقدم حلولًا عقارية متكاملة ومتطورة للعملاء، مع التركيز على توفير فرص استثمارية مميزة. نسعى لبناء علاقات طويلة الأمد مع عملائنا من خلال تقديم خدمات عالية الجودة، ونسعى دائمًا إلى تحسين وتحقيق تطلعاتهم. رؤيتنا هي أن نكون الخيار الأول للعملاء الباحثين عن الاستشارات العقارية الموثوقة والحلول المتقدمة، مما يجعلنا الشريك المثالي لهم في عالم العقارات",
          imagePosition: "left",
          eyebrow: "",
        },
        image: {
          src: "https://dalel-lovat.vercel.app/images/aboutUs-page/vision.webp",
          alt: "Choose Us",
        },
      },
      position: 3,
    },
    "3afda972-628b-4002-bfc1-8e62872161ed": {
      type: "stepsSection",
      name: "StepsSection",
      componentName: "stepsSection1",
      data: {
        visible: true,
        texts: {
          title: "Steps Section Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 4,
    },
    "d60dd35f-7039-4464-84df-c80e76e4f043": {
      type: "header",
      name: "Header",
      componentName: "header1",
      data: {
        visible: true,
        position: {
          type: "sticky",
          top: 0,
          zIndex: 50,
        },
        height: {
          desktop: 96,
          tablet: 80,
          mobile: 64,
        },
        background: {
          type: "solid",
          opacity: "0.8",
          blur: true,
          colors: {
            from: "#ffffff",
            to: "#ffffff",
          },
        },
        colors: {
          text: "#1f2937",
          link: "#374151",
          linkHover: "#1f2937",
          linkActive: "#059669",
          icon: "#374151",
          iconHover: "#1f2937",
          border: "#e5e7eb",
          accent: "#059669",
        },
        logo: {
          type: "image+text",
          image: "https://dalel-lovat.vercel.app/images/logo.svg",
          text: "مكتب دليل الجواء",
          font: {
            family: "Tajawal",
            size: 24,
            weight: "600",
          },
          url: "/",
          clickAction: "navigate",
        },
        menu: [
          {
            id: "home",
            type: "link",
            text: "الرئيسية",
            url: "/",
          },
          {
            id: "about",
            type: "link",
            text: "حول",
            url: "/about",
          },
          {
            id: "services",
            type: "link",
            text: "الخدمات",
            url: "/services",
          },
          {
            id: "contact",
            type: "link",
            text: "اتصل بنا",
            url: "/contact",
          },
        ],
        actions: {
          search: {
            enabled: false,
            placeholder: "بحث...",
          },
          user: {
            showProfile: true,
            showCart: false,
            showWishlist: false,
            showNotifications: false,
          },
          mobile: {
            showLogo: true,
            showLanguageToggle: false,
            showSearch: false,
          },
        },
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
          },
          mobileMenu: {
            side: "right",
            width: 320,
            overlay: true,
          },
        },
        animations: {
          menuItems: {
            enabled: true,
            duration: 200,
            delay: 50,
          },
          mobileMenu: {
            enabled: true,
            duration: 300,
            easing: "ease-in-out",
          },
        },
        useStore: true,
        variant: "d60dd35f-7039-4464-84df-c80e76e4f043",
        deviceType: "laptop",
      },
      position: 5,
    },
    "a5431299-bff9-44d0-b8df-c9315a8ccbe0": {
      type: "whyChooseUs",
      name: "WhyChooseUs",
      componentName: "whyChooseUs1",
      data: {
        visible: true,
        texts: {
          title: "Why Choose Us Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 6,
    },
    "37ebc81c-3c10-4243-9684-b35139f30637": {
      type: "testimonials",
      name: "Testimonials",
      componentName: "testimonials1",
      data: {
        visible: true,
        texts: {
          title: "Testimonials Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 7,
    },
    "96bf9caf-c1e5-4a5a-b613-0081927c3612": {
      type: "footer",
      name: "Footer",
      componentName: "footer1",
      data: {
        visible: true,
        background: {
          type: "image",
          image:
            "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
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
              {
                text: "الرئيسية",
                url: "/",
              },
              {
                text: "البيع",
                url: "/sell",
              },
              {
                text: "الإيجار",
                url: "/rent",
              },
              {
                text: "من نحن",
                url: "/about",
              },
              {
                text: "تواصل معنا",
                url: "/contact",
              },
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
              {
                name: "واتساب",
                icon: "FaWhatsapp",
                url: "#",
                color: "#25D366",
              },
              {
                name: "لينكد إن",
                icon: "Linkedin",
                url: "#",
                color: "#0077B5",
              },
              {
                name: "إنستغرام",
                icon: "Instagram",
                url: "#",
                color: "#E4405F",
              },
              {
                name: "تويتر",
                icon: "Twitter",
                url: "#",
                color: "#1DA1F2",
              },
              {
                name: "فيسبوك",
                icon: "Facebook",
                url: "#",
                color: "#1877F2",
              },
            ],
          },
        },
        footerBottom: {
          enabled: true,
          copyright:
            "© 2024 مكتب دليل الجواء للخدمات العقارية. جميع الحقوق محفوظة.",
          legalLinks: [
            {
              text: "سياسة الخصوصية",
              url: "/privacy",
            },
            {
              text: "الشروط والأحكام",
              url: "/terms",
            },
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
      },
      position: 8,
    },
  },
  "contact-us": {
    "014a4615-0510-4d6a-bd8a-295ebfe58f3f": {
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
          subtitle: "نقدم لك أفضل الخيارات العقارية مع ضمان الجودة والموثوقية",
          font: {
            title: {
              family: "Tajawal",
              size: {
                desktop: "5xl",
                tablet: "4xl",
                mobile: "2xl",
              },
              weight: "extrabold",
              color: "#ffffff",
              lineHeight: "1.25",
            },
            subtitle: {
              family: "Tajawal",
              size: {
                desktop: "2xl",
                tablet: "2xl",
                mobile: "2xl",
              },
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
                {
                  value: "rent",
                  label: "إيجار",
                },
                {
                  value: "sell",
                  label: "بيع",
                },
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
                {
                  id: "any",
                  label: "أي سعر",
                },
                {
                  id: "0-200k",
                  label: "0 - 200 ألف",
                },
                {
                  id: "200k-500k",
                  label: "200 - 500 ألف",
                },
                {
                  id: "500k-1m",
                  label: "500 ألف - 1 مليون",
                },
                {
                  id: "1m+",
                  label: "أكثر من 1 مليون",
                },
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
        useStore: true,
        variant: "014a4615-0510-4d6a-bd8a-295ebfe58f3f",
        deviceType: "laptop",
      },
      position: 0,
    },
    "89f01f82-2f92-4097-a280-3524a99a299b": {
      type: "contactCards",
      name: "ContactCards",
      componentName: "contactCards1",
      data: {
        visible: true,
        texts: {
          title: "Contact Cards Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 1,
    },
    "eb571bfc-e8be-4254-abf9-0cedf91cbbfc": {
      type: "header",
      name: "Header",
      componentName: "header1",
      data: {
        visible: true,
        position: {
          type: "sticky",
          top: 0,
          zIndex: 50,
        },
        height: {
          desktop: 96,
          tablet: 80,
          mobile: 64,
        },
        background: {
          type: "solid",
          opacity: "0.8",
          blur: true,
          colors: {
            from: "#ffffff",
            to: "#ffffff",
          },
        },
        colors: {
          text: "#1f2937",
          link: "#374151",
          linkHover: "#1f2937",
          linkActive: "#059669",
          icon: "#374151",
          iconHover: "#1f2937",
          border: "#e5e7eb",
          accent: "#059669",
        },
        logo: {
          type: "image",
          image: "https://dalel-lovat.vercel.app/images/logo.svg",
          text: "",
          font: {
            family: "Tajawal",
            size: 24,
            weight: "600",
          },
          url: "/",
          clickAction: "navigate",
        },
        menu: [
          {
            id: "home",
            type: "link",
            text: "الرئيسية",
            url: "/",
          },
          {
            id: "rent",
            type: "link",
            text: "الايجار",
            url: "/for-rent",
          },
          {
            id: "البيع",
            type: "link",
            text: "البيع",
            url: "/for-sale",
          },
          {
            id: "contact",
            type: "link",
            text: "تواصل معنا",
            url: "/contact-us",
          },
        ],
        actions: {
          search: {
            enabled: false,
            placeholder: "بحث...",
          },
          user: {
            showProfile: true,
            showCart: false,
            showWishlist: false,
            showNotifications: false,
          },
          mobile: {
            showLogo: true,
            showLanguageToggle: false,
            showSearch: false,
          },
        },
        responsive: {
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
          },
          mobileMenu: {
            side: "right",
            width: 320,
            overlay: true,
          },
        },
        animations: {
          menuItems: {
            enabled: true,
            duration: 200,
            delay: 50,
          },
          mobileMenu: {
            enabled: true,
            duration: 300,
            easing: "ease-in-out",
          },
        },
        useStore: true,
        variant: "eb571bfc-e8be-4254-abf9-0cedf91cbbfc",
        deviceType: "laptop",
      },
      position: 2,
    },
    "07aaf881-bc28-4765-bbc3-7e1be4d5eee2": {
      type: "ctaValuation",
      name: "CtaValuation",
      componentName: "ctaValuation1",
      data: {
        visible: true,
        content: {
          title: "احصل على تقييم عقارك",
          subtitle: "تقييم عقاري احترافي خلال 24 ساعة",
          description:
            "فريقنا الخبير يوفر تقييمات عقارية دقيقة لمساعدتك في اتخاذ قرارات مستنيرة.",
          button: {
            text: "احصل على تقييم مجاني",
            url: "/valuation",
            style: "primary",
          },
        },
        image: {
          src: "https://www.dalel-elgwaa.online/BookingOrPreview/BookingImage.webp",
          alt: "تقييم عقاري",
          position: "right",
        },
        styling: {
          background: "#F9FAFB",
          textColor: "#ffffff",
          buttonColor: "#10B981",
          layout: "split",
          bgColor: "#F97316E6",
          buttonTextColor: "#000000",
        },
        useStore: true,
        variant: "07aaf881-bc28-4765-bbc3-7e1be4d5eee2",
        deviceType: "laptop",
      },
      position: 3,
    },
    "c4c00aeb-9046-44a4-8fee-bbeaee4f3793": {
      type: "footer",
      name: "Footer",
      componentName: "footer1",
      data: {
        visible: true,
        background: {
          type: "image",
          image:
            "https://dalel-lovat.vercel.app/images/footer/FooterImage.webp",
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
              {
                text: "الرئيسية",
                url: "/",
              },
              {
                text: "البيع",
                url: "/sell",
              },
              {
                text: "الإيجار",
                url: "/rent",
              },
              {
                text: "من نحن",
                url: "/about",
              },
              {
                text: "تواصل معنا",
                url: "/contact",
              },
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
              {
                name: "واتساب",
                icon: "FaWhatsapp",
                url: "#",
                color: "#25D366",
              },
              {
                name: "لينكد إن",
                icon: "Linkedin",
                url: "#",
                color: "#0077B5",
              },
              {
                name: "إنستغرام",
                icon: "Instagram",
                url: "#",
                color: "#E4405F",
              },
              {
                name: "تويتر",
                icon: "Twitter",
                url: "#",
                color: "#1DA1F2",
              },
              {
                name: "فيسبوك",
                icon: "Facebook",
                url: "#",
                color: "#1877F2",
              },
            ],
          },
        },
        footerBottom: {
          enabled: true,
          copyright:
            "© 2024 مكتب دليل الجواء للخدمات العقارية. جميع الحقوق محفوظة.",
          legalLinks: [
            {
              text: "سياسة الخصوصية",
              url: "/privacy",
            },
            {
              text: "الشروط والأحكام",
              url: "/terms",
            },
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
      },
      position: 4,
    },
    "61a83c3e-f599-4540-8404-a64a5941655b": {
      type: "mapSection",
      name: "MapSection",
      componentName: "mapSection1",
      data: {
        visible: true,
        texts: {
          title: "Map Section Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 5,
    },
    "bdc47d17-4a2e-435f-8b97-03cb58218be3": {
      type: "contactFormSection",
      name: "ContactFormSection",
      componentName: "contactFormSection1",
      data: {
        visible: true,
        texts: {
          title: "Contact Form Section Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
      },
      position: 6,
    },
  },
  "create-request": {
    "hero-property-request": {
      type: "hero",
      name: "Hero",
      componentName: "hero2",
      data: {
        visible: true,
        height: {
          desktop: "70vh",
          tablet: "70vh",
          mobile: "70vh",
        },
        minHeight: {
          desktop: "400px",
          tablet: "400px",
          mobile: "400px",
        },
        background: {
          image: "https://dalel-lovat.vercel.app/images/hero.webp",
          alt: "صورة خلفية لطلب عقاري",
          overlay: {
            enabled: true,
            opacity: "0.45",
            color: "#000000",
          },
        },
        content: {
          title: "سجل طلبك العقاري",
          subtitle: "ابحث عن العقار المثالي بسهولة ويسر",
          font: {
            title: {
              family: "Tajawal",
              size: {
                desktop: "4xl",
                tablet: "3xl",
                mobile: "2xl",
              },
              weight: "extrabold",
              color: "#ffffff",
              lineHeight: "1.25",
            },
            subtitle: {
              family: "Tajawal",
              size: {
                desktop: "xl",
                tablet: "lg",
                mobile: "lg",
              },
              weight: "normal",
              color: "rgba(255, 255, 255, 0.85)",
            },
          },
          alignment: "center",
          maxWidth: "4xl",
          paddingTop: "150px",
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
        },
        useStore: true,
        variant: "hero-property-request",
        deviceType: "laptop",
      },
      position: 0,
    },
    "application-form": {
      type: "applicationForm",
      name: "Application Form",
      componentName: "applicationForm1",
      data: {
        visible: true,
        formSettings: {
          formId: "propertyRequestForm",
          formAction: "front.user.property-requests.store",
          submitButton: {
            text: "إرسال الطلب",
            icon: "fas fa-paper-plane",
          },
          validation: {
            requiredFieldsValidation: true,
            clientSideValidation: true,
          },
        },
        formCards: [
          {
            cardId: "property_info",
            cardTitle: "معلومات العقار المطلوب",
            cardIcon: "fas fa-building",
            inputs: [
              {
                inputId: "category_id",
                inputType: "select",
                label: "نوع العقار",
                placeholder: "اختر نوع العقار",
                required: true,
                options: "dynamic_from_allCategories",
                emptyOption: "لا توجد أنواع متاحة حاليًا",
              },
              {
                inputId: "property_type",
                inputType: "radio",
                label: "تصنيف العقار",
                required: true,
                options: ["سكني", "تجاري", "صناعي", "زراعي"],
              },
              {
                inputId: "city_id",
                inputType: "select",
                label: "المدينة",
                placeholder: "اختر المدينة",
                required: true,
                options: "dynamic_from_citiesList",
                dependentField: "districts_id",
              },
              {
                inputId: "districts_id",
                inputType: "select",
                label: "الحي",
                placeholder: "اختر الحي",
                required: true,
                options: "dynamic_from_districts_by_city",
                dependsOn: "city_id",
              },
              {
                inputId: "area_from",
                inputType: "number",
                label: "المساحة من (م²)",
                placeholder: "مثال: 100",
                required: false,
              },
              {
                inputId: "area_to",
                inputType: "number",
                label: "المساحة إلى (م²)",
                placeholder: "مثال: 200",
                required: false,
              },
            ],
          },
          {
            cardId: "budget_info",
            cardTitle: "معلومات الميزانية والدفع",
            cardIcon: "fas fa-money-bill-wave",
            inputs: [
              {
                inputId: "purchase_method",
                inputType: "radio",
                label: "طريقة الشراء",
                required: true,
                options: ["كاش", "تمويل بنكي"],
              },
              {
                inputId: "budget_from",
                inputType: "number",
                label: "الميزانية من (ر.س)",
                placeholder: "مثال: 500000",
                required: false,
              },
              {
                inputId: "budget_to",
                inputType: "number",
                label: "الميزانية إلى (ر.س)",
                placeholder: "مثال: 800000",
                required: false,
              },
            ],
          },
          {
            cardId: "extra_details",
            cardTitle: "تفاصيل إضافية",
            cardIcon: "fas fa-clipboard-check",
            inputs: [
              {
                inputId: "seriousness",
                inputType: "radio",
                label: "ما مدى جديتك في الشراء؟",
                required: true,
                options: [
                  "مستعد فورًا",
                  "خلال شهر",
                  "خلال 3 أشهر",
                  "لاحقًا / استكشاف فقط",
                ],
              },
              {
                inputId: "purchase_goal",
                inputType: "radio",
                label: "هدف الشراء",
                required: true,
                options: [
                  "سكن خاص",
                  "استثمار وتأجير",
                  "بناء وبيع",
                  "مشروع تجاري",
                ],
              },
              {
                inputId: "wants_similar_offers",
                inputType: "radio",
                label: "هل ترغب باستقبال عروض مشابهة؟",
                required: true,
                options: [
                  {
                    value: "1",
                    label: "نعم",
                  },
                  {
                    value: "0",
                    label: "لا",
                  },
                ],
                defaultValue: "1",
              },
            ],
          },
          {
            cardId: "contact_info",
            cardTitle: "بيانات التواصل",
            cardIcon: "fas fa-user",
            inputs: [
              {
                inputId: "full_name",
                inputType: "text",
                label: "الاسم الكامل",
                placeholder: "أدخل اسمك الكامل",
                required: true,
              },
              {
                inputId: "phone",
                inputType: "text",
                label: "رقم الجوال",
                placeholder: "05xxxxxxxx",
                required: true,
              },
              {
                inputId: "contact_on_whatsapp",
                inputType: "radio",
                label: "هل ترغب بالتواصل عبر واتساب؟",
                required: true,
                options: [
                  {
                    value: "1",
                    label: "نعم",
                  },
                  {
                    value: "0",
                    label: "لا",
                  },
                ],
                defaultValue: "1",
              },
              {
                inputId: "notes",
                inputType: "textarea",
                label: "تفاصيل إضافية أو ملاحظات",
                placeholder: "أي متطلبات أو ملاحظات إضافية تود إضافتها...",
                required: false,
              },
            ],
          },
        ],
        dynamicDataSources: {
          allCategories: "قائمة فئات العقارات من قاعدة البيانات",
          citiesList: "قائمة المدن من قاعدة البيانات",
          districtsByCity: "قائمة الأحياء حسب المدينة المحددة",
        },
        formBehavior: {
          cityDistrictDependency: {
            enabled: true,
            cityField: "city_id",
            districtField: "districts_id",
            apiEndpoint: "/geo/districts/by-city",
          },
          radioButtonBehavior: {
            customStyling: true,
            clickHandler: "data-radio attribute",
          },
          formValidation: {
            realTimeValidation: true,
            errorStyling: "shake animation",
            requiredFieldHighlighting: true,
          },
        },
        styling: {
          formContainer: {
            maxWidth: "800px",
            margin: "0 auto",
            padding: "40px 30px",
          },
          cardSpacing: {
            marginBottom: "40px",
            padding: "30px",
            borderRadius: "15px",
            border: "1px solid #e1e8ff",
            backgroundColor: "#f8fafc",
          },
          inputSpacing: {
            marginBottom: "20px",
          },
          buttonStyle: {
            backgroundColor: "#059669",
            textColor: "#ffffff",
            padding: "15px 40px",
            borderRadius: "50px",
            fontSize: "1.1rem",
            fontWeight: "600",
          },
        },
        useStore: true,
        variant: "application-form",
        deviceType: "laptop",
      },
      position: 1,
    },
    "inputs2-default": {
      type: "inputs2",
      name: "Advanced Inputs System 2",
      componentName: "inputs2",
      data: {
        visible: true,
        texts: {
          title: "Advanced Inputs System Title",
          subtitle: "This is a sample subtitle for the section.",
        },
        colors: {
          background: "#FFFFFF",
          textColor: "#1F2937",
        },
        settings: {
          enabled: true,
          layout: "default",
        },
        layout: {
          direction: "rtl",
          maxWidth: "1600px",
          padding: {
            y: "py-14",
            smY: "sm:py-16",
          },
          columns: "1",
        },
        theme: {
          primaryColor: "#3b82f6",
          secondaryColor: "#1e40af",
          accentColor: "#60a5fa",
          submitButtonGradient:
            "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        },
        submitButton: {
          text: "إرسال",
          show: true,
          className: "max-w-[50%]",
          backgroundColor: "#059669",
          textColor: "#ffffff",
          hoverColor: "#067a55",
          borderRadius: "8px",
          padding: "12px 24px",
          apiEndpoint: "https://taearif.com/api/v1/property-requests/public",
        },
        cardsLayout: {
          columns: "1",
          gap: "24px",
          responsive: {
            mobile: "1",
            tablet: "2",
            desktop: "3",
          },
        },
        fieldsLayout: {
          columns: "2",
          gap: "16px",
          responsive: {
            mobile: "1",
            tablet: "2",
            desktop: "3",
          },
        },
        cards: [
          {
            title: "معلومات العقار المطلوب",
            description: null,
            icon: [],
            color: "green",
            customColors: [],
            isCollapsible: false,
            showAddButton: false,
            addButtonText: null,
            fields: [
              {
                label: "نوع العقار",
                placeholder: "نوع العقار",
                description: "نوع العقار",
                required: true,
                type: "select",
                options: [
                  {
                    value: "14",
                    label: "آخرى",
                  },
                  {
                    value: "4",
                    label: "أرض",
                  },
                  {
                    value: "7",
                    label: "استراحة",
                  },
                  {
                    value: "13",
                    label: "دور في فيلا",
                  },
                  {
                    value: "18",
                    label: "شقة",
                  },
                  {
                    value: "2",
                    label: "شقة في برج",
                  },
                  {
                    value: "3",
                    label: "شقة في عمارة",
                  },
                  {
                    value: "17",
                    label: "شقة في فيلا",
                  },
                  {
                    value: "15",
                    label: "عمارة",
                  },
                  {
                    value: "1",
                    label: "فيلا",
                  },
                  {
                    value: "5",
                    label: "قصر",
                  },
                  {
                    value: "12",
                    label: "مبنى",
                  },
                  {
                    value: "8",
                    label: "محل تجاري",
                  },
                  {
                    value: "6",
                    label: "مزرعة",
                  },
                  {
                    value: "11",
                    label: "معرض",
                  },
                  {
                    value: "9",
                    label: "مكتب",
                  },
                  {
                    value: "10",
                    label: "منتجع",
                  },
                ],
                validation: null,
                icon: null,
                id: "property_type",
              },
              {
                label: "نوع الملكية",
                placeholder: "نوع الملكية",
                description: null,
                required: false,
                type: "radio",
                options: [
                  {
                    value: "زراعي",
                    label: "زراعي",
                  },
                  {
                    value: "صناعي",
                    label: "صناعي",
                  },
                  {
                    value: "تجاري",
                    label: "تجاري",
                  },
                  {
                    value: "سكني",
                    label: "سكني",
                  },
                ],
                validation: null,
                icon: null,
                id: "category",
              },
              {
                id: "region",
                type: "select",
                label: "المدينة",
                placeholder: "المدينة",
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "districts_id",
                type: "select",
                label: "الحي",
                placeholder: "الحي",
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "area_from",
                type: null,
                label: "المساحة من",
                placeholder: null,
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "area_to",
                type: null,
                label: "المساحة إلى",
                placeholder: "المساحة إلى",
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
            ],
          },
          {
            id: "معلومات الميزانية والدفع",
            title: "معلومات الميزانية والدفع",
            description: null,
            icon: null,
            color: "green",
            customColors: [],
            isCollapsible: false,
            showAddButton: false,
            addButtonText: "إضافة جديد",
            fields: [
              {
                id: "purchase_method",
                type: "radio",
                label: "طريقة الشراء",
                placeholder: "طريقة الشراء",
                required: false,
                description: null,
                icon: null,
                options: [
                  {
                    value: "كاش",
                    label: "كاش",
                  },
                  {
                    value: "تمويل بنكي",
                    label: "تمويل بنكي",
                  },
                ],
                validation: null,
              },
              {
                id: "budget_from",
                type: null,
                label: "الميزانية من",
                placeholder: "الميزانية من",
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "budget_to",
                type: null,
                label: "الميزانية إلى",
                placeholder: "الميزانية إلى",
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
            ],
          },
          {
            id: "تفاصيل إضافية",
            title: "تفاصيل إضافية",
            description: "تفاصيل إضافية",
            icon: null,
            color: "green",
            customColors: [],
            isCollapsible: false,
            showAddButton: false,
            addButtonText: "إضافة جديد",
            fields: [
              {
                id: "seriousness",
                type: "radio",
                label: "الجدية",
                placeholder: "الجدية",
                required: false,
                description: null,
                icon: null,
                options: [
                  {
                    value: "مستعد فورًا",
                    label: "مستعد فورًا",
                  },
                  {
                    value: "خلال شهر",
                    label: "خلال شهر",
                  },
                  {
                    value: "خلال 3 أشهر",
                    label: "خلال 3 أشهر",
                  },
                  {
                    value: "لاحقًا / استكشاف فقط",
                    label: "لاحقًا / استكشاف فقط",
                  },
                ],
                validation: null,
              },
              {
                id: "purchase_goal",
                type: "radio",
                label: "هدف الشراء",
                placeholder: null,
                required: false,
                description: null,
                icon: null,
                options: [
                  {
                    value: "سكن خاص",
                    label: "سكن خاص",
                  },
                  {
                    value: "استثمار وتأجير",
                    label: "استثمار وتأجير",
                  },
                  {
                    value: "بناء وبيع",
                    label: "بناء وبيع",
                  },
                  {
                    value: "مشروع تجاري",
                    label: "مشروع تجاري",
                  },
                ],
                validation: null,
              },
              {
                id: "wants_similar_offers",
                type: "radio",
                label: "يريد عروض مشابهة",
                placeholder: "يريد عروض مشابهة",
                required: false,
                description: null,
                icon: null,
                options: [
                  {
                    value: "نعم",
                    label: "نعم",
                  },
                  {
                    value: "لا",
                    label: "لا",
                  },
                ],
                validation: null,
              },
            ],
          },
          {
            id: "بيانات التواصل",
            title: "بيانات التواصل",
            description: "بيانات التواصل",
            icon: null,
            color: "green",
            customColors: [],
            isCollapsible: false,
            showAddButton: false,
            addButtonText: "إضافة جديد",
            fields: [
              {
                id: "full_name",
                type: null,
                label: "الاسم الكامل",
                placeholder: null,
                required: true,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "phone",
                type: null,
                label: "رقم الهاتف",
                placeholder: "رقم الهاتف",
                required: true,
                description: "رقم الهاتف",
                icon: null,
                options: null,
                validation: null,
              },
              {
                id: "contact_on_whatsapp",
                type: "radio",
                label: "التواصل عبر واتساب",
                placeholder: null,
                required: false,
                description: null,
                icon: null,
                options: [
                  {
                    value: "نعم",
                    label: "نعم",
                  },
                  {
                    value: "لا",
                    label: "لا",
                  },
                ],
                validation: null,
              },
              {
                id: "notes",
                type: "textarea",
                label: "ملاحظات",
                placeholder: null,
                required: false,
                description: null,
                icon: null,
                options: null,
                validation: null,
              },
            ],
          },
        ],
      },
      position: 2,
    },
  },
};

// Export للتوافق مع الكود القديم
export const defaultComponents = PAGE_DEFINITIONS;
