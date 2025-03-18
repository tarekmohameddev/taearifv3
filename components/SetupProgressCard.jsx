"use client";
import { useEffect } from "react";
import useStore from "@/context/Store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // استيراد Skeleton

export function SetupProgressCard() {
  const {
    homepage: {
      setupProgressData,
      isSetupProgressDataUpdated,
      fetchSetupProgressData,
    },
    loading,
  } = useStore();

  useEffect(() => {
    if (!isSetupProgressDataUpdated) {
      fetchSetupProgressData();
    }
  }, [isSetupProgressDataUpdated, fetchSetupProgressData]);

  if (loading || !setupProgressData) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>تقدم الإعداد</CardTitle>
        <CardDescription>
          أكمل إعداد موقعك للحصول على أفضل النتائج
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">اكتمال الإعداد</span>
            <span className="text-sm font-medium">
              {setupProgressData.progress_percentage}%
            </span>
          </div>
          <Progress value={setupProgressData.progress_percentage} />
        </div>
        <div className="space-y-2">
          {setupProgressData.completed_steps.map((step) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 items-center justify-center ${
                  step.completed
                    ? "rounded-full bg-primary/10 text-primary"
                    : "rounded-full border border-dashed"
                }`}
              >
                {step.completed ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="text-xs">{step.id}</span>
                )}
              </div>
              <span className="text-sm">{step.name}</span>
            </div>
          ))}
        </div>
        <Button size="sm" className="w-full gap-1">
          <span>متابعة الإعداد</span>
          <ArrowRight className="h-3.5 w-3.5 mr-0 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default SetupProgressCard;
