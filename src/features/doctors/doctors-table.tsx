"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, initials } from "@/lib/format";
import type { Doctor } from "./types";

type DoctorsTableProps = {
  doctors: Doctor[];
  onEdit: (doctor: Doctor) => void;
};

export function DoctorsTable({ doctors, onEdit }: DoctorsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Doctor</TableHead>
          <TableHead>Specialization</TableHead>
          <TableHead>Hospital</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Added</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {doctors.map((doctor) => (
          <TableRow key={doctor.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(doctor.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {doctor.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{doctor.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge>{doctor.specialization}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {doctor.hospital}
            </TableCell>
            <TableCell className="text-muted-foreground">{doctor.phone}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(doctor.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/doctors/${doctor.id}`}>View</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(doctor)}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
