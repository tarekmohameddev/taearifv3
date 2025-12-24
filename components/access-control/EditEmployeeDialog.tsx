"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Edit,
  Users,
  Key,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getPermissionGroupAr } from "@/lib/permissionGroupsTranslation";

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

interface UpdateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password?: string;
  active: boolean;
  role_ids: number[];
  permissions: string[];
}

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editFormData: UpdateEmployeeRequest;
  setEditFormData: React.Dispatch<React.SetStateAction<UpdateEmployeeRequest>>;
  selectedPermissions: { [key: string]: boolean };
  handlePermissionChange: (permissionName: string, checked: boolean) => void;
  handleGroupPermissionChange: (groupName: string, checked: boolean) => void;
  isGroupFullySelected: (groupName: string) => boolean;
  isGroupPartiallySelected: (groupName: string) => boolean;
  permissions: PermissionsResponse | null;
  permissionsLoading: boolean;
  editLoading: boolean;
  editError: string | null;
  editSuccess: boolean;
  onUpdateEmployee: () => void;
}

export function EditEmployeeDialog({
  open,
  onOpenChange,
  editFormData,
  setEditFormData,
  selectedPermissions,
  handlePermissionChange,
  handleGroupPermissionChange,
  isGroupFullySelected,
  isGroupPartiallySelected,
  permissions,
  permissionsLoading,
  editLoading,
  editError,
  editSuccess,
  onUpdateEmployee,
}: EditEmployeeDialogProps) {
  const [isPermissionsExpanded, setIsPermissionsExpanded] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-black">
            <div className="p-2 bg-black rounded-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            تعديل بيانات الموظف
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            قم بتعديل معلومات الموظف والصلاحيات المخصصة له
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-8 py-6">
            {/* Success Message */}
            {editSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  تم تحديث الموظف بنجاح!
                </span>
              </div>
            )}

            {/* Error Message */}
            {editError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{editError}</span>
              </div>
            )}

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-black">
                  المعلومات الأساسية
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit_first_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأول *
                  </Label>
                  <Input
                    id="edit_first_name"
                    value={editFormData.first_name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        first_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأول"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_last_name"
                    className="text-sm font-medium text-gray-700"
                  >
                    الاسم الأخير *
                  </Label>
                  <Input
                    id="edit_last_name"
                    value={editFormData.last_name}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        last_name: e.target.value,
                      }))
                    }
                    placeholder="أدخل الاسم الأخير"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_email"
                    className="text-sm font-medium text-gray-700"
                  >
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="example@company.com"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_phone"
                    className="text-sm font-medium text-gray-700"
                  >
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="edit_phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+966501234567"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_password"
                    className="text-sm font-medium text-gray-700"
                  >
                    كلمة المرور الجديدة (اختياري)
                  </Label>
                  <Input
                    id="edit_password"
                    type="password"
                    value={editFormData.password || ""}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="edit_active"
                    className="text-sm font-medium text-gray-700"
                  >
                    حالة الحساب
                  </Label>
                  <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg">
                    <Switch
                      id="edit_active"
                      checked={editFormData.active}
                      onCheckedChange={(checked) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          active: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-black"
                    />
                    <span className="text-sm text-gray-600">
                      {editFormData.active ? "نشط" : "غير نشط"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Permissions Section */}
            <div className="space-y-4 sm:space-y-6">
              <div
                onClick={() => setIsPermissionsExpanded(!isPermissionsExpanded)}
                className="flex items-center gap-2 sm:gap-3 pb-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsPermissionsExpanded(!isPermissionsExpanded);
                  }
                }}
                aria-label={isPermissionsExpanded ? "طي الصلاحيات" : "فتح الصلاحيات"}
                aria-expanded={isPermissionsExpanded}
              >
                <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-black flex-1">
                  الصلاحيات
                </h3>
                {isPermissionsExpanded ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                )}
              </div>

              {isPermissionsExpanded && (
                <>
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
                            id={`edit-group-${groupName}`}
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
                            htmlFor={`edit-group-${groupName}`}
                            className="text-sm sm:text-base font-semibold text-gray-900 cursor-pointer flex-1"
                          >
                            {getPermissionGroupAr(groupName)}
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
                                  id={`edit-permission-${groupName}-${permission.id || index}`}
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
                                  htmlFor={`edit-permission-${groupName}-${permission.id || index}`}
                                  className="text-xs sm:text-sm text-gray-700 cursor-pointer flex-1"
                                >
                                  {permission.name_ar ||
                                    permission.name_en ||
                                    permission.name}
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
                </>
              )}
            </div>

            <Separator className="my-8" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              إلغاء
            </Button>
            <Button
              onClick={onUpdateEmployee}
              disabled={
                editLoading ||
                !editFormData.first_name ||
                !editFormData.last_name ||
                !editFormData.email ||
                !editFormData.phone
              }
              className="bg-black hover:bg-gray-800 text-white disabled:bg-gray-400"
            >
              {editLoading ? (
                <>
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

