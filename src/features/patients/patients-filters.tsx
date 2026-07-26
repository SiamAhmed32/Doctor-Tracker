"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterField } from "@/components/shared/filter-field";
import type { Doctor } from "@/features/doctors/types";

type PatientsFiltersProps = {
  search: string;
  condition: string;
  doctorId: string;
  from: string;
  to: string;
  doctors: Doctor[];
  onSearchChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onDoctorIdChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onReset: () => void;
};

export function PatientsFilters({
  search,
  condition,
  doctorId,
  from,
  to,
  doctors,
  onSearchChange,
  onConditionChange,
  onDoctorIdChange,
  onFromChange,
  onToChange,
  onReset,
}: PatientsFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-3">
      <FilterField
        id="patient-search"
        label="Search"
        value={search}
        onChange={onSearchChange}
        placeholder="Name, phone, condition..."
      />
      <FilterField
        id="patient-condition"
        label="Condition"
        value={condition}
        onChange={onConditionChange}
        placeholder="e.g. Diabetes"
      />
      <div className="space-y-1.5">
        <Label htmlFor="patient-doctor-filter">Doctor</Label>
        <Select
          value={doctorId || "all"}
          onValueChange={(value) =>
            onDoctorIdChange(value === "all" ? "" : value)
          }
        >
          <SelectTrigger id="patient-doctor-filter">
            <SelectValue placeholder="All doctors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All doctors</SelectItem>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FilterField
        id="patient-from"
        label="From date"
        type="date"
        value={from}
        onChange={onFromChange}
      />
      <FilterField
        id="patient-to"
        label="To date"
        type="date"
        value={to}
        onChange={onToChange}
      />
      <div className="flex items-end">
        <Button type="button" variant="outline" className="w-full" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
