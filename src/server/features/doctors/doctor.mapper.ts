import { toDisplayLabel } from "../../shared/lib/display-label";
import type { DoctorDocument } from "./doctor.model";

export function toPublicDoctor(doctor: DoctorDocument) {
  return {
    id: doctor._id.toString(),
    name: doctor.name,
    specialization: toDisplayLabel(doctor.specialization),
    hospital: toDisplayLabel(doctor.hospital),
    phone: doctor.phone,
    email: doctor.email,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
  };
}
