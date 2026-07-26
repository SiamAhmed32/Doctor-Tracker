"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DoctorFormSheet } from "./doctor-form-sheet";
import { DoctorsFilters } from "./doctors-filters";
import { DoctorsTable } from "./doctors-table";
import { useGetDoctorsQuery } from "./doctors-api";
import type { Doctor } from "./types";

export function DoctorsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hospital, setHospital] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useGetDoctorsQuery({
    page,
    limit: 8,
    search: debouncedSearch || undefined,
    specialization: specialization.trim() || undefined,
    hospital: hospital.trim() || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  function resetFilters() {
    setSearch("");
    setSpecialization("");
    setHospital("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Doctors"
        description="Search, filter, and manage clinician records."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add doctor
          </Button>
        }
      />

      <DoctorsFilters
        search={search}
        specialization={specialization}
        hospital={hospital}
        from={from}
        to={to}
        onSearchChange={setSearch}
        onSpecializationChange={(value) => {
          setSpecialization(value);
          setPage(1);
        }}
        onHospitalChange={(value) => {
          setHospital(value);
          setPage(1);
        }}
        onFromChange={(value) => {
          setFrom(value);
          setPage(1);
        }}
        onToChange={(value) => {
          setTo(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : isError || !data ? (
          <p className="p-6 text-sm text-muted-foreground">
            Could not load doctors.
          </p>
        ) : data.data.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No doctors match your filters.
          </p>
        ) : (
          <>
            <DoctorsTable
              doctors={data.data}
              onEdit={(doctor) => {
                setEditing(doctor);
                setSheetOpen(true);
              }}
            />
            <PaginationBar
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              total={data.pagination.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <DoctorFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        doctor={editing}
      />
    </div>
  );
}
