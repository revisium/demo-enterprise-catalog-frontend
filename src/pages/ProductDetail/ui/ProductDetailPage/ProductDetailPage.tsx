import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';

import { ExplainerPanel } from 'src/widgets/ExplainerPanel';
import { ProductDetailPageViewModel } from '../../model/ProductDetailPageViewModel';

export const ProductDetailPage = observer(function ProductDetailPage() {
  const params = useParams();
  const vm = new ProductDetailPageViewModel(params.productId);
  const { product } = vm;

  return (
    <main className="page-shell">
      <section className="detail-layout">
        <div>
          <p className="eyebrow">{product.family}</p>
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
        <div className="hero-panel">
          {product.metrics.map((metric) => (
            <div key={metric.label}>
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
        <ExplainerPanel title="Source layer contract" items={vm.sourceEvidence} />
      </section>
    </main>
  );
});
