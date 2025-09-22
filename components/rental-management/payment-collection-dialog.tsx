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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  CreditCard,
  DollarSign,
  Calendar,
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Hash,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calculator,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import useStore from "@/context/Store"

interface PaymentCollectionData {
  rental_info: {
    id: number
    tenant_name: string
    tenant_phone: string
    tenant_email: string
    property_address: string
    unit_label: string
    property_number: string
    contract_number: string | null
  }
  contract: {
    id: number
    contract_number: string | null
    start_date: string
  }
  property: {
    id: number | null
    name: string | null
    unit_label: string
    property_number: string
    project: {
      id: number | null
      name: string | null
    }
  }
  fees_breakdown: {
    platform_fee: number
    water_fee: number
    office_fee: number
    office_commission_value: number
    total_fees: number
  }
  available_fees: Array<{
    fee_type: string
    fee_name: string
    total_amount: number
    paid_amount: string
    remaining_amount: number
    status: string
  }>
  payment_details: {
    items: Array<{
      id: number
      sequence_no: number
      due_date: string
      rent_amount: number
      paid_amount: number
      remaining_amount: number
      status: string
      is_overdue: boolean
    }>
    summary: {
      total_rent_due: number
      total_fees_due: number
      total_due: number
      total_paid: number
      total_remaining: number
      overdue_count: number
      paid_count: number
      partial_count: number
      unpaid_count: number
    }
  }
}

