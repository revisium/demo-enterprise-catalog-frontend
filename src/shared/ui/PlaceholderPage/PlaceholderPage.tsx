interface PlaceholderPageProps {
  readonly title: string;
  readonly summary: string;
}

export function PlaceholderPage({ title, summary }: PlaceholderPageProps) {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Planned page</p>
        <h1>{title}</h1>
        <p>{summary}</p>
      </header>
    </main>
  );
}
