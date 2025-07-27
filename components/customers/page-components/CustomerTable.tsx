
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StageAssignmentDialog } from "./StageAssignmentDialog";
import {
  MoreHorizontal,
  Mail,
  Phone,
  Tag,
  Download,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Clock,
  SortAsc,
  SortDesc,
  CheckSquare,
  X,
  ArrowRight,
} from "lucide-react";

export const CustomerTable = ({
  filteredAndSortedCustomers,
  selectedCustomers,
  handleSelectAll,
  handleSelectCustomer,
  sortField,
  sortDirection,
  handleSort,
  setSelectedCustomer,
  setShowCustomerDialog,
  openEditDialog,
  handleDelete,
  formData,
  open,
  setOpen,
  handleChange,
  handleUpdateCustomer,
  showBulkActionsDialog,
  setShowBulkActionsDialog,
  setSelectedCustomers,
  showStageDialog,
  setShowStageDialog,
  selectedCustomerForStage,
  setSelectedCustomerForStage,
  onStageUpdated,
}: any) => {
  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedCustomers.length} عميل محدد
          </span>
          <Dialog
            open={showBulkActionsDialog}
            onOpenChange={setShowBulkActionsDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <CheckSquare className="ml-2 h-4 w-4" />
                إجراءات جماعية
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إجراءات جماعية للعملاء</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Mail className="ml-2 h-4 w-4" />
                  إرسال بريد إلكتروني جماعي
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <MessageSquare className="ml-2 h-4 w-4" />
                  إرسال رسالة واتساب جماعية
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Tag className="ml-2 h-4 w-4" />
                  إضافة علامات
                </Button>
                <Button
                  className="w-full justify-start bg-transparent"
                  variant="outline"
                >
                  <Download className="ml-2 h-4 w-4" />
                  تصدير البيانات المحددة
                </Button>
                <Separator />
                <Button
                  className="w-full justify-start"
                  variant="destructive"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف العملاء المحددين
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCustomers([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      selectedCustomers.length ===
                      filteredAndSortedCustomers.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("name")}
                    className="h-auto p-0 font-semibold "
                  >
                    العميل
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <SortAsc className="mr-2 h-4 w-4" />
                      ) : (
                        <SortDesc className="mr-2 h-4 w-4" />
                      ))}
                  </Button>
                </TableHead>
                <TableHead className="text-right">الاتصال</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الموقع</TableHead>
                <TableHead className="text-right">آخر تواصل</TableHead>
                <TableHead className="w-[100px] text-right">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedCustomers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => handleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="font-medium text-right">
                          {customer.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* Phone Number */}
                      {customer.phone_number && customer.phone_number !== "N/A" ? (
                        <div className="flex items-center text-sm">
                          <Phone className="ml-2 h-3 w-3 text-green-600" />
                          <span className="font-medium">{customer.phone_number}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="ml-2 h-3 w-3" />
                          <span className="italic">لا يوجد رقم</span>
                        </div>
                      )}
                      
                      {/* WhatsApp */}
                      {customer.whatsapp && customer.whatsapp !== "N/A" && customer.whatsapp !== customer.phone_number ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="ml-2 h-3 w-3 text-green-500" />
                          <span>{customer.whatsapp}</span>
                        </div>
                      ) : customer.phone_number && customer.phone_number !== "N/A" ? (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageSquare className="ml-2 h-3 w-3 text-green-500" />
                          <span className="text-xs">نفس رقم الهاتف</span>
                        </div>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        customer.customer_type === "مشتري"
                          ? "border-blue-500 text-blue-700"
                          : customer.customer_type === "بائع"
                          ? "border-green-500 text-green-700"
                          : customer.customer_type === "مستأجر"
                          ? "border-purple-500 text-purple-700"
                          : customer.customer_type === "مؤجر"
                          ? "border-orange-500 text-orange-700"
                          : "border-red-500 text-red-700"
                      }
                    >
                      {customer.customer_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {/* City */}
                      <div className="font-medium text-right">
                        {typeof customer.district === "string" && customer.district && customer.district !== "N/A" ? 
                          customer.district : 
                          customer.district?.city_name_ar ? 
                          customer.district.city_name_ar : 
                          <span className="text-muted-foreground text-sm italic">غير محددة</span>
                        }
                      </div>
                      {/* District */}
                      <div className="text-sm text-muted-foreground text-right">
                        {typeof customer.district === "string" && customer.district && customer.district !== "N/A" ? 
                          customer.district : 
                          (customer.district as { name_ar: string })?.name_ar ? 
                          (customer.district as { name_ar: string }).name_ar :
                          <span className="italic">لا يوجد حي محدد</span>
                        }
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {customer.lastContact ? (
                        <>
                          <Clock className="ml-2 h-3 w-3 text-blue-500" />
                          <span className="font-medium">{customer.lastContact}</span>
                        </>
                      ) : (
                        <>
                          <Clock className="ml-2 h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground italic">لم يتم التواصل بعد</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowCustomerDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              openEditDialog(customer);
                            }}
                          >
                            <Edit className="ml-2 h-4 w-4" />
                            تعديل العميل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              setSelectedCustomerForStage(customer);
                              setShowStageDialog(true);
                            }}
                          >
                            <ArrowRight className="ml-2 h-4 w-4" />
                            تعيين المرحلة
                          </DropdownMenuItem>

                          {formData && (
                            <Dialog open={open} onOpenChange={setOpen}>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>تعديل بيانات العميل</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4">
                                  <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange("name")}
                                  />
                                  <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange("email")}
                                  />
                                  <Input
                                    id="phone"
                                    value={formData.phone_number}
                                    onChange={handleChange("phone_number")}
                                  />
                                  <Textarea
                                    id="note"
                                    value={formData.note}
                                    onChange={handleChange("note")}
                                  />

                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setOpen(false)}
                                    >
                                      إلغاء
                                    </Button>
                                    <Button onClick={handleUpdateCustomer}>
                                      تعديل
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <MessageSquare className="ml-2 h-4 w-4" />
                            إرسال واتساب
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="ml-2 h-4 w-4" />
                            اتصال هاتفي
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="ml-2 h-4 w-4" />
                            إرسال بريد إلكتروني
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(customer.id)}
                          >
                            <Trash2 className="ml-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stage Assignment Dialog */}
      <StageAssignmentDialog
        open={showStageDialog}
        onOpenChange={setShowStageDialog}
        customer={selectedCustomerForStage}
        onStageUpdated={onStageUpdated}
      />
    </div>
  );
}; 