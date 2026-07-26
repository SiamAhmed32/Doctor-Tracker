export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: AuthUser;
};

export type MeResponse = {
  user: AuthUser;
};
