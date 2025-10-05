"use client";

import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import { getDefaultContactFormSectionData } from "@/context-liveeditor/editorStoreFunctions/contactFormSectionFunctions";

interface SocialLinkProps {
  href: string;
  alt: string;
  text: string;
  icon?: {
    size?: string;
    color?: string;
  };
  textStyle?: {
    size?: string;
    color?: string;
    weight?: string;
  };
}

const SocialLink: React.FC<SocialLinkProps> = ({
  href,
  alt,
  text,
  icon = { size: "24", color: "#1f2937" },
  textStyle = {
    size: "text-[14px] md:text-[16px]",
    color: "#1f2937",
    weight: "font-normal",
  },
}) => (
  <a href={href} target="_blank" className="flex items-center gap-x-[8px]">
    {alt === "facebook" && (
      <FaFacebook size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "x" && (
      <FaTwitter size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "instagram" && (
      <FaInstagram size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "linkedin" && (
      <FaLinkedinIn size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    {alt === "whatsapp" && (
      <FaWhatsapp size={parseInt(icon.size || "24")} color={icon.color} />
    )}
    <span
      className={`${textStyle.size} ${textStyle.color} ${textStyle.weight}`}
    >
      {text}
    </span>
  </a>
);

interface ContactFormSectionProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const ContactFormSection1: React.FC<ContactFormSectionProps> = ({
  useStore = true,
  variant = "contactFormSection1",
  id,
  ...props
}) => {
  // Initialize variant id early so hooks can depend on it
  const variantId = variant || "contactFormSection1";
  const uniqueId = id || variantId;
  
  // Add state to force re-renders when store updates
  const [forceUpdate, setForceUpdate] = useState(0);

  // Subscribe to editor store updates for this contactFormSection variant
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const contactFormSectionStates = useEditorStore((s) => s.contactFormSectionStates);

  useEffect(() => {
    if (props.useStore) {
      const initialData = {
        ...getDefaultContactFormSectionData(),
        ...props,
      };
      ensureComponentVariant("contactFormSection", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant]);

  // Add effect to listen for store updates
  useEffect(() => {
    if (props.useStore) {
      // Force re-render when store data changes
      const unsubscribe = useEditorStore.subscribe((state) => {
        const newContactFormSectionStates = state.contactFormSectionStates;
        console.log('🔄 ContactFormSection Store subscription triggered:', {
          uniqueId,
          newContactFormSectionStates,
          hasData: !!newContactFormSectionStates[uniqueId],
          allKeys: Object.keys(newContactFormSectionStates)
        });
        if (newContactFormSectionStates[uniqueId]) {
          console.log('🔄 ContactFormSection Store subscription triggered for:', uniqueId, newContactFormSectionStates[uniqueId]);
          // Force re-render by updating state
          setForceUpdate(prev => prev + 1);
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
    ? getComponentData("contactFormSection", uniqueId) || {}
    : {};
  const currentStoreData = props.useStore
    ? contactFormSectionStates[uniqueId] || {}
    : {};

  // Debug: Log when data changes
  useEffect(() => {
    if (props.useStore) {
      console.log('🔄 ContactFormSection Data Updated:', {
        uniqueId,
        storeData,
        currentStoreData,
        forceUpdate,
        contactFormSectionStates,
        allContactFormSectionStates: Object.keys(contactFormSectionStates),
        getComponentDataResult: getComponentData("contactFormSection", uniqueId)
      });
    }
  }, [storeData, currentStoreData, forceUpdate, props.useStore, uniqueId, contactFormSectionStates, getComponentData]);

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
            (component as any).type === "contactFormSection" &&
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
  const hasApiData = tenantComponentData && Object.keys(tenantComponentData).length > 0;
  const hasStoreData = (storeData && Object.keys(storeData).length > 0) || (currentStoreData && Object.keys(currentStoreData).length > 0);
  const hasPropsData = props.content || props.form;

  // Merge data with priority: currentStoreData > storeData > tenantComponentData > props > default
  const defaultData = getDefaultContactFormSectionData();
  const mergedData = {
    ...defaultData,
    ...props,
    ...tenantComponentData,
    ...storeData,
    ...currentStoreData,
    // Ensure nested objects are properly merged
    content: {
      ...defaultData.content,
      ...(props.content || {}),
      ...(tenantComponentData?.content || {}),
      ...(storeData?.content || {}),
      ...(currentStoreData?.content || {}),
    },
    form: {
      ...defaultData.form,
      ...(props.form || {}),
      ...(tenantComponentData?.form || {}),
      ...(storeData?.form || {}),
      ...(currentStoreData?.form || {}),
    },
    layout: {
      ...defaultData.layout,
      ...(props.layout || {}),
      ...(tenantComponentData?.layout || {}),
      ...(storeData?.layout || {}),
      ...(currentStoreData?.layout || {}),
    },
    styling: {
      ...defaultData.styling,
      ...(props.styling || {}),
      ...(tenantComponentData?.styling || {}),
      ...(storeData?.styling || {}),
      ...(currentStoreData?.styling || {}),
    },
  };

  // Debug: Log the final merged data
  console.log('🔍 ContactFormSection Final Merge:', {
    uniqueId,
    currentStoreData,
    storeData,
    mergedData,
    contentTitle: mergedData.content?.title,
    socialLinksCount: mergedData.content?.socialLinks?.length || 0,
    formFieldsCount: mergedData.form?.fields?.length || 0,
    contactFormSectionStatesKeys: Object.keys(contactFormSectionStates),
    getComponentDataResult: getComponentData("contactFormSection", uniqueId)
  });

  // Don't render if not visible
  if (!mergedData.visible) {
    return null;
  }

  // Use merged data with proper fallbacks
  const title = mergedData.content?.title || defaultData.content.title;
  const socialLinks = mergedData.content?.socialLinks || defaultData.content.socialLinks;
  const formFields = mergedData.form?.fields || defaultData.form.fields;
  const submitButton = mergedData.form?.submitButton || defaultData.form.submitButton;
  const layout = mergedData.layout || defaultData.layout;
  const styling = mergedData.styling || defaultData.styling;

  return (
    <section
      className={`container mx-auto ${layout?.container?.padding?.horizontal || "px-4"} ${layout?.container?.padding?.vertical || "py-8"} lg:w-full sm:max-w-[${layout?.container?.maxWidth || "1600px"}]`}
      dir="rtl"
    >
      <div className={`flex ${layout?.grid?.columns?.mobile || "flex-col"} ${layout?.grid?.columns?.desktop || "md:flex-row"} w-full justify-between ${layout?.grid?.gap || "gap-[16px]"}`}>
        <div className={`details ${styling?.layout?.detailsWidth || "w-full md:w-[35%]"} flex flex-col items-start justify-center ${styling?.layout?.gap || "gap-[16px] md:gap-[10px]"}`}>
          <div className="flex flex-col gap-[2px]">
            <h4 
              className={`${styling?.title?.size || "text-[15px] md:text-[24px]"} ${styling?.title?.color || "text-custom-maincolor"} ${styling?.title?.weight || "font-normal"} xs:text-[20px] mb-[24px]`}
            >
              {title}
            </h4>
            <div className="flex flex-col items-start gap-[8px] md:gap-[24px]">
              {socialLinks.map((link: any, index: number) => (
                <SocialLink key={index} {...link} />
              ))}
            </div>
          </div>
        </div>
        <div className={`${styling?.layout?.formWidth || "w-full md:w-[50%]"}`}>
          <div className="Toastify"></div>
          <form className="flex flex-col gap-[12px] md:gap-[24px]">
            {formFields.map((field: any, index: number) => {
              if (field.type === "textarea") {
                return (
                  <textarea
                    key={field.id || index}
                    id={field.id}
                    name={field.id}
                    rows={field.rows || 2}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={field.style?.className || "border rounded p-2 mb-[12px] outline-custom-secondarycolor"}
                  />
                );
              }
              return (
            <input
                  key={field.id || index}
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  className={field.style?.className || "border rounded-[6px] p-2 outline-custom-secondarycolor"}
                />
              );
            })}
            <button
              type="submit"
              className={submitButton.style?.className || "bg-custom-secondarycolor text-white rounded-[6px] w-full text-[14px] md:text-[20px] bg-emerald-700 hover:scale-105 transition duration-300 py-2 md:py-1"}
            >
              {submitButton.text || "إرسال"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection1;
