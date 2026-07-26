import { DoctorModel, type DoctorDocument } from "./doctor.model";

type CreateDoctorInput = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

type DoctorFilter = Record<string, unknown>;

export class DoctorRepository {
  create(data: CreateDoctorInput): Promise<DoctorDocument> {
    return DoctorModel.create(data);
  }

  findById(id: string): Promise<DoctorDocument | null> {
    return DoctorModel.findById(id);
  }

  existsById(id: string): Promise<boolean> {
    return DoctorModel.exists({ _id: id }).then((doc) => Boolean(doc));
  }

  findByEmail(email: string): Promise<DoctorDocument | null> {
    return DoctorModel.findOne({ email: email.toLowerCase() });
  }

  updateById(
    id: string,
    data: Partial<CreateDoctorInput>,
  ): Promise<DoctorDocument | null> {
    return DoctorModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  findMany(
    filter: DoctorFilter,
    skip: number,
    limit: number,
    useTextScore = false,
  ): Promise<DoctorDocument[]> {
    const query = DoctorModel.find(filter);

    if (useTextScore) {
      query.sort({ score: { $meta: "textScore" }, createdAt: -1 });
    } else {
      query.sort({ createdAt: -1 });
    }

    return query.skip(skip).limit(limit).lean().exec() as Promise<
      DoctorDocument[]
    >;
  }

  count(filter: DoctorFilter): Promise<number> {
    return DoctorModel.countDocuments(filter);
  }
}

export const doctorRepository = new DoctorRepository();
