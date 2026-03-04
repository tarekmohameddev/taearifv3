"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Building2,
  Shield,
  CreditCard,
  Eye,
  EyeOff,
  Save,
  Star,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

// ── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const hoverLift = {
  y: -3,
  boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  transition: { type: "spring" as const, stiffness: 280, damping: 22 },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(userData: Record<string, unknown> | null): string {
  if (!userData) return "US";
  if (typeof userData.initial === "string" && userData.initial)
    return userData.initial;
  const first = typeof userData.first_name === "string" ? userData.first_name : "";
  const last = typeof userData.last_name === "string" ? userData.last_name : "";
  if (first || last) return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
  if (typeof userData.username === "string" && userData.username)
    return userData.username.substring(0, 2).toUpperCase();
  return "US";
}

function accountTypeLabel(type: unknown): string {
  if (type === "tenant") return "مستأجر النظام";
  if (type === "admin") return "مسؤول";
  if (type === "agent") return "وسيط";
  return String(type ?? "مستخدم");
}

// ── Sub-components ───────────────────────────────────────────────────────────

function ProfileHeader() {
  const { userData } = useAuthStore();
  const initials = getInitials(userData as Record<string, unknown> | null);
  const fullName =
    [userData?.first_name, userData?.last_name].filter(Boolean).join(" ") ||
    userData?.username ||
    "مستخدم";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      custom={0}
      whileHover={hoverLift}
    >
      <Card style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
        <CardContent className="p-6">
          <div className="flex items-center gap-5 flex-wrap">
            {/* Avatar */}
            <Avatar
              style={{ width: 72, height: 72, flexShrink: 0 }}
              className="ring-4 ring-[#E8F5EF]"
            >
              <AvatarFallback
                style={{
                  background: "#1A3C34",
                  color: "#FFFFFF",
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2
                style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}
              >
                {fullName}
              </h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 10 }}>
                {userData?.email ?? "—"}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {userData?.account_type && (
                  <Badge
                    variant="outline"
                    style={{ borderColor: "#1A3C34", color: "#1A3C34", fontSize: 11 }}
                  >
                    {accountTypeLabel(userData.account_type)}
                  </Badge>
                )}
                {userData?.company_name && (
                  <Badge
                    variant="secondary"
                    style={{ fontSize: 11, color: "#6B7280" }}
                  >
                    <Building2 size={11} className="ml-1" />
                    {userData.company_name}
                  </Badge>
                )}
                {userData?.is_free_plan !== null &&
                  userData?.is_free_plan !== undefined && (
                    <Badge
                      style={{
                        background: userData.is_free_plan ? "#F3F4F6" : "#FEF3C7",
                        color: userData.is_free_plan ? "#6B7280" : "#92400E",
                        border: "none",
                        fontSize: 11,
                      }}
                    >
                      {!userData.is_free_plan && (
                        <Star size={11} className="ml-1 fill-current" />
                      )}
                      {userData.is_free_plan
                        ? "الباقة المجانية"
                        : userData.package_title ?? "باقة مدفوعة"}
                    </Badge>
                  )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Personal Info Tab ────────────────────────────────────────────────────────

function PersonalInfoTab() {
  const { userData, fetchUserFromAPI } = useAuthStore();

  const [form, setForm] = useState({
    first_name: userData?.first_name ?? "",
    last_name: userData?.last_name ?? "",
    username: userData?.username ?? "",
    email: userData?.email ?? "",
    company_name: userData?.company_name ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put("/user", {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        company_name: form.company_name,
      });
      await fetchUserFromAPI();
      toast.success("تم حفظ المعلومات الشخصية بنجاح");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("حدث خطأ أثناء حفظ المعلومات، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSaving(false);
    }
  };

  const fields = [
    { id: "first_name", label: "الاسم الأول", icon: User, type: "text" },
    { id: "last_name", label: "الاسم الأخير", icon: User, type: "text" },
    { id: "username", label: "اسم المستخدم", icon: User, type: "text" },
    { id: "email", label: "البريد الإلكتروني", icon: Mail, type: "email", readOnly: true },
    { id: "company_name", label: "اسم الشركة", icon: Building2, type: "text" },
  ] as const;

  return (
    <Card style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
      <CardHeader style={{ paddingBottom: 0 }}>
        <CardTitle style={{ fontSize: 15, color: "#1A1A1A" }}>
          المعلومات الشخصية
        </CardTitle>
        <CardDescription style={{ fontSize: 12, color: "#6B7280" }}>
          يمكنك تعديل معلوماتك الشخصية وحفظها
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {fields.map(({ id, label, icon: Icon, type, readOnly }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <Label
                htmlFor={id}
                style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
              >
                {label}
              </Label>
              <div className="relative">
                <Icon
                  size={14}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9CA3AF] pointer-events-none"
                />
                <Input
                  id={id}
                  type={type}
                  value={form[id as keyof typeof form]}
                  onChange={(e) =>
                    !readOnly && handleChange(id, e.target.value)
                  }
                  readOnly={readOnly}
                  dir="rtl"
                  style={{
                    paddingRight: 34,
                    fontSize: 13,
                    background: readOnly ? "#F9FAFB" : "#FFFFFF",
                    color: readOnly ? "#9CA3AF" : "#1A1A1A",
                    borderColor: "#E5E7EB",
                  }}
                  placeholder={readOnly ? "—" : `أدخل ${label}`}
                />
              </div>
              {readOnly && (
                <p style={{ fontSize: 11, color: "#9CA3AF" }}>
                  لا يمكن تغيير البريد الإلكتروني
                </p>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-5" />

        <div className="flex justify-start">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: "#1A3C34", color: "#FFFFFF" }}
            className="gap-2 hover:opacity-90 transition-opacity active:scale-95"
          >
            <Save size={14} />
            {isSaving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Security Tab ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleShow = (field: "current" | "new" | "confirm") =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    if (!form.current_password || !form.new_password || !form.confirm_password) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    if (form.new_password !== form.confirm_password) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }
    if (form.new_password.length < 8) {
      toast.error("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post("/user/change-password", {
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirmation: form.confirm_password,
      });
      toast.success("تم تغيير كلمة المرور بنجاح");
      setForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("حدث خطأ أثناء تغيير كلمة المرور، تحقق من كلمة المرور الحالية");
    } finally {
      setIsSaving(false);
    }
  };

  const passwordFields = [
    {
      id: "current_password",
      label: "كلمة المرور الحالية",
      showKey: "current" as const,
    },
    {
      id: "new_password",
      label: "كلمة المرور الجديدة",
      showKey: "new" as const,
    },
    {
      id: "confirm_password",
      label: "تأكيد كلمة المرور الجديدة",
      showKey: "confirm" as const,
    },
  ];

  return (
    <Card style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
      <CardHeader style={{ paddingBottom: 0 }}>
        <CardTitle style={{ fontSize: 15, color: "#1A1A1A" }}>
          الأمان وكلمة المرور
        </CardTitle>
        <CardDescription style={{ fontSize: 12, color: "#6B7280" }}>
          لحماية حسابك، استخدم كلمة مرور قوية تتكون من 8 أحرف على الأقل
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-5">
        <div className="flex flex-col gap-5 max-w-md">
          {passwordFields.map(({ id, label, showKey }) => (
            <div key={id} className="flex flex-col gap-1.5">
              <Label
                htmlFor={id}
                style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
              >
                {label}
              </Label>
              <div className="relative">
                <Shield
                  size={14}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-[#9CA3AF] pointer-events-none"
                />
                <Input
                  id={id}
                  type={show[showKey] ? "text" : "password"}
                  value={form[id as keyof typeof form]}
                  onChange={(e) => handleChange(id, e.target.value)}
                  dir="ltr"
                  style={{
                    paddingRight: 34,
                    paddingLeft: 36,
                    fontSize: 13,
                    borderColor: "#E5E7EB",
                    letterSpacing: form[id as keyof typeof form] ? 2 : 0,
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => toggleShow(showKey)}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  aria-label={show[showKey] ? "إخفاء" : "إظهار"}
                >
                  {show[showKey] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-5" />

        <div className="flex justify-start">
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            style={{ background: "#1A3C34", color: "#FFFFFF" }}
            className="gap-2 hover:opacity-90 transition-opacity active:scale-95"
          >
            <Shield size={14} />
            {isSaving ? "جارٍ الحفظ…" : "تغيير كلمة المرور"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Subscription Tab ──────────────────────────────────────────────────────────

function SubscriptionTab() {
  const { userData } = useAuthStore();

  const isExpired = userData?.is_expired;
  const isFree = userData?.is_free_plan;
  const daysRemaining = userData?.days_remaining;
  const planTitle = userData?.package_title;
  const features: string[] = Array.isArray(userData?.package_features)
    ? (userData.package_features as string[])
    : [];

  const statusColor = isExpired ? "#DC2626" : isFree ? "#6B7280" : "#1A3C34";
  const statusBg = isExpired ? "#FEF2F2" : isFree ? "#F3F4F6" : "#E8F5EF";
  const StatusIcon = isExpired ? AlertCircle : isFree ? Clock : CheckCircle2;
  const statusLabel = isExpired
    ? "الاشتراك منتهٍ"
    : isFree
    ? "الباقة المجانية"
    : "اشتراك نشط";

  return (
    <div className="flex flex-col gap-4">
      {/* Status card */}
      <Card style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}>
        <CardHeader style={{ paddingBottom: 0 }}>
          <CardTitle style={{ fontSize: 15, color: "#1A1A1A" }}>
            تفاصيل الاشتراك
          </CardTitle>
          <CardDescription style={{ fontSize: 12, color: "#6B7280" }}>
            مراجعة باقتك الحالية وتفاصيل الخطة
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-5">
          {/* Status banner */}
          <div
            className="flex items-center gap-3 rounded-xl p-4 mb-5"
            style={{ background: statusBg }}
          >
            <StatusIcon size={20} style={{ color: statusColor, flexShrink: 0 }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>
                {statusLabel}
              </p>
              {!isExpired && !isFree && daysRemaining !== null && (
                <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                  متبقٍ{" "}
                  <strong style={{ color: "#1A1A1A" }}>{daysRemaining}</strong>{" "}
                  يوم على تجديد الاشتراك
                </p>
              )}
            </div>
            {!isFree && planTitle && (
              <Badge
                style={{
                  background: "#FEF3C7",
                  color: "#92400E",
                  border: "none",
                  flexShrink: 0,
                }}
              >
                <Star size={11} className="ml-1 fill-current" />
                {planTitle}
              </Badge>
            )}
          </div>

          {/* Plan details grid */}
          <div
            className="grid gap-4 sm:grid-cols-3 mb-5"
            style={{ borderTop: "1px solid #F3F4F6", paddingTop: 16 }}
          >
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
                اسم الباقة
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                {isFree ? "المجانية" : planTitle ?? "—"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
                الأيام المتبقية
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                {isFree ? "غير محدود" : daysRemaining !== null ? `${daysRemaining} يوم` : "—"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 2 }}>
                حالة الاشتراك
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>
                {statusLabel}
              </p>
            </div>
          </div>

          {/* Features list */}
          {features.length > 0 && (
            <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 10,
                }}
              >
                مميزات الباقة
              </p>
              <ul className="flex flex-col gap-2">
                {features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2"
                    style={{ fontSize: 12, color: "#6B7280" }}
                  >
                    <CheckCircle2 size={13} style={{ color: "#1A3C34", flexShrink: 0 }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      <Card
        style={{
          background: "#1A3C34",
          border: "none",
          overflow: "hidden",
        }}
      >
        <CardContent className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", marginBottom: 4 }}>
              {isFree || isExpired ? "ترقية الباقة" : "إدارة الاشتراك"}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {isFree || isExpired
                ? "استكشف الباقات المدفوعة للوصول لكامل الميزات"
                : "إدارة الفواتير وتفاصيل الدفع الخاصة بك"}
            </p>
          </div>
          <Link href="/dashboard/settings?tab=billing">
            <Button
              style={{
                background: "#FFFFFF",
                color: "#1A3C34",
                fontWeight: 600,
                fontSize: 13,
              }}
              className="gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <CreditCard size={14} />
              {isFree || isExpired ? "استعرض الباقات" : "إدارة الفواتير"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export function ProfilePage() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100%",
        background: "#F4F5F7",
        padding: 24,
        fontFamily: "Inter, Poppins, DM Sans, system-ui, sans-serif",
      }}
    >
      {/* Page header */}
      <motion.div
        className="mb-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>
          الملف الشخصي
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          إدارة معلوماتك الشخصية وإعدادات الحساب
        </p>
      </motion.div>

      {/* Profile header card */}
      <div className="mb-6">
        <ProfileHeader />
      </div>

      {/* Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0.12}
      >
        <Tabs defaultValue="personal" dir="rtl">
          <TabsList
            className="mb-5"
            style={{ background: "#FFFFFF", border: "1px solid #E5E7EB" }}
          >
            <TabsTrigger value="personal" className="gap-1.5 text-xs sm:text-sm">
              <User size={14} />
              المعلومات الشخصية
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
              <Shield size={14} />
              الأمان
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-1.5 text-xs sm:text-sm">
              <CreditCard size={14} />
              الاشتراك
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.05}>
              <PersonalInfoTab />
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.05}>
              <SecurityTab />
            </motion.div>
          </TabsContent>

          <TabsContent value="subscription">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.05}>
              <SubscriptionTab />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
