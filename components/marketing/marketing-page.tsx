"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  MessageSquare,
  Settings,
  BarChart3,
  Plus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { WhatsAppNumbersManagement } from "@/components/marketing/whatsapp-numbers-management";
import { CreditSystemComponent } from "@/components/marketing/credit-system";
import { MarketingSettingsComponent } from "@/components/marketing/marketing-settings";
import { CampaignsManagement } from "@/components/marketing/campaigns-management";
import { useMarketingDashboardStore } from "@/context/store/marketingDashboard";

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState("marketing");
  
  // استخدام الـ store
  const {
    loading,
    error,
    isInitialized,
    fetchAllMarketingData,
    statistics,
  } = useMarketingDashboardStore();

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    if (!isInitialized) {
      fetchAllMarketingData();
    }
  }, [isInitialized, fetchAllMarketingData]);

  // عرض حالة التحميل
  if (loading && !isInitialized) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل بيانات التسويق...</p>
          </div>
        </div>
      </div>
    );
  }

  // عرض الأخطاء
  if (error) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">خطأ في تحميل البيانات</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button 
              onClick={() => fetchAllMarketingData()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-3 md:p-4 lg:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center">
                <Megaphone className="h-6 w-6 ml-2 text-primary" />
                التسويق
              </h1>
              <p className="text-muted-foreground">
                إدارة حملات التسويق والواتساب والإعدادات المتعلقة بالرسائل
              </p>
              {/* عرض الإحصائيات */}
              {statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-primary">{statistics.total_campaigns}</div>
                    <div className="text-sm text-muted-foreground">إجمالي الحملات</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{statistics.active_campaigns}</div>
                    <div className="text-sm text-muted-foreground">الحملات النشطة</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">{statistics.total_credits}</div>
                    <div className="text-sm text-muted-foreground">إجمالي الائتمانات</div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="text-2xl font-bold text-orange-600">{statistics.total_messages_sent}</div>
                    <div className="text-sm text-muted-foreground">الرسائل المرسلة</div>
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="whatsapp" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="whatsapp"
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">واتساب</span>
                </TabsTrigger>
                {/* <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">الحملات</span>
                </TabsTrigger> */}
                <TabsTrigger
                  value="credits"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">الرصيد</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">الإعدادات</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whatsapp">
                <WhatsAppNumbersManagement />
              </TabsContent>
              {/* 
              <TabsContent value="campaigns">
                <CampaignsManagement />
              </TabsContent> */}

              <TabsContent value="credits">
                <CreditSystemComponent />
              </TabsContent>

              <TabsContent value="settings">
                <MarketingSettingsComponent />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
