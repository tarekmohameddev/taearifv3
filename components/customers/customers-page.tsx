"use client"

import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar"
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header"
import axiosInstance from '@/lib/axiosInstance'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  X,
  SortAsc,
  SortDesc,
  CheckSquare,
  Target,
  CheckCircle,
  Star,
  RefreshCw,
  ArrowRight,
  Move,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

// Customer data (same as CRM page for consistency)
const customers = [
  {
    id: 1,
    name: "أحمد محمد العلي",
    nameEn: "Ahmed Mohammed Al-Ali",
    email: "ahmed.alali@email.com",
    phone: "+966 50 123 4567",
    whatsapp: "+966 50 123 4567",
    status: "نشط",
    customer_type: "مشتري",
    nationality: "سعودي",
    residencyStatus: "مواطن",
    city: "الرياض",
    district: "العليا",
    budget: { min: 800000, max: 1200000 },
    propertyPreferences: ["فيلا", "شقة"],
    familySize: 5,
    leadSource: "إحالة",
    assignedAgent: "سارة أحمد",
    joinDate: "2023-08-15",
    lastContact: "2023-11-10",
    lastActivity: "2023-11-12",
    totalTransactions: 1,
    totalValue: 950000,
    notes: "عميل مهم، يبحث عن فيلا في حي راقي",
    avatar: "/placeholder.svg?height=40&width=40",
    satisfaction: 4.8,
    communicationPreference: "واتساب",
    urgency: "عالية",
    pipelineStage: "negotiation",
    dealValue: 950000,
    probability: 75,
    expectedCloseDate: "2023-12-15",
  },
]

export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState('customers')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedCustomers, setSelectedCustomers] = useState([])
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterCity, setFilterCity] = useState('all')
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false)
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [customersData, setCustomersData] = useState([])  // ← هنا يتم حفظ كل العملاء
const [formData, setFormData] = useState(null)          // ← بيانات العميل المحدد
const [editingCustomerId, setEditingCustomerId] = useState(null) // ← ID العميل الجاري تعديله
const [open, setOpen] = useState(false)

  
  
  
  

useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers')
      const { customers, summary } = response.data.data
      setCustomersData(customers)
      setTotalCustomers(summary.total_customers)
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError('حدث خطأ أثناء تحميل البيانات.')
    } finally {
      setLoading(false)
    }
  }

  fetchCustomers()
}, [])

