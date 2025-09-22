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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  MoreVertical,
  Check,
  ChevronsUpDown,
} from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import useStore from "@/context/Store"

// مكون إضافة إيجار جديد محدث
interface AddRentalFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function UpdatedAddRentalForm({ onSubmit, onCancel, isSubmitting }: AddRentalFormProps) {
  const [formData, setFormData] = useState({
    tenant_full_name: "",
    contract_number: "",
    tenant_phone: "",
    tenant_email: "",
    tenant_job_title: "",
    tenant_social_status: "single",
    tenant_national_id: "",
    office_commission_type: "percentage",
    office_commission_value: "",
    property_number: "",
    property_id: "",
    project_id: "",
    unit_label: "",
    move_in_date: "",
    rental_period: 12,
    rental_period_type: "",
    rental_period_multiplier: 1,
    rental_period_value: 0,
    paying_plan: "monthly",
    base_rent_amount: "",
    currency: "SAR",
    deposit_amount: "",
    platform_fee: "",
    water_fee: "",
    notes: ""
  })

  const [projects, setProjects] = useState<any[]>([])
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [openProject, setOpenProject] = useState(false)
  const [openProperty, setOpenProperty] = useState(false)

  // جلب البيانات عند فتح النموذج
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [projectsRes, propertiesRes] = await Promise.all([
          axiosInstance.get("/projects"),
          axiosInstance.get("/properties"),
        ])
        
        // معالجة بيانات المشاريع
        if (projectsRes.data?.data?.projects && Array.isArray(projectsRes.data.data.projects)) {
          setProjects(projectsRes.data.data.projects)
        } else if (projectsRes.data?.projects && Array.isArray(projectsRes.data.projects)) {
          setProjects(projectsRes.data.projects)
        } else {
          setProjects([])
        }
        
