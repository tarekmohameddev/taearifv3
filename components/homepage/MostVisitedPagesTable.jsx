"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useAuthStore from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function MostVisitedPagesTable() {
  const [pagesData, setPagesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useAuthStore();

  // دالة جلب البيانات من API
  const fetchMostVisitedPages = async () => {
    // التحقق من وجود التوكن قبل إجراء الطلب
    if (!userData?.token) {
      console.log("No token available, skipping fetchMostVisitedPages");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_Backend_URL}/dashboard/most-visited-pages`,
      );
      setPagesData(response.data.pages);
    } catch (err) {
      console.error("Error fetching most visited pages:", err);
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // إعادة المحاولة عند تغيير التوكن
    if (userData?.token) {
      fetchMostVisitedPages();
    } else {
      // إعادة تعيين البيانات عند فقدان التوكن
      setPagesData([]);
      setError(null);
      setLoading(false);
    }
  }, [userData?.token]);

  // إذا لم يكن هناك token، لا نعرض المحتوى
  if (!userData?.token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>أكثر الصفحات زيارة</CardTitle>
          <CardDescription>تحليل أداء صفحات الموقع</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            يرجى تسجيل الدخول لعرض البيانات
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || error) {
    return (
      <Card>
        {/* هيكل التحميل للعنوان */}
        <CardHeader>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>

        {/* هيكل التحميل للجدول */}
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* هيكل رأس الجدول */}
              <TableHeader>
                <TableRow>
                  {[...Array(6)].map((_, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              {/* هيكل بيانات الجدول */}
              <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {[...Array(6)].map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton
                          className={`h-4 ${cellIndex === 0 ? "w-32" : "w-16"}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>أكثر الصفحات زيارة</CardTitle>
        <CardDescription>تحليل أداء صفحات الموقع</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الصفحة</TableHead>
                <TableHead>المشاهدات</TableHead>
                <TableHead>الزوار الفريدون</TableHead>
                <TableHead>معدل الارتداد</TableHead>
                <TableHead>متوسط وقت التصفح</TableHead>
                <TableHead>نسبة المشاهدات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagesData?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.path}</TableCell>
                  <TableCell>{row.views}</TableCell>
                  <TableCell>{row.unique_visitors}</TableCell>
                  <TableCell>{row.bounce_rate}</TableCell>
                  <TableCell>
                    {row.avg_time !== undefined &&
                    row.avg_time !== null &&
                    row.avg_time !== "N/A"
                      ? row.avg_time
                      : "0:00"}
                  </TableCell>
                  <TableCell>{row.percentage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default MostVisitedPagesTable;
