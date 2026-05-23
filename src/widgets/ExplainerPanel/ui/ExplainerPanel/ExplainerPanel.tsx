interface ExplainerPanelProps {
  readonly title: string;
  readonly items: readonly string[];
}

export function ExplainerPanel({ title, items }: ExplainerPanelProps) {
  return (
    <aside className="explainer-panel">
      <p className="eyebrow">Revisium source layer</p>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
