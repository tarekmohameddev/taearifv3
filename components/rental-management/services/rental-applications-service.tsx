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
  Loader2,
  AlertCircle,
  Edit,
  Save,
  Trash2,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import useStore from "@/context/Store"

interface Property {
  id: number
  featured_image: string
  price: string
  beds: number
  bath: number
  area: string
  latitude: string
  longitude: string
}

interface RentalData {
  id: number
  user_id: number
  property_id: number
  unit_label: string
  tenant_full_name: string
  tenant_phone: string
  tenant_email: string
  tenant_job_title: string
  tenant_social_status: string
  tenant_national_id: string
  base_rent_amount: string
  currency: string
  deposit_amount: string
  move_in_date: string
  paying_plan: string
  rental_period_months: number
  status: string
  notes: string
  created_at: string
  updated_at: string
  property: Property
}

interface ApiResponse {
  status: boolean
  data: {
    current_page: number
    data: RentalData[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
}

interface RentalApplicationsServiceProps {
  openAddDialogCounter?: number
}

export function RentalApplicationsService({ openAddDialogCounter = 0 }: RentalApplicationsServiceProps) {
  const { rentalApplications, setRentalApplications } = useStore()
  const {
    rentals,
    loading,
    error,
    searchTerm,
    filterStatus,
    selectedRental,
    isAddRentalDialogOpen,
    isEditRentalDialogOpen,
    editingRental,
    isSubmitting,
    isDeleteDialogOpen,
    deletingRental,
    isDeleting,
    isInitialized,
    lastProcessedOpenAddDialogCounter,
  } = rentalApplications
  
  // Open Add Rental dialog when the counter changes from parent
  useEffect(() => {
    // Simplified logic: if counter > last processed, open dialog
    if (openAddDialogCounter > 0 && openAddDialogCounter > lastProcessedOpenAddDialogCounter) {
      console.log("✅ Opening Add Rental Dialog - Simple Logic", { openAddDialogCounter, lastProcessedOpenAddDialogCounter })
      setRentalApplications({ 
        isAddRentalDialogOpen: true, 
        lastProcessedOpenAddDialogCounter: openAddDialogCounter 
      })
    } else if (lastProcessedOpenAddDialogCounter === -1 && openAddDialogCounter >= 0) {
      console.log("🔧 Initializing counter without opening dialog", { openAddDialogCounter })
      setRentalApplications({ lastProcessedOpenAddDialogCounter: openAddDialogCounter })
    }
  }, [openAddDialogCounter, lastProcessedOpenAddDialogCounter, setRentalApplications])

  useEffect(() => {
    if (!isInitialized) {
      fetchRentals()
    }
  }, [isInitialized])

  const fetchRentals = async () => {
    try {
      setRentalApplications({ loading: true, error: null })
      const response = await axiosInstance.get<ApiResponse>("/v1/rms/rentals")
      
      if (response.data.status) {
        setRentalApplications({ rentals: response.data.data.data, isInitialized: true })
      } else {
        setRentalApplications({ error: "فشل في جلب البيانات" })
      }
    } catch (err) {
      console.error("Error fetching rentals:", err)
      setRentalApplications({ error: "حدث خطأ أثناء جلب البيانات" })
    } finally {
      setRentalApplications({ loading: false })
    }
  }

  const filteredRentals = rentals.filter((rental: RentalData) => {
    const matchesSearch =
      rental.tenant_full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.unit_label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.tenant_phone?.includes(searchTerm) ||
      rental.tenant_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || rental.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "expired":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "expired":
        return <XCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "نشط"
      case "pending":
        return "قيد الانتظار"
      case "expired":
        return "منتهي الصلاحية"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('ar-US', {
      style: 'currency',
      currency: currency || 'SAR'
    }).format(parseFloat(amount))
  }

  const handleCreateRental = async (formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true })
      console.log("Sending form data:", formData) // للتأكد من البيانات المرسلة
      
      const response = await axiosInstance.post("/v1/rms/rentals", formData)
      console.log("API Response:", response.data) // للتأكد من الاستجابة
      
      if (response.data.status) {
        // إضافة الإيجار الجديد للقائمة في بداية المصفوفة
        const newRental = response.data.data
        console.log("New rental to add:", newRental) // للتأكد من البيانات الجديدة
        
        // إضافة ID من response إلى formData
        const rentalWithId = {
          ...formData,
          id: newRental.id,
          created_at: newRental.created_at,
          updated_at: newRental.updated_at,
          status: newRental.status || "active"
        }
        
        const updatedRentals = [rentalWithId, ...rentals]
        console.log("Updated rentals list:", updatedRentals) // للتأكد من القائمة المحدثة
        setRentalApplications({ rentals: updatedRentals, isAddRentalDialogOpen: false })
        // يمكن إضافة toast notification هنا
      } else {
        console.error("API returned false status:", response.data)
        alert("فشل في إضافة الإيجار: " + (response.data.message || "خطأ غير معروف"))
      }
    } catch (err: any) {
      console.error("Error creating rental:", err)
      alert("خطأ في إضافة الإيجار: " + (err.response?.data?.message || err.message || "خطأ غير معروف"))
      // إغلاق النافذة المنبثقة في حالة الخطأ
      setRentalApplications({ isAddRentalDialogOpen: false })
    } finally {
      setRentalApplications({ isSubmitting: false })
    }
  }

