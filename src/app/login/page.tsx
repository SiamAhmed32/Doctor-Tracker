import { Activity } from "lucide-react";
import { LoginForm } from "@/features/auth/login-form";
import { LoginPreview } from "@/features/auth/login-preview";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Activity className="h-5 w-5" />
            </span>
            <div>
              <p className="text-base font-semibold text-foreground">
                Doctor Tracker
              </p>
              <p className="text-xs text-muted-foreground">Admin portal</p>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sign in to manage doctors, patients, and clinic analytics.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Secure access for authorized administrators only.
          </p>
        </div>
      </div>

      <div className="hidden lg:block">
        <LoginPreview />
      </div>
    </div>
  );
}
