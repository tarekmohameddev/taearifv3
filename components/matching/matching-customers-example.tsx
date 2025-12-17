"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Home, Target, Users } from "lucide-react";
import useStore from "@/context/Store";

export function MatchingCustomersExample() {
  const {
    matchingPage: { customers, loading, customerStats, error },
    fetchCustomers,
    fetchCustomerStats,
  } = useStore();

  if (loading) {
    return <div className="p-4">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">خطأ: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات العملاء */}
      {customerStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي العملاء
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerStats.totalCustomers}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الطلبات
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerStats.totalRequests}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                العقارات المتطابقة
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerStats.totalMatchingProperties}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                متوسط العقارات للعميل
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerStats.averageMatchingProperties.toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* قائمة العملاء */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={customer.assignedAgent?.avatar} />
                  <AvatarFallback>
                    {customer.name?.charAt(0) || "ع"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {customer.phone}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">عدد الطلبات:</span>
                  <Badge variant="secondary">{customer.totalPurchases}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    العقارات المتطابقة:
                  </span>
                  <Badge variant="outline">{customer.matchingProperties}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">التقييم:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{customer.rating}</span>
                    <span className="text-yellow-500">★</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد بيانات عملاء</p>
        </div>
      )}
    </div>
  );
}
