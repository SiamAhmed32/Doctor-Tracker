import { AppError } from "../../shared/errors/app-error";
import { signToken } from "../../shared/lib/jwt";
import { comparePassword, hashPassword } from "../../shared/lib/password";
import { userRepository } from "../users/user.repository";
import type { LoginInput, RegisterInput } from "./auth.validation";

function toPublicUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export class AuthService {
  async register(input: RegisterInput) {
    const totalUsers = await userRepository.count();
    if (totalUsers > 0) {
      throw new AppError("Registration is closed", 403);
    }

    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    const password = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password,
      role: "admin",
    });

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user: toPublicUser(user), token };
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const matched = await comparePassword(input.password, user.password);
    if (!matched) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user: toPublicUser(user), token };
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toPublicUser(user);
  }
}

export const authService = new AuthService();
