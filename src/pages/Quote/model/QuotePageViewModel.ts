import { makeAutoObservable, runInAction } from 'mobx';

import { type CatalogProduct } from 'src/entities/catalog';
import { createQuoteForm, type QuoteFormValues } from 'src/shared/forms';
import { QuotePageDataSource } from '../api/QuotePageDataSource';

interface QuoteDefaults {
  readonly planId?: string | null;
  readonly regionId?: string | null;
  readonly term?: string | null;
}

interface QuoteOption {
  readonly label: string;
  readonly value: string;
}

interface QuoteReviewStep {
  readonly description: string;
  readonly id: string;
  readonly status: 'complete' | 'current' | 'next';
  readonly title: string;
}

interface QuoteChecklistRow {
  readonly label: string;
  readonly ready: boolean;
  readonly value: string;
}

const billingTermLabels = new Map([
  ['monthly', 'Monthly'],
  ['yearly', 'Yearly'],
  ['reserved', 'Reserved'],
]);

const addonLabels = new Map([
  ['backup', 'Managed backups'],
  ['ipv4', 'Public IPv4'],
  ['lifecycle-rules', 'Lifecycle rules'],
  ['monitoring', 'Monitoring'],
  ['private-vlan', 'Private VLAN'],
  ['support', 'Priority support'],
]);

const addonMonthlyPrices = new Map([
  ['backup', 18],
  ['ipv4', 4],
  ['lifecycle-rules', 12],
  ['monitoring', 16],
  ['private-vlan', 35],
  ['support', 45],
]);

const priorityOptions: readonly QuoteOption[] = [
  { label: 'Standard planning', value: 'standard' },
  { label: 'Need capacity this week', value: 'urgent' },
  { label: 'Contract renewal', value: 'renewal' },
];

