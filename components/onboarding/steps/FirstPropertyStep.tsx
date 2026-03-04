"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  CheckCircle2,
  Building2,
  ArrowLeft,
  Link2,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardingStore } from "@/store/onboarding";
import { ExplanationCard } from "@/components/onboarding/ExplanationCard";
import { HelpBanner } from "@/components/onboarding/HelpBanner";
import { cn } from "@/lib/utils";
import {
  importPropertiesFromUrls,
  ImportPropertyResult,
} from "@/components/property/property-form/services/propertyApi";
import toast from "react-hot-toast";

interface FirstPropertyStepProps {
  onNext: () => void;
  onPrev: () => void;
  isBeginnerMode?: boolean;
}

type Mode = "choose" | "manual" | "import";

const SUPPORTED_SITES = [
  {
    id: "aqar",
    name: "عقار",
    domain: "sa.aqar.fm",
    logo: "🏠",
    color: "#0066CC",
    placeholder: "https://sa.aqar.fm/...",
  },
  {
    id: "bayut",
    name: "بيوت",
    domain: "bayut.sa",
    logo: "🏢",
    color: "#E63946",
    placeholder: "https://www.bayut.sa/...",
  },
];

const PROPERTY_TYPES = [
  { icon: "🏢", label: "شقة" },
  { icon: "🏡", label: "فيلا" },
  { icon: "🌍", label: "أرض" },
  { icon: "🏗️", label: "مكتب" },
];

function isValidImportUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return SUPPORTED_SITES.some((site) => parsed.hostname.includes(site.domain));
  } catch {
    return false;
  }
}

