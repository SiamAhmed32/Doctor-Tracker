"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetMeQuery, useLogoutMutation } from "./auth-api";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu() {
  const router = useRouter();
  const { data } = useGetMeQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const user = data?.user;

  async function onLogout() {
    try {
      await logout().unwrap();
    } catch {
      // Clear local session view even if request fails.
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-foreground">
          {user?.name ?? "Admin"}
        </p>
        <p className="text-xs text-muted-foreground">
          {user?.email ?? "Signed in"}
        </p>
      </div>
      <Avatar>
        <AvatarFallback>{initials(user?.name ?? "AD")}</AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onLogout}
        disabled={isLoading}
        className="hidden sm:inline-flex"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onLogout}
        disabled={isLoading}
        className="sm:hidden"
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
