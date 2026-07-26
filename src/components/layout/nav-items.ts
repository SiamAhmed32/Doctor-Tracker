import {
  LayoutDashboard,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    label: "Patients",
    href: "/patients",
    icon: Users,
  },
];
