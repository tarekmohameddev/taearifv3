"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboardingStore } from "@/store/onboarding";
import { saveIntegrations } from "@/lib/mock/onboarding-api";
import { ExplanationCard } from "@/components/onboarding/ExplanationCard";
import { HelpBanner } from "@/components/onboarding/HelpBanner";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface IntegrationsStepProps {
  onNext: () => void;
  onPrev: () => void;
  isBeginnerMode?: boolean;
}

export function IntegrationsStep({ onNext, onPrev, isBeginnerMode = false }: IntegrationsStepProps) {
  const { steps, markStepCompleted, skipStep } = useOnboardingStore();
  const stepData = steps.find((s) => s.id === "integrations")?.data ?? {};

  const [whatsappDone, setWhatsappDone] = useState(stepData.whatsappConnected ?? false);
  const [pixelDone, setPixelDone] = useState(stepData.metaPixelConnected ?? false);
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    try {
      await saveIntegrations({
        whatsappNumber: whatsappDone ? "configured" : undefined,
        metaPixelId: pixelDone ? "configured" : undefined,
      });
      markStepCompleted("integrations", {
        whatsappConnected: whatsappDone,
        metaPixelConnected: pixelDone,
      });
      toast.success("تم حفظ التكاملات!");
      onNext();
    } catch {
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    skipStep("integrations");
    onNext();
  };

  const bothDone = whatsappDone && pixelDone;
  const anyDone = whatsappDone || pixelDone;

  return (
    <div className="space-y-4" dir="rtl">
      {/* Beginner explanation */}
      {isBeginnerMode && <ExplanationCard stepId="integrations" />}

      {/* Header */}
      <div className="text-center space-y-1">
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-2"
          style={{ background: "#E8F5EF" }}
        >
          🔗
        </div>
        <h2 className="text-xl font-bold text-[#1A1A1A]">الربط والتكامل</h2>
        <p className="text-sm text-[#6B7280]">
          {isBeginnerMode
            ? "خطوة اختيارية — تقدر تتجاوزها وتعود لاحقاً"
            : "واتساب وميتا بيكسل — كلاهما اختياري"}
        </p>
      </div>

      {/* WhatsApp integration card */}
      <IntegrationRedirectCard
        icon="💬"
        iconBg="#E7F8EE"
        color="#25D366"
        title="واتساب"
        description={
          isBeginnerMode
            ? "يضيف زر واتساب في موقعك عشان عملاؤك يرسلون لك مباشرة بضغطة زر واحدة — سهل جداً!"
            : "استقبل استفسارات العملاء مباشرة عبر واتساب. اضغط لإعداد الربط من صفحة إدارة واتساب."
        }
        buttonLabel="إعداد واتساب الآن"
        buttonColor="#25D366"
        href="/dashboard/whatsapp-management"
        isDone={whatsappDone}
        onMarkDone={() => setWhatsappDone(true)}
        onUndo={() => setWhatsappDone(false)}
      />

      {/* Meta Pixel integration card */}
      <IntegrationRedirectCard
        icon="📊"
        iconBg="#E8F5EF"
        color="#1A3C34"
        title="Meta Pixel (للمتقدمين)"
        description={
          isBeginnerMode
            ? "يساعدك تتابع من يزور موقعك ويقيس نتائج إعلاناتك على فيسبوك وإنستغرام — يمكن تأجيله."
            : "تتبع زوار موقعك وقِس نتائج إعلاناتك على فيسبوك وإنستغرام. أضف معرف Pixel من صفحة الإعدادات."
        }
        buttonLabel="الذهاب إلى الإعدادات"
        buttonColor="#1A3C34"
        href="/dashboard/settings"
        isDone={pixelDone}
        onMarkDone={() => setPixelDone(true)}
        onUndo={() => setPixelDone(false)}
      />

      {/* Info tip */}
      <div className="flex gap-2 p-3 rounded-xl bg-[#E8F5EF] border border-[#4CAF8240]">
        <AlertCircle className="w-4 h-4 text-[#4CAF82] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[#2D6A4F] leading-relaxed">
          {isBeginnerMode
            ? "هذه الخطوات اختيارية تماماً. الأهم الآن هو إطلاق موقعك — تقدر تربط الخدمات لاحقاً."
            : "هذه الخطوات اختيارية. يمكنك ربط هذه الخدمات لاحقاً في أي وقت من صفحاتها المخصصة."}
        </p>
      </div>

      {/* Help banner for beginners */}
      {isBeginnerMode && <HelpBanner />}

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="h-14 px-5 rounded-[20px] border-[#E5E7EB] text-[#374151]"
        >
          → السابق
        </Button>

        {anyDone ? (
          <Button
            onClick={handleFinish}
            disabled={saving}
            className="flex-1 h-14 rounded-[20px] text-white font-semibold text-base"
            style={{ background: "#1A3C34" }}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : bothDone ? (
              "إنهاء الإعداد 🎉"
            ) : (
              "حفظ والإنهاء ←"
            )}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={handleSkip}
            className="flex-1 h-14 rounded-[20px] text-[#9CA3AF] hover:text-[#6B7280] text-sm"
          >
            {isBeginnerMode ? "تخطي الآن وأكمل لاحقاً" : "تخطي الكل"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ─── Reusable redirect card ─────────────────── */
interface IntegrationRedirectCardProps {
  icon: string;
  iconBg: string;
  color: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonColor: string;
  href: string;
  isDone: boolean;
  onMarkDone: () => void;
  onUndo: () => void;
}

function IntegrationRedirectCard({
  icon, iconBg, color, title, description,
  buttonLabel, buttonColor, href, isDone, onMarkDone, onUndo,
}: IntegrationRedirectCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-4 transition-all",
        isDone ? "border-[#4CAF82]/50 bg-[#E8F5EF]/40" : "border-[#E5E7EB] bg-white"
      )}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-[#1A1A1A]">{title}</h3>
            {isDone && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-[#4CAF82] px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" /> مكتمل
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed mt-0.5">{description}</p>
        </div>
      </div>

      {!isDone ? (
        <div className="space-y-2">
          <Link href={href} className="block">
            <Button
              className="w-full h-12 rounded-[20px] text-white font-semibold text-sm gap-2 group"
              style={{ background: buttonColor }}
            >
              {buttonLabel}
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-[#9CA3AF]">أكملت الإعداد؟</p>
            <button
              type="button"
              onClick={onMarkDone}
              className="flex items-center gap-1.5 text-xs text-[#4CAF82] font-semibold hover:text-[#1A3C34] transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              نعم، تم الربط ✓
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#4CAF82] font-medium">
            <CheckCircle2 className="w-4 h-4" />
            تم الربط بنجاح
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={href}
              className="text-xs text-[#6B7280] hover:text-[#374151] flex items-center gap-1 transition-colors"
            >
              إعدادات
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              type="button"
              onClick={onUndo}
              className="text-xs text-[#9CA3AF] hover:text-red-400 transition-colors"
            >
              تراجع
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
