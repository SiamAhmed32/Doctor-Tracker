"use client";

import Link from "next/link";
import {
  Activity,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useGetMeQuery } from "@/features/auth/auth-api";
import { ConditionDonutChart } from "./condition-donut-chart";
import { useGetDashboardQuery } from "./dashboard-api";
import { MetricCard } from "./metric-card";
import { PatientsPerDoctorChart } from "./patients-per-doctor-chart";
import { PatientsTrendChart } from "./patients-trend-chart";

export function DashboardView() {
  const { data: me } = useGetMeQuery();
  const { data, isLoading, isError } = useGetDashboardQuery({ doctorLimit: 6 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Could not load dashboard analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Good day, ${me?.user.name?.split(" ")[0] ?? "Admin"}`}
        description="Here is what is happening across your medical network."
        actions={
          <Button asChild>
            <Link href="/doctors">Add doctor</Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total doctors"
          value={data.totals.doctors}
          hint="Active clinicians in the system"
          icon={Stethoscope}
        />
        <MetricCard
          label="Total patients"
          value={data.totals.patients}
          hint="Patients currently tracked"
          icon={Users}
        />
        <MetricCard
          label="New patients (range)"
          value={data.range.patientsCreated}
          hint={`${data.range.from ?? "—"} to ${data.range.to ?? "—"}`}
          icon={UserPlus}
        />
        <MetricCard
          label="Avg patients / doctor"
          value={data.totals.averagePatientsPerDoctor}
          hint="Workload balance indicator"
          icon={Activity}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <PatientsTrendChart data={data.trends.patients} />
        <PatientsPerDoctorChart data={data.patientsPerDoctor} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ConditionDonutChart data={data.patientsByCondition} />
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold">Specialization mix</h3>
          <div className="space-y-3">
            {data.doctorsBySpecialization.map((item) => (
              <div
                key={item.specialization}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5"
              >
                <span className="text-sm text-foreground">
                  {item.specialization}
                </span>
                <span className="text-sm font-semibold text-primary">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
