"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DeletePatientDialog } from "./delete-patient-dialog";
import { PatientFormSheet } from "./patient-form-sheet";
import { PatientsTable } from "./patients-table";
import { useGetPatientsQuery } from "./patients-api";
import type { Patient } from "./types";

export function PatientsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [condition, setCondition] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);

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
  });

  return (
    <div>
      <PageHeader
        title="Patients"
        description="Review patient records with search and condition filters."
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

      <div className="mb-4 grid gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:grid-cols-3">
        <Input
          placeholder="Search patients..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Input
          placeholder="Condition filter"
          value={condition}
          onChange={(event) => {
            setCondition(event.target.value);
            setPage(1);
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearch("");
            setCondition("");
            setPage(1);
          }}
        >
          Reset
        </Button>
      </div>

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
