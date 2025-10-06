"use client"

import { useState, useEffect } from "react"
import useStore from "@/context/Store"
import {
  Plus,
  CreditCard,
  TrendingUp,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CreditPackage {
  id: number
  name: string
  description: string | null
  credits: number
  price: string
  currency: string
  discounted_price: string
  savings_amount: number
  savings_percentage: number | null
  price_per_credit: number
  is_popular: boolean
  features: string[]
  is_recommended: boolean
}

interface CreditTransaction {
  id: number
  reference_number: string | null
  transaction_type: string
  transaction_type_display: string
  credits_amount: number
  absolute_credits: number
  amount_paid: string | null
  currency: string
  payment_method: string | null
  status: string
  status_display: string
  description: string
  created_at: string
  package: {
    id: number
    name: string
    credits: number
  }
  is_positive: boolean
  is_negative: boolean
}

interface CreditUsage {
  phoneNumber: string
  displayName: string
  messagesThisMonth: number
  creditsUsed: number
  lastUsed: string
}

export function CreditSystemComponent() {
  const { creditPackages, fetchCreditPackages, purchaseCredits, creditTransactions, fetchCreditTransactions, creditAnalytics, fetchCreditAnalytics, creditBalance, fetchCreditBalance, channelUsage, fetchChannelUsage } = useStore()
  // استخدام البيانات من API بدلاً من المتغيرات المحلية
  const currentCredits = creditBalance.data?.available_credits || 0
  const monthlyUsage = creditBalance.data?.used_credits || 0
  const monthlyLimit = creditBalance.data?.monthly_limit || 0
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState<string>("")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchCreditPackages()
    fetchCreditTransactions()
    fetchCreditAnalytics()
    fetchCreditBalance()
    fetchChannelUsage()
  }, [fetchCreditPackages, fetchCreditTransactions, fetchCreditAnalytics, fetchCreditBalance, fetchChannelUsage])



  const handleTopUp = async () => {
    const selectedPkg = creditPackages.packages.find((pkg: CreditPackage) => pkg.id.toString() === selectedPackage)
    if (selectedPkg && selectedPaymentMethod) {
      setIsProcessingPayment(true)
      try {
        // تحديد طريقة الدفع للـ API
        const paymentMethod = selectedPaymentMethod === 'alrajhi' ? 'arb' : 'myfatoorah'
        
        // إرسال طلب الشراء
        const result = await purchaseCredits(selectedPkg.id, paymentMethod)
        
        if (result.success && result.data.redirect_url) {
          // فتح popup للدفع
          setPaymentUrl(result.data.redirect_url)
          setIsPaymentPopupOpen(true)
          setIsTopUpDialogOpen(false)
        }
      } catch (error) {
        console.error('Error processing payment:', error)
      } finally {
        setIsProcessingPayment(false)
      }
    }
  }

  const handlePaymentSuccess = () => {
    // إعادة تحميل بيانات الرصيد عند نجاح الدفع
    fetchCreditBalance()
    
    // إغلاق popup وإعادة تعيين الحالة
    setIsPaymentPopupOpen(false)
    setSelectedPackage("")
    setSelectedPaymentMethod("")
    setPaymentUrl("")
  }

  const getTransactionIcon = (transaction: CreditTransaction) => {
    if (transaction.is_positive) {
      return <Plus className="h-4 w-4 text-green-600" />
    } else if (transaction.is_negative) {
      return <MessageSquare className="h-4 w-4 text-blue-600" />
    } else {
      return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const usagePercentage = (monthlyUsage / monthlyLimit) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <CreditCard className="h-5 w-5 ml-2 text-primary" />
            نظام الرصيد
          </h2>
          <p className="text-sm text-muted-foreground">إدارة رصيد الرسائل ومراقبة الاستخدام</p>
        </div>

        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
            <Button 
              className="flex items-center gap-2" 
              disabled={creditPackages.packages.length === 0 || creditPackages.loading}
            >
              {creditPackages.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري تحميل الباقات
                </>
              ) : creditPackages.packages.length === 0 ? (
                <>
                  <Plus className="h-4 w-4" />
                  لا توجد باقات متاحة
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  شحن الرصيد
                </>
              )}
            </Button>
                </DialogTrigger>
              </TooltipTrigger>
              {(creditPackages.packages.length === 0 || creditPackages.loading) && (
                <TooltipContent>
                  <p>
                    {creditPackages.loading 
                      ? "جاري تحميل الباقات، يرجى الانتظار..." 
                      : "لا توجد باقات ائتمان متاحة للشراء"
                    }
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="w-[95vw] max-w-4xl mx-auto sm:w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>شحن رصيد الرسائل</DialogTitle>
              <DialogDescription>اختر الباقة المناسبة لاحتياجاتك</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* Loading State */}
              {creditPackages.loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="mr-2">جاري تحميل الباقات...</span>
                </div>
              )}

              {/* Error State */}
              {creditPackages.error && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>خطأ:</strong> {creditPackages.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Empty State - No Packages Available */}
              {!creditPackages.loading && creditPackages.packages.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد باقات متاحة</h3>
                  <p className="text-muted-foreground mb-4">لا يمكن شحن الرصيد في الوقت الحالي</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {creditPackages.packages.map((pkg: CreditPackage) => (
                  <div
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all duration-200 border-2 rounded-lg ${
                      selectedPackage === pkg.id.toString() 
                        ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20" 
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPackage(pkg.id.toString())}
                  >
                    <Card className="border-0 shadow-none bg-transparent h-full">
                      <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPackage === pkg.id.toString() ? "border-primary bg-primary" : "border-gray-300"
                              }`}
                            >
                              {selectedPackage === pkg.id.toString() && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{pkg.name}</h3>
                                {pkg.is_popular && <Badge className="bg-primary text-white text-xs">الأكثر شعبية</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{pkg.credits.toLocaleString()} كريديت</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">
                              {pkg.discounted_price} {pkg.currency}
                            </div>
                            {pkg.savings_percentage && pkg.savings_percentage > 0 && (
                              <div className="text-xs text-green-600">وفر {pkg.savings_percentage}%</div>
                            )}
                          </div>
                        </div>
                        
                        {/* Package Features */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">السعر لكل كريديت:</span>
                            <span className="font-medium">{pkg.price_per_credit} {pkg.currency}</span>
                          </div>
                          {pkg.is_recommended && (
                            <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                              <span>⭐</span>
                              <span>موصى به</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Payment Methods Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">اختر طريقة الدفع</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* My Fatoorah */}
                  <div className="relative">
  <div 
    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
      selectedPaymentMethod === 'myfatoorah' 
        ? 'border-primary bg-primary/5' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={() => setSelectedPaymentMethod('myfatoorah')}
  >
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 rounded-lg flex items-center justify-center mb-2 mx-auto overflow-hidden">
          <img 
            src="/images/myfatoorah.png" 
            alt="My Fatoorah" 
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-sm font-medium">ماي فاتورة</span>
      </div>
    </div>
  </div>

  {/* Overlay */}
  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-lg">
    <span className="text-gray-700 font-semibold text-sm">هذه الخدمة غير متاحة الآن</span>
  </div>
</div>


                  {/* Al Rajhi Bank */}
                  <div 
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedPaymentMethod === 'alrajhi' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod('alrajhi')}
                  >
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-lg flex items-center justify-center mb-2 mx-auto overflow-hidden">
                          <img 
                            src="/images/Alrajhi-Bank.webp" 
                            alt="Al Rajhi Bank" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">بنك الراجحي</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  سيتم توجيهك إلى صفحة الدفع المختارة لإكمال عملية الشراء.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleTopUp} 
                  disabled={!selectedPackage || !selectedPaymentMethod || creditPackages.packages.length === 0 || creditPackages.loading || isProcessingPayment} 
                  className="flex-1"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 ml-2" />
                      {creditPackages.packages.length === 0 ? "لا توجد باقات متاحة" : "تأكيد الشراء"}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsTopUpDialogOpen(false)
                  setSelectedPackage("")
                  setSelectedPaymentMethod("")
                  setIsProcessingPayment(false)
                }}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Popup */}
        <Dialog open={isPaymentPopupOpen} onOpenChange={setIsPaymentPopupOpen}>
          <DialogContent className="w-[95vw] max-w-6xl mx-auto sm:w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl h-[80vh] sm:h-[85vh] md:h-[90vh] p-0 overflow-hidden" dir="rtl">
            <DialogHeader className="sr-only">
              <DialogTitle>إتمام عملية الدفع</DialogTitle>
            </DialogHeader>
            <div className="bg-white text-gray-900">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">إتمام عملية الدفع</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPaymentPopupOpen(false)}
                  className="text-gray-600 hover:bg-gray-100"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-full overflow-y-auto">
                {paymentUrl && (
                  <iframe
                    src={paymentUrl}
                    className="w-full h-[calc(80vh-80px)] sm:h-[calc(85vh-80px)] md:h-[calc(90vh-80px)] border-0 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]"
                    title="Payment Gateway"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                  />
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>لا تغلق هذه النافذة حتى تكتمل عملية الدفع</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPaymentPopupOpen(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    إلغاء الدفع
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Loading State */}
        {creditBalance.loading && (
          <div className="col-span-full flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="mr-2">جاري تحميل بيانات الرصيد...</span>
          </div>
        )}

        {/* Error State */}
        {creditBalance.error && (
          <div className="col-span-full">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>خطأ:</strong> {creditBalance.error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Cards Data */}
        {!creditBalance.loading && creditBalance.data && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">الرصيد الحالي</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{creditBalance.data.available_credits?.toLocaleString() || 0} كريديت</div>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">الاستخدام الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{creditBalance.data.used_credits?.toLocaleString() || 0}</div>
                    <p className="text-xs text-muted-foreground">من {creditBalance.data.monthly_limit?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Progress value={creditBalance.data.monthly_usage_percentage || 0} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{creditBalance.data.monthly_usage_percentage?.toFixed(1) || 0}% من الحد الشهري</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">متوسط التكلفة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{creditBalance.data.average_cost_per_credit || '0.00'} ر.س</div>
                    <p className="text-xs text-muted-foreground">لكل رسالة</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Empty State */}
        {!creditBalance.loading && !creditBalance.data && (
          <div className="col-span-full text-center py-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">لا توجد بيانات رصيد</h3>
            <p className="text-muted-foreground">لم يتم العثور على أي بيانات رصيد</p>
          </div>
        )}
      </div>

      {/* Usage Alert */}
      {usagePercentage > 80 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>تحذير:</strong> لقد استخدمت {usagePercentage.toFixed(1)}% من حدك الشهري. فكر في شحن رصيدك لتجنب
            انقطاع الخدمة.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed View Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">المعاملات</TabsTrigger>
          <TabsTrigger value="usage">الاستخدام بالرقم</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">سجل المعاملات</CardTitle>
              <CardDescription>آخر العمليات على رصيدك</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {creditTransactions.loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="mr-2">جاري تحميل المعاملات...</span>
                </div>
              )}

              {/* Error State */}
              {creditTransactions.error && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>خطأ:</strong> {creditTransactions.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Empty State */}
              {!creditTransactions.loading && creditTransactions.transactions.length === 0 && (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا توجد معاملات</h3>
                  <p className="text-muted-foreground">لم يتم العثور على أي معاملات ائتمان</p>
                </div>
              )}

              {/* Transactions List */}
              {!creditTransactions.loading && creditTransactions.transactions.length > 0 && (
                <div className="space-y-4">
                  {creditTransactions.transactions.map((transaction: CreditTransaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(transaction.created_at).toLocaleDateString('ar-US')}
                            {transaction.reference_number && (
                              <>
                                <span>•</span>
                                <span>{transaction.reference_number}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className={`font-semibold ${transaction.is_positive ? "text-green-600" : "text-red-600"}`}>
                          {transaction.is_positive ? "+" : ""}
                          {transaction.credits_amount.toLocaleString()}
                        </div>
                        <Badge className={getStatusColor(transaction.status)} variant="outline">
                          {transaction.status_display}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">الاستخدام حسب الرقم</CardTitle>
              <CardDescription>توزيع استخدام الرصيد على أرقام الواتساب</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading State */}
              {channelUsage.loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="mr-2">جاري تحميل بيانات الاستخدام...</span>
                </div>
              )}

              {/* Error State */}
              {channelUsage.error && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>خطأ:</strong> {channelUsage.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Empty State */}
              {!channelUsage.loading && (!channelUsage.data || channelUsage.data.length === 0) && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">لا يوجد استخدام</h3>
                  <p className="text-muted-foreground">لم يتم العثور على أي استخدام للرصيد</p>
                </div>
              )}

              {/* Usage Data */}
              {!channelUsage.loading && channelUsage.data && channelUsage.data.length > 0 && (
                <div className="space-y-4">
                  {channelUsage.data.map((usage: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">{usage.channel_name}</div>
                          <div className="text-sm text-muted-foreground">{usage.channel_type}</div>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{usage.credits_used.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">رصيد مُستخدم</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">الرسائل المُرسلة:</span>
                          <div className="font-medium">{usage.messages_sent.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">الرسائل المستقبلة:</span>
                          <div className="font-medium">{usage.messages_received.toLocaleString()}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">التكلفة لكل رسالة:</span>
                          <div className="font-medium">{usage.cost_per_message_currency} ريال</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">إجمالي التكلفة:</span>
                          <div className="font-medium">{usage.total_cost_currency} ريال</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Loading State */}
          {creditAnalytics.loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="mr-2">جاري تحميل التحليلات...</span>
            </div>
          )}

          {/* Error State */}
          {creditAnalytics.error && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>خطأ:</strong> {creditAnalytics.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Analytics Data */}
          {!creditAnalytics.loading && creditAnalytics.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Balance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الرصيد الحالي</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي الرصيد</span>
                      <span className="font-medium">{creditAnalytics.data.current_balance?.total_credits?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">الرصيد المتاح</span>
                      <span className="font-medium text-green-600">{creditAnalytics.data.current_balance?.available_credits?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">الرصيد المُستخدم</span>
                      <span className="font-medium text-red-600">{creditAnalytics.data.current_balance?.used_credits?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">نسبة الاستخدام الشهري</span>
                      <span className="font-medium">{creditAnalytics.data.current_balance?.monthly_usage_percentage || 0}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">الإحصائيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي المشتريات</span>
                      <span className="font-medium">{creditAnalytics.data.statistics?.total_purchases || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي الاستخدام</span>
                      <span className="font-medium">{creditAnalytics.data.statistics?.total_usage || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي الرصيد المُشترى</span>
                      <span className="font-medium text-green-600">{creditAnalytics.data.statistics?.total_credits_purchased?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي الرصيد المُستخدم</span>
                      <span className="font-medium text-red-600">{creditAnalytics.data.statistics?.total_credits_used?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إجمالي المبلغ المدفوع</span>
                      <span className="font-medium text-blue-600">{creditAnalytics.data.statistics?.total_amount_paid || 0} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">المعاملات المعلقة</span>
                      <span className="font-medium text-yellow-600">{creditAnalytics.data.statistics?.pending_transactions || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">المعاملات الفاشلة</span>
                      <span className="font-medium text-red-600">{creditAnalytics.data.statistics?.failed_transactions || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message Type Costs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تكلفة أنواع الرسائل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creditAnalytics.data.message_type_costs && Object.entries(creditAnalytics.data.message_type_costs).map(([type, cost]: [string, any]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{type}</span>
                        <span className="font-medium">{cost} رصيد</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Period Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">فترة التقرير</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">من تاريخ</span>
                      <span className="font-medium">
                        {creditAnalytics.data.period?.from_date ? 
                          new Date(creditAnalytics.data.period.from_date).toLocaleDateString('ar-US') : 
                          'غير محدد'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">إلى تاريخ</span>
                      <span className="font-medium">
                        {creditAnalytics.data.period?.to_date ? 
                          new Date(creditAnalytics.data.period.to_date).toLocaleDateString('ar-US') : 
                          'غير محدد'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">تم إنشاء التقرير</span>
                      <span className="font-medium text-muted-foreground">
                        {creditAnalytics.data.generated_at ? 
                          new Date(creditAnalytics.data.generated_at).toLocaleDateString('ar-US') : 
                          'غير محدد'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!creditAnalytics.loading && !creditAnalytics.data && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">لا توجد بيانات تحليلية</h3>
              <p className="text-muted-foreground">لم يتم العثور على أي بيانات تحليلية</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
