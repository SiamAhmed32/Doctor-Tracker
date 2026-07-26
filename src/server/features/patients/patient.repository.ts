import { PatientModel, type PatientDocument } from "./patient.model";

type CreatePatientInput = {
  name: string;
  age?: number;
  phone: string;
  email?: string;
  condition: string;
  doctor: string;
};

type UpdatePatientInput = Partial<{
  name: string;
  age: number;
  phone: string;
  email: string;
  condition: string;
  doctor: string;
}>;

type PatientFilter = Record<string, unknown>;

const DOCTOR_SUMMARY_FIELDS = "name specialization hospital";

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

  findMany(
    filter: PatientFilter,
    skip: number,
    limit: number,
    useTextScore = false,
  ) {
    const query = PatientModel.find(filter).populate(
      "doctor",
      DOCTOR_SUMMARY_FIELDS,
    );

    if (useTextScore) {
      query.sort({ score: { $meta: "textScore" }, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    return query.skip(skip).limit(limit).lean().exec();
  }

  count(filter: PatientFilter): Promise<number> {
    return PatientModel.countDocuments(filter);
  }

  updateById(id: string, data: UpdatePatientInput) {
    return PatientModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("doctor", DOCTOR_SUMMARY_FIELDS);
  }

  deleteById(id: string): Promise<PatientDocument | null> {
    return PatientModel.findByIdAndDelete(id);
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
