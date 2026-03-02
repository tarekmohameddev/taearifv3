"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveContactInfo } from "@/lib/mock/onboarding-api";
import { useOnboardingStore } from "@/store/onboarding";
import toast from "react-hot-toast";

interface ContactInfoStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const CITIES = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام",
  "الخبر", "الطائف", "تبوك", "أبها", "القصيم",
];

const WORKING_HOURS_PRESETS = [
  "السبت - الخميس: 9 ص - 6 م",
  "السبت - الجمعة: 8 ص - 10 م",
  "يومياً: 9 ص - 9 م",
  "الأحد - الخميس: 8 ص - 5 م",
];

const FIELD_CONFIG = [
  {
    id: "phone",
    label: "رقم الجوال",
    placeholder: "05xxxxxxxx",
    type: "tel",
    icon: Phone,
    prefix: "+966",
    required: true,
  },
  {
    id: "email",
    label: "البريد الإلكتروني",
    placeholder: "info@yourcompany.sa",
    type: "email",
    icon: Mail,
    required: false,
  },
  {
    id: "address",
    label: "العنوان",
    placeholder: "مثال: حي العليا، شارع الملك فهد، الرياض",
    type: "text",
    icon: MapPin,
    required: false,
  },
  {
    id: "workingHours",
    label: "ساعات العمل",
    placeholder: "مثال: السبت - الخميس: 9 صباحاً - 6 مساءً",
    type: "text",
    icon: Clock,
    required: false,
  },
] as const;

export function ContactInfoStep({ onNext, onPrev }: ContactInfoStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const stepData = steps.find((s) => s.id === "contact")?.data ?? {};

  const [form, setForm] = useState({
    phone: stepData.phone ?? "",
    email: stepData.email ?? "",
    address: stepData.address ?? "",
    workingHours: stepData.workingHours ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  const setField = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.phone.trim()) {
      toast.error("يرجى إدخال رقم الجوال");
      return;
    }
    setSaving(true);
    try {
      await saveContactInfo({
        phone: form.phone,
        email: form.email,
        address: form.address,
        workingHours: form.workingHours,
      });
      markStepCompleted("contact", form);
      toast.success("تم حفظ بيانات التواصل!");
      onNext();
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    skipStep("contact");
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2" style={{ background: "#E8F5EF" }}>
          📞
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">بيانات التواصل</h2>
        <p className="text-sm text-[#6B7280]">أدخل معلومات التواصل لتظهر على موقعك</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {FIELD_CONFIG.map((field) => (
          <div key={field.id} className="space-y-1.5">
            <Label htmlFor={field.id} className="text-sm font-semibold text-[#1A1A1A]">
              {field.label}
              {field.required && <span className="text-red-500 mr-1">*</span>}
            </Label>
            <div className="relative">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                <field.icon className="w-4 h-4" />
              </div>
              {field.id === "phone" ? (
                <div className="flex gap-2">
                  <div className="flex items-center justify-center px-3 h-12 rounded-xl border border-[#E5E7EB] bg-[#F4F5F7] text-sm text-[#6B7280] font-medium flex-shrink-0">
                    🇸🇦 +966
                  </div>
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="flex-1 h-12 rounded-xl border-[#E5E7EB] pr-9 text-base"
                    dir="ltr"
                  />
                </div>
              ) : field.id === "workingHours" ? (
                <div className="space-y-2">
                  <Input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.id]}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="h-12 rounded-xl border-[#E5E7EB] pr-9 text-sm"
                    dir="rtl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="text-xs text-[#4CAF82] hover:text-[#1A3C34] font-medium transition-colors"
                  >
                    اختر من الأوقات الشائعة ▾
                  </button>
                  {showPresets && (
                    <div className="grid grid-cols-2 gap-1.5">
                      {WORKING_HOURS_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setField("workingHours", preset);
                            setShowPresets(false);
                          }}
                          className="text-right text-xs px-3 py-2 rounded-lg border border-[#E5E7EB] hover:border-[#4CAF82] hover:bg-[#E8F5EF] transition-colors text-[#374151]"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={form[field.id]}
                  onChange={(e) => setField(field.id, e.target.value)}
                  className="h-12 rounded-xl border-[#E5E7EB] pr-9 text-base"
                  dir={field.type === "email" ? "ltr" : "rtl"}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Preview card */}
      {(form.phone || form.address) && (
        <div className="rounded-xl p-4 bg-[#F4F5F7] border border-[#E5E7EB] space-y-2">
          <p className="text-xs font-semibold text-[#6B7280] mb-2">معاينة بيانات التواصل</p>
          {form.phone && (
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Phone className="w-3.5 h-3.5 text-[#4CAF82] flex-shrink-0" />
              <span dir="ltr">+966 {form.phone}</span>
            </div>
          )}
          {form.email && (
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Mail className="w-3.5 h-3.5 text-[#4CAF82] flex-shrink-0" />
              <span dir="ltr">{form.email}</span>
            </div>
          )}
          {form.address && (
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <MapPin className="w-3.5 h-3.5 text-[#4CAF82] flex-shrink-0" />
              <span>{form.address}</span>
            </div>
          )}
          {form.workingHours && (
            <div className="flex items-center gap-2 text-sm text-[#374151]">
              <Clock className="w-3.5 h-3.5 text-[#4CAF82] flex-shrink-0" />
              <span>{form.workingHours}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={saving}
          className="h-12 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
        >
          → السابق
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 h-12 rounded-[20px] text-white font-semibold text-sm"
          style={{ background: "#1A3C34" }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ والمتابعة ←"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSkip}
          disabled={saving}
          className="px-4 h-12 rounded-[20px] text-[#9CA3AF] hover:text-[#6B7280] text-sm"
        >
          تخطي
        </Button>
      </div>
    </div>
  );
}
