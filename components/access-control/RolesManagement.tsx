"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Plus,
  Eye,
  Edit,
  XCircle,
  Loader2,
  Search,
  Lock,
} from "lucide-react";

interface RolesManagementProps {
  rolesTabLoading: boolean;
  rolesTabError: string | null;
  rolesTabData: any[];
  rolesSearchQuery: string;
  setRolesSearchQuery: (query: string) => void;
  filteredRoles: any[];
  setShowCreateRoleDialog: (show: boolean) => void;
  setCreateRoleError: (error: string | null) => void;
  setCreateRoleSuccess: (success: boolean) => void;
  handleViewRole: (role: any) => void;
  handleEditRole: (role: any) => void;
  handleDeleteRole: (role: any) => void;
  fetchRolesForTab: () => void;
  translatePermission: (permission: string) => string;
}

export function RolesManagement({
  rolesTabLoading,
  rolesTabError,
  rolesTabData,
  rolesSearchQuery,
  setRolesSearchQuery,
  filteredRoles,
  setShowCreateRoleDialog,
  setCreateRoleError,
  setCreateRoleSuccess,
  handleViewRole,
  handleEditRole,
  handleDeleteRole,
  fetchRolesForTab,
  translatePermission,
}: RolesManagementProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إدارة الأدوار
            </CardTitle>
            <CardDescription>
              عرض وإدارة جميع الأدوار المتاحة في النظام مع صلاحياتها
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setShowCreateRoleDialog(true);
              setCreateRoleError(null);
              setCreateRoleSuccess(false);
            }}
            className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 ml-2" />
            إنشاء دور
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rolesTabLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="text-gray-600 font-medium">
                جاري تحميل الأدوار...
              </span>
              <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        ) : rolesTabError ? (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{rolesTabError}</p>
            <Button onClick={fetchRolesForTab} variant="outline">
              إعادة المحاولة
            </Button>
          </div>
        ) : rolesTabData.length > 0 ? (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الأدوار والصلاحيات..."
                value={rolesSearchQuery}
                onChange={(e) => setRolesSearchQuery(e.target.value)}
                className="pr-10 border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            {/* Roles List */}
            <div className="space-y-6">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 sm:px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-black rounded-lg">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black capitalize">
                            {role.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {role.permissions_list?.length || 0} صلاحية
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-gray-600">
                            ID: {role.id}
                          </Badge>
                          <Badge variant="secondary" className="text-gray-600">
                            {role.permissions_list?.length || 0} صلاحية
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRole(role)}
                            className="text-gray-600 hover:text-black hover:border-black"
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            <span className="hidden sm:inline">
                              عرض التفاصيل
                            </span>
                            <span className="sm:hidden">عرض</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="text-gray-600 hover:text-black hover:border-black"
                          >
                            <Edit className="h-4 w-4 ml-2" />
                            <span className="hidden sm:inline">تعديل</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRole(role)}
                            className="text-red-600 hover:text-red-800 hover:border-red-800"
                          >
                            <XCircle className="h-4 w-4 ml-2" />
                            <span className="hidden sm:inline">حذف</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {role.permissions_list?.map(
                        (permission: string, index: number) => (
                          <div
                            key={index}
                            className="group border border-gray-200 rounded-lg p-3 hover:border-black hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-colors flex-shrink-0">
                                <Lock className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-black transition-colors truncate">
                                  {translatePermission(permission)}
                                </h4>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {(!role.permissions_list ||
                      role.permissions_list.length === 0) && (
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          لا توجد صلاحيات لهذا الدور
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredRoles.length === 0 && rolesSearchQuery && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-600">
                  لم يتم العثور على أدوار تطابق البحث: "{rolesSearchQuery}"
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              لا توجد أدوار
            </h3>
            <p className="text-gray-600">لا توجد أدوار متاحة في النظام</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

