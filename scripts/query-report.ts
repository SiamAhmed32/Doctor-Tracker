import dotenv from "dotenv";
import mongoose from "mongoose";
import { DoctorModel } from "../src/server/features/doctors/doctor.model";
import { PatientModel } from "../src/server/features/patients/patient.model";
import { normalizeFilterValue } from "../src/server/shared/lib/text-match";

dotenv.config({ path: ".env.local" });

type ExplainResult = {
  queryPlanner?: { winningPlan?: unknown };
  executionStats?: {
    executionTimeMillis?: number;
    totalDocsExamined?: number;
    totalKeysExamined?: number;
    nReturned?: number;
  };
};

async function printReport(label: string, explain: Promise<unknown>) {
  const result = (await explain) as ExplainResult;
  console.log(
    JSON.stringify(
      {
        query: label,
        winningPlan: result.queryPlanner?.winningPlan,
        executionStats: result.executionStats,
      },
      null,
      2,
    ),
  );
}

/**
 * Explains the same filter shapes used in production list services:
 * - specialization / hospital / condition → normalizeFilterValue + equality
 * - search → $text
 * - doctor patients → doctor ObjectId + createdAt sort
 */
async function reportQueries() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required.");

  await mongoose.connect(uri);
  const doctor = await DoctorModel.collection.findOne({});

  // Same transforms as DoctorService.list / PatientService.list
  const specializationFilter = {
    specialization: normalizeFilterValue("Cardiology"),
  };
  const conditionFilter = {
    condition: normalizeFilterValue("Diabetes"),
  };

  await printReport(
    "Doctors: newest first",
    DoctorModel.collection.find({}).sort({ createdAt: -1 }).limit(20).explain("executionStats"),
  );
  await printReport(
    "Doctors: specialization filter (production equality)",
    DoctorModel.collection
      .find(specializationFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .explain("executionStats"),
  );
  await printReport(
    "Doctors: text search",
    DoctorModel.collection
      .find({ $text: { $search: "Cardiology" } })
      .limit(20)
      .explain("executionStats"),
  );
  await printReport(
    "Patients: condition filter (production equality)",
    PatientModel.collection
      .find(conditionFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .explain("executionStats"),
  );

  if (doctor) {
    await printReport(
      "Patients: doctor relationship",
      PatientModel.collection
        .find({ doctor: doctor._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .explain("executionStats"),
    );
  }

  await mongoose.disconnect();
}

reportQueries().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
