import { AppError } from "../../shared/errors/app-error";
import { buildCreatedAtFilter } from "../../shared/lib/date-range";
import { buildPagination, getSkip } from "../../shared/lib/pagination";
import { toPublicDoctor } from "./doctor.mapper";
import { doctorRepository } from "./doctor.repository";
import type { CreateDoctorInput, DoctorListQuery } from "./doctor.validation";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactInsensitive(value: string): RegExp {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}

export class DoctorService {
  async create(input: CreateDoctorInput) {
    const existing = await doctorRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("Doctor email already exists", 409);
    }

    const doctor = await doctorRepository.create(input);
    return toPublicDoctor(doctor);
  }

  async getById(id: string) {
    const doctor = await doctorRepository.findById(id);
    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }
    return toPublicDoctor(doctor);
  }

  async list(query: DoctorListQuery) {
    const filter: Record<string, unknown> = {
      ...buildCreatedAtFilter({ from: query.from, to: query.to }),
    };

    if (query.specialization) {
      filter.specialization = exactInsensitive(query.specialization);
    }

    if (query.hospital) {
      filter.hospital = exactInsensitive(query.hospital);
    }

    if (query.search) {
      const pattern = new RegExp(escapeRegex(query.search), "i");
      filter.$or = [
        { name: pattern },
        { email: pattern },
        { specialization: pattern },
        { hospital: pattern },
        { phone: pattern },
      ];
    }

    const skip = getSkip(query.page, query.limit);
    const [items, total] = await Promise.all([
      doctorRepository.findMany(filter, skip, query.limit),
      doctorRepository.count(filter),
    ]);

    return {
      data: items.map(toPublicDoctor),
      pagination: buildPagination(query.page, query.limit, total),
    };
  }
}

export const doctorService = new DoctorService();
