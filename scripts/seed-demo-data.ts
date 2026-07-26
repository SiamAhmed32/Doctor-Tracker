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

/** doctorIndex + daysAgo create uneven caseloads and a readable trend. */
const patientSeeds = [
  { name: "Karim Hasan", age: 42, phone: "01822000001", condition: "Hypertension", doctorIndex: 0, daysAgo: 2 },
  { name: "Lubna Akter", age: 35, phone: "01822000002", condition: "Migraine", doctorIndex: 0, daysAgo: 2 },
  { name: "Sabbir Rahman", age: 28, phone: "01822000003", condition: "Diabetes", doctorIndex: 0, daysAgo: 3 },
  { name: "Nadia Islam", age: 51, phone: "01822000004", condition: "Asthma", doctorIndex: 0, daysAgo: 5 },
  { name: "Jahid Khan", age: 60, phone: "01822000005", condition: "Arthritis", doctorIndex: 0, daysAgo: 8 },
  { name: "Maliha Sultana", age: 22, phone: "01822000006", condition: "Allergy", doctorIndex: 1, daysAgo: 3 },
  { name: "Arif Mahmud", age: 47, phone: "01822000007", condition: "Hypertension", doctorIndex: 1, daysAgo: 4 },
  { name: "Ruma Begum", age: 33, phone: "01822000008", condition: "Diabetes", doctorIndex: 1, daysAgo: 9 },
  { name: "Fahim Chowdhury", age: 19, phone: "01822000009", condition: "Fracture", doctorIndex: 1, daysAgo: 12 },
  { name: "Shaila Noor", age: 44, phone: "01822000010", condition: "Dermatitis", doctorIndex: 2, daysAgo: 6 },
  { name: "Mehedi Hasan", age: 39, phone: "01822000011", condition: "Migraine", doctorIndex: 2, daysAgo: 7 },
  { name: "Tania Rahman", age: 27, phone: "01822000012", condition: "Asthma", doctorIndex: 2, daysAgo: 14 },
  { name: "Omar Faruk", age: 55, phone: "01822000013", condition: "Hypertension", doctorIndex: 3, daysAgo: 10 },
  { name: "Priya Das", age: 31, phone: "01822000014", condition: "Allergy", doctorIndex: 3, daysAgo: 15 },
  { name: "Nasir Uddin", age: 48, phone: "01822000015", condition: "Diabetes", doctorIndex: 4, daysAgo: 11 },
  { name: "Anika Tabassum", age: 24, phone: "01822000016", condition: "Anxiety", doctorIndex: 4, daysAgo: 18 },
  { name: "Shakil Ahmed", age: 36, phone: "01822000017", condition: "Back Pain", doctorIndex: 5, daysAgo: 16 },
  { name: "Rasheda Khatun", age: 58, phone: "01822000018", condition: "Arthritis", doctorIndex: 5, daysAgo: 20 },
  { name: "Imtiaz Alam", age: 41, phone: "01822000019", condition: "Hypertension", doctorIndex: 0, daysAgo: 1 },
  { name: "Farzana Haque", age: 29, phone: "01822000020", condition: "Diabetes", doctorIndex: 1, daysAgo: 1 },
] as const;

function daysAgo(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
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
      createdAt: daysAgo(45 - index * 4),
      updatedAt: daysAgo(45 - index * 4),
    })),
  );

  const patients = patientSeeds.map((patient) => {
    const doctor = createdDoctors[patient.doctorIndex];
    return {
      name: patient.name,
      age: patient.age,
      phone: patient.phone,
      condition: patient.condition,
      email: `${patient.name.toLowerCase().replace(/\s+/g, ".")}@mail.com`,
      doctor: doctor._id,
      createdAt: daysAgo(patient.daysAgo),
      updatedAt: daysAgo(patient.daysAgo),
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
