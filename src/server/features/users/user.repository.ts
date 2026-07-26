import { UserModel, type UserDocument } from "./user.model";

export class UserRepository {
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
