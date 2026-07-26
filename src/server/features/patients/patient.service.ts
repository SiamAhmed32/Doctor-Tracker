import { AppError } from "../../shared/errors/app-error";
import { buildPagination, getSkip } from "../../shared/lib/pagination";
import { doctorRepository } from "../doctors/doctor.repository";
import { toPublicPatient } from "./patient.mapper";
import { patientRepository } from "./patient.repository";
import type {
  CreatePatientInput,
  DoctorPatientsQuery,
} from "./patient.validation";

export class PatientService {
  private async assertDoctorExists(doctorId: string): Promise<void> {
    const exists = await doctorRepository.existsById(doctorId);
    if (!exists) {
      throw new AppError("Doctor not found", 404);
    }
  }

  async createForDoctor(doctorId: string, input: CreatePatientInput) {
    await this.assertDoctorExists(doctorId);

    const patient = await patientRepository.create({
      ...input,
      doctor: doctorId,
    });

    return toPublicPatient(patient);
  }

  async listForDoctor(doctorId: string, query: DoctorPatientsQuery) {
    await this.assertDoctorExists(doctorId);

    const skip = getSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      patientRepository.findByDoctor(doctorId, {}, skip, query.limit),
      patientRepository.countByDoctor(doctorId, {}),
    ]);

    return {
      data: items.map(toPublicPatient),
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async deleteForDoctor(doctorId: string, patientId: string) {
    await this.assertDoctorExists(doctorId);

    const deleted = await patientRepository.deleteByIdForDoctor(
      patientId,
      doctorId,
    );

    if (!deleted) {
      throw new AppError("Patient not found for this doctor", 404);
    }

    return { id: patientId };
  }
}

export const patientService = new PatientService();
