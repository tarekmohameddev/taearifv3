"use client";

import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

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
  // Default data - always use these values
  const title = "زوروا صفحتنا على";
  const socialLinks = [
    {
      href: "https://facebook.com",
      alt: "facebook",
      text: "مكتب دليل الجواء التلقائي",
      icon: { size: "24", color: "#1f2937" },
      textStyle: {
        size: "text-[14px] md:text-[16px]",
        color: "#1f2937",
        weight: "font-normal",
      },
    },
    {
      href: "https://x.com",
      alt: "x",
      text: "مكتب دليل الجواء التلقائي",
      icon: { size: "24", color: "#1f2937" },
      textStyle: {
        size: "text-[14px] md:text-[16px]",
        color: "#1f2937",
        weight: "font-normal",
      },
    },
    {
      href: "https://www.instagram.com/guide__aljiwa?igsh=MWY1amdsaGlhZm1xOA==",
      alt: "instagram",
      text: "مكتب دليل الجواء التلقائي",
      icon: { size: "24", color: "#1f2937" },
      textStyle: {
        size: "text-[14px] md:text-[16px]",
        color: "#1f2937",
        weight: "font-normal",
      },
    },
    {
      href: "https://linkedin.com",
      alt: "linkedin",
      text: "مكتب دليل الجواء التلقائي",
      icon: { size: "24", color: "#1f2937" },
      textStyle: {
        size: "text-[14px] md:text-[16px]",
        color: "#1f2937",
        weight: "font-normal",
      },
    },
    {
      href: "https://wa.me/966537120774",
      alt: "whatsapp",
      text: "مكتب دليل الجواء التلقائي",
      icon: { size: "24", color: "#1f2937" },
      textStyle: {
        size: "text-[14px] md:text-[16px]",
        color: "#1f2937",
        weight: "font-normal",
      },
    },
  ];

  return (
    <section
      className="container mx-auto px-4 py-8 lg:w-full sm:max-w-[1600px]"
      dir="rtl"
    >
      <div className="flex flex-col md:flex-row w-full justify-between gap-[16px]">
        <div className="details w-full md:w-[35%] flex flex-col items-start justify-center gap-[16px] md:gap-[10px]">
          <div className="flex flex-col gap-[2px]">
            <h4 className="text-[15px] md:text-[24px] text-custom-maincolor font-normal xs:text-[20px] mb-[24px]">
              {title}
            </h4>
            <div className=" flex flex-col items-start gap-[8px] md:gap-[24px] ">
              {socialLinks.map((link, index) => (
                <SocialLink key={index} {...link} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[50%]">
          <div className="Toastify"></div>
          <form className="flex flex-col gap-[12px] md:gap-[24px]">
            <input
              id="name"
              placeholder="أدخل اسمك"
              className="border rounded-[6px] p-2 outline-custom-secondarycolor"
              type="text"
              name="name"
            />
            <input
              id="email"
              placeholder="بريدك الإلكتروني"
              className="border rounded-[6px] p-2 outline-custom-secondarycolor"
              type="email"
              name="email"
            />
            <textarea
              name="message"
              id="message"
              rows={2}
              placeholder="رسالتك"
              className="border rounded p-2 mb-[12px] outline-custom-secondarycolor"
            ></textarea>
            <button
              type="submit"
              className="bg-custom-secondarycolor text-white rounded-[6px] w-full text-[14px] md:text-[20px] bg-emerald-700 hover:scale-105 transition duration-300 py-2 md:py-1"
            >
              إرسال
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection1;
