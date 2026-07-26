"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Doctor } from "@/features/doctors/types";

export type PatientFormState = {
  name: string;
  age: string;
  phone: string;
  email: string;
  condition: string;
  doctorId: string;
};

type PatientFormFieldsProps = {
  form: PatientFormState;
  onChange: (patch: Partial<PatientFormState>) => void;
  doctors: Doctor[];
  showDoctorSelect: boolean;
};

export function PatientFormFields({
  form,
  onChange,
  doctors,
  showDoctorSelect,
}: PatientFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="patient-name">Full name</Label>
        <Input
          id="patient-name"
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="patient-age">Age</Label>
          <Input
            id="patient-age"
            type="number"
            min={0}
            max={150}
            value={form.age}
            onChange={(e) => onChange({ age: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-phone">Phone</Label>
          <Input
            id="patient-phone"
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-email">Email</Label>
        <Input
          id="patient-email"
          type="email"
          value={form.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="patient-condition">Condition</Label>
        <Input
          id="patient-condition"
          value={form.condition}
          onChange={(e) => onChange({ condition: e.target.value })}
          required
        />
      </div>
      {showDoctorSelect ? (
        <div className="space-y-2">
          <Label htmlFor="patient-doctor">Doctor</Label>
          <Select
            value={form.doctorId || undefined}
            onValueChange={(value) => onChange({ doctorId: value })}
          >
            <SelectTrigger id="patient-doctor">
              <SelectValue placeholder="Select doctor" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </>
  );
}
