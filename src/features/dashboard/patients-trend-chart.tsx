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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PatientsTrendChartProps = {
  data: Array<{ date: string; count: number }>;
};

export function PatientsTrendChart({ data }: PatientsTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: item.date.slice(5),
  }));

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Patients added over time</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="patientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563EB"
              fill="url(#patientFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
