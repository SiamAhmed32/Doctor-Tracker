"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartPanel } from "./chart-panel";

type PatientsPerDoctorChartProps = {
  data: Array<{
    doctorName: string;
    patientCount: number;
  }>;
};

export function PatientsPerDoctorChart({ data }: PatientsPerDoctorChartProps) {
  const chartData = [...data]
    .sort((a, b) => b.patientCount - a.patientCount)
    .map((item) => ({
      name: item.doctorName.replace(/^Dr\.\s*/, ""),
      patients: item.patientCount,
    }));
  const busiest = chartData[0];

  return (
    <ChartPanel
      title="Caseload by doctor"
      description="Number of patients currently assigned to each clinician."
      footer={
        busiest
          ? `Highest load: ${busiest.name} (${busiest.patients} patients)`
          : "No doctor caseload data yet."
      }
    >
      <p className="sr-only">
        Patients per doctor:{" "}
        {chartData.map((item) => `${item.name}: ${item.patients}`).join("; ")}
      </p>
      <div className="h-64">
        {chartData.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No doctor caseload data yet.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 28, left: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                stroke="#94A3B8"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11 }}
                stroke="#94A3B8"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} patients`, "Assigned"]}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#E2E8F0",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="patients" fill="#2563EB" radius={[0, 6, 6, 0]} barSize={18}>
                <LabelList
                  dataKey="patients"
                  position="right"
                  className="fill-slate-600 text-[11px]"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartPanel>
  );
}
