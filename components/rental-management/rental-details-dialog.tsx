"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  MapPin,
  Hash,
  Loader2,
  RefreshCw,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"

interface RentalDetails {
  rental: {
    id: number
    tenant_full_name: string
    tenant_phone: string
    tenant_email: string
    tenant_job_title: string
    tenant_social_status: string
    tenant_national_id: string
    base_rent_amount: number
    deposit_amount: number
    currency: string
    move_in_date: string
    paying_plan: string
    rental_period_months: number
    status: string
    notes: string
  }
  property: {
    id: number
    name: string
    unit_label: string
    property_number: string
    project: {
      id: number
      name: string | null
    }
  }
  contract: {
    id: number
    contract_number: string
    start_date: string
    end_date: string
    status: string
  }
  payment_details: {
    items: Array<{
      id: number
      sequence_no: number
      due_date: string
      amount: number
      paid_amount: number
      status: string
      payment_type: string
      payment_status: string
      reference: string | null
      paid_at: string | null
    }>
  }
}

interface RentalDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  rentalId: number | null
}

export function RentalDetailsDialog({ isOpen, onClose, rentalId }: RentalDetailsDialogProps) {
  const [details, setDetails] = useState<RentalDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("tenant")

  // Fetch rental details when dialog opens
  useEffect(() => {
    if (isOpen && rentalId) {
      fetchRentalDetails()
    }
  }, [isOpen, rentalId])

  const fetchRentalDetails = async () => {
    if (!rentalId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.get(`/v1/rms/rentals/${rentalId}/details`)
      
      if (response.data.status) {
        setDetails(response.data.data)
      } else {
        setError("فشل في تحميل تفاصيل طلب الإيجار")
      }
    } catch (err: any) {
      console.error("Error fetching rental details:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل التفاصيل")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = "SAR") => {
    return new Intl.NumberFormat('ar-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 ml-1" />
      case 'pending':
        return <Clock className="h-4 w-4 ml-1" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 ml-1" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 ml-1" />
      default:
        return <AlertCircle className="h-4 w-4 ml-1" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط'
      case 'pending':
        return 'في الانتظار'
      case 'completed':
        return 'مكتمل'
      case 'cancelled':
        return 'ملغي'
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'not_due':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع'
      case 'pending':
        return 'في الانتظار'
      case 'overdue':
        return 'متأخر'
      case 'not_due':
        return 'غير مستحق'
      default:
        return status
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6" dir="rtl">
        <DialogHeader className="space-y-2 sm:space-y-4 text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
              تفاصيل طلب الإيجار
            </DialogTitle>
            <div className="flex items-center gap-2">
              {details && (
                <Badge className={`${getStatusColor(details.rental.status)} border`}>
                  {getStatusIcon(details.rental.status)}
                  <span className="mr-1">{getStatusText(details.rental.status)}</span>
                </Badge>
              )}
              <button
                onClick={fetchRentalDetails}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12 text-right">
            <span className="ml-2 text-sm sm:text-base text-gray-500">جاري تحميل التفاصيل...</span>
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8 sm:py-12 text-right">
            <span className="text-sm sm:text-base text-red-500">{error}</span>
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
          </div>
        )}

        {details && !loading && (
          <div className="space-y-4 sm:space-y-6 text-right">
            {/* Custom Tabs Navigation */}
            <div className="w-full" dir="rtl">
              <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg" dir="rtl">
                <button
                  onClick={() => setActiveTab("tenant")}
                  className={`flex items-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                    activeTab === "tenant" 
                      ? "bg-white " 
                      : ""
                  }`}
                  dir="rtl"
                >
                  <span className="hidden sm:inline">بيانات المستأجر</span>
                  <span className="sm:hidden">المستأجر</span>
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setActiveTab("property")}
                  className={`flex items-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                    activeTab === "property" 
                      ? "bg-white " 
                      : ""
                  }`}
                  dir="rtl"
                >
                  <span className="hidden sm:inline">بيانات العقار</span>
                  <span className="sm:hidden">العقار</span>
                  <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setActiveTab("contract")}
                  className={`flex items-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                    activeTab === "contract" 
                      ? "bg-white " 
                      : ""
                  }`}
                  dir="rtl"
                >
                  العقد
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setActiveTab("payments")}
                  className={`flex items-center gap-1 sm:gap-2 text-center text-xs sm:text-sm p-2 rounded-md transition-all ${
                    activeTab === "payments" 
                      ? "bg-white " 
                      : ""
                  }`}
                  dir="rtl"
                >
                  المدفوعات
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "tenant" && (
              <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-right text-base sm:text-lg" dir="rtl">
                      معلومات المستأجر
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6" dir="rtl">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4" dir="rtl">
                      <div className="space-y-1 text-right" dir="rtl">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                          {details.rental.tenant_full_name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 text-right">{details.rental.tenant_job_title}</p>
                        <Badge variant="outline" className="w-fit text-xs sm:text-sm">
                          {details.rental.tenant_social_status === 'married' ? 'متزوج' : 'أعزب'}
                        </Badge>
                      </div>
                      <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                        <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-600 text-white text-lg sm:text-xl font-bold">
                          {details.rental.tenant_full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" dir="rtl">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 text-right">رقم الهاتف</p>
                            <p className="text-sm sm:text-base font-semibold text-right">{details.rental.tenant_phone}</p>
                          </div>
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 text-right">البريد الإلكتروني</p>
                            <p className="text-sm sm:text-base font-semibold text-right break-all">{details.rental.tenant_email}</p>
                          </div>
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 text-right">رقم الهوية</p>
                            <p className="text-sm sm:text-base font-semibold text-right">{details.rental.tenant_national_id}</p>
                          </div>
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                      </div>
                    </div>

                    {details.rental.notes && (
                      <>
                        <Separator />
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 text-right">ملاحظات</p>
                          <p className="text-sm sm:text-base text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg text-right">
                            {details.rental.notes}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "property" && (
              <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-right text-base sm:text-lg" dir="rtl">
                      معلومات العقار
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6" dir="rtl">
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4" dir="rtl">
                      <div className="space-y-1 text-right" dir="rtl">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                          {details.property.name}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 text-right">الوحدة: {details.property.unit_label}</p>
                        <p className="text-xs sm:text-sm text-gray-500 text-right">رقم العقار: {details.property.property_number}</p>
                      </div>
                      <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center">
                        <Home className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4" dir="rtl">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 text-right">رقم العقار</p>
                            <p className="text-sm sm:text-base font-semibold text-right">{details.property.property_number}</p>
                          </div>
                          <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                          <div className="text-right" dir="rtl">
                            <p className="text-xs sm:text-sm text-gray-500 text-right">الوحدة</p>
                            <p className="text-sm sm:text-base font-semibold text-right">{details.property.unit_label}</p>
                          </div>
                          <Building2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        {details.property.project.name && (
                          <div className="flex items-center gap-2 sm:gap-3" dir="rtl">
                            <div className="text-right" dir="rtl">
                              <p className="text-xs sm:text-sm text-gray-500 text-right">المشروع</p>
                              <p className="text-sm sm:text-base font-semibold text-right">{details.property.project.name}</p>
                            </div>
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "contract" && (
              <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-right text-base sm:text-lg" dir="rtl">
                      تفاصيل العقد
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 text-right p-3 sm:p-6" dir="rtl">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4" dir="rtl">
                      <Badge className={`${getStatusColor(details.contract.status)} border text-xs sm:text-sm`}>
                        {getStatusIcon(details.contract.status)}
                        <span className="mr-1">{getStatusText(details.contract.status)}</span>
                      </Badge>
                      <div className="text-right" dir="rtl">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-right">
                          {details.contract.contract_number}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 text-right">رقم العقد</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" dir="rtl">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">مبلغ الإيجار الأساسي</p>
                          <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
                            {formatCurrency(details.rental.base_rent_amount, details.rental.currency)}
                          </p>
                        </div>
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">مبلغ الضمان</p>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                            {formatCurrency(details.rental.deposit_amount, details.rental.currency)}
                          </p>
                        </div>
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">خطة الدفع</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                            {details.rental.paying_plan === 'monthly' ? 'شهري' : 
                             details.rental.paying_plan === 'quarterly' ? 'ربع سنوي' :
                             details.rental.paying_plan === 'semi_annual' ? 'نصف سنوي' :
                             details.rental.paying_plan === 'annual' ? 'سنوي' : 
                             details.rental.paying_plan}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">مدة الإيجار</p>
                          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 text-right">
                            {details.rental.rental_period_months} شهر
                          </p>
                        </div>
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">تاريخ بداية العقد</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                            {formatDate(details.contract.start_date)}
                          </p>
                        </div>
                        <div className="text-right" dir="rtl">
                          <p className="text-xs sm:text-sm text-gray-500 mb-1 text-right">تاريخ انتهاء العقد</p>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                            {formatDate(details.contract.end_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-3 sm:space-y-4 text-right" dir="rtl">
                <Card>
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-right text-base sm:text-lg" dir="rtl">
                      جدول المدفوعات
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-right p-3 sm:p-6" dir="rtl">
                    <div className="space-y-3"  dir="rtl">
                      {details.payment_details.items.map((payment, index) => (
                        <div
                          key={payment.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-4"
                          dir="rtl"
                        >
                           <div className="flex items-center gap-3 sm:gap-4" dir="rtl">
                             <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                               {payment.sequence_no}
                             </div>
                             <div className="text-right" dir="rtl">
                               <p className="text-sm sm:text-base font-semibold text-gray-900 text-right">
                                 الدفعة رقم {payment.sequence_no}
                               </p>
                               <p className="text-xs sm:text-sm text-gray-500 text-right">
                                 مستحق في: {formatDate(payment.due_date)}
                               </p>
                             </div>
                           </div>
                            <div className="flex items-center gap-3 sm:gap-4" dir="rtl">
                              <div className="text-right" dir="rtl">
                                <p className="text-sm sm:text-base font-bold text-gray-900 text-right">
                                  {formatCurrency(payment.amount, details.rental.currency)}
                                </p>
                                {payment.paid_amount > 0 && (
                                  <p className="text-xs sm:text-sm text-green-600 text-right">
                                    مدفوع: {formatCurrency(payment.paid_amount, details.rental.currency)}
                                  </p>
                                )}
                              </div>
                             <Badge className={`${getPaymentStatusColor(payment.payment_status)} border text-xs sm:text-sm`}>
                               {getPaymentStatusText(payment.payment_status)}
                             </Badge>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
