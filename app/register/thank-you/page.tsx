"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const REDIRECT_PATH = "/dashboard";
const REDIRECT_DELAY_SECONDS = 10;

export default function RegisterThankYouPage() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_DELAY_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          router.push(REDIRECT_PATH);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [router]);

  const handleRedirectNow = () => {
    router.push(REDIRECT_PATH);
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-6"
      dir="rtl"
    >
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-xl p-10 space-y-8 text-right">
        <div className="flex justify-center">
          <CheckCircle2
            className="w-16 h-16 text-green-500"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground text-center">
            شكراً لتسجيلك في منصة تعارف
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground text-center">
            يسعدنا انضمامك إلينا! تم إنشاء حسابك بنجاح، وسيتم تحويلك تلقائياً
            إلى لوحة التحكم خلال{" "}
            <span className="font-semibold text-foreground">
              {secondsLeft} ثانية
            </span>
            .
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="w-4 h-4" aria-hidden="true" />
            <span>سيتم إعادة التوجيه تلقائياً بعد انتهاء العد التنازلي.</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>يمكنك أيضاً زيارة لوحة التحكم مباشرة عبر الرابط التالي:</span>
            <Link
              href={REDIRECT_PATH}
              className="text-primary font-semibold hover:underline"
            >
              /dashboard
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full bg-muted/40 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{
                width: `${
                  ((REDIRECT_DELAY_SECONDS - secondsLeft) /
                    REDIRECT_DELAY_SECONDS) *
                  100
                }%`,
              }}
            />
          </div>

          <Button
            type="button"
            onClick={handleRedirectNow}
            className="flex items-center gap-2 px-6 py-5 text-base"
          >
            الانتقال إلى لوحة التحكم الآن
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

