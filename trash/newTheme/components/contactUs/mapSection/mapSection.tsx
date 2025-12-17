"use client";

interface MapSectionProps {
  title?: string;
  mapUrl?: string;
}

export default function MapSection({
  title = "ويمكنك أيضا زيارتنا في أي وقت من خلال موقعنا على الخريطة اسفله",
  mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.771653476316!2d46.67541531500078!3d24.71321898413045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f0385e5e5e5e5%3A0x5e5e5e5e5e5e5e5!2sRiyadh%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
}: MapSectionProps) {
  return (
    <section className="w-full pt-12 md:pt-16">
      {/* Title */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-8 md:mb-12">
        <h3 className="text-xl md:text-2xl lg:text-2xl font-bold text-center text-[#8b5f46]">
          {title}
        </h3>
      </div>

      {/* Google Map - Full Width */}
      <div className="w-full h-[400px] ">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        />
      </div>
    </section>
  );
}
