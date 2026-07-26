"use client";

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { useGetMeQuery } from "@/features/auth/auth-api";
import { BreakdownPanel } from "./breakdown-panel";
import { useGetDashboardQuery } from "./dashboard-api";
import { DashboardRangeControls } from "./dashboard-range-controls";
import { MetricCard } from "./metric-card";
import { PatientsPerDoctorChart } from "./patients-per-doctor-chart";
import { PatientsTrendChart } from "./patients-trend-chart";

export function DashboardView() {
  const { data: me } = useGetMeQuery();
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") || undefined;
  const to = searchParams?.get("to") || undefined;
  const { data, isLoading, isError } = useGetDashboardQuery({
    doctorLimit: 6,
    from,
    to,
  });

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

  const rangeLabel =
    data.range.from && data.range.to
      ? `${data.range.from} → ${data.range.to}`
      : "current period";
  const change = data.comparison.patientRegistrationChange;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good day, ${me?.user.name?.split(" ")[0] ?? "Admin"}`}
        description={`Network overview for ${rangeLabel}.`}
        actions={
          <Button asChild>
            <Link href="/doctors">Add doctor</Link>
          </Button>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          label="New patients"
          value={data.range.patientsCreated}
          hint={`Registered in ${rangeLabel}`}
          icon={UserPlus}
        />
        <MetricCard
          label="Avg patients / doctor"
          value={data.totals.averagePatientsPerDoctor}
          hint="Average assigned caseload"
          icon={Activity}
        />
      </section>

      <DashboardRangeControls
        from={data.range.from ?? ""}
        to={data.range.to ?? ""}
      />

      <section className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Registration insight
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {change === null
              ? `${data.range.patientsCreated} new patients in this period; no prior-period baseline is available.`
              : `${data.range.patientsCreated} new patients compared with ${data.comparison.previousPatientsCreated} in the preceding period.`}
          </p>
        </div>
        {change !== null ? (
          <div
            className={`flex shrink-0 items-center gap-1.5 text-sm font-semibold ${
              change >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {change >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(change)}% vs prior period
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        <PatientsTrendChart data={data.trends.patients} />
        <div className="xl:col-span-2">
          <PatientsPerDoctorChart data={data.patientsPerDoctor} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <BreakdownPanel
          title="Patients by condition"
          description="Which conditions appear most often across all patients."
          items={data.patientsByCondition.map((item) => ({
            label: item.condition,
            count: item.count,
          }))}
          emptyLabel="No patient condition data yet."
          unitLabel="patients"
        />
        <BreakdownPanel
          title="Doctors by specialization"
          description="How your clinician roster is split across specialties."
          items={data.doctorsBySpecialization.map((item) => ({
            label: item.specialization,
            count: item.count,
          }))}
          emptyLabel="No specialization data yet."
          unitLabel="doctors"
        />
      </section>
    </div>
  );
}