        // معالجة بيانات العقارات
        if (propertiesRes.data?.data?.properties && Array.isArray(propertiesRes.data.data.properties)) {
          setProperties(propertiesRes.data.data.properties)
        } else if (propertiesRes.data?.properties && Array.isArray(propertiesRes.data.properties)) {
          setProperties(propertiesRes.data.properties)
        } else {
          setProperties([])
        }
      } catch (error) {
        setErrors({ general: "حدث خطأ في جلب البيانات" })
        setProjects([])
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // دالة التحقق من البيانات
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    // التحقق من الحقول الإجبارية
    if (!formData.tenant_full_name.trim()) {
      newErrors.tenant_full_name = "الاسم الكامل مطلوب"
    }
    if (!formData.contract_number.trim()) {
      newErrors.contract_number = "رقم العقد مطلوب"
    }
    if (!formData.tenant_phone.trim()) {
      newErrors.tenant_phone = "رقم الهاتف مطلوب"
    }
    if (!formData.property_number.trim()) {
      newErrors.property_number = "رقم العقار مطلوب"
    }
    if (!formData.move_in_date.trim()) {
      newErrors.move_in_date = "تاريخ الانتقال مطلوب"
    }
    if (!formData.rental_period || formData.rental_period <= 0) {
      newErrors.rental_period = "مدة الإيجار مطلوبة ولا تقل عن شهر واحد"
    }
    if (!formData.base_rent_amount || parseFloat(formData.base_rent_amount) < 100) {
      newErrors.base_rent_amount = "مبلغ الإيجار مطلوب ولا يقل عن 100 ريال"
    }

    // التحقق من صحة رقم الهاتف
    if (formData.tenant_phone && !/^[0-9+\-\s()]+$/.test(formData.tenant_phone)) {
      newErrors.tenant_phone = "رقم الهاتف غير صحيح"
    }

    // التحقق من صحة البريد الإلكتروني (إذا تم إدخاله)
    if (formData.tenant_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant_email)) {
      newErrors.tenant_email = "البريد الإلكتروني غير صحيح"
    }

    // التحقق من قيمة العمولة
    if (formData.office_commission_value && isNaN(parseFloat(formData.office_commission_value))) {
      newErrors.office_commission_value = "قيمة العمولة يجب أن تكون رقماً"
    }

    // التحقق من صحة تاريخ الانتقال
    if (formData.move_in_date) {
      const selectedDate = new Date(formData.move_in_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0) // إزالة الوقت للمقارنة الصحيحة
      
      if (selectedDate < today) {
        newErrors.move_in_date = "تاريخ الانتقال لا يمكن أن يكون في الماضي"
      }
    }

    // التحقق من صحة مدة الإيجار
    if (formData.rental_period && (isNaN(formData.rental_period) || formData.rental_period <= 0)) {
      newErrors.rental_period = "مدة الإيجار يجب أن تكون رقم صحيح أكبر من 0"
    }

    // التحقق من صحة مبلغ الإيجار
    if (formData.base_rent_amount && (isNaN(parseFloat(formData.base_rent_amount)) || parseFloat(formData.base_rent_amount) < 100)) {
      newErrors.base_rent_amount = "مبلغ الإيجار يجب أن يكون رقم صحيح لا يقل عن 100 ريال"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // تحويل البيانات إلى الأنواع الصحيحة
    const processedFormData: any = {
      ...formData,
      property_id: formData.property_id ? parseInt(formData.property_id) : null,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      rental_period: Number(formData.rental_period) || 12,
      base_rent_amount: formData.base_rent_amount ? parseFloat(formData.base_rent_amount) : 0,
      deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : 0,
      office_commission_value: formData.office_commission_value ? parseFloat(formData.office_commission_value) : 0,
      platform_fee: formData.platform_fee ? parseFloat(formData.platform_fee) : 0,
      water_fee: formData.water_fee ? parseFloat(formData.water_fee) : 0,
    }
    
    onSubmit(processedFormData)
  }

  return (
    <div className="bg-white rounded-lg">
      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-600 ml-2" />
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">معلومات المستأجر</h4>
            
            <div className="space-y-2">
              <Label htmlFor="tenant_full_name" className="text-sm font-medium text-gray-700">
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="tenant_full_name"
                value={formData.tenant_full_name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tenant_full_name: e.target.value }))
                  if (errors.tenant_full_name) {
                    setErrors(prev => ({ ...prev, tenant_full_name: "" }))
                  }
                }}
                placeholder="أدخل الاسم الكامل"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_full_name ? 'border-red-500' : ''}`}
              />
              {errors.tenant_full_name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_full_name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract_number" className="text-sm font-medium text-gray-700">
                رقم العقد <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="contract_number"
                value={formData.contract_number}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, contract_number: e.target.value }))
                  if (errors.contract_number) {
                    setErrors(prev => ({ ...prev, contract_number: "" }))
                  }
                }}
                placeholder="5454545454"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.contract_number ? 'border-red-500' : ''}`}
              />
              {errors.contract_number && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.contract_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_phone" className="text-sm font-medium text-gray-700">
                رقم الهاتف <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="tenant_phone"
                value={formData.tenant_phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tenant_phone: e.target.value }))
                  if (errors.tenant_phone) {
                    setErrors(prev => ({ ...prev, tenant_phone: "" }))
                  }
                }}
                placeholder="0551234567"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_phone ? 'border-red-500' : ''}`}
              />
              {errors.tenant_phone && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_email" className="text-sm font-medium text-gray-700">البريد الإلكتروني</Label>
              <Input 
                id="tenant_email"
                type="email"
                value={formData.tenant_email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tenant_email: e.target.value }))
                  if (errors.tenant_email) {
                    setErrors(prev => ({ ...prev, tenant_email: "" }))
                  }
                }}
                placeholder="example@email.com"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.tenant_email ? 'border-red-500' : ''}`}
              />
              {errors.tenant_email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.tenant_email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_job_title" className="text-sm font-medium text-gray-700">المهنة</Label>
              <Input 
                id="tenant_job_title"
                value={formData.tenant_job_title}
                onChange={(e) => setFormData(prev => ({ ...prev, tenant_job_title: e.target.value }))}
                placeholder="مهندس، طبيب، معلم..."
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenant_social_status" className="text-sm font-medium text-gray-700">الحالة الاجتماعية</Label>
              <Select value={formData.tenant_social_status} onValueChange={(value) => setFormData(prev => ({ ...prev, tenant_social_status: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
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
              <Label htmlFor="tenant_national_id" className="text-sm font-medium text-gray-700">رقم الهوية</Label>
              <Input 
                id="tenant_national_id"
                value={formData.tenant_national_id}
                onChange={(e) => setFormData(prev => ({ ...prev, tenant_national_id: e.target.value }))}
                placeholder="1234567890"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">تفاصيل العقد</h4>
            
            <div className="space-y-2">
              <Label htmlFor="property_number" className="text-sm font-medium text-gray-700">
                رقم العقار <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="property_number"
                value={formData.property_number}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, property_number: e.target.value }))
                  if (errors.property_number) {
                    setErrors(prev => ({ ...prev, property_number: "" }))
                  }
                }}
                placeholder="12"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.property_number ? 'border-red-500' : ''}`}
              />
              {errors.property_number && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.property_number}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">المشروع</Label>
              <Popover open={openProject} onOpenChange={setOpenProject}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProject}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.project_id
                      ? projects.find((project) => project.id.toString() === formData.project_id)?.contents?.[0]?.title || `مشروع ${formData.project_id}`
                      : "اختر مشروع..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن مشروع..." />
                    <CommandList>
                      <CommandEmpty>لم يتم العثور على مشروع.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(projects) && projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.contents?.[0]?.title || `مشروع ${project.id}`}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, project_id: project.id.toString() }))
                              setOpenProject(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.project_id === project.id.toString() ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {project.contents?.[0]?.title || `مشروع ${project.id}`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">العقار</Label>
              <Popover open={openProperty} onOpenChange={setOpenProperty}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openProperty}
                    className="w-full justify-between border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  >
                    {formData.property_id
                      ? properties.find((property) => property.id.toString() === formData.property_id)?.title || `عقار ${formData.property_id}`
                      : "اختر عقار..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="ابحث عن عقار..." />
                    <CommandList>
                      <CommandEmpty>لم يتم العثور على عقار.</CommandEmpty>
                      <CommandGroup>
                        {Array.isArray(properties) && properties.map((property) => (
                          <CommandItem
                            key={property.id}
                            value={property.title || `عقار ${property.id}`}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, property_id: property.id.toString() }))
                              setOpenProperty(false)
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                formData.property_id === property.id.toString() ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            {property.title || `عقار ${property.id}`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_label" className="text-sm font-medium text-gray-700">رمز الوحدة</Label>
              <Input 
                id="unit_label"
                value={formData.unit_label}
                onChange={(e) => setFormData(prev => ({ ...prev, unit_label: e.target.value }))}
                placeholder="A-12"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="move_in_date" className="text-sm font-medium text-gray-700">
                تاريخ الانتقال <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, move_in_date: e.target.value }))
                  if (errors.move_in_date) {
                    setErrors(prev => ({ ...prev, move_in_date: "" }))
                  }
                }}
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.move_in_date ? 'border-red-500' : ''}`}
              />
              {errors.move_in_date && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.move_in_date}
                </p>
              )}
            </div>

            {/* خطة الدفع - في الأعلى */}
            <div className="space-y-2">
              <Label htmlFor="paying_plan" className="text-sm font-medium text-gray-700">خطة الدفع</Label>
              <Select value={formData.paying_plan} onValueChange={(value) => setFormData(prev => ({ ...prev, paying_plan: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
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

            {/* مدة الإيجار - تحت خطة الدفع */}
            <div className="space-y-3">
            
              <Label htmlFor="rental_period" className="text-sm font-medium text-gray-700">
                مدة الإيجار ({formData.paying_plan === 'monthly' ? 'بالشهور' : 
                  formData.paying_plan === 'quarterly' ? 'بالأرباع' :
                  formData.paying_plan === 'semi_annual' ? 'بالنصف سنوي' : 
                  formData.paying_plan === 'annual' ? 'بالسنوات' : 'بالشهور'}) <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="rental_period"
                type="number"
                value={formData.rental_period}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0
                  setFormData(prev => ({ ...prev, rental_period: value }))
                  
                  // التحقق الفوري من القيمة
                  if (value <= 0) {
                    setErrors(prev => ({ ...prev, rental_period: "مدة الإيجار مطلوبة ولا تقل عن شهر واحد" }))
                  } else {
                    setErrors(prev => ({ ...prev, rental_period: "" }))
                  }
                }}
                min="1"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.rental_period ? 'border-red-500' : ''}`}
              />
              {errors.rental_period && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.rental_period}
                </p>
              )}
                      {formData.rental_period && !isNaN(formData.rental_period) && formData.rental_period > 0 && (
              <div className="text-sm bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-gray-800">
                      {formData.rental_period} {formData.paying_plan === 'monthly' ? 'شهر' : 
                        formData.paying_plan === 'quarterly' ? 'ربع' :
                        formData.paying_plan === 'semi_annual' ? 'نصف سنوي' : 
                        formData.paying_plan === 'annual' ? 'سنة' : 'شهر'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      ({formData.paying_plan === 'monthly' ? 'شهري' : 
                        formData.paying_plan === 'quarterly' ? 'ربع سنوي' :
                        formData.paying_plan === 'semi_annual' ? 'نصف سنوي' : 
                        formData.paying_plan === 'annual' ? 'سنوي' : 'شهري'})
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded-md border">
                    <span className="font-medium">
                      {formData.paying_plan === 'monthly' ? formData.rental_period :
                        formData.paying_plan === 'quarterly' ? formData.rental_period * 3 :
                        formData.paying_plan === 'semi_annual' ? formData.rental_period * 6 :
                        formData.paying_plan === 'annual' ? formData.rental_period * 12 : formData.rental_period} شهر إجمالي
                    </span>
                  </div>
                </div>
              </div>
            )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_rent_amount" className="text-sm font-medium text-gray-700">
                مبلغ الإيجار <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="base_rent_amount"
                type="number"
                value={formData.base_rent_amount}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, base_rent_amount: e.target.value }))
                  if (errors.base_rent_amount) {
                    setErrors(prev => ({ ...prev, base_rent_amount: "" }))
                  }
                }}
                placeholder="6500"
                min="100"
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.base_rent_amount ? 'border-red-500' : ''}`}
              />
              {errors.base_rent_amount && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.base_rent_amount}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_amount" className="text-sm font-medium text-gray-700">مبلغ الضمان</Label>
              <Input 
                id="deposit_amount"
                type="number"
                value={formData.deposit_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: e.target.value }))}
                placeholder="10000"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
    
            </div>
    
        </div>

        {/* قسم العمولة والرسوم */}
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-lg text-gray-900 border-b border-gray-200 pb-2">العمولة والرسوم</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="office_commission_type" className="text-sm font-medium text-gray-700">نوع عمولة المكتب</Label>
              <Select value={formData.office_commission_type} onValueChange={(value) => setFormData(prev => ({ ...prev, office_commission_type: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">نسبة مئوية</SelectItem>
                  <SelectItem value="amount">مبلغ ثابت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_commission_value" className="text-sm font-medium text-gray-700">
                قيمة عمولة المكتب {formData.office_commission_type === 'percentage' ? '(%)' : '(ريال)'}
              </Label>
              <Input 
                id="office_commission_value"
                type="number"
                step={formData.office_commission_type === 'percentage' ? '0.1' : '1'}
                value={formData.office_commission_value}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, office_commission_value: e.target.value }))
                  if (errors.office_commission_value) {
                    setErrors(prev => ({ ...prev, office_commission_value: "" }))
                  }
                }}
                placeholder={formData.office_commission_type === 'percentage' ? '5.0' : '500'}
                className={`border-gray-300 focus:border-gray-900 focus:ring-gray-900 ${errors.office_commission_value ? 'border-red-500' : ''}`}
              />
              {errors.office_commission_value && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 ml-1" />
                  {errors.office_commission_value}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform_fee" className="text-sm font-medium text-gray-700">رسوم المنصة (ريال)</Label>
              <Input 
                id="platform_fee"
                type="number"
                step="0.01"
                value={formData.platform_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, platform_fee: e.target.value }))}
                placeholder="150.00"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="water_fee" className="text-sm font-medium text-gray-700">رسوم المياه (ريال)</Label>
              <Input 
                id="water_fee"
                type="number"
                step="0.01"
                value={formData.water_fee}
                onChange={(e) => setFormData(prev => ({ ...prev, water_fee: e.target.value }))}
                placeholder="200.00"
                className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium text-gray-700">ملاحظات</Label>
          <Textarea 
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="ملاحظات إضافية حول العقد..."
            rows={3}
            className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
          />
        </div>

        <DialogFooter className="bg-gray-50 px-6 py-4 -mx-6 -mb-6 rounded-b-lg">
          <div className="flex gap-3 w-full">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              disabled={isSubmitting}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
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
          </div>
        </DialogFooter>
      </form>
    </div>
  )
}
