import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target } from "lucide-react";
import Link from "next/link";

export const CrmLinkCard = () => {
  return (
    <div className="text-center py-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Target className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                هل تحتاج إلى مزيد من الميزات؟
              </h3>
              <p className="text-sm text-muted-foreground">
                استخدم نظام CRM المتقدم لإدارة مراحل العملاء والمواعيد
                والتفاعلات
              </p>
            </div>
            <Link href="/dashboard/crm">
              <Button className="w-full">
                <ArrowRight className="ml-2 h-4 w-4" />
                انتقل إلى نظام CRM المتقدم
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
