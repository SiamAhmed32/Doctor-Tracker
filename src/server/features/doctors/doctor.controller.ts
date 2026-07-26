import type { Request, Response } from "express";
import {
  getValidatedParams,
  getValidatedQuery,
} from "../../shared/lib/validated";
import { patientService } from "../patients/patient.service";
import type {
  CreatePatientInput,
  DoctorPatientsQuery,
} from "../patients/patient.validation";
import { doctorService } from "./doctor.service";
import type {
  CreateDoctorInput,
  DoctorListQuery,
} from "./doctor.validation";

export class DoctorController {
  async create(req: Request, res: Response): Promise<void> {
    const doctor = await doctorService.create(req.body as CreateDoctorInput);
    res.status(201).json({ message: "Doctor created", doctor });
  }

  async list(req: Request, res: Response): Promise<void> {
    const query = getValidatedQuery<DoctorListQuery>(req);
    const result = await doctorService.list(query);
    res.status(200).json(result);
  }

  async getById(req: Request, res: Response): Promise<void> {
    const { id } = getValidatedParams<{ id: string }>(req);
    const doctor = await doctorService.getById(id);
    res.status(200).json({ doctor });
  }

  async listPatients(req: Request, res: Response): Promise<void> {
    const { id } = getValidatedParams<{ id: string }>(req);
    const query = getValidatedQuery<DoctorPatientsQuery>(req);
    const result = await patientService.listForDoctor(id, query);
    res.status(200).json(result);
  }

  async addPatient(req: Request, res: Response): Promise<void> {
    const { id } = getValidatedParams<{ id: string }>(req);
    const patient = await patientService.createForDoctor(
      id,
      req.body as CreatePatientInput,
    );
    res.status(201).json({ message: "Patient added", patient });
  }

  async removePatient(req: Request, res: Response): Promise<void> {
    const { id, patientId } = getValidatedParams<{
      id: string;
      patientId: string;
    }>(req);
    const result = await patientService.deleteForDoctor(id, patientId);
    res.status(200).json({ message: "Patient removed", ...result });
  }
}

export const doctorController = new DoctorController();
