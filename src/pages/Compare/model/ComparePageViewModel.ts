import { makeAutoObservable } from 'mobx';

import {
  calculatePriceEfficiencyScore,
  getFastestSetupHours,
  type CatalogProduct,
  type CatalogRegionAvailability,
} from 'src/entities/catalog';
import { ComparePageDataSource } from '../api/ComparePageDataSource';

type BillingTermId = 'monthly' | 'yearly';
type CompareMetricId =
  | 'cpu'
  | 'efficiency'
  | 'memory'
  | 'network'
  | 'price'
  | 'setup'
  | 'stock'
  | 'storage'
  | 'support'
  | 'yearly-savings';
type CompareScenarioId = 'balanced' | 'budget' | 'capacity' | 'fastest-setup';

interface CompareMetric {
  readonly id: CompareMetricId;
  readonly label: string;
  readonly values: readonly string[];
}

interface CompareOption {
  readonly id: string;
  readonly label: string;
}

interface CompareProductRow {
  readonly bestRegionLabel: string;
  readonly detailHref: string;
  readonly fitScore: number;
  readonly id: string;
  readonly label: string;
  readonly monthlyPriceLabel: string;
  readonly setupLabel: string;
  readonly stockLabel: string;
}

const scenarioOptions: readonly CompareOption[] = [
  { id: 'balanced', label: 'Balanced fit' },
  { id: 'budget', label: 'Lowest monthly price' },
  { id: 'capacity', label: 'Most available stock' },
  { id: 'fastest-setup', label: 'Fastest setup' },
];

export class ComparePageViewModel {
  private readonly dataSource = new ComparePageDataSource();

  billingTermId: BillingTermId = 'monthly';
  requiredAddonIds: readonly string[] = [];
  selectedProductIds: readonly string[] = this.products.slice(0, 4).map((product) => product.id);
  selectedRegionId = 'all';
  selectedScenarioId: CompareScenarioId = 'balanced';
  selectedSupportTier = 'all';
  stockOnly = true;

  constructor() {
    makeAutoObservable(this);
  }

  get products() {
    return this.dataSource.getProducts();
  }

  get addonOptions(): readonly CompareOption[] {
    return [...new Set(this.products.flatMap((product) => product.addons))]
      .sort((left, right) => left.localeCompare(right))
      .map((addon) => ({ id: addon, label: addon }));
  }

  get bestFitRows(): readonly CompareProductRow[] {
    return [...this.comparedProducts]
      .sort((left, right) => this.calculateFitScore(right) - this.calculateFitScore(left))
      .map((product) => ({
        bestRegionLabel: this.getBestRegionLabel(product),
        detailHref: `/catalog/${product.id}`,
        fitScore: this.calculateFitScore(product),
        id: product.id,
        label: product.name,
        monthlyPriceLabel: `$${this.getBillingTermPrice(product)}/mo`,
        setupLabel: `${this.getFastestSetup(product)}h setup`,
        stockLabel: `${this.getTotalStock(product)} units`,
      }));
  }

  get comparedProducts(): readonly CatalogProduct[] {
    return this.products
      .filter((product) => this.selectedProductIdSet.has(product.id))
      .filter((product) => this.matchesProduct(product));
  }

  get hasNoComparedProducts() {
    return this.comparedProducts.length === 0;
  }

  get highlights() {
    const monthlyPrices = this.comparedProducts.map((product) => this.getBillingTermPrice(product));
    const lowestMonthlyPrice = monthlyPrices.length > 0 ? Math.min(...monthlyPrices) : 0;

    return [
      {
        label: 'Plans compared',
        value: String(this.comparedProducts.length),
      },
      {
        label: 'Lowest monthly',
        value: `$${lowestMonthlyPrice}`,
      },
      {
        label: 'Regions covered',
        value: String(this.coveredRegionIds.size),
      },
      {
        label: 'Best fit score',
        value: String(this.recommendation ? this.calculateFitScore(this.recommendation) : 0),
      },
    ];
  }

