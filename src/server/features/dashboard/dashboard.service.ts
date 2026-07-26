import { env } from "../../config/env";
import { resolveInclusiveRange } from "../../shared/lib/date-range";
import { fillDailySeries } from "../../shared/lib/fill-date-series";
import { DoctorModel } from "../doctors/doctor.model";
import { PatientModel } from "../patients/patient.model";
import { dashboardRepository } from "./dashboard.repository";
import type { DashboardQuery } from "./dashboard.validation";

const DEFAULT_TREND_DAYS = 30;

export class DashboardService {
  async getOverview(query: DashboardQuery) {
    const range = resolveInclusiveRange(
      { from: query.from, to: query.to },
      DEFAULT_TREND_DAYS,
    );

    const [
      totalDoctors,
      totalPatients,
      patientsPerDoctor,
      doctorsBySpecialization,
      doctorTrendRaw,
      patientTrendRaw,
    ] = await Promise.all([
      dashboardRepository.countDoctors(),
      dashboardRepository.countPatients(),
      dashboardRepository.patientsPerDoctor(query.doctorLimit),
      dashboardRepository.doctorsBySpecialization(),
      dashboardRepository.dailyCreatedCounts(
        DoctorModel,
        range.from,
        range.to,
        env.appTimezone,
      ),
      dashboardRepository.dailyCreatedCounts(
        PatientModel,
        range.from,
        range.to,
        env.appTimezone,
      ),
    ]);

    const doctorTrend = fillDailySeries(range.from, range.to, doctorTrendRaw);
    const patientTrend = fillDailySeries(range.from, range.to, patientTrendRaw);

    return {
      totals: {
        doctors: totalDoctors,
        patients: totalPatients,
        averagePatientsPerDoctor:
          totalDoctors === 0
            ? 0
            : Number((totalPatients / totalDoctors).toFixed(2)),
      },
      range: {
        from: doctorTrend[0]?.date ?? null,
        to: doctorTrend[doctorTrend.length - 1]?.date ?? null,
        doctorsCreated: doctorTrend.reduce((sum, p) => sum + p.count, 0),
        patientsCreated: patientTrend.reduce((sum, p) => sum + p.count, 0),
      },
      patientsPerDoctor,
      doctorsBySpecialization,
      trends: {
        doctors: doctorTrend,
        patients: patientTrend,
      },
    };
  }
}

export const dashboardService = new DashboardService();