  const handleUpdateRental = async (rentalId: number, formData: any) => {
    try {
      setRentalApplications({ isSubmitting: true })
      const response = await axiosInstance.patch(`/v1/rms/rentals/${rentalId}`, formData)
      
      if (response.data.status) {
        // تحديث الإيجار في القائمة بالبيانات الجديدة
        const updated = rentals.map((rental: RentalData) => rental.id === rentalId ? response.data.data : rental)
        setRentalApplications({ rentals: updated, isEditRentalDialogOpen: false, editingRental: null })
        // يمكن إضافة toast notification هنا
      }
    } catch (err) {
      console.error("Error updating rental:", err)
      // يمكن إضافة toast error هنا
      // إغلاق النافذة المنبثقة في حالة الخطأ
      setRentalApplications({ isEditRentalDialogOpen: false, editingRental: null })
    } finally {
      setRentalApplications({ isSubmitting: false })
    }
  }

  const handleDeleteRental = async (rentalId: number) => {
    try {
      setRentalApplications({ isDeleteDialogOpen: false, isDeleting: true })
      const response = await axiosInstance.delete(`/v1/rms/rentals/${rentalId}`)
      
      if (response.status) {
        const updated = rentals.filter((rental: RentalData) => rental.id !== rentalId)
        setRentalApplications({ rentals: updated, isDeleteDialogOpen: false, deletingRental: null })
      }
    } catch (err) {
      console.error("Error deleting rental:", err)
      setRentalApplications({ isDeleteDialogOpen: false, deletingRental: null })
    } finally {
      setRentalApplications({ isDeleting: false })
    }
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
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-4 w-48 bg-muted rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchRentals}>
          <Loader2 className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة الإيجارات</h2>
          <p className="text-muted-foreground">عرض وإدارة جميع عقود الإيجار</p>
        </div>
        <Dialog open={isAddRentalDialogOpen} onOpenChange={(open) => setRentalApplications({ isAddRentalDialogOpen: open })}>
          <DialogTrigger asChild>
            <Button className="bg-gray-700 hover:bg-gray-800">
              <Plus className="ml-2 h-4 w-4" />
              إضافة إيجار جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة عقد إيجار جديد</DialogTitle>
              <DialogDescription>أدخل تفاصيل عقد الإيجار الجديد</DialogDescription>
            </DialogHeader>
            <AddRentalForm 
              onSubmit={handleCreateRental}
              onCancel={() => setRentalApplications({ isAddRentalDialogOpen: false })}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الإيجارات..."
            value={searchTerm}
            onChange={(e) => setRentalApplications({ searchTerm: e.target.value })}
            className="pr-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setRentalApplications({ filterStatus: v })}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="جميع الحالات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="pending">قيد الانتظار</SelectItem>
            <SelectItem value="expired">منتهي الصلاحية</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.map((rental: RentalData) => (
          <Card key={rental.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 space-x-reverse">
                  <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600">
                    <AvatarImage src={rental.property?.featured_image} alt={rental.tenant_full_name} />
                    <AvatarFallback className="text-white font-semibold">
                      {rental.tenant_full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <h3 className="font-semibold text-lg text-gray-900">{rental.tenant_full_name}</h3>
                      <Badge className={`${getStatusColor(rental.status)} border`}>
                        {getStatusIcon(rental.status)}
                        <span className="mr-1">{getStatusText(rental.status)}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 ml-2 text-blue-500" />
                        <span>الوحدة: {rental.unit_label}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 ml-2 text-green-500" />
                        <span>الإيجار: {formatCurrency(rental.base_rent_amount, rental.currency)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 ml-2 text-purple-500" />
                        <span>تاريخ الانتقال: {formatDate(rental.move_in_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 ml-2 text-orange-500" />
                        <span>المهنة: {rental.tenant_job_title}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 ml-1" />
                        {rental.tenant_email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 ml-1" />
                        {rental.tenant_phone}
                      </div>
                    </div>

                    {rental.notes && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">{rental.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">مدة الإيجار</div>
                    <div className="font-semibold text-gray-900">{rental.rental_period_months} شهر</div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setRentalApplications({ selectedRental: rental })}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-3 w-3 ml-1" />
                      التفاصيل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setRentalApplications({ editingRental: rental, isEditRentalDialogOpen: true })
                      }}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <FileText className="h-3 w-3 ml-1" />
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setRentalApplications({ deletingRental: rental, isDeleteDialogOpen: true })
                      }}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 ml-1" />
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rental Details Dialog */}
      <Dialog open={!!selectedRental} onOpenChange={() => setRentalApplications({ selectedRental: null })}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل عقد الإيجار</DialogTitle>
            <DialogDescription>
              {selectedRental?.tenant_full_name} - {selectedRental?.unit_label}
            </DialogDescription>
          </DialogHeader>
          {selectedRental && (
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tenant">المستأجر</TabsTrigger>
                <TabsTrigger value="property">العقار</TabsTrigger>
                <TabsTrigger value="contract">العقد</TabsTrigger>
              </TabsList>

              <TabsContent value="tenant" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">المعلومات الشخصية</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">الاسم الكامل</Label>
                        <p className="text-sm text-gray-900 font-medium">{selectedRental.tenant_full_name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">رقم الهوية</Label>
                        <p className="text-sm text-gray-900">{selectedRental.tenant_national_id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">الحالة الاجتماعية</Label>
                        <p className="text-sm text-gray-900 capitalize">{selectedRental.tenant_social_status}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">رقم الهاتف</Label>
                        <p className="text-sm text-gray-900">{selectedRental.tenant_phone}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
                        <p className="text-sm text-gray-900">{selectedRental.tenant_email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">المعلومات المهنية</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">المهنة</Label>
                        <p className="text-sm text-gray-900">{selectedRental.tenant_job_title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">مبلغ الإيجار</Label>
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(selectedRental.base_rent_amount, selectedRental.currency)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">مبلغ الضمان</Label>
                        <p className="text-sm text-gray-900 font-medium">
                          {formatCurrency(selectedRental.deposit_amount, selectedRental.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="property" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">تفاصيل العقار</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">رقم العقار</Label>
                        <p className="text-sm text-gray-900">{selectedRental.property?.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">عدد الغرف</Label>
                        <p className="text-sm text-gray-900">{selectedRental.property?.beds} غرف</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">عدد الحمامات</Label>
                                                <p className="text-sm text-gray-900">{selectedRental.property?.bath} حمام</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">المساحة</Label>
                          <p className="text-sm text-gray-900">{selectedRental.property?.area} متر مربع</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">الموقع</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">خط الطول</Label>
                                                <p className="text-sm text-gray-900">{selectedRental.property?.latitude}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">خط العرض</Label>
                          <p className="text-sm text-gray-900">{selectedRental.property?.longitude}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contract" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">تفاصيل العقد</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">رقم العقد</Label>
                        <p className="text-sm text-gray-900">{selectedRental.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">الحالة</Label>
                        <Badge className={getStatusColor(selectedRental.status)}>
                          {getStatusIcon(selectedRental.status)}
                          <span className="mr-1">{getStatusText(selectedRental.status)}</span>
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">مدة الإيجار</Label>
                        <p className="text-sm text-gray-900">{selectedRental.rental_period_months} شهر</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">خطة الدفع</Label>
                        <p className="text-sm text-gray-900 capitalize">{selectedRental.paying_plan}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-gray-900">التواريخ</h4>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">تاريخ الانتقال</Label>
                        <p className="text-sm text-gray-900">{formatDate(selectedRental.move_in_date)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">تاريخ الإنشاء</Label>
                        <p className="text-sm text-gray-900">{formatDate(selectedRental.created_at)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">آخر تحديث</Label>
                        <p className="text-sm text-gray-900">{formatDate(selectedRental.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedRental.notes && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">ملاحظات</h4>
                    <p className="text-sm text-blue-800">{selectedRental.notes}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRentalApplications({ selectedRental: null })}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">لم يتم العثور على إيجارات</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterStatus !== "all" ? "جرب تعديل معايير البحث" : "لا توجد إيجارات حالياً"}
          </p>
          <Button onClick={() => setRentalApplications({ isAddRentalDialogOpen: true })}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة إيجار جديد
          </Button>
        </div>
      )}

      {/* Edit Rental Dialog */}
      <Dialog open={isEditRentalDialogOpen} onOpenChange={() => setRentalApplications({ isEditRentalDialogOpen: false })}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل عقد الإيجار</DialogTitle>
            <DialogDescription>تعديل تفاصيل عقد الإيجار</DialogDescription>
          </DialogHeader>
          {editingRental && (
            <EditRentalForm 
              rental={editingRental}
              onSubmit={(formData) => handleUpdateRental(editingRental.id, formData)}
              onCancel={() => {
                setRentalApplications({ isEditRentalDialogOpen: false, editingRental: null })
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={() => setRentalApplications({ isDeleteDialogOpen: false })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              تأكيد حذف الإيجار
            </DialogTitle>
            <DialogDescription className="text-red-700">
              ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه!
            </DialogDescription>
          </DialogHeader>
          
          {deletingRental && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  هل أنت متأكد من حذف الإيجار التالي؟
                </p>
                <div className="space-y-2 text-sm text-red-700">
                  <p><strong>المستأجر:</strong> {deletingRental.tenant_full_name}</p>
                  <p><strong>الوحدة:</strong> {deletingRental.unit_label}</p>
                  <p><strong>مبلغ الإيجار:</strong> {formatCurrency(deletingRental.base_rent_amount, deletingRental.currency)}</p>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>تحذير:</strong> سيتم حذف جميع البيانات المرتبطة بهذا الإيجار نهائياً ولا يمكن استردادها.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setRentalApplications({ isDeleteDialogOpen: false, deletingRental: null })
              }}
              disabled={isDeleting}
            >
              إلغاء
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => deletingRental && handleDeleteRental(deletingRental.id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف نهائي
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// مكون إضافة إيجار جديد
interface AddRentalFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

function AddRentalForm({ onSubmit, onCancel, isSubmitting }: AddRentalFormProps) {
  const [formData, setFormData] = useState({
    tenant_full_name: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_job_title: "",
    tenant_social_status: "single",
    tenant_national_id: "",
    property_id: "",
    unit_label: "",
    move_in_date: "",
    rental_period_months: 12,
    paying_plan: "monthly",
    base_rent_amount: "",
    currency: "SAR",
    deposit_amount: "",
    notes: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // التحقق من البيانات المطلوبة
    if (!formData.tenant_full_name || !formData.tenant_phone || !formData.tenant_email || !formData.property_id || !formData.unit_label || !formData.move_in_date) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }
    
    // تحويل البيانات إلى الأنواع الصحيحة
    const processedFormData: any = {
      ...formData,
      property_id: formData.property_id ? parseInt(formData.property_id) : null,
      rental_period_months: Number(formData.rental_period_months) || 12,
      base_rent_amount: formData.base_rent_amount ? parseFloat(formData.base_rent_amount) : 0,
      deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : 0,
    }
    
    console.log("Processed form data:", processedFormData) // للتأكد من البيانات المعالجة
    
    // التحقق من أن البيانات صحيحة
    if (!processedFormData.property_id || processedFormData.base_rent_amount <= 0 || processedFormData.deposit_amount <= 0) {
      alert("يرجى التأكد من إدخال رقم العقار ومبلغ الإيجار ومبلغ الضمان")
      return
    }
    
    onSubmit(processedFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">معلومات المستأجر</h4>
          
          <div className="space-y-2">
            <Label htmlFor="tenant_full_name">الاسم الكامل *</Label>
            <Input 
              id="tenant_full_name"
              value={formData.tenant_full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_full_name: e.target.value }))}
              placeholder="أدخل الاسم الكامل"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_phone">رقم الهاتف *</Label>
            <Input 
              id="tenant_phone"
              value={formData.tenant_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_phone: e.target.value }))}
              placeholder="0551234567"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_email">البريد الإلكتروني *</Label>
            <Input 
              id="tenant_email"
              type="email"
              value={formData.tenant_email}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_email: e.target.value }))}
              placeholder="example@email.com"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_job_title">المهنة</Label>
            <Input 
              id="tenant_job_title"
              value={formData.tenant_job_title}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_job_title: e.target.value }))}
              placeholder="مهندس، طبيب، معلم..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_social_status">الحالة الاجتماعية</Label>
            <Select value={formData.tenant_social_status} onValueChange={(value) => setFormData(prev => ({ ...prev, tenant_social_status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">أعزب</SelectItem>
                <SelectItem value="married">متزوج</SelectItem>
                <SelectItem value="divorced">مطلق</SelectItem>
                <SelectItem value="widowed">أرمل</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_national_id">رقم الهوية</Label>
            <Input 
              id="tenant_national_id"
              value={formData.tenant_national_id}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_national_id: e.target.value }))}
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">تفاصيل العقد</h4>
          
          <div className="space-y-2">
            <Label htmlFor="property_id">رقم العقار *</Label>
            <Input 
              id="property_id"
              type="number"
              value={formData.property_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_id: e.target.value }))}
              placeholder="12"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_label">رمز الوحدة *</Label>
            <Input 
              id="unit_label"
              value={formData.unit_label}
              onChange={(e) => setFormData(prev => ({ ...prev, unit_label: e.target.value }))}
              placeholder="A-12"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="move_in_date">تاريخ الانتقال *</Label>
            <Input 
              id="move_in_date"
              type="date"
              value={formData.move_in_date}
              onChange={(e) => setFormData(prev => ({ ...prev, move_in_date: e.target.value }))}
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rental_period_months">مدة الإيجار (بالشهور) *</Label>
            <Input 
              id="rental_period_months"
              type="number"
              value={formData.rental_period_months}
              onChange={(e) => setFormData(prev => ({ ...prev, rental_period_months: parseInt(e.target.value) }))}
              min="1"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paying_plan">خطة الدفع</Label>
            <Select value={formData.paying_plan} onValueChange={(value) => setFormData(prev => ({ ...prev, paying_plan: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="quarterly">ربع سنوي</SelectItem>
                <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                <SelectItem value="annual">سنوي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_rent_amount">مبلغ الإيجار *</Label>
            <Input 
              id="base_rent_amount"
              type="number"
              value={formData.base_rent_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, base_rent_amount: e.target.value }))}
              placeholder="6500"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_amount">مبلغ الضمان *</Label>
            <Input 
              id="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: e.target.value }))}
              placeholder="10000"
              
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">ملاحظات</Label>
        <Textarea 
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="ملاحظات إضافية حول العقد..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الإضافة...
            </>
          ) : (
            <>
              <Save className="ml-2 h-4 w-4" />
              إضافة الإيجار
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}

// مكون تعديل الإيجار
interface EditRentalFormProps {
  rental: RentalData
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

function EditRentalForm({ rental, onSubmit, onCancel, isSubmitting }: EditRentalFormProps) {
  const [formData, setFormData] = useState({
    tenant_full_name: rental.tenant_full_name,
    tenant_phone: rental.tenant_phone,
    tenant_email: rental.tenant_email,
    tenant_job_title: rental.tenant_job_title,
    tenant_social_status: rental.tenant_social_status,
    tenant_national_id: rental.tenant_national_id,
    unit_label: rental.unit_label,
    move_in_date: rental.move_in_date.split('T')[0],
    rental_period_months: rental.rental_period_months,
    paying_plan: rental.paying_plan,
    base_rent_amount: rental.base_rent_amount,
    currency: rental.currency,
    deposit_amount: rental.deposit_amount,
    notes: rental.notes || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">معلومات المستأجر</h4>
          
          <div className="space-y-2">
            <Label htmlFor="edit_tenant_full_name">الاسم الكامل *</Label>
            <Input 
              id="edit_tenant_full_name"
              value={formData.tenant_full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_full_name: e.target.value }))}
              placeholder="أدخل الاسم الكامل"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_tenant_phone">رقم الهاتف *</Label>
            <Input 
              id="edit_tenant_phone"
              value={formData.tenant_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_phone: e.target.value }))}
              placeholder="0551234567"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_tenant_email">البريد الإلكتروني *</Label>
            <Input 
              id="edit_tenant_email"
              type="email"
              value={formData.tenant_email}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_email: e.target.value }))}
              placeholder="example@email.com"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_tenant_job_title">المهنة</Label>
            <Input 
              id="edit_tenant_job_title"
              value={formData.tenant_job_title}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_job_title: e.target.value }))}
              placeholder="مهندس، طبيب، معلم..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_tenant_social_status">الحالة الاجتماعية</Label>
            <Select value={formData.tenant_social_status} onValueChange={(value) => setFormData(prev => ({ ...prev, tenant_social_status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">أعزب</SelectItem>
                <SelectItem value="married">متزوج</SelectItem>
                <SelectItem value="divorced">مطلق</SelectItem>
                <SelectItem value="widowed">أرمل</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_tenant_national_id">رقم الهوية</Label>
            <Input 
              id="edit_tenant_national_id"
              value={formData.tenant_national_id}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_national_id: e.target.value }))}
              placeholder="1234567890"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 border-b pb-2">تفاصيل العقد</h4>
          
          <div className="space-y-2">
            <Label htmlFor="edit_unit_label">رمز الوحدة *</Label>
            <Input 
              id="edit_unit_label"
              value={formData.unit_label}
              onChange={(e) => setFormData(prev => ({ ...prev, unit_label: e.target.value }))}
              placeholder="A-12"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_move_in_date">تاريخ الانتقال *</Label>
            <Input 
              id="edit_move_in_date"
              type="date"
              value={formData.move_in_date}
              onChange={(e) => setFormData(prev => ({ ...prev, move_in_date: e.target.value }))}
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_rental_period_months">مدة الإيجار (بالشهور) *</Label>
            <Input 
              id="edit_rental_period_months"
              type="number"
              value={formData.rental_period_months}
              onChange={(e) => setFormData(prev => ({ ...prev, rental_period_months: parseInt(e.target.value) }))}
              min="1"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_paying_plan">خطة الدفع</Label>
            <Select value={formData.paying_plan} onValueChange={(value) => setFormData(prev => ({ ...prev, paying_plan: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">شهري</SelectItem>
                <SelectItem value="quarterly">ربع سنوي</SelectItem>
                <SelectItem value="semi_annual">نصف سنوي</SelectItem>
                <SelectItem value="annual">سنوي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_base_rent_amount">مبلغ الإيجار *</Label>
            <Input 
              id="edit_base_rent_amount"
              type="number"
              value={formData.base_rent_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, base_rent_amount: e.target.value }))}
              placeholder="6500"
              
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_deposit_amount">مبلغ الضمان *</Label>
            <Input 
              id="edit_deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: e.target.value }))}
              placeholder="10000"
              
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit_notes">ملاحظات</Label>
        <Textarea 
          id="edit_notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="ملاحظات إضافية حول العقد..."
          rows={3}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري التحديث...
            </>
          ) : (
            <>
              <Edit className="ml-2 h-4 w-4" />
              تحديث الإيجار
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
