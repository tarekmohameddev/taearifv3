"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import useStore from "@/context/Store"; // استيراد useStore

function VisitorChart() {
  // الوصول إلى الحالات والدوال من قسم homepage في Store.js
  const {
    homepage: {
      visitorData,
      selectedTimeRange,
      fetchVisitorData,
      setSelectedTimeRange,
    },
    loading,
  } = useStore();

  // جلب البيانات إذا كانت فارغة للفترة الزمنية المختارة
  useEffect(() => {
    const dataForSelectedRange = visitorData[selectedTimeRange];
    console.log("dataForSelectedRange", dataForSelectedRange);
    if (!dataForSelectedRange) { 
      fetchVisitorData(selectedTimeRange);
    }
  }, [selectedTimeRange, visitorData, fetchVisitorData]);

  const chartData = visitorData[selectedTimeRange] || [];

  return (
    <div className="w-full">
      {/* أزرار تحديد الفترة الزمنية */}
      <div className="mb-4 flex gap-2">
        {[
          { label: "7 أيام", value: "7" },
          { label: "30 يوم", value: "30" },
          { label: "3 أشهر", value: "90" },
          { label: "سنة", value: "365" },
        ].map((range) => {
          return (
            <Button
              key={range.value}
              variant={selectedTimeRange == range.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange(range.value)}
              className="text-sm"
            >
              {range.label}
            </Button>
          );
        })}
      </div>

      {/* عرض حالة التحميل أو الرسم البياني */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              content={({ payload }) => (
                <div className="flex justify-end gap-4 text-sm mb-4">
                  {payload?.map((entry) => (
                    <div key={entry.value} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>
                        {entry.value === "visits"
                          ? "الزيارات"
                          : "الزوار الفريدون"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <defs>
              <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="uniqueVisitorsFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#visitsFill)"
              dot={{ r: 4 }}
            />
            <Area
              type="monotone"
              dataKey="uniqueVisitors"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#uniqueVisitorsFill)"
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VisitorChart;
