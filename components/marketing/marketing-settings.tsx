"use client"

import { useState } from "react"
import { Settings, MessageSquare, Clock, Users, Shield, Bell, Globe, Zap, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import useStore from "@/context/Store"

interface MessageSettings {
  autoReply: boolean
  autoReplyMessage: string
  businessHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
  rateLimiting: {
    enabled: boolean
    maxMessagesPerHour: number
    maxMessagesPerDay: number
  }
  templates: {
    welcomeMessage: string
    thankYouMessage: string
    orderConfirmation: string
    appointmentReminder: string
  }
}

interface NotificationSettings {
  newMessage: boolean
  campaignComplete: boolean
  lowCredits: boolean
  systemUpdates: boolean
  emailNotifications: boolean
  smsNotifications: boolean
}

interface SystemIntegrations {
  crm: boolean
  ecommerce: boolean
  appointments: boolean
  analytics: boolean
  webhooks: {
    enabled: boolean
    url: string
    events: string[]
  }
}

export function MarketingSettingsComponent() {
  const {
    marketingSettings,
    updateMessageSettings,
    updateNotificationSettings,
    updateSystemIntegrations,
    saveMarketingSettings,
  } = useStore()

  const availableEvents = [
    { id: "message_received", label: "رسالة واردة" },
    { id: "message_sent", label: "رسالة مُرسلة" },
    { id: "campaign_started", label: "بدء حملة" },
    { id: "campaign_completed", label: "انتهاء حملة" },
    { id: "number_connected", label: "ربط رقم جديد" },
    { id: "credits_low", label: "انخفاض الرصيد" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="h-5 w-5 ml-2 text-primary" />
            إعدادات التسويق
          </h2>
          <p className="text-sm text-muted-foreground">تكوين إعدادات الرسائل والإشعارات والتكاملات</p>
        </div>

        <Button onClick={saveMarketingSettings} disabled={marketingSettings.isSaving} className="flex items-center gap-2">
          {marketingSettings.isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              حفظ الإعدادات
            </>
          )}
        </Button>
      </div>

      {/* Save Status Alert */}
      {marketingSettings.saveStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">تم حفظ الإعدادات بنجاح!</AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">الرسائل</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">الإشعارات</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">التكاملات</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">الأمان</span>
          </TabsTrigger>
        </TabsList>

        {/* Messages Settings */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 ml-2" />
                إعدادات الرسائل التلقائية
              </CardTitle>
              <CardDescription>تكوين الردود التلقائية وساعات العمل</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Reply */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">الرد التلقائي</Label>
                  <p className="text-sm text-muted-foreground">إرسال رد تلقائي عند استلام رسالة جديدة</p>
                </div>
                <Switch
                  checked={marketingSettings.messageSettings.autoReply}
                  onCheckedChange={(checked) => updateMessageSettings({ autoReply: checked })}
                />
              </div>

              {marketingSettings.messageSettings.autoReply && (
                <div className="space-y-2">
                  <Label htmlFor="autoReplyMessage">نص الرد التلقائي</Label>
                  <Textarea
                    id="autoReplyMessage"
                    value={marketingSettings.messageSettings.autoReplyMessage}
                    onChange={(e) => updateMessageSettings({ autoReplyMessage: e.target.value })}
                    placeholder="أدخل نص الرد التلقائي..."
                    rows={3}
                  />
                </div>
              )}

              {/* Business Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">ساعات العمل</Label>
                    <p className="text-sm text-muted-foreground">تحديد ساعات العمل لإرسال الرسائل</p>
                  </div>
                  <Switch
                    checked={marketingSettings.messageSettings.businessHours.enabled}
                    onCheckedChange={(checked) =>
                      updateMessageSettings({
                        businessHours: { ...marketingSettings.messageSettings.businessHours, enabled: checked },
                      })
                    }
                  />
                </div>

                {marketingSettings.messageSettings.businessHours.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="startTime">بداية العمل</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={marketingSettings.messageSettings.businessHours.start}
                        onChange={(e) =>
                          updateMessageSettings({
                            businessHours: { ...marketingSettings.messageSettings.businessHours, start: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">نهاية العمل</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={marketingSettings.messageSettings.businessHours.end}
                        onChange={(e) =>
                          updateMessageSettings({
                            businessHours: { ...marketingSettings.messageSettings.businessHours, end: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">المنطقة الزمنية</Label>
                      <Select
                        value={marketingSettings.messageSettings.businessHours.timezone}
                        onValueChange={(value) =>
                          updateMessageSettings({
                            businessHours: { ...marketingSettings.messageSettings.businessHours, timezone: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                          <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                          <SelectItem value="Asia/Kuwait">الكويت (GMT+3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Rate Limiting */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">تحديد معدل الإرسال</Label>
                    <p className="text-sm text-muted-foreground">تحديد عدد الرسائل المسموح إرسالها</p>
                  </div>
                  <Switch
                    checked={marketingSettings.messageSettings.rateLimiting.enabled}
                    onCheckedChange={(checked) =>
                      updateMessageSettings({
                        rateLimiting: { ...marketingSettings.messageSettings.rateLimiting, enabled: checked },
                      })
                    }
                  />
                </div>

                {marketingSettings.messageSettings.rateLimiting.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hourlyLimit">الحد الأقصى في الساعة</Label>
                      <Input
                        id="hourlyLimit"
                        type="number"
                        value={marketingSettings.messageSettings.rateLimiting.maxMessagesPerHour}
                        onChange={(e) =>
                          updateMessageSettings({
                            rateLimiting: { ...marketingSettings.messageSettings.rateLimiting, maxMessagesPerHour: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dailyLimit">الحد الأقصى في اليوم</Label>
                      <Input
                        id="dailyLimit"
                        type="number"
                        value={marketingSettings.messageSettings.rateLimiting.maxMessagesPerDay}
                        onChange={(e) =>
                          updateMessageSettings({
                            rateLimiting: { ...marketingSettings.messageSettings.rateLimiting, maxMessagesPerDay: Number.parseInt(e.target.value) },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Templates */}
          <Card>
            <CardHeader>
              <CardTitle>قوالب الرسائل</CardTitle>
              <CardDescription>قوالب جاهزة للرسائل المختلفة في النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="welcomeTemplate">رسالة الترحيب</Label>
                <Textarea
                  id="welcomeTemplate"
                  value={marketingSettings.messageSettings.templates.welcomeMessage}
                  onChange={(e) =>
                    updateMessageSettings({
                      templates: { ...marketingSettings.messageSettings.templates, welcomeMessage: e.target.value },
                    })
                  }
                  placeholder="رسالة ترحيب للعملاء الجدد..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  يمكنك استخدام {"{company_name}"} للإشارة إلى اسم الشركة
                </p>
              </div>

              <div>
                <Label htmlFor="thankYouTemplate">رسالة الشكر</Label>
                <Textarea
                  id="thankYouTemplate"
                  value={marketingSettings.messageSettings.templates.thankYouMessage}
                  onChange={(e) =>
                    updateMessageSettings({
                      templates: { ...marketingSettings.messageSettings.templates, thankYouMessage: e.target.value },
                    })
                  }
                  placeholder="رسالة شكر للعملاء..."
                />
              </div>

              <div>
                <Label htmlFor="orderTemplate">تأكيد الطلب</Label>
                <Textarea
                  id="orderTemplate"
                  value={marketingSettings.messageSettings.templates.orderConfirmation}
                  onChange={(e) =>
                    updateMessageSettings({
                      templates: { ...marketingSettings.messageSettings.templates, orderConfirmation: e.target.value },
                    })
                  }
                  placeholder="رسالة تأكيد الطلب..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  متغيرات متاحة: {"{order_id}"}, {"{delivery_time}"}
                </p>
              </div>

              <div>
                <Label htmlFor="appointmentTemplate">تذكير الموعد</Label>
                <Textarea
                  id="appointmentTemplate"
                  value={marketingSettings.messageSettings.templates.appointmentReminder}
                  onChange={(e) =>
                    updateMessageSettings({
                      templates: { ...marketingSettings.messageSettings.templates, appointmentReminder: e.target.value },
                    })
                  }
                  placeholder="رسالة تذكير بالموعد..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  متغيرات متاحة: {"{appointment_time}"}, {"{staff_name}"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 ml-2" />
                إعدادات الإشعارات
              </CardTitle>
              <CardDescription>تحديد أنواع الإشعارات التي تريد استلامها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* App Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">إشعارات التطبيق</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>رسائل جديدة</Label>
                    <p className="text-sm text-muted-foreground">إشعار عند استلام رسالة جديدة</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.newMessage}
                    onCheckedChange={(checked) => updateNotificationSettings({ newMessage: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>اكتمال الحملات</Label>
                    <p className="text-sm text-muted-foreground">إشعار عند انتهاء حملة تسويقية</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.campaignComplete}
                    onCheckedChange={(checked) => updateNotificationSettings({ campaignComplete: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>انخفاض الرصيد</Label>
                    <p className="text-sm text-muted-foreground">تحذير عند انخفاض رصيد الرسائل</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.lowCredits}
                    onCheckedChange={(checked) => updateNotificationSettings({ lowCredits: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>تحديثات النظام</Label>
                    <p className="text-sm text-muted-foreground">إشعارات حول تحديثات وميزات جديدة</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => updateNotificationSettings({ systemUpdates: checked })}
                  />
                </div>
              </div>

              {/* External Notifications */}
              <div className="space-y-4">
                <h3 className="font-medium">الإشعارات الخارجية</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => updateNotificationSettings({ emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>الرسائل النصية</Label>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات عبر SMS</p>
                  </div>
                  <Switch
                    checked={marketingSettings.notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => updateNotificationSettings({ smsNotifications: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 ml-2" />
                تكاملات النظام
              </CardTitle>
              <CardDescription>ربط التسويق مع أجزاء أخرى من النظام</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base">نظام CRM</Label>
                      <p className="text-sm text-muted-foreground">ربط مع إدارة العملاء</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingSettings.systemIntegrations.crm}
                    onCheckedChange={(checked) => updateSystemIntegrations({ crm: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-base">التجارة الإلكترونية</Label>
                      <p className="text-sm text-muted-foreground">ربط مع المتجر الإلكتروني</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingSettings.systemIntegrations.ecommerce}
                    onCheckedChange={(checked) => updateSystemIntegrations({ ecommerce: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-base">نظام المواعيد</Label>
                      <p className="text-sm text-muted-foreground">إرسال تذكيرات المواعيد</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingSettings.systemIntegrations.appointments}
                    onCheckedChange={(checked) => updateSystemIntegrations({ appointments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label className="text-base">التحليلات</Label>
                      <p className="text-sm text-muted-foreground">تتبع أداء الحملات</p>
                    </div>
                  </div>
                  <Switch
                    checked={marketingSettings.systemIntegrations.analytics}
                    onCheckedChange={(checked) => updateSystemIntegrations({ analytics: checked })}
                  />
                </div>
              </div>

              {/* Webhooks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Webhooks</Label>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات إلى URL خارجي</p>
                  </div>
                  <Switch
                    checked={marketingSettings.systemIntegrations.webhooks.enabled}
                    onCheckedChange={(checked) =>
                      updateSystemIntegrations({
                        webhooks: { ...marketingSettings.systemIntegrations.webhooks, enabled: checked },
                      })
                    }
                  />
                </div>

                {marketingSettings.systemIntegrations.webhooks.enabled && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="webhookUrl">رابط Webhook</Label>
                      <Input
                        id="webhookUrl"
                        type="url"
                        placeholder="https://example.com/webhook"
                        value={marketingSettings.systemIntegrations.webhooks.url}
                        onChange={(e) =>
                          updateSystemIntegrations({
                            webhooks: { ...marketingSettings.systemIntegrations.webhooks, url: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>الأحداث المُفعلة</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {availableEvents.map((event) => (
                          <div key={event.id} className="flex items-center space-x-2 space-x-reverse">
                            <input
                              type="checkbox"
                              id={event.id}
                              checked={marketingSettings.systemIntegrations.webhooks.events.includes(event.id)}
                              onChange={(e) => {
                                const events = e.target.checked
                                  ? [...marketingSettings.systemIntegrations.webhooks.events, event.id]
                                  : marketingSettings.systemIntegrations.webhooks.events.filter((id) => id !== event.id)
                                updateSystemIntegrations({
                                  webhooks: { ...marketingSettings.systemIntegrations.webhooks, events },
                                })
                              }}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor={event.id} className="text-sm">
                              {event.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 ml-2" />
                إعدادات الأمان
              </CardTitle>
              <CardDescription>تكوين إعدادات الأمان والخصوصية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>ملاحظة:</strong> إعدادات الأمان تتطلب صلاحيات إدارية عالية. تأكد من فهم تأثير كل إعداد قبل
                  التغيير.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">تشفير البيانات</h3>
                  <p className="text-sm text-muted-foreground mb-3">جميع الرسائل والبيانات الحساسة مُشفرة تلقائياً</p>
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">مراجعة الأنشطة</h3>
                  <p className="text-sm text-muted-foreground mb-3">تسجيل جميع العمليات المهمة للمراجعة</p>
                  <Badge className="bg-green-100 text-green-800">مُفعل</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">التحقق الثنائي</h3>
                  <p className="text-sm text-muted-foreground mb-3">طبقة حماية إضافية للعمليات الحساسة</p>
                  <Badge className="bg-yellow-100 text-yellow-800">قيد التطوير</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
