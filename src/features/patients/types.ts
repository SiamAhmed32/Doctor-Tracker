export type PatientDoctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number | null;
  phone: string;
  email: string | null;
  condition: string;
  doctorId?: string;
  doctor?: PatientDoctor;
  createdAt?: string;
  updatedAt?: string;
};

export type PatientInput = {
  name: string;
  age?: number;
  phone: string;
  email?: string;
  condition: string;
  doctorId?: string;
};

export type PatientListParams = {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
  from?: string;
  to?: string;
};
