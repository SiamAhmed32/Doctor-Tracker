import { ChartPanel } from "./chart-panel";

type BreakdownItem = {
  label: string;
  count: number;
};

type BreakdownPanelProps = {
  title: string;
  description: string;
  items: BreakdownItem[];
  emptyLabel: string;
  unitLabel: string;
};

export function BreakdownPanel({
  title,
  description,
  items,
  emptyLabel,
  unitLabel,
}: BreakdownPanelProps) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const ranked = [...items].sort((a, b) => b.count - a.count);

  return (
    <ChartPanel title={title} description={description}>
      {ranked.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <ul className="space-y-3" aria-label={title}>
          {ranked.map((item) => {
            const share = total ? Math.round((item.count / total) * 100) : 0;
            return (
              <li key={item.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {item.count} {unitLabel} · {share}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{ width: `${Math.max(share, share > 0 ? 6 : 0)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ChartPanel>
  );
}
