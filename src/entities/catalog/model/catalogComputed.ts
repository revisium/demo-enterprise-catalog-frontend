import type { CatalogProduct } from './catalogTypes';

export type CatalogValueTier = 'Economy' | 'Balanced' | 'Performance';

export interface CatalogComputedMetrics {
  readonly pricePerCore: number | null;
  readonly pricePerGbRam: number | null;
  readonly regionsInStock: number;
  readonly availableEverywhere: boolean;
  readonly instantSetup: boolean;
  readonly topRegions: readonly string[];
  readonly valueTier: CatalogValueTier;
}

export interface CatalogReadinessInput {
  readonly enterpriseCoveragePercent: number;
  readonly familyCoveragePercent: number;
  readonly fastestSetupHours: number;
  readonly totalStock: number;
}

const valueTierThresholds = {
  economy: 8,
  performance: 20,
} as const;

export const valueTierOrder: Record<CatalogValueTier, number> = {
  Economy: 0,
  Balanced: 1,
  Performance: 2,
};

export function calculateCatalogPlanValues(plan: CatalogProduct): CatalogComputedMetrics {
  const { pricing, hardware, availabilityByRegion } = plan;
  const pricePerCore = calculateRate(pricing.monthlyUsd, hardware.cpuCores);
  const pricePerGbRam = calculateRate(pricing.monthlyUsd, hardware.ramGb);

  const regionsInStock = availabilityByRegion.reduce(
    (total, availability) => total + (availability.stock > 0 ? 1 : 0),
    0,
  );

  const availableEverywhere =
    availabilityByRegion.length > 0 && availabilityByRegion.every((availability) => availability.stock > 0);
  const instantSetup = availabilityByRegion.some(
    (availability) => availability.stock > 0 && availability.setupHours <= 1,
  );

  return {
    availableEverywhere,
    instantSetup,
    pricePerCore,
    pricePerGbRam,
    regionsInStock,
    topRegions: getTopRegions(availabilityByRegion),
    valueTier: calculateValueTier(pricePerCore),
  };
}

export function calculatePricePerCore(plan: CatalogProduct): number | null {
  return calculateRate(plan.pricing.monthlyUsd, plan.hardware.cpuCores);
}

export function calculatePricePerGbRam(plan: CatalogProduct): number | null {
  return calculateRate(plan.pricing.monthlyUsd, plan.hardware.ramGb);
}

export function calculateValueTier(plan: CatalogProduct | number | null): CatalogValueTier {
  const pricePerCore =
    typeof plan === 'number' || plan === null ? plan : calculatePricePerCore(plan);

  return pricePerCore !== null ? deriveValueTier(pricePerCore) : 'Performance';
}

export function calculateTopRegions(plan: CatalogProduct): readonly string[] {
  return getTopRegions(plan.availabilityByRegion);
}

export function calculateRegionsInStock(plan: CatalogProduct): number {
  return plan.availabilityByRegion.reduce(
    (total, availability) => total + (availability.stock > 0 ? 1 : 0),
    0,
  );
}

export function calculateAvailableEverywhere(plan: CatalogProduct): boolean {
  return plan.availabilityByRegion.length > 0 &&
    plan.availabilityByRegion.every((availability) => availability.stock > 0);
}

export function calculateInstantSetup(plan: CatalogProduct): boolean {
  return plan.availabilityByRegion.some((availability) => availability.setupHours <= 1);
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

export function getFastestSetupHours(setupHours: readonly number[]) {
  if (setupHours.length === 0) {
    return 0;
  }

  return Math.min(...setupHours);
}

export function normalizeSupportWindowId(value: string) {
  if (value === '24/7' || value === '24-7') {
    return '24-7';
  }

  if (value === 'business hours' || value === 'business-hours') {
    return 'business-hours';
  }

  return value;
}

function calculateRate(dividend: number, divisor: number) {
  if (divisor <= 0) {
    return null;
  }

  return Number((dividend / divisor).toFixed(2));
}

function deriveValueTier(pricePerCore: number): CatalogValueTier {
  if (pricePerCore <= valueTierThresholds.economy) {
    return 'Economy';
  }

  if (pricePerCore <= valueTierThresholds.performance) {
    return 'Balanced';
  }

  return 'Performance';
}

function getTopRegions(availabilityByRegion: readonly { regionId: string; stock: number }[]) {
  return [...availabilityByRegion]
    .sort((left, right) => {
      if (right.stock !== left.stock) {
        return right.stock - left.stock;
      }

      return left.regionId.localeCompare(right.regionId);
    })
    .slice(0, 3)
    .map((region) => region.regionId);
}
