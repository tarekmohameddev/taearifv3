"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header"
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar"
import { RentalApplicationsService } from "@/components/rental-management/services/rental-applications-service"
import { RentalAgreementsService } from "@/components/rental-management/services/rental-agreements-service"
import { RentalPaymentsService } from "@/components/rental-management/services/rental-payments-service"
import { RentalMaintenanceService } from "@/components/rental-management/services/rental-maintenance-service"
import { RentalOverviewService } from "@/components/rental-management/services/rental-overview-service"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CreditCard, Wrench, Users, Home } from "lucide-react"

export function RentalManagementDashboard() {
  const [activeService, setActiveService] = useState("overview")
  const [openAddDialogCounter, setOpenAddDialogCounter] = useState(0)
  const [openCreateMaintenanceCounter, setOpenCreateMaintenanceCounter] = useState(0)

  console.log("🏗️ Dashboard State:", { 
    activeService, 
    openAddDialogCounter, 
    openCreateMaintenanceCounter 
  })

  const services = [
    {
      id: "overview",
      name: "نظرة عامة",
      nameEn: "Overview",
      icon: Home,
      description: "لوحة المعلومات الرئيسية للإيجارات",
    },
    {
      id: "applications",
      name: "طلبات الإيجار",
      nameEn: "Rental Requests",
      icon: Users,
      description: "إدارة طلبات الإيجار الجديدة",
    },
    // {
    //   id: "agreements",
    //   name: "عقود الإيجار",
    //   nameEn: "Rental Agreements",
    //   icon: FileText,
    //   description: "إدارة عقود الإيجار النشطة",
    // },
    // {
    //   id: "payments",
    //   name: "المدفوعات",
    //   nameEn: "Payments",
    //   icon: CreditCard,
    //   description: "تتبع مدفوعات الإيجار",
    // },
    {
      id: "maintenance",
      name: "الصيانة",
      nameEn: "Maintenance",
      icon: Wrench,
      description: "طلبات الصيانة والخدمات",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="properties" setActiveTab={() => {}} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">نظام إدارة الإيجارات</h1>
              <p className="text-muted-foreground">نظام شامل لإدارة الإيجارات العقارية في المملكة العربية السعودية</p>
            </div>

            <Tabs value={activeService} onValueChange={setActiveService} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                {services.map((service) => (
                  <TabsTrigger key={service.id} value={service.id} className="flex items-center gap-2">
                    <service.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{service.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <RentalOverviewService
                  onAddRentalClick={() => {
                    console.log("🏠 Add Rental Click - Before:", { openAddDialogCounter })
                    setActiveService("applications")
                    // Add a small delay to ensure tab switch happens first
                    setTimeout(() => {
                      setOpenAddDialogCounter((c) => {
                        const newCount = c + 1
                        console.log("🏠 Add Rental Click - After:", { oldCount: c, newCount })
                        return newCount
                      })
                    }, 100)
                  }}
                  onCreateMaintenanceClick={() => {
                    console.log("🔧 Maintenance Click - Before:", { openCreateMaintenanceCounter })
                    setActiveService("maintenance")
                    setOpenCreateMaintenanceCounter((c) => {
                      const newCount = c + 1
                      console.log("🔧 Maintenance Click - After:", { oldCount: c, newCount })
                      return newCount
                    })
                  }}
                />
              </TabsContent>

              <TabsContent value="applications" className="space-y-6">
                <RentalApplicationsService openAddDialogCounter={openAddDialogCounter} />
              </TabsContent>

              <TabsContent value="agreements" className="space-y-6">
                <RentalAgreementsService />
              </TabsContent>

              <TabsContent value="payments" className="space-y-6">
                <RentalPaymentsService />
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-6">
                <RentalMaintenanceService openCreateDialogCounter={openCreateMaintenanceCounter} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
