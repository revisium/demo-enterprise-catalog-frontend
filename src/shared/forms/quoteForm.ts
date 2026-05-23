import { createForm, field } from '@revisium/forms-core';

export interface QuoteFormValues {
  readonly company: string;
  readonly email: string;
  readonly region: string;
  readonly interest: string;
}

export function createQuoteForm() {
  return createForm({
    defaultValues: {
      company: '',
      email: '',
      region: 'North America',
      interest: 'Edge Gateway X4',
    } satisfies QuoteFormValues,
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
