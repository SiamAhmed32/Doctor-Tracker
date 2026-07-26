import { Activity, Stethoscope, Users } from "lucide-react";

const metrics = [
  { label: "Doctors", value: "48", icon: Stethoscope },
  { label: "Patients", value: "312", icon: Users },
];

export function LoginPreview() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#0B2B6B] px-10 py-10 text-white xl:px-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.35),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.25),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
          <Activity className="h-5 w-5" />
        </span>
        <div>
          <p className="text-base font-semibold tracking-tight">Doctor Tracker</p>
          <p className="text-xs text-blue-100/80">Admin workspace</p>
        </div>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight xl:text-4xl">
            One place to run your medical network.
          </h2>
          <p className="text-sm leading-relaxed text-blue-100/85">
            Monitor doctors, patients, and daily activity with a clear admin
            dashboard built for everyday hospital work.
          </p>
        </div>

        <div className="grid max-w-lg grid-cols-2 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-blue-100/80">{metric.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">
                  {metric.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
