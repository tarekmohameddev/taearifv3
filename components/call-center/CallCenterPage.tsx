"use client";

import { useState } from "react";
import { Phone, PhoneCall, PhoneIncoming, PhoneMissed, Clock, TrendingUp, Users, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockCallLogs, mockCallScripts, mockAgents, mockCallStats } from "./mock-data";
import { formatDuration, formatDateTime } from "@/lib/utils";

export function CallCenterPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "in-progress": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "missed": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "voicemail": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case "interested": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "callback": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "not-interested": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "complaint": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "on-call": return "bg-blue-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">مركز الاتصال</h1>
        <p className="text-muted-foreground mt-1">إدارة المكالمات وتتبع أداء الوكلاء</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المكالمات</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCallStats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              {mockCallStats.todayCalls} مكالمة اليوم
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المكالمات الواردة</CardTitle>
            <PhoneIncoming className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCallStats.inboundCalls}</div>
            <p className="text-xs text-muted-foreground">
              {mockCallStats.missedCalls} مكالمة فائتة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المكالمات الصادرة</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCallStats.outboundCalls}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockCallStats.outboundCalls / mockCallStats.totalCalls) * 100)}% من الإجمالي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط المدة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(mockCallStats.averageDuration / 60)}:{String(mockCallStats.averageDuration % 60).padStart(2, '0')}</div>
            <p className="text-xs text-muted-foreground">
              {mockCallStats.successfulCalls} مكالمة ناجحة
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="logs">سجل المكالمات</TabsTrigger>
          <TabsTrigger value="agents">الوكلاء</TabsTrigger>
          <TabsTrigger value="scripts">السكريبتات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>أحدث المكالمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCallLogs.slice(0, 5).map((call) => (
                    <div key={call.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${call.type === 'inbound' ? 'bg-blue-500' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-medium">{call.customerName}</p>
                          <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(call.status)}>
                        {call.status === 'completed' ? 'مكتملة' : 
                         call.status === 'in-progress' ? 'جارية' :
                         call.status === 'missed' ? 'فائتة' : 'بريد صوتي'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>حالة الوكلاء</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent.status)}`} />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.totalCalls} مكالمة</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{agent.successRate}%</p>
                        <p className="text-xs text-muted-foreground">نسبة النجاح</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Call Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل جميع المكالمات</CardTitle>
              <CardDescription>عرض وإدارة سجل المكالمات الكامل</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCallLogs.map((call) => (
                  <Card key={call.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          {call.type === 'inbound' ? (
                            <PhoneIncoming className="h-5 w-5 text-blue-500 mt-1" />
                          ) : (
                            <PhoneCall className="h-5 w-5 text-green-500 mt-1" />
                          )}
                          <div>
                            <h4 className="font-semibold">{call.customerName}</h4>
                            <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(call.status)}>
                          {call.status === 'completed' ? 'مكتملة' : 
                           call.status === 'in-progress' ? 'جارية' :
                           call.status === 'missed' ? 'فائتة' : 'بريد صوتي'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">الوكيل</p>
                          <p className="font-medium">{call.agentName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">المدة</p>
                          <p className="font-medium">
                            {call.duration > 0 ? `${Math.floor(call.duration / 60)}:${String(call.duration % 60).padStart(2, '0')}` : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">وقت البداية</p>
                          <p className="font-medium">{new Date(call.startTime).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        {call.outcome && (
                          <div>
                            <p className="text-muted-foreground">النتيجة</p>
                            <Badge variant="outline" className={getOutcomeColor(call.outcome)}>
                              {call.outcome === 'interested' ? 'مهتم' :
                               call.outcome === 'callback' ? 'إعادة اتصال' :
                               call.outcome === 'not-interested' ? 'غير مهتم' :
                               call.outcome === 'complaint' ? 'شكوى' : 'استفسار'}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {call.notes && (
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm">{call.notes}</p>
                        </div>
                      )}

                      {call.propertyName && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>العقار: {call.propertyName}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إدارة الوكلاء</CardTitle>
              <CardDescription>عرض أداء ومعلومات الوكلاء</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockAgents.map((agent) => (
                  <Card key={agent.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${getAgentStatusColor(agent.status)}`} />
                          <div>
                            <h4 className="font-semibold">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {agent.status === 'available' ? 'متاح' :
                           agent.status === 'on-call' ? 'في مكالمة' :
                           agent.status === 'busy' ? 'مشغول' : 'غير متصل'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">{agent.totalCalls}</p>
                          <p className="text-xs text-muted-foreground">مكالمة</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{Math.floor(agent.averageDuration / 60)}م</p>
                          <p className="text-xs text-muted-foreground">متوسط المدة</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{agent.successRate}%</p>
                          <p className="text-xs text-muted-foreground">نسبة النجاح</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts Tab */}
        <TabsContent value="scripts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>سكريبتات المكالمات</CardTitle>
                  <CardDescription>إدارة نصوص المكالمات المحفوظة</CardDescription>
                </div>
                <Button>إضافة سكريبت جديد</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCallScripts.map((script) => (
                  <Card key={script.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{script.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{script.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={script.isActive ? "default" : "secondary"}>
                            {script.isActive ? 'نشط' : 'غير نشط'}
                          </Badge>
                          <Badge variant="outline">
                            {script.category === 'sales' ? 'مبيعات' :
                             script.category === 'support' ? 'دعم' :
                             script.category === 'follow-up' ? 'متابعة' :
                             script.category === 'complaint' ? 'شكاوى' : 'استفسار'}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm whitespace-pre-wrap font-sans">{script.script}</pre>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xs text-muted-foreground">
                          آخر تحديث: {new Date(script.updatedAt).toLocaleDateString('ar-SA')}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">تعديل</Button>
                          <Button variant="outline" size="sm">نسخ</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
