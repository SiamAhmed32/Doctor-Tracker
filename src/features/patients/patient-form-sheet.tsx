"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getErrorMessage } from "@/features/auth/get-error-message";
import {
  useAddDoctorPatientMutation,
  useGetDoctorsQuery,
} from "@/features/doctors/doctors-api";
import {
  PatientFormFields,
  type PatientFormState,
} from "./patient-form-fields";
import { useUpdatePatientMutation } from "./patients-api";
import type { Patient } from "./types";

type PatientFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  fixedDoctorId?: string;
};

const emptyForm: PatientFormState = {
  name: "",
  age: "",
  phone: "",
  email: "",
  condition: "",
  doctorId: "",
};

function toForm(patient?: Patient | null, fixedDoctorId?: string): PatientFormState {
  if (patient) {
    return {
      name: patient.name,
      age: patient.age?.toString() ?? "",
      phone: patient.phone,
      email: patient.email ?? "",
      condition: patient.condition,
      doctorId: patient.doctor?.id ?? patient.doctorId ?? "",
    };
  }
  return { ...emptyForm, doctorId: fixedDoctorId ?? "" };
}

function PatientFormBody({
  patient,
  fixedDoctorId,
  onDone,
}: {
  patient?: Patient | null;
  fixedDoctorId?: string;
  onDone: () => void;
}) {
  const [form, setForm] = useState<PatientFormState>(() =>
    toForm(patient, fixedDoctorId),
  );
  const { data: doctorsData } = useGetDoctorsQuery({ page: 1, limit: 100 });
  const [addPatient, addState] = useAddDoctorPatientMutation();
  const [updatePatient, updateState] = useUpdatePatientMutation();
  const isEdit = Boolean(patient);
  const isLoading = addState.isLoading || updateState.isLoading;
  const error = addState.error || updateState.error;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const body = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      condition: form.condition.trim(),
      email: form.email.trim() || undefined,
      age: form.age ? Number(form.age) : undefined,
    };

    try {
      if (patient) {
        await updatePatient({
          id: patient.id,
          body: { ...body, doctorId: form.doctorId || undefined },
        }).unwrap();
      } else {
        const doctorId = fixedDoctorId || form.doctorId;
        await addPatient({ id: doctorId, body }).unwrap();
      }
      onDone();
    } catch {
      // shown below
    }
  }

  return (
    <form className="space-y-4 p-6" onSubmit={onSubmit}>
      <PatientFormFields
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        doctors={doctorsData?.data ?? []}
        showDoctorSelect={!fixedDoctorId}
      />
      {error ? (
        <p className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive">
          {getErrorMessage(error, "Could not save patient")}
        </p>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || (!isEdit && !(fixedDoctorId || form.doctorId))}
        >
          {isLoading ? "Saving..." : isEdit ? "Save changes" : "Add patient"}
        </Button>
      </div>
    </form>
  );
}

export function PatientFormSheet({
  open,
  onOpenChange,
  patient,
  fixedDoctorId,
}: PatientFormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto p-0">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>{patient ? "Edit patient" : "Add patient"}</SheetTitle>
        </SheetHeader>
        {open ? (
          <PatientFormBody
            key={patient?.id ?? `new-${fixedDoctorId ?? "patient"}`}
            patient={patient}
            fixedDoctorId={fixedDoctorId}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
