import { makeAutoObservable } from 'mobx';

import { createQuoteForm } from 'src/shared/forms';

export class QuotePageViewModel {
  readonly form = createQuoteForm();
  submitted = false;

  constructor() {
    makeAutoObservable(this, { form: false });
  }

  async submit() {
    const errors = await this.form.validate();
    if (errors.length > 0) {
      return;
    }

    this.submitted = true;
  }
}
