import type { Request, Response } from "express";
import { getValidatedQuery } from "../../shared/lib/validated";
import { dashboardService } from "./dashboard.service";
import type { DashboardQuery } from "./dashboard.validation";

export class DashboardController {
  async overview(req: Request, res: Response): Promise<void> {
    const query = getValidatedQuery<DashboardQuery>(req);
    const data = await dashboardService.getOverview(query);
    res.status(200).json(data);
  }
}

export const dashboardController = new DashboardController();
