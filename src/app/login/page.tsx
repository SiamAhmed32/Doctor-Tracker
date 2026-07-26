import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to manage doctors, patients, and healthcare analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <div className="relative hidden overflow-hidden bg-primary-soft lg:block">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2563eb14_1px,transparent_1px),linear-gradient(to_bottom,#2563eb14_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3 text-primary">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Activity className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">Doctor Tracker</span>
          </div>
          <div className="max-w-md space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Calm, trustworthy admin tools for medical teams.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Track doctors, patients, and network insights from one secure
              workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
