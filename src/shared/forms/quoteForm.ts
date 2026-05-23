import { createForm, field } from '@revisium/forms-core';

export interface QuoteFormValues {
  readonly company: string;
  readonly email: string;
  readonly region: string;
  readonly interest: string;
}

const fallbackValues: QuoteFormValues = {
  company: '',
  email: '',
  region: '',
  interest: '',
};

export function createQuoteForm(defaultValues: QuoteFormValues = fallbackValues) {
  return createForm({
    defaultValues,
    fields: {
      company: field<string>({
        validators: {
          onChange: ({ value }) => (value.trim().length > 1 ? undefined : 'Company is required'),
        },
      }),
      email: field<string>({
        validators: {
          onChange: ({ value }) => (value.includes('@') ? undefined : 'Valid email is required'),
        },
      }),
      region: field<string>(),
      interest: field<string>(),
    },
  });
}
