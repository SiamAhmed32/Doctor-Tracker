"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FilterFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "search";
  placeholder?: string;
};

export function FilterField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: FilterFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
