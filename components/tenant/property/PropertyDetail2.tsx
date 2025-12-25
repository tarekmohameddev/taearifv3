"use client";
import Image from "next/image";
import { useState } from "react";

const PropertyDetails = () => {
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="w-full" dir="rtl">
      {/* BEGIN: Top Hero Image Section - Full Width */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="صورة خلفية"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </section>




      
      
       {/* Overlay Text Top Right */}
       <div className="container mx-auto px-4 absolute top-[13rem] left-0 right-0">
         <div className="flex flex-row justify-between items-center" dir="rtl">
           <div className="text-white z-[10]">
             <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md text-right">
               فيلا فاخرة في حي المحمدية - رياض
             </h1>
           </div>
           {/* Overlay Text Top Left */}
           <div className="z-[2]">
             <span className="bg-[#8b5f46] text-white py-2 px-4 rounded font-bold text-xl">
               3,500,000 ريال سعودي
             </span>
           </div>
         </div>
       </div>





      {/* BEGIN: Main Content Container */}
      <div className="container mx-auto px-4 pb-12 -mt-[12rem]">
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
        <section
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          data-purpose="image-gallery"
        >
          {images.slice(1).map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer h-[200px] relative border-2 ${
                selectedImage.id === image.id
                  ? "border-brand-gold shadow-lg scale-105"
                  : "border-transparent hover:scale-105"
              }`}
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
        {/* END: Gallery Thumbnails */}

        {/* BEGIN: Property Description */}
        <section
          className="bg-transparent p-10 rounded-lg"
          data-purpose="description-block"
          dir="rtl"
        >
          <h2 className="text-3xl font-bold text-[#967152] mb-6  text-right">
            وصف العقار
          </h2>
          <p className="text-[#967152] leading-relaxed text-right text-lg">
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
        {/* END: Property Description */}

        {/* BEGIN: Main Grid Layout (Specs & Video / Map & Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Right Column: Specs & Form */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Specs Section */}
            <section className="bg-transparent" data-purpose="property-specs">
              <h2 className="text-3xl font-bold text-[#967152] mb-8 text-right ">
                مواصفات العقار
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 text-center">
                {/* Spec Item: Bedrooms */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
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
                  <span className="text-[#967152] font-bold text-lg">
                    غرف النوم: 5
                  </span>
                </div>
                {/* Spec Item: Bathrooms */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
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
                  <span className="text-[#967152] font-bold text-lg">
                    الحمامات: 6
                  </span>
                </div>
                {/* Spec Item: Area */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[#967152] font-bold text-lg">
                    المساحة: 450 م²
                  </span>
                </div>
                {/* Spec Item: Parking */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[#967152] font-bold text-lg">
                    موقف سيارات: 3
                  </span>
                </div>
                {/* Spec Item: Age */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
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
                  <span className="text-[#967152] font-bold text-lg">
                    عمر العقار: جديد
                  </span>
                </div>
                {/* Spec Item: Pool */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[#967152] font-bold text-lg">
                    مسبح خاص
                  </span>
                </div>
                {/* Spec Item: Maid Room */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-[#967152] mb-3">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-[#967152] font-bold text-lg">
                    غرفة خادمة
                  </span>
                </div>
              </div>
            </section>
            {/* Contact Form */}
            <section
              className="bg-[#8b5f46] text-white p-8 rounded-lg h-fit"
              data-purpose="contact-form"
              style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
            >
              <h2 className="text-2xl font-bold mb-2 font-extrabold text-right">
                استفسر عن هذا العقار
              </h2>
              <p className="text-sm text-gray-200 mb-6 text-right">
                استفسر عن المنزل واملأ البيانات لهذا العقار
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  {/* Name */}
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
                  {/* Phone */}
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
                  {/* Email */}
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
                {/* Message */}
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
                {/* Submit Button */}
                <button
                  className="w-full bg-[#d4b996] hover:bg-[#c4a986] text-[#7a5c43] font-bold py-3 rounded transition-colors shadow-md text-lg"
                  type="submit"
                >
                  أرسل استفسارك
                </button>
              </form>
            </section>
          </div>
          {/* END Right Column */}
          {/* Left Column: Video & Map */}
          <div className="space-y-12 order-1 lg:order-2">
            {/* Video Placeholder */}
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
                <div className="bg-black/60 p-4 rounded-full border-2 border-white/70 cursor-pointer group-hover:scale-110 transition-transform hover:bg-brand-brown">
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
              <div className="absolute top-4 right-4 bg-brand-brown text-white px-4 py-2 rounded text-sm font-bold text-right">
                جولة فيديو للمقار
              </div>
            </section>
            {/* Map Placeholder */}
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
          </div>
          {/* END Left Column */}
        </div>
        {/* END: Main Grid Layout */}
      </div>
      {/* END: Main Content Container */}
    </main>
  );
};

export default PropertyDetails;
















