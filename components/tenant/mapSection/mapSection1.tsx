"use client";

import React from "react";

interface MapSectionProps {
  useStore?: boolean;
  variant?: string;
  id?: string;
  [key: string]: any;
}

const MapSection1: React.FC<MapSectionProps> = ({
  useStore = true,
  variant = "mapSection1",
  id,
  ...props
}) => {
  // Default data - always use these values
  const title = "تواصل معنا";
  const subtitle =
    "نرحب بجميع استفساراتكم واستعدادنا لتقديم المساعدة على مدار الساعة. إذا كان لديكم أي أسئلة حول خدماتنا أو ترغبون في حجز موعد، لا تترددوا في الاتصال بنا.";
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118991.6033066348!2d43.91428236250001!3d26.331491700000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e97523f269a8385%3A0xc66519139265f49e!2sAl%20Qassim%20Province%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1709605799797!5m2!1sen!2sus";

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>
      <p className="text-lg text-center text-gray-600 mb-8">{subtitle}</p>
      <div className="w-full max-w-[1600px] mx-auto">
        <iframe
          src={mapSrc}
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
};

export default MapSection1;
