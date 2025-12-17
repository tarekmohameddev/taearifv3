"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  MessageSquare,
  Bell,
  ArrowRight,
  User,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Award,
  Shield,
  Handshake,
} from "lucide-react";
import type { Customer, PipelineStage } from "@/types/crm";

interface MobileCustomersViewProps {
  pipelineStages: PipelineStage[];
  customersData: Customer[];
  filteredCustomers: Customer[];
  onViewDetails: (customer: Customer) => void;
  onAddNote: (customer: Customer) => void;
  onAddReminder: (customer: Customer) => void;
  onAddInteraction: (customer: Customer) => void;
  onUpdateCustomerStage: (
    customerId: string,
    stageId: string,
  ) => Promise<boolean>;
}

const getStageIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Target: Target,
    Users: Users,
    Phone: Phone,
    Calendar: Calendar,
    Check: CheckCircle,
    Clock: Clock,
    Star: Star,
    Award: Award,
    User: User,
    Shield: Shield,
    Handshake: Handshake,
    TrendingUp: TrendingUp,
  };
  return iconMap[iconName] || Target;
};

const getPropertyTypeColor = (propertyType: string | null | undefined) => {
  if (!propertyType) {
    return "bg-gray-100 text-gray-800";
  }
  const type = propertyType.toLowerCase();
  if (type.includes("شقة") || type.includes("apartment")) {
    return "bg-blue-100 text-blue-800";
  }
  if (type.includes("فيلا") || type.includes("villa")) {
    return "bg-purple-100 text-purple-800";
  }
  if (type.includes("أرض") || type.includes("land")) {
    return "bg-green-100 text-green-800";
  }
  if (type.includes("محل") || type.includes("shop") || type.includes("store")) {
    return "bg-orange-100 text-orange-800";
  }
  if (type.includes("مكتب") || type.includes("office")) {
    return "bg-indigo-100 text-indigo-800";
  }
  return "bg-gray-100 text-gray-800";
};

const getPropertyTypeLabel = (customer: Customer): string => {
  // Try property_basic.type first
  if (customer.property_basic?.type) {
    return customer.property_basic.type;
  }
  // Try property_specifications.basic_information.property_type
  if (customer.property_specifications?.basic_information?.property_type) {
    return customer.property_specifications.basic_information.property_type;
  }
  // Return default if no property type found
  return "غير محدد";
};

