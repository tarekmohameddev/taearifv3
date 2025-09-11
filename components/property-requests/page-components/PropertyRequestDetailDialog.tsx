
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

export const PropertyRequestDetailDialog = ({
  showPropertyRequestDialog,
  setShowPropertyRequestDialog,
  selectedPropertyRequest,
}: any) => {
  return (
    <Dialog open={showPropertyRequestDialog} onOpenChange={setShowPropertyRequestDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedPropertyRequest && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="/placeholder.svg"
                  />
                  <AvatarFallback>
                    {selectedPropertyRequest.full_name
                      .split(" ")
                      .slice(0, 2)
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl">{selectedPropertyRequest.full_name}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    طلب عقار • منذ{" "}
                    {new Date(selectedPropertyRequest.created_at).toLocaleDateString('ar-US')}
                  </div>
                </div>
                <div className="mr-auto flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      selectedPropertyRequest.property_type === "سكني"
                        ? "border-blue-500 text-blue-700"
                        : selectedPropertyRequest.property_type === "تجاري"
                        ? "border-green-500 text-green-700"
                        : selectedPropertyRequest.property_type === "صناعي"
                        ? "border-purple-500 text-purple-700"
                        : selectedPropertyRequest.property_type === "أرض"
                        ? "border-orange-500 text-orange-700"
                        : "border-red-500 text-red-700"
                    }
                  >
                    {selectedPropertyRequest.property_type}
                  </Badge>
                  <Badge variant={selectedPropertyRequest.is_active === 1 ? "default" : "secondary"}>
                    {selectedPropertyRequest.is_active === 1 ? "نشط" : "غير نشط"}
                  </Badge>
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
                    {selectedPropertyRequest.phone ? (
                      <span className="font-medium flex items-center">
                        <Phone className="ml-1 h-3 w-3 text-green-600" />
                        {selectedPropertyRequest.phone}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير متوفر</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>واتساب:</span>
                    {selectedPropertyRequest.contact_on_whatsapp ? (
                      <span className="font-medium flex items-center">
                        <MessageSquare className="ml-1 h-3 w-3 text-green-500" />
                        متاح
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">غير متوفر</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الاسم الكامل:</span>
                    <span className="font-medium">
                      {selectedPropertyRequest.full_name}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="ml-2 h-5 w-5" />
                    تفاصيل العقار
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>نوع العقار:</span>
                    <span className="font-medium flex items-center">
                      <MapPin className="ml-1 h-3 w-3 text-blue-500" />
                      {selectedPropertyRequest.property_type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>المنطقة:</span>
                    <span className="font-medium">
                      {selectedPropertyRequest.region || "غير محددة"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>طريقة الشراء:</span>
                    <span className="font-medium">
                      {selectedPropertyRequest.purchase_method}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الميزانية:</span>
                    <span className="font-medium flex items-center">
                      <Target className="ml-1 h-3 w-3 text-purple-500" />
                      {selectedPropertyRequest.budget_from.toLocaleString()} - {selectedPropertyRequest.budget_to.toLocaleString()} ريال
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Target className="ml-2 h-5 w-5" />
                    تفاصيل إضافية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>الجدية:</span>
                    <span className="font-medium">
                      {selectedPropertyRequest.seriousness}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>هدف الشراء:</span>
                    <span className="font-medium">
                      {selectedPropertyRequest.purchase_goal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>عروض مشابهة:</span>
                    {selectedPropertyRequest.wants_similar_offers ? (
                      <Badge variant="default">
                        نعم
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        لا
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الحالة:</span>
                    <Badge variant={selectedPropertyRequest.is_active === 1 ? "default" : "secondary"}>
                      {selectedPropertyRequest.is_active === 1 ? "نشط" : "غير نشط"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">الملاحظات</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPropertyRequest.notes ? (
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {selectedPropertyRequest.notes}
                  </p>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground italic text-sm">
                      لا توجد ملاحظات مضافة لهذا الطلب
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">
                <Edit className="ml-2 h-4 w-4" />
                تعديل الطلب
              </Button>
              <Button variant="outline">
                <Phone className="ml-2 h-4 w-4" />
                اتصال
              </Button>
              <Button variant="outline">
                <MessageSquare className="ml-2 h-4 w-4" />
                واتساب
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}; 