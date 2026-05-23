import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { ExplainerPanel } from 'src/widgets/ExplainerPanel';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const params = useParams();
  const vm = useMemo(
    () => new ProductDetailPageViewModel(params.productId),
    [params.productId],
  );
  const { product } = vm;

  return (
    <main className="page-shell">
      <section className="detail-layout detail-hero">
        <div>
          <div className="card-kicker">
            <span>{product.family}</span>
            <strong>{product.lifecycle}</strong>
          </div>
          <h1>{product.name}</h1>
          <p className="hero-summary">{product.summary}</p>
          <div className="tag-row">
            {product.protocols.map((protocol) => (
              <span className="tag" key={protocol}>
                {protocol}
              </span>
            ))}
          </div>
        </div>
        <div className={`detail-visual product-visual-${product.visualTone}`}>
          <span className="visually-hidden">{product.imageAlt}</span>
          <span className="device-line device-line-primary" />
          <span className="device-line device-line-secondary" />
          <span className="device-dot device-dot-left" />
          <span className="device-dot device-dot-right" />
        </div>
      </section>

      <section className="detail-metrics" aria-label="Product metrics">
        <div className="hero-panel metric-grid">
          {product.metrics.map((metric) => (
            <div className="metric-tile" key={metric.label}>
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="two-column-section">
        <article className="spec-panel">
          <h2>Technical specs</h2>
          <dl>
            <dt>Enclosure</dt>
            <dd>{product.specs.enclosure}</dd>
            <dt>Ingress</dt>
            <dd>{product.specs.ingress}</dd>
            <dt>Operating range</dt>
            <dd>{product.specs.operatingRange}</dd>
            <dt>Connectivity</dt>
            <dd>{product.specs.connectivity}</dd>
          </dl>
        </article>
        <article className="spec-panel">
          <h2>Documents</h2>
          <div className="document-list">
            {product.documents.map((document) => (
              <span className="document-chip" key={document}>
                {document}
              </span>
            ))}
          </div>
        </article>
        <ExplainerPanel title="Source layer contract" items={vm.sourceEvidence} />
      </section>
    </main>
  );
});
