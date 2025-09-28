"use client"

import { useState } from "react"
import { Megaphone, MessageSquare, Settings, BarChart3, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { WhatsAppNumbersManagement } from "@/components/marketing/whatsapp-numbers-management"
import { CreditSystemComponent } from "@/components/marketing/credit-system"
import { MarketingSettingsComponent } from "@/components/marketing/marketing-settings"
import { CampaignsManagement } from "@/components/marketing/campaigns-management" // مخفي الان , سأستخدمه مستقبلا

export function MarketingPage() {
  const [activeTab, setActiveTab] = useState("marketing")

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
              <p className="text-muted-foreground">إدارة حملات التسويق والواتساب والإعدادات المتعلقة بالرسائل</p>
            </div>

            <Tabs defaultValue="whatsapp" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">واتساب</span>
                </TabsTrigger>
                {/* <TabsTrigger value="campaigns" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">الحملات</span>
                </TabsTrigger> */}
                <TabsTrigger value="credits" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">الرصيد</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
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
  )
}
