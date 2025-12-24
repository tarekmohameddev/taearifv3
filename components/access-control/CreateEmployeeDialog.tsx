"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  UserPlus,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Key,
} from "lucide-react";

// Types
interface Permission {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  guard_name: string;
  team_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_id: number;
    permission_id: number;
    model_type: string;
    team_id: number;
  };
}

interface PermissionsResponse {
  status: string;
  data: Permission[];
  grouped: {
    [key: string]: Permission[];
  };
  templates: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateEmployeeRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateEmployeeRequest>>;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isGroupFullySelected: (groupName: string) => boolean;
  isGroupPartiallySelected: (groupName: string) => boolean;
  permissions: PermissionsResponse | null;
  permissionsLoading: boolean;
  translatePermission: (permissionName: string) => string;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  onCreateEmployee: () => void;
}

export function CreateEmployeeDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isGroupFullySelected,
  isGroupPartiallySelected,
  permissions,
  permissionsLoading,
  translatePermission,
  createLoading,
  createError,
  createSuccess,
  onCreateEmployee,
}: CreateEmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800 text-white">
          <UserPlus className="h-4 w-4 ml-2" />
          إضافة موظف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white mx-2 sm:mx-0">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl font-bold text-black">
            <div className="p-1.5 sm:p-2 bg-black rounded-lg">
              <UserPlus className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <span className="text-sm sm:text-base">إضافة موظف جديد</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-sm sm:text-base text-right">
            قم بإنشاء حساب جديد للموظف وتخصيص الصلاحيات المناسبة
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-2 sm:pr-4">
          <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
            {/* Success Message */}
            {createSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  تم إنشاء الموظف بنجاح!
                </span>
              </div>
            )}

            {/* Error Message */}
            {createError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{createError}</span>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black">
                  المعلومات الأساسية
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="first_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأول *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأول"
                    className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="last_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأخير *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأخير"
                    className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="example@company.com"
                    className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+966501234567"
                    className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    كلمة المرور *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="كلمة مرور قوية"
                    className="border-gray-300 focus:border-black focus:ring-black text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="active"
                    className="text-sm font-medium text-gray-700"
                  >
                    حالة الحساب
                  </Label>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-300 rounded-lg">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          active: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-black"
                    />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {formData.active ? "نشط" : "غير نشط"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6 sm:my-8" />

            {/* Permissions Section */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black">
                  الصلاحيات
                </h3>
              </div>

              {permissionsLoading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="flex flex-col items-center gap-2 sm:gap-3">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-gray-400" />
                    <span className="text-sm sm:text-base text-gray-600 font-medium">
                      جاري تحميل الصلاحيات...
                    </span>
                    <div className="w-24 sm:w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-black animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
              ) : permissions && Object.keys(permissions.grouped).length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {Object.entries(permissions.grouped).map(
                    ([groupName, groupPermissions]) => (
                      <div
                        key={groupName}
                        className="space-y-2 sm:space-y-3 border border-gray-200 rounded-lg p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 pb-2 border-b border-gray-200">
                          <Checkbox
                            id={`create-group-${groupName}`}
                            checked={isGroupFullySelected(groupName)}
                            onCheckedChange={(checked) =>
                              handleGroupPermissionChange(
                                groupName,
                                checked as boolean,
                              )
                            }
                            className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                          />
                          <Label
                            htmlFor={`create-group-${groupName}`}
                            className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer flex-1 capitalize"
                          >
                            {groupName.replace(/\./g, " ")}
                          </Label>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ({groupPermissions.length} صلاحية)
                          </span>
                        </div>
                        <div className="space-y-2 pr-4 sm:pr-6">
                          {Array.isArray(groupPermissions) &&
                            groupPermissions.map((permission, index) => (
                              <div
                                key={permission.id || index}
                                className="flex items-center gap-2 sm:gap-3"
                              >
                                <Checkbox
                                  id={`create-permission-${groupName}-${permission.id || index}`}
                                  checked={
                                    selectedPermissions[permission.name] ||
                                    false
                                  }
                                  onCheckedChange={(checked) =>
                                    handlePermissionChange(
                                      permission.name,
                                      checked as boolean,
                                    )
                                  }
                                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                                />
                                <Label
                                  htmlFor={`create-permission-${groupName}-${permission.id || index}`}
                                  className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1"
                                >
                                  {translatePermission(permission.name)}
                                  {permission.description && (
                                    <span className="block text-xs text-gray-500 mt-0.5">
                                      {permission.description}
                                    </span>
                                  )}
                                </Label>
                              </div>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Key className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-600">
                    لا توجد صلاحيات متاحة
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-6 sm:my-8" />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base w-full sm:w-auto"
            >
              إلغاء
            </Button>
            <Button
              onClick={onCreateEmployee}
              disabled={
                createLoading ||
                !formData.first_name ||
                !formData.last_name ||
                !formData.email ||
                !formData.phone ||
                !formData.password
              }
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400 text-sm sm:text-base w-full sm:w-auto"
            >
              {createLoading ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 animate-spin" />
                  <span className="text-xs sm:text-sm">جاري الإنشاء...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  <span className="text-xs sm:text-sm">إنشاء الموظف</span>
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

