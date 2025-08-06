"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wrench,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Building2,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Settings,
} from "lucide-react"

interface MaintenanceRequest {
  id: string
  requestNumber: string
  contractId: string
  contractNumber: string
  propertyTitle: string
  propertyTitleAr: string
  propertyAddress: string
  propertyAddressAr: string
  tenant: {
    name: string
    nameAr: string
    phone: string
    email: string
  }
  requestDetails: {
    category: string
    categoryAr: string
    priority: "low" | "medium" | "high" | "urgent"
    priorityAr: string
    description: string
    descriptionAr: string
    location: string
    locationAr: string
    images?: string[]
  }
  status: "submitted" | "assigned" | "in_progress" | "completed" | "cancelled"
  statusAr: string
  assignedTo?: {
    name: string
    nameAr: string
    phone: string
    company: string
    companyAr: string
  }
  dates: {
    submitted: string
    submittedHijri: string
    scheduled?: string
    scheduledHijri?: string
    completed?: string
    completedHijri?: string
  }
  cost: {
    estimated?: number
    actual?: number
    paidBy: "tenant" | "landlord" | "management"
    paidByAr: string
  }
  notes: string
  notesAr: string
  resolution?: string
  resolutionAr?: string
}

export function RentalMaintenanceService() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null)
  const [isCreateRequestDialogOpen, setIsCreateRequestDialogOpen] = useState(false)

  // Active contracts for creating maintenance requests
  const activeContracts = [
    { id: "1", contractNumber: "RC-2024-001", tenantName: "أحمد الراشد", propertyTitle: "شقة فاخرة في حي العليا" },
    { id: "2", contractNumber: "RC-2024-002", tenantName: "سارة المنصوري", propertyTitle: "فيلا واسعة في جدة" },
    { id: "3", contractNumber: "RC-2024-003", tenantName: "خالد الحربي", propertyTitle: "استوديو حديث في الدمام" },
  ]

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))

      setRequests([
        {
          id: "1",
          requestNumber: "MR-2024-001",
          contractId: "1",
          contractNumber: "RC-2024-001",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          propertyAddress: "King Fahd Road, Al-Olaya District",
          propertyAddressAr: "طريق الملك فهد، حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            phone: "+966 50 123 4567",
            email: "ahmed.rashid@email.com",
          },
          requestDetails: {
            category: "air_conditioning",
            categoryAr: "تكييف",
            priority: "high",
            priorityAr: "عالي",
            description: "Air conditioning unit not working properly",
            descriptionAr: "وحدة التكييف لا تعمل بشكل صحيح",
            location: "Living room",
            locationAr: "غرفة المعيشة",
            images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
          },
          status: "assigned",
          statusAr: "مُعيّن",
          assignedTo: {
            name: "Mohammed Al-Otaibi",
            nameAr: "محمد العتيبي",
            phone: "+966 55 987 6543",
            company: "Cool Air Services",
            companyAr: "خدمات الهواء البارد",
          },
          dates: {
            submitted: "2024-01-16",
            submittedHijri: "1446/07/16",
            scheduled: "2024-01-18",
            scheduledHijri: "1446/07/18",
          },
          cost: {
            estimated: 500,
            paidBy: "landlord",
            paidByAr: "المالك",
          },
          notes: "Urgent repair needed before summer",
          notesAr: "إصلاح عاجل مطلوب قبل الصيف",
        },
        {
          id: "2",
          requestNumber: "MR-2024-002",
          contractId: "2",
          contractNumber: "RC-2024-002",
          propertyTitle: "Spacious Villa in Jeddah",
          propertyTitleAr: "فيلا واسعة في جدة",
          propertyAddress: "Prince Mohammed Bin Abdulaziz Road",
          propertyAddressAr: "طريق الأمير محمد بن عبدالعزيز",
          tenant: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            phone: "+966 56 345 6789",
            email: "sarah.mansouri@email.com",
          },
          requestDetails: {
            category: "plumbing",
            categoryAr: "سباكة",
            priority: "medium",
            priorityAr: "متوسط",
            description: "Kitchen sink faucet leaking",
            descriptionAr: "تسريب في صنبور حوض المطبخ",
            location: "Kitchen",
            locationAr: "المطبخ",
          },
          status: "completed",
          statusAr: "مكتمل",
          assignedTo: {
            name: "Ali Hassan",
            nameAr: "علي حسن",
            phone: "+966 54 123 7890",
            company: "Expert Plumbing",
            companyAr: "السباكة الخبيرة",
          },
          dates: {
            submitted: "2024-01-14",
            submittedHijri: "1446/07/14",
            scheduled: "2024-01-15",
            scheduledHijri: "1446/07/15",
            completed: "2024-01-15",
            completedHijri: "1446/07/15",
          },
          cost: {
            estimated: 200,
            actual: 180,
            paidBy: "landlord",
            paidByAr: "المالك",
          },
          notes: "Quick fix completed same day",
          notesAr: "إصلاح سريع تم في نفس اليوم",
          resolution: "Replaced faucet cartridge and tested for leaks",
          resolutionAr: "تم استبدال خرطوشة الصنبور واختبار التسريبات",
        },
        {
          id: "3",
          requestNumber: "MR-2024-003",
          contractId: "1",
          contractNumber: "RC-2024-001",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          propertyAddress: "King Fahd Road, Al-Olaya District",
          propertyAddressAr: "طريق الملك فهد، حي العليا",
          tenant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            phone: "+966 50 123 4567",
            email: "ahmed.rashid@email.com",
          },
          requestDetails: {
            category: "electrical",
            categoryAr: "كهرباء",
            priority: "urgent",
            priorityAr: "عاجل",
            description: "Power outage in master bedroom",
            descriptionAr: "انقطاع الكهرباء في غرفة النوم الرئيسية",
            location: "Master bedroom",
            locationAr: "غرفة النوم الرئيسية",
          },
          status: "in_progress",
          statusAr: "قيد التنفيذ",
          assignedTo: {
            name: "Khalid Al-Harbi",
            nameAr: "خالد الحربي",
            phone: "+966 53 789 4561",
            company: "Power Solutions",
            companyAr: "حلول الطاقة",
          },
          dates: {
            submitted: "2024-01-17",
            submittedHijri: "1446/07/17",
            scheduled: "2024-01-17",
            scheduledHijri: "1446/07/17",
          },
          cost: {
            estimated: 300,
            paidBy: "landlord",
            paidByAr: "المالك",
          },
          notes: "Emergency electrical issue",
          notesAr: "مشكلة كهربائية طارئة",
        },
        {
          id: "4",
          requestNumber: "MR-2024-004",
          contractId: "3",
          contractNumber: "RC-2024-003",
          propertyTitle: "Modern Studio in Dammam",
          propertyTitleAr: "استوديو حديث في الدمام",
          propertyAddress: "King Saud Road, Al-Faisaliyah",
          propertyAddressAr: "طريق الملك سعود، الفيصلية",
          tenant: {
            name: "Khalid Al-Harbi",
            nameAr: "خالد الحربي",
            phone: "+966 54 456 7890",
            email: "khalid.harbi@email.com",
          },
          requestDetails: {
            category: "general",
            categoryAr: "عام",
            priority: "low",
            priorityAr: "منخفض",
            description: "Door handle loose and needs tightening",
            descriptionAr: "مقبض الباب مفكوك ويحتاج إلى شد",
            location: "Main entrance",
            locationAr: "المدخل الرئيسي",
          },
          status: "submitted",
          statusAr: "مُقدم",
          dates: {
            submitted: "2024-01-18",
            submittedHijri: "1446/07/18",
          },
          cost: {
            estimated: 50,
            paidBy: "tenant",
            paidByAr: "المستأجر",
          },
          notes: "Minor repair request",
          notesAr: "طلب إصلاح بسيط",
        },
      ])
      setLoading(false)
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.tenant.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyTitleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestDetails.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    const matchesPriority = filterPriority === "all" || request.requestDetails.priority === filterPriority
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "assigned":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />
      case "assigned":
        return <User className="h-4 w-4" />
      case "in_progress":
        return <Settings className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: newStatus as any,
              statusAr:
                newStatus === "submitted"
                  ? "مُقدم"
                  : newStatus === "assigned"
                    ? "مُعيّن"
                    : newStatus === "in_progress"
                      ? "قيد التنفيذ"
                      : newStatus === "completed"
                        ? "مكتمل"
                        : "ملغي",
              ...(newStatus === "completed" && {
                dates: {
                  ...req.dates,
                  completed: new Date().toISOString().split("T")[0],
                  completedHijri: "1446/07/18",
                },
              }),
            }
          : req,
      ),
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">طلبات الصيانة</h2>
          <p className="text-muted-foreground">إدارة ومتابعة طلبات الصيانة والإصلاحات</p>
        </div>
        <Dialog open={isCreateRequestDialogOpen} onOpenChange={setIsCreateRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة طلب صيانة
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة طلب صيانة جديد</DialogTitle>
              <DialogDescription>تسجيل طلب صيانة أو إصلاح للعقار</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="contract">العقد</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العقد" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.contractNumber} - {contract.tenantName} - {contract.propertyTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">فئة الصيانة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air_conditioning">تكييف</SelectItem>
                      <SelectItem value="plumbing">سباكة</SelectItem>
                      <SelectItem value="electrical">كهرباء</SelectItem>
                      <SelectItem value="painting">دهان</SelectItem>
                      <SelectItem value="flooring">أرضيات</SelectItem>
                      <SelectItem value="doors_windows">أبواب ونوافذ</SelectItem>
                      <SelectItem value="appliances">أجهزة</SelectItem>
                      <SelectItem value="general">عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">الأولوية</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الأولوية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">منخفض</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">عالي</SelectItem>
                      <SelectItem value="urgent">عاجل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">الموقع في العقار</Label>
                <Input id="location" placeholder="غرفة المعيشة، المطبخ، الحمام..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف المشكلة</Label>
                <Textarea id="description" placeholder="وصف تفصيلي للمشكلة أو الإصلاح المطلوب..." rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated-cost">التكلفة المتوقعة (ر.س)</Label>
                  <Input id="estimated-cost" type="number" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paid-by">يتحمل التكلفة</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="من يدفع؟" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landlord">المالك</SelectItem>
                      <SelectItem value="tenant">المستأجر</SelectItem>
                      <SelectItem value="management">الإدارة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea id="notes" placeholder="أي ملاحظات أو تفاصيل إضافية..." rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateRequestDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setIsCreateRequestDialogOpen(false)}>إضافة الطلب</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في طلبات الصيانة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="submitted">مُقدم</SelectItem>
            <SelectItem value="assigned">مُعيّن</SelectItem>
            <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
            <SelectItem value="completed">مكتمل</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="الأولوية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأولويات</SelectItem>
            <SelectItem value="low">منخفض</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">عالي</SelectItem>
            <SelectItem value="urgent">عاجل</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="font-semibold text-lg">{request.requestNumber}</h3>
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="mr-1">{request.statusAr}</span>
                    </Badge>
                    <Badge className={getPriorityColor(request.requestDetails.priority)}>
                      {request.requestDetails.priorityAr}
                    </Badge>
                    <Badge variant="outline">{request.requestDetails.categoryAr}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">المستأجر:</span>
                        <span>{request.tenant.nameAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">العقار:</span>
                        <span>{request.propertyTitleAr}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Wrench className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">الموقع:</span>
                        <span>{request.requestDetails.locationAr}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">تاريخ التقديم:</span>
                        <span>{request.dates.submittedHijri}</span>
                      </div>
                      {request.dates.scheduledHijri && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">موعد الصيانة:</span>
                          <span>{request.dates.scheduledHijri}</span>
                        </div>
                      )}
                      {request.assignedTo && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">المُعيّن:</span>
                          <span>{request.assignedTo.nameAr}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground">{request.requestDetails.descriptionAr}</p>
                  </div>

                  {request.notesAr && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">{request.notesAr}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      التكلفة المتوقعة: {request.cost.estimated?.toLocaleString() || "غير محدد"} ر.س
                    </div>
                    {request.cost.actual && (
                      <div className="text-sm font-medium text-green-600">
                        التكلفة الفعلية: {request.cost.actual.toLocaleString()} ر.س
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">يتحمل التكلفة: {request.cost.paidByAr}</div>
                  </div>
                  <div className="flex gap-2">
                    {request.status === "submitted" && (
                      <Button size="sm" onClick={() => handleStatusChange(request.id, "assigned")}>
                        تعيين فني
                      </Button>
                    )}
                    {request.status === "assigned" && (
                      <Button size="sm" onClick={() => handleStatusChange(request.id, "in_progress")}>
                        بدء العمل
                      </Button>
                    )}
                    {request.status === "in_progress" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(request.id, "completed")}
                      >
                        <CheckCircle className="h-3 w-3 ml-1" />
                        إكمال
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                      <Eye className="h-3 w-3 ml-1" />
                      التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب الصيانة</DialogTitle>
            <DialogDescription>
              طلب رقم {selectedRequest?.requestNumber} - {selectedRequest?.tenant.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">تفاصيل الطلب</TabsTrigger>
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="technician">الفني</TabsTrigger>
                <TabsTrigger value="timeline">الجدول الزمني</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">معلومات الطلب</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">رقم الطلب</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.requestNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الفئة</Label>
                        <Badge variant="outline">{selectedRequest.requestDetails.categoryAr}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الأولوية</Label>
                        <Badge className={getPriorityColor(selectedRequest.requestDetails.priority)}>
                          {selectedRequest.requestDetails.priorityAr}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الحالة</Label>
                        <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.statusAr}</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الموقع</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.requestDetails.locationAr}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">التكلفة</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">التكلفة المتوقعة</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedRequest.cost.estimated?.toLocaleString() || "غير محدد"} ر.س
                        </p>
                      </div>
                      {selectedRequest.cost.actual && (
                        <div>
                          <Label className="text-sm font-medium">التكلفة الفعلية</Label>
                          <p className="text-sm text-muted-foreground font-bold text-green-600">
                            {selectedRequest.cost.actual.toLocaleString()} ر.س
                          </p>
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium">يتحمل التكلفة</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.cost.paidByAr}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">وصف المشكلة</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{selectedRequest.requestDetails.descriptionAr}</p>
                  </div>
                </div>

                {selectedRequest.requestDetails.images && selectedRequest.requestDetails.images.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">الصور المرفقة</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRequest.requestDetails.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.resolution && (
                  <div>
                    <h4 className="font-semibold mb-2">الحل المطبق</h4>
                    <div className="p-3 bg-green-50 rounded-md">
                      <p className="text-sm text-green-800">{selectedRequest.resolutionAr}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="property" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">العقار</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.propertyTitleAr}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">العنوان</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.propertyAddressAr}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم العقد</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.contractNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">المستأجر</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.tenant.nameAr}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">رقم الهاتف</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.tenant.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.tenant.email}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="technician" className="space-y-4">
                {selectedRequest.assignedTo ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">اسم الفني</Label>
                      <p className="text-sm text-muted-foreground">{selectedRequest.assignedTo.nameAr}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">الشركة</Label>
                      <p className="text-sm text-muted-foreground">{selectedRequest.assignedTo.companyAr}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">رقم الهاتف</Label>
                      <p className="text-sm text-muted-foreground">{selectedRequest.assignedTo.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 ml-1" />
                        اتصال
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 ml-1" />
                        رسالة
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">لم يتم تعيين فني بعد</h3>
                    <p className="text-muted-foreground mb-4">سيتم تعيين فني مختص قريباً</p>
                    <Button>تعيين فني</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">تم تقديم الطلب</h4>
                      <p className="text-sm text-muted-foreground">{selectedRequest.dates.submittedHijri}</p>
                    </div>
                  </div>

                  {selectedRequest.dates.scheduledHijri && (
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">تم جدولة الصيانة</h4>
                        <p className="text-sm text-muted-foreground">{selectedRequest.dates.scheduledHijri}</p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.dates.completedHijri && (
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">تم إكمال الصيانة</h4>
                        <p className="text-sm text-muted-foreground">{selectedRequest.dates.completedHijri}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              إغلاق
            </Button>
            {selectedRequest?.status === "submitted" && (
              <Button
                onClick={() => {
                  handleStatusChange(selectedRequest.id, "assigned")
                  setSelectedRequest(null)
                }}
              >
                تعيين فني
              </Button>
            )}
            {selectedRequest?.status === "in_progress" && (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleStatusChange(selectedRequest.id, "completed")
                  setSelectedRequest(null)
                }}
              >
                <CheckCircle className="ml-2 h-4 w-4" />
                إكمال الصيانة
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على طلبات صيانة</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" || filterPriority !== "all"
              ? "جرب تعديل معايير البحث"
              : "لا توجد طلبات صيانة حالياً"}
          </p>
          <Button onClick={() => setIsCreateRequestDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة طلب صيانة
          </Button>
        </div>
      )}
    </div>
  )
}
