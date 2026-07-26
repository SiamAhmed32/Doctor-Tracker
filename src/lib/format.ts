export function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function conditionBadgeVariant(condition: string) {
  const value = condition.toLowerCase();
  if (/(critical|fracture|anxiety)/.test(value)) return "danger" as const;
  if (/(migraine|asthma|allergy|back pain)/.test(value)) return "warning" as const;
  if (/(recover|stable)/.test(value)) return "success" as const;
  return "default" as const;
}
