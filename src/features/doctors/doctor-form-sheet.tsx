"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getErrorMessage } from "@/features/auth/get-error-message";
import {
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
} from "./doctors-api";
import type { Doctor, DoctorInput } from "./types";

type DoctorFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: Doctor | null;
};

const emptyForm: DoctorInput = {
  name: "",
  specialization: "",
  hospital: "",
  phone: "",
  email: "",
};

function toForm(doctor?: Doctor | null): DoctorInput {
  if (!doctor) return emptyForm;
  return {
    name: doctor.name,
    specialization: doctor.specialization,
    hospital: doctor.hospital,
    phone: doctor.phone,
    email: doctor.email,
  };
}

function DoctorFormBody({
  doctor,
  onDone,
}: {
  doctor?: Doctor | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState<DoctorInput>(() => toForm(doctor));
  const [createDoctor, createState] = useCreateDoctorMutation();
  const [updateDoctor, updateState] = useUpdateDoctorMutation();
  const isEdit = Boolean(doctor);
  const isLoading = createState.isLoading || updateState.isLoading;
  const error = createState.error || updateState.error;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (doctor) {
        await updateDoctor({ id: doctor.id, body: form }).unwrap();
      } else {
        await createDoctor(form).unwrap();
      }
      onDone();
    } catch {
      // surfaced via mutation error
    }
  }

  return (
    <form className="space-y-4 p-6" onSubmit={onSubmit}>
      {(
        [
          ["name", "Full name"],
          ["specialization", "Specialization"],
          ["hospital", "Hospital"],
          ["phone", "Phone"],
          ["email", "Email"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={key === "email" ? "email" : "text"}
            value={form[key]}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, [key]: event.target.value }))
            }
            required
          />
        </div>
      ))}
      {error ? (
        <p
          role="alert"
          className="rounded-md bg-destructive-soft px-3 py-2 text-sm text-destructive"
        >
          {getErrorMessage(error, "Could not save doctor")}
        </p>
      ) : null}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEdit ? "Save changes" : "Create doctor"}
        </Button>
      </div>
    </form>
  );
}

export function DoctorFormSheet({
  open,
  onOpenChange,
  doctor,
}: DoctorFormSheetProps) {
  const isEdit = Boolean(doctor);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto p-0">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle>{isEdit ? "Edit doctor" : "Add doctor"}</SheetTitle>
        </SheetHeader>
        {open ? (
          <DoctorFormBody
            key={doctor?.id ?? "new-doctor"}
            doctor={doctor}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
