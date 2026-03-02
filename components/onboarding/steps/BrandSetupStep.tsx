"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorPicker from "@/components/color-picker";
import { saveBrandSettings } from "@/lib/mock/onboarding-api";
import { useOnboardingStore } from "@/store/onboarding";
import toast from "react-hot-toast";

const PRESET_PALETTES = [
  { label: "أخضر الغابة", primary: "#1A3C34", secondary: "#4CAF82", accent: "#5BC4C0" },
  { label: "أزرق المحيط", primary: "#1E3A5F", secondary: "#4A90A4", accent: "#7DD3FC" },
  { label: "بنفسجي ملكي", primary: "#4C1D95", secondary: "#8B5CF6", accent: "#C4B5FD" },
  { label: "برتقالي دافئ", primary: "#7C2D12", secondary: "#E07A3A", accent: "#FCA5A5" },
  { label: "رمادي أنيق", primary: "#1F2937", secondary: "#6B7280", accent: "#D1D5DB" },
];

interface BrandSetupStepProps {
  onNext: () => void;
}

export function BrandSetupStep({ onNext }: BrandSetupStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const stepData = steps.find((s) => s.id === "brand")?.data ?? {};

  const [websiteName, setWebsiteName] = useState(stepData.websiteName ?? "");
  const [logoBase64, setLogoBase64] = useState<string | null>(stepData.logoBase64 ?? null);
  const [primaryColor, setPrimaryColor] = useState(stepData.primaryColor ?? "#1A3C34");
  const [secondaryColor, setSecondaryColor] = useState(stepData.secondaryColor ?? "#4CAF82");
  const [accentColor, setAccentColor] = useState(stepData.accentColor ?? "#5BC4C0");
  const [saving, setSaving] = useState(false);
  const [showColorPickers, setShowColorPickers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setLogoBase64(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePreset = (preset: (typeof PRESET_PALETTES)[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setAccentColor(preset.accent);
  };

  const handleSave = async () => {
    if (!websiteName.trim()) {
      toast.error("يرجى إدخال اسم الموقع");
      return;
    }
    setSaving(true);
    try {
      await saveBrandSettings({
        websiteName,
        logoBase64: logoBase64 ?? undefined,
        primaryColor,
        secondaryColor,
        accentColor,
      });
      markStepCompleted("brand", {
        websiteName,
        logoBase64: logoBase64 ?? undefined,
        logoUrl: logoBase64 ?? undefined,
        primaryColor,
        secondaryColor,
        accentColor,
      });
      toast.success("تم حفظ هوية الموقع!");
      onNext();
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    skipStep("brand");
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2" style={{ background: "#E8F5EF" }}>
          🏷️
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">هوية موقعك</h2>
        <p className="text-sm text-[#6B7280]">اختر اسم الموقع وشعاره وألوانه</p>
      </div>

      {/* Website Name */}
      <div className="space-y-2">
        <Label htmlFor="website-name" className="text-sm font-semibold text-[#1A1A1A]">
          اسم الموقع <span className="text-red-500">*</span>
        </Label>
        <Input
          id="website-name"
          placeholder="مثال: مكتب الأفق للعقارات"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          className="h-12 text-base rounded-xl border-[#E5E7EB] focus:border-[#1A3C34] focus:ring-[#1A3C34]"
          dir="rtl"
        />
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-[#1A1A1A]">شعار الموقع</Label>
        <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />

        {!logoBase64 ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:border-[#1A3C34] hover:bg-[#E8F5EF]/50"
            style={{ borderColor: "#E5E7EB" }}
          >
            <Upload className="w-7 h-7 text-[#9CA3AF]" />
            <span className="text-sm text-[#9CA3AF]">انقر لرفع الشعار</span>
            <span className="text-xs text-[#9CA3AF]">PNG، JPG (موصى به: 200×200 بكسل)</span>
          </button>
        ) : (
          <div className="flex items-center gap-4 p-3 rounded-xl border border-[#E5E7EB] bg-[#F4F5F7]">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E5E7EB] bg-white flex-shrink-0">
              <Image src={logoBase64} alt="الشعار" fill className="object-contain p-1" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1A1A1A]">تم رفع الشعار</p>
              <p className="text-xs text-[#6B7280]">يمكنك تغييره أو حذفه</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-lg text-xs h-8">
                تغيير
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setLogoBase64(null)} className="rounded-lg text-xs h-8 text-red-500 hover:text-red-600">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Brand Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-[#1A1A1A]">ألوان الموقع</Label>
          <button
            type="button"
            onClick={() => setShowColorPickers(!showColorPickers)}
            className="flex items-center gap-1 text-xs text-[#4CAF82] font-medium hover:text-[#1A3C34] transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            {showColorPickers ? "إخفاء" : "تخصيص"}
          </button>
        </div>

        {/* Preset palettes */}
        <div className="grid grid-cols-5 gap-2">
          {PRESET_PALETTES.map((preset) => {
            const isSelected = preset.primary === primaryColor;
            return (
              <button
                key={preset.primary}
                type="button"
                onClick={() => handlePreset(preset)}
                title={preset.label}
                className={`rounded-xl p-2 border-2 transition-all ${isSelected ? "border-[#1A3C34] scale-105 shadow-md" : "border-transparent hover:border-[#E5E7EB]"}`}
              >
                <div className="flex gap-0.5 justify-center">
                  <div className="w-4 h-6 rounded-r-sm" style={{ background: preset.primary }} />
                  <div className="w-4 h-6" style={{ background: preset.secondary }} />
                  <div className="w-4 h-6 rounded-l-sm" style={{ background: preset.accent }} />
                </div>
                <p className="text-[9px] text-[#6B7280] text-center mt-1 leading-tight">{preset.label}</p>
              </button>
            );
          })}
        </div>

        {/* Custom color pickers */}
        {showColorPickers && (
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#E5E7EB]">
            <ColorPicker color={primaryColor} onChange={setPrimaryColor} label="الرئيسي" />
            <ColorPicker color={secondaryColor} onChange={setSecondaryColor} label="الثانوي" />
            <ColorPicker color={accentColor} onChange={setAccentColor} label="التأكيد" />
          </div>
        )}

        {/* Live preview */}
        <div
          className="rounded-xl p-4 flex items-center gap-3 mt-2"
          style={{ background: primaryColor + "15", border: `1.5px solid ${primaryColor}30` }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: primaryColor }}>
            {websiteName ? websiteName[0] : "م"}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: primaryColor }}>
              {websiteName || "اسم الموقع"}
            </p>
            <p className="text-xs" style={{ color: secondaryColor }}>معاينة الألوان</p>
          </div>
          <div className="mr-auto flex gap-1">
            <div className="w-6 h-6 rounded-full" style={{ background: primaryColor }} />
            <div className="w-6 h-6 rounded-full" style={{ background: secondaryColor }} />
            <div className="w-6 h-6 rounded-full" style={{ background: accentColor }} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
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
