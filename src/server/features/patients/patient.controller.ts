import type { Request, Response } from "express";
import {
  getValidatedParams,
  getValidatedQuery,
} from "../../shared/lib/validated";
import { patientService } from "./patient.service";
import type { PatientListQuery, UpdatePatientInput } from "./patient.validation";

export class PatientController {
  async list(req: Request, res: Response): Promise<void> {
    const query = getValidatedQuery<PatientListQuery>(req);
    const result = await patientService.list(query);
    res.status(200).json(result);
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = getValidatedParams<{ id: string }>(req);
    const patient = await patientService.update(
      id,
      req.body as UpdatePatientInput,
    );
    res.status(200).json({ message: "Patient updated", patient });
  }

  async remove(req: Request, res: Response): Promise<void> {
    const { id } = getValidatedParams<{ id: string }>(req);
    const result = await patientService.remove(id);
    res.status(200).json({ message: "Patient deleted", ...result });
  }
}

export const patientController = new PatientController();
