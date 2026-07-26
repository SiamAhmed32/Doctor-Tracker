"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { useGetMeQuery } from "./auth-api";

function isUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  if (!("status" in error)) return false;
  return error.status === 401 || error.status === 403;
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading, isError, isFetching, error, refetch } =
    useGetMeQuery();

  useEffect(() => {
    if (isError && isUnauthorized(error)) {
      router.replace("/login");
    }
  }, [error, isError, router]);

  if ((isLoading || isFetching) && !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
          <Activity className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-foreground">
            Doctor Tracker
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Opening your workspace...
          </p>
        </div>
        <div
          className="h-1.5 w-40 overflow-hidden rounded-full bg-muted"
          aria-label="Loading"
          role="status"
        >
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    );
  }

  if (isError || !data?.user) {
    if (isUnauthorized(error)) {
      return null;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Could not reach the server to verify your session.
        </p>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => {
            void refetch();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
