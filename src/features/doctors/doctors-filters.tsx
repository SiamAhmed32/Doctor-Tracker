"use client";

import { Button } from "@/components/ui/button";
import { FilterField } from "@/components/shared/filter-field";

type DoctorsFiltersProps = {
  search: string;
  specialization: string;
  hospital: string;
  from: string;
  to: string;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onReset: () => void;
};

export function DoctorsFilters({
  search,
  specialization,
  hospital,
  from,
  to,
  onSearchChange,
  onSpecializationChange,
  onHospitalChange,
  onFromChange,
  onToChange,
  onReset,
}: DoctorsFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-3">
      <FilterField
        id="doctor-search"
        label="Search"
        value={search}
        onChange={onSearchChange}
        placeholder="Name, email, hospital..."
      />
      <FilterField
        id="doctor-specialization"
        label="Specialization"
        value={specialization}
        onChange={onSpecializationChange}
        placeholder="e.g. Cardiology"
      />
      <FilterField
        id="doctor-hospital"
        label="Hospital"
        value={hospital}
        onChange={onHospitalChange}
        placeholder="Hospital name"
      />
      <FilterField
        id="doctor-from"
        label="From date"
        type="date"
        value={from}
        onChange={onFromChange}
      />
      <FilterField
        id="doctor-to"
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
