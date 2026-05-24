import { createForm, field } from '@revisium/forms-core';

export interface QuoteFormValues {
  readonly billingTerm: string;
  readonly company: string;
  readonly email: string;
  readonly region: string;
  readonly interest: string;
  readonly priority: string;
  readonly quantity: string;
}

const fallbackValues: QuoteFormValues = {
  billingTerm: 'monthly',
  company: '',
  email: '',
  region: '',
  interest: '',
  priority: 'standard',
  quantity: '1',
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
      region: field<string>({
        validators: {
          onChange: ({ value }) => (value.trim().length > 0 ? undefined : 'Region is required'),
        },
      }),
      interest: field<string>({
        validators: {
          onChange: ({ value }) => (value.trim().length > 0 ? undefined : 'Plan is required'),
        },
      }),
      billingTerm: field<string>(),
      priority: field<string>(),
      quantity: field<string>({
        validators: {
          onChange: ({ value }) => {
            const parsed = Number(value);

            return Number.isInteger(parsed) && parsed > 0
              ? undefined
              : 'Quantity must be 1 or more';
          },
        },
      }),
    },
  });
}
