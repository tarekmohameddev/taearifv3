"use client";
import { useEffect } from "react";
import useStore from "@/context/Store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
const SkeletonLoader = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse flex items-center gap-4 rounded-lg border p-3"
        >
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </>
  );
};


export function RecentActivity() {
  const { recentActivityData, isRecentActivityUpdated, fetchRecentActivityData,loading } = useStore();

  useEffect(() => {
    if (!isRecentActivityUpdated) {
      fetchRecentActivityData();
    }
  }, [isRecentActivityUpdated, fetchRecentActivityData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>النشاط الأخير</CardTitle>
        <CardDescription>آخر الإجراءات التي تمت على موقعك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <SkeletonLoader />
        ) : (
          recentActivityData.activities?.map((item, index) => (
            <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
              <div className="rounded-full bg-primary/10 p-2">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.action}</p>
                <p className="text-sm text-muted-foreground">
                  {item.section} • {item.time}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
