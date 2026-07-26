"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "./auth-api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground shadow-sm">
          Checking session...
        </div>
      </div>
    );
  }

  if (isError || !data?.user) {
    return null;
  }

  return <>{children}</>;
}
