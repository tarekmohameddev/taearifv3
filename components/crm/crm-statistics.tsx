"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  TrendingUp,
  Target,
  Handshake,
  CheckCircle,
  Calendar,
  DollarSign,
  Clock,
  BarChart3,
} from "lucide-react"
import { Customer, PipelineStage } from "@/types/crm"

interface CrmStatisticsProps {
  totalCustomers: number
  customersData: Customer[]
  pipelineStages: PipelineStage[]
  pipelineStats: any[]
  scheduledAppointments: number
  totalAppointments: number
}

export default function CrmStatistics({
  totalCustomers,
  customersData,
  pipelineStages,
  pipelineStats,
  scheduledAppointments,
  totalAppointments,
}: CrmStatisticsProps) {
  return (
    <div className="space-y-6">

      {/* Analytics Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="ml-2 h-5 w-5" />
              معدل التحويل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {totalCustomers > 0
                ? Math.round(
                    ((pipelineStats.find((s) => s.id === "closed-won")?.count || 0) / totalCustomers) * 100,
                  )
                : 0}
              %
            </div>
            <p className="text-sm text-muted-foreground">من العملاء المحتملين إلى صفقات مكتملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="ml-2 h-5 w-5" />
              متوسط قيمة الصفقة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {totalCustomers > 0 ? Math.round(totalCustomers / totalCustomers / 1000) : 0}ك ريال
            </div>
            <p className="text-sm text-muted-foreground">متوسط قيمة الصفقة لكل عميل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="ml-2 h-5 w-5" />
              متوسط دورة المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">45 يوم</div>
            <p className="text-sm text-muted-foreground">من العميل المحتمل إلى إتمام الصفقة</p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">توزيع العملاء حسب المرحلة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineStats.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                  <span className="font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{stage.count} عميل</span>
                  <span className="font-semibold">{(stage.value / 1000).toFixed(0)}ك ريال</span>
                  <div className="w-24">
                    <Progress
                      value={totalCustomers > 0 ? (stage.count / totalCustomers) * 100 : 0}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 