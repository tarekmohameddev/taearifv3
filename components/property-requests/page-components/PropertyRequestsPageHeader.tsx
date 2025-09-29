
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Move, Settings, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useAuthStore from "@/context/AuthContext";

interface FieldSetting {
  is_visible: boolean;
  is_required: boolean;
  label_ar?: string | null;
  label_en?: string | null;
  sort_order?: number | null;
  meta?: any[];
}

interface PropertyRequestSettings {
  [key: string]: FieldSetting;
}

interface PropertyRequestSettingsResponse {
  status: string;
  data: {
    tenant_id: number;
    allowed_keys: string[];
    settings: PropertyRequestSettings;
  };
}

export const PropertyRequestsPageHeader = () => {
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [settings, setSettings] = useState<PropertyRequestSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allowedKeys, setAllowedKeys] = useState<string[]>([]);
  const { userData } = useAuthStore();

  // Field labels in Arabic
  const fieldLabels: { [key: string]: string } = {
    category_id: "نوع العقار",
    property_type: "نوع الملكية",
    city_id: "المدينة",
    districts_id: "الحي",
    area_from: "المساحة من",
    area_to: "المساحة إلى",
    purchase_method: "طريقة الشراء",
    budget_from: "الميزانية من",
    budget_to: "الميزانية إلى",
    seriousness: "الجدية",
    purchase_goal: "هدف الشراء",
    wants_similar_offers: "يريد عروض مشابهة",
    full_name: "الاسم الكامل",
    phone: "رقم الهاتف",
    contact_on_whatsapp: "التواصل عبر واتساب",
    notes: "ملاحظات"
  };

  // Fetch settings when dialog opens
  useEffect(() => {
    if (showSettingsDialog && userData?.token) {
      fetchSettings();
    }
  }, [showSettingsDialog, userData?.token]);

  const fetchSettings = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchSettings");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get("/v1/property-request-settings?merged=true");
      if (response.data.status === "success") {
        setSettings(response.data.data.settings);
        setAllowedKeys(response.data.data.allowed_keys);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("حدث خطأ أثناء تحميل الإعدادات");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (fieldKey: string, setting: 'is_visible' | 'is_required', value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping handleSaveSettings");
      return;
    }

    setSaving(true);
    try {
      const items = allowedKeys.map(key => ({
        field_key: key,
        is_visible: settings[key]?.is_visible ?? true,
        is_required: settings[key]?.is_required ?? false,
        label_ar: settings[key]?.label_ar || fieldLabels[key],
        sort_order: settings[key]?.sort_order || 10
      }));

      await axiosInstance.post("/v1/property-request-settings/bulk", { items });
      toast.success("تم حفظ الإعدادات بنجاح");
      setShowSettingsDialog(false);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إعدادات طلبات العقارات</h1>
        <p className="text-muted-foreground">
          إدارة الحقول المرئية والمطلوبة في نموذج طلب العقار
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Dialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
        >
          <DialogTrigger asChild>
            <Button>
              <Settings className="ml-2 h-4 w-4" />
              إعدادات صفحة طلبات العقارات
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إعدادات نموذج طلب العقار</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="mr-2 text-sm text-muted-foreground">جاري تحميل الإعدادات...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allowedKeys.map((fieldKey) => (
                      <div key={fieldKey} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            {fieldLabels[fieldKey] || fieldKey}
                          </Label>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`visible-${fieldKey}`} className="text-xs">
                              مرئي
                            </Label>
                            <Switch
                              id={`visible-${fieldKey}`}
                              checked={settings[fieldKey]?.is_visible ?? true}
                              onCheckedChange={(checked) => 
                                handleSettingChange(fieldKey, 'is_visible', checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`required-${fieldKey}`} className="text-xs">
                              مطلوب
                            </Label>
                            <Switch
                              id={`required-${fieldKey}`}
                              checked={settings[fieldKey]?.is_required ?? false}
                              onCheckedChange={(checked) => 
                                handleSettingChange(fieldKey, 'is_required', checked)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowSettingsDialog(false)}
                  disabled={saving}
                >
                  إلغاء
                </Button>
                <Button onClick={handleSaveSettings} disabled={saving || loading}>
                  {saving ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="ml-2 h-4 w-4" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}; 