  get metrics(): readonly CompareMetric[] {
    return [
      {
        id: 'price',
        label: this.billingTermId === 'yearly' ? 'Yearly effective price' : 'Monthly price',
        values: this.comparedProducts.map((product) => `$${this.getBillingTermPrice(product)}/mo`),
      },
      {
        id: 'yearly-savings',
        label: 'Yearly savings',
        values: this.comparedProducts.map((product) => `$${this.getYearlySavings(product)}/yr`),
      },
      {
        id: 'efficiency',
        label: 'Price efficiency',
        values: this.comparedProducts.map((product) =>
          String(calculatePriceEfficiencyScore(product)),
        ),
      },
      {
        id: 'cpu',
        label: 'CPU',
        values: this.comparedProducts.map((product) => `${product.hardware.cpuCores} cores`),
      },
      {
        id: 'memory',
        label: 'Memory',
        values: this.comparedProducts.map((product) => `${product.hardware.ramGb} GB`),
      },
      {
        id: 'storage',
        label: 'Storage',
        values: this.comparedProducts.map((product) => `${product.hardware.storageTb} TB`),
      },
      {
        id: 'network',
        label: 'Network',
        values: this.comparedProducts.map((product) => `${product.hardware.networkGbps} Gbps`),
      },
      {
        id: 'setup',
        label: 'Fastest setup',
        values: this.comparedProducts.map((product) => `${this.getFastestSetup(product)}h`),
      },
      {
        id: 'stock',
        label: 'Matching stock',
        values: this.comparedProducts.map((product) => String(this.getTotalStock(product))),
      },
      {
        id: 'support',
        label: 'Support tier',
        values: this.comparedProducts.map((product) => product.supportTier),
      },
    ];
  }

  get productOptions(): readonly CompareOption[] {
    return this.products.map((product) => ({
      id: product.id,
      label: product.name,
    }));
  }

  get queryRows() {
    return [
      { label: 'Region', value: this.selectedRegionLabel },
      { label: 'Availability', value: this.stockOnly ? 'in stock only' : 'all selected plans' },
      { label: 'Scenario', value: this.selectedScenarioLabel },
      {
        label: 'Support',
        value: this.selectedSupportTier === 'all' ? 'any tier' : this.selectedSupportTier,
      },
      {
        label: 'Add-ons',
        value: this.requiredAddonIds.length === 0 ? 'any add-on' : this.requiredAddonIds.join(', '),
      },
    ];
  }

  get quotePath() {
    const params = new URLSearchParams();

    if (this.recommendation) {
      params.set('plan', this.recommendation.id);
    }

    if (this.selectedRegionId !== 'all') {
      params.set('region', this.selectedRegionId);
    }

    params.set('term', this.billingTermId);

    const query = params.toString();

    return query.length > 0 ? `/quote?${query}` : '/quote';
  }

  get recommendation() {
    const [firstProduct, ...remainingProducts] = this.comparedProducts;

    if (!firstProduct) {
      return undefined;
    }

    return remainingProducts.reduce(
      (best, product) =>
        this.calculateFitScore(product) > this.calculateFitScore(best) ? product : best,
      firstProduct,
    );
  }

  get regionOptions(): readonly CompareOption[] {
    const regions = this.products.flatMap((product) => product.availabilityByRegion);
    const byId = new Map(regions.map((region) => [region.regionId, region.regionLabel]));

    return [
      { id: 'all', label: 'All regions' },
      ...[...byId.entries()]
        .sort((left, right) => left[1].localeCompare(right[1]))
        .map(([id, label]) => ({ id, label })),
    ];
  }

  get scenarioOptions() {
    return scenarioOptions;
  }

  get selectedRegionLabel() {
    return (
      this.regionOptions.find((region) => region.id === this.selectedRegionId)?.label ??
      'All regions'
    );
  }

  get selectedScenarioLabel() {
    return (
      this.scenarioOptions.find((scenario) => scenario.id === this.selectedScenarioId)?.label ??
      'Balanced fit'
    );
  }

  get supportTierOptions(): readonly CompareOption[] {
    return [
      { id: 'all', label: 'Any support tier' },
      ...[...new Set(this.products.map((product) => product.supportTier))]
        .sort((left, right) => left.localeCompare(right))
        .map((supportTier) => ({ id: supportTier, label: supportTier })),
    ];
  }

  isAddonRequired(addonId: string) {
    return this.requiredAddonIds.includes(addonId);
  }

  resetComparison() {
    this.billingTermId = 'monthly';
    this.requiredAddonIds = [];
    this.selectedProductIds = this.products.slice(0, 4).map((product) => product.id);
    this.selectedRegionId = 'all';
    this.selectedScenarioId = 'balanced';
    this.selectedSupportTier = 'all';
    this.stockOnly = true;
  }

  setBillingTerm(termId: BillingTermId) {
    this.billingTermId = termId;
  }

