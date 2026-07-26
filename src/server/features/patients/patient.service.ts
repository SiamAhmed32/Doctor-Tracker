import { AppError } from "../../shared/errors/app-error";
import { buildCreatedAtFilter } from "../../shared/lib/date-range";
import { buildPagination, getSkip } from "../../shared/lib/pagination";
import { exactInsensitive } from "../../shared/lib/text-match";
import { doctorRepository } from "../doctors/doctor.repository";
import { toPublicPatient, toPublicPatientWithDoctor } from "./patient.mapper";
import { patientRepository } from "./patient.repository";
import type {
  CreatePatientInput,
  DoctorPatientsQuery,
  PatientListQuery,
  UpdatePatientInput,
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

  async list(query: PatientListQuery) {
    const filter: Record<string, unknown> = {
      ...buildCreatedAtFilter({ from: query.from, to: query.to }),
    };

    if (query.doctorId) {
      filter.doctor = query.doctorId;
    }

    if (query.condition) {
      filter.condition = exactInsensitive(query.condition);
    }

    const useTextScore = Boolean(query.search);
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const skip = getSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      patientRepository.findMany(filter, skip, query.limit, useTextScore),
      patientRepository.count(filter),
    ]);

    return {
      data: (
        items as unknown as Parameters<typeof toPublicPatientWithDoctor>[0][]
      ).map(toPublicPatientWithDoctor),
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async update(id: string, input: UpdatePatientInput) {
    const existing = await patientRepository.findById(id);
    if (!existing) {
      throw new AppError("Patient not found", 404);
    }

    const { doctorId, ...fields } = input;
    const updateData: Record<string, unknown> = { ...fields };

    if (doctorId) {
      await this.assertDoctorExists(doctorId);
      updateData.doctor = doctorId;
    }

    const updated = await patientRepository.updateById(id, updateData);
    if (!updated) {
      throw new AppError("Patient not found", 404);
    }

    return toPublicPatientWithDoctor(
      updated as unknown as Parameters<typeof toPublicPatientWithDoctor>[0],
    );
  }

  async remove(id: string) {
    const deleted = await patientRepository.deleteById(id);
    if (!deleted) {
      throw new AppError("Patient not found", 404);
    }
    return { id };
  }
}

export const patientService = new PatientService();
