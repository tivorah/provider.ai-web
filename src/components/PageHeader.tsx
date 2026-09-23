import type { ReactNode } from "react";

export function PageHeader({ category, title, description, children }: {
  category?: string; title: string; description: string; children?: ReactNode;
}) {
  return <header className="workspace-page-header">
    <div className="min-w-0">
      {category && <p className="workspace-page-category">{category}</p>}
      <h1 className="workspace-page-title">{title}</h1>
      <p className="workspace-page-description">{description}</p>
    </div>
    {children && <div className="flex shrink-0 flex-wrap items-center gap-3">{children}</div>}
  </header>;
}