export function PaymentCollectionDialog() {
  const { 
    rentalApplications, 
    closePaymentCollectionDialog 
  } = useStore()
  
  const {
    isPaymentCollectionDialogOpen,
    selectedPaymentRentalId
  } = rentalApplications

  const [data, setData] = useState<PaymentCollectionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<Array<{
    id: number
    sequence_no: number
    amount: number
    due_date: string
    rent_amount: number
  }>>([])
  const [paymentType, setPaymentType] = useState<'rent' | 'fees' | 'both'>('rent')
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'credit_card'>('bank_transfer')
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [reference, setReference] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [selectedFees, setSelectedFees] = useState<Array<{
    type: string
    amount: number
    label: string
  }>>([])

  // Fetch payment collection data when dialog opens
  useEffect(() => {
    if (isPaymentCollectionDialogOpen && selectedPaymentRentalId) {
      fetchPaymentCollectionData()
    }
  }, [isPaymentCollectionDialogOpen, selectedPaymentRentalId])

  // Auto-update payment type based on selections
  useEffect(() => {
    if (selectedPayments.length > 0 && selectedFees.length > 0) {
      setPaymentType('both')
    } else if (selectedFees.length > 0) {
      setPaymentType('fees')
    } else if (selectedPayments.length > 0) {
      setPaymentType('rent')
    }
  }, [selectedPayments.length, selectedFees.length])

  const fetchPaymentCollectionData = async () => {
    if (!selectedPaymentRentalId) return

    setLoading(true)
    setError(null)
    
    try {
      const response = await axiosInstance.get(`/v1/rms/rentals/${selectedPaymentRentalId}/payment-collection`)
      
      if (response.data.status) {
        setData(response.data.data)
      } else {
        setError("فشل في تحميل بيانات تحصيل المدفوعات")
      }
    } catch (err: any) {
      console.error("Error fetching payment collection data:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSelect = (payment: any) => {
    const paymentData = {
      id: payment.id,
      sequence_no: payment.sequence_no,
      amount: payment.rent_amount, // Only rent amount now
      due_date: payment.due_date,
      rent_amount: payment.rent_amount
    }

    setSelectedPayments(prev => {
      const isSelected = prev.some(p => p.id === payment.id)
      
      if (isSelected) {
        // Remove payment if already selected
        const newPayments = prev.filter(p => p.id !== payment.id)
        // Subtract the removed payment amount from current input
        const currentAmount = Number(paymentAmount) || 0
        const newAmount = Math.max(0, currentAmount - paymentData.amount)
        setPaymentAmount(newAmount.toString())
        return newPayments
      } else {
        // Add payment if not selected
        const newPayments = [...prev, paymentData]
        // Add the new payment amount to current input
        const currentAmount = Number(paymentAmount) || 0
        const newAmount = currentAmount + paymentData.amount
        setPaymentAmount(newAmount.toString())
        return newPayments
      }
    })
  }

  const handleFeeSelect = (feeType: string, amount: number, label: string) => {
    setSelectedFees(prev => {
      const isSelected = prev.some(f => f.type === feeType)
      
      if (isSelected) {
        // Remove fee if already selected
        const newFees = prev.filter(f => f.type !== feeType)
        // Subtract the removed fee amount from current input
        const currentAmount = Number(paymentAmount) || 0
        const newAmount = Math.max(0, currentAmount - amount)
        setPaymentAmount(newAmount.toString())
        return newFees
      } else {
        // Add fee if not selected
        const newFees = [...prev, { type: feeType, amount, label }]
        // Add the new fee amount to current input
        const currentAmount = Number(paymentAmount) || 0
        const newAmount = currentAmount + amount
        setPaymentAmount(newAmount.toString())
        return newFees
      }
    })
  }

  // Calculate total amount from selected payments and fees
  const getTotalSelectedAmount = () => {
    const paymentsTotal = selectedPayments.reduce((sum, p) => sum + p.amount, 0)
    const feesTotal = selectedFees.reduce((sum, f) => sum + f.amount, 0)
    return paymentsTotal + feesTotal
  }

  // Check if payment amount is valid
  const isPaymentAmountValid = () => {
    const totalSelected = getTotalSelectedAmount()
    const enteredAmount = Number(paymentAmount) || 0
    return enteredAmount >= totalSelected
  }

  // Get validation message
  const getValidationMessage = () => {
    const totalSelected = getTotalSelectedAmount()
    const enteredAmount = Number(paymentAmount) || 0
    
    if (totalSelected === 0) return null
    
    if (enteredAmount < totalSelected) {
      return `المبلغ المدخل (${formatCurrency(enteredAmount)}) أقل من المبلغ المحدد (${formatCurrency(totalSelected)}). يرجى إزالة بعض الدفعات أو الرسوم أو زيادة المبلغ المدخل.`
    }
    
    return null
  }

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentRentalId || !paymentAmount || isNaN(Number(paymentAmount)) || !isPaymentAmountValid()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Build payments array based on payment type and selected payments
      const payments = []
      
      // Handle individual fees first
      if (selectedFees.length > 0) {
        for (const fee of selectedFees) {
          payments.push({
            installment_id: 0, // General fees not tied to specific installments
            payment_type: fee.type,
            amount: fee.amount,
            notes: fee.label
          })
        }
      }
      
      // Handle selected payments (rent only)
      if (selectedPayments.length > 0) {
        for (const selectedPayment of selectedPayments) {
          payments.push({
            installment_id: selectedPayment.id,
            payment_type: 'rent',
            amount: selectedPayment.rent_amount,
            notes: `دفع إيجار - الدفعة رقم ${selectedPayment.sequence_no}`
          })
        }
      }

      const requestBody = {
        payments,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        reference: reference || `PAY-${Date.now()}`,
        notes: notes || `دفع ${paymentType === 'rent' ? 'إيجار' : paymentType === 'fees' ? 'رسوم' : 'إيجار ورسوم'}`
      }

      const response = await axiosInstance.post(`/v1/rms/rentals/${selectedPaymentRentalId}/collect-payment`, requestBody)
      
      if (response.data.status) {
        // Refresh data after successful payment
        await fetchPaymentCollectionData()
        setPaymentAmount("")
        setSelectedPayments([])
        setSelectedFees([])
        setReference("")
        setNotes("")
        // Show success message or handle success
      }
    } catch (err: any) {
      console.error("Error submitting payment:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال الدفع")
    } finally {
      setIsSubmitting(false)
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

  const translateFeeName = (feeName: string) => {
    const translations: { [key: string]: string } = {
      'Platform Fee': 'رسوم المنصة',
      'Water Fee': 'رسوم المياه',
      'Office Fee': 'رسوم المكتب',
      'platform_fee': 'رسوم المنصة',
      'water_fee': 'رسوم المياه',
      'office_fee': 'رسوم المكتب'
    }
    
    return translations[feeName] || feeName
  }

  const getPaymentStatusColor = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return 'bg-red-100 text-red-800 border-red-200'
    }
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusText = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return 'متأخر'
    }
    switch (status) {
      case 'paid':
        return 'مدفوع'
      case 'pending':
        return 'في الانتظار'
      case 'overdue':
        return 'متأخر'
      default:
        return status
    }
  }

  const getPaymentStatusIcon = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return <XCircle className="h-4 w-4 ml-1" />
    }
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 ml-1" />
      case 'pending':
        return <Clock className="h-4 w-4 ml-1" />
      case 'overdue':
        return <XCircle className="h-4 w-4 ml-1" />
      default:
        return <AlertCircle className="h-4 w-4 ml-1" />
    }
  }

  if (!isPaymentCollectionDialogOpen) return null

  return (
    <Dialog open={isPaymentCollectionDialogOpen} onOpenChange={closePaymentCollectionDialog}>
      <DialogContent className="w-[95vw] max-w-7xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6" dir="rtl">
        <DialogHeader className="space-y-2 sm:space-y-4 text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right">
              تحصيل المدفوعات
            </DialogTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchPaymentCollectionData}
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
            <span className="ml-2 text-sm sm:text-base text-gray-500">جاري تحميل البيانات...</span>
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-500" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8 sm:py-12 text-right">
            <span className="text-sm sm:text-base text-red-500">{error}</span>
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 mr-2" />
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6 text-right">
            {/* Rental Info Card */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  معلومات المستأجر والعقار
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Tenant Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" dir="rtl">
                      <User className="h-5 w-5" />
                      بيانات المستأجر
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">الاسم</p>
                          <p className="font-semibold text-gray-900">{data.rental_info.tenant_name}</p>
                        </div>
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">الهاتف</p>
                          <p className="font-semibold text-gray-900">{data.rental_info.tenant_phone}</p>
                        </div>
                        <Phone className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-semibold text-gray-900 break-all">{data.rental_info.tenant_email}</p>
                        </div>
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2" dir="rtl">
                      <Building2 className="h-5 w-5" />
                      بيانات العقار
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">رقم العقار</p>
                          <p className="font-semibold text-gray-900">{data.rental_info.property_number}</p>
                        </div>
                        <Hash className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">الوحدة</p>
                          <p className="font-semibold text-gray-900">{data.rental_info.unit_label}</p>
                        </div>
                        <Building2 className="h-4 w-4 text-gray-500" />
                      </div>
                      {data.rental_info.contract_number && (
                        <div className="flex items-center gap-3" dir="rtl">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">رقم العقد</p>
                            <p className="font-semibold text-gray-900">{data.rental_info.contract_number}</p>
                          </div>
                          <Hash className="h-4 w-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  ملخص المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي المستحق</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details.summary.total_due)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي المدفوع</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details.summary.total_paid)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتبقي</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details.summary.total_remaining)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتأخرات</p>
                    <p className="text-lg font-bold text-gray-900">{data.payment_details.summary.overdue_count}</p>
                  </div>
                </div>

                {/* Fees Breakdown */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">تفاصيل الرسوم</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">إجمالي الإيجار</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.payment_details.summary.total_rent_due)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">إجمالي الرسوم</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.payment_details.summary.total_fees_due)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المنصة</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown.platform_fee)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المياه</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown.water_fee)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المكتب</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown.office_fee)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">عمولة المكتب</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown.office_commission_value)}</p>
                    </div>
                  </div>
                  
                  {/* Individual Fee Selection */}
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <h4 className="text-md font-bold text-gray-900 mb-3 text-center">اختر الرسوم المطلوب دفعها</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {data.available_fees.map((fee) => {
                        const isPaid = fee.remaining_amount === 0
                        const isSelected = selectedFees.some(f => f.type === fee.fee_type)
                        
                        return (
                          <button
                            key={fee.fee_type}
                            onClick={() => !isPaid && handleFeeSelect(fee.fee_type, fee.remaining_amount, translateFeeName(fee.fee_name))}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                              isPaid
                                ? 'bg-green-50 border-2 border-green-200 cursor-not-allowed opacity-75'
                                : isSelected
                                ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white border-gray-800 shadow-lg cursor-pointer'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:shadow-md cursor-pointer'
                            }`}
                          >
                            <div className="text-center">
                              <p className={`font-semibold ${
                                isPaid ? 'text-green-800' : isSelected ? 'text-white' : 'text-gray-700'
                              }`}>
                                {translateFeeName(fee.fee_name)}
                                {isPaid && ' (مدفوعة)'}
                              </p>
                              <p className={`text-sm ${
                                isPaid ? 'text-green-600' : isSelected ? 'text-white' : 'text-gray-700'
                              }`}>
                                {isPaid ? 'مدفوع بالكامل' : formatCurrency(fee.remaining_amount)}
                              </p>
                              {!isPaid && (
                                <p className="text-xs text-gray-500">متبقي</p>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  تفاصيل المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {data.payment_details.items.map((payment) => {
                    const isPaid = payment.status === 'paid'
                    const isSelected = selectedPayments.some(p => p.id === payment.id)
                    
                    return (
                      <div
                        key={payment.id}
                        onClick={() => !isPaid && handlePaymentSelect(payment)}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg transition-all duration-300 gap-3 sm:gap-4 ${
                          isPaid
                            ? 'bg-green-50 border-2 border-green-200 cursor-not-allowed opacity-75'
                            : isSelected
                            ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg transform scale-[1.02] border-2 border-gray-800 cursor-pointer'
                            : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md cursor-pointer'
                        }`}
                        dir="rtl"
                      >
                      <div className="flex items-center gap-4" dir="rtl">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                          isPaid
                            ? 'bg-green-500 text-white'
                            : isSelected
                            ? 'bg-white text-gray-800'
                            : 'bg-gradient-to-br from-gray-800 to-gray-600 text-white'
                        }`}>
                          {isPaid ? '✓' : payment.sequence_no}
                        </div>
                        <div className="text-right" dir="rtl">
                          <p className={`text-base font-semibold text-right ${
                            isPaid
                              ? 'text-green-800'
                              : isSelected
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}>
                            الدفعة رقم {payment.sequence_no}
                            {isPaid && ' (مدفوعة)'}
                          </p>
                          <p className={`text-sm text-right ${
                            isPaid
                              ? 'text-green-600'
                              : isSelected
                              ? 'text-gray-200'
                              : 'text-gray-500'
                          }`}>
                            {isPaid ? 'تم الدفع في: ' : 'مستحق في: '}{formatDate(payment.due_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4" dir="rtl">
                        <div className="text-right" dir="rtl">
                          <p className={`text-base font-bold text-right ${
                            isPaid
                              ? 'text-green-800'
                              : isSelected
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}>
                            {formatCurrency(payment.rent_amount)}
                          </p>
                          {isPaid ? (
                            <p className="text-sm text-right text-green-600">
                              مدفوع بالكامل: {formatCurrency(payment.paid_amount)}
                            </p>
                          ) : (
                            <>
                              {payment.paid_amount > 0 && (
                                <p className={`text-sm text-right ${
                                  isSelected ? 'text-green-200' : 'text-green-600'
                                }`}>
                                  مدفوع: {formatCurrency(payment.paid_amount)}
                                </p>
                              )}
                              {payment.remaining_amount > 0 && (
                                <p className={`text-sm text-right ${
                                  isSelected ? 'text-red-200' : 'text-red-600'
                                }`}>
                                  متبقي: {formatCurrency(payment.remaining_amount)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <Badge className={`${
                          isPaid
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : isSelected
                            ? 'bg-white/20 text-white border-white/30'
                            : getPaymentStatusColor(payment.status, payment.is_overdue)
                        } border text-sm`}>
                          {isPaid ? (
                            <CheckCircle className="h-4 w-4 ml-1" />
                          ) : (
                            getPaymentStatusIcon(payment.status, payment.is_overdue)
                          )}
                          <span className="mr-1">
                            {isPaid ? 'مدفوع' : getPaymentStatusText(payment.status, payment.is_overdue)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>



            {/* Payment Type Selection */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  نوع الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setPaymentType('rent')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === 'rent'
                        ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    دفع الإيجار
                  </button>
                  <button
                    onClick={() => setPaymentType('fees')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === 'fees'
                        ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    دفع الرسوم
                  </button>
                  <button
                    onClick={() => setPaymentType('both')}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      paymentType === 'both'
                        ? 'bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    دفع الإيجار والرسوم
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Details Section */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  تفاصيل الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method" className="text-right block text-sm font-medium text-gray-700">
                      طريقة الدفع
                    </Label>
                    <select
                      id="payment-method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-gray-800 focus:ring-2 focus:ring-gray-200 text-right"
                      dir="rtl"
                    >
                      <option value="bank_transfer">تحويل بنكي</option>
                      <option value="cash">نقداً</option>
                      <option value="credit_card">بطاقة ائتمان</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-date" className="text-right block text-sm font-medium text-gray-700">
                      تاريخ الدفع
                    </Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference" className="text-right block text-sm font-medium text-gray-700">
                      رقم المرجع (اختياري)
                    </Label>
                    <Input
                      id="reference"
                      type="text"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="مثال: TXN-001"
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-right block text-sm font-medium text-gray-700">
                      ملاحظات (اختياري)
                    </Label>
                    <Input
                      id="notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ملاحظات إضافية..."
                      className="text-right border-2 border-gray-300 focus:border-gray-800 focus:ring-2 focus:ring-gray-200"
                      dir="rtl"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Input Section */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                  <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-white" />
                  </div>
                  إدخال المبلغ المطلوب دفعه
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="max-w-md mx-auto space-y-4">
                  {/* Selected Payments Info */}
                  {selectedPayments.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4 rounded-lg mb-4 relative">
                      <button
                        onClick={() => {
                          // Calculate total amount of selected payments to subtract
                          const totalSelectedAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0)
                          const currentAmount = Number(paymentAmount) || 0
                          const newAmount = Math.max(0, currentAmount - totalSelectedAmount)
                          setSelectedPayments([])
                          setPaymentAmount(newAmount.toString())
                        }}
                        className="absolute top-2 left-2 text-white/70 hover:text-white transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <div className="text-center">
                        <p className="text-lg font-bold mb-2">
                          الدفعات المحددة ({selectedPayments.length})
                        </p>
                        <div className="space-y-2">
                          {selectedPayments.map((payment) => (
                            <div key={payment.id} className="bg-white/10 rounded-lg p-2">
                              <p className="text-base font-semibold">
                                الدفعة رقم {payment.sequence_no}
                              </p>
                              <p className="text-sm text-gray-200">
                                مستحق في: {formatDate(payment.due_date)}
                              </p>
                              <p className="text-sm text-gray-200">
                                نوع الدفع: {paymentType === 'rent' ? 'إيجار' : paymentType === 'fees' ? 'رسوم' : 'إيجار ورسوم'}
                              </p>
                              <p className="text-base font-bold text-green-200">
                                {formatCurrency(payment.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-lg font-bold">
                            المجموع: {formatCurrency(selectedPayments.reduce((sum, p) => sum + p.amount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Fees Info */}
                  {selectedFees.length > 0 && (
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 rounded-lg mb-4 relative">
                      <button
                        onClick={() => {
                          // Calculate total amount of selected fees to subtract
                          const totalSelectedAmount = selectedFees.reduce((sum, f) => sum + f.amount, 0)
                          const currentAmount = Number(paymentAmount) || 0
                          const newAmount = Math.max(0, currentAmount - totalSelectedAmount)
                          setSelectedFees([])
                          setPaymentAmount(newAmount.toString())
                        }}
                        className="absolute top-2 left-2 text-white/70 hover:text-white transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <div className="text-center">
                        <p className="text-lg font-bold mb-2">
                          الرسوم المحددة ({selectedFees.length})
                        </p>
                        <div className="space-y-2">
                          {selectedFees.map((fee) => (
                            <div key={fee.type} className="bg-white/10 rounded-lg p-2">
                              <p className="text-base font-semibold">
                                {translateFeeName(fee.label)}
                              </p>
                              <p className="text-base font-bold text-green-200">
                                {formatCurrency(fee.amount)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-lg font-bold">
                            المجموع: {formatCurrency(selectedFees.reduce((sum, f) => sum + f.amount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedPayments.length === 0 && selectedFees.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          يرجى اختيار دفعة أو أكثر من القائمة أعلاه لدفع {paymentType === 'rent' ? 'الإيجار' : paymentType === 'fees' ? 'الرسوم' : 'الإيجار والرسوم'} أو اختيار الرسوم الفردية أو إدخال المبلغ يدوياً
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Validation Message */}
                  {getValidationMessage() && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2 text-red-800">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                          {getValidationMessage()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount" className="text-right block text-sm font-medium text-gray-700">
                      المبلغ المطلوب دفعه (ريال سعودي)
                    </Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={
                        selectedPayments.length > 0 || selectedFees.length > 0 
                          ? "يمكنك تعديل المبلغ" 
                          : `أدخل مبلغ ${paymentType === 'rent' ? 'الإيجار' : paymentType === 'fees' ? 'الرسوم' : 'الإيجار والرسوم'}...`
                      }
                      className={`text-right border-2 focus:ring-2 ${
                        getValidationMessage() 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-gray-800 focus:ring-gray-200'
                      }`}
                      dir="rtl"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-500">المبلغ المتاح للدفع: {formatCurrency(data.payment_details.summary.total_remaining)}</p>
                    {(selectedPayments.length > 0 || selectedFees.length > 0) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">
                          المبلغ المحدد: {formatCurrency(getTotalSelectedAmount())}
                        </p>
                        <p className="text-xs text-green-600">
                          {selectedPayments.length > 0 && `${selectedPayments.length} دفعة`}
                          {selectedPayments.length > 0 && selectedFees.length > 0 && ' + '}
                          {selectedFees.length > 0 && `${selectedFees.length} رسوم`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handlePaymentSubmit}
                disabled={!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0 || isSubmitting || !isPaymentAmountValid()}
                className="bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                dir="rtl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 ml-2" />
                    دفع {selectedFees.length > 0 ? 'الرسوم المحددة' : paymentType === 'rent' ? 'الإيجار' : paymentType === 'fees' ? 'الرسوم' : 'الإيجار والرسوم'}
                  </>
                )}
              </Button>
               <Button
                 onClick={closePaymentCollectionDialog}
                 variant="outline"
                 className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
                 dir="rtl"
               >
                 إغلاق
               </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
