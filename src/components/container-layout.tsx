import { PropsWithChildren } from "react";

export interface ContainerLayoutProps extends PropsWithChildren {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export default function ContainerLayout({
  title,
  description,
  children,
  action,
}: ContainerLayoutProps) {
  return (
    <div className="flex flex-col gap-6 flex-1 container mx-auto">
      <header className="mb-6 justify-between flex flex-wrap gap-3">
        <section className="space-y-1">
          <h2 className="text-3xl font-bold capitalize max-w-[50ch] wrap-break-words">
            {title}
          </h2>
          {typeof description === "string" && (
            <p className="text-muted-foreground">{description}</p>
          )}
          {typeof description !== "string" && description}
        </section>

        {action}
      </header>
      {children}
    </div>
  );
}
