import dotenv from "dotenv";
import mongoose from "mongoose";
import { DoctorModel } from "../src/server/features/doctors/doctor.model";
import { PatientModel } from "../src/server/features/patients/patient.model";

dotenv.config({ path: ".env.local" });

const doctors = [
  {
    name: "Dr. Sarah Ahmed",
    specialization: "Cardiology",
    hospital: "Square Hospital",
    phone: "01711000001",
    email: "sarah.ahmed@square.health",
  },
  {
    name: "Dr. Rafiq Islam",
    specialization: "Neurology",
    hospital: "Evercare Hospital",
    phone: "01711000002",
    email: "rafiq.islam@evercare.health",
  },
  {
    name: "Dr. Nabila Chowdhury",
    specialization: "Pediatrics",
    hospital: "United Hospital",
    phone: "01711000003",
    email: "nabila.chowdhury@united.health",
  },
  {
    name: "Dr. Imran Hossain",
    specialization: "Orthopedics",
    hospital: "Apollo Imperial",
    phone: "01711000004",
    email: "imran.hossain@apollo.health",
  },
  {
    name: "Dr. Farhana Kabir",
    specialization: "Dermatology",
    hospital: "Labaid Specialized",
    phone: "01711000005",
    email: "farhana.kabir@labaid.health",
  },
  {
    name: "Dr. Tanvir Rahman",
    specialization: "Cardiology",
    hospital: "Ibn Sina Hospital",
    phone: "01711000006",
    email: "tanvir.rahman@ibnsina.health",
  },
];

const patientSeeds = [
  ["Karim Hasan", 42, "01822000001", "Hypertension"],
  ["Lubna Akter", 35, "01822000002", "Migraine"],
  ["Sabbir Rahman", 28, "01822000003", "Diabetes"],
  ["Nadia Islam", 51, "01822000004", "Asthma"],
  ["Jahid Khan", 60, "01822000005", "Arthritis"],
  ["Maliha Sultana", 22, "01822000006", "Allergy"],
  ["Arif Mahmud", 47, "01822000007", "Hypertension"],
  ["Ruma Begum", 33, "01822000008", "Diabetes"],
  ["Fahim Chowdhury", 19, "01822000009", "Fracture"],
  ["Shaila Noor", 44, "01822000010", "Dermatitis"],
  ["Mehedi Hasan", 39, "01822000011", "Migraine"],
  ["Tania Rahman", 27, "01822000012", "Asthma"],
  ["Omar Faruk", 55, "01822000013", "Hypertension"],
  ["Priya Das", 31, "01822000014", "Allergy"],
  ["Nasir Uddin", 48, "01822000015", "Diabetes"],
  ["Anika Tabassum", 24, "01822000016", "Anxiety"],
  ["Shakil Ahmed", 36, "01822000017", "Back Pain"],
  ["Rasheda Khatun", 58, "01822000018", "Arthritis"],
] as const;

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function seedDemoData() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  await mongoose.connect(uri);

  await PatientModel.deleteMany({});
  await DoctorModel.deleteMany({});

  const createdDoctors = await DoctorModel.insertMany(
    doctors.map((doctor, index) => ({
      ...doctor,
      createdAt: daysAgo(40 - index * 3),
      updatedAt: daysAgo(40 - index * 3),
    })),
  );

  const patients = patientSeeds.map((patient, index) => {
    const doctor = createdDoctors[index % createdDoctors.length];
    const [name, age, phone, condition] = patient;
    return {
      name,
      age,
      phone,
      condition,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      doctor: doctor._id,
      createdAt: daysAgo(28 - (index % 26)),
      updatedAt: daysAgo(28 - (index % 26)),
    };
  });

  await PatientModel.insertMany(patients);

  console.log(`Seeded ${createdDoctors.length} doctors`);
  console.log(`Seeded ${patients.length} patients`);
  await mongoose.disconnect();
}

seedDemoData().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
