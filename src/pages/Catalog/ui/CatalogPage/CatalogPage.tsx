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
        <h1>Products, plans, and documents with mock Revisium-shaped data.</h1>
        <p>
          This page is intentionally frontend-only. The cards define the first UI
          contract before schemas, generated clients, and backend runtime APIs exist.
        </p>
      </header>

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
            <div>
              <p className="eyebrow">{product.category}</p>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
            </div>
            <div className="row-meta">
              <span>{product.availability}</span>
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
