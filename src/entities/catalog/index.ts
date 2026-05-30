export { catalogSnapshot } from './mocks/catalogSnapshot';
export {
  calculateCatalogReadinessScore,
  calculateCatalogPlanValues,
  calculatePricePerCore,
  calculatePricePerGbRam,
  calculateRegionsInStock,
  calculateValueTier,
  calculateTopRegions,
  calculateAvailableEverywhere,
  calculateInstantSetup,
  getFastestSetupHours,
  normalizeSupportWindowId,
  valueTierOrder,
  type CatalogValueTier,
  type CatalogComputedMetrics,
} from './model/catalogComputed';
export { createStockFilterOptions, supportWindowFilterOptions } from './model/catalogFilters';
export type { CatalogReadinessInput } from './model/catalogComputed';
export type { CatalogFilterOption, CatalogRegionSummaryFields } from './model/catalogFilters';
export type {
  CatalogHardware,
  CatalogMetric,
  CatalogPricing,
  CatalogProduct,
  CatalogRegionAvailability,
  CatalogRelease,
  CatalogSnapshot,
  CatalogSystemFields,
} from './model/catalogTypes';
