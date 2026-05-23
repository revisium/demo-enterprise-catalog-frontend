import { makeAutoObservable, runInAction } from 'mobx';

import { createQuoteForm } from 'src/shared/forms';

export class QuotePageViewModel {
  readonly form = createQuoteForm();
  submitted = false;
  submitError: string | undefined;

  constructor() {
    makeAutoObservable(this, { form: false, submit: false });
  }

  submit = (event?: { preventDefault(): void }) => {
    event?.preventDefault();

    this.submitForm().catch((error: unknown) => {
      runInAction(() => {
        this.submitError = error instanceof Error ? error.message : 'Quote request validation failed.';
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
