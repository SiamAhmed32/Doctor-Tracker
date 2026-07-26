"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PatientsPerDoctorChartProps = {
  data: Array<{
    doctorName: string;
    patientCount: number;
  }>;
};

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  const chartData = data.map((item) => ({
    name: item.doctorName.replace("Dr. ", ""),
    patients: item.patientCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Patients per doctor</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis type="number" allowDecimals={false} stroke="#94A3B8" />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 11 }}
              stroke="#94A3B8"
            />
            <Tooltip />
            <Bar dataKey="patients" fill="#2563EB" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
