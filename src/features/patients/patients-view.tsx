"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { useGetDoctorsQuery } from "@/features/doctors/doctors-api";
import { DeletePatientDialog } from "./delete-patient-dialog";
import { PatientFormSheet } from "./patient-form-sheet";
import { PatientsFilters } from "./patients-filters";
import { PatientsTable } from "./patients-table";
import { useGetPatientsQuery } from "./patients-api";
import type { Patient } from "./types";

export function PatientsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

  const { data: doctorsData } = useGetDoctorsQuery({ page: 1, limit: 100 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useGetPatientsQuery({
    page,
    limit: 8,
    search: debouncedSearch || undefined,
    condition: condition.trim() || undefined,
    doctorId: doctorId || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  function resetFilters() {
    setSearch("");
    setCondition("");
    setDoctorId("");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Review patient records with search and filters."
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add patient
          </Button>
        }
      />

      <PatientsFilters
        search={search}
        condition={condition}
        doctorId={doctorId}
        from={from}
        to={to}
        doctors={doctorsData?.data ?? []}
        onSearchChange={setSearch}
        onConditionChange={(value) => {
          setCondition(value);
          setPage(1);
        }}
        onDoctorIdChange={(value) => {
          setDoctorId(value);
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
            Could not load patients.
          </p>
        ) : data.data.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            No patients match your filters.
          </p>
        ) : (
          <>
            <PatientsTable
              patients={data.data}
              onEdit={(patient) => {
                setEditing(patient);
                setSheetOpen(true);
              }}
              onDelete={setDeleting}
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

      <PatientFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        patient={editing}
      />
      <DeletePatientDialog
        patient={deleting}
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      />
    </div>
  );
}
