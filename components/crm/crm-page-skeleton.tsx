import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  Target,
  Handshake,
  CheckCircle,
  Calendar,
  Settings,
  RefreshCw,
} from "lucide-react";

const CrmPageSkeleton = () => {
  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 mb-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Skeleton className="h-4 w-4 ml-2" />
                <Skeleton className="h-4 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}

      {/* Pipeline Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-80 flex-shrink-0">
            <div className="flex items-center justify-between p-2 rounded-t-lg bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-5 w-8" />
            </div>
            <div className="space-y-4 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg h-[60vh] overflow-y-auto">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="p-4 rounded-lg border bg-card shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center pt-2 space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmPageSkeleton; 