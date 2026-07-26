import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-dashed border-border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          Feature UI comes in the next steps. Navigation and layout are ready.
        </div>
      </CardContent>
    </Card>
  );
}
