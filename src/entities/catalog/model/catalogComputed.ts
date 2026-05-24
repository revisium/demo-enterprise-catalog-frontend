import type { CatalogProduct } from './catalogTypes';

export interface CatalogReadinessInput {
  readonly enterpriseCoveragePercent: number;
  readonly familyCoveragePercent: number;
  readonly fastestSetupHours: number;
  readonly totalStock: number;
}

export function calculateCatalogReadinessScore(input: CatalogReadinessInput) {
  const stockScore = Math.min(input.totalStock, 120) / 120;
  const setupScore = Math.max(0, 24 - input.fastestSetupHours) / 24;
  const familyScore = input.familyCoveragePercent / 100;
  const supportScore = input.enterpriseCoveragePercent / 100;

  return Math.round(
    (stockScore * 0.35 + setupScore * 0.25 + familyScore * 0.25 + supportScore * 0.15) * 100,
  );
}

export function calculatePriceEfficiencyScore(plan: CatalogProduct) {
  if (plan.pricing.monthlyUsd <= 0) {
    return 0;
  }

  return Math.round(
    ((plan.hardware.cpuCores + plan.hardware.ramGb / 4 + plan.hardware.storageTb) /
      plan.pricing.monthlyUsd) *
      100,
  );
}

export function getFastestSetupHours(setupHours: readonly number[]) {
  if (setupHours.length === 0) {
    return 0;
  }

  return Math.min(...setupHours);
}

export function normalizeSupportWindowId(value: string) {
  return value === '24/7' ? '24-7' : 'business-hours';
}