const openEditDialog = (customer) => {
  setEditingCustomerId(customer.id)
  setFormData({
    name: customer.name || "",
    email: customer.email || "",
    phone_number: customer.phone_number || "",
    note: customer.note || "",
    customer_type: customer.customer_type || "",
    priority: customer.priority || 1,
    city_id: customer.city_id || null,
    district_id: customer.district?.id || null,
    stage_id: 2,
  })
  setOpen(true)
}



  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  
  
  
  const handleUpdateCustomer = async () => {
    try {
      await axiosInstance.put(`/customers/${editingCustomerId}`, formData)
  
      // تحديث الـ customer داخل القائمة
      setCustomersData((prev) =>
        prev.map((cust) =>
          cust.id === editingCustomerId ? { ...cust, ...formData } : cust
        )
      )
  
      setOpen(false)
    } catch (error) {
      console.error("Error updating customer:", error)
    }
  }

  
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  

  // Filter and sort customers
  const filteredAndSortedCustomers = customersData
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number.includes(searchTerm) ||
        customer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof customer.district === "string"
          ? customer.district?.toLowerCase().includes(searchTerm.toLowerCase()) 
          : customer.district?.name_ar.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === "all" || customer.status === filterStatus
      const matchesType = filterType === "all" || customer.customer_type === filterType
      const matchesCity = filterCity === "all" || customer.city === filterCity

      return matchesSearch && matchesStatus && matchesType && matchesCity
    })
    .sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredAndSortedCustomers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(filteredAndSortedCustomers.map((c) => c.id))
    }
  }

  // Calculate basic statistics
  const activeCustomers = customersData.filter((c) => c.status === "نشط").length
  const totalRevenue = customersData.reduce((sum, c) => sum + c.totalValue, 0)
  const avgCustomerValue = totalRevenue / totalCustomers

  // Customer type statistics
  const buyerCount = customersData.filter((c) => c.customer_type === "مشتري").length
  const sellerCount = customersData.filter((c) => c.customer_type === "بائع").length
  const renterCount = customersData.filter((c) => c.customer_type === "مستأجر").length
  const landlordCount = customersData.filter((c) => c.customer_type === "مؤجر").length
  const investorCount = customersData.filter((c) => c.customer_type === "مستثمر").length
  
  
  const handleDelete = async (customerId) => {
    try {
      await axiosInstance.delete(`/customers/${customerId}`)
      // احذف العميل من الواجهة
      setCustomersData(prev =>
        prev.filter(customer => customer.id !== customerId)
      )
    } catch (error) {
      console.error('Failed to delete customer:', error)
      alert('حدث خطأ أثناء الحذف')
    }
  }

  
  
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">إدارة العملاء</h1>
                <p className="text-muted-foreground">عرض وإدارة بيانات العملاء في جدول منظم</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/crm">
                  <Button variant="outline">
                    <Move className="ml-2 h-4 w-4" />
                    نظام CRM المتقدم
                  </Button>
                </Link>
                {/* <Button variant="outline">
                  <Upload className="ml-2 h-4 w-4" />
                  استيراد عملاء
                </Button>
                <Button variant="outline">
                  <Download className="ml-2 h-4 w-4" />
                  تصدير البيانات
                </Button> */}
                <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="ml-2 h-4 w-4" />
                      إضافة عميل جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>إضافة عميل جديد</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">الاسم بالعربية</Label>
                          <Input id="name" placeholder="أحمد محمد العلي" />
                        </div>
                        <div>
                          <Label htmlFor="nameEn">الاسم بالإنجليزية</Label>
                          <Input id="nameEn" placeholder="Ahmed Mohammed Al-Ali" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <Input id="email" type="email" placeholder="ahmed@example.com" />
                        </div>
                        <div>
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input id="phone" placeholder="+966 50 123 4567" />
                        </div>
                        <div>
                          <Label htmlFor="whatsapp">واتساب</Label>
                          <Input id="whatsapp" placeholder="+966 50 123 4567" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="customer_type">نوع العميل</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر النوع" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="مشتري">مشتري</SelectItem>
                              <SelectItem value="بائع">بائع</SelectItem>
                              <SelectItem value="مستأجر">مستأجر</SelectItem>
                              <SelectItem value="مؤجر">مؤجر</SelectItem>
                              <SelectItem value="مستثمر">مستثمر</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="nationality">الجنسية</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الجنسية" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="سعودي">سعودي</SelectItem>
                              <SelectItem value="مقيم">مقيم</SelectItem>
                              <SelectItem value="خليجي">خليجي</SelectItem>
                              <SelectItem value="أجنبي">أجنبي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="city">المدينة</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدينة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="الرياض">الرياض</SelectItem>
                              <SelectItem value="جدة">جدة</SelectItem>
                              <SelectItem value="الدمام">الدمام</SelectItem>
                              <SelectItem value="مكة">مكة المكرمة</SelectItem>
                              <SelectItem value="المدينة">المدينة المنورة</SelectItem>
                              <SelectItem value="الطائف">الطائف</SelectItem>
                              <SelectItem value="الخبر">الخبر</SelectItem>
                              <SelectItem value="القطيف">القطيف</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="district">الحي</Label>
                          <Input id="district" placeholder="العليا، الروضة، النرجس..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="familySize">حجم الأسرة</Label>
                          <Input id="familySize" type="number" placeholder="5" />
                        </div>
                        <div>
                          <Label htmlFor="assignedAgent">الوسيط المسؤول</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الوسيط" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="سارة أحمد">سارة أحمد</SelectItem>
                              <SelectItem value="محمد خالد">محمد خالد</SelectItem>
                              <SelectItem value="عبدالله محمد">عبدالله محمد</SelectItem>
                              <SelectItem value="أمل عبدالله">أمل عبدالله</SelectItem>
                              <SelectItem value="فيصل العتيبي">فيصل العتيبي</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea id="notes" placeholder="أدخل أي ملاحظات مهمة عن العميل..." />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={() => setShowAddCustomerDialog(false)}>إضافة العميل</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 mb-8 grid-cols-2 md:grid-cols-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Users className="ml-2 h-4 w-4" />
                    إجمالي العملاء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 12%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="ml-2 h-4 w-4" />
                    العملاء النشطون
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 8%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <DollarSign className="ml-2 h-4 w-4" />
                    إجمالي الإيرادات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}م ريال</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 15%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Target className="ml-2 h-4 w-4" />
                    متوسط قيمة العميل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{(avgCustomerValue / 1000).toFixed(0)}ك ريال</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">↑ 5%</span> من الشهر الماضي
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CheckCircle className="ml-2 h-4 w-4" />
                    معدل الرضا
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    4.5
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">من 5 نجوم</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Clock className="ml-2 h-4 w-4" />
                    آخر تحديث
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">اليوم</div>
                  <p className="text-xs text-muted-foreground">منذ 5 دقائق</p>
                </CardContent>
              </Card> */}
            </div>

            {/* Customer Type Distribution */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">توزيع العملاء حسب النوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{buyerCount}</div>
                    <div className="text-sm text-muted-foreground">مشتري</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{sellerCount}</div>
                    <div className="text-sm text-muted-foreground">بائع</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{renterCount}</div>
                    <div className="text-sm text-muted-foreground">مستأجر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{landlordCount}</div>
                    <div className="text-sm text-muted-foreground">مؤجر</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{investorCount}</div>
                    <div className="text-sm text-muted-foreground">مستثمر</div>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* Filters and Search */}
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="البحث في العملاء..."
                  className="pr-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="غير نشط">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="مشتري">مشتري</SelectItem>
                    <SelectItem value="بائع">بائع</SelectItem>
                    <SelectItem value="مستأجر">مستأجر</SelectItem>
                    <SelectItem value="مؤجر">مؤجر</SelectItem>
                    <SelectItem value="مستثمر">مستثمر</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع المدن</SelectItem>
                    <SelectItem value="الرياض">الرياض</SelectItem>
                    <SelectItem value="جدة">جدة</SelectItem>
                    <SelectItem value="الدمام">الدمام</SelectItem>
                    <SelectItem value="مكة">مكة</SelectItem>
                    <SelectItem value="المدينة">المدينة</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              {/* Bulk Actions */}
              {selectedCustomers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{selectedCustomers.length} عميل محدد</span>
                  <Dialog open={showBulkActionsDialog} onOpenChange={setShowBulkActionsDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CheckSquare className="ml-2 h-4 w-4" />
                        إجراءات جماعية
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>إجراءات جماعية للعملاء</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Mail className="ml-2 h-4 w-4" />
                          إرسال بريد إلكتروني جماعي
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <MessageSquare className="ml-2 h-4 w-4" />
                          إرسال رسالة واتساب جماعية
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Tag className="ml-2 h-4 w-4" />
                          إضافة علامات
                        </Button>
                        <Button className="w-full justify-start bg-transparent" variant="outline">
                          <Download className="ml-2 h-4 w-4" />
                          تصدير البيانات المحددة
                        </Button>
                        <Separator />
                        <Button className="w-full justify-start" variant="destructive">
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف العملاء المحددين
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCustomers([])}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Customer Table */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedCustomers.length === filteredAndSortedCustomers.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("name")}
                            className="h-auto p-0 font-semibold "
                          >
                            العميل
                            {sortField === "name" &&
                              (sortDirection === "asc" ? (
                                <SortAsc className="mr-2 h-4 w-4" />
                              ) : (
                                <SortDesc className="mr-2 h-4 w-4" />
                              ))}
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">الاتصال</TableHead>
                        <TableHead  className="text-right">النوع</TableHead>
                        <TableHead  className="text-right">الموقع</TableHead>
                        {/* <TableHead>الوسيط</TableHead> */}
                        <TableHead className="text-right">آخر تواصل</TableHead>
                        {/* <TableHead className="text-right">القيمة الإجمالية</TableHead> */}
                        <TableHead className="w-[100px] text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedCustomers.includes(customer.id)}
                              onCheckedChange={() => handleSelectCustomer(customer.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {/* <Avatar className="h-8 w-8">
                                <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {customer.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar> */}
                              <div>
                                <div className="font-medium text-right">{customer.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <Phone className="ml-2 h-3 w-3" />
                                {customer.phone_number}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MessageSquare className="ml-2 h-3 w-3" />
                                {customer.whatsapp ? customer.whatsapp : customer.phone_number}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                customer.customer_type === "مشتري"
                                  ? "border-blue-500 text-blue-700"
                                  : customer.customer_type === "بائع"
                                    ? "border-green-500 text-green-700"
                                    : customer.customer_type === "مستأجر"
                                      ? "border-purple-500 text-purple-700"
                                      : customer.customer_type === "مؤجر"
                                        ? "border-orange-500 text-orange-700"
                                        : "border-red-500 text-red-700"
                              }
                            >
                              {customer.customer_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{typeof customer.city === "string"
    ? customer.city
    : customer.district?.city_name_ar}</div>
                              <div className="text-sm text-muted-foreground">  {typeof customer.district === "string"
    ? customer.district
    : customer.district?.name_ar}</div>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="text-sm">{customer.assignedAgent}</div>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="ml-2 h-3 w-3" />
                              {customer.lastContact? customer.lastContact: "2025-7-25"}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="font-medium">
                              {customer.totalValue > 0 ? `${(customer.totalValue / 1000).toFixed(0)}ك ريال` : "لا يوجد"}
                            </div>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedCustomer(customer)
                                  setShowCustomerDialog(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
  <DropdownMenuItem onSelect={(e) => {
  e.preventDefault()
  openEditDialog(customer)  // تمرير العميل المحدد
}}>
  <Edit className="ml-2 h-4 w-4" />
  تعديل العميل
</DropdownMenuItem>

{formData && (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>تعديل بيانات العميل</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <Input id="name" value={formData.name} onChange={handleChange("name")} />
        <Input id="email" value={formData.email} onChange={handleChange("email")} />
        <Input id="phone" value={formData.phone_number} onChange={handleChange("phone_number")} />
        <Textarea id="note" value={formData.note} onChange={handleChange("note")} />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button onClick={handleUpdateCustomer}>تعديل</Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)}


                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <MessageSquare className="ml-2 h-4 w-4" />
                                    إرسال واتساب
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Phone className="ml-2 h-4 w-4" />
                                    اتصال هاتفي
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="ml-2 h-4 w-4" />
                                    إرسال بريد إلكتروني
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive"
        onClick={() => handleDelete(customer.id)}
      >
        <Trash2 className="ml-2 h-4 w-4" />
        حذف
      </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* CRM Link */}
              <div className="text-center py-6">
                <Card className="max-w-md mx-auto">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Target className="h-12 w-12 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">هل تحتاج إلى مزيد من الميزات؟</h3>
                        <p className="text-sm text-muted-foreground">
                          استخدم نظام CRM المتقدم لإدارة مراحل العملاء والمواعيد والتفاعلات
                        </p>
                      </div>
                      <Link href="/crm">
                        <Button className="w-full">
                          <ArrowRight className="ml-2 h-4 w-4" />
                          انتقل إلى نظام CRM المتقدم
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Customer Detail Dialog */}
            <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {selectedCustomer && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {selectedCustomer.name
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xl">{selectedCustomer.name}</div>
                          <div className="text-sm text-muted-foreground font-normal">
                            {selectedCustomer.nameEn} • عميل منذ {selectedCustomer.joinDate}
                          </div>
                        </div>
                        <div className="mr-auto flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              selectedCustomer.customer_type === "مشتري"
                                ? "border-blue-500 text-blue-700"
                                : selectedCustomer.customer_type === "بائع"
                                  ? "border-green-500 text-green-700"
                                  : selectedCustomer.customer_type === "مستأجر"
                                    ? "border-purple-500 text-purple-700"
                                    : selectedCustomer.customer_type === "مؤجر"
                                      ? "border-orange-500 text-orange-700"
                                      : "border-red-500 text-red-700"
                            }
                          >
                            {selectedCustomer.customer_type}
                          </Badge>
                          <Link href="/crm">
                            <Button variant="outline" size="sm">
                              <Move className="ml-2 h-4 w-4" />
                              عرض في CRM
                            </Button>
                          </Link>
                        </div>
                      </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Phone className="ml-2 h-5 w-5" />
                            معلومات الاتصال
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>الهاتف:</span>
                            <span className="font-medium">{selectedCustomer.phone}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>واتساب:</span>
                            <span className="font-medium">{selectedCustomer.whatsapp}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>البريد:</span>
                            <span className="font-medium text-sm">{selectedCustomer.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>التفضيل:</span>
                            <Badge variant="outline">{selectedCustomer.communicationPreference}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <MapPin className="ml-2 h-5 w-5" />
                            الموقع والهوية
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>المدينة:</span>
                            <span className="font-medium">{selectedCustomer.city}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>الحي:</span>
                            <span className="font-medium">{typeof selectedCustomer.district === "string"
    ? selectedCustomer.district
    : selectedCustomer.district?.name_ar}</span>
                          </div>  
                          <div className="flex items-center justify-between">
                            <span>الجنسية:</span>
                            <span className="font-medium">{selectedCustomer.nationality}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>حجم الأسرة:</span>
                            <span className="font-medium">{selectedCustomer.familySize} أفراد</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <Target className="ml-2 h-5 w-5" />
                            إدارة العميل
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>الوسيط:</span>
                            <span className="font-medium">{selectedCustomer.assignedAgent}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>المصدر:</span>
                            <span className="font-medium">{selectedCustomer.leadSource}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>الأولوية:</span>
                            <Badge
                              variant={
                                selectedCustomer.urgency === "عالية"
                                  ? "destructive"
                                  : selectedCustomer.urgency === "متوسطة"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {selectedCustomer.urgency}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>الرضا:</span>
                            <div className="flex items-center">
                              <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{selectedCustomer.satisfaction}/5</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">الملاحظات</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">{selectedCustomer.notes}</p>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline">
                        <Edit className="ml-2 h-4 w-4" />
                        تعديل العميل
                      </Button>
                      <Button variant="outline">
                        <Phone className="ml-2 h-4 w-4" />
                        اتصال
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="ml-2 h-4 w-4" />
                        واتساب
                      </Button>
                      <Link href="/crm">
                        <Button>
                          <Move className="ml-2 h-4 w-4" />
                          إدارة في CRM
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
