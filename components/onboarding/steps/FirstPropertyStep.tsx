"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboarding";
import { cn } from "@/lib/utils";

interface FirstPropertyStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function FirstPropertyStep({ onNext, onPrev }: FirstPropertyStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const stepData = steps.find((s) => s.id === "property")?.data ?? {};
  const isAlreadyCompleted = steps.find((s) => s.id === "property")?.completed ?? false;

  const [manuallyMarked, setManuallyMarked] = useState(isAlreadyCompleted);

  const handleMarkDone = () => {
    setManuallyMarked(true);
    markStepCompleted("property", { propertyType: "manually-confirmed" });
  };

  const handleSkip = () => {
    skipStep("property");
    onNext();
  };

  return (
    <div className="space-y-5" dir="rtl">
      {/* What you'll do */}
      <div className="rounded-xl bg-[#FEF3EC] border border-[#FDDCBF] p-4 flex gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">🏠</span>
        <div>
          <p className="text-sm font-bold text-[#92400E]">ماذا ستفعل؟</p>
          <p className="text-sm text-[#78350F] leading-relaxed mt-0.5">
            ستنتقل إلى صفحة إضافة العقارات، وتضيف عقارك الأول بكل التفاصيل، ثم تعود هنا وتضغط "تم".
          </p>
        </div>
      </div>

      {/* Property types preview */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: "🏢", label: "شقة" },
          { icon: "🏡", label: "فيلا" },
          { icon: "🌍", label: "أرض" },
          { icon: "🏗️", label: "مكتب" },
        ].map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-[#E5E7EB] bg-[#F4F5F7] p-3 text-center"
          >
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="text-xs text-[#6B7280] font-medium">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Main CTA — goes to properties/add page */}
      {!manuallyMarked ? (
        <div className="space-y-3">
          <Link href="/dashboard/properties/add" className="block">
            <Button
              className="w-full h-14 rounded-[20px] text-white font-bold text-base gap-3 group"
              style={{ background: "linear-gradient(135deg, #E07A3A, #F59E0B)" }}
            >
              <Building2 className="w-5 h-5" />
              إضافة أول عقار الآن
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>

          <p className="text-center text-xs text-[#9CA3AF]">
            بعد الإضافة، عد هنا واضغط "تم الإضافة" أدناه
          </p>

          {/* Mark as done after returning */}
          <div className="rounded-xl border-2 border-dashed border-[#E5E7EB] p-4 text-center space-y-3">
            <p className="text-sm text-[#6B7280]">هل أكملت إضافة العقار؟</p>
            <Button
              type="button"
              onClick={handleMarkDone}
              variant="outline"
              className="h-10 px-6 rounded-[20px] border-[#4CAF82] text-[#4CAF82] hover:bg-[#E8F5EF] font-semibold text-sm gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              نعم، تم الإضافة ✓
            </Button>
          </div>
        </div>
      ) : (
        /* Success state */
        <div className="rounded-xl bg-[#E8F5EF] border border-[#4CAF82]/40 p-5 text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-[#4CAF82] mx-auto" />
          <p className="font-bold text-[#1A3C34] text-base">تم إضافة العقار!</p>
          <p className="text-sm text-[#374151]">يمكنك إضافة المزيد من العقارات لاحقاً من قسم العقارات.</p>
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-1.5 text-sm text-[#4CAF82] font-medium hover:text-[#1A3C34] transition-colors mt-1"
          >
            عرض العقارات
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="h-11 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
        >
          → السابق
        </Button>
        {manuallyMarked && (
          <Button
            onClick={onNext}
            className="flex-1 h-11 rounded-[20px] text-white font-semibold text-sm"
            style={{ background: "#1A3C34" }}
          >
            التالي ←
          </Button>
        )}
        {!manuallyMarked && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 h-11 rounded-[20px] text-[#9CA3AF] hover:text-[#6B7280] text-sm"
          >
            تخطي لاحقاً
          </Button>
        )}
      </div>
    </div>
  );
}
