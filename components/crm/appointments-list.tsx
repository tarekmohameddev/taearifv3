"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Eye,
  Edit,
  Phone,
  MessageSquare,
  Bell,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import type { Appointment } from "@/types/crm";

interface AppointmentsListProps {
  appointmentsData: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onAddAppointment: () => void;
}

export default function AppointmentsList({
  appointmentsData,
  onViewAppointment,
  onEditAppointment,
  onAddAppointment,
}: AppointmentsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "مجدول":
        return "bg-blue-500";
      case "مكتمل":
        return "bg-green-500";
      case "ملغي":
        return "bg-red-500";
      case "مؤجل":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "عالية":
        return "border-red-500 text-red-700";
      case "متوسطة":
        return "border-yellow-500 text-yellow-700";
      case "منخفضة":
        return "border-green-500 text-green-700";
      default:
        return "border-gray-500 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">إدارة المواعيد</h3>
          <p className="text-sm text-muted-foreground">
            عرض وإدارة جميع مواعيد العملاء
          </p>
        </div>
        <Button onClick={onAddAppointment}>
          <Plus className="ml-2 h-4 w-4" />
          موعد جديد
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointmentsData.map((appointment) => (
          <Card
            key={appointment.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1 h-16 rounded-full ${getStatusColor(appointment.status)}`}
                  />
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={appointment.customer?.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {appointment.customer?.name
                          ?.split(" ")
                          ?.slice(0, 2)
                          ?.map((n) => n[0])
                          ?.join("") || "عميل"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {appointment.customer?.name || "عميل غير محدد"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.datetime
                            ? new Date(appointment.datetime).toLocaleDateString(
                                "en-GB",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  timeZone: "Asia/Riyadh",
                                },
                              )
                            : appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.datetime
                            ? new Date(appointment.datetime).toLocaleTimeString(
                                "ar-SA",
                                { hour: "2-digit", minute: "2-digit" },
                              )
                            : appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getPriorityColor(
                      appointment.priority_label || "متوسطة",
                    )}
                  >
                    {appointment.priority_label || "متوسطة"}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    تذكير
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewAppointment(appointment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditAppointment(appointment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
