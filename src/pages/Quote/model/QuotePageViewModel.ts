import { makeAutoObservable, runInAction } from 'mobx';

import { catalogSnapshot } from 'src/entities/catalog';
import { createQuoteForm, type QuoteFormValues } from 'src/shared/forms';

function getDefaultQuoteFormValues(): QuoteFormValues {
  const defaultProduct = catalogSnapshot.products[0];
  const defaultRegion = defaultProduct?.availabilityByRegion[0];

  return {
    company: '',
    email: '',
    interest: defaultProduct?.name ?? '',
    region: defaultRegion?.regionLabel ?? '',
  };
}

export class QuotePageViewModel {
  readonly form = createQuoteForm(getDefaultQuoteFormValues());
  submitted = false;
  submitError: string | undefined;

  constructor() {
    makeAutoObservable(this, { form: false, submit: false });
  }

  get regionOptions() {
    const regions = catalogSnapshot.products.flatMap((product) => product.availabilityByRegion);
    const regionLabels = [...new Set(regions.map((region) => region.regionLabel))];

    return regionLabels.map((label) => ({ label, value: label }));
  }

  get interestOptions() {
    return catalogSnapshot.products.map((product) => ({
      label: product.name,
      value: product.name,
    }));
  }

  get selectedPlanSummary() {
    const selectedPlan = catalogSnapshot.products.find(
      (product) => product.name === this.form.controls.interest.value,
    );

    if (!selectedPlan) {
      return undefined;
    }

    return `${selectedPlan.hardware.cpuCores} cores, ${selectedPlan.hardware.ramGb} GB RAM, from $${selectedPlan.pricing.monthlyUsd}/mo`;
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
