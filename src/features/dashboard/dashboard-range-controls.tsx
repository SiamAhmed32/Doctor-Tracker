"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DashboardRangeControlsProps = {
  from: string;
  to: string;
};

function toDateInput(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function presetRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  return { from: toDateInput(from), to: toDateInput(to) };
}

export function DashboardRangeControls({
  from: initialFrom,
  to: initialTo,
}: DashboardRangeControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const invalidRange = Boolean(from && to && from > to);

  function updateUrl(nextFrom: string, nextTo: string) {
    const params = new URLSearchParams(searchParams?.toString());
    if (nextFrom) {
      params.set("from", nextFrom);
    } else {
      params.delete("from");
    }
    if (nextTo) {
      params.set("to", nextTo);
    } else {
      params.delete("to");
    }
    const query = params.toString();
    const targetPath = pathname || "/dashboard";
    router.replace(query ? `${targetPath}?${query}` : targetPath);
  }

  function applyRange() {
    if (!invalidRange) updateUrl(from, to);
  }

  function applyPreset(days: number) {
    const range = presetRange(days);
    setFrom(range.from);
    setTo(range.to);
    updateUrl(range.from, range.to);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            Analytics period
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The selected range is saved in the URL and can be shared.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => applyPreset(days)}
            >
              Last {days} days
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="space-y-1.5">
          <Label htmlFor="dashboard-from">From date</Label>
          <Input
            id="dashboard-from"
            type="date"
            value={from}
            max={to || undefined}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dashboard-to">To date</Label>
          <Input
            id="dashboard-to"
            type="date"
            value={to}
            min={from || undefined}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button type="button" className="w-full" onClick={applyRange} disabled={invalidRange}>
            Apply range
          </Button>
        </div>
      </div>
      {invalidRange ? (
        <p role="alert" className="mt-2 text-xs text-destructive">
          The start date must be before the end date.
        </p>
      ) : null}
    </section>
  );
}
