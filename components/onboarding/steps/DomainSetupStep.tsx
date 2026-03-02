"use client";

import { useState } from "react";
import { ExternalLink, Globe, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveDomainSettings } from "@/lib/mock/onboarding-api";
import { useOnboardingStore } from "@/store/onboarding";
import { ExplanationCard } from "@/components/onboarding/ExplanationCard";
import { HelpBanner } from "@/components/onboarding/HelpBanner";
import toast from "react-hot-toast";

interface DomainSetupStepProps {
  onNext: () => void;
  onPrev: () => void;
  isBeginnerMode?: boolean;
}

const DNS_STEPS = [
  "سجّل الدخول إلى لوحة تحكم مزود النطاق حقك (مثل GoDaddy، Namecheap، أو STC)",
  'ابحث عن إعدادات "DNS" أو "إدارة النطاق"',
  "أضف سجل CNAME يشير إلى: sites.taearif.sa",
  "انتظر من ١٥ دقيقة إلى ٢٤ ساعة حتى يتفعّل",
];

export function DomainSetupStep({ onNext, onPrev, isBeginnerMode = false }: DomainSetupStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const stepData = steps.find((s) => s.id === "domain")?.data ?? {};

  const [customDomain, setCustomDomain] = useState(stepData.customDomain ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!customDomain.trim()) {
      toast.error("يرجى إدخال نطاقك المخصص");
      return;
    }
    setSaving(true);
    try {
      await saveDomainSettings({ domainType: "custom", customDomain });
      markStepCompleted("domain", { domainType: "custom", customDomain, domainConnected: true });
      toast.success("تم حفظ النطاق!");
      onNext();
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    skipStep("domain");
    onNext();
  };

  const isAlreadyConnected = stepData.domainConnected ?? false;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Beginner explanation */}
      {isBeginnerMode && <ExplanationCard stepId="domain" />}

      {/* Header */}
      <div className="text-center space-y-1">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2"
          style={{ background: "#E8F5EF" }}
        >
          🌐
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">ربط نطاق خاص</h2>
        <p className="text-sm text-[#6B7280]">
          {isBeginnerMode
            ? "إذا اشتريت نطاقاً خاصاً — اربطه هنا. وإلا تقدر تتخطى هذه الخطوة"
            : "اربط نطاقك المخصص بموقعك على تعاريف"}
        </p>
      </div>

      {/* Existing subdomain info */}
      <div
        className="rounded-xl p-4 flex items-center gap-3"
        style={{ background: "#E8F5EF", border: "1.5px solid #4CAF8240" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#1A3C34" }}
        >
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#1A3C34]">رابطك المجاني جاهز تلقائياً ✓</p>
          <p className="text-xs text-[#2D6A4F] mt-0.5">
            موقعك يعمل الآن على نطاق تعاريف الفرعي — هذه الخطوة اختيارية
          </p>
        </div>
      </div>

      {/* Custom domain input */}
      <div className="space-y-2">
        <Label
          htmlFor="custom-domain"
          className={isBeginnerMode ? "text-base font-semibold text-[#1A1A1A]" : "text-sm font-semibold text-[#1A1A1A]"}
        >
          نطاقك المخصص
          <span className="text-[#9CA3AF] font-normal text-xs mr-1">(اختياري)</span>
        </Label>
        {isBeginnerMode && (
          <p className="text-xs text-[#6B7280]">
            إذا عندك نطاق اشتريته مسبقاً مثل "مكتبك.sa" — اكتبه هنا
          </p>
        )}
        <Input
          id="custom-domain"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value.trim())}
          placeholder="مثال: maktabi.sa أو www.maktabi.sa"
          className="h-14 rounded-xl border-[#E5E7EB] text-base"
          dir="ltr"
        />
      </div>

      {/* DNS setup guide — shown when user has typed something */}
      {customDomain.trim().length > 0 && (
        <div
          className="rounded-xl p-4 space-y-3"
          style={{ background: "#E8F5EF", border: "1.5px solid #4CAF8240" }}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1A3C34]" />
            <p className="text-sm font-bold text-[#1A3C34]">خطوات ربط النطاق</p>
          </div>
          <ol className="space-y-2.5">
            {DNS_STEPS.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[#2D6A4F]">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ background: "#1A3C34" }}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
          {isBeginnerMode && (
            <p className="text-xs text-[#4CAF82] pt-1 border-t border-[#4CAF8230]">
              💡 إذا ما تعرف كيف تسوّي هذا، فريقنا يقدر يساعدك — اضغط "تواصل معنا" أدناه
            </p>
          )}
          <a
            href="https://docs.taearif.sa/domain-setup"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#4CAF82] hover:text-[#1A3C34] font-medium transition-colors"
          >
            دليل ربط النطاق بالتفصيل
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {/* Help banner for beginners */}
      {isBeginnerMode && <HelpBanner />}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          disabled={saving}
          className="h-14 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
        >
          → السابق
        </Button>
        {customDomain.trim().length > 0 ? (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-14 rounded-[20px] text-white font-semibold text-base"
            style={{ background: "#1A3C34" }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "ربط النطاق والمتابعة ←"
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 h-14 rounded-[20px] text-[#9CA3AF] hover:text-[#6B7280] text-sm"
          >
            تخطي — سأربطه لاحقاً
          </Button>
        )}
      </div>
    </div>
  );
}
