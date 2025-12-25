"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useTenantId } from "@/hooks/useTenantId";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultProjectDetails2Data } from "@/context-liveeditor/editorStoreFunctions/projectDetailsFunctions";

interface Project {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  address?: string;
  developer?: string;
  units?: number;
  completionDate?: string;
  minPrice?: string;
  maxPrice?: string;
  price?: string;
  image?: string;
  images?: string[];
  floorplans?: string[];
  videoUrl?: string | null;
  amenities?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  specifications?: any[];
  types?: any[];
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  features?: string[];
}

interface ProjectDetails2Props {
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
    videoTourText?: string;
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

  // Required prop for fetching project data
  projectSlug: string;

  // Editor props
  variant?: string;
  useStore?: boolean;
  id?: string;
}

export default function ProjectDetails2(props: ProjectDetails2Props) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "projectDetails2";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore((s) => s.ensureComponentVariant);
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const projectDetailsStates = useEditorStore((s) => s.projectDetailsStates);

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
          component.type === "projectDetails" &&
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
              (component as any).type === "projectDetails" &&
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
              ...getDefaultProjectDetails2Data(),
              ...tenantComponentData,
              ...props,
            }
          : {
              ...getDefaultProjectDetails2Data(),
              ...props,
            };

      ensureComponentVariant("projectDetails", uniqueId, initialData);
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
  const storeData = projectDetailsStates[uniqueId];
  const currentStoreData = getComponentData("projectDetails", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultProjectDetails2Data(),
    ...storeData,
    ...currentStoreData,
    ...props,
  };

  // Get primary color
  const primaryColor =
    mergedData.styling?.primaryColor ||
    (tenantData?.WebsiteLayout?.branding?.colors?.primary &&
    tenantData.WebsiteLayout.branding.colors.primary.trim() !== ""
      ? tenantData.WebsiteLayout.branding.colors.primary
      : "#8b5f46");

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────

  // Project data state (from API)
  const [project, setProject] = useState<Project | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  // UI state
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Tenant ID hook
  const { tenantId: hookTenantId, isLoading: tenantLoading } = useTenantId();

  // جلب بيانات المشروع
  const fetchProject = async () => {
    try {
      setLoadingProject(true);
      setProjectError(null);

      const finalTenantId = hookTenantId || tenantId;
      if (!finalTenantId) {
        setLoadingProject(false);
        return;
      }

      const response = await axiosInstance.get(
        `/v1/tenant-website/${finalTenantId}/projects/${props.projectSlug}`,
      );

      if (response.data && response.data.project) {
        setProject(response.data.project);
      } else if (response.data) {
        setProject(response.data);
      } else {
        setProjectError("المشروع غير موجود");
      }
    } catch (error) {
      console.error("ProjectDetails2: Error fetching project:", error);
      setProjectError("حدث خطأ في تحميل بيانات المشروع");
    } finally {
      setLoadingProject(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // جلب بيانات المشروع عند تحميل المكون
  useEffect(() => {
    const finalTenantId = hookTenantId || tenantId;
    if (finalTenantId && props.projectSlug) {
      fetchProject();
    }
  }, [hookTenantId, tenantId, props.projectSlug]);

  // تحديث الصورة المختارة عند تحميل المشروع
  useEffect(() => {
    if (project?.image) {
      setSelectedImage(project.image);
    }
  }, [project]);

  // صور المشروع
  const projectImages =
    project && project.image
      ? [
          project.image,
          ...(project.images || []),
        ].filter((img) => img && img.trim() !== "")
      : [];

  // Show loading skeleton
  if (tenantLoading || loadingProject) {
    return (
      <main className="w-full" dir="rtl">
        <section
          className="relative w-full overflow-hidden"
          style={{ height: mergedData.hero?.height || "500px" }}
        >
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        </section>
        <div
          className="container mx-auto px-4 pb-12"
          style={{ maxWidth: mergedData.layout?.maxWidth }}
        >
          <div className="relative h-[600px] w-full bg-gray-200 rounded-lg animate-pulse mt-[-12rem]"></div>
        </div>
      </main>
    );
  }

  // Show error if no tenant ID
  if (!hookTenantId && !tenantId) {
    return (
      <main className="w-full" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-yellow-600 font-medium">
            لم يتم العثور على معرف الموقع
          </p>
        </div>
      </main>
    );
  }

  // Show error if project failed to load
  if (projectError || !project) {
    return (
      <main className="w-full" dir="rtl">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-red-600 font-medium">
            {projectError || "المشروع غير موجود"}
          </p>
          <button
            onClick={() => fetchProject()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full" dir="rtl">
      {/* BEGIN: Top Hero Image Section - Full Width */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: mergedData.hero?.height || "500px" }}
      >
        <Image
          src={project.image || "/placeholder.jpg"}
          alt={project.title || "صورة المشروع"}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: mergedData.hero?.overlayOpacity || 0.4,
          }}
        />

        {/* Overlay Text */}
        <div className="container mx-auto px-4 absolute top-[13rem] left-0 right-0">
          <div
            className="flex flex-row justify-between items-center"
            dir="rtl"
            style={{ maxWidth: mergedData.layout?.maxWidth }}
          >
            <div className="text-white z-[10]">
              <h1
                className="text-3xl md:text-4xl font-bold drop-shadow-md text-right"
                style={{
                  fontSize: mergedData.typography?.title?.fontSize?.desktop,
                  fontFamily: mergedData.typography?.title?.fontFamily,
                }}
              >
                {project.title}
              </h1>
            </div>
            {/* Price Badge */}
            {((project.minPrice &&
              project.minPrice.trim() !== "" &&
              parseFloat(project.minPrice) > 0) ||
              (project.maxPrice &&
                project.maxPrice.trim() !== "" &&
                parseFloat(project.maxPrice) > 0) ||
              (project.price && project.price.trim() !== "")) && (
              <div className="z-[2]">
                <span
                  className="text-white py-2 px-4 rounded font-bold text-xl"
                  style={{ backgroundColor: primaryColor }}
                >
                  {project.minPrice &&
                  project.maxPrice &&
                  parseFloat(project.minPrice) > 0 &&
                  parseFloat(project.maxPrice) > 0
                    ? `${project.minPrice} - ${project.maxPrice}`
                    : project.price
                      ? project.price
                      : project.minPrice && parseFloat(project.minPrice) > 0
                        ? project.minPrice
                        : project.maxPrice && parseFloat(project.maxPrice) > 0
                          ? project.maxPrice
                          : ""}{" "}
                  ريال سعودي
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BEGIN: Main Content Container */}
      <div
        className="container mx-auto px-4 pb-12 -mt-[12rem]"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        {/* BEGIN: Hero Section */}
        <section
          className="relative rounded-lg overflow-hidden shadow-xl"
          data-purpose="property-hero"
        >
          {/* Main Featured Image */}
          <div className="relative h-[600px] w-full">
            <Image
              alt={project.title || "صورة المشروع"}
              className="w-full h-full object-cover transition-opacity duration-300"
              src={selectedImage || project.image || "/placeholder.jpg"}
              fill
              priority
            />
          </div>
        </section>
        {/* END: Hero Section */}

        {/* BEGIN: Gallery Thumbnails */}
        {mergedData.gallery?.showThumbnails &&
          projectImages.length > 1 && (
            <section
              className={`grid grid-cols-2 md:grid-cols-${mergedData.gallery?.thumbnailGridColumns || 4} gap-4 mt-4`}
              data-purpose="image-gallery"
            >
              {projectImages.slice(1).map((imageSrc, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(imageSrc)}
                  className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer relative border-2 ${
                    selectedImage === imageSrc
                      ? "shadow-lg scale-105"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{
                    height: mergedData.gallery?.thumbnailHeight || "200px",
                    borderColor:
                      selectedImage === imageSrc ? primaryColor : "transparent",
                  }}
                >
                  <Image
                    alt={`${project.title} - صورة ${index + 2}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                    src={imageSrc}
                    fill
                  />
                </div>
              ))}
            </section>
          )}
        {/* END: Gallery Thumbnails */}

        {/* BEGIN: Property Description */}
        {mergedData.displaySettings?.showDescription && (
          <section
            className="bg-transparent p-10 rounded-lg"
            data-purpose="description-block"
            dir="rtl"
          >
            <h2
              className="text-3xl font-extrabold mb-6 text-right"
              style={{ color: mergedData.styling?.textColor || primaryColor }}
            >
              {mergedData.content?.descriptionTitle || "وصف العقار"}
            </h2>
            <p
              className="leading-relaxed text-right text-lg"
              style={{ color: mergedData.styling?.textColor }}
            >
              {project.description || "لا يوجد وصف متاح لهذا المشروع"}
            </p>
          </section>
        )}
        {/* END: Property Description */}

        {/* BEGIN: Main Grid Layout (Specs & Video / Map & Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Right Column: Specs & Form */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Specs Section */}
            {mergedData.displaySettings?.showSpecs && (
              <section className="bg-transparent" data-purpose="property-specs">
                <h2
                  className="text-3xl font-extrabold mb-8 text-right"
                  style={{ color: mergedData.styling?.textColor || primaryColor }}
                >
                  {mergedData.content?.specsTitle || "مواصفات العقار"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                  {/* Developer */}
                  {project.developer && project.developer.trim() !== "" && (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: mergedData.styling?.textColor || primaryColor }}
                      >
                        المطور: {project.developer}
                      </span>
                    </div>
                  )}

                  {/* Units */}
                  {project.units && project.units > 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
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
                        style={{ color: mergedData.styling?.textColor || primaryColor }}
                      >
                        عدد الوحدات: {project.units}
                      </span>
                    </div>
                  )}

                  {/* Completion Date */}
                  {project.completionDate && project.completionDate.trim() !== "" && (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg"
                        style={{ color: mergedData.styling?.textColor || primaryColor }}
                      >
                        تاريخ التسليم:{" "}
                        {new Date(project.completionDate).toLocaleDateString("ar-US")}
                      </span>
                    </div>
                  )}

                  {/* Address */}
                  {project.address && project.address.trim() !== "" && (
                    <div className="flex flex-col items-center justify-center">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                          <path
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <span
                        className="font-bold text-lg text-center"
                        style={{ color: mergedData.styling?.textColor || primaryColor }}
                      >
                        {project.address}
                      </span>
                    </div>
                  )}

                  {/* Amenities */}
                  {project.amenities && project.amenities.length > 0 && (
                    <div className="flex flex-col items-center justify-center col-span-2 md:col-span-3">
                      <div style={{ color: primaryColor }} className="mb-3">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {project.amenities.slice(0, 6).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${primaryColor}20`,
                              color: mergedData.styling?.textColor || primaryColor,
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Contact Form */}
            {mergedData.displaySettings?.showContactForm && (
              <section
                className="text-white p-8 rounded-lg h-fit"
                data-purpose="contact-form"
                style={{
                  backgroundColor: mergedData.styling?.formBackgroundColor || primaryColor,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2
                  className="text-2xl font-extrabold mb-2 text-right"
                  style={{ color: mergedData.styling?.formTextColor || "#ffffff" }}
                >
                  {mergedData.content?.contactFormTitle || "استفسر عن هذا العقار"}
                </h2>
                <p
                  className="text-sm mb-6 text-right"
                  style={{
                    color: mergedData.styling?.formTextColor
                      ? `${mergedData.styling.formTextColor}CC`
                      : "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {mergedData.content?.contactFormDescription ||
                    "استفسر عن المنزل واملأ البيانات لهذا العقار"}
                </p>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Name */}
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={{
                          "--tw-ring-color": primaryColor,
                        } as React.CSSProperties}
                        placeholder="اسم العميل"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Phone */}
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={{
                          "--tw-ring-color": primaryColor,
                        } as React.CSSProperties}
                        placeholder="رقم الهاتف"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Email */}
                    <div>
                      <input
                        className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                        style={{
                          "--tw-ring-color": primaryColor,
                        } as React.CSSProperties}
                        placeholder="البريد الإلكتروني"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/* Message */}
                  <div>
                    <textarea
                      className="w-full bg-white text-gray-800 rounded px-4 py-3 border-none focus:ring-2 outline-none"
                      style={{
                        "--tw-ring-color": primaryColor,
                      } as React.CSSProperties}
                      placeholder="الرسالة"
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  {/* Submit Button */}
                  <button
                    className="w-full font-bold py-3 rounded transition-colors shadow-md text-lg"
                    style={{
                      backgroundColor:
                        mergedData.styling?.formButtonBackgroundColor || "#d4b996",
                      color: mergedData.styling?.formButtonTextColor || "#7a5c43",
                    }}
                    type="submit"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
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
            {mergedData.displaySettings?.showVideoUrl &&
              project.videoUrl &&
              project.videoUrl.trim() !== "" && (
                <section
                  className="rounded-lg overflow-hidden shadow-md bg-black relative group h-64"
                  data-purpose="video-section"
                >
                  <div className="relative w-full h-full">
                    <Image
                      alt="جولة فيديو"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                      src={project.image || "/placeholder.jpg"}
                      fill
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black/60 p-4 rounded-full border-2 border-white/70 cursor-pointer group-hover:scale-110 transition-transform"
                      style={{
                        borderColor: primaryColor,
                      }}
                    >
                      <svg
                        className="h-10 w-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 5v14l11-7z"></path>
                      </svg>
                    </a>
                  </div>
                  <div
                    className="absolute top-4 right-4 text-white px-4 py-2 rounded text-sm font-bold text-right"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {mergedData.content?.videoTourText || "جولة فيديو للمقار"}
                  </div>
                </section>
              )}

            {/* Map Placeholder */}
            {mergedData.displaySettings?.showMap &&
              project.location &&
              project.location.lat &&
              project.location.lng && (
                <section
                  className="rounded-lg overflow-hidden shadow-md border-4 border-white h-[550px] relative"
                  data-purpose="map-section"
                  style={{ borderColor: primaryColor }}
                >
                  <iframe
                    src={`https://maps.google.com/maps?q=${project.location.lat},${project.location.lng}&hl=ar&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="موقع المشروع"
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
