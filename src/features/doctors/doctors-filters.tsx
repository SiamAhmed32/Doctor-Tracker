"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DoctorsFiltersProps = {
  search: string;
  specialization: string;
  hospital: string;
  onSearchChange: (value: string) => void;
  onSpecializationChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onReset: () => void;
};

export function DoctorsFilters({
  search,
  specialization,
  hospital,
  onSearchChange,
  onSpecializationChange,
  onHospitalChange,
  onReset,
}: DoctorsFiltersProps) {
  return (
    <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-4">
      <Input
        placeholder="Search doctors..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <Input
        placeholder="Specialization"
        value={specialization}
        onChange={(event) => onSpecializationChange(event.target.value)}
      />
      <Input
        placeholder="Hospital"
        value={hospital}
        onChange={(event) => onHospitalChange(event.target.value)}
      />
      <Button type="button" variant="outline" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
