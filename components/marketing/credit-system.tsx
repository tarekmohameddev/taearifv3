"use client"

import { useState } from "react"
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
import useStore from "@/context/Store"

interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  discount?: number
  popular?: boolean
}

interface CreditTransaction {
  id: string
  type: "purchase" | "usage" | "refund" | "bonus"
  amount: number
  description: string
  date: string
  phoneNumber?: string
  campaignName?: string
  status: "completed" | "pending" | "failed"
}

interface CreditUsage {
  phoneNumber: string
  displayName: string
  messagesThisMonth: number
  creditsUsed: number
  lastUsed: string
}

export function CreditSystemComponent() {
  const { creditsSystem, updateCredits, addCreditTransaction } = useStore()

  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string>("")

  const handleTopUp = () => {
    // Simulate payment process
    const selectedPkg = creditsSystem.creditPackages.find((pkg) => pkg.id === selectedPackage)
    if (selectedPkg) {
      updateCredits(selectedPkg.credits)
      addCreditTransaction({
        id: Date.now().toString(),
        type: "purchase",
        amount: selectedPkg.credits,
        description: `شراء ${selectedPkg.name}`,
        date: new Date().toISOString().split("T")[0],
        status: "completed",
      })
      setIsTopUpDialogOpen(false)
      setSelectedPackage("")
    }
  }

  const getTransactionIcon = (type: CreditTransaction["type"]) => {
    switch (type) {
      case "purchase":
        return <Plus className="h-4 w-4 text-green-600" />
      case "usage":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      case "refund":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bonus":
        return <CheckCircle className="h-4 w-4 text-purple-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: CreditTransaction["status"]) => {
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

  const usagePercentage = (creditsSystem.monthlyUsage / creditsSystem.monthlyLimit) * 100

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
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              شحن الرصيد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle>شحن رصيد الرسائل</DialogTitle>
              <DialogDescription>اختر الباقة المناسبة لاحتياجاتك</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {creditsSystem.creditPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all duration-200 ${
                      selectedPackage === pkg.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPackage === pkg.id ? "border-primary bg-primary" : "border-gray-300"
                              }`}
                            >
                              {selectedPackage === pkg.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{pkg.name}</h3>
                                {pkg.popular && <Badge className="bg-primary text-white text-xs">الأكثر شعبية</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">{pkg.credits.toLocaleString()} رسالة</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold">
                              {pkg.price} {pkg.currency}
                            </div>
                            {pkg.discount && <div className="text-xs text-green-600">وفر {pkg.discount}%</div>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  سيتم خصم المبلغ من طريقة الدفع المحفوظة. يمكنك تغيير طريقة الدفع من الإعدادات.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleTopUp} disabled={!selectedPackage} className="flex-1">
                  <CreditCard className="h-4 w-4 ml-2" />
                  تأكيد الشراء
                </Button>
                <Button variant="outline" onClick={() => setIsTopUpDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">الرصيد الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{creditsSystem.currentCredits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">رسالة متاحة</p>
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
                <div className="text-2xl font-bold text-blue-600">{creditsSystem.monthlyUsage.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">من {creditsSystem.monthlyLimit.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{usagePercentage.toFixed(1)}% من الحد الشهري</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">متوسط التكلفة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">0.05 ر.س</div>
                <p className="text-xs text-muted-foreground">لكل رسالة</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              <div className="space-y-4">
                {creditsSystem.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {transaction.date}
                          {transaction.phoneNumber && (
                            <>
                              <span>•</span>
                              <span>{transaction.phoneNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toLocaleString()}
                      </div>
                      <Badge className={getStatusColor(transaction.status)} variant="outline">
                        {transaction.status === "completed"
                          ? "مكتمل"
                          : transaction.status === "pending"
                            ? "في الانتظار"
                            : "فشل"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {creditsSystem.usageByNumber.map((usage, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{usage.displayName}</div>
                        <div className="text-sm text-muted-foreground">{usage.phoneNumber}</div>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{usage.creditsUsed.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">رصيد مُستخدم</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">الرسائل هذا الشهر:</span>
                        <div className="font-medium">{usage.messagesThisMonth.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">آخر استخدام:</span>
                        <div className="font-medium">{usage.lastUsed}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الاتجاه الشهري</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">يناير 2024</span>
                    <span className="font-medium">1,250 رسالة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ديسمبر 2023</span>
                    <span className="font-medium">980 رسالة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">نوفمبر 2023</span>
                    <span className="font-medium">1,100 رسالة</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">توقعات الاستخدام</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">الاستخدام المتوقع هذا الشهر</span>
                    <span className="font-medium text-blue-600">2,100 رسالة</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">الرصيد المطلوب</span>
                    <span className="font-medium text-green-600">850 رسالة إضافية</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">التكلفة المتوقعة</span>
                    <span className="font-medium text-purple-600">42.50 ر.س</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
