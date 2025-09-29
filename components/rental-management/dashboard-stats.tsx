"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PiHandTapLight } from "react-icons/pi"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  Clock,
  CreditCard,
  AlertTriangle,
  Wrench,
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { useRentalDashboardStore } from "@/context/store/rentalDashboard"

// مكون بطاقة الإحصائية
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  onClick: () => void
  loading?: boolean
}

function StatCard({ title, value, icon: Icon, color, bgColor, onClick, loading }: StatCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 group relative"
      onClick={onClick}
    >
      {/* العلامة في الزاوية السفلية اليسرى */}
      <div className={`absolute bottom-3 left-3 h-6 w-6 ${bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
        <PiHandTapLight 
          className="h-3 w-3 text-gray-500" 
          style={{ 
            animation: 'scaleAnimation 1s ease-in-out 7',
            animationFillMode: 'forwards'
          }} 
        />
      </div>
      
      <style jsx>{`
        @keyframes scaleAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
      `}</style>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-gray-400">جاري التحميل...</span>
              </div>
            ) : (
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            )}
          </div>
          <div className={`h-12 w-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// مكون تفاصيل الإيجارات الجارية
function OngoingRentalsDialog() {
  const { 
    ongoingRentals, 
    isOngoingRentalsDialogOpen, 
    closeOngoingRentalsDialog 
  } = useRentalDashboardStore()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  const formatCurrency = (amount: string | null, currency: string = 'SAR') => {
    if (!amount) return 'غير محدد'
    try {
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: currency
      }).format(parseFloat(amount))
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  return (
    <Dialog open={isOngoingRentalsDialogOpen} onOpenChange={closeOngoingRentalsDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            الإيجارات الجارية ({ongoingRentals.length})
          </DialogTitle>
          <DialogDescription>
            قائمة بجميع الإيجارات النشطة حالياً مع تفاصيل كل طلب
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ongoingRentals.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد إيجارات جارية</h3>
              <p className="text-gray-500">لم يتم العثور على أي إيجارات نشطة حالياً</p>
            </div>
          ) : (
            ongoingRentals.map((rental: any) => (
              <Card key={rental.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{rental.tenant_name}</h3>
                        <p className="text-sm text-gray-500">طلب إيجار #{rental.id}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${
                        rental.contract?.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {rental.contract?.status === 'active' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          نشط
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          غير نشط
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{rental.tenant_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {rental.property.name} - {rental.property.unit_label}
                      </span>
                    </div>
                  </div>

                  {/* Contract Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      تفاصيل العقد
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">رقم العقد:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {rental.contract?.id || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">تاريخ الانتهاء:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(rental.contract?.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      معلومات الدفع
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المبلغ المستحق:</span>
                        <span className="text-sm font-bold text-green-600">
                          {formatCurrency(rental.next_payment_amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">موعد الدفع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(rental.next_payment_due_on)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// مكون تفاصيل العقود المنتهية الصلاحية
function ExpiringContractsDialog() {
  const { 
    counts,
    expiringContractsNext30d,
    isExpiringContractsDialogOpen, 
    closeExpiringContractsDialog 
  } = useRentalDashboardStore()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  // استخدام البيانات الصحيحة من API مع ترتيب حسب الأولوية
  const expiringContracts = [...expiringContractsNext30d].sort((a, b) => {
    // ترتيب العقود المنتهية أولاً، ثم الأقرب للانتهاء
    if (a.days_until_expiry < 0 && b.days_until_expiry >= 0) return -1
    if (a.days_until_expiry >= 0 && b.days_until_expiry < 0) return 1
    return a.days_until_expiry - b.days_until_expiry
  })

  return (
    <Dialog open={isExpiringContractsDialogOpen} onOpenChange={closeExpiringContractsDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            العقود المنتهية الصلاحية خلال 30 يوم ({expiringContracts.length})
          </DialogTitle>
          <DialogDescription>
            العقود التي ستنتهي صلاحيتها خلال الثلاثين يوماً القادمة
            {expiringContracts.some(c => c.days_until_expiry <= 7) && (
              <span className="block mt-2 text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                يوجد عقود عاجلة تحتاج إلى متابعة فورية
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expiringContracts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عقود منتهية الصلاحية</h3>
              <p className="text-gray-500">جميع العقود سارية المفعول لأكثر من 30 يوم</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-l-4 border-l-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-gray-600">عقود عاجلة (≤7 أيام)</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      {expiringContracts.filter(c => c.days_until_expiry <= 7).length}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-600">عقود متوسطة الأولوية (8-14 يوم)</span>
                    </div>
                    <p className="text-lg font-bold text-yellow-600">
                      {expiringContracts.filter(c => c.days_until_expiry > 7 && c.days_until_expiry <= 14).length}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">عقود منخفضة الأولوية (15-30 يوم)</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">
                      {expiringContracts.filter(c => c.days_until_expiry > 14 && c.days_until_expiry <= 30).length}
                    </p>
                  </CardContent>
                </Card>
              </div>
              {/* Contract Details */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  تفاصيل العقود
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {expiringContracts.map((contract: any) => {
                    const daysUntilExpiry = contract.days_until_expiry
                    
                    return (
                      <Card key={contract.id} className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
                        daysUntilExpiry <= 7 ? 'border-l-red-500' :
                        daysUntilExpiry <= 14 ? 'border-l-yellow-500' :
                        'border-l-orange-500'
                      }`}>
                        <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                              daysUntilExpiry <= 7 ? 'bg-red-50' :
                              daysUntilExpiry <= 14 ? 'bg-yellow-50' :
                              'bg-orange-50'
                            }`}>
                              <AlertTriangle className={`h-6 w-6 ${
                                daysUntilExpiry <= 7 ? 'text-red-600' :
                                daysUntilExpiry <= 14 ? 'text-yellow-600' :
                                'text-orange-600'
                              }`} />
                            </div>
                            <div>
                              <h3 className={`font-bold text-lg ${
                                daysUntilExpiry <= 7 ? 'text-red-900' :
                                daysUntilExpiry <= 14 ? 'text-yellow-900' :
                                'text-orange-900'
                              }`}>
                                {contract.rental.tenant_name}
                              </h3>
                              <p className="text-sm text-gray-500">عقد #{contract.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${
                              daysUntilExpiry <= 7 ? 'bg-red-100 text-red-800 border-red-200' :
                              daysUntilExpiry <= 14 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {daysUntilExpiry > 0 ? `${daysUntilExpiry} يوم متبقي` : 
                               daysUntilExpiry === 0 ? 'ينتهي اليوم' : 
                               `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`}
                            </Badge>
                            {daysUntilExpiry <= 7 && (
                              <div className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-xs font-medium">عاجل</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Property Info */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{contract.rental.tenant_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {contract.rental.property.name} - {contract.rental.property.unit_label}
                            </span>
                          </div>
                        </div>

                        {/* Contract Details */}
                        <div className={`rounded-lg p-4 ${
                          daysUntilExpiry <= 7 ? 'bg-red-50' :
                          daysUntilExpiry <= 14 ? 'bg-yellow-50' :
                          'bg-orange-50'
                        }`}>
                          <h4 className={`font-semibold mb-3 flex items-center gap-2 ${
                            daysUntilExpiry <= 7 ? 'text-red-900' :
                            daysUntilExpiry <= 14 ? 'text-yellow-900' :
                            'text-orange-900'
                          }`}>
                            <FileText className="h-4 w-4" />
                            تفاصيل انتهاء العقد
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">رقم العقد:</span>
                              <span className="text-sm font-medium text-gray-900">
                                #{contract.id}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">تاريخ البداية:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(contract.start_date)}
                              </span>
                            </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">تاريخ الانتهاء:</span>
                          <span className={`text-sm font-medium ${
                            daysUntilExpiry <= 7 ? 'text-red-600' :
                            daysUntilExpiry <= 14 ? 'text-yellow-600' :
                            'text-orange-600'
                          }`}>
                            {formatDate(contract.end_date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">الأيام المتبقية:</span>
                          <span className={`text-sm font-bold ${
                            daysUntilExpiry <= 7 ? 'text-red-600' :
                            daysUntilExpiry <= 14 ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {daysUntilExpiry > 0 ? `${daysUntilExpiry} يوم` : 
                             daysUntilExpiry === 0 ? 'ينتهي اليوم' : 
                             `منتهي منذ ${Math.abs(daysUntilExpiry)} يوم`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">حالة العقد:</span>
                          <Badge className={`text-xs ${
                            contract.status === 'active' ? 'bg-green-100 text-green-800' :
                            contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {contract.status === 'active' ? 'نشط' :
                             contract.status === 'expired' ? 'منتهي' :
                             contract.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">مدة العقد:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {(() => {
                              const startDate = new Date(contract.start_date)
                              const endDate = new Date(contract.end_date)
                              const diffTime = endDate.getTime() - startDate.getTime()
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                              const months = Math.floor(diffDays / 30)
                              const days = diffDays % 30
                              return months > 0 ? `${months} شهر ${days > 0 ? `و ${days} يوم` : ''}` : `${diffDays} يوم`
                            })()}
                          </span>
                        </div>
                      </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={`flex-1 ${
                          daysUntilExpiry <= 7 ? 'text-red-600 border-red-300 hover:bg-red-50' :
                          daysUntilExpiry <= 14 ? 'text-yellow-600 border-yellow-300 hover:bg-yellow-50' :
                          'text-orange-600 border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <FileText className="h-4 w-4 ml-2" />
                        عرض العقد
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Phone className="h-4 w-4 ml-2" />
                        الاتصال
                      </Button>
                        </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// مكون تفاصيل المدفوعات المستحقة
function PaymentsDueDialog() {
  const { 
    counts,
    rentalAmounts,
    ongoingRentals,
    isPaymentsDueDialogOpen, 
    closePaymentsDueDialog 
  } = useRentalDashboardStore()

  const formatCurrency = (amount: number | string, currency: string = 'SAR') => {
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: currency
      }).format(numAmount)
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  // فلترة المدفوعات المستحقة خلال 7 أيام
  const paymentsDue = ongoingRentals.filter((rental: any) => {
    if (!rental.next_payment_due_on) return false
    const dueDate = new Date(rental.next_payment_due_on)
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  })

  return (
    <Dialog open={isPaymentsDueDialogOpen} onOpenChange={closePaymentsDueDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            المدفوعات المستحقة خلال 7 أيام ({paymentsDue.length})
          </DialogTitle>
          <DialogDescription>
            المدفوعات التي تستحق خلال الأسبوع القادم
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">المجموع هذا الشهر</span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(rentalAmounts.total_to_collect_this_month)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">المجموع الشهر القادم</span>
                </div>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(rentalAmounts.total_to_collect_next_month)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">المجموع المحصل</span>
                </div>
                <p className="text-lg font-bold text-purple-600">
                  {formatCurrency(rentalAmounts.total_collected)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentsDue.length === 0 ? (
              <div className="col-span-2 text-center py-12">
                <CreditCard className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مدفوعات مستحقة</h3>
                <p className="text-gray-500">جميع المدفوعات مستحقة لأكثر من 7 أيام</p>
              </div>
            ) : (
              paymentsDue.map((rental: any) => {
                const dueDate = new Date(rental.next_payment_due_on)
                const today = new Date()
                const diffTime = dueDate.getTime() - today.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                
                return (
                  <Card key={rental.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{rental.tenant_name}</h3>
                            <p className="text-sm text-gray-500">دفعة #{rental.id}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {diffDays} يوم متبقي
                        </Badge>
                      </div>

                      {/* Property Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{rental.tenant_phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {rental.property.name} - {rental.property.unit_label}
                          </span>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          تفاصيل الدفع
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">المبلغ المستحق:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatCurrency(rental.next_payment_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">موعد الاستحقاق:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(rental.next_payment_due_on)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">الأيام المتبقية:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {diffDays} يوم
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// مكون تفاصيل المدفوعات المتأخرة
function PaymentsOverdueDialog() {
  const { 
    counts,
    ongoingRentals,
    isPaymentsOverdueDialogOpen, 
    closePaymentsOverdueDialog 
  } = useRentalDashboardStore()

  const formatCurrency = (amount: string | null, currency: string = 'SAR') => {
    if (!amount) return 'غير محدد'
    try {
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: currency
      }).format(parseFloat(amount))
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  // فلترة المدفوعات المتأخرة
  const overduePayments = ongoingRentals.filter((rental: any) => {
    if (!rental.next_payment_due_on) return false
    const dueDate = new Date(rental.next_payment_due_on)
    const today = new Date()
    return dueDate < today
  })

  return (
    <Dialog open={isPaymentsOverdueDialogOpen} onOpenChange={closePaymentsOverdueDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            المدفوعات المتأخرة ({overduePayments.length})
          </DialogTitle>
          <DialogDescription>
            المدفوعات التي تجاوزت موعد استحقاقها
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {overduePayments.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مدفوعات متأخرة</h3>
              <p className="text-gray-500">جميع المدفوعات في موعدها</p>
            </div>
          ) : (
            overduePayments.map((rental: any) => {
              const dueDate = new Date(rental.next_payment_due_on)
              const today = new Date()
              const diffTime = today.getTime() - dueDate.getTime()
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              
              return (
                <Card key={rental.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-500">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{rental.tenant_name}</h3>
                          <p className="text-sm text-gray-500">دفعة متأخرة #{rental.id}</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        متأخرة {diffDays} يوم
                      </Badge>
                    </div>

                    {/* Property Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{rental.tenant_phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {rental.property.name} - {rental.property.unit_label}
                        </span>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        تفاصيل الدفع المتأخر
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">المبلغ المتأخر:</span>
                          <span className="text-sm font-bold text-red-600">
                            {formatCurrency(rental.next_payment_amount)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">تاريخ الاستحقاق:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(rental.next_payment_due_on)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">مدة التأخير:</span>
                          <span className="text-sm font-bold text-red-600">
                            {diffDays} يوم
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// مكون تفاصيل طلبات الصيانة المفتوحة
function MaintenanceOpenDialog() {
  const { 
    counts,
    maintenance,
    isMaintenanceOpenDialogOpen, 
    closeMaintenanceOpenDialog 
  } = useRentalDashboardStore()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  // دالة تنسيق العملة
  const formatCurrency = (amount: string | number) => {
    if (!amount) return 'غير محدد'
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      if (isNaN(numAmount)) return 'مبلغ غير صحيح'
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: 'SAR'
      }).format(numAmount)
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  // فلترة طلبات الصيانة المفتوحة
  const openMaintenance = maintenance.filter((item: any) => item.status === 'open')

  return (
    <Dialog open={isMaintenanceOpenDialogOpen} onOpenChange={closeMaintenanceOpenDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-orange-600" />
            طلبات الصيانة المفتوحة ({openMaintenance.length})
          </DialogTitle>
          <DialogDescription>
            طلبات الصيانة التي لم يتم البدء في تنفيذها بعد
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openMaintenance.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Wrench className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات صيانة مفتوحة</h3>
              <p className="text-gray-500">جميع طلبات الصيانة قيد التنفيذ أو مكتملة</p>
            </div>
          ) : (
            openMaintenance.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.title || 'طلب صيانة'}</h3>
                        <p className="text-sm text-gray-500">طلب #{item.id}</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      مفتوح
                    </Badge>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        طلب صيانة #{item.rental_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        تاريخ الطلب: {formatDate(item.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        التكلفة المقدرة: {formatCurrency(item.estimated_cost)}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Details */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      تفاصيل الصيانة
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الفئة:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.category === 'electrical' ? 'كهربائي' : 
                           item.category === 'plumbing' ? 'سباكة' :
                           item.category === 'hvac' ? 'تكييف' :
                           item.category === 'general' ? 'عام' : item.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الأولوية:</span>
                        <Badge className={`text-xs ${
                          item.priority === 'high' ? 'bg-red-100 text-red-800' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority === 'high' ? 'عالي' :
                           item.priority === 'medium' ? 'متوسط' :
                           item.priority === 'low' ? 'منخفض' : item.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المدفوع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer === 'tenant' ? 'المستأجر' :
                           item.payer === 'landlord' ? 'المالك' :
                           item.payer === 'shared' ? 'مشترك' : item.payer}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">نسبة الدفع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer_share_percent}%
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// مكون تفاصيل طلبات الصيانة قيد التنفيذ
function MaintenanceInProgressDialog() {
  const { 
    counts,
    maintenance,
    isMaintenanceInProgressDialogOpen, 
    closeMaintenanceInProgressDialog 
  } = useRentalDashboardStore()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'تاريخ غير صحيح'
    }
  }

  // دالة تنسيق العملة
  const formatCurrency = (amount: string | number) => {
    if (!amount) return 'غير محدد'
    try {
      const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
      if (isNaN(numAmount)) return 'مبلغ غير صحيح'
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: 'SAR'
      }).format(numAmount)
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  // فلترة طلبات الصيانة قيد التنفيذ
  const inProgressMaintenance = maintenance.filter((item: any) => item.status === 'in_progress')

  return (
    <Dialog open={isMaintenanceInProgressDialogOpen} onOpenChange={closeMaintenanceInProgressDialog}>
      <DialogContent className="sm:max-w-[1000px] max-h-[85vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />
            طلبات الصيانة قيد التنفيذ ({inProgressMaintenance.length})
          </DialogTitle>
          <DialogDescription>
            طلبات الصيانة التي يتم تنفيذها حالياً
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inProgressMaintenance.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <Wrench className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات صيانة قيد التنفيذ</h3>
              <p className="text-gray-500">جميع طلبات الصيانة مفتوحة أو مكتملة</p>
            </div>
          ) : (
            inProgressMaintenance.map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{item.title || 'طلب صيانة'}</h3>
                        <p className="text-sm text-gray-500">طلب #{item.id}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      قيد التنفيذ
                    </Badge>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        طلب صيانة #{item.rental_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        تاريخ البدء: {formatDate(item.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        التكلفة المقدرة: {formatCurrency(item.estimated_cost)}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Details */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      تفاصيل الصيانة
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الفئة:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.category === 'electrical' ? 'كهربائي' : 
                           item.category === 'plumbing' ? 'سباكة' :
                           item.category === 'hvac' ? 'تكييف' :
                           item.category === 'general' ? 'عام' : item.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">الأولوية:</span>
                        <Badge className={`text-xs ${
                          item.priority === 'high' ? 'bg-red-100 text-red-800' :
                          item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {item.priority === 'high' ? 'عالي' :
                           item.priority === 'medium' ? 'متوسط' :
                           item.priority === 'low' ? 'منخفض' : item.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">المدفوع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer === 'tenant' ? 'المستأجر' :
                           item.payer === 'landlord' ? 'المالك' :
                           item.payer === 'shared' ? 'مشترك' : item.payer}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">نسبة الدفع:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.payer_share_percent}%
                        </span>
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-gray-700">{item.description}</p>
                      </div>
                    )}
                    {item.assigned_to_vendor_id && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">المقاول المسؤول:</span>
                          <span className="text-sm font-medium text-gray-900">#{item.assigned_to_vendor_id}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// المكون الرئيسي
export function RentalDashboardStats() {
  const {
    counts,
    rentalAmounts,
    ongoingRentals,
    loading,
    error,
    isInitialized,
    setDashboardData,
    setLoading,
    setError,
    openOngoingRentalsDialog,
    openExpiringContractsDialog,
    openPaymentsDueDialog,
    openPaymentsOverdueDialog,
    openMaintenanceOpenDialog,
    openMaintenanceInProgressDialog
  } = useRentalDashboardStore()

  // جلب البيانات من API
  const fetchDashboardData = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    const token = useAuthStore.getState().userData?.token;
    if (!token) {
      console.log("No token available, skipping fetchDashboardData");
      return;
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await axiosInstance.get("/v1/rms/dashboard")
      
      if (response.data.status) {
        setDashboardData(response.data.data)
      } else {
        setError("فشل في جلب بيانات لوحة المعلومات")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isInitialized) {
      fetchDashboardData()
    }
  }, [isInitialized])

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    try {
      return new Intl.NumberFormat('ar-US', {
        style: 'currency',
        currency: currency
      }).format(amount)
    } catch {
      return 'مبلغ غير صحيح'
    }
  }

  // فلترة المدفوعات المتأخرة
  const overduePayments = ongoingRentals.filter((rental: any) => {
    if (!rental.next_payment_due_on) return false
    const dueDate = new Date(rental.next_payment_due_on)
    const today = new Date()
    return dueDate < today
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">حدث خطأ</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchDashboardData}>
          <Loader2 className="ml-2 h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات الإيجارات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="الإيجارات الجارية"
          value={counts.ongoing_rentals}
          icon={Users}
          color="text-green-600"
          bgColor="bg-green-50"
          onClick={openOngoingRentalsDialog}
          loading={loading}
        />
        
        <StatCard
          title="العقود المنتهية خلال 30 يوم"
          value={counts.expiring_contracts_next_30d}
          icon={AlertTriangle}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          onClick={openExpiringContractsDialog}
          loading={loading}
        />
        
        <StatCard
          title="المدفوعات المستحقة خلال 7 أيام"
          value={counts.payments_due_next_7d}
          icon={CreditCard}
          color="text-orange-600"
          bgColor="bg-orange-50"
          onClick={openPaymentsDueDialog}
          loading={loading}
        />
        
        <StatCard
          title="المدفوعات المتأخرة"
          value={overduePayments.length}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-100"
          onClick={openPaymentsOverdueDialog}
          loading={loading}
        />
      </div>

      {/* إحصائيات المالية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">المجموع هذا الشهر</p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(rentalAmounts.total_to_collect_this_month)}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">المجموع الشهر القادم</p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(rentalAmounts.total_to_collect_next_month)}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">المجموع المحصل</p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(rentalAmounts.total_collected)}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">عدد العقارات المؤجرة</p>
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    <span className="text-gray-400">جاري التحميل...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {rentalAmounts.rented_properties_count}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      
      {/* إحصائيات الصيانة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="طلبات الصيانة المفتوحة"
          value={counts.maintenance_open}
          icon={Wrench}
          color="text-orange-600"
          bgColor="bg-orange-50"
          onClick={openMaintenanceOpenDialog}
          loading={loading}
        />
        
        <StatCard
          title="طلبات الصيانة قيد التنفيذ"
          value={counts.maintenance_in_progress}
          icon={Wrench}
          color="text-gray-600"
          bgColor="bg-gray-100"
          onClick={openMaintenanceInProgressDialog}
          loading={loading}
        />
      </div>
      {/* Dialogs */}
      <OngoingRentalsDialog />
      <ExpiringContractsDialog />
      <PaymentsDueDialog />
      <PaymentsOverdueDialog />
      <MaintenanceOpenDialog />
      <MaintenanceInProgressDialog />
    </div>
  )
}