function getDefaultQuoteFormValues(
  products: readonly CatalogProduct[],
  defaults: QuoteDefaults = {},
): QuoteFormValues {
  const defaultProduct = products[0];
  const selectedProduct =
    products.find((product) => product.id === defaults.planId) ?? defaultProduct;
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
  private readonly dataSource: QuotePageDataSource;

  readonly form: ReturnType<typeof createQuoteForm>;
  selectedAddonIds: readonly string[] = [];
  submitted = false;
  submitError: string | undefined;

  constructor(defaults: QuoteDefaults = {}, dataSource = new QuotePageDataSource()) {
    this.dataSource = dataSource;
    this.form = createQuoteForm(getDefaultQuoteFormValues(this.products, defaults));
    this.selectedAddonIds = this.getDefaultAddonIds(this.selectedPlan);
    makeAutoObservable(this, { form: false, submit: false });
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get addonOptions() {
    return (this.selectedPlan?.addons ?? []).map((addonId) => ({
      id: addonId,
      label: addonLabels.get(addonId) ?? addonId,
    }));
  }

  get billingTermOptions() {
    return this.getBillingTermOptions(this.selectedPlan);
  }

  get regionOptions() {
    const regions = this.selectedPlan
      ? this.selectedPlan.availabilityByRegion
      : this.products.flatMap((product) => product.availabilityByRegion);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [...byId.entries()].map(([value, label]) => ({ label, value }));
  }

  get interestOptions() {
    return this.products.map((product) => ({
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
    return this.products.find((product) => product.id === this.form.controls.interest.value);
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

  get selectedAddonsLabel() {
    if (this.selectedAddonIds.length === 0) {
      return 'No add-ons';
    }

    return this.selectedAddonIds.map((addonId) => addonLabels.get(addonId) ?? addonId).join(', ');
  }

  get unitMonthlyPrice() {
    return this.selectedPlan ? this.getUnitMonthlyPrice(this.selectedPlan) : 0;
  }

  get addOnsMonthlyPrice() {
    return this.selectedAddonIds.reduce(
      (total, addonId) => total + (addonMonthlyPrices.get(addonId) ?? 0),
      0,
    );
  }

  get monthlyEstimate() {
    return (this.unitMonthlyPrice + this.addOnsMonthlyPrice) * this.quantity;
  }

  get setupEstimate() {
    return (this.selectedPlan?.pricing.setupUsd ?? 0) * this.quantity;
  }

  get yearlySavings() {
    const selectedPlan = this.selectedPlan;

    if (!selectedPlan || this.form.controls.billingTerm.value !== 'yearly') {
      return 0;
    }

    return (
      (selectedPlan.pricing.monthlyUsd - selectedPlan.pricing.yearlyMonthlyUsd) * 12 * this.quantity
    );
  }

  get remainingRegionalStock() {
    return Math.max((this.selectedRegionAvailability?.stock ?? 0) - this.quantity, 0);
  }

  get quoteDetailHref() {
    return this.selectedPlan ? `/catalog/${this.selectedPlan.id}` : '/catalog';
  }

  get quoteMetrics() {
    const selectedRegion = this.selectedRegionAvailability;

    return [
      { label: 'Units', value: String(this.quantity) },
      { label: 'Monthly estimate', value: `$${this.monthlyEstimate}` },
      {
        label: 'Setup estimate',
        value: `$${this.setupEstimate}`,
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

  get commercialRows() {
    return [
      { label: 'Base plan', value: `$${this.unitMonthlyPrice}/mo` },
      { label: 'Selected add-ons', value: `$${this.addOnsMonthlyPrice}/mo` },
      { label: 'Quantity', value: `${this.quantity} unit${this.quantity === 1 ? '' : 's'}` },
      { label: 'Monthly estimate', value: `$${this.monthlyEstimate}` },
      { label: 'Setup estimate', value: `$${this.setupEstimate}` },
      { label: 'Yearly savings', value: `$${this.yearlySavings}` },
    ];
  }

  get readinessRows(): readonly QuoteChecklistRow[] {
    const company = this.form.controls.company.value.trim();
    const email = this.form.controls.email.value.trim();
    const selectedRegion = this.selectedRegionAvailability;

    return [
      {
        label: 'Contact',
        ready: company.length > 1 && email.includes('@'),
        value: company && email ? `${company} / ${email}` : 'Add company and email',
      },
      {
        label: 'Plan',
        ready: Boolean(this.selectedPlan),
        value: this.selectedPlan?.name ?? 'Choose a plan',
      },
      {
        label: 'Region stock',
        ready: Boolean(selectedRegion && selectedRegion.stock >= this.quantity),
        value: selectedRegion
          ? `${selectedRegion.stock} available, ${this.remainingRegionalStock} after request`
          : 'Choose a region',
      },
      {
        label: 'Commercial terms',
        ready: this.quantity > 0 && this.form.controls.billingTerm.value.length > 0,
        value: `${this.getTermLabel(this.form.controls.billingTerm.value)}, $${this.monthlyEstimate}/mo`,
      },
      {
        label: 'Add-ons',
        ready: true,
        value: this.selectedAddonsLabel,
      },
    ];
  }

  get reviewSteps(): readonly QuoteReviewStep[] {
    return [
      {
        description: 'Plan, region, add-ons, and contact details are prepared here.',
        id: 'draft',
        status: this.submitted ? 'complete' : 'current',
        title: 'Draft request',
      },
      {
        description: 'Sales checks regional stock, setup window, and contract terms.',
        id: 'review',
        status: this.submitted ? 'current' : 'next',
        title: 'Sales review',
      },
      {
        description: 'Customer receives the final quote and can continue in the console.',
        id: 'approval',
        status: 'next',
        title: 'Customer approval',
      },
    ];
  }

  get payloadPreview() {
    const selectedPlan = this.selectedPlan;
    const selectedRegion = this.selectedRegionAvailability;

    return [
      { label: 'Plan', value: selectedPlan?.name ?? 'not selected' },
      { label: 'Region', value: selectedRegion?.regionLabel ?? 'not selected' },
      {
        label: 'Term',
        value: this.getTermLabel(this.form.controls.billingTerm.value),
      },
      { label: 'Priority', value: this.getPriorityLabel(this.form.controls.priority.value) },
      { label: 'Quantity', value: this.form.controls.quantity.value },
      { label: 'Add-ons', value: this.selectedAddonsLabel },
      { label: 'Monthly estimate', value: `$${this.monthlyEstimate}` },
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

    this.selectedAddonIds = this.getAllowedAddonIds(this.selectedAddonIds);

    if (this.selectedAddonIds.length === 0) {
      this.selectedAddonIds = this.getDefaultAddonIds(selectedPlan);
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

  toggleAddon(addonId: string) {
    if (!this.selectedPlan?.addons.includes(addonId)) {
      return;
    }

    this.selectedAddonIds = this.selectedAddonIds.includes(addonId)
      ? this.selectedAddonIds.filter((selectedAddonId) => selectedAddonId !== addonId)
      : [...this.selectedAddonIds, addonId];
  }

  private getAllowedAddonIds(addonIds: readonly string[]) {
    const allowedAddonIds = new Set(this.selectedPlan?.addons ?? []);

    return addonIds.filter((addonId) => allowedAddonIds.has(addonId));
  }

  private getDefaultAddonIds(product: CatalogProduct | undefined) {
    return product?.addons.slice(0, Math.min(product.addons.length, 2)) ?? [];
  }

  private getPriorityLabel(priorityId: string) {
    return priorityOptions.find((option) => option.value === priorityId)?.label ?? priorityId;
  }

  private getTermLabel(termId: string) {
    return billingTermLabels.get(termId) ?? termId;
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
