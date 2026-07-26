import type { PatientDocument } from "./patient.model";

export function toPublicPatient(patient: PatientDocument) {
  return {
    id: patient._id.toString(),
    name: patient.name,
    age: patient.age ?? null,
    phone: patient.phone,
    email: patient.email ?? null,
    condition: patient.condition,
    doctorId: patient.doctor.toString(),
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}
