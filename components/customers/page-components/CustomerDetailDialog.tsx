
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Phone,
  Mail,
  Edit,
  MessageSquare,
  MapPin,
  Target,
  Star,
  Move,
} from "lucide-react";
import Link from "next/link";

export const CustomerDetailDialog = ({
  showCustomerDialog,
  setShowCustomerDialog,
  selectedCustomer,
}: any) => {
  return (
    <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedCustomer && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={selectedCustomer.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedCustomer.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl">{selectedCustomer.name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {selectedCustomer.nameEn} • عميل منذ{" "}
                    {selectedCustomer.joinDate}
                  </div>
                </div>
                <div className="mr-auto flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedCustomer.customer_type === "مشتري"
                        ? "border-blue-500 text-blue-700"
                        : selectedCustomer.customer_type === "بائع"
                        ? "border-green-500 text-green-700"
                        : selectedCustomer.customer_type === "مستأجر"
                        ? "border-purple-500 text-purple-700"
                        : selectedCustomer.customer_type === "مؤجر"
                        ? "border-orange-500 text-orange-700"
                        : "border-red-500 text-red-700"
                    }
                  >
                    {selectedCustomer.customer_type}
                  </Badge>
                  <Link href="/crm">
                    <Button variant="outline" size="sm">
                      <Move className="ml-2 h-4 w-4" />
                      عرض في CRM
                    </Button>
                  </Link>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Phone className="ml-2 h-5 w-5" />
                    معلومات الاتصال
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>الهاتف:</span>
                    {selectedCustomer.phone_number && selectedCustomer.phone_number !== "N/A" ? (
                      <span className="font-medium flex items-center">
                        <Phone className="ml-1 h-3 w-3 text-green-600" />
                        {selectedCustomer.phone_number}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير متوفر</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>واتساب:</span>
                    {selectedCustomer.whatsapp && selectedCustomer.whatsapp !== "N/A" ? (
                      <span className="font-medium flex items-center">
                        <MessageSquare className="ml-1 h-3 w-3 text-green-500" />
                        {selectedCustomer.whatsapp}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير متوفر</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>البريد:</span>
                    {selectedCustomer.email && selectedCustomer.email !== "N/A" ? (
                      <span className="font-medium text-sm flex items-center">
                        <Mail className="ml-1 h-3 w-3 text-blue-500" />
                        {selectedCustomer.email}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير متوفر</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>التفضيل:</span>
                    {selectedCustomer.communicationPreference ? (
                      <Badge variant="outline">
                        {selectedCustomer.communicationPreference}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محدد</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="ml-2 h-5 w-5" />
                    الموقع والهوية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>المدينة:</span>
                    {(typeof selectedCustomer.city === "string" && selectedCustomer.city && selectedCustomer.city !== "N/A") || selectedCustomer.city?.name_ar ? (
                      <span className="font-medium flex items-center">
                        <MapPin className="ml-1 h-3 w-3 text-blue-500" />
                        {typeof selectedCustomer.city === "string"
                          ? selectedCustomer.city
                          : selectedCustomer.city?.name_ar}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محددة</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الحي:</span>
                    {(typeof selectedCustomer.district === "string" && selectedCustomer.district && selectedCustomer.district !== "N/A") || 
                     (selectedCustomer.district as { name_ar: string })?.name_ar ? (
                      <span className="font-medium">
                        {typeof selectedCustomer.district === "string"
                          ? selectedCustomer.district
                          : (selectedCustomer.district as { name_ar: string })?.name_ar}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محدد</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الجنسية:</span>
                    {selectedCustomer.nationality && selectedCustomer.nationality !== "N/A" ? (
                      <span className="font-medium">
                        {selectedCustomer.nationality}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محددة</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>حجم الأسرة:</span>
                    {selectedCustomer.familySize ? (
                      <span className="font-medium flex items-center">
                        <Target className="ml-1 h-3 w-3 text-purple-500" />
                        {selectedCustomer.familySize} أفراد
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محدد</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="ml-2 h-5 w-5" />
                    إدارة العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>الوسيط:</span>
                    {selectedCustomer.assignedAgent ? (
                      <span className="font-medium">
                        {selectedCustomer.assignedAgent}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير مخصص</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>المصدر:</span>
                    {selectedCustomer.leadSource ? (
                      <span className="font-medium">
                        {selectedCustomer.leadSource}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محدد</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الأولوية:</span>
                    {selectedCustomer.urgency ? (
                      <Badge
                        variant={
                          selectedCustomer.urgency === "عالية"
                            ? "destructive"
                            : selectedCustomer.urgency === "متوسطة"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedCustomer.urgency}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير محددة</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الرضا:</span>
                    {selectedCustomer.satisfaction ? (
                      <div className="flex items-center">
                        <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedCustomer.satisfaction}/5</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">لم يتم التقييم</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCustomer.notes ? (
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {selectedCustomer.notes}
                  </p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground italic text-sm">
                      لا توجد ملاحظات مضافة لهذا العميل
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Edit className="ml-2 h-4 w-4" />
                تعديل العميل
              </Button>
              <Button variant="outline">
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </Button>
              <Button variant="outline">
                <MessageSquare className="ml-2 h-4 w-4" />
                واتساب
              </Button>
              <Link href="/crm">
                <Button>
                  <Move className="ml-2 h-4 w-4" />
                  إدارة في CRM
                </Button>
              </Link>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}; 