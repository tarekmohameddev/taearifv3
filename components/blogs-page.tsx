"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnhancedSidebar } from "./enhanced-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInstance";

// تعريف الواجهات (Interfaces) للمدونة
interface Author {
  id: number;
  name: string;
}

export interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  featured_image: string;
  category: string;
  status: string;
  tags: string[];
  published_at: string;
  views: number;
  comments: number;
  featured: boolean;
  author: Author;
  created_at: string;
  updated_at: string;
}

export interface IPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

interface BlogApiResponse {
  status: string;
  data: {
    posts: IBlogPost[];
    pagination: IPagination;
  };
}

// دالة لتحويل التاريخ إلى تنسيق عربي مبسط
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// دالة التحقق مما إذا كانت الصورة صالحة بناءً على امتداد الملف
const getImageUrl = (url: string): string => {
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  if (url && validExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
    return url;
  }
  return "/placeholder.svg"; // صورة بديلة في حال عدم صلاحية URL الصورة
};

export default function BlogsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("blog");
  const router = useRouter();
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [pagination, setPagination] = useState<IPagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // جلب بيانات المدونة من الـ API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<BlogApiResponse>(
          "https://taearif.com/api/blogs",
        );
        console.log("Fetched posts:", response.data);
        setPosts(response.data.data.posts);
        setPagination(response.data.data.pagination);
      } catch (err: any) {
        console.error("Error fetching blogs:", err);
        setError(err.message || "حدث خطأ أثناء جلب بيانات المدونة");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">المدونة</h1>
                <p className="text-muted-foreground">
                  إدارة ونشر محتوى المدونة الخاص بك
                </p>
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={() => router.push("/blogs/add")}
              >
                <Plus className="h-4 w-4" />
                <span>إضافة مقال جديد</span>
              </Button>
            </div>

            {loading ? (
              // عرض Skeleton Loading أثناء تحميل البيانات
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-md border p-6 animate-pulse"
                  >
                    <div className="aspect-video w-full bg-gray-300 rounded" />
                    <div className="mt-4 space-y-2">
                      <div className="h-5 w-3/4 bg-gray-300 rounded" />
                      <div className="h-4 w-full bg-gray-300 rounded" />
                      <div className="h-4 w-5/6 bg-gray-300 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <Card
                      key={post.id}
                      className="overflow-hidden flex flex-col"
                    >
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={getImageUrl(post.featured_image)}
                          alt={post.title}
                          className="h-full w-full object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg line-clamp-1">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="mt-1 line-clamp-2">
                              {post.excerpt}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">القائمة</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Edit className="h-4 w-4" />
                                <span>تعديل</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                <span>معاينة</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive">
                                <Trash className="h-4 w-4" />
                                <span>حذف</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span>الكاتب: {post.author.name}</span>
                          <span>•</span>
                          <span>التاريخ: {formatDate(post.published_at)}</span>
                          <span>•</span>
                          <span>التصنيف: {post.category}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex gap-2">
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : post.status === "draft"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {post.status === "published"
                              ? "منشور"
                              : post.status === "draft"
                                ? "مسودة"
                                : post.status}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{post.views} مشاهدة</span>
                          <span>{post.comments} تعليق</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {pagination && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      {Array.from({ length: pagination.last_page }).map(
                        (_, idx) => (
                          <PaginationItem key={idx}>
                            <PaginationLink
                              href="#"
                              isActive={pagination.current_page === idx + 1}
                            >
                              {idx + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
