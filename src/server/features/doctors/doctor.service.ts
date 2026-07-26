import { AppError } from "../../shared/errors/app-error";
import { buildCreatedAtFilter } from "../../shared/lib/date-range";
import { buildPagination, getSkip } from "../../shared/lib/pagination";
import { normalizeFilterValue } from "../../shared/lib/text-match";
import { toPublicDoctor } from "./doctor.mapper";
import { doctorRepository } from "./doctor.repository";
import type {
  CreateDoctorInput,
  DoctorListQuery,
  UpdateDoctorInput,
} from "./doctor.validation";

export class DoctorService {
  async create(input: CreateDoctorInput) {
    const existing = await doctorRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("Doctor email already exists", 409);
    }

    const doctor = await doctorRepository.create({
      ...input,
      specialization: normalizeFilterValue(input.specialization),
      hospital: normalizeFilterValue(input.hospital),
    });
    return toPublicDoctor(doctor);
  }

  async getById(id: string) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }
    return toPublicDoctor(doctor);
  }

  async update(id: string, input: UpdateDoctorInput) {
    const existing = await doctorRepository.findById(id);
    if (!existing) {
      throw new AppError("Doctor not found", 404);
    }

    if (input.email && input.email !== existing.email) {
      const taken = await doctorRepository.findByEmail(input.email);
      if (taken) {
        throw new AppError("Doctor email already exists", 409);
      }
    }

    const payload = {
      ...input,
      ...(input.specialization
        ? { specialization: normalizeFilterValue(input.specialization) }
        : {}),
      ...(input.hospital ? { hospital: normalizeFilterValue(input.hospital) } : {}),
    };

    const updated = await doctorRepository.updateById(id, payload);
    if (!updated) {
      throw new AppError("Doctor not found", 404);
    }
    return toPublicDoctor(updated);
  }

  async list(query: DoctorListQuery) {
    const filter: Record<string, unknown> = {
      ...buildCreatedAtFilter({ from: query.from, to: query.to }),
    };

    if (query.specialization) {
      filter.specialization = normalizeFilterValue(query.specialization);
    }

    if (query.hospital) {
      filter.hospital = normalizeFilterValue(query.hospital);
    }

    const useTextScore = Boolean(query.search);
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const skip = getSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      doctorRepository.findMany(filter, skip, query.limit, useTextScore),
      doctorRepository.count(filter),
    ]);

    return {
      data: items.map(toPublicDoctor),
      pagination: buildPagination(query.page, query.limit, total),
    };
  }
}

export const doctorService = new DoctorService();
