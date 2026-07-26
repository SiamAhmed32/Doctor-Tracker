import { DoctorDetailView } from "@/features/doctors/doctor-detail-view";

type DoctorDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DoctorDetailPage({
  params,
}: DoctorDetailPageProps) {
  const { id } = await params;
  return <DoctorDetailView doctorId={id} />;
}