  setRegion(regionId: string) {
    this.selectedRegionId = this.regionOptions.some((region) => region.id === regionId)
      ? regionId
      : 'all';
  }

  setScenario(scenarioId: string) {
    this.selectedScenarioId = this.isScenarioId(scenarioId) ? scenarioId : 'balanced';
  }

  setStockOnly(value: boolean) {
    this.stockOnly = value;
  }

  setSupportTier(supportTier: string) {
    this.selectedSupportTier = this.supportTierOptions.some((option) => option.id === supportTier)
      ? supportTier
      : 'all';
  }

  toggleAddon(addonId: string) {
    this.requiredAddonIds = this.toggleValue(this.requiredAddonIds, addonId);
  }

  toggleProduct(productId: string) {
    if (this.selectedProductIds.includes(productId)) {
      this.selectedProductIds = this.selectedProductIds.filter((id) => id !== productId);
      return;
    }

    if (this.selectedProductIds.length >= 4) {
      this.selectedProductIds = [...this.selectedProductIds.slice(1), productId];
      return;
    }

    this.selectedProductIds = [...this.selectedProductIds, productId];
  }

  private calculateFitScore(product: CatalogProduct) {
    const stockScore = Math.min(this.getTotalStock(product), 120);
    const setupScore = Math.max(0, 48 - this.getFastestSetup(product)) * 2;
    const efficiencyScore = calculatePriceEfficiencyScore(product);
    const priceScore = Math.max(0, 500 - this.getBillingTermPrice(product)) / 5;

    if (this.selectedScenarioId === 'budget') {
      return Math.round(priceScore * 0.55 + efficiencyScore * 0.35 + stockScore * 0.1);
    }

    if (this.selectedScenarioId === 'capacity') {
      return Math.round(stockScore * 0.55 + efficiencyScore * 0.25 + setupScore * 0.2);
    }

    if (this.selectedScenarioId === 'fastest-setup') {
      return Math.round(setupScore * 0.5 + stockScore * 0.3 + efficiencyScore * 0.2);
    }

    return Math.round(
      efficiencyScore * 0.35 + stockScore * 0.3 + setupScore * 0.2 + priceScore * 0.15,
    );
  }

  private get coveredRegionIds(): ReadonlySet<string> {
    return new Set(
      this.comparedProducts.flatMap((product) =>
        this.getMatchingRegions(product).map((region) => region.regionId),
      ),
    );
  }

  private get selectedProductIdSet(): ReadonlySet<string> {
    return new Set(this.selectedProductIds);
  }

  private getBestRegionLabel(product: CatalogProduct) {
    const [firstRegion, ...remainingRegions] = this.getMatchingRegions(product);

    if (!firstRegion) {
      return 'No matching stock';
    }

    return remainingRegions.reduce(
      (best, region) => (region.stock > best.stock ? region : best),
      firstRegion,
    ).regionLabel;
  }

  private getBillingTermPrice(product: CatalogProduct) {
    return this.billingTermId === 'yearly'
      ? product.pricing.yearlyMonthlyUsd
      : product.pricing.monthlyUsd;
  }

  private getFastestSetup(product: CatalogProduct) {
    return getFastestSetupHours(
      this.getMatchingRegions(product).map((region) => region.setupHours),
    );
  }

  private getMatchingRegions(product: CatalogProduct): readonly CatalogRegionAvailability[] {
    return product.availabilityByRegion.filter((region) => {
      const matchesRegion =
        this.selectedRegionId === 'all' || region.regionId === this.selectedRegionId;
      const matchesStock = !this.stockOnly || region.stock > 0;

      return matchesRegion && matchesStock;
    });
  }

  private getTotalStock(product: CatalogProduct) {
    return this.getMatchingRegions(product).reduce((total, region) => total + region.stock, 0);
  }

  private getYearlySavings(product: CatalogProduct) {
    return (product.pricing.monthlyUsd - product.pricing.yearlyMonthlyUsd) * 12;
  }

  private isScenarioId(value: string): value is CompareScenarioId {
    return scenarioOptions.some((option) => option.id === value);
  }

  private matchesProduct(product: CatalogProduct) {
    const matchesRegion = this.getMatchingRegions(product).length > 0;
    const matchesSupport =
      this.selectedSupportTier === 'all' || product.supportTier === this.selectedSupportTier;
    const matchesAddons = this.requiredAddonIds.every((addon) => product.addons.includes(addon));

    return matchesRegion && matchesSupport && matchesAddons;
  }

  private toggleValue(values: readonly string[], value: string) {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }
}
