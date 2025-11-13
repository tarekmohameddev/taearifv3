"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "@/lib/axiosInstance"
import {
  Home,
  MapPin,
  Check,
  X,
  CreditCard,
  Clock,
  User,
  FileText,
  Banknote,
  Search,
  Filter,
  ArrowUpDown,
  BarChart3,
  Download,
  File,
  Upload,
  Send,
  Eye,
  Building2,
  Building,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
// Added Table components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Reservation {
  id: string
  type: "rent" | "buy"
  status: "pending" | "accepted" | "rejected"
  customer: {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
  }
  property: {
    id: string
    title: string
    address: string
    price: number
    type: string
    bedrooms: number
    bathrooms: number
    image: string
    projectName: string
    buildingName: string
  }
  requestDate: string
  desiredDate?: string
  duration?: number
  paymentRequired: boolean
  depositAmount?: number
  notes: string
  documents?: Array<{ id: string; name: string; type: string; uploadedAt: string }>
  messages?: Array<{ id: string; sender: string; content: string; timestamp: string }>
  timeline?: Array<{ id: string; action: string; timestamp: string; actor: string }>
}

export function PropertyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    totalRevenue: 0,
    byType: { rent: 0, buy: 0 },
    byMonth: [] as Array<{ month: string; reservations: number }>,
  })

  const [selectedReservations, setSelectedReservations] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "rent" | "buy">("all")
  const [filterCustomerTier, setFilterCustomerTier] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  })
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false)
  const [action, setAction] = useState<"accept" | "reject" | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [confirmPayment, setConfirmPayment] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [detailTab, setDetailTab] = useState("overview")

  // Fetch reservations from API
  const fetchReservations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (filterType !== "all") params.append("type", filterType)
      if (searchQuery) params.append("search", searchQuery)
      params.append("sort_by", sortBy)
      params.append("sort_order", sortOrder)
      params.append("page", currentPage.toString())
      params.append("per_page", perPage.toString())

      const response = await axiosInstance.get(`/api/v1/reservations?${params.toString()}`)

      if (response.data.success && response.data.data) {
        const reservationsData = response.data.data.reservations || []
        setReservations(reservationsData)

        // Update pagination from response
        if (response.data.data.pagination) {
          const paginationData = response.data.data.pagination
          setPagination({
            total: paginationData.total || 0,
            lastPage: paginationData.last_page || 1,
            from: paginationData.from || 0,
            to: paginationData.to || 0,
          })
        }

        // Update stats if available in response
        if (response.data.data.stats) {
          setStats({
            total: response.data.data.stats.total || 0,
            pending: response.data.data.stats.pending || 0,
            accepted: response.data.data.stats.accepted || 0,
            rejected: response.data.data.stats.rejected || 0,
            totalRevenue: response.data.data.stats.totalRevenue || 0,
            byType: response.data.data.stats.byType || { rent: 0, buy: 0 },
            byMonth: response.data.data.stats.byMonth || [],
          })
        }
      }
    } catch (err: any) {
      console.error("Error fetching reservations:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب الحجوزات")
    } finally {
      setLoading(false)
    }
  }, [filterType, searchQuery, sortBy, sortOrder, currentPage, perPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterType, searchQuery, sortBy, sortOrder])

  // Fetch stats from API
  const fetchReservationsStats = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/v1/reservations/stats")

      if (response.data.success && response.data.data) {
        setStats({
          total: response.data.data.total || 0,
          pending: response.data.data.pending || 0,
          accepted: response.data.data.accepted || 0,
          rejected: response.data.data.rejected || 0,
          totalRevenue: response.data.data.totalRevenue || 0,
          byType: response.data.data.byType || { rent: 0, buy: 0 },
          byMonth: response.data.data.byMonth || [],
        })
      }
    } catch (err: any) {
      console.error("Error fetching stats:", err)
    }
  }, [])

  // Fetch single reservation details
  const fetchReservationDetails = useCallback(async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/v1/reservations/${id}`)

      if (response.data.success && response.data.data) {
        setSelectedReservation(response.data.data)
        setShowDetailDialog(true)
        setDetailTab("overview")
      }
    } catch (err: any) {
      console.error("Error fetching reservation details:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب تفاصيل الحجز")
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    fetchReservations()
    fetchReservationsStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch when filters change
  useEffect(() => {
    fetchReservations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, searchQuery, sortBy, sortOrder])

  const filteredReservations = reservations
    .filter((r) => {
      const matchesSearch =
        r.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.property.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || // Added search by project name
        r.property.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) // Added search by building name

      const matchesType = filterType === "all" || r.type === filterType
      const matchesTier = filterCustomerTier === "all" || r.customer.id === filterCustomerTier

      return matchesSearch && matchesType && matchesTier
    })
    .sort((a, b) => {
      let compareValue = 0

      switch (sortBy) {
        case "date":
          compareValue = new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
          break
        case "price":
          compareValue = a.property.price - b.property.price
          break
        case "name":
          compareValue = a.property.title.localeCompare(b.property.title)
          break
      }

      return sortOrder === "asc" ? compareValue : -compareValue
    })

  const pendingReservations = filteredReservations.filter((r) => r.status === "pending")
  const acceptedReservations = filteredReservations.filter((r) => r.status === "accepted")
  const rejectedReservations = filteredReservations.filter((r) => r.status === "rejected")

  const handleSelectReservation = (id: string) => {
    const newSelected = new Set(selectedReservations)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedReservations(newSelected)
  }

  const handleSelectAll = (reservations: Reservation[]) => {
    if (selectedReservations.size === reservations.length) {
      setSelectedReservations(new Set())
    } else {
      setSelectedReservations(new Set(reservations.map((r) => r.id)))
    }
  }

  const handleBulkAction = async (actionType: "accept" | "reject") => {
    const selectedIds = Array.from(selectedReservations)
    if (selectedIds.length === 0) return

    try {
      const response = await axiosInstance.post("/api/v1/reservations/bulk-action", {
        action: actionType,
        reservationIds: selectedIds,
        notes: actionType === "accept" ? "قبول جماعي" : "رفض جماعي",
      })

      if (response.data.success) {
        // Refresh reservations list
        await fetchReservations()
        await fetchReservationsStats()
        setSelectedReservations(new Set())
      }
    } catch (err: any) {
      console.error("Error performing bulk action:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء")
    }
  }

  const handleExport = async (format: "csv" | "pdf") => {
    if (format === "csv") {
      try {
        setLoading(true)
        setError(null)

        // بناء معاملات البحث والفلترة
        const params = new URLSearchParams()
        if (filterType !== "all") params.append("type", filterType)
        if (searchQuery) params.append("search", searchQuery)
        if (sortBy) params.append("sort_by", sortBy)
        if (sortOrder) params.append("sort_order", sortOrder)

        // جلب ملف CSV
        const response = await axiosInstance.get(`/api/v1/reservations/export/csv?${params.toString()}`, {
          responseType: "blob",
          headers: {
            Accept: "text/csv",
          },
        })

        // التحقق من أن الاستجابة هي blob
        if (response.data instanceof Blob) {
          // الحصول على اسم الملف من headers أو استخدام اسم افتراضي
          const contentDisposition = response.headers["content-disposition"]
          let filename = `reservations-${new Date().toISOString().split("T")[0]}.csv`

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, "")
            }
          }

          // إنشاء رابط للتحميل
          const url = window.URL.createObjectURL(response.data)
          const link = document.createElement("a")
          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()

          // تنظيف
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } else {
          throw new Error("استجابة غير صحيحة من الخادم")
        }
      } catch (err: any) {
        console.error("Error exporting reservations:", err)
        
        // معالجة الأخطاء
        if (err.response) {
          // محاولة قراءة رسالة الخطأ من blob response
          if (err.response.data instanceof Blob) {
            const reader = new FileReader()
            reader.onload = async () => {
              try {
                const text = reader.result as string
                const errorData = JSON.parse(text)
                setError(errorData.message || "حدث خطأ أثناء تصدير الحجوزات")
              } catch {
                setError("حدث خطأ أثناء تصدير الحجوزات")
              }
            }
            reader.readAsText(err.response.data)
          } else {
            setError(err.response?.data?.message || "حدث خطأ أثناء تصدير الحجوزات")
          }
        } else if (err.request) {
          setError("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت")
        } else {
          setError(err.message || "حدث خطأ أثناء تصدير الحجوزات")
        }
      } finally {
        setLoading(false)
      }
    }
    // PDF export غير مدعوم حالياً
  }

  const handleAddMessage = async () => {
    if (!selectedReservation || !messageText.trim()) return

    try {
      // Note: Add message API endpoint should be implemented in backend
      // For now, we'll refresh the reservation details
      await fetchReservationDetails(selectedReservation.id)
      setMessageText("")
    } catch (err: any) {
      console.error("Error adding message:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء إضافة الرسالة")
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    const dayName = days[date.getDay()]
    const dateFormatted = date.toLocaleDateString("ar-US")
    const time = date.toLocaleTimeString("ar-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    return `${dayName} ${dateFormatted} - ${time}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "accepted":
        return "bg-green-100 text-green-800 border-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار"
      case "accepted":
        return "مقبول"
      case "rejected":
        return "مرفوض"
      default:
        return status
    }
  }

  const getTypeLabel = (type: string) => {
    return type === "rent" ? "إيجار" : "شراء"
  }

  const handleViewDetails = async (reservation: Reservation) => {
    // Fetch full details from API
    await fetchReservationDetails(reservation.id)
  }

  const handleActionClick = (actionType: "accept" | "reject") => {
    setAction(actionType)
    setActionReason("")
    setShowActionDialog(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedReservation) return

    try {
      const endpoint =
        action === "accept"
          ? `/api/v1/reservations/${selectedReservation.id}/accept`
          : `/api/v1/reservations/${selectedReservation.id}/reject`

      const payload =
        action === "accept"
          ? {
              confirmPayment: confirmPayment,
              notes: actionReason || undefined,
            }
          : {
              reason: actionReason || undefined,
            }

      const response = await axiosInstance.post(endpoint, payload)

      if (response.data.success) {
        // Refresh reservations list and stats
        await fetchReservations()
        await fetchReservationsStats()

        // Update selected reservation if dialog is still open
        if (showDetailDialog) {
          await fetchReservationDetails(selectedReservation.id)
        }

        setShowActionDialog(false)
        setActionReason("")
        setConfirmPayment(false)
      }
    } catch (err: any) {
      console.error("Error confirming action:", err)
      setError(err.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء")
    }
  }

  // Use stats from API instead of calculating from reservations
  const totalReservations = stats.total
  const totalPending = stats.pending
  const totalAccepted = stats.accepted
  const totalRejected = stats.rejected
  const totalRevenue = stats.totalRevenue

  const chartData = {
    byType: [
      {
        name: "إيجار",
        count: stats.byType.rent,
        color: "#3b82f6",
      },
      {
        name: "شراء",
        count: stats.byType.buy,
        color: "#8b5cf6",
      },
    ],
    byStatus: [
      {
        name: "قيد الانتظار",
        count: stats.pending,
        fill: "#eab308",
      },
      {
        name: "مقبولة",
        count: stats.accepted,
        fill: "#22c55e",
      },
      {
        name: "مرفوضة",
        count: stats.rejected,
        fill: "#ef4444",
      },
    ],
    byMonth: stats.byMonth
      ? stats.byMonth.map((item) => {
          try {
            const monthDate = new Date(item.month + "-01")
            if (isNaN(monthDate.getTime())) {
              return { month: item.month, reservations: item.reservations || 0 }
            }
            return {
              month: monthDate.toLocaleDateString("ar-US", { month: "long" }),
              reservations: item.reservations || 0,
            }
          } catch {
            return { month: item.month, reservations: item.reservations || 0 }
          }
        })
      : [],
  }

  // Removed ReservationCard component as it's replaced by ReservationsTable
  // const ReservationCard = ({ reservation }: { reservation: Reservation }) => ( ... )

  const ReservationsTable = ({ reservations }: { reservations: Reservation[] }) => (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedReservations.size === reservations.length && reservations.length > 0}
                    onCheckedChange={() => handleSelectAll(reservations)}
                    className="w-5 h-5"
                  />
                </TableHead>
                <TableHead className="min-w-[200px]">العقار</TableHead>
                <TableHead className="min-w-[150px]">اسم المشروع</TableHead>
                <TableHead className="min-w-[120px]">اسم المبنى</TableHead>
                <TableHead className="min-w-[150px]">العميل</TableHead>
                <TableHead className="min-w-[100px]">النوع</TableHead>
                <TableHead className="min-w-[250px]">التاريخ والوقت</TableHead>
                <TableHead className="min-w-[100px]">السعر</TableHead>
                <TableHead className="min-w-[100px]">الدفعة</TableHead>
                <TableHead className="min-w-[100px]">الحالة</TableHead>
                <TableHead className="min-w-[150px] text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow
                  key={reservation.id}
                  className={cn(
                    "cursor-pointer hover:bg-slate-50 transition-colors",
                    selectedReservations.has(reservation.id) && "bg-blue-50",
                  )}
                  onClick={() => handleViewDetails(reservation)} // Make the whole row clickable for details
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedReservations.has(reservation.id)}
                      onCheckedChange={() => handleSelectReservation(reservation.id)}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when checkbox is interacted with
                      className="w-5 h-5"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={reservation.property.image || "/placeholder.svg"}
                          alt={reservation.property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{reservation.property.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {reservation.property.address}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.property.projectName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{reservation.property.buildingName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{reservation.customer.name}</p>
                      <p className="text-xs text-muted-foreground">{reservation.customer.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(reservation.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="whitespace-nowrap">{formatDateTime(reservation.requestDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm whitespace-nowrap">
                      {reservation.property.price.toLocaleString()} ر.س
                    </p>
                  </TableCell>
                  <TableCell>
                    {reservation.paymentRequired ? (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-green-600" />
                        <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                          {reservation.depositAmount?.toLocaleString()} ر.س
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">لا يوجد</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent row click when viewing details
                          handleViewDetails(reservation)
                        }}
                        className="h-8 px-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {reservation.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedReservation(reservation)
                              handleActionClick("accept")
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 px-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedReservation(reservation)
                              handleActionClick("reject")
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full min-h-screen  ">
      <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-sm text-red-800">{error}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                إخفاء
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">جاري تحميل البيانات...</p>
            </CardContent>
          </Card>
        )}

        {/* Header Section */}
        <div className="space-y-2 min-w-0">
          <div className="flex flex-col gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">حجوزات العقارات</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                إدارة طلبات الإيجار والشراء من العملاء
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div
                className="relative inline-block"
                style={{
                  position: "relative",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  if (totalReservations === 0 || !totalReservations) {
                    const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement
                    if (tooltip) {
                      tooltip.style.opacity = "1"
                      tooltip.style.visibility = "visible"
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  const tooltip = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement
                  if (tooltip) {
                    tooltip.style.opacity = "0"
                    tooltip.style.visibility = "hidden"
                  }
                }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("csv")}
                  disabled={totalReservations === 0 || !totalReservations}
                  className="gap-2 text-xs"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" /> تصدير CSV
                </Button>
                {(totalReservations === 0 || !totalReservations) && (
                  <div
                    data-tooltip
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      right: 0,
                      marginBottom: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#1f2937",
                      color: "white",
                      fontSize: "12px",
                      borderRadius: "6px",
                      whiteSpace: "nowrap",
                      zIndex: 1001,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      pointerEvents: "none",
                      opacity: 0,
                      visibility: "hidden",
                      transition: "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  >
                    لا يوجد حجوزات أساساً
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "16px",
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "6px solid #1f2937",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 auto-rows-max">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-600 truncate">إجمالي الحجوزات</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">{totalReservations}</p>
                </div>
                <div className="p-2 bg-slate-200 rounded-lg flex-shrink-0">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-yellow-700 truncate">قيد الانتظار</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-900 mt-1">{totalPending}</p>
                </div>
                <div className="p-2 bg-yellow-200 rounded-lg flex-shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-green-700 truncate">مقبولة</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1">{totalAccepted}</p>
                </div>
                <div className="p-2 bg-green-200 rounded-lg flex-shrink-0">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Dashboard */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <h3 className="font-semibold text-sm sm:text-base truncate">تقارير وتحليلات</h3>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm md:text-base truncate">اتجاهات الحجوزات الشهرية</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-3 md:p-6 overflow-x-auto">
              <div className="w-full h-56 sm:h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value) => `${value} حجز`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="reservations"
                      name="عدد الحجوزات"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <h3 className="font-semibold text-sm sm:text-base truncate">البحث والتصفية</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white border-slate-200 text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>

                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="bg-white border-slate-200 text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue placeholder="نوع الحجز" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="rent">إيجار</SelectItem>
                    <SelectItem value="buy">شراء</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="bg-white border-slate-200 text-xs sm:text-sm h-9 sm:h-10">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ</SelectItem>
                    <SelectItem value="price">السعر</SelectItem>
                    <SelectItem value="name">اسم العقار</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-white border-slate-200 h-9 sm:h-10"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedReservations.size > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-medium text-blue-900">تم تحديد {selectedReservations.size} حجز</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("accept")}
                    className="bg-green-500 hover:bg-green-600 text-xs h-8 sm:h-9"
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 ml-2" /> قبول
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkAction("reject")}
                    className="text-xs h-8 sm:h-9"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 ml-2" /> رفض
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedReservations(new Set())}
                    className="text-xs h-8 sm:h-9"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reservations Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm h-9 sm:h-10">
            <TabsTrigger value="pending" className="text-xs sm:text-sm">
              قيد الانتظار{" "}
              <span className="ml-2 bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-0.5 rounded text-xs">
                {pendingReservations.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="text-xs sm:text-sm">
              مقبولة{" "}
              <span className="ml-2 bg-green-100 text-green-800 px-1.5 sm:px-2 py-0.5 rounded text-xs">
                {acceptedReservations.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="text-xs sm:text-sm">
              مرفوضة{" "}
              <span className="ml-2 bg-red-100 text-red-800 px-1.5 sm:px-2 py-0.5 rounded text-xs">
                {rejectedReservations.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingReservations.length > 0 ? (
              <>
                <ReservationsTable reservations={pendingReservations} />
                {/* Pagination */}
                {pagination.lastPage > 1 && (
                  <ReservationsPagination
                    currentPage={currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                    perPage={perPage}
                    from={pagination.from}
                    to={pagination.to}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    onPerPageChange={setPerPage}
                    loading={loading}
                  />
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-xs sm:text-sm text-muted-foreground">لا توجد حجوزات قيد الانتظار</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="space-y-4 mt-4">
            {acceptedReservations.length > 0 ? (
              <>
                <ReservationsTable reservations={acceptedReservations} />
                {/* Pagination */}
                {pagination.lastPage > 1 && (
                  <ReservationsPagination
                    currentPage={currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                    perPage={perPage}
                    from={pagination.from}
                    to={pagination.to}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    onPerPageChange={setPerPage}
                    loading={loading}
                  />
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <Check className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-xs sm:text-sm text-muted-foreground">لا توجد حجوزات مقبولة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4 mt-4">
            {rejectedReservations.length > 0 ? (
              <>
                <ReservationsTable reservations={rejectedReservations} />
                {/* Pagination */}
                {pagination.lastPage > 1 && (
                  <ReservationsPagination
                    currentPage={currentPage}
                    lastPage={pagination.lastPage}
                    total={pagination.total}
                    perPage={perPage}
                    from={pagination.from}
                    to={pagination.to}
                    onPageChange={(page) => {
                      setCurrentPage(page)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    onPerPageChange={setPerPage}
                    loading={loading}
                  />
                )}
              </>
            ) : (
              <Card>
                <CardContent className="p-6 sm:p-8 text-center">
                  <X className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <p className="text-xs sm:text-sm text-muted-foreground">لا توجد حجوزات مرفوضة</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Detail Dialog with Multiple Tabs */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            {selectedReservation && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <DialogTitle className="text-lg sm:text-2xl mb-2">تفاصيل الحجز</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    معلومات كاملة عن طلب الحجز مع الوثائق والرسائل
                  </DialogDescription>
                </div>

                <Tabs value={detailTab} onValueChange={setDetailTab}>
                  <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm h-9 sm:h-10">
                    <TabsTrigger value="overview" className="text-xs">
                      نظرة عامة
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-xs">
                      وثائق ({selectedReservation.documents?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="text-xs">
                      رسائل ({selectedReservation.messages?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs">
                      السجل
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    {/* Property Info */}
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Home className="h-5 w-5" /> العقار
                        </h3>
                        <Badge className={getStatusColor(selectedReservation.status)}>
                          {getStatusLabel(selectedReservation.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">اسم العقار</p>
                          <p className="font-medium">{selectedReservation.property.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">النوع</p>
                          <p className="font-medium">{selectedReservation.property.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">العنوان</p>
                          <p className="font-medium">{selectedReservation.property.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">السعر</p>
                          <p className="font-medium text-lg">
                            {selectedReservation.property.price.toLocaleString()} ر.س
                            {selectedReservation.type === "rent" && "/شهر"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">غرف النوم</p>
                          <p className="font-medium">{selectedReservation.property.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الحمامات</p>
                          <p className="font-medium">{selectedReservation.property.bathrooms}</p>
                        </div>
                      </div>
                      {/* Displaying Project and Building Names */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">اسم المشروع</p>
                          <p className="font-medium flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />{" "}
                            {selectedReservation.property.projectName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">اسم المبنى</p>
                          <p className="font-medium flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />{" "}
                            {selectedReservation.property.buildingName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" /> بيانات العميل
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">الاسم</p>
                          <p className="font-medium">{selectedReservation.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">البريد</p>
                          <p className="font-medium text-sm">{selectedReservation.customer.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الهاتف</p>
                          <p className="font-medium">{selectedReservation.customer.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reservation Details */}
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" /> تفاصيل الحجز
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-muted-foreground">نوع الحجز</p>
                          <p className="font-medium">{getTypeLabel(selectedReservation.type)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تاريخ الطلب</p>
                          <p className="font-medium">{selectedReservation.requestDate}</p>
                        </div>
                        {selectedReservation.type === "rent" && selectedReservation.desiredDate && (
                          <>
                            <div>
                              <p className="text-sm text-muted-foreground">البداية المطلوبة</p>
                              <p className="font-medium">{selectedReservation.desiredDate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">المدة</p>
                              <p className="font-medium">{selectedReservation.duration} شهر</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Payment Info */}
                    {selectedReservation.paymentRequired && (
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-blue-900">
                          <Banknote className="h-5 w-5" /> معلومات الدفع
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-blue-700">المبلغ المطلوب</p>
                            <p className="font-bold text-lg text-blue-900">
                              {selectedReservation.depositAmount?.toLocaleString()} ر.س
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">نوع الدفعة</p>
                            <p className="font-medium text-blue-900">
                              {selectedReservation.type === "rent" ? "عربون إيجار" : "عربون شراء"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedReservation.status === "pending" && (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          onClick={() => handleActionClick("accept")}
                        >
                          <Check className="h-4 w-4 ml-2" /> قبول الحجز
                        </Button>
                        <Button variant="destructive" className="flex-1" onClick={() => handleActionClick("reject")}>
                          <X className="h-4 w-4 ml-2" /> رفض الحجز
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Documents Tab */}
                  <TabsContent value="documents" className="space-y-4">
                    <div className="space-y-3">
                      {selectedReservation.documents && selectedReservation.documents.length > 0 ? (
                        selectedReservation.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <File className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">رفع في: {doc.uploadedAt}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              تحميل
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">لا توجد وثائق مرفوعة</p>
                      )}
                    </div>

                    <Button className="w-full gap-2 bg-transparent" variant="outline">
                      <Upload className="h-4 w-4" /> رفع وثيقة جديدة
                    </Button>
                  </TabsContent>

                  {/* Messages Tab */}
                  <TabsContent value="messages" className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {selectedReservation.messages && selectedReservation.messages.length > 0 ? (
                        selectedReservation.messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={cn(
                              "p-3 rounded-lg",
                              msg.sender === "أنت"
                                ? "bg-blue-50 border border-blue-200 ml-8"
                                : "bg-slate-50 border border-slate-200 mr-8",
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{msg.sender}</p>
                              <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                            </div>
                            <p className="text-sm mt-2">{msg.content}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">لا توجد رسائل</p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Input
                        placeholder="اكتب رسالة..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleAddMessage()
                        }}
                      />
                      <Button size="icon" onClick={handleAddMessage} disabled={!messageText.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Timeline Tab */}
                  <TabsContent value="timeline" className="space-y-4">
                    <div className="space-y-3">
                      {selectedReservation.timeline && selectedReservation.timeline.length > 0 ? (
                        selectedReservation.timeline.map((event) => (
                          <div key={event.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                              <div className="w-0.5 h-12 bg-slate-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="font-medium text-sm">{event.action}</p>
                              <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                              <p className="text-xs text-muted-foreground mt-1">بواسطة: {event.actor}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm">لا يوجد سجل</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Action Dialog */}
        <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
          <DialogContent className="max-w-xs sm:max-w-md p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">
                {action === "accept" ? "قبول الحجز" : "رفض الحجز"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {selectedReservation && (
                <>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="font-medium mb-1">{selectedReservation.property.title}</p>
                    <p className="text-muted-foreground">العميل: {selectedReservation.customer.name}</p>
                  </div>

                  {action === "accept" && selectedReservation.paymentRequired && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="confirm-payment"
                          checked={confirmPayment}
                          onCheckedChange={(checked) => setConfirmPayment(checked === true)}
                        />
                        <Label htmlFor="confirm-payment" className="text-sm cursor-pointer">
                          تأكيد استلام الدفعة ({selectedReservation.depositAmount?.toLocaleString()} ر.س)
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>{action === "accept" ? "ملاحظات القبول (اختياري)" : "سبب الرفض (اختياري)"}</Label>
                    <Textarea
                      placeholder="أدخل تفاصيلك..."
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setShowActionDialog(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      className={cn(
                        "flex-1",
                        action === "accept" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600",
                      )}
                      onClick={handleConfirmAction}
                      disabled={action === "accept" && selectedReservation.paymentRequired && !confirmPayment}
                    >
                      {action === "accept" ? "تأكيد القبول" : "تأكيد الرفض"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Pagination Component
interface ReservationsPaginationProps {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  from: number
  to: number
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  loading?: boolean
}

function ReservationsPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  onPageChange,
  onPerPageChange,
  loading = false,
}: ReservationsPaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = typeof window !== "undefined" && window.innerWidth < 640 ? 3 : 5 // Less pages on mobile

    if (lastPage <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end
      let start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
      let end = Math.min(lastPage - 1, currentPage + Math.floor(maxVisiblePages / 2))

      // Adjust if near start
      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        end = Math.min(maxVisiblePages, lastPage - 1)
        start = 2
      }

      // Adjust if near end
      if (currentPage > lastPage - Math.floor(maxVisiblePages / 2)) {
        start = Math.max(2, lastPage - maxVisiblePages + 1)
        end = lastPage - 1
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add page numbers
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < lastPage - 1) {
        pages.push("...")
      }

      // Always show last page
      if (lastPage > 1) {
        pages.push(lastPage)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <Card className="mt-4">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Results info */}
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
            عرض {from} إلى {to} من {total} حجز
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {/* Per page selector - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-muted-foreground">عدد النتائج:</span>
              <Select value={perPage.toString()} onValueChange={(value) => onPerPageChange(Number(value))}>
                <SelectTrigger className="h-8 w-20 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider - hidden on mobile */}
            <div className="hidden sm:block w-px h-6 bg-border" />

            {/* First page - hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>

            {/* Previous page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                      ...
                    </span>
                  )
                }
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={loading}
                    className="h-8 w-8 p-0 text-xs sm:text-sm"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            {/* Next page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === lastPage || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Last page - hidden on mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(lastPage)}
              disabled={currentPage === lastPage || loading}
              className="hidden sm:flex h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
