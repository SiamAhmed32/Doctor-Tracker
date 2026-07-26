import { DoctorModel } from "../doctors/doctor.model";
import { PatientModel } from "../patients/patient.model";

type DateCountRow = {
  date: string;
  count: number;
};

export class DashboardRepository {
  countDoctors(): Promise<number> {
    return DoctorModel.countDocuments();
  }

  countPatients(): Promise<number> {
    return PatientModel.countDocuments();
  }

  patientsPerDoctor(limit: number) {
    return DoctorModel.aggregate<{
      doctorId: string;
      doctorName: string;
      specialization: string;
      patientCount: number;
    }>([
      {
        $lookup: {
          from: "patients",
          let: { doctorId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$doctor", "$$doctorId"] } } },
            { $count: "count" },
          ],
          as: "stats",
        },
      },
      {
        $project: {
          _id: 0,
          doctorId: { $toString: "$_id" },
          doctorName: "$name",
          specialization: 1,
          patientCount: {
            $ifNull: [{ $arrayElemAt: ["$stats.count", 0] }, 0],
          },
        },
      },
      { $sort: { patientCount: -1, doctorName: 1 } },
      { $limit: limit },
    ]);
  }

  doctorsBySpecialization() {
    return DoctorModel.aggregate<{ specialization: string; count: number }>([
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          specialization: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1, specialization: 1 } },
    ]);
  }

  patientsByCondition() {
    return PatientModel.aggregate<{ condition: string; count: number }>([
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          condition: "$_id",
          count: 1,
        },
      },
      { $sort: { count: -1, condition: 1 } },
      { $limit: 8 },
    ]);
  }

  dailyCreatedCounts(
    model: typeof DoctorModel | typeof PatientModel,
    from: Date,
    to: Date,
    timezone: string,
  ): Promise<DateCountRow[]> {
    return model.aggregate<DateCountRow>([
      {
        $match: {
          createdAt: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone,
            },
          },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, date: "$_id", count: 1 } },
      { $sort: { date: 1 } },
    ]);
  }
}

export const dashboardRepository = new DashboardRepository();
