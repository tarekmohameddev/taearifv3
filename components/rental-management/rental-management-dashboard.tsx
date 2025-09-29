"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header"
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar"
import { RentalApplicationsService } from "@/components/rental-management/services/rental-applications-service"
import { RentalAgreementsService } from "@/components/rental-management/services/rental-agreements-service"
import { RentalPaymentsService } from "@/components/rental-management/services/rental-payments-service"
import { RentalDashboardStats } from "@/components/rental-management/dashboard-stats"
// import { RentalMaintenanceService } from "@/components/rental-management/services/rental-maintenance-service"
// import { RentalOverviewService } from "@/components/rental-management/services/rental-overview-service"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CreditCard, Wrench, Users, Home } from "lucide-react"
import useAuthStore from "@/context/AuthContext"

export function RentalManagementDashboard() {
  const [openAddDialogCounter, setOpenAddDialogCounter] = useState(0)
  const { userData } = useAuthStore()

  console.log("🏗️ Dashboard State:", { 
    openAddDialogCounter
  })

  // كود الصيانة مخفي ولكن موجود
  // const services = [
  //   {
  //     id: "overview",
  //     name: "نظرة عامة",
  //     nameEn: "Overview",
  //     icon: Home,
  //     description: "لوحة المعلومات الرئيسية للإيجارات",
  //   },
  //   {
  //     id: "applications",
  //     name: "طلبات الإيجار",
  //     nameEn: "Rental Requests",
  //     icon: Users,
  //     description: "إدارة طلبات الإيجار الجديدة",
  //   },
  //   {
  //     id: "agreements",
  //     name: "طلبات الإيجار",
  //     nameEn: "Rental Agreements",
  //     icon: FileText,
  //     description: "إدارة طلبات الإيجار النشطة",
  //   },
  //   {
  //     id: "payments",
  //     name: "المدفوعات",
  //     nameEn: "Payments",
  //     icon: CreditCard,
  //     description: "تتبع مدفوعات الإيجار",
  //   },
  //   {
  //     id: "maintenance",
  //     name: "الصيانة",
  //     nameEn: "Maintenance",
  //     icon: Wrench,
  //     description: "طلبات الصيانة والخدمات",
  //   },
  // ]

  // التحقق من وجود التوكن قبل عرض المحتوى
  if (!userData?.token) {
    return (
      <div className="flex min-h-screen flex-col" dir="rtl">
        <DashboardHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
          <main className="flex-1 p-4 md:p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-lg text-gray-500">يرجى تسجيل الدخول لعرض المحتوى</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">نظام إدارة الإيجارات</h1>
              <p className="text-muted-foreground">نظام شامل لإدارة الإيجارات العقارية في المملكة العربية السعودية</p>
            </div>

            {/* إحصائيات لوحة المعلومات */}
            <div className="space-y-6">
              <RentalDashboardStats />
            </div>

            {/* طلبات الإيجار */}
            <div className="space-y-6">
              <RentalApplicationsService openAddDialogCounter={openAddDialogCounter} />
            </div>

            {/* كود الصيانة مخفي ولكن موجود */}
            {/* 
            <div className="space-y-6">
              <RentalMaintenanceService openCreateDialogCounter={openCreateMaintenanceCounter} />
            </div>
            */}
          </div>
        </main>
      </div>
    </div>
  )
}
