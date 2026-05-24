import type { PriceBook } from '../model/priceBookTypes';

export const priceBooks: readonly PriceBook[] = [
  {
    effectiveFrom: '2026-04-01',
    id: 'regional-2026-q2',
    owner: 'Commercial operations',
    status: 'Active',
    summary: 'Current monthly and yearly server terms for active regions.',
    termMultiplier: 1,
    title: '2026 Q2 regional server price book',
    updatedAt: '2026-05-23',
  },
  {
    effectiveFrom: '2026-07-01',
    id: 'q3-contract-draft',
    owner: 'Finance',
    status: 'Draft',
    summary: 'Draft contract terms for renewals and reserved server planning.',
    termMultiplier: 0.97,
    title: 'Q3 contract draft price book',
    updatedAt: '2026-05-21',
  },
];
