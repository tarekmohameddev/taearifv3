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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react"

interface RentalRequest {
  id: string
  requestNumber: string
  propertyId: string
  propertyTitle: string
  propertyTitleAr: string
  propertyAddress: string
  propertyAddressAr: string
  monthlyRent: number
  applicant: {
    name: string
    nameAr: string
    email: string
    phone: string
    nationalId: string
    nationality: string
    nationalityAr: string
    occupation: string
    occupationAr: string
    monthlyIncome: number
    maritalStatus: string
    maritalStatusAr: string
    familySize: number
    avatar: string
  }
  requestDate: string
  requestDateHijri: string
  status: "pending" | "under_review" | "approved" | "rejected"
  statusAr: string
  preferredMoveInDate: string
  preferredMoveInDateHijri: string
  rentalPeriod: number
  rentalPeriodUnit: string
  rentalPeriodUnitAr: string
  documents: Array<{
    type: string
    typeAr: string
    uploaded: boolean
    url?: string
  }>
  references: Array<{
    name: string
    nameAr: string
    relationship: string
    relationshipAr: string
    phone: string
    email: string
  }>
  notes: string
  notesAr: string
  reviewedBy?: string
  reviewedByAr?: string
  reviewDate?: string
  reviewDateHijri?: string
}

export function RentalApplicationsService() {
  const [requests, setRequests] = useState<RentalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null)
  const [isAddRequestDialogOpen, setIsAddRequestDialogOpen] = useState(false)

  // Available properties for dropdown
  const availableProperties = [
    { id: "1", titleAr: "شقة فاخرة في حي العليا", rent: 4500 },
    { id: "2", titleAr: "فيلا واسعة في جدة", rent: 8500 },
    { id: "3", titleAr: "استوديو حديث في الدمام", rent: 2200 },
    { id: "4", titleAr: "شقة عائلية قريبة من الحرم", rent: 3800 },
    { id: "5", titleAr: "مساحة مكتبية تنفيذية", rent: 6000 },
  ]

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800))

      setRequests([
        {
          id: "1",
          requestNumber: "RR-2024-001",
          propertyId: "1",
          propertyTitle: "Luxury Apartment in Al-Olaya",
          propertyTitleAr: "شقة فاخرة في حي العليا",
          propertyAddress: "King Fahd Road, Al-Olaya District",
          propertyAddressAr: "طريق الملك فهد، حي العليا",
          monthlyRent: 4500,
          applicant: {
            name: "Ahmed Al-Rashid",
            nameAr: "أحمد الراشد",
            email: "ahmed.rashid@email.com",
            phone: "+966 50 123 4567",
            nationalId: "1234567890",
            nationality: "Saudi",
            nationalityAr: "سعودي",
            occupation: "Software Engineer",
            occupationAr: "مهندس برمجيات",
            monthlyIncome: 15000,
            maritalStatus: "Married",
            maritalStatusAr: "متزوج",
            familySize: 4,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          requestDate: "2024-01-15",
          requestDateHijri: "1446/07/15",
          status: "pending",
          statusAr: "قيد المراجعة",
          preferredMoveInDate: "2024-02-01",
          preferredMoveInDateHijri: "1446/08/01",
          rentalPeriod: 12,
          rentalPeriodUnit: "months",
          rentalPeriodUnitAr: "شهر",
          documents: [
            { type: "National ID", typeAr: "الهوية الوطنية", uploaded: true, url: "/docs/id-001.pdf" },
            { type: "Salary Certificate", typeAr: "شهادة راتب", uploaded: true, url: "/docs/salary-001.pdf" },
            { type: "Bank Statement", typeAr: "كشف حساب بنكي", uploaded: false },
            { type: "Employment Letter", typeAr: "خطاب عمل", uploaded: true, url: "/docs/employment-001.pdf" },
          ],
          references: [
            {
              name: "Mohammed Al-Otaibi",
              nameAr: "محمد العتيبي",
              relationship: "Colleague",
              relationshipAr: "زميل عمل",
              phone: "+966 55 987 6543",
              email: "mohammed@email.com",
            },
            {
              name: "Fahad Al-Saud",
              nameAr: "فهد آل سعود",
              relationship: "Friend",
              relationshipAr: "صديق",
              phone: "+966 56 123 7890",
              email: "fahad@email.com",
            },
          ],
          notes: "Excellent credit score, stable employment history",
          notesAr: "سجل ائتماني ممتاز، تاريخ وظيفي مستقر",
        },
        {
          id: "2",
          requestNumber: "RR-2024-002",
          propertyId: "2",
          propertyTitle: "Spacious Villa in Jeddah",
          propertyTitleAr: "فيلا واسعة في جدة",
          propertyAddress: "Prince Mohammed Bin Abdulaziz Road",
          propertyAddressAr: "طريق الأمير محمد بن عبدالعزيز",
          monthlyRent: 8500,
          applicant: {
            name: "Sarah Al-Mansouri",
            nameAr: "سارة المنصوري",
            email: "sarah.mansouri@email.com",
            phone: "+966 56 345 6789",
            nationalId: "2345678901",
            nationality: "Emirati",
            nationalityAr: "إماراتي",
            occupation: "Doctor",
            occupationAr: "طبيبة",
            monthlyIncome: 25000,
            maritalStatus: "Married",
            maritalStatusAr: "متزوجة",
            familySize: 5,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          requestDate: "2024-01-14",
          requestDateHijri: "1446/07/14",
          status: "approved",
          statusAr: "موافق عليه",
          preferredMoveInDate: "2024-02-15",
          preferredMoveInDateHijri: "1446/08/15",
          rentalPeriod: 24,
          rentalPeriodUnit: "months",
          rentalPeriodUnitAr: "شهر",
          documents: [
            { type: "National ID", typeAr: "الهوية الوطنية", uploaded: true, url: "/docs/id-002.pdf" },
            { type: "Salary Certificate", typeAr: "شهادة راتب", uploaded: true, url: "/docs/salary-002.pdf" },
            { type: "Bank Statement", typeAr: "كشف حساب بنكي", uploaded: true, url: "/docs/bank-002.pdf" },
            { type: "Medical License", typeAr: "رخصة طبية", uploaded: true, url: "/docs/license-002.pdf" },
          ],
          references: [
            {
              name: "Dr. Ali Hassan",
              nameAr: "د. علي حسن",
              relationship: "Supervisor",
              relationshipAr: "المشرف",
              phone: "+966 54 123 7890",
              email: "ali.hassan@hospital.com",
            },
          ],
          notes: "High income, excellent professional references",
          notesAr: "دخل عالي، مراجع مهنية ممتازة",
          reviewedBy: "Property Manager",
          reviewedByAr: "مدير العقارات",
          reviewDate: "2024-01-15",
          reviewDateHijri: "1446/07/15",
        },
        {
          id: "3",
          requestNumber: "RR-2024-003",
          propertyId: "3",
          propertyTitle: "Modern Studio in Dammam",
          propertyTitleAr: "استوديو حديث في الدمام",
          propertyAddress: "King Saud Road, Al-Faisaliyah",
          propertyAddressAr: "طريق الملك سعود، الفيصلية",
          monthlyRent: 2200,
          applicant: {
            name: "Khalid Al-Harbi",
            nameAr: "خالد الحربي",
            email: "khalid.harbi@email.com",
            phone: "+966 54 456 7890",
            nationalId: "3456789012",
            nationality: "Saudi",
            nationalityAr: "سعودي",
            occupation: "Teacher",
            occupationAr: "معلم",
            monthlyIncome: 8000,
            maritalStatus: "Single",
            maritalStatusAr: "أعزب",
            familySize: 1,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          requestDate: "2024-01-13",
          requestDateHijri: "1446/07/13",
          status: "under_review",
          statusAr: "تحت المراجعة",
          preferredMoveInDate: "2024-03-01",
          preferredMoveInDateHijri: "1446/09/01",
          rentalPeriod: 6,
          rentalPeriodUnit: "months",
          rentalPeriodUnitAr: "شهر",
          documents: [
            { type: "National ID", typeAr: "الهوية الوطنية", uploaded: true, url: "/docs/id-003.pdf" },
            { type: "Salary Certificate", typeAr: "شهادة راتب", uploaded: true, url: "/docs/salary-003.pdf" },
            { type: "Bank Statement", typeAr: "كشف حساب بنكي", uploaded: true, url: "/docs/bank-003.pdf" },
          ],
          references: [
            {
              name: "Nasser Al-Qahtani",
              nameAr: "ناصر القحطاني",
              relationship: "Principal",
              relationshipAr: "مدير المدرسة",
              phone: "+966 53 789 4561",
              email: "nasser@school.edu.sa",
            },
          ],
          notes: "Stable employment in education sector, good references",
          notesAr: "وظيفة مستقرة في قطاع التعليم، مراجع جيدة",
        },
        {
          id: "4",
          requestNumber: "RR-2024-004",
          propertyId: "4",
          propertyTitle: "Family Apartment near Haram",
          propertyTitleAr: "شقة عائلية قريبة من الحرم",
          propertyAddress: "Ibrahim Al-Khalil Street, Al-Aziziyah",
          propertyAddressAr: "شارع إبراهيم الخليل، العزيزية",
          monthlyRent: 3800,
          applicant: {
            name: "Omar Al-Zahrani",
            nameAr: "عمر الزهراني",
            email: "omar.zahrani@email.com",
            phone: "+966 52 654 3210",
            nationalId: "4567890123",
            nationality: "Saudi",
            nationalityAr: "سعودي",
            occupation: "Business Owner",
            occupationAr: "صاحب عمل",
            monthlyIncome: 12000,
            maritalStatus: "Married",
            maritalStatusAr: "متزوج",
            familySize: 6,
            avatar: "/placeholder.svg?height=40&width=40",
          },
          requestDate: "2024-01-12",
          requestDateHijri: "1446/07/12",
          status: "rejected",
          statusAr: "مرفوض",
          preferredMoveInDate: "2024-01-20",
          preferredMoveInDateHijri: "1446/07/20",
          rentalPeriod: 12,
          rentalPeriodUnit: "months",
          rentalPeriodUnitAr: "شهر",
          documents: [
            { type: "National ID", typeAr: "الهوية الوطنية", uploaded: true, url: "/docs/id-004.pdf" },
            { type: "Salary Certificate", typeAr: "شهادة راتب", uploaded: false },
            { type: "Bank Statement", typeAr: "كشف حساب بنكي", uploaded: true, url: "/docs/bank-004.pdf" },
            { type: "Business License", typeAr: "رخصة تجارية", uploaded: false },
          ],
          references: [],
          notes: "Incomplete documentation, insufficient income verification",
          notesAr: "وثائق غير مكتملة، عدم كفاية إثبات الدخل",
          reviewedBy: "Property Manager",
          reviewedByAr: "مدير العقارات",
          reviewDate: "2024-01-13",
          reviewDateHijri: "1446/07/13",
        },
      ])
      setLoading(false)
    }

    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.applicant.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyTitleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.applicant.phone.includes(searchTerm)
    const matchesStatus = filterStatus === "all" || request.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "under_review":
        return <FileText className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
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
                newStatus === "pending"
                  ? "قيد المراجعة"
                  : newStatus === "under_review"
                    ? "تحت المراجعة"
                    : newStatus === "approved"
                      ? "موافق عليه"
                      : "مرفوض",
              ...(newStatus !== "pending" && {
                reviewedBy: "Property Manager",
                reviewedByAr: "مدير العقارات",
                reviewDate: new Date().toISOString().split("T")[0],
                reviewDateHijri: "1446/07/16",
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
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                  </div>
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
          <h2 className="text-2xl font-bold">طلبات الإيجار</h2>
          <p className="text-muted-foreground">إدارة ومراجعة طلبات الإيجار الجديدة</p>
        </div>
        <Dialog open={isAddRequestDialogOpen} onOpenChange={setIsAddRequestDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              إضافة طلب إيجار
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة طلب إيجار جديد</DialogTitle>
              <DialogDescription>أدخل تفاصيل طلب الإيجار من العميل</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="request-number">رقم الطلب</Label>
                  <Input id="request-number" placeholder="RR-2024-005" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="property">العقار المطلوب</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر العقار" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.titleAr} - {property.rent.toLocaleString()} ر.س/شهر
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">معلومات المتقدم</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicant-name-ar">الاسم الكامل</Label>
                    <Input id="applicant-name-ar" placeholder="أحمد الراشد" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="national-id">رقم الهوية</Label>
                    <Input id="national-id" placeholder="1234567890" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input id="phone" placeholder="+966 50 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" placeholder="ahmed@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">الجنسية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الجنسية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="saudi">سعودي</SelectItem>
                        <SelectItem value="emirati">إماراتي</SelectItem>
                        <SelectItem value="kuwaiti">كويتي</SelectItem>
                        <SelectItem value="qatari">قطري</SelectItem>
                        <SelectItem value="bahraini">بحريني</SelectItem>
                        <SelectItem value="omani">عماني</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation-ar">المهنة</Label>
                    <Input id="occupation-ar" placeholder="مهندس برمجيات" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-income">الدخل الشهري (ر.س)</Label>
                    <Input id="monthly-income" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marital-status">الحالة الاجتماعية</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">أعزب</SelectItem>
                        <SelectItem value="married">متزوج</SelectItem>
                        <SelectItem value="divorced">مطلق</SelectItem>
                        <SelectItem value="widowed">أرمل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="family-size">عدد أفراد الأسرة</Label>
                    <Input id="family-size" type="number" placeholder="4" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">تفاصيل الطلب</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="move-in-date">تاريخ الانتقال المرغوب</Label>
                    <Input id="move-in-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rental-period">مدة الإيجار</Label>
                    <div className="flex gap-2">
                      <Input id="rental-period" type="number" placeholder="12" className="flex-1" />
                      <Select>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="شهر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="months">شهر</SelectItem>
                          <SelectItem value="years">سنة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes-ar">ملاحظات</Label>
                <Textarea id="notes-ar" placeholder="ملاحظات إضافية حول الطلب..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRequestDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={() => setIsAddRequestDialogOpen(false)}>إضافة الطلب</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الطلبات..."
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
            <SelectItem value="pending">قيد المراجعة</SelectItem>
            <SelectItem value="under_review">تحت المراجعة</SelectItem>
            <SelectItem value="approved">موافق عليه</SelectItem>
            <SelectItem value="rejected">مرفوض</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.applicant.avatar || "/placeholder.svg"} alt={request.applicant.nameAr} />
                    <AvatarFallback>
                      {request.applicant.nameAr
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <h3 className="font-semibold">{request.applicant.nameAr}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="mr-1">{request.statusAr}</span>
                      </Badge>
                      <Badge variant="outline">{request.applicant.nationalityAr}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <FileText className="h-3 w-3 ml-1" />
                        {request.requestNumber}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-3 w-3 ml-1" />
                        {request.propertyTitleAr}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 ml-1" />
                        {request.monthlyRent.toLocaleString()} ر.س/شهر
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-3 w-3 ml-1" />
                        {request.applicant.occupationAr}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 ml-1" />
                        تاريخ التقديم: {request.requestDateHijri}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 ml-1" />
                        الدخل: {request.applicant.monthlyIncome.toLocaleString()} ر.س
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 ml-1" />
                        {request.applicant.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 ml-1" />
                        {request.applicant.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm text-muted-foreground">
                    مدة الإيجار: {request.rentalPeriod} {request.rentalPeriodUnitAr}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    تاريخ الانتقال: {request.preferredMoveInDateHijri}
                  </div>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(request.id, "approved")}
                        >
                          <CheckCircle className="h-3 w-3 ml-1" />
                          موافقة
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusChange(request.id, "rejected")}
                        >
                          <XCircle className="h-3 w-3 ml-1" />
                          رفض
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                      <Eye className="h-3 w-3 ml-1" />
                      التفاصيل
                    </Button>
                  </div>
                </div>
              </div>
              {request.notesAr && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">{request.notesAr}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل طلب الإيجار</DialogTitle>
            <DialogDescription>
              طلب رقم {selectedRequest?.requestNumber} - {selectedRequest?.applicant.nameAr}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <Tabs defaultValue="applicant" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="applicant">المتقدم</TabsTrigger>
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="documents">الوثائق</TabsTrigger>
                <TabsTrigger value="references">المراجع</TabsTrigger>
              </TabsList>

              <TabsContent value="applicant" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">المعلومات الشخصية</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">الاسم الكامل</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.nameAr}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">رقم الهوية</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.nationalId}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الجنسية</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.nationalityAr}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الحالة الاجتماعية</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.maritalStatusAr}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">عدد أفراد الأسرة</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.familySize}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">رقم الهاتف</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.phone}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">المعلومات المهنية</h4>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">المهنة</Label>
                        <p className="text-sm text-muted-foreground">{selectedRequest.applicant.occupationAr}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">الدخل الشهري</Label>
                        <p className="text-sm text-muted-foreground font-bold text-green-600">
                          {selectedRequest.applicant.monthlyIncome.toLocaleString()} ر.س
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">نسبة الدخل للإيجار</Label>
                        <p className="text-sm text-muted-foreground">
                          {((selectedRequest.monthlyRent / selectedRequest.applicant.monthlyIncome) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <Label className="text-sm font-medium">الإيجار الشهري</Label>
                    <p className="text-sm text-muted-foreground font-bold text-green-600">
                      {selectedRequest.monthlyRent.toLocaleString()} ر.س
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">مدة الإيجار المطلوبة</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.rentalPeriod} {selectedRequest.rentalPeriodUnitAr}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">تاريخ الانتقال المرغوب</Label>
                    <p className="text-sm text-muted-foreground">{selectedRequest.preferredMoveInDateHijri}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">إجمالي القيمة المتوقعة</Label>
                    <p className="text-sm text-muted-foreground">
                      {(selectedRequest.monthlyRent * selectedRequest.rentalPeriod).toLocaleString()} ر.س
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <div className="space-y-3">
                  {selectedRequest.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc.typeAr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={doc.uploaded ? "default" : "secondary"}>
                          {doc.uploaded ? "مرفوع" : "غير مرفوع"}
                        </Badge>
                        {doc.uploaded && doc.url && (
                          <Button size="sm" variant="outline">
                            عرض
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="references" className="space-y-4">
                {selectedRequest.references.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.references.map((ref, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">الاسم</Label>
                            <p className="text-sm text-muted-foreground">{ref.nameAr}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">العلاقة</Label>
                            <p className="text-sm text-muted-foreground">{ref.relationshipAr}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">رقم الهاتف</Label>
                            <p className="text-sm text-muted-foreground">{ref.phone}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">البريد الإلكتروني</Label>
                            <p className="text-sm text-muted-foreground">{ref.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">لم يتم تقديم مراجع</p>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, "approved")
                    setSelectedRequest(null)
                  }}
                >
                  <CheckCircle className="ml-2 h-4 w-4" />
                  موافقة على الطلب
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleStatusChange(selectedRequest.id, "rejected")
                    setSelectedRequest(null)
                  }}
                >
                  <XCircle className="ml-2 h-4 w-4" />
                  رفض الطلب
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على طلبات</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" ? "جرب تعديل معايير البحث" : "لا توجد طلبات إيجار حالياً"}
          </p>
          <Button onClick={() => setIsAddRequestDialogOpen(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة طلب إيجار
          </Button>
        </div>
      )}
    </div>
  )
}
