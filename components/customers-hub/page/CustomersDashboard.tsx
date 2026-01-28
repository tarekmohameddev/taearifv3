"use client";

import React from "react";
import useUnifiedCustomersStore from "@/context/store/unified-customers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign,
  UserCheck,
  Clock,
  Zap,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getStageNameAr, LIFECYCLE_STAGES } from "@/types/unified-customer";
import Link from "next/link";

export function CustomersDashboard() {
  const { statistics, customers } = useUnifiedCustomersStore();

  // AI Insights
  const urgentActions = customers.filter(
    (c) =>
      c.priority === "urgent" &&
      (c.stage === "negotiation" || c.stage === "closing" || c.stage === "down_payment")
  ).length;

  const highLeadScoreCustomers = customers.filter((c) => c.leadScore >= 80).length;
  
  const churnRiskHigh = customers.filter(
    (c) => c.aiInsights.churnRisk === "high"
  ).length;

  const todayFollowUps = customers.filter((c) => {
    if (!c.nextFollowUpDate) return false;
    const today = new Date().toISOString().split("T")[0];
    const followUpDate = c.nextFollowUpDate.split("T")[0];
    return followUpDate === today;
  }).length;

  if (!statistics) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Customers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            إجمالي العملاء
          </CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {statistics.newThisMonth} جديد هذا الشهر
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Deal Value */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            قيمة الصفقات
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(statistics.totalDealValue / 1000000).toFixed(1)}م ريال
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {statistics.closedThisMonth} صفقة مغلقة
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Average Lead Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            متوسط جودة العملاء
          </CardTitle>
          <Target className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.avgLeadScore}/100</div>
          <Progress value={statistics.avgLeadScore} className="mt-2" />
          <div className="text-xs text-gray-500 mt-1">
            {highLeadScoreCustomers} عميل بجودة عالية (80+)
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            معدل التحويل
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.conversionRate}%</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              {statistics.avgDaysInPipeline} يوم متوسط
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="md:col-span-2 lg:col-span-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            رؤى ذكية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Urgent Actions */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">إجراءات عاجلة</div>
                <div className="text-2xl font-bold text-red-600">{urgentActions}</div>
                <div className="text-xs text-gray-500 mt-1">
                  عميل يحتاج متابعة فورية
                </div>
              </div>
            </div>

            {/* Today Follow-ups */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">متابعات اليوم</div>
                <div className="text-2xl font-bold text-blue-600">{todayFollowUps}</div>
                <div className="text-xs text-gray-500 mt-1">
                  مكالمات ورسائل مجدولة
                </div>
              </div>
            </div>

            {/* High Risk Customers */}
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <UserCheck className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-sm">خطر الفقدان</div>
                <div className="text-2xl font-bold text-orange-600">{churnRiskHigh}</div>
                <div className="text-xs text-gray-500 mt-1">
                  عميل بحاجة لاهتمام خاص
                </div>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">
                الإجراءات الموصى بها اليوم:
              </div>
              <Link href="/ar/dashboard/customers-hub/actions">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  عرض الكل
                  <ArrowLeft className="h-3 w-3" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {customers
                .filter((c) => c.aiInsights.nextBestAction && c.priority === "urgent")
                .slice(0, 3)
                .map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-medium">{customer.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {getStageNameAr(customer.stage)}
                      </Badge>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {customer.aiInsights.nextBestAction}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Distribution */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>توزيع العملاء حسب المرحلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {LIFECYCLE_STAGES.slice(0, 5).map((stage) => {
              const count = statistics.byStage[stage.id] || 0;
              const percentage =
                statistics.total > 0 ? ((count / statistics.total) * 100).toFixed(0) : 0;

              return (
                <div
                  key={stage.id}
                  className="flex flex-col gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
                  style={{ borderColor: stage.color }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="text-xs font-medium"
                      style={{ color: stage.color }}
                    >
                      {stage.nameAr}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                  <Progress
                    value={Number(percentage)}
                    className="h-1"
                    style={
                      {
                        "--progress-background": stage.color,
                      } as React.CSSProperties
                    }
                  />
                  <div className="text-xs text-gray-500">{percentage}% من الإجمالي</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
