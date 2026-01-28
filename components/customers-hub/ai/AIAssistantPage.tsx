"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { LeadScoringDashboard } from "./LeadScoringDashboard";
import { SmartRecommendations } from "./SmartRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AIAssistantPage() {
  return (
    <div className="flex flex-col gap-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/ar/dashboard/customers-hub">
            <Button variant="ghost" size="sm">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              المساعد الذكي
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              رؤى وتوصيات مدعومة بالذكاء الاصطناعي
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scoring">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="scoring">تقييم العملاء</TabsTrigger>
          <TabsTrigger value="recommendations">التوصيات الذكية</TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="mt-6">
          <LeadScoringDashboard />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <SmartRecommendations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
