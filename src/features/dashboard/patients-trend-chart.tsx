"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./chart-panel";

type PatientsTrendChartProps = {
  data: Array<{ date: string; count: number }>;
};

export function PatientsTrendChart({ data }: PatientsTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.date.slice(5),
  }));
  const totalAdded = chartData.reduce((sum, item) => sum + item.count, 0);
  const peak = chartData.reduce(
    (best, item) => (item.count > best.count ? item : best),
    { date: "—", count: 0, label: "—" },
  );

  return (
    <ChartPanel
      className="xl:col-span-3"
      title="Patient registrations"
      description="How many new patients were added each day in the selected range."
      footer={
        totalAdded > 0
          ? `${totalAdded} patients added · busiest day ${peak.label} (${peak.count})`
          : "No new patients in this range yet."
      }
    >
      <p className="sr-only">
        Patients added by day:{" "}
        {chartData.map((item) => `${item.date}: ${item.count}`).join("; ")}
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              stroke="#94A3B8"
              tickLine={false}
              axisLine={false}
              width={28}
            />
            <Tooltip
              formatter={(value) => [`${value} patients`, "Registered"]}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#E2E8F0",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Patients"
              stroke="#2563EB"
              fill="url(#patientFill)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartPanel>
  );
}
