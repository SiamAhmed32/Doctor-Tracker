"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { DeletePatientDialog } from "@/features/patients/delete-patient-dialog";
import { PatientFormSheet } from "@/features/patients/patient-form-sheet";
import { PatientsTable } from "@/features/patients/patients-table";
import type { Patient } from "@/features/patients/types";
import { DoctorFormSheet } from "./doctor-form-sheet";
import {
  useGetDoctorPatientsQuery,
  useGetDoctorQuery,
} from "./doctors-api";

type DoctorDetailViewProps = {
  doctorId: string;
};

export function DoctorDetailView({ doctorId }: DoctorDetailViewProps) {
  const [page, setPage] = useState(1);
  const [editDoctorOpen, setEditDoctorOpen] = useState(false);
  const [patientSheetOpen, setPatientSheetOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  const { data: doctorData, isLoading: doctorLoading } =
    useGetDoctorQuery(doctorId);
  const { data: patientsData, isLoading: patientsLoading } =
    useGetDoctorPatientsQuery({ id: doctorId, page, limit: 6 });

  if (doctorLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const doctor = doctorData?.doctor;
  if (!doctor) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Doctor not found.{" "}
        <Link href="/doctors" className="text-primary underline">
          Back to doctors
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href="/doctors">
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>
      </Button>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {doctor.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {doctor.specialization} · {doctor.hospital}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{doctor.phone}</Badge>
              <Badge variant="secondary">{doctor.email}</Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setEditDoctorOpen(true)}>
              Edit doctor
            </Button>
            <Button
              onClick={() => {
                setEditingPatient(null);
                setPatientSheetOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add patient
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-semibold">Patients under this doctor</h3>
        <Card className="overflow-hidden">
          {patientsLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : !patientsData || patientsData.data.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No patients assigned yet.
            </p>
          ) : (
            <>
              <PatientsTable
                patients={patientsData.data.map((patient) => ({
                  ...patient,
                  doctor: {
                    id: doctor.id,
                    name: doctor.name,
                    specialization: doctor.specialization,
                    hospital: doctor.hospital,
                  },
                }))}
                onEdit={(patient) => {
                  setEditingPatient(patient);
                  setPatientSheetOpen(true);
                }}
                onDelete={setDeletingPatient}
              />
              <PaginationBar
                page={patientsData.pagination.page}
                totalPages={patientsData.pagination.totalPages}
                total={patientsData.pagination.total}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>
      </div>

      <DoctorFormSheet
        open={editDoctorOpen}
        onOpenChange={setEditDoctorOpen}
        doctor={doctor}
      />
      <PatientFormSheet
        open={patientSheetOpen}
        onOpenChange={setPatientSheetOpen}
        patient={editingPatient}
        fixedDoctorId={doctor.id}
      />
      <DeletePatientDialog
        patient={deletingPatient}
        open={Boolean(deletingPatient)}
        onOpenChange={(open) => {
          if (!open) setDeletingPatient(null);
        }}
      />
    </div>
  );
}
