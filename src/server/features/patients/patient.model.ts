import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
  type Types,
} from "mongoose";

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    age: {
      type: Number,
      min: 0,
      max: 150,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index(
  {
    name: "text",
    phone: "text",
    email: "text",
    condition: "text",
  },
  {
    name: "patient_text_search",
    weights: {
      name: 5,
      condition: 3,
      phone: 2,
      email: 2,
    },
  },
);

export type PatientDocument = InferSchemaType<typeof patientSchema> & {
  _id: Types.ObjectId;
};

export const PatientModel =
  (models.Patient as Model<PatientDocument>) ||
  model<PatientDocument>("Patient", patientSchema);
