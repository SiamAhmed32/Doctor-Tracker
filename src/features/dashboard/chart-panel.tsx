import { cn } from "@/lib/utils";

type ChartPanelProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export function ChartPanel({
  title,
  description,
  children,
  className,
  footer,
}: ChartPanelProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        className,
      )}
    >
      <header className="border-b border-border bg-muted/40 px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>
      <div className="flex-1 p-5">{children}</div>
      {footer ? (
        <footer className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
