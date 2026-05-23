import { observer } from 'mobx-react-lite';

import { QuotePageViewModel } from '../../model/QuotePageViewModel';

const vm = new QuotePageViewModel();

export const QuotePage = observer(function QuotePage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Runtime interaction</p>
        <h1>Request quote mock form powered by @revisium/forms-core.</h1>
        <p>
          This form does not call the backend yet. It proves the frontend form contract
          and keeps runtime interaction ownership separate from Revisium catalog data.
        </p>
      </header>

      <form className="quote-form" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          Company
          <input
            value={vm.form.controls.company.value}
            onBlur={() => vm.form.controls.company.blur()}
            onChange={(event) => vm.form.controls.company.setValue(event.target.value)}
          />
          <span>{vm.form.controls.company.visibleError}</span>
        </label>
        <label>
          Work email
          <input
            value={vm.form.controls.email.value}
            onBlur={() => vm.form.controls.email.blur()}
            onChange={(event) => vm.form.controls.email.setValue(event.target.value)}
          />
          <span>{vm.form.controls.email.visibleError}</span>
        </label>
        <label>
          Region
          <select
            value={vm.form.controls.region.value}
            onChange={(event) => vm.form.controls.region.setValue(event.target.value)}
          >
            <option>North America</option>
            <option>Europe</option>
            <option>APAC</option>
          </select>
        </label>
        <label>
          Interest
          <select
            value={vm.form.controls.interest.value}
            onChange={(event) => vm.form.controls.interest.setValue(event.target.value)}
          >
            <option>Edge Gateway X4</option>
            <option>Sentinel Vibration Node</option>
            <option>Nexora Observe Pro</option>
          </select>
        </label>
        <button className="button-primary" type="submit">
          Submit mock request
        </button>
        {vm.submitted ? (
          <p className="success-note">
            Mock request captured. Backend ownership will start from this stable contract.
          </p>
        ) : null}
      </form>
    </main>
  );
});

async function handleSubmit(event: { preventDefault(): void }) {
  event.preventDefault();
  await vm.submit();
}
