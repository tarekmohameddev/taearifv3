"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { name: "Checking", value: 5280.42, color: "#3b82f6" },
  { name: "Savings", value: 12750.89, color: "#22c55e" },
  { name: "Investments", value: 27200.16, color: "#a855f7" },
];

export function AccountBalances() {
  return (
    <ChartContainer
      config={{
        Checking: {
          label: "Checking",
          color: "#3b82f6",
        },
        Savings: {
          label: "Savings",
          color: "#22c55e",
        },
        Investments: {
          label: "Investments",
          color: "#a855f7",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent
                    className="w-[200px]"
                    items={payload.map((entry) => ({
                      name: entry.name,
                      value: `$${Number(entry.value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                      color: entry.payload.color,
                    }))}
                  />
                );
              }
              return null;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
