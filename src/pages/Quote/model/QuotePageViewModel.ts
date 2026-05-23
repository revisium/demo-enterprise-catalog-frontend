import { makeAutoObservable, runInAction } from 'mobx';

import { createQuoteForm } from 'src/shared/forms';

interface QuoteSelectOption {
  readonly label: string;
  readonly value: string;
}

const regionOptions: readonly QuoteSelectOption[] = [
  { label: 'New York', value: 'New York' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Frankfurt', value: 'Frankfurt' },
  { label: 'Amsterdam', value: 'Amsterdam' },
  { label: 'Singapore', value: 'Singapore' },
];

const interestOptions: readonly QuoteSelectOption[] = [
  { label: 'Business VM 8', value: 'Business VM 8' },
  { label: 'Dedicated R2', value: 'Dedicated R2' },
  { label: 'Database D4', value: 'Database D4' },
  { label: 'Storage S3', value: 'Storage S3' },
];

export class QuotePageViewModel {
  readonly form = createQuoteForm();
  submitted = false;
  submitError: string | undefined;

  constructor() {
    makeAutoObservable(this, { form: false, submit: false });
  }

  get regionOptions() {
    return regionOptions;
  }

  get interestOptions() {
    return interestOptions;
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
