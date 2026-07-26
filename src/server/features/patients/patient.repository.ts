import { PatientModel, type PatientDocument } from "./patient.model";

type CreatePatientInput = {
  name: string;
  age?: number;
  phone: string;
  email?: string;
  condition: string;
  doctor: string;
};

type PatientFilter = Record<string, unknown>;

export class PatientRepository {
  create(data: CreatePatientInput): Promise<PatientDocument> {
    return PatientModel.create(data);
  }

  findById(id: string): Promise<PatientDocument | null> {
    return PatientModel.findById(id);
  }

  findByDoctor(
    doctorId: string,
    filter: PatientFilter,
    skip: number,
    limit: number,
  ): Promise<PatientDocument[]> {
    return PatientModel.find({ ...filter, doctor: doctorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec() as Promise<PatientDocument[]>;
  }

  countByDoctor(doctorId: string, filter: PatientFilter): Promise<number> {
    return PatientModel.countDocuments({ ...filter, doctor: doctorId });
  }

  deleteByIdForDoctor(
    patientId: string,
    doctorId: string,
  ): Promise<PatientDocument | null> {
    return PatientModel.findOneAndDelete({
      _id: patientId,
      doctor: doctorId,
    });
  }
}

export const patientRepository = new PatientRepository();
