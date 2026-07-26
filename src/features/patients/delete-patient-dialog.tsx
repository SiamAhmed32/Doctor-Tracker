"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeletePatientMutation } from "./patients-api";
import type { Patient } from "./types";

type DeletePatientDialogProps = {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeletePatientDialog({
  patient,
  open,
  onOpenChange,
}: DeletePatientDialogProps) {
  const [deletePatient, { isLoading }] = useDeletePatientMutation();

  async function onConfirm() {
    if (!patient) return;
    try {
      await deletePatient(patient.id).unwrap();
      onOpenChange(false);
    } catch {
      // keep dialog open on failure
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete patient?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {patient?.name ?? "this patient"} from
            the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
