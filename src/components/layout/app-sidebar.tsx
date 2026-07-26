import { Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nav";

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Doctor Tracker</p>
          <p className="text-xs text-muted-foreground">Admin portal</p>
        </div>
      </div>
      <Separator />
      <SidebarNav />
      <div className="mt-auto border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">
          Manage doctors, patients, and analytics.
        </p>
      </div>
    </aside>
  );
}
