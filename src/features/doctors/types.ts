export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DoctorInput = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
};

export type Paginated<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type DoctorListParams = {
  page?: number;
  limit?: number;
  search?: string;
  specialization?: string;
  hospital?: string;
  from?: string;
  to?: string;
};
