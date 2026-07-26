"use client";

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
import { conditionBadgeVariant, formatDate, initials } from "@/lib/format";
import type { Patient } from "./types";

type PatientsTableProps = {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
};

export function PatientsTable({
  patients,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Doctor</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Registered</TableHead>
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{initials(patient.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.email ?? "No email"}
                    {patient.age != null ? ` · ${patient.age} yrs` : ""}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {patient.doctor?.name ?? "—"}
            </TableCell>
            <TableCell>
              <Badge variant={conditionBadgeVariant(patient.condition)}>
                {patient.condition}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {patient.phone}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(patient.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${patient.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(patient)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete(patient)}
                  >
                    Delete
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
