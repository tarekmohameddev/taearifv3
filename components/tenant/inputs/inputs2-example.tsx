"use client";

import React from "react";
import Inputs2 from "./inputs2";
import {
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CreditCard,
  Plus,
  Building,
  User,
  Phone,
  Mail,
} from "lucide-react";

const Inputs2Example: React.FC = () => {
  // Example data for the inputs component
  const cardsData = [
    {
      id: "expenses",
      title: "إدارة المصاريف",
      description: "تتبع وإدارة جميع المصاريف الشهرية",
      icon: <DollarSign size={24} />,
      color: "blue",
      customColors: {
        primary: "#3b82f6",
        secondary: "#2563eb",
        hover: "#1d4ed8",
        shadow: "rgba(59, 130, 246, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "expense_type",
          type: "select" as const,
          label: "نوع المصروف",
          required: true,
          options: [
            { value: "rent", label: "إيجار" },
            { value: "utilities", label: "مرافق" },
            { value: "maintenance", label: "صيانة" },
            { value: "other", label: "أخرى" },
          ],
          icon: <Tag size={20} />,
        },
        {
          id: "expense_amount",
          type: "currency" as const,
          label: "المبلغ",
          placeholder: "أدخل المبلغ",
          required: true,
          validation: {
            min: 0,
            message: "المبلغ يجب أن يكون أكبر من صفر",
          },
          icon: <DollarSign size={20} />,
        },
        {
          id: "expense_date",
          type: "date" as const,
          label: "تاريخ المصروف",
          required: true,
          icon: <Calendar size={20} />,
        },
        {
          id: "expense_description",
          type: "textarea" as const,
          label: "وصف المصروف",
          placeholder: "أدخل وصف مفصل للمصروف",
          icon: <FileText size={20} />,
        },
      ],
      showAddButton: true,
      addButtonText: "إضافة مصروف جديد",
      onAddNew: () => {
        console.log("إضافة مصروف جديد");
      },
      onSave: (data: any) => {
        console.log("حفظ بيانات المصاريف:", data);
      },
    },
    {
      id: "property_info",
      title: "معلومات العقار",
      description: "البيانات الأساسية للعقار",
      icon: <Building size={24} />,
      color: "indigo",
      customColors: {
        primary: "#6366f1",
        secondary: "#4f46e5",
        hover: "#4338ca",
        shadow: "rgba(99, 102, 241, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "property_name",
          type: "text" as const,
          label: "اسم العقار",
          placeholder: "أدخل اسم العقار",
          required: true,
          icon: <Building size={20} />,
        },
        {
          id: "property_address",
          type: "textarea" as const,
          label: "عنوان العقار",
          placeholder: "أدخل العنوان الكامل",
          required: true,
        },
        {
          id: "property_type",
          type: "select" as const,
          label: "نوع العقار",
          required: true,
          options: [
            { value: "apartment", label: "شقة" },
            { value: "villa", label: "فيلا" },
            { value: "office", label: "مكتب" },
            { value: "shop", label: "محل" },
          ],
        },
        {
          id: "property_size",
          type: "number" as const,
          label: "المساحة (م²)",
          placeholder: "أدخل المساحة",
          required: true,
          validation: {
            min: 1,
            message: "المساحة يجب أن تكون أكبر من صفر",
          },
        },
        {
          id: "property_price",
          type: "currency" as const,
          label: "سعر العقار",
          placeholder: "أدخل السعر",
          required: true,
          validation: {
            min: 0,
            message: "السعر يجب أن يكون أكبر من صفر",
          },
          icon: <DollarSign size={20} />,
        },
      ],
      onSave: (data: any) => {
        console.log("حفظ بيانات العقار:", data);
      },
    },
    {
      id: "contact_info",
      title: "معلومات الاتصال",
      description: "بيانات التواصل مع المالك أو المستأجر",
      icon: <User size={24} />,
      color: "purple",
      customColors: {
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        hover: "#6d28d9",
        shadow: "rgba(139, 92, 246, 0.15)",
      },
      isCollapsible: false,
      fields: [
        {
          id: "contact_name",
          type: "text" as const,
          label: "الاسم",
          placeholder: "أدخل الاسم الكامل",
          required: true,
          icon: <User size={20} />,
        },
        {
          id: "contact_phone",
          type: "text" as const,
          label: "رقم الهاتف",
          placeholder: "أدخل رقم الهاتف",
          required: true,
          validation: {
            pattern: "^[0-9+\\-\\s()]+$",
            message: "رقم الهاتف غير صحيح",
          },
          icon: <Phone size={20} />,
        },
        {
          id: "contact_email",
          type: "email" as const,
          label: "البريد الإلكتروني",
          placeholder: "أدخل البريد الإلكتروني",
          required: true,
          icon: <Mail size={20} />,
        },
        {
          id: "contact_password",
          type: "password" as const,
          label: "كلمة المرور",
          placeholder: "أدخل كلمة المرور",
          required: true,
          validation: {
            min: 6,
            message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
          },
        },
      ],
      onSave: (data: any) => {
        console.log("حفظ بيانات الاتصال:", data);
      },
    },
    {
      id: "payment_method",
      title: "طريقة الدفع",
      description: "اختر طريقة الدفع المفضلة",
      icon: <CreditCard size={24} />,
      color: "pink",
      customColors: {
        primary: "#ec4899",
        secondary: "#db2777",
        hover: "#be185d",
        shadow: "rgba(236, 72, 153, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "payment_type",
          type: "select" as const,
          label: "نوع الدفع",
          required: true,
          options: [
            { value: "cash", label: "نقداً" },
            { value: "bank_transfer", label: "تحويل بنكي" },
            { value: "credit_card", label: "بطاقة ائتمان" },
            { value: "check", label: "شيك" },
          ],
          icon: <CreditCard size={20} />,
        },
        {
          id: "payment_notes",
          type: "textarea" as const,
          label: "ملاحظات الدفع",
          placeholder: "أدخل أي ملاحظات إضافية",
          description: "هذا الحقل اختياري",
        },
      ],
    },
    {
      id: "additional_info",
      title: "معلومات إضافية",
      description: "بيانات إضافية ومهمة للعقار",
      icon: <FileText size={24} />,
      color: "emerald",
      customColors: {
        primary: "#10b981",
        secondary: "#059669",
        hover: "#047857",
        shadow: "rgba(16, 185, 129, 0.15)",
      },
      isCollapsible: true,
      fields: [
        {
          id: "notes",
          type: "textarea" as const,
          label: "ملاحظات إضافية",
          placeholder: "أدخل أي ملاحظات إضافية",
          description: "هذا الحقل اختياري",
        },
        {
          id: "priority",
          type: "select" as const,
          label: "الأولوية",
          required: true,
          options: [
            { value: "high", label: "عالية" },
            { value: "medium", label: "متوسطة" },
            { value: "low", label: "منخفضة" },
          ],
        },
      ],
      onSave: (data: any) => {
        console.log("حفظ المعلومات الإضافية:", data);
      },
    },
  ];

  const handleSubmit = (data: any) => {
    console.log("تم إرسال البيانات:", data);
    alert("تم حفظ البيانات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            نظام إدارة العقارات المتقدم - النسخة الثانية
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            نظام شامل لإدارة العقارات والمصاريف والبيانات مع ألوان ديناميكية
            مذهلة - النسخة المحسنة
          </p>
        </div>

        <Inputs2
          useStore={false}
          variant="inputs2"
          id="example"
          apiEndpoint="/api/submit-form"
        />
      </div>
    </div>
  );
};

export default Inputs2Example;
