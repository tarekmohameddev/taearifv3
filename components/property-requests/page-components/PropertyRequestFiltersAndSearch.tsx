import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";

export const PropertyRequestFiltersAndSearch = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  filterCity,
  setFilterCity,
}: any) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="البحث في العملاء..."
          className="pr-8 w-[300px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="نشط">نشط</SelectItem>
            <SelectItem value="غير نشط">غير نشط</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="مشتري">مشتري</SelectItem>
            <SelectItem value="بائع">بائع</SelectItem>
            <SelectItem value="مستأجر">مستأجر</SelectItem>
            <SelectItem value="مؤجر">مؤجر</SelectItem>
            <SelectItem value="مستثمر">مستثمر</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCity} onValueChange={setFilterCity}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المدن</SelectItem>
            <SelectItem value="الرياض">الرياض</SelectItem>
            <SelectItem value="جدة">جدة</SelectItem>
            <SelectItem value="الدمام">الدمام</SelectItem>
            <SelectItem value="مكة">مكة المكرمة</SelectItem>
            <SelectItem value="المدينة">المدينة المنورة</SelectItem>
            <SelectItem value="الطائف">الطائف</SelectItem>
            <SelectItem value="الخبر">الخبر</SelectItem>
            <SelectItem value="القطيف">القطيف</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
