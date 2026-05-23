import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Link } from 'react-router';

import { ExplainerPanel } from 'src/widgets/ExplainerPanel';
import { HomePageViewModel } from '../../model/HomePageViewModel';

export const HomePage = observer(function HomePage() {
  const [vm] = useState(() => new HomePageViewModel());

  return (
    <main className="page-shell">
      <section className="hero-grid hero-grid-panel">
        <div className="hero-copy">
          <p className="eyebrow">Nexora Systems catalog</p>
          <h1>Industrial devices, SaaS plans, and release evidence in one catalog.</h1>
          <p className="hero-summary">
            Browse the customer-facing catalog first. Then inspect the source layer to
            see how products, documents, price-book drafts, and revision proof will map
            to Revisium.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" to="/catalog">
              Browse catalog
            </Link>
            <Link className="button-secondary" to="/releases">
              View releases
            </Link>
          </div>
        </div>
        <div className="hero-panel catalog-console" aria-label="Catalog status summary">
          <div className="console-header">
            <span>Catalog snapshot</span>
            <strong>Mock branch</strong>
          </div>
          <div className="metric-tile">
            <span className="metric-value">{vm.catalogCardCount}</span>
            <span className="metric-label">priority product cards</span>
          </div>
          <div className="metric-tile">
            <span className="metric-value">{vm.releaseCount}</span>
            <span className="metric-label">release states</span>
          </div>
          <div className="metric-tile">
            <span className="metric-value">{vm.backendCallCount}</span>
            <span className="metric-label">backend calls in this PR</span>
          </div>
        </div>
      </section>

      <section className="section-grid" aria-label="Featured catalog entries">
        {vm.heroProducts.map((product) => (
          <article className="product-card product-card-featured" key={product.id}>
            <div className={`product-visual product-visual-${product.visualTone}`}>
              <span className="visually-hidden">{product.imageAlt}</span>
              <span className="device-line device-line-primary" />
              <span className="device-line device-line-secondary" />
              <span className="device-dot device-dot-left" />
              <span className="device-dot device-dot-right" />
            </div>
            <div className="card-body">
              <div className="card-kicker">
                <span>{product.family}</span>
                <strong>{product.lifecycle}</strong>
              </div>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="compact-metrics">
                {product.metrics.slice(0, 2).map((metric) => (
                  <span key={metric.label}>
                    <strong>{metric.value}</strong>
                    {metric.label}
                  </span>
                ))}
              </div>
              <div className="tag-row">
                {product.protocols.slice(0, 3).map((protocol) => (
                  <span className="tag" key={protocol}>
                    {protocol}
                  </span>
                ))}
              </div>
              <Link className="text-link" to={`/catalog/${product.id}`}>
                Inspect product
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="two-column-section release-section">
        <div>
          <p className="eyebrow">Release proof</p>
          <h2>Catalog and price-book changes stay visible before backend wiring.</h2>
          <div className="release-list">
            {vm.releases.map((release) => (
              <article className="release-row" key={release.id}>
                <strong>{release.label}</strong>
                <span>{release.summary}</span>
              </article>
            ))}
          </div>
        </div>
        <ExplainerPanel title="Mock-first proof layer" items={vm.proofItems} />
      </section>
    </main>
  );
});
