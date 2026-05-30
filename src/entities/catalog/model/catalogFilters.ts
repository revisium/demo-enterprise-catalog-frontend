import type { CatalogValueTier } from './catalogComputed';

export interface CatalogFilterOption {
  readonly id: string;
  readonly label: string;
}

export interface CatalogRegionSummaryFields {
  readonly bestValueTier: CatalogValueTier;
  readonly dataCenterCodes: readonly string[];
  readonly enterpriseCoveragePercent: number;
  readonly families: readonly string[];
  readonly familyCoveragePercent: number;
  readonly fastestSetupHours: number;
  readonly regionId: string;
  readonly regionLabel: string;
  readonly supportWindows: readonly string[];
  readonly totalStock: number;
}

export const supportWindowFilterOptions: readonly CatalogFilterOption[] = [
  { id: 'all', label: 'Any support' },
  { id: '24-7', label: '24/7 support' },
  { id: 'business-hours', label: 'Business hours' },
];

export function createStockFilterOptions(thresholds: readonly number[]) {
  return [
    { id: '0', label: 'Any stock' },
    ...thresholds.map((threshold) => ({
      id: String(threshold),
      label: `${threshold}+ units`,
    })),
  ] satisfies readonly CatalogFilterOption[];
}
