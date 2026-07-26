import type { PatientDocument } from "./patient.model";

type PopulatedDoctorRef = {
  _id: { toString(): string };
  name: string;
  specialization: string;
  hospital: string;
};

type PatientWithPopulatedDoctor = Omit<PatientDocument, "doctor"> & {
  doctor: PopulatedDoctorRef;
};

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

export function toPublicPatientWithDoctor(patient: PatientWithPopulatedDoctor) {
  return {
    id: patient._id.toString(),
    name: patient.name,
    age: patient.age ?? null,
    phone: patient.phone,
    email: patient.email ?? null,
    condition: patient.condition,
    doctor: {
      id: patient.doctor._id.toString(),
      name: patient.doctor.name,
      specialization: patient.doctor.specialization,
      hospital: patient.doctor.hospital,
    },
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
  };
}
