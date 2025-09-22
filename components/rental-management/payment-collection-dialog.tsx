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
  const [fullPaymentAmount, setFullPaymentAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<Array<{
    id: number
    sequence_no: number
    amount: number
    due_date: string
    rent_amount: number
  }>>([])
  const [fullPaymentItems, setFullPaymentItems] = useState<Array<{
    type: 'payment' | 'fee'
    id: number | string
    amount: number
    label: string
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

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

  // Handle partial fee payment
  const handlePartialFeePayment = (feeType: string, maxAmount: number, label: string) => {
    const currentAmount = Number(paymentAmount) || 0
    if (currentAmount > 0 && currentAmount < maxAmount) {
      // Add partial payment
      setSelectedFees(prev => {
        const existingFee = prev.find(f => f.type === feeType)
        if (existingFee) {
          // Update existing fee amount
          return prev.map(f => 
            f.type === feeType 
              ? { ...f, amount: currentAmount }
              : f
          )
        } else {
          // Add new partial fee
          return [...prev, { type: feeType, amount: currentAmount, label }]
        }
      })
    }
  }

  // Calculate total amount from selected payments and fees
  const getTotalSelectedAmount = () => {
    const paymentsTotal = selectedPayments.reduce((sum, p) => sum + p.amount, 0)
    const feesTotal = selectedFees.reduce((sum, f) => sum + f.amount, 0)
    return paymentsTotal + feesTotal
  }

  // Calculate total full payment amount
  const getTotalFullPaymentAmount = () => {
    return fullPaymentItems.reduce((sum, item) => sum + item.amount, 0)
  }

  // Smart payment distribution logic
  const getSmartPaymentDistribution = () => {
    const enteredAmount = Number(paymentAmount) || 0
    const totalSelectedAmount = getTotalSelectedAmount()
    
    if (enteredAmount <= 0 || totalSelectedAmount <= 0) {
      return {
        fullPayments: [],
        partialPayments: [],
        remainingAmount: 0,
        suggestion: null
      }
    }

    // If amount is sufficient for all items
    if (enteredAmount >= totalSelectedAmount) {
      const allItems: Array<{
        type: 'payment' | 'fee'
        id: number | string
        amount: number
        sequence_no?: number
        label?: string
        partialAmount?: number
      }> = [
        ...selectedPayments.map(p => ({ 
          type: 'payment' as const, 
          id: p.id, 
          amount: p.amount, 
          sequence_no: p.sequence_no 
        })),
        ...selectedFees.map(f => ({ 
          type: 'fee' as const, 
          id: f.type, 
          amount: f.amount, 
          label: f.label 
        }))
      ]
      
      return {
        fullPayments: allItems,
        partialPayments: [],
        remainingAmount: enteredAmount - totalSelectedAmount,
        suggestion: enteredAmount > totalSelectedAmount ? 
          `المبلغ كافي لدفع جميع العناصر المحددة. المبلغ المتبقي: ${formatCurrency(enteredAmount - totalSelectedAmount)} سيتم توزيعه على باقي المستحقات بشكل جزئي.` : 
          'المبلغ كافي لدفع جميع العناصر المحددة بالكامل.'
      }
    }

    // Sort items by amount (ascending) to prioritize smaller amounts for full payment
    const allItems: Array<{
      type: 'payment' | 'fee'
      id: number | string
      amount: number
      sequence_no?: number
      label?: string
      partialAmount?: number
    }> = [
      ...selectedPayments.map(p => ({ 
        type: 'payment' as const, 
        id: p.id, 
        amount: p.amount, 
        sequence_no: p.sequence_no 
      })),
      ...selectedFees.map(f => ({ 
        type: 'fee' as const, 
        id: f.type, 
        amount: f.amount, 
        label: f.label 
      }))
    ].sort((a, b) => a.amount - b.amount)

    const fullPayments: typeof allItems = []
    const partialPayments: typeof allItems = []
    let remainingAmount = enteredAmount

    // Try to pay full amounts starting from smallest
    for (const item of allItems) {
      if (remainingAmount >= item.amount) {
        fullPayments.push(item)
        remainingAmount -= item.amount
      } else {
        partialPayments.push(item)
      }
    }

    // If we have remaining amount and partial payments, distribute it
    if (remainingAmount > 0 && partialPayments.length > 0) {
      const totalPartialAmount = partialPayments.reduce((sum, item) => sum + item.amount, 0)
      if (remainingAmount < totalPartialAmount) {
        // Distribute remaining amount proportionally among partial payments
        for (const item of partialPayments) {
          const proportion = item.amount / totalPartialAmount
          item.partialAmount = Math.round(remainingAmount * proportion * 100) / 100
        }
        remainingAmount = 0
      }
    }

    return {
      fullPayments,
      partialPayments,
      remainingAmount,
      suggestion: fullPayments.length > 0 ? 
        `سيتم دفع ${fullPayments.length} عنصر بالكامل و ${partialPayments.length} عنصر جزئياً.` : 
        `سيتم دفع جميع العناصر جزئياً.`
    }
  }

  // Check if payment amount is valid
  const isPaymentAmountValid = () => {
    const enteredAmount = Number(paymentAmount) || 0
    return enteredAmount > 0 || fullPaymentItems.length > 0
  }

  // Get validation message
  const getValidationMessage = () => {
    const enteredAmount = Number(paymentAmount) || 0
    
    if (enteredAmount <= 0 && fullPaymentItems.length === 0) {
      return "يرجى إدخال مبلغ أكبر من صفر أو تحديد دفعات كاملة"
    }
    
    return null
  }

  // Handle full payment for installments
  const handleFullPaymentSelect = (payment: any) => {
    const fullPaymentItem = {
      type: 'payment' as const,
      id: payment.id,
      amount: payment.rent_amount,
      label: `الدفعة رقم ${payment.sequence_no}`
    }

    setFullPaymentItems(prev => {
      const isSelected = prev.some(item => item.type === 'payment' && item.id === payment.id)
      
      if (isSelected) {
        // Remove from full payment items
        return prev.filter(item => !(item.type === 'payment' && item.id === payment.id))
      } else {
        // Add to full payment items
        return [...prev, fullPaymentItem]
      }
    })
  }

  // Handle full payment for fees
  const handleFullFeeSelect = (feeType: string, amount: number, label: string) => {
    const fullPaymentItem = {
      type: 'fee' as const,
      id: feeType,
      amount: amount,
      label: label
    }

    setFullPaymentItems(prev => {
      const isSelected = prev.some(item => item.type === 'fee' && item.id === feeType)
      
      if (isSelected) {
        // Remove from full payment items
        return prev.filter(item => !(item.type === 'fee' && item.id === feeType))
      } else {
        // Add to full payment items
        return [...prev, fullPaymentItem]
      }
    })
  }

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentRentalId || ((!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) && fullPaymentItems.length === 0)) {
      return
    }

    // Open confirmation dialog instead of submitting directly
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPaymentRentalId || ((!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) && fullPaymentItems.length === 0)) {
      return
    }

    setIsSubmitting(true)
    setIsConfirmDialogOpen(false)
    
    try {
      // Build payments array based on payment type and selected payments
      const payments = []
      
      // Handle full payment items first
      for (const fullItem of fullPaymentItems) {
        if (fullItem.type === 'payment') {
          const payment = data?.payment_details.items.find(p => p.id === fullItem.id)
          if (payment) {
            payments.push({
              installment_id: payment.id,
              payment_type: 'rent',
              amount: payment.rent_amount,
              notes: `دفع كامل - الدفعة رقم ${payment.sequence_no}`
            })
          }
        } else if (fullItem.type === 'fee') {
          payments.push({
            installment_id: null,
            payment_type: fullItem.id,
            amount: fullItem.amount,
            notes: `دفع كامل - ${fullItem.label}`
          })
        }
      }
      
      // Handle smart payment distribution
      const enteredAmount = Number(paymentAmount) || 0
      if (enteredAmount > 0) {
        const distribution = getSmartPaymentDistribution()
        
        // Add full payments from smart distribution
        for (const item of distribution.fullPayments) {
          if (item.type === 'payment') {
            payments.push({
              installment_id: item.id as number,
              payment_type: 'rent',
              amount: item.amount,
              notes: `دفع كامل - الدفعة رقم ${item.sequence_no || 'غير محدد'}`
            })
          } else if (item.type === 'fee') {
            payments.push({
              installment_id: null,
              payment_type: item.id as string,
              amount: item.amount,
              notes: `دفع كامل - ${item.label || 'رسوم'}`
            })
          }
        }
        
        // Add partial payments from smart distribution
        for (const item of distribution.partialPayments) {
          if (item.type === 'payment') {
            const amount = item.partialAmount || (enteredAmount * (item.amount / getTotalSelectedAmount()))
            payments.push({
              installment_id: item.id as number,
              payment_type: 'rent',
              amount: Math.round(amount * 100) / 100,
              notes: `دفع جزئي - الدفعة رقم ${item.sequence_no || 'غير محدد'}`
            })
          } else if (item.type === 'fee') {
            const amount = item.partialAmount || (enteredAmount * (item.amount / getTotalSelectedAmount()))
            payments.push({
              installment_id: null,
              payment_type: item.id as string,
              amount: Math.round(amount * 100) / 100,
              notes: `دفع جزئي - ${item.label || 'رسوم'}`
            })
          }
        }
      }

      const requestBody = {
        payments,
        payment_method: paymentMethod,
        payment_date: paymentDate,
        reference: reference || `PAY-${Date.now()}`
      }

      const response = await axiosInstance.post(`/v1/rms/rentals/${selectedPaymentRentalId}/collect-payment`, requestBody)
      
      if (response.data.status) {
        // Refresh data after successful payment
        await fetchPaymentCollectionData()
        setPaymentAmount("")
        setSelectedPayments([])
        setSelectedFees([])
        setFullPaymentItems([])
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
      case 'unpaid':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'partial':
        return 'bg-orange-100 text-orange-800 border-orange-200'
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
      case 'unpaid':
        return 'غير مدفوع'
      case 'partial':
        return 'جزئي'
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
      case 'unpaid':
        return <AlertCircle className="h-4 w-4 ml-1" />
      case 'partial':
        return <DollarSign className="h-4 w-4 ml-1" />
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
                          <p className="font-semibold text-gray-900">{data.rental_info?.tenant_name || 'غير محدد'}</p>
                        </div>
                        <User className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">الهاتف</p>
                          <p className="font-semibold text-gray-900">{data.rental_info?.tenant_phone || 'غير محدد'}</p>
                        </div>
                        <Phone className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-semibold text-gray-900 break-all">{data.rental_info?.tenant_email || 'غير محدد'}</p>
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
                          <p className="font-semibold text-gray-900">{data.rental_info?.property_number || 'غير محدد'}</p>
                        </div>
                        <Hash className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex items-center gap-3" dir="rtl">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">الوحدة</p>
                          <p className="font-semibold text-gray-900">{data.rental_info?.unit_label || 'غير محدد'}</p>
                        </div>
                        <Building2 className="h-4 w-4 text-gray-500" />
                      </div>
                      {data.rental_info?.contract_number && (
                        <div className="flex items-center gap-3" dir="rtl">
                          <div className="text-right">
                            <p className="text-sm text-gray-500">رقم العقد</p>
                            <p className="font-semibold text-gray-900">{data.rental_info?.contract_number}</p>
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
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details?.summary?.total_due || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي المدفوع</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details?.summary?.total_paid || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتبقي</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(data.payment_details?.summary?.total_remaining || 0)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-500 mb-1">المتأخرات</p>
                    <p className="text-lg font-bold text-gray-900">{data.payment_details?.summary?.overdue_count || 0}</p>
                  </div>
                </div>

                {/* Fees Breakdown */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">تفاصيل الرسوم</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">إجمالي الإيجار</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.payment_details?.summary?.total_rent_due || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">إجمالي الرسوم</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.payment_details?.summary?.total_fees_due || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المنصة</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown?.platform_fee || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المياه</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown?.water_fee || 0)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">رسوم المكتب</p>
                      <p className="text-base font-bold text-gray-900">{formatCurrency(data.fees_breakdown?.office_fee || 0)}</p>
                    </div>
                  </div>
                  
                  {/* Individual Fee Selection */}
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <h4 className="text-md font-bold text-gray-900 mb-3 text-center">اختر الرسوم المطلوب دفعها</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {data.available_fees?.map((fee) => {
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
                  
                  {/* Smart Full Payment Selection Section */}
                  {(selectedPayments.length > 0 || selectedFees.length > 0) && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900 text-center">أو اختر دفع كامل للمحدد</h4>
                      
                      {(() => {
                        const distribution = getSmartPaymentDistribution()
                        const enteredAmount = Number(paymentAmount) || 0
                        
                        if (enteredAmount <= 0) {
                          // Show all items as available for full payment when no amount is entered
                          return (
                            <>
                              {/* Selected Payments */}
                              {selectedPayments.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {selectedPayments.map((selectedPayment) => {
                                    const payment = data.payment_details.items.find(p => p.id === selectedPayment.id)
                                    if (!payment) return null
                                    
                                    const isFullPaymentSelected = fullPaymentItems.some(item => item.type === 'payment' && item.id === payment.id)
                                    
                                    return (
                                      <button
                                        key={payment.id}
                                        onClick={() => handleFullPaymentSelect(payment)}
                                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                                          isFullPaymentSelected
                                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-600 shadow-lg'
                                            : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'
                                        }`}
                                        dir="rtl"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <p className={`text-sm font-semibold ${
                                              isFullPaymentSelected ? 'text-white' : 'text-gray-900'
                                            }`}>
                                              الدفعة رقم {payment.sequence_no}
                                            </p>
                                            <p className={`text-xs ${
                                              isFullPaymentSelected ? 'text-gray-200' : 'text-gray-500'
                                            }`}>
                                              {formatDate(payment.due_date)}
                                            </p>
                                          </div>
                                          <div className="text-left">
                                            <p className={`text-sm font-bold ${
                                              isFullPaymentSelected ? 'text-white' : 'text-gray-900'
                                            }`}>
                                              {formatCurrency(payment.rent_amount)}
                                            </p>
                                            <p className={`text-xs ${
                                              isFullPaymentSelected ? 'text-green-200' : 'text-green-600'
                                            }`}>
                                              {isFullPaymentSelected ? 'دفع كامل ✓' : 'دفع كامل'}
                                            </p>
                                          </div>
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Selected Fees */}
                              {selectedFees.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {selectedFees.map((selectedFee) => {
                                    const fee = data.available_fees.find(f => f.fee_type === selectedFee.type)
                                    if (!fee) return null
                                    
                                    const isFullPaymentSelected = fullPaymentItems.some(item => item.type === 'fee' && item.id === fee.fee_type)
                                    
                                    return (
                                      <button
                                        key={fee.fee_type}
                                        onClick={() => handleFullFeeSelect(fee.fee_type, fee.remaining_amount, translateFeeName(fee.fee_name))}
                                        className={`p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                                          isFullPaymentSelected
                                            ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-600 shadow-lg'
                                            : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-md'
                                        }`}
                                        dir="rtl"
                                      >
                                        <div className="text-center">
                                          <p className={`text-sm font-semibold ${
                                            isFullPaymentSelected ? 'text-white' : 'text-gray-900'
                                          }`}>
                                            {translateFeeName(fee.fee_name)}
                                          </p>
                                          <p className={`text-sm font-bold ${
                                            isFullPaymentSelected ? 'text-white' : 'text-gray-900'
                                          }`}>
                                            {formatCurrency(fee.remaining_amount)}
                                          </p>
                                          <p className={`text-xs ${
                                            isFullPaymentSelected ? 'text-green-200' : 'text-green-600'
                                          }`}>
                                            {isFullPaymentSelected ? 'دفع كامل ✓' : 'دفع كامل'}
                                          </p>
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                            </>
                          )
                        }

                        // Show smart distribution when amount is entered
                        return (
                          <>
                            {/* Full Payment Items (from smart distribution) */}
                            {distribution.fullPayments.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 text-center">العناصر المقترحة للدفع الكامل:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {distribution.fullPayments.map((item, index) => {
                                    const isFullPaymentSelected = fullPaymentItems.some(fullItem => 
                                      fullItem.type === item.type && fullItem.id === item.id
                                    )
                                    
                                    if (item.type === 'payment') {
                                      const payment = data.payment_details.items.find(p => p.id === item.id)
                                      if (!payment) return null
                                      
                                      return (
                                        <button
                                          key={`full-${item.id}`}
                                          onClick={() => handleFullPaymentSelect(payment)}
                                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                                            isFullPaymentSelected
                                              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-600 shadow-lg'
                                              : 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300 hover:border-blue-400 hover:shadow-md'
                                          }`}
                                          dir="rtl"
                                        >
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className={`text-sm font-semibold ${
                                                isFullPaymentSelected ? 'text-white' : 'text-blue-900'
                                              }`}>
                                                الدفعة رقم {item.sequence_no}
                                              </p>
                                              <p className={`text-xs ${
                                                isFullPaymentSelected ? 'text-gray-200' : 'text-blue-700'
                                              }`}>
                                                {formatDate(payment.due_date)}
                                              </p>
                                            </div>
                                            <div className="text-left">
                                              <p className={`text-sm font-bold ${
                                                isFullPaymentSelected ? 'text-white' : 'text-blue-900'
                                              }`}>
                                                {formatCurrency(item.amount)}
                                              </p>
                                              <p className={`text-xs ${
                                                isFullPaymentSelected ? 'text-green-200' : 'text-blue-700'
                                              }`}>
                                                {isFullPaymentSelected ? 'دفع كامل ✓' : 'مقترح للدفع الكامل'}
                                              </p>
                                            </div>
                                          </div>
                                        </button>
                                      )
                                    } else if (item.type === 'fee') {
                                      return (
                                        <button
                                          key={`full-${item.id}`}
                                          onClick={() => handleFullFeeSelect(item.id as string, item.amount, item.label || 'رسوم')}
                                          className={`p-3 rounded-lg border-2 transition-all duration-300 text-right ${
                                            isFullPaymentSelected
                                              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white border-green-600 shadow-lg'
                                              : 'bg-gradient-to-r from-blue-100 to-blue-50 border-blue-300 hover:border-blue-400 hover:shadow-md'
                                          }`}
                                          dir="rtl"
                                        >
                                          <div className="text-center">
                                            <p className={`text-sm font-semibold ${
                                              isFullPaymentSelected ? 'text-white' : 'text-blue-900'
                                            }`}>
                                              {translateFeeName(item.label || 'رسوم')}
                                            </p>
                                            <p className={`text-sm font-bold ${
                                              isFullPaymentSelected ? 'text-white' : 'text-blue-900'
                                            }`}>
                                              {formatCurrency(item.amount)}
                                            </p>
                                            <p className={`text-xs ${
                                              isFullPaymentSelected ? 'text-green-200' : 'text-blue-700'
                                            }`}>
                                              {isFullPaymentSelected ? 'دفع كامل ✓' : 'مقترح للدفع الكامل'}
                                            </p>
                                          </div>
                                        </button>
                                      )
                                    }
                                    return null
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Partial Payment Items (from smart distribution) */}
                            {distribution.partialPayments.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700 text-center">العناصر المقترحة للدفع الجزئي:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {distribution.partialPayments.map((item, index) => {
                                    if (item.type === 'payment') {
                                      const payment = data.payment_details.items.find(p => p.id === item.id)
                                      if (!payment) return null
                                      
                                      return (
                                        <button
                                          key={`partial-${item.id}`}
                                          disabled
                                          className="p-3 rounded-lg border-2 transition-all duration-300 text-right bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 cursor-not-allowed opacity-90"
                                          dir="rtl"
                                        >
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="text-sm font-semibold text-orange-900">
                                                الدفعة رقم {item.sequence_no}
                                              </p>
                                              <p className="text-xs text-orange-700">
                                                {formatDate(payment.due_date)}
                                              </p>
                                            </div>
                                            <div className="text-left">
                                              <p className="text-sm font-bold text-orange-900">
                                                {formatCurrency(item.partialAmount || item.amount)}
                                              </p>
                                              <p className="text-xs text-orange-700">
                                                دفع جزئي
                                              </p>
                                            </div>
                                          </div>
                                        </button>
                                      )
                                    } else if (item.type === 'fee') {
                                      return (
                                        <button
                                          key={`partial-${item.id}`}
                                          disabled
                                          className="p-3 rounded-lg border-2 transition-all duration-300 text-right bg-gradient-to-r from-orange-100 to-orange-50 border-orange-300 cursor-not-allowed opacity-90"
                                          dir="rtl"
                                        >
                                          <div className="text-center">
                                            <p className="text-sm font-semibold text-orange-900">
                                              {translateFeeName(item.label || 'رسوم')}
                                            </p>
                                            <p className="text-sm font-bold text-orange-900">
                                              {formatCurrency(item.partialAmount || item.amount)}
                                            </p>
                                            <p className="text-xs text-orange-700">
                                              دفع جزئي
                                            </p>
                                          </div>
                                        </button>
                                      )
                                    }
                                    return null
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                  
                  {selectedPayments.length === 0 && selectedFees.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <AlertCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">
                          يرجى اختيار دفعة أو أكثر من القائمة أعلاه لدفع {paymentType === 'rent' ? 'الإيجار' : paymentType === 'fees' ? 'الرسوم' : 'الإيجار والرسوم'} أو اختيار الرسوم الفردية أو إدخال المبلغ يدوياً. يمكنك إدخال مبلغ جزئي للدفع الجزئي.
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
                    
                    {/* Full Payment Amount Display */}
                    {fullPaymentItems.length > 0 && (
                      <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-lg p-3 mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-green-800">المبلغ الكامل المحدد:</span>
                          <span className="text-lg font-bold text-green-900">{formatCurrency(getTotalFullPaymentAmount())}</span>
                        </div>
                      </div>
                    )}

                    {/* Smart Payment Distribution Display */}
                    {paymentAmount && Number(paymentAmount) > 0 && (selectedPayments.length > 0 || selectedFees.length > 0) && (
                      <div className="bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
                        <h4 className="text-sm font-bold text-blue-900 mb-3 text-center">التوزيع الذكي المقترح</h4>
                        {(() => {
                          const distribution = getSmartPaymentDistribution()
                          return (
                            <div className="space-y-2">
                              {distribution.suggestion && (
                                <p className="text-sm text-blue-800 text-center font-medium">
                                  {distribution.suggestion}
                                </p>
                              )}
                              
                              {distribution.fullPayments.length > 0 && (
                                <div className="bg-white/50 rounded-lg p-2">
                                  <p className="text-xs font-bold text-blue-900 mb-1">دفع كامل:</p>
                                  <div className="space-y-1">
                                    {distribution.fullPayments.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center text-xs">
                                        <span className="text-blue-800">
                                          {item.type === 'payment' ? `الدفعة رقم ${item.sequence_no || 'غير محدد'}` : translateFeeName(item.label || 'رسوم')}
                                        </span>
                                        <span className="font-bold text-blue-900">{formatCurrency(item.amount)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {distribution.partialPayments.length > 0 && (
                                <div className="bg-white/50 rounded-lg p-2">
                                  <p className="text-xs font-bold text-blue-900 mb-1">دفع جزئي:</p>
                                  <div className="space-y-1">
                                    {distribution.partialPayments.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center text-xs">
                                        <span className="text-blue-800">
                                          {item.type === 'payment' ? `الدفعة رقم ${item.sequence_no || 'غير محدد'}` : translateFeeName(item.label || 'رسوم')}
                                        </span>
                                        <span className="font-bold text-blue-900">
                                          {item.partialAmount ? formatCurrency(item.partialAmount) : 'جزئي'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {distribution.remainingAmount > 0 && (
                                <div className="bg-yellow-100 rounded-lg p-2">
                                  <p className="text-xs font-bold text-yellow-800">
                                    المبلغ المتبقي: {formatCurrency(distribution.remainingAmount)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    )}
                    
                    <Input
                      id="payment-amount"
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={
                        selectedPayments.length > 0 || selectedFees.length > 0 
                          ? "يمكنك تعديل المبلغ أو إدخال مبلغ جزئي" 
                          : `أدخل مبلغ ${paymentType === 'rent' ? 'الإيجار' : paymentType === 'fees' ? 'الرسوم' : 'الإيجار والرسوم'} (كامل أو جزئي)...`
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
                    <p className="text-sm text-gray-500">المبلغ المتاح للدفع: {formatCurrency(data.payment_details?.summary?.total_remaining || 0)}</p>
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
                        <p className="text-xs text-blue-600 mt-1">
                          💡 يمكنك إدخال مبلغ أقل للدفع الجزئي
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
                disabled={((!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) && fullPaymentItems.length === 0) || isSubmitting}
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
                    دفع الرسوم المحددة
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

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-y-auto text-right p-2 sm:p-4 md:p-6" dir="rtl">
            <DialogHeader className="space-y-2 sm:space-y-4 text-right">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-right flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                تأكيد الدفع
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-right">
              {/* Warning Message */}
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800 mb-2">تحذير مهم</h3>
                    <p className="text-red-700 font-medium">
                      أنت على وشك دفع المبلغ الإجمالي المحدد. يرجى التأكد من صحة البيانات قبل المتابعة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Section */}
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-3 text-right text-lg sm:text-xl" dir="rtl">
                    <div className="h-10 w-10 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    الفاتورة التي سيتم دفعها
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {(() => {
                    const distribution = getSmartPaymentDistribution()
                    const enteredAmount = Number(paymentAmount) || 0
                    const totalFullPaymentAmount = getTotalFullPaymentAmount()
                    const totalAmount = enteredAmount > 0 ? enteredAmount : totalFullPaymentAmount
                    
                    return (
                      <div className="space-y-4">
                        {/* Total Amount */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-4 rounded-lg text-center">
                          <p className="text-lg font-bold">المبلغ الإجمالي</p>
                          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                        </div>

                        {/* Full Payment Items */}
                        {fullPaymentItems.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-md font-bold text-gray-900 text-center">الدفعات الكاملة المحددة</h4>
                            <div className="space-y-2">
                              {fullPaymentItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <span className="text-green-800 font-medium">{item.label}</span>
                                  <span className="text-green-900 font-bold">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Smart Distribution */}
                        {enteredAmount > 0 && (selectedPayments.length > 0 || selectedFees.length > 0) && (
                          <div className="space-y-4">
                            
                            {distribution.fullPayments.length > 0 && (
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-sm font-bold text-gray-900 mb-2">دفع كامل:</p>
                                <div className="space-y-1">
                                  {distribution.fullPayments.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-700">
                                        {item.type === 'payment' ? `الدفعة رقم ${item.sequence_no || 'غير محدد'}` : translateFeeName(item.label || 'رسوم')}
                                      </span>
                                      <span className="font-bold text-gray-900">{formatCurrency(item.amount)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {distribution.partialPayments.length > 0 && (
                              <div className="bg-white border border-gray-200 rounded-lg p-3">
                                <p className="text-sm font-bold text-gray-900 mb-2">دفع جزئي:</p>
                                <div className="space-y-1">
                                  {distribution.partialPayments.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                      <span className="text-gray-700">
                                        {item.type === 'payment' ? `الدفعة رقم ${item.sequence_no || 'غير محدد'}` : translateFeeName(item.label || 'رسوم')}
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        {item.partialAmount ? formatCurrency(item.partialAmount) : 'جزئي'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {distribution.remainingAmount > 0 && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm font-bold text-yellow-800 text-center">
                                  المبلغ المتبقي: {formatCurrency(distribution.remainingAmount)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Payment Details */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-md font-bold text-gray-900 mb-3 text-center">تفاصيل الدفع</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">طريقة الدفع:</span>
                              <span className="font-medium text-gray-900">
                                {paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 
                                 paymentMethod === 'cash' ? 'نقداً' : 'بطاقة ائتمان'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">تاريخ الدفع:</span>
                              <span className="font-medium text-gray-900">{formatDate(paymentDate)}</span>
                            </div>
                            {reference && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">رقم المرجع:</span>
                                <span className="font-medium text-gray-900">{reference}</span>
                              </div>
                            )}
                            {notes && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">ملاحظات:</span>
                                <span className="font-medium text-gray-900">{notes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  dir="rtl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 ml-2" />
                      متأكد - دفع المبلغ
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsConfirmDialogOpen(false)}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
                  dir="rtl"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}
