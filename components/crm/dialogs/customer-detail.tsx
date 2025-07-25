"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Phone, Mail, User, Building2, MessageSquare, Bell, Activity, FileText } from "lucide-react"
import useCrmStore from "@/context/store/crm"

export default function CustomerDetailDialog() {
  const { 
    showCustomerDialog, 
    selectedCustomer, 
    setShowCustomerDialog,
    setSelectedCustomer,
    setShowAddNoteDialog,
    setShowAddReminderDialog,
    setShowAddInteractionDialog
  } = useCrmStore()

  if (!selectedCustomer) return null

  const handleClose = () => {
    setShowCustomerDialog(false)
    setTimeout(() => setSelectedCustomer(null), 150)
  }

  return (
    <Dialog open={showCustomerDialog} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {selectedCustomer.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedCustomer.customerType}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">المعلومات الأساسية</TabsTrigger>
            <TabsTrigger value="interactions">التفاعلات</TabsTrigger>
            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
            <TabsTrigger value="reminders">التذكيرات</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    معلومات الاتصال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.phone || "لا يوجد"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.whatsapp || "لا يوجد"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.email || "لا يوجد"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    الموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.city || "لا يوجد"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCustomer.district || "لا يوجد"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    معلومات إضافية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>المسؤول:</span>
                    <Badge variant="secondary">{selectedCustomer.assignedAgent || "غير محدد"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الأولوية:</span>
                    <Badge variant="outline">{selectedCustomer.urgency || "عادية"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>آخر تواصل:</span>
                    <span className="text-sm text-muted-foreground">
                      {selectedCustomer.lastContact || "لا يوجد"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>قيمة الصفقة:</span>
                    <Badge variant="secondary">
                      {selectedCustomer.dealValue ? `${selectedCustomer.dealValue} ر.س` : "غير محدد"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">سجل التفاعلات</h3>
              <Button onClick={() => setShowAddInteractionDialog(true)}>
                <Activity className="ml-2 h-4 w-4" />
                إضافة تفاعل
              </Button>
            </div>
            <div className="space-y-3">
              {selectedCustomer.interactions && Array.isArray(selectedCustomer.interactions) && selectedCustomer.interactions.length > 0 ? (
                selectedCustomer.interactions.map((interaction: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{interaction.type}</p>
                            <p className="text-sm text-muted-foreground">{interaction.notes}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {interaction.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {interaction.duration}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">لا توجد تفاعلات مسجلة</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">الملاحظات</h3>
              <Button onClick={() => setShowAddNoteDialog(true)}>
                <FileText className="ml-2 h-4 w-4" />
                إضافة ملاحظة
              </Button>
            </div>
            <div className="space-y-3">
              {selectedCustomer.notes && Array.isArray(selectedCustomer.notes) && selectedCustomer.notes.length > 0 ? (
                selectedCustomer.notes.map((note: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-green-600 mt-1" />
                          <div>
                            <p className="text-sm">{note.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              بواسطة: {note.author} • {note.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">لا توجد ملاحظات</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">التذكيرات</h3>
              <Button onClick={() => setShowAddReminderDialog(true)}>
                <Bell className="ml-2 h-4 w-4" />
                إضافة تذكير
              </Button>
            </div>
            <div className="space-y-3">
              {selectedCustomer.reminders && Array.isArray(selectedCustomer.reminders) && selectedCustomer.reminders.length > 0 ? (
                selectedCustomer.reminders.map((reminder: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Bell className="h-4 w-4 text-orange-600 mt-1" />
                          <div>
                            <p className="font-medium">{reminder.title}</p>
                            <p className="text-sm text-muted-foreground">{reminder.description}</p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {reminder.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reminder.time}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">لا توجد تذكيرات</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 