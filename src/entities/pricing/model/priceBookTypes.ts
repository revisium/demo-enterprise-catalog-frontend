export type PriceBookStatus = 'Active' | 'Draft';

export interface PriceBook {
  readonly effectiveFrom: string;
  readonly id: string;
  readonly owner: string;
  readonly status: PriceBookStatus;
  readonly summary: string;
  readonly termMultiplier: number;
  readonly title: string;
  readonly updatedAt: string;
}
