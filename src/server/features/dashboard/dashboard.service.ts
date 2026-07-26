import { env } from "../../config/env";
import { resolveInclusiveRange } from "../../shared/lib/date-range";
import { toDisplayLabel } from "../../shared/lib/display-label";
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
    const rangeDays =
      Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1;
    const previousTo = new Date(range.from);
    previousTo.setMilliseconds(-1);
    const previousFrom = new Date(range.from);
    previousFrom.setDate(previousFrom.getDate() - rangeDays);

    const [
      totalDoctors,
      totalPatients,
      patientsPerDoctor,
      doctorsBySpecialization,
      patientsByCondition,
      doctorTrendRaw,
      patientTrendRaw,
      previousPatientsCreated,
    ] = await Promise.all([
      dashboardRepository.countDoctors(),
      dashboardRepository.countPatients(),
      dashboardRepository.patientsPerDoctor(query.doctorLimit),
      dashboardRepository.doctorsBySpecialization(),
      dashboardRepository.patientsByCondition(),
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
      dashboardRepository.countPatientsCreated(previousFrom, previousTo),
    ]);

    const doctorTrend = fillDailySeries(range.from, range.to, doctorTrendRaw);
    const patientTrend = fillDailySeries(range.from, range.to, patientTrendRaw);
    const patientsCreated = patientTrend.reduce((sum, point) => sum + point.count, 0);

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
        patientsCreated,
      },
      comparison: {
        previousPatientsCreated,
        patientRegistrationChange:
          previousPatientsCreated === 0
            ? null
            : Number(
                (
                  ((patientsCreated - previousPatientsCreated) /
                    previousPatientsCreated) *
                  100
                ).toFixed(1),
              ),
      },
      patientsPerDoctor,
      doctorsBySpecialization: doctorsBySpecialization.map((item) => ({
        ...item,
        specialization: toDisplayLabel(item.specialization),
      })),
      patientsByCondition: patientsByCondition.map((item) => ({
        ...item,
        condition: toDisplayLabel(item.condition),
      })),
      trends: {
        doctors: doctorTrend,
        patients: patientTrend,
      },
    };
  }
}

export const dashboardService = new DashboardService();
