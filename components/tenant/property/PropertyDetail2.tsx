"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultPropertyDetail2Data } from "@/context-liveeditor/editorStoreFunctions/propertyDetailFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface PropertyDetail2Props {
  // Component-specific props
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
    gap?: string;
  };
  styling?: {
    backgroundColor?: string;
    primaryColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    formBackgroundColor?: string;
    formTextColor?: string;
    formButtonBackgroundColor?: string;
    formButtonTextColor?: string;
  };
  content?: {
    descriptionTitle?: string;
    specsTitle?: string;
    contactFormTitle?: string;
    contactFormDescription?: string;
    submitButtonText?: string;
  };
  displaySettings?: {
    showDescription?: boolean;
    showSpecs?: boolean;
    showContactForm?: boolean;
    showVideoUrl?: boolean;
    showMap?: boolean;
  };
  hero?: {
    height?: string;
    overlayOpacity?: number;
  };
  gallery?: {
    showThumbnails?: boolean;
    thumbnailGridColumns?: number;
    thumbnailHeight?: string;
  };

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function PropertyDetail2(props: PropertyDetail2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "propertyDetail2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const propertyDetailStates = useEditorStore((s) => s.propertyDetailStates);

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

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "propertyDetail" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "propertyDetail" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPropertyDetail2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultPropertyDetail2Data(),
              ...props,
            };

      ensureComponentVariant("propertyDetail", uniqueId, initialData);
    }
  }, [
    uniqueId,
    props.useStore,
    ensureComponentVariant,
    tenantComponentData,
  ]);

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = propertyDetailStates[uniqueId];
  const currentStoreData = getComponentData("propertyDetail", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultPropertyDetail2Data(), // 1. Defaults (lowest priority)
    ...storeData, // 2. Store state
    ...currentStoreData, // 3. Current store data
    ...props, // 4. Props (highest priority)
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

  // جميع الصور المتاحة
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
      alt: "فيلا فاخرة في حي المحمدية",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2058&auto=format&fit=crop",
      alt: "صورة داخلية 1",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      alt: "صورة داخلية 2",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop",
      alt: "صورة داخلية 3",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop",
      alt: "صورة المسبح",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const primaryColor = mergedData.styling?.primaryColor || "#8b5f46";
  const textColor = mergedData.styling?.textColor || "#967152";
  const formBackgroundColor =
    mergedData.styling?.formBackgroundColor || "#8b5f46";
  const formTextColor = mergedData.styling?.formTextColor || "#ffffff";
  const formButtonBackgroundColor =
    mergedData.styling?.formButtonBackgroundColor || "#d4b996";
  const formButtonTextColor =
    mergedData.styling?.formButtonTextColor || "#7a5c43";

  return (
    <main className="w-full" dir="rtl">
      {/* BEGIN: Top Hero Image Section - Full Width */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: mergedData.hero?.height || "500px" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="صورة خلفية"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(54, 28, 22, ${mergedData.hero?.overlayOpacity || 0.8})`,
          }}
        />
      </section>

      {/* Overlay Text Top Right */}
      <div className="container mx-auto px-4 absolute top-[13rem] left-0 right-0">
        <div className="flex flex-row justify-between items-center" dir="rtl">
          <div className="text-white z-[10]">
            <h1
              className="font-bold drop-shadow-md text-right"
              style={{
                fontSize:
                  mergedData.typography?.title?.fontSize?.desktop || "4xl",
                fontWeight: mergedData.typography?.title?.fontWeight || "bold",
              }}
            >
              فيلا فاخرة في حي المحمدية - رياض
            </h1>
          </div>
          {/* Overlay Text Top Left */}
          <div className="z-[2]">
            <span
              className="text-white py-2 px-4 rounded font-bold text-xl"
              style={{ backgroundColor: primaryColor }}
            >
              3,500,000 ريال سعودي
            </span>
          </div>
        </div>
      </div>

      {/* BEGIN: Main Content Container */}
      <div
        className="container mx-auto px-4 pb-12 -mt-[12rem]"
        style={{ maxWidth: mergedData.layout?.maxWidth || "1280px" }}
      >
        {/* BEGIN: Hero Section */}
        <section
          className="relative rounded-lg overflow-hidden shadow-xl"
          data-purpose="property-hero"
        >
          {/* Main Featured Image */}
          <div className="relative h-[600px] w-full">
            <Image
              alt={selectedImage.alt}
              className="w-full h-full object-cover transition-opacity duration-300"
              src={selectedImage.src}
              fill
              priority
            />
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Gallery Thumbnails */}
        {mergedData.gallery?.showThumbnails !== false && (
          <section
            className="grid gap-4"
            data-purpose="image-gallery"
            style={{
              gridTemplateColumns: `repeat(${mergedData.gallery?.thumbnailGridColumns || 4}, 1fr)`,
            }}
          >
            {images.slice(1).map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative border-2 ${
                  selectedImage.id === image.id
                    ? "border-brand-gold shadow-lg scale-105"
                    : "border-transparent hover:scale-105"
                }`}
                style={{
                  height: mergedData.gallery?.thumbnailHeight || "200px",
                }}
              >
                <Image
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300"
                  src={image.src}
                  fill
                />
              </div>
            ))}
          </section>
        )}
        {/* END: Gallery Thumbnails */}

        {/* BEGIN: Property Description */}
        {mergedData.displaySettings?.showDescription !== false && (
          <section
            className="bg-transparent py-10 rounded-lg"
            data-purpose="description-block"
            dir="rtl"
          >
            <h2
              className="font-bold mb-6 text-right"
              style={{
                color: textColor,
                fontSize:
                  mergedData.typography?.title?.fontSize?.desktop || "3xl",
              }}
            >
              {mergedData.content?.descriptionTitle || "وصف العقار"}
            </h2>
            <p
              className="leading-relaxed text-right text-lg"
              style={{ color: textColor }}
            >
              فيلا فاخرة في حي المحمدية - الرياض. فيلا فاخرة في حي المحمدية -
              رياض، مصممة بأحدث المعايير الهندسية والفنية المبتكرة، وتتكون من
              العديد من المرافق والخدمات الراقية التي تناسب أصحاب الذوق الرفيع.
              تتميز الفيلا بموقع استراتيجي قريب من جميع الخدمات الحيوية والطرق
              الرئيسية. تحتوي الفيلا على مساحات واسعة وتشطيبات سوبر ديلوكس، مع
              نظام تكييف مركزي وأنظمة أمان متطورة. الحديقة الخارجية مصممة بعناية
              لتوفير جو من الهدوء والخصوصية، مع مسبح خاص يضيف لمسة من الرفاهية.
              هذه الفرصة المثالية لمن يبحث عن السكن الراقي والاستثمار الناجح في
              أرقى أحياء الرياض.
            </p>
          </section>
        )}
        {/* END: Property Description */}

        {/* BEGIN: Main Grid Layout (Specs & Video / Map & Form) */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          style={{ gap: mergedData.layout?.gap || "3rem" }}
        >
          {/* Right Column: Specs & Form */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Specs Section */}
            {mergedData.displaySettings?.showSpecs !== false && (
              <section className="bg-transparent" data-purpose="property-specs">
                <h2
                  className="font-bold mb-8 text-right"
                  style={{
                    color: textColor,
                    fontSize:
                      mergedData.typography?.title?.fontSize?.desktop || "3xl",
                  }}
                >
                  {mergedData.content?.specsTitle || "مواصفات العقار"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                  {/* Spec Items - Same as before */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3" style={{ color: textColor }}>
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </div>
                    <span
                      className="font-bold text-lg"
                      style={{ color: textColor }}
                    >
                      غرف النوم: 5
                    </span>
                  </div>
                  {/* Add more spec items as needed */}
                </div>
              </section>
            )}

            {/* Contact Form */}
            {mergedData.displaySettings?.showContactForm !== false && (
              <section
                className="text-white p-8 rounded-lg h-fit"
                data-purpose="contact-form"
                style={{
                  backgroundColor: formBackgroundColor,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  className="text-2xl font-extrabold mb-2 text-right"
                  style={{ color: formTextColor }}
                >
                  {mergedData.content?.contactFormTitle ||
                    "استفسر عن هذا العقار"}
                </h2>
                <p
                  className="text-sm mb-6 text-right"
                  style={{ color: formTextColor, opacity: 0.8 }}
                >
                  {mergedData.content?.contactFormDescription ||
                    "استفسر عن المنزل واملأ البيانات لهذا العقار"}
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="اسم العميل"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="رقم الهاتف"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                        placeholder="البريد الإلكتروني"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <textarea
                      className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 focus:ring-brand-gold outline-none"
                      placeholder="الرسالة"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <button
                    className="w-full font-bold py-3 rounded transition-colors shadow-md text-lg"
                    type="submit"
                    style={{
                      backgroundColor: formButtonBackgroundColor,
                      color: formButtonTextColor,
                    }}
                  >
                    {mergedData.content?.submitButtonText || "أرسل استفسارك"}
                  </button>
                </form>
              </section>
            )}
          </div>
          {/* END Right Column */}

          {/* Left Column: Video & Map */}
          <div className="space-y-12 order-1 lg:order-2">
            {/* Video Placeholder */}
            {mergedData.displaySettings?.showVideoUrl !== false && (
              <section
                className="rounded-lg overflow-hidden shadow-md bg-black relative group h-64"
                data-purpose="video-section"
              >
                <div className="relative w-full h-full">
                  <Image
                    alt="جولة فيديو"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
                    fill
                  />
                </div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="bg-black/60 p-4 rounded-full border-2 border-white/70 cursor-pointer group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${primaryColor}80` }}
                  >
                    <svg
                      className="h-10 w-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </div>
                </div>
                <div
                  className="absolute top-4 right-4 text-white px-4 py-2 rounded text-sm font-bold text-right"
                  style={{ backgroundColor: primaryColor }}
                >
                  جولة فيديو للمقار
                </div>
              </section>
            )}

            {/* Map Placeholder */}
            {mergedData.displaySettings?.showMap !== false && (
              <section
                className="rounded-lg overflow-hidden shadow-md border-4 border-white h-[550px] relative"
                data-purpose="map-section"
              >
                <Image
                  alt="خريطة الموقع"
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
                  fill
                />
              </section>
            )}
          </div>
          {/* END Left Column */}
        </div>
        {/* END: Main Grid Layout */}
      </div>
      {/* END: Main Content Container */}
    </main>
  );
}
