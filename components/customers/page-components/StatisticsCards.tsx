
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
} from "lucide-react";

export const StatisticsCards = ({ totalCustomers }: any) => {
  return (
    <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Users className="ml-2 h-4 w-4" />
            إجمالي العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">↑ 12%</span> من الشهر الماضي
          </p>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="ml-2 h-4 w-4" />
            العملاء النشطون
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">↑ 8%</span> من الشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="ml-2 h-4 w-4" />
            إجمالي الإيرادات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}م ريال</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">↑ 15%</span> من الشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Target className="ml-2 h-4 w-4" />
            متوسط قيمة العميل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(avgCustomerValue / 1000).toFixed(0)}ك ريال</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-500">↑ 5%</span> من الشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <CheckCircle className="ml-2 h-4 w-4" />
            معدل الرضا
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            4.5
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-xs text-muted-foreground">من 5 نجوم</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="ml-2 h-4 w-4" />
            آخر تحديث
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">اليوم</div>
          <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
        </CardContent>
      </Card> */}
    </div>
  );
}; 