"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

// Form validation schema
const contactFormSchema = z.object({
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  whatsappNumber: z.string().min(1, "رقم الواتساب مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  paymentMethod: z.string().min(1, "طريقة الدفع مطلوبة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  unitType: z.string().min(1, "نوع الوحدة مطلوب"),
  budget: z.string().min(1, "الميزانية مطلوبة"),
  message: z.string().min(1, "محتوى الرسالة مطلوب"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactUsHomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const paymentMethod = watch("paymentMethod");
  const city = watch("city");
  const unitType = watch("unitType");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement form submission logic
      console.log("Form data:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("تم إرسال النموذج بنجاح!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال النموذج");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Form Container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="relative rounded-lg p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Background Image for Card */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://baheya.co/wp-content/uploads/2025/09/Screenshot-2025-09-21-005950.png"
              alt="خلفية"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(139, 95, 70, 0.8)" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header Text */}
            <div className="text-center mb-8">
              <p className="text-white text-lg md:text-xl leading-relaxed">
                سنعثر لك على مستأجر موثوق ونتولى إدارة عملية الإيجار بالكامل بكل
                احترافية.
                <br />
                نضمن لك مستأجرًا موثوقًا ونتكفّل بجميع خطوات التأجير نيابةً عنك.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Column */}
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-white font-medium text-base"
                    >
                      الاسم الكامل
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="الاسم الكامل"
                      className="bg-[#f5f0e8] border-[#c4b5a0] text-white placeholder:text-[#8b7a6a] focus:ring-[#8b5f46] h-12"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-red-600 text-sm">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-white font-medium text-base"
                    >
                      البريد الالكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="البريد الالكتروني"
                      className="bg-[#f5f0e8] border-[#c4b5a0] text-white placeholder:text-[#8b7a6a] focus:ring-[#8b5f46] h-12"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-white font-medium text-base"
                    >
                      المدينة
                    </Label>
                    <Select
                      value={city}
                      onValueChange={(value) => setValue("city", value)}
                    >
                      <SelectTrigger
                        dir="rtl"
                        id="city"
                        className="bg-[#f5f0e8] border-[#c4b5a0] text-white focus:ring-[#8b5f46] h-12 text-[#896042]"
                      >
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="الرياض">الرياض</SelectItem>
                        <SelectItem value="جدة">جدة</SelectItem>
                        <SelectItem value="مكة المكرمة">مكة المكرمة</SelectItem>
                        <SelectItem value="المدينة المنورة">
                          المدينة المنورة
                        </SelectItem>
                        <SelectItem value="الدمام">الدمام</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <p className="text-red-600 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="budget"
                      className="text-white font-medium text-base"
                    >
                      الميزانية
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="الميزانية"
                      className="bg-[#f5f0e8] border-[#c4b5a0] text-white placeholder:text-[#8b7a6a] focus:ring-[#8b5f46] h-12"
                      {...register("budget")}
                    />
                    {errors.budget && (
                      <p className="text-red-600 text-sm">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Left Column */}
                <div className="space-y-6">
                  {/* WhatsApp Number */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="whatsappNumber"
                      className="text-white font-medium text-base"
                    >
                      رقم الواتساب
                    </Label>
                    <Input
                      id="whatsappNumber"
                      type="tel"
                      placeholder="رقم الواتساب"
                      className="bg-[#f5f0e8] border-[#c4b5a0] text-white placeholder:text-[#8b7a6a] focus:ring-[#8b5f46] h-12"
                      {...register("whatsappNumber")}
                    />
                    {errors.whatsappNumber && (
                      <p className="text-red-600 text-sm">
                        {errors.whatsappNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="paymentMethod"
                      className="text-white font-medium text-base"
                    >
                      طريقة الدفع
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setValue("paymentMethod", value)
                      }
                    >
                      <SelectTrigger
                        dir="rtl"
                        id="paymentMethod"
                        className="bg-[#f5f0e8] border-[#c4b5a0] text-white focus:ring-[#8b5f46] h-12 text-[#896042]"
                      >
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="بنك مدعوم">بنك مدعوم</SelectItem>
                        <SelectItem value="بنك غير مدعوم">
                          بنك غير مدعوم
                        </SelectItem>
                        <SelectItem value="كاش">كاش</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-red-600 text-sm">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="unitType"
                      className="text-white font-medium text-base"
                    >
                      نوع الوحدة
                    </Label>
                    <Select
                      value={unitType}
                      onValueChange={(value) => setValue("unitType", value)}
                    >
                      <SelectTrigger
                        id="unitType"
                        dir="rtl"
                        className="bg-[#f5f0e8] border-[#c4b5a0] text-white focus:ring-[#8b5f46] h-12 text-[#896042]"
                      >
                        <SelectValue placeholder="اختر نوع الوحدة" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="أدوار">أدوار</SelectItem>
                        <SelectItem value="بنتهاوس">بنتهاوس</SelectItem>
                        <SelectItem value="تاون هاوس">تاون هاوس</SelectItem>
                        <SelectItem value="شقق">شقق</SelectItem>
                        <SelectItem value="فيلا">فيلا</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.unitType && (
                      <p className="text-red-600 text-sm">
                        {errors.unitType.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content - Full Width */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-white font-medium text-base"
                >
                  محتوى الرسالة
                </Label>
                <Textarea
                  id="message"
                  placeholder="محتوى الرسالة"
                  rows={4}
                  className="bg-[#f5f0e8] border-[#c4b5a0] text-white placeholder:text-[#8b7a6a] focus:ring-[#8b5f46] resize-none"
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-red-600 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#c9a882] hover:bg-[#b8966f] text-white font-medium px-12 py-4 rounded-lg transition-colors duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                >
                  {isSubmitting ? "جاري الإرسال..." : "اشترك الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
