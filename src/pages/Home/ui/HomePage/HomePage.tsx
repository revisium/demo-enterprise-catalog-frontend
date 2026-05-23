import { observer } from 'mobx-react-lite';
import { Link } from 'react-router';

import { ExplainerPanel } from 'src/widgets/ExplainerPanel';
import { HomePageViewModel } from '../../model/HomePageViewModel';

const vm = new HomePageViewModel();

export const HomePage = observer(function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Nexora Systems catalog</p>
          <h1>Versioned enterprise product data for buyers, partners, and APIs.</h1>
          <p className="hero-summary">
            Browse devices, SaaS plans, documents, and release evidence first. Open the
            source layer when you want to inspect the Revisium-backed data contract.
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
        <div className="hero-panel" aria-label="Catalog status summary">
          <div>
            <span className="metric-value">3</span>
            <span className="metric-label">priority product cards</span>
          </div>
          <div>
            <span className="metric-value">2</span>
            <span className="metric-label">release states</span>
          </div>
          <div>
            <span className="metric-value">0</span>
            <span className="metric-label">backend calls in this PR</span>
          </div>
        </div>
      </section>

      <section className="section-grid" aria-label="Featured catalog entries">
        {vm.heroProducts.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-visual">
              <span className="visually-hidden">{product.imageAlt}</span>
            </div>
            <div className="card-body">
              <p className="eyebrow">{product.family}</p>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
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

      <section className="two-column-section">
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
