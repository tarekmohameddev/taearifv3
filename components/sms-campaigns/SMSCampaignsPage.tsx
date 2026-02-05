"use client";

import { useState } from "react";
import { MessageSquare, Send, Users, CheckCircle2, XCircle, Clock, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockCampaigns, mockTemplates, mockStats, mockLogs } from "./mock-data";

export function SMSCampaignsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "scheduled": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "in-progress": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "draft": return "bg-gray-500/10 text-gray-700 border-gray-500/20";
      case "delivered": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "failed": return "bg-red-500/10 text-red-700 border-red-500/20";
      case "pending": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "promotional": return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "transactional": return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "reminder": return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "notification": return "bg-green-500/10 text-green-700 border-green-500/20";
      case "follow-up": return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">حملات الرسائل النصية</h1>
        <p className="text-muted-foreground mt-1">إنشاء وإدارة حملات الرسائل النصية</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحملات</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">جميع الحملات</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المرسلة</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.thisMonthSent.toLocaleString()} هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم التوصيل</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalDelivered.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.deliveryRate}% نسبة التوصيل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فشل</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalFailed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((mockStats.totalFailed / mockStats.totalSent) * 100).toFixed(1)}% معدل الفشل
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockStats.deliveryRate}%</div>
            <Progress value={mockStats.deliveryRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="campaigns">الحملات</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
          <TabsTrigger value="logs">السجل</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>الحملات النشطة</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 ml-2" />
                    حملة جديدة
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCampaigns.filter(c => c.status !== 'draft').slice(0, 3).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {campaign.status === 'sent' ? 'مرسلة' :
                             campaign.status === 'scheduled' ? 'مجدولة' :
                             campaign.status === 'in-progress' ? 'جارية' : 'مسودة'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{campaign.recipientCount} مستلم</span>
                          {campaign.sentCount > 0 && (
                            <span>{campaign.deliveredCount} تم التوصيل</span>
                          )}
                        </div>
                        {campaign.status === 'in-progress' && campaign.recipientCount > 0 && (
                          <Progress 
                            value={(campaign.sentCount / campaign.recipientCount) * 100} 
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>القوالب الأكثر استخداماً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTemplates.filter(t => t.isActive).slice(0, 4).map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <h4 className="font-medium">{template.name}</h4>
                        </div>
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {template.category === 'promotional' ? 'ترويجي' :
                           template.category === 'transactional' ? 'معاملات' :
                           template.category === 'reminder' ? 'تذكير' :
                           template.category === 'notification' ? 'إشعار' : 'متابعة'}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">استخدام</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>جميع الحملات</CardTitle>
                  <CardDescription>إدارة وعرض جميع حملات الرسائل النصية</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  إنشاء حملة جديدة
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCampaigns.map((campaign) => (
                  <Card key={campaign.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            <Badge variant="outline" className={getStatusColor(campaign.status)}>
                              {campaign.status === 'sent' ? 'مرسلة' :
                               campaign.status === 'scheduled' ? 'مجدولة' :
                               campaign.status === 'in-progress' ? 'جارية' : 'مسودة'}
                            </Badge>
                          </div>
                          {campaign.description && (
                            <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">تعديل</Button>
                          <Button variant="outline" size="sm">نسخ</Button>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg mb-4">
                        <p className="text-sm">{campaign.message}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">إجمالي المستلمين</p>
                          <p className="text-2xl font-bold">{campaign.recipientCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تم الإرسال</p>
                          <p className="text-2xl font-bold">{campaign.sentCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تم التوصيل</p>
                          <p className="text-2xl font-bold text-green-600">{campaign.deliveredCount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">فشل</p>
                          <p className="text-2xl font-bold text-red-600">{campaign.failedCount}</p>
                        </div>
                      </div>

                      {campaign.status === 'in-progress' && campaign.recipientCount > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">التقدم</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.round((campaign.sentCount / campaign.recipientCount) * 100)}%
                            </span>
                          </div>
                          <Progress value={(campaign.sentCount / campaign.recipientCount) * 100} />
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          {campaign.scheduledAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>مجدولة: {new Date(campaign.scheduledAt).toLocaleString('ar-SA')}</span>
                            </div>
                          )}
                          {campaign.sentAt && (
                            <div className="flex items-center gap-1">
                              <Send className="h-4 w-4" />
                              <span>أرسلت: {new Date(campaign.sentAt).toLocaleString('ar-SA')}</span>
                            </div>
                          )}
                          <span>بواسطة: {campaign.createdBy}</span>
                        </div>
                        {campaign.tags && campaign.tags.length > 0 && (
                          <div className="flex gap-1">
                            {campaign.tags.map((tag, idx) => (
                              <Badge key={idx} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>قوالب الرسائل</CardTitle>
                  <CardDescription>إدارة القوالب المحفوظة للرسائل</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  قالب جديد
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-2">{template.name}</h4>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className={getCategoryColor(template.category)}>
                              {template.category === 'promotional' ? 'ترويجي' :
                               template.category === 'transactional' ? 'معاملات' :
                               template.category === 'reminder' ? 'تذكير' :
                               template.category === 'notification' ? 'إشعار' : 'متابعة'}
                            </Badge>
                            <Badge variant={template.isActive ? "default" : "secondary"}>
                              {template.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted p-3 rounded-lg mb-4">
                        <p className="text-sm whitespace-pre-wrap">{template.content}</p>
                      </div>

                      {template.variables.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">المتغيرات:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {`[${variable}]`}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          آخر تحديث: {new Date(template.updatedAt).toLocaleDateString('ar-SA')}
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">استخدام</Button>
                          <Button variant="outline" size="sm">تعديل</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>سجل الإرسال</CardTitle>
              <CardDescription>عرض تفصيلي لجميع الرسائل المرسلة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 w-2 h-2 rounded-full ${
                        log.status === 'delivered' ? 'bg-green-500' :
                        log.status === 'sent' ? 'bg-blue-500' :
                        log.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{log.contactName}</p>
                          <Badge variant="outline" className={getStatusColor(log.status)}>
                            {log.status === 'delivered' ? 'تم التوصيل' :
                             log.status === 'sent' ? 'مرسلة' :
                             log.status === 'failed' ? 'فشل' : 'قيد الإرسال'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.phone}</p>
                        <div className="bg-muted p-2 rounded text-sm mb-2">
                          {log.message}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>الحملة: {log.campaignName}</span>
                          <span>أرسلت: {new Date(log.sentAt).toLocaleString('ar-SA')}</span>
                          {log.deliveredAt && (
                            <span>وصلت: {new Date(log.deliveredAt).toLocaleString('ar-SA')}</span>
                          )}
                        </div>
                        {log.errorMessage && (
                          <p className="text-xs text-red-600 mt-1">خطأ: {log.errorMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
