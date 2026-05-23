import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import { CatalogPageViewModel } from '../../model/CatalogPageViewModel';

export const CatalogPage = observer(function CatalogPage() {
  const [vm] = useState(() => new CatalogPageViewModel());

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Catalog</p>
        <h1>Browse product families with contract-shaped mock data.</h1>
        <p>
          Dense rows show the fields that need to survive into Revisium schemas:
          availability, lifecycle, documents, protocols, and pricing signals.
        </p>
      </header>

      <section className="summary-strip" aria-label="Catalog summary">
        {vm.summaryMetrics.map((metric) => (
          <div className="summary-tile" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <div className="filter-strip" aria-label="Catalog family filters">
        {vm.families.map((family) => (
          <span className="filter-chip" key={family}>
            {family}
          </span>
        ))}
      </div>

      <section className="catalog-table" aria-label="Catalog products">
        {vm.products.map((product) => (
          <article className="catalog-row" key={product.id}>
            <div className={`row-visual product-visual-${product.visualTone}`} aria-hidden="true" />
            <div className="catalog-main-cell">
              <div className="card-kicker">
                <span>{product.category}</span>
                <strong>{product.lifecycle}</strong>
              </div>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="tag-row">
                {product.protocols.map((protocol) => (
                  <span className="tag" key={protocol}>
                    {protocol}
                  </span>
                ))}
              </div>
            </div>
            <div className="row-meta">
              <span>{product.availability}</span>
              <span>{product.regionCount} source regions</span>
              <span>{product.documents.length} documents</span>
              <Link className="button-secondary" to={`/catalog/${product.id}`}>
                Open
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
});