export function FirstPropertyStep({
  onNext,
  onPrev,
  isBeginnerMode = false,
}: FirstPropertyStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const isAlreadyCompleted = steps.find((s) => s.id === "property")?.completed ?? false;

  const [mode, setMode] = useState<Mode>(isAlreadyCompleted ? "manual" : "choose");
  const [manuallyMarked, setManuallyMarked] = useState(isAlreadyCompleted);

  // Import state
  const [urlInputs, setUrlInputs] = useState<string[]>([""]);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportPropertyResult[] | null>(null);

  const handleMarkDone = () => {
    setManuallyMarked(true);
    markStepCompleted("property", { propertyType: "manually-confirmed" });
  };

  const handleSkip = () => {
    skipStep("property");
    onNext();
  };

  const addUrlInput = () => {
    setUrlInputs((prev) => [...prev, ""]);
  };

  const removeUrlInput = (index: number) => {
    setUrlInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateUrlInput = (index: number, value: string) => {
    setUrlInputs((prev) => prev.map((u, i) => (i === index ? value : u)));
  };

  const validUrls = urlInputs.filter((u) => isValidImportUrl(u));
  const hasInvalidFilledUrls = urlInputs.some((u) => u.trim() !== "" && !isValidImportUrl(u));

  const handleImport = async () => {
    if (validUrls.length === 0) return;
    setImporting(true);
    setImportResults(null);

    try {
      const results = await importPropertiesFromUrls(validUrls);
      setImportResults(results);
      const successCount = results.filter((r) => r.success).length;
      if (successCount > 0) {
        markStepCompleted("property", { propertyType: "imported", count: successCount });
        setManuallyMarked(true);
        toast.success(
          successCount === 1
            ? "تم استيراد العقار بنجاح!"
            : `تم استيراد ${successCount} عقارات بنجاح!`,
        );
      } else {
        toast.error("لم يتم استيراد أي عقار. تحقق من الروابط وأعد المحاولة.");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاستيراد. يرجى المحاولة لاحقاً.");
    } finally {
      setImporting(false);
    }
  };

  if (isAlreadyCompleted && manuallyMarked) {
    return (
      <div className="space-y-5" dir="rtl">
        {isBeginnerMode && <ExplanationCard stepId="property" />}
        <SuccessState isBeginnerMode={isBeginnerMode} onNext={onNext} onPrev={onPrev} />
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      {isBeginnerMode && <ExplanationCard stepId="property" />}

      {/* Header */}
      <div className="text-center space-y-1">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2"
          style={{ background: "#E8F5EF" }}
        >
          🏠
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">أول عقار</h2>
        <p className="text-sm text-[#6B7280]">أضف أول عقار لموقعك لتبدأ في استقبال العملاء</p>
      </div>

      {/* Mode chooser */}
      {mode === "choose" && (
        <ChooseMode onManual={() => setMode("manual")} onImport={() => setMode("import")} />
      )}

      {/* Manual mode */}
      {mode === "manual" && !manuallyMarked && (
        <ManualMode
          isBeginnerMode={isBeginnerMode}
          onMarkDone={handleMarkDone}
          onBack={() => setMode("choose")}
        />
      )}

      {/* Import mode */}
      {mode === "import" && !manuallyMarked && (
        <ImportMode
          urlInputs={urlInputs}
          validUrls={validUrls}
          hasInvalidFilledUrls={hasInvalidFilledUrls}
          importing={importing}
          importResults={importResults}
          onAddUrl={addUrlInput}
          onRemoveUrl={removeUrlInput}
          onUpdateUrl={updateUrlInput}
          onImport={handleImport}
          onBack={() => setMode("choose")}
        />
      )}

      {/* Success state inline */}
      {manuallyMarked && !isAlreadyCompleted && (
        <SuccessState isBeginnerMode={isBeginnerMode} onNext={onNext} onPrev={onPrev} />
      )}

      {/* Property types preview — visible in choose/manual modes */}
      {(mode === "choose" || mode === "manual") && !manuallyMarked && (
        <div className="grid grid-cols-4 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-[#E5E7EB] bg-[#F4F5F7] p-3 text-center"
            >
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="text-xs text-[#6B7280] font-medium">{t.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Help banner */}
      {isBeginnerMode && !manuallyMarked && <HelpBanner />}

      {/* Navigation */}
      {!manuallyMarked && (
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="h-14 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
          >
            → السابق
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 h-14 rounded-[20px] text-[#9CA3AF] hover:text-[#6B7280] text-sm"
          >
            تخطي لاحقاً
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ChooseMode({
  onManual,
  onImport,
}: {
  onManual: () => void;
  onImport: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#374151] text-center">كيف تريد إضافة عقارك؟</p>
      <div className="grid grid-cols-1 gap-3">
        {/* Import option — highlighted as new/recommended */}
        <button
          type="button"
          onClick={onImport}
          className="group relative rounded-2xl border-2 border-[#4CAF82] bg-gradient-to-br from-[#E8F5EF] to-[#D1FAE5] p-4 text-right transition-all hover:shadow-md active:scale-[0.99]"
        >
          <span className="absolute top-3 left-3 rounded-full bg-[#4CAF82] px-2 py-0.5 text-[10px] font-bold text-white">
            جديد ✨
          </span>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1A3C34] flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-[#1A3C34] text-sm">استيراد من رابط</p>
              <p className="text-xs text-[#2D6A4F] leading-relaxed mt-0.5">
                الصق رابط عقار من عقار.fm أو بيوت.sa وسنستورد بياناته تلقائياً
              </p>
              <div className="flex gap-1.5 mt-2">
                {SUPPORTED_SITES.map((site) => (
                  <span
                    key={site.id}
                    className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-[#374151] border border-[#E5E7EB]"
                  >
                    {site.logo} {site.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* Manual option */}
        <button
          type="button"
          onClick={onManual}
          className="group rounded-2xl border-2 border-[#E5E7EB] bg-white p-4 text-right transition-all hover:border-[#4CAF82] hover:shadow-sm active:scale-[0.99]"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F4F5F7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8F5EF] transition-colors">
              <Building2 className="w-5 h-5 text-[#6B7280] group-hover:text-[#4CAF82] transition-colors" />
            </div>
            <div>
              <p className="font-bold text-[#1A1A1A] text-sm">إضافة يدوية</p>
              <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">
                أدخل بيانات العقار بنفسك عبر نموذج الإضافة
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function ManualMode({
  isBeginnerMode,
  onMarkDone,
  onBack,
}: {
  isBeginnerMode: boolean;
  onMarkDone: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#374151] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        تغيير الطريقة
      </button>

      <div className="rounded-xl bg-[#E8F5EF] border border-[#4CAF8240] p-4 flex gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">🏠</span>
        <div>
          <p className="text-sm font-bold text-[#1A3C34]">ماذا ستسوي؟</p>
          <p className="text-sm text-[#2D6A4F] leading-relaxed mt-0.5">
            ستنتقل إلى صفحة إضافة العقارات، تضيف عقارك الأول، ثم ترجع هنا وتضغط "تم".
          </p>
          {isBeginnerMode && (
            <p className="text-xs text-[#4CAF82] mt-1.5 leading-relaxed">
              💡 لا تقلق — الصفحة سهلة وفيها توجيه في كل خطوة. وأي معلومات تقدر تعدّلها لاحقاً.
            </p>
          )}
        </div>
      </div>

      <Link href="/dashboard/properties/add" className="block">
        <Button
          className="w-full h-14 rounded-[20px] text-white font-bold text-base gap-3 group"
          style={{ background: "linear-gradient(135deg, #1A3C34, #2D6A4F)" }}
        >
          <Building2 className="w-5 h-5" />
          إضافة أول عقار الآن
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        </Button>
      </Link>

      <p className="text-center text-xs text-[#9CA3AF]">
        بعد الإضافة، عد هنا واضغط "تم الإضافة" أدناه
      </p>

      <div className="rounded-xl border-2 border-dashed border-[#E5E7EB] p-4 text-center space-y-3">
        <p className="text-sm text-[#6B7280]">هل أكملت إضافة العقار؟</p>
        <Button
          type="button"
          onClick={onMarkDone}
          variant="outline"
          className="h-12 px-6 rounded-[20px] border-[#4CAF82] text-[#4CAF82] hover:bg-[#E8F5EF] font-semibold text-sm gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          نعم، تم الإضافة ✓
        </Button>
      </div>
    </div>
  );
}

function ImportMode({
  urlInputs,
  validUrls,
  hasInvalidFilledUrls,
  importing,
  importResults,
  onAddUrl,
  onRemoveUrl,
  onUpdateUrl,
  onImport,
  onBack,
}: {
  urlInputs: string[];
  validUrls: string[];
  hasInvalidFilledUrls: boolean;
  importing: boolean;
  importResults: ImportPropertyResult[] | null;
  onAddUrl: () => void;
  onRemoveUrl: (i: number) => void;
  onUpdateUrl: (i: number, v: string) => void;
  onImport: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#374151] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        تغيير الطريقة
      </button>

      {/* Supported sites */}
      <div className="rounded-xl bg-[#F4F5F7] border border-[#E5E7EB] p-3">
        <p className="text-xs font-semibold text-[#6B7280] mb-2">المواقع المدعومة</p>
        <div className="flex gap-2 flex-wrap">
          {SUPPORTED_SITES.map((site) => (
            <div
              key={site.id}
              className="flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-3 py-1"
            >
              <span className="text-base">{site.logo}</span>
              <div>
                <p className="text-xs font-bold text-[#374151]">{site.name}</p>
                <p className="text-[10px] text-[#9CA3AF]">{site.domain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* URL inputs */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-[#374151]">
          الصق رابط العقار{urlInputs.length > 1 ? "ات" : ""}
        </p>
        {urlInputs.map((url, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <Input
                dir="ltr"
                value={url}
                onChange={(e) => onUpdateUrl(index, e.target.value)}
                placeholder={
                  SUPPORTED_SITES[index % SUPPORTED_SITES.length].placeholder
                }
                className={cn(
                  "pr-9 h-12 rounded-xl text-sm font-mono",
                  url.trim() !== "" &&
                    !isValidImportUrl(url) &&
                    "border-red-400 focus-visible:ring-red-300",
                  isValidImportUrl(url) && "border-[#4CAF82] focus-visible:ring-[#4CAF82]/30",
                )}
              />
              {isValidImportUrl(url) && (
                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4CAF82]" />
              )}
            </div>
            {urlInputs.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveUrl(index)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {hasInvalidFilledUrls && (
          <p className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            يرجى التأكد من أن الرابط من أحد المواقع المدعومة (sa.aqar.fm أو bayut.sa)
          </p>
        )}

        {urlInputs.length < 5 && (
          <button
            type="button"
            onClick={onAddUrl}
            className="flex items-center gap-1.5 text-xs text-[#4CAF82] font-medium hover:text-[#1A3C34] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            إضافة رابط آخر (استيراد متعدد)
          </button>
        )}
      </div>

      {/* Import results */}
      {importResults && (
        <div className="space-y-1.5">
          {importResults.map((result, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
                result.success
                  ? "bg-[#E8F5EF] text-[#1A3C34]"
                  : "bg-red-50 text-red-700",
              )}
            >
              {result.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#4CAF82] flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
              <span className="font-mono truncate flex-1">{result.url}</span>
              <span className="font-medium flex-shrink-0">
                {result.success ? "تم الاستيراد ✓" : result.error ?? "فشل"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Import button */}
      <Button
        type="button"
        onClick={onImport}
        disabled={validUrls.length === 0 || importing}
        className="w-full h-14 rounded-[20px] text-white font-bold text-base gap-3"
        style={{
          background:
            validUrls.length > 0
              ? "linear-gradient(135deg, #1A3C34, #2D6A4F)"
              : undefined,
        }}
      >
        {importing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            جارٍ الاستيراد...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            استيراد{validUrls.length > 1 ? ` ${validUrls.length} عقارات` : " العقار"}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-[#9CA3AF] leading-relaxed">
        سنقوم بجلب بيانات العقار تلقائياً — يمكنك مراجعتها وتعديلها بعد الاستيراد
      </p>
    </div>
  );
}

function SuccessState({
  isBeginnerMode,
  onNext,
  onPrev,
}: {
  isBeginnerMode: boolean;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <>
      <div className="rounded-xl bg-[#E8F5EF] border border-[#4CAF82]/40 p-5 text-center space-y-2">
        <CheckCircle2 className="w-10 h-10 text-[#4CAF82] mx-auto" />
        <p className="font-bold text-[#1A3C34] text-base">تم إضافة العقار! 🎉</p>
        <p className="text-sm text-[#374151]">
          {isBeginnerMode
            ? "ممتاز! يمكنك إضافة المزيد من العقارات لاحقاً بنفس السهولة."
            : "يمكنك إضافة المزيد من العقارات لاحقاً من قسم العقارات."}
        </p>
        <Link
          href="/dashboard/properties"
          className="inline-flex items-center gap-1.5 text-sm text-[#4CAF82] font-medium hover:text-[#1A3C34] transition-colors mt-1"
        >
          عرض العقارات
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="h-14 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
        >
          → السابق
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-14 rounded-[20px] text-white font-semibold text-base"
          style={{ background: "#1A3C34" }}
        >
          التالي ←
        </Button>
      </div>
    </>
  );
}
