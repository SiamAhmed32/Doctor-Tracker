"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#2563EB", "#0EA5E9", "#16A34A", "#D97706", "#DC2626", "#7C3AED"];

type ConditionDonutChartProps = {
  data: Array<{ condition: string; count: number }>;
};

export function ConditionDonutChart({ data }: ConditionDonutChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Patients by condition</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No patient condition data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="condition"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.condition}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
