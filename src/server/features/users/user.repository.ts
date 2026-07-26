import { UserModel, type UserDocument } from "./user.model";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: "admin";
};

export class UserRepository {
  count(): Promise<number> {
    return UserModel.countDocuments();
  }

  create(data: CreateUserInput): Promise<UserDocument> {
    return UserModel.create(data);
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
  }

  findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }
}

export const userRepository = new UserRepository();
