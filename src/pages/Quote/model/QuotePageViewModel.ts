import { makeAutoObservable, runInAction } from 'mobx';

import { catalogSnapshot, type CatalogProduct } from 'src/entities/catalog';
import { createQuoteForm, type QuoteFormValues } from 'src/shared/forms';

interface QuoteDefaults {
  readonly planId?: string | null;
  readonly regionId?: string | null;
  readonly term?: string | null;
}

interface QuoteOption {
  readonly label: string;
  readonly value: string;
}

const billingTermLabels = new Map([
  ['monthly', 'Monthly'],
  ['yearly', 'Yearly'],
  ['reserved', 'Reserved'],
]);

const priorityOptions: readonly QuoteOption[] = [
  { label: 'Standard planning', value: 'standard' },
  { label: 'Need capacity this week', value: 'urgent' },
  { label: 'Contract renewal', value: 'renewal' },
];

function getDefaultQuoteFormValues(defaults: QuoteDefaults = {}): QuoteFormValues {
  const defaultProduct = catalogSnapshot.products[0];
  const selectedProduct =
    catalogSnapshot.products.find((product) => product.id === defaults.planId) ?? defaultProduct;
  const selectedRegion =
    selectedProduct?.availabilityByRegion.find((region) => region.regionId === defaults.regionId) ??
    selectedProduct?.availabilityByRegion[0];
  const billingTerm =
    defaults.term && selectedProduct?.billingTerms.includes(defaults.term)
      ? defaults.term
      : (selectedProduct?.billingTerms[0] ?? 'monthly');

  return {
    billingTerm,
    company: '',
    email: '',
    interest: selectedProduct?.id ?? '',
    priority: 'standard',
    quantity: '1',
    region: selectedRegion?.regionId ?? '',
  };
}

export class QuotePageViewModel {
  readonly form: ReturnType<typeof createQuoteForm>;
  submitted = false;
  submitError: string | undefined;

  constructor(defaults: QuoteDefaults = {}) {
    this.form = createQuoteForm(getDefaultQuoteFormValues(defaults));
    makeAutoObservable(this, { form: false, submit: false });
  }

  get billingTermOptions() {
    return this.getBillingTermOptions(this.selectedPlan);
  }

  get regionOptions() {
    const regions = this.selectedPlan
      ? this.selectedPlan.availabilityByRegion
      : catalogSnapshot.products.flatMap((product) => product.availabilityByRegion);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [...byId.entries()].map(([value, label]) => ({ label, value }));
  }

  get interestOptions() {
    return catalogSnapshot.products.map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }

  get priorityOptions() {
    return priorityOptions;
  }