export default function MobileCustomersView({
  pipelineStages,
  customersData,
  filteredCustomers,
  onViewDetails,
  onAddNote,
  onAddReminder,
  onAddInteraction,
  onUpdateCustomerStage,
}: MobileCustomersViewProps) {
  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isMovingCustomer, setIsMovingCustomer] = useState(false);

  // تصفية العملاء حسب المرحلة المحددة
  const getCustomersForStage = (stageId: string) => {
    if (stageId === "all") {
      return filteredCustomers;
    }
    if (stageId === "unassigned") {
      return filteredCustomers.filter(
        (customer) => !customer.pipelineStage && !customer.stage_id,
      );
    }
    return filteredCustomers.filter(
      (customer) =>
        customer.pipelineStage === stageId ||
        (customer.stage_id && String(customer.stage_id) === stageId),
    );
  };

  const handleMoveCustomer = async (customer: Customer, newStageId: string) => {
    if (customer.pipelineStage === newStageId) return;

    setIsMovingCustomer(true);
    const loadingToast = toast.loading(`جاري نقل العميل ${customer.name}...`);

    try {
      const success = await onUpdateCustomerStage(
        customer.id.toString(),
        newStageId,
      );
      if (success) {
        toast.dismiss(loadingToast);
        toast.success(`تم نقل العميل ${customer.name} بنجاح`);
      } else {
        toast.dismiss(loadingToast);
        toast.error(`فشل في نقل العميل ${customer.name}`);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(`حدث خطأ أثناء نقل العميل ${customer.name}`);
      console.error("خطأ في نقل العميل:", error);
    } finally {
      setIsMovingCustomer(false);
    }
  };

  const currentCustomers = getCustomersForStage(selectedStage);
  const selectedStageData = pipelineStages.find(
    (stage) => stage.id === selectedStage,
  );

  return (
    <div className="space-y-4">
      {/* Stage Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">اختر المرحلة</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر مرحلة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  جميع العملاء ({filteredCustomers.length})
                </div>
              </SelectItem>
              {pipelineStages.map((stage) => {
                const IconComponent = getStageIcon(stage.icon);
                const stageCustomers = getCustomersForStage(stage.id);
                return (
                  <SelectItem key={stage.id} value={stage.id}>
                    <div className="flex items-center gap-2">
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: stage.color }}
                      />
                      <span>
                        {typeof stage.name === "object" && stage.name !== null
                          ? (stage.name as any).name_ar ||
                            (stage.name as any).name_en ||
                            "غير محدد"
                          : stage.name || "غير محدد"}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {stageCustomers.length}
                      </Badge>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Stage Info */}
      {selectedStageData && selectedStage !== "all" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = getStageIcon(selectedStageData.icon);
                return (
                  <IconComponent
                    className="h-6 w-6"
                    style={{ color: selectedStageData.color }}
                  />
                );
              })()}
              <div>
                <h3 className="font-semibold">
                  {typeof selectedStageData.name === "object" &&
                  selectedStageData.name !== null
                    ? (selectedStageData.name as any).name_ar ||
                      (selectedStageData.name as any).name_en ||
                      "غير محدد"
                    : selectedStageData.name || "غير محدد"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentCustomers.length} عميل
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers List */}
      <div className="space-y-3">
        {currentCustomers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">لا يوجد عملاء</h3>
              <p className="text-muted-foreground">
                {selectedStage === "all"
                  ? "لا يوجد عملاء في النظام"
                  : `لا يوجد عملاء في مرحلة ${
                      selectedStageData?.name &&
                      typeof selectedStageData.name === "object" &&
                      selectedStageData.name !== null
                        ? (selectedStageData.name as any).name_ar ||
                          (selectedStageData.name as any).name_en ||
                          "غير محدد"
                        : selectedStageData?.name || "المحددة"
                    }`}
              </p>
            </CardContent>
          </Card>
        ) : (
          currentCustomers.map((customer) => (
            <Card key={customer.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">
                        {typeof customer.name === "object" &&
                        customer.name !== null
                          ? (customer.name as any).name_ar ||
                            (customer.name as any).name_en ||
                            "غير محدد"
                          : customer.name || "غير محدد"}
                      </h3>
                      {getPropertyTypeLabel(customer) !== "غير محدد" && (
                        <Badge
                          className={getPropertyTypeColor(
                            getPropertyTypeLabel(customer),
                          )}
                          variant="secondary"
                        >
                          {getPropertyTypeLabel(customer)}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      {customer.phone_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone_number}</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      {customer.city && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {typeof customer.city === "object" &&
                            customer.city !== null
                              ? (customer.city as any).name_ar ||
                                (customer.city as any).name_en ||
                                "غير محدد"
                              : customer.city}
                          </span>
                          {customer.district && (
                            <span>
                              {" "}
                              -{" "}
                              {typeof customer.district === "object" &&
                              customer.district !== null
                                ? (customer.district as any).name_ar ||
                                  (customer.district as any).name_en ||
                                  "غير محدد"
                                : customer.district}
                            </span>
                          )}
                        </div>
                      )}
                      {customer.dealValue && customer.dealValue > 0 && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3" />
                          <span>
                            {customer.dealValue.toLocaleString()} ريال
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Move Customer Dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isMovingCustomer}
                          className="h-8 w-8 p-0"
                          title="نقل العميل"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm mx-auto">
                        <DialogHeader>
                          <DialogTitle>نقل العميل</DialogTitle>
                          <DialogDescription>
                            اختر المرحلة الجديدة للعميل {customer.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                          <div className="grid gap-2">
                            {pipelineStages.map((stage) => {
                              const IconComponent = getStageIcon(stage.icon);
                              return (
                                <Button
                                  key={stage.id}
                                  variant={
                                    customer.pipelineStage === stage.id
                                      ? "default"
                                      : "outline"
                                  }
                                  className="justify-start h-auto p-3 w-full"
                                  onClick={() =>
                                    handleMoveCustomer(customer, stage.id)
                                  }
                                  disabled={
                                    customer.pipelineStage === stage.id ||
                                    isMovingCustomer
                                  }
                                >
                                  <IconComponent
                                    className="h-4 w-4 ml-2 flex-shrink-0"
                                    style={{ color: stage.color }}
                                  />
                                  <div className="text-right flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                      {typeof stage.name === "object" &&
                                      stage.name !== null
                                        ? (stage.name as any).name_ar ||
                                          (stage.name as any).name_en ||
                                          "غير محدد"
                                        : stage.name || "غير محدد"}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {getCustomersForStage(stage.id).length}{" "}
                                      عميل
                                    </div>
                                  </div>
                                  {customer.pipelineStage === stage.id && (
                                    <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                  )}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(customer)}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          عرض التفاصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddNote(customer)}>
                          <Edit className="h-4 w-4 ml-2" />
                          إضافة ملاحظة
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAddReminder(customer)}
                        >
                          <Bell className="h-4 w-4 ml-2" />
                          إضافة تذكير
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAddInteraction(customer)}
                        >
                          <MessageSquare className="h-4 w-4 ml-2" />
                          إضافة تفاعل
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(customer)}
                    className="flex-1 text-xs"
                  >
                    <Eye className="h-3 w-3 ml-1" />
                    <span className="hidden sm:inline">التفاصيل</span>
                    <span className="sm:hidden">تفاصيل</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddNote(customer)}
                    className="flex-1 text-xs"
                  >
                    <Edit className="h-3 w-3 ml-1" />
                    <span className="hidden sm:inline">ملاحظة</span>
                    <span className="sm:hidden">ملاحظة</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddReminder(customer)}
                    className="flex-1 text-xs"
                  >
                    <Bell className="h-3 w-3 ml-1" />
                    <span className="hidden sm:inline">تذكير</span>
                    <span className="sm:hidden">تذكير</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {currentCustomers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                إجمالي العملاء: {currentCustomers.length}
              </span>
              <span className="text-muted-foreground">
                القيمة الإجمالية:{" "}
                {currentCustomers
                  .reduce((sum, c) => sum + (c.dealValue || 0), 0)
                  .toLocaleString()}{" "}
                ريال
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
