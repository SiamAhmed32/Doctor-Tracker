import { Schema, model, type InferSchemaType, type Types } from "mongoose";

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ name: 1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });

export type DoctorDocument = InferSchemaType<typeof doctorSchema> & {
  _id: Types.ObjectId;
};

export const DoctorModel = model("Doctor", doctorSchema);