  get quantity() {
    const parsed = Number(this.form.controls.quantity.value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
  }

  get selectedPlan() {
    return catalogSnapshot.products.find(
      (product) => product.id === this.form.controls.interest.value,
    );
  }

  get selectedRegionAvailability() {
    return this.selectedPlan?.availabilityByRegion.find(
      (region) => region.regionId === this.form.controls.region.value,
    );
  }

  get selectedPlanSummary() {
    const selectedPlan = this.selectedPlan;

    if (!selectedPlan) {
      return undefined;
    }

    return `${selectedPlan.hardware.cpuCores} cores, ${selectedPlan.hardware.ramGb} GB RAM, ${selectedPlan.hardware.storageTb} TB storage`;
  }

  get quoteMetrics() {
    const selectedPlan = this.selectedPlan;
    const selectedRegion = this.selectedRegionAvailability;
    const unitPrice = selectedPlan ? this.getUnitMonthlyPrice(selectedPlan) : 0;

    return [
      { label: 'Units', value: String(this.quantity) },
      { label: 'Monthly estimate', value: `$${unitPrice * this.quantity}` },
      {
        label: 'Setup estimate',
        value: `$${(selectedPlan?.pricing.setupUsd ?? 0) * this.quantity}`,
      },
      { label: 'Region stock', value: String(selectedRegion?.stock ?? 0) },
    ];
  }

  get fulfillmentRows() {
    const selectedPlan = this.selectedPlan;

    if (!selectedPlan) {
      return [];
    }

    return selectedPlan.availabilityByRegion.map((region) => ({
      id: region.regionId,
      active: region.regionId === this.form.controls.region.value,
      label: region.regionLabel,
      setup: `${region.setupHours}h setup`,
      stock: `${region.stock} units`,
      support: region.supportWindow,
    }));
  }

  get payloadPreview() {
    const selectedPlan = this.selectedPlan;
    const selectedRegion = this.selectedRegionAvailability;

    return [
      { label: 'Plan', value: selectedPlan?.name ?? 'not selected' },
      { label: 'Region', value: selectedRegion?.regionLabel ?? 'not selected' },
      {
        label: 'Term',
        value:
          billingTermLabels.get(this.form.controls.billingTerm.value) ??
          this.form.controls.billingTerm.value,
      },
      { label: 'Priority', value: this.form.controls.priority.value },
      { label: 'Quantity', value: this.form.controls.quantity.value },
    ];
  }

  setBillingTerm(value: string) {
    this.form.controls.billingTerm.setValue(
      this.billingTermOptions.some((option) => option.value === value)
        ? value
        : (this.billingTermOptions[0]?.value ?? 'monthly'),
    );
  }

  blurCompany() {
    this.form.controls.company.blur();
  }

  blurEmail() {
    this.form.controls.email.blur();
  }

  blurQuantity() {
    this.form.controls.quantity.blur();
  }

  setCompany(value: string) {
    this.form.controls.company.setValue(value);
  }

  setEmail(value: string) {
    this.form.controls.email.setValue(value);
  }

  setInterest(value: string) {
    this.form.controls.interest.setValue(value);

    const selectedPlan = this.selectedPlan;
    const currentRegionStillAvailable = selectedPlan?.availabilityByRegion.some(
      (region) => region.regionId === this.form.controls.region.value,
    );

    if (selectedPlan && !currentRegionStillAvailable) {
      this.form.controls.region.setValue(selectedPlan.availabilityByRegion[0]?.regionId ?? '');
    }

    if (
      !this.billingTermOptions.some(
        (option) => option.value === this.form.controls.billingTerm.value,
      )
    ) {
      this.form.controls.billingTerm.setValue(this.billingTermOptions[0]?.value ?? 'monthly');
    }
  }

  setPriority(value: string) {
    this.form.controls.priority.setValue(
      priorityOptions.some((option) => option.value === value) ? value : 'standard',
    );
  }

  setQuantity(value: string) {
    this.form.controls.quantity.setValue(value);
  }

  setRegion(value: string) {
    this.form.controls.region.setValue(
      this.regionOptions.some((option) => option.value === value)
        ? value
        : (this.regionOptions[0]?.value ?? ''),
    );
  }

  private getUnitMonthlyPrice(product: CatalogProduct) {
    if (this.form.controls.billingTerm.value === 'yearly') {
      return product.pricing.yearlyMonthlyUsd;
    }

    return product.pricing.monthlyUsd;
  }

  private getBillingTermOptions(product: CatalogProduct | undefined): readonly QuoteOption[] {
    const termIds = product?.billingTerms ?? ['monthly'];

    return termIds.map((termId) => ({
      label: billingTermLabels.get(termId) ?? termId,
      value: termId,
    }));
  }

  submit = (event?: { preventDefault(): void }) => {
    event?.preventDefault();

    this.submitForm().catch((error: unknown) => {
      runInAction(() => {
        this.submitError =
          error instanceof Error ? error.message : 'Quote request validation failed.';
      });
    });
  };

  private async submitForm() {
    this.submitError = undefined;

    const errors = await this.form.validate();
    if (errors.length > 0) {
      return;
    }

    runInAction(() => {
      this.submitted = true;
    });
  }
}
