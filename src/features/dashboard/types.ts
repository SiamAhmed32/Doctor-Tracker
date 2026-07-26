export type DashboardOverview = {
  totals: {
    doctors: number;
    patients: number;
    averagePatientsPerDoctor: number;
  };
  range: {
    from: string | null;
    to: string | null;
    doctorsCreated: number;
    patientsCreated: number;
  };
  comparison: {
    previousPatientsCreated: number;
    patientRegistrationChange: number | null;
  };
  patientsPerDoctor: Array<{
    doctorId: string;
    doctorName: string;
    specialization: string;
    patientCount: number;
  }>;
  doctorsBySpecialization: Array<{
    specialization: string;
    count: number;
  }>;
  patientsByCondition: Array<{
    condition: string;
    count: number;
  }>;
  trends: {
    doctors: Array<{ date: string; count: number }>;
    patients: Array<{ date: string; count: number }>;
  };
};